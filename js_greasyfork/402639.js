// ==UserScript==
// @name        Templates in Roam
// @namespace   https://eriknewhard.com/
// @description Add template button to Roam to easily insert custom templates
// @author      everruler
// @version     0.6
// @match       https://roamresearch.com/#/app/*
// @grant       none
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.0/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @downloadURL https://update.greasyfork.org/scripts/402639/Templates%20in%20Roam.user.js
// @updateURL https://update.greasyfork.org/scripts/402639/Templates%20in%20Roam.meta.js
// ==/UserScript==

// Wait for Roam to load before initializing
var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        var newNodes = mutation.addedNodes // DOM NodeList
        if (newNodes !== null) { // If there are new nodes added
            $(newNodes).each(function () {
                if ($(this).hasClass('roam-body')) { // body has loaded
                    console.log('Roam Templates: Observer finished.')
                    observer.disconnect()
                    init()
                }
            })
        }
    })
})

var target = $('#app')[0]

var config = {
    attributes: true,
    childList: true,
    characterData: true
}

observer.observe(target, config)
console.log('Roam Templates: Observer running...')



// NOTES
// Blueprint icons: https://blueprintjs.com/docs/#icons



function init() {
    const searchBar = $('.rm-find-or-create-wrapper').eq(0)
    const divider = $('<div style="flex: 0 0 4px"></div>')

    let templating_button = $(`
    <span id="RT-vm-button" class="bp3-popover-wrapper">
        <span class="bp3-popover-target" style="margin-left: 12px">
            <button id="RT-templateButton" class="bp3-button bp3-minimal bp3-icon-add-to-artifact bp3-small" tabindex="0" @click="click" @mouseover="hoverIn" @mouseleave="hoverOut"></button>
        </span>
    </span>`)

    let popover = $(`
    <div id="RT-popover" class="bp3-transition-container" style="position: absolute; top: 47px; transform: translateX(-50%);" :style="{left: leftPos+'px'}"  v-show="show_popover && !show_panel">
        <div class="bp3-popover bp3-tooltip" style="transform-origin: 62px top;">
            <div class="bp3-popover-arrow" style="top: -8px; left: 50%; transform: translateX(-50%);">
                <svg viewBox="0 0 30 30" style="transform: rotate(90deg);">
                    <path class="bp3-popover-arrow-border" d="M8.11 6.302c1.015-.936 1.887-2.922 1.887-4.297v26c0-1.378-.868-3.357-1.888-4.297L.925 17.09c-1.237-1.14-1.233-3.034 0-4.17L8.11 6.302z"></path>
                    <path class="bp3-popover-arrow-fill" d="M8.787 7.036c1.22-1.125 2.21-3.376 2.21-5.03V0v30-2.005c0-1.654-.983-3.9-2.21-5.03l-7.183-6.616c-.81-.746-.802-1.96 0-2.7l7.183-6.614z"></path>
                </svg>
            </div>
                <div class="bp3-popover-content">{{popover_label}}</div>
        </div>
    </div>`)

    let panel = $(`
    <div class="bp3-overlay bp3-overlay-open roam-lift" v-show="show_panel">
        <div id="RT-panelContainer" class="bp3-transition-container bp3-popover-enter-done" style="position: absolute; top: 50px; right: 5px; min-width: 200px;">
            <div class="bp3-popover" style="transform-origin: 121px top; right: 5px;">
                <div id="RT-panelArrow" class="bp3-popover-arrow" style="top: -11px; transform: translateX(-50%);" :style="{right: rightPos+'px'}">
                    <svg viewBox="0 0 30 30" style="transform: rotate(90deg);">
                        <path class="bp3-popover-arrow-border" d="M8.11 6.302c1.015-.936 1.887-2.922 1.887-4.297v26c0-1.378-.868-3.357-1.888-4.297L.925 17.09c-1.237-1.14-1.233-3.034 0-4.17L8.11 6.302z"></path>
                        <path class="bp3-popover-arrow-fill" d="M8.787 7.036c1.22-1.125 2.21-3.376 2.21-5.03V0v30-2.005c0-1.654-.983-3.9-2.21-5.03l-7.183-6.616c-.81-.746-.802-1.96 0-2.7l7.183-6.614z"></path>
                    </svg>
                </div>
                <div class="bp3-popover-content">
                    <ul class="bp3-menu">
                        <h1 class="rm-level3" style="text-align:center">TEMPLATES</h1>
                        <li v-for="template in templates">
                            <span class="bp3-menu-item bp3-popover-dismiss" @click="copy(template)">
                                <div class="bp3-text-overflow-ellipsis bp3-fill">{{template.name}}</div>
                                <a @click.stop.prevent="edit(template)">Edit</a>
                            </span>
                        </li>
                        <div style="margin-top: 1em;">
                            <span class="bp3-button bp3-icon-import" @click="upload">Import</span>
                            <span class="bp3-button bp3-icon-floppy-disk" @click="download">Export</span>
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    </div>`)

    templating_button.append(popover)
    templating_button.append(panel)
    templating_button.after(divider)
    searchBar.after(templating_button)


    vm_button = new Vue({
        el: '#RT-vm-button',
        data: {
            popover_label: 'Templates',
            show_popover: false,
            show_panel: false,
            leftPos: 0,
            rightPos: 0,
            templates: [],
            transforms: []
        },
        computed: {
            popover_display() {
                return this.show_popover ? "inline" : "none"
            }
        },
        methods: {
            click() {
                this.show_panel = !this.show_panel
                this.hoverOut()
                Vue.nextTick().then(this.updateRightPos)
            },
            hoverIn() {
                this.updateLeftPos()
                this.show_popover = true
            },
            hoverOut() {
                this.show_popover = false
            },
            updateLeftPos() {
                const button = $('#RT-templateButton')
                this.leftPos = button.position().left + button.width() / 2
            },
            updateRightPos() {
                const button = $('#RT-templateButton')
                const panel = $('#RT-panelContainer > div')
                this.rightPos = this.positionRight(button) - button.width() / 2 - this.positionRight(panel) - 5
            },
            positionRight($el) {
                return $(document).width() - ($el.offset().left + $el.outerWidth())
            },
            copy(template) {
                // transform template text
                var text_to_copy = this.transforms.reduce((acc, transform) => {
                    var re = new RegExp(transform.syntax, "g")
                    return acc.replace(re, transform.fn())
                }, template.text)

                // create hidden textarea to copy text
                var targetId = "RT-_hiddenCopyText_"
                var target = document.createElement("textarea")
                target.style.position = "absolute"
                target.style.left = "-9999px"
                target.style.top = "0"
                target.id = targetId
                document.body.appendChild(target)

                target.textContent = text_to_copy

                // select the content
                var currentFocus = document.activeElement
                target.focus()
                target.setSelectionRange(0, target.value.length)

                // copy the selection
                try {
                    document.execCommand("copy")
                    $('#RT-_hiddenCopyText_').remove()
                } catch (e) {
                    console.log("Roam Template: Copy failed.")
                }

                // restore original focus
                if (currentFocus && typeof currentFocus.focus === "function") {
                    currentFocus.focus()
                }

                // close panel
                setTimeout(() => {
                    // try opacity
                    this.show_panel = false
                    // popup 'Copied!'
                }, 100)
            },
            edit(template) {
                alert(template.text)
            },
            upload() {
                alert('Upload clicked')
            },
            download() {
                alert('Download clicked')
            }
        },
        mounted() {
            // allow edit, import, and export to with simple json to localStorage
            // load localStorage || default template
            this.templates = localStorage.RT_templates || [{
                "name": "Book",
                "text": "Author:: \nStatus:: \nRecommended by:: \n### Notes\n\t→"
            }, {
                "name": "Morning Pages",
                "text": "#[[Morning Pages]] {{current time}} {{word-count}}\n\t→"
            }]

            this.transforms = localStorage.RT_transforms || [{
                syntax: "{{current time}}",
                fn() {
                    return moment().format('HH:mm')
                }
            }, {
                syntax: "{{today}}",
                fn() {
                    return `[[${moment().format('MMMM Do, YYYY')}]]`
                }
            }]



            this.updateLeftPos()
            this.updateRightPos()
        }
    })
}
