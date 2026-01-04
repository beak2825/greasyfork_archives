// ==UserScript==
// @name           Cart - Flip
// @namespace      scriptomatika
// @author         mouse-karaganda
// @description    Опции для корзины
// @license        MIT
// @include        https://*flip.kz/cart*
// @include        https://light.mail.ru/message/*
// @require        https://greasyfork.org/scripts/379902-include-tools/code/Include%20Tools.js
// @version        1.8
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/471772/Cart%20-%20Flip.user.js
// @updateURL https://update.greasyfork.org/scripts/471772/Cart%20-%20Flip.meta.js
// ==/UserScript==

(function() {
    const $ = window.jQuery;
    const $$ = window.__krokodil;

    class WhereIs {
        static get inFlipKz() {
            return /flip\.kz\//.test(location.href);
        }
        static get inMailRu() {
            return /mail\.ru\//.test(location.href);
        }
    }

    let runInFlipKz = function() {
        if (!WhereIs.inFlipKz) {
            return;
        }

        $$.renderStyle(
            '.unavailable_frame { position: fixed; bottom: 0; right: 0; padding: 5px 0 5px 5px; border-radius: 10px 0 0 0; background-color: rgba(10, 121, 213, 0.9); }',
            '.product_frame { display: inline-block; }',
            '.product_frame > div { display: inline-block; }',
            '.product_frame img { width: 32px; border-radius: 5px; }',
            '.product_position { margin-left: 10px; color: white; font-size: 12px; }'
        );

        let cartList;

        let unavailableFrame = $('<div class="unavailable_frame" />').appendTo(document.body);
        let innerDiv = $('<div />').appendTo(unavailableFrame);

        $('<a class="nbtn gray small m-r-10" />').appendTo(innerDiv).text('К недоступному')
            .on('click', function(event) {
                let listExists = (cartList && cartList.length > 0);
                let viewRow = (listExists) ? cartList[0].row : $('#module-cart .row').last();
                //viewRow.get(0).scrollIntoView();
                $('body, html').stop().animate({ scrollTop: viewRow.offset().top }, 300);
            });

        $('<a class="nbtn gray small m-r-10" />').appendTo(innerDiv).text('Открыть 3')
            .on('click', function(event) {
                let period = 500;
                setTimeout(function() {
                    window.open('', 'manual_postpone0', 'width=450,height=300,left=0,top=0');
                }, 1);
                setTimeout(function() {
                    window.open('', 'manual_postpone1', 'width=450,height=300,left=455,top=0');
                }, period);
                setTimeout(function() {
                    window.open('', 'manual_postpone2', 'width=450,height=300,left=910,top=0');
                }, period * 2);
            });

        let position = {
            auto: {
                timer: 0,
                index: 0,
                length: 0
            },
            cart: {
                index: 0,
                length: 0
            },
            postponed: {
                page: 0,
                length: 0
            }
        };

        let autoClickInCart = function() {
            if (position.auto.index >= position.auto.length) {
                clearInterval(position.auto.timer);
                return;
            }
            $('.postpone_frame .nbtn', cartList[position.auto.index].row).get(0).click();
            position.auto.index++;

            // Предложим продолжить или прервать
            if ((position.auto.index < position.auto.length) && (position.auto.index % 3 == 0)) {
                if (confirm(`Открыто ${position.auto.index} / ${position.auto.length}.\nПрервать?`)) {
                    clearInterval(position.auto.timer);
                }
            }
        };

        $('<a class="nbtn gray small m-r-10" />').appendTo(innerDiv).text('Перекликать')
            .on('click', function(event) {
                let listExists = (cartList && cartList.length > 0);
                if (!listExists) {
                    return;
                }
                position.auto.length = cartList.length;
                position.auto.index = 0;
                position.auto.timer = setInterval(autoClickInCart, 500);
            });

        let productFrame = {
            clear: function() {
                this.outer.empty();
                this.outer.removeAttr('title');
                this.outer.addClass('m-r-10');
            },
            createAgain: function() {
                this.clear();

                let div = $('<div />').appendTo(productFrame.outer);
                this.img = $('<img />').appendTo(div);

                div = $('<div class="product_position" />').appendTo(productFrame.outer);
                this.name = $('<div />').appendTo(div);
                this.cartIndex = $('<div />').appendTo(div);
                this.postponedPage = $('<div />').appendTo(div);
            },
            setImg: function(product) {
                this.img.attr({
                    src: product.img,
                    alt: product.id
                });
            },
            setName: function(product) {
                this.name.text(product.name.substring(0, 5) + '…');
                this.outer.attr('title', product.name);
            },
            setCartIndex: function() {
                this.cartIndex.text(`товар ${position.cart.index + 1} / ${position.cart.length}`);
            },
            setPostponedPage: function() {
                this.postponedPage.text(`стр ${position.postponed.page + 1} / ${position.postponed.length}`);
            }
        };

        let postponedList = [];

        let findInPostponedList = function(productId) {
            let postponedPage = 0;
        };

        let currentIndex, maxIndex;
        let currentPage, maxPage;

        let requestPostponedItem = function() {

            let product = cartList[position.cart.index].product;

            productFrame.createAgain();
            productFrame.setImg(product);
            productFrame.setName(product);
            productFrame.setCartIndex();
            productFrame.setPostponedPage();
            return;

            currentIndex++;
            if (currentIndex >= maxIndex)
                return;

            $.get('/user?personalis=coming&page=' + currentPage, function(data) {
                let rowList = $('.table.goods .row', data);
                console.log('AJAX rowList == ', rowList);
            });
        };

        $('<a class="nbtn gray small m-r-10" />').appendTo(innerDiv).text('Проверить')
            .on('click', function(event) {
                let listExists = (cartList && cartList.length > 0);
                if (!listExists) {
                    alert('Недоступного нет');
                    return;
                }
                position.cart.length = cartList.length;
                position.cart.index = 0;

                // Получить список ожидаемых постранично до тех пор, пока не найдем нужный товар
                requestPostponedItem();
            });

        productFrame.outer = $('<div class="product_frame" />').appendTo(innerDiv);

        class ProductRow {
            constructor(rowElem) {
                this.row = $(rowElem);
                if (this.isCartPage) {
                    this.delivery = $('label + div + div', rowElem);
                }
            }
            get isCartPage() {
                return /\/cart\b/.test(location.href);
            }
            get isUnavailable() {
                if (this.delivery) {
                    return this.delivery.text().includes('Недоступен для заказа');
                }
                return false;
            }
            get product() {
                if (!this._product) {
                    let catalogElem = $('a[href^="/catalog?prod="]', this.row);
                    this._product = {
                        id: catalogElem.attr('href').match(/prod=(\d+)/)[1],
                        img: catalogElem.children('img').attr('src'),
                        name: catalogElem.text()
                    };
                }
                return this._product;
            }
            addPostponeFrame(winIndex) {
                this.row.addClass('add_postpone_row');

                let div = $('<div class="postpone_frame" />').appendTo(this.delivery);

                let btnDoPostpone = $('<a class="nbtn gray small" />').appendTo(div).text('Отложить')
                    .attr({
                        target: 'manual_postpone' + winIndex,
                        href: '/subscribe?type=preorder&action=add&id=' + this.product.id
                    })
                    .on('click', function(event) {
                        setTimeout(function() {
                            $('<span />').text(' ✅ ').insertAfter(btnDoPostpone);
                        }, 500);
                    });
            }
        }

        cartList = $('#module-cart .table.goods:first-child .row')
            .filter(function(index) {
                let prow = new ProductRow(this);
                return prow.isUnavailable;
            })
            .map(function(index) {
                let prow = new ProductRow(this);
                prow.addPostponeFrame(index % 3);
                return prow;
            })
            .get();
        console.log('cartList [%o] == ', cartList.length);
    };

    let runInMailRu = function() {
        if (!WhereIs.inMailRu) {
            return;
        }
    };

    runInFlipKz();
    runInMailRu();

    console.log('Cart - Flip 💬 1.8');
})();
