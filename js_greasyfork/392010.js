// ==UserScript==
// @name         CS Portal quick search
// @namespace    http://cs.nctu.edu.tw/
// @version      0.3
// @description  try to take over the world!
// @author       Tzu-Te Kuo <tzute@cs.nctu.edu.tw>
// @match        https://oauth.cs.nctu.edu.tw/portal
// @grant        none
// @require      https://cdn.jsdelivr.net/combine/npm/lodash@4.17.15,npm/fuzzaldrin-plus@0.6.0/dist-browser/fuzzaldrin-plus.min.js
// @downloadURL https://update.greasyfork.org/scripts/392010/CS%20Portal%20quick%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/392010/CS%20Portal%20quick%20search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const portal = document.getElementById('main');
    const services = Array.from(portal.getElementsByClassName('card'))
        .filter((card) => (!card.getAttribute('data-target')))
        .map((link) => ({
            $el: link,
            link: link.getAttribute('href'),
            name: link.getElementsByClassName('card-title')[0].innerText,
            description: link.getElementsByClassName('card-text')[0].innerText,
            icon: link.getElementsByTagName('img')[0].getAttribute('src'),
        }))
    ;
    const modals = Array.from(document.getElementsByClassName('modal'));

    const el = document.createElement('div');
    document.body.appendChild(el);

    const Inputbox = {
        model: {
            prop: 'terms',
            event: 'change',
        },
        props: {
            terms: String,
        },
        methods: {
            focus: function () {
                this.$nextTick(() => this.$refs.input.focus());
            },
        },
        render: function (h) {
            return h('input', {
                ref: 'input',
                class: {
                    'form-control': true,
                    'form-control-lg': true,
                    'bg-dark': true,
                    'text-white': true,
                    'card-header': true,
                },
                style: {
                    backgroundColor: '#212529!important',
                    border: 0,
                },
                domProps: {
                    value: this.terms,
                    placeholder: 'Search...',
                },
                on: {
                    input: ($event) => {
                        if ($event.target.composing) { return; }

                        this.$emit('change', $event.target.value);
                    },
                    keyup: ($event) => {
                        if ($event.key === 'Enter') {
                            this.$emit('done');
                        }
                    },
                },
            });
        },
    };

    const ServiceList = {
        props: {
            services: Array,
            selected: Number,
        },
        render: function (h) {
            return h('div', {
                class: {
                    'list-group list-group-flush': true,
                },
            }, [
                this.services
                    .map((service, idx) => (h('a', {
                        key: idx,
                        class: {
                            'list-group-item list-group-item-action': true,
                            'text-white bg-dark text-decoration-none': true,
                        },
                        style: {
                            backgroundColor: idx === this.selected ? '#1d2124!important' : null,
                        },
                        domProps: {
                            href: service.link,
                            target: '_blank',
                        },
                    }, [
                        service.name,
                        h('span', { class: { 'text-white-50': true, 'mx-3': true } }, [ service.description ]),
                        h('span', {
                            class: {
                                'text-hide': true,
                                'd-inline-block': true,
                            },
                            style: {
                                backgroundImage: 'url(' + service.icon + ')',
                                backgroundSize: 'contain',
                                float: 'right',
                                width: '32px',
                                height: '32px',
                                margin: '-4px 0 -6px 0',
                            },
                        })
                    ])))
            ]);
        },
    };

    const Searchbox = {
        components: {
            Inputbox: Inputbox,
            ServiceList: ServiceList,
        },
        props: {
            services: Array,
        },
        data: function () {
            return {
                terms: '',
                shown: false,
                selected: 0,
            };
        },
        watch: {
            terms: function (newVal, oldVal) {
                this.selected = 0;
            },
            shown: function (newVal, oldVal) {
                if (newVal) {
                    this.terms = '';
                    this.$refs.input.focus();
                }
            },
        },
        mounted: function () {
            window.addEventListener('keydown', this.keyboardListener);
        },
        beforeDestroy: function () {
            window.removeEventListener('keydown', this.keyboardListener);
        },
        methods: {
            keyboardListener: function ($event) {
                if ($event.ctrlKey || $event.altKey || $event.metaKey) { return; }
                const key = $event.key || 'undefined';
                if (this.shown) {
                    if (key == 'Escape') {
                        this.shown = false;
                    } else if (($event.shiftKey && key == 'Tab') || key === 'ArrowUp') {
                        if (this.queryResult.length > 0) {
                            this.selected = (this.selected + this.queryResult.length - 1) % this.queryResult.length;
                        }
                        $event.preventDefault();
                    } else if (key == 'Tab' || key === 'ArrowDown') {
                        if (this.queryResult.length > 0) {
                            this.selected = (this.selected + 1) % this.queryResult.length;
                        }
                        $event.preventDefault();
                    }

                    return;
                }
                if (key.length > 1) { return; }
                if (modals.find((modal) => modal.classList.contains('show'))) { return; }

                this.shown = true;
            },
            finishSearch: function () {
                if (this.queryResult.length === 0) { return; }

                const service = this.queryResult[this.selected];
                window.open(service.link, '_blank');
                this.shown = false;
            },
        },
        computed: {
            queryResult: function () {
                if (!this.terms) { return this.services.slice(0, 6); }

                const preparedQuery = fuzzaldrin.prepareQuery(this.terms);

                return this.services
                    .map((service, idx) => {
                        const scorableFields = [
                            service.name,
                            service.description,
                        ].map(toScore => fuzzaldrin.score(toScore, this.terms, { preparedQuery }));

                        return {
                            ...service,
                            score: Math.max(...scorableFields)
                        };
                    })
                    .filter(({score}) => score > 1)
                    .sort(({lScore}, {rScore}) => rScore - lScore)
                    .slice(0, 6)
                ;
            },
        },
        render: function (h) {
            return h('div', {
                class: {
                    'd-none': !this.shown,
                },
                style: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    zIndex: 9999,
                    background: 'rgba(0, 0, 0, 0.4)',
                },
            }, [
                h('div', {
                    style: {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        pointerEvents: 'auto',
                        background: 'rgba(0, 0, 0, 0)',
                        cursor: 'pointer',
                    },
                    on: {
                        click: () => (this.shown = false),
                    },
                }),
                h('div', {
                    class: {
                        'd-flex': true,
                        'flex-column': true,
                        'justify-content-center': true,
                        'align-items-center': true,
                        'my-5': true,
                    },
                    style: {
                        marginTop: '30vh!important',
                    },
                }, [
                    h('div', {
                        class: {
                            'container': true,
                            'p-0 m-0': true,
                            card: true,
                            'text-white bg-dark': true
                        },
                    }, [
                        h('Inputbox', {
                            ref: 'input',
                            props: {
                                terms: this.terms,
                            },
                            on: {
                                change: _.debounce((val) => (this.terms = val), 100),
                                done: this.finishSearch,
                            },
                        }),
                        h('ServiceList', {
                            props: {
                                services: this.queryResult,
                                selected: this.selected,
                            },
                        }),
                    ])
                ])
            ]);
        },
    };

    const $app = new Vue({
        el: el,
        data: function () {
            return {
                services: services,
            };
        },
        components: {
            Searchbox: Searchbox,
        },
        render: function (h) {
            return h(
                'Searchbox',
                {
                    props: {
                        services: this.services,
                    },
                }
            );
        },
    });
})();