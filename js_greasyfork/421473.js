// ==UserScript==
// @name         Onlinetrade Product Search
// @name:ru      Onlinetrade Поиск товаров
// @namespace    https://github.com/AlekPet/Onlinetrade-Product-Search
// @version      0.3.3
// @description  Onlinetrade - Product search on other sites
// @description:ru Onlinetrade - Поиск товара на других сайтах
// @copyright    2021, AlekPet
// @author       AlekPet
// @license      MIT; https://raw.githubusercontent.com/AlekPet/Onlinetrade-Product-Search/master/LICENSE
// @icon       data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0NDYwLCAyMDIwLzA1LzEyLTE2OjA0OjE3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMiAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTAyLTA5VDA5OjU2OjE3KzAzOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIxLTAyLTA5VDA5OjU2OjE3KzAzOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wMi0wOVQwOTo1NjoxNyswMzowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphMTcwZTVhYi1mMTVlLTg2NDYtOWJkZi04MThmNTUwMjVkMmEiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpjN2IxYmEwOC1iMmU2LTAzNDAtYWJkZS1mY2EwYmI1MGEyMDIiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmNmNiNGI1NC05NTc2LWRiNDAtODVmNi1hNTg0NDM4YjI0YzgiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmY2Y2I0YjU0LTk1NzYtZGI0MC04NWY2LWE1ODQ0MzhiMjRjOCIgc3RFdnQ6d2hlbj0iMjAyMS0wMi0wOVQwOTo1NjoxNyswMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphMTcwZTVhYi1mMTVlLTg2NDYtOWJkZi04MThmNTUwMjVkMmEiIHN0RXZ0OndoZW49IjIwMjEtMDItMDlUMDk6NTY6MTcrMDM6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4yIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5+sHWnAAAUzklEQVRo3s1ZB3Rc5ZW+r0/RFI1mRqNqWZJluRsXLDdEYrCBBJwlOEtJgJQDi2PibBJylrSz2c0m2YWTTV0O5SSbhd1sNqEFAiEYY0xwwR3bkiVZVrPaSNPre/PKfv+TbGwIQWSTs3lw/c88vfLde7/b/uG2bdtGf+zBcRxZlkWGYZCu6+fXaVmhqurGTCZzRS6Xi2ia1grhcI6YlEoltpo4N8Tz/DHIq/j8dLFY7GHPvPDYsGEDffCDHyQ8h0zTvOhvIv2JD0EQNgPEFyYnJ9cx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
// @match        *://www.onlinetrade.ru/*
// @connect www.onlinetrade.ru
// @run-at document-end
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_addStyle
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/421473/Onlinetrade%20Product%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/421473/Onlinetrade%20Product%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
.services_search_item_name {
    border: 1px solid silver;
    padding: 5px;
    background: #ffffffd1;
    box-shadow: 2px 2px 8px #77d2d299;
    transform: translate(-50%,0);
    transition: all .5s;
    font-size: 0.7em;
    width: 200px;
    color:#2b52e2;
    font-weight: bold;
}
.menu_cat{
    overflow-y: auto;
    max-height: 350px;
}
.menu_cat > li {
    list-style: none;
    margin-bottom: 2px;
    background: linear-gradient(45deg, #77d2d299, transparent);
    border-radius: 0 8px 8px 0;
    padding: 5px;
    word-break: break-all;
}
.menu_cat > li:hover {
    transition: all .5s;
    background: linear-gradient(45deg, #9bffff99, transparent);
    font-size: 1.1em;
}
.menu_cat > li:first-child a{
    color:#f76f6f;
}
.menu_cat_list{
   margin-left: 0;
   display: inline-block;
   margin-top: 0.8%;
}
ul.services_list li {
    display: inline-block;
    padding: 2px;
    margin-bottom: 4px;
    font-size: 8px;
    cursor: pointer;
    user-select:none;
}
li.service_active{
    background: #c2fb8fbf;
    border-left: 5px solid #09ff00;
}
.search_goods_button {
    margin-right: 8px;
}
.search_goods_button:before {
    background-position: -96px 0px;
}
.box_items {
    top: 20px;
    position: absolute;
    z-index: 14;
}
.menu_cat::-webkit-scrollbar {
    width: 10px;
}
.menu_cat::-webkit-scrollbar-button {
}
.menu_cat::-webkit-scrollbar-thumb {
    background: #ff8100;
    border-radius: 10px;
    box-shadow: 0 0 6px rgba(0,0,0,0.3);
}

.menu_cat::-webkit-scrollbar-track-piece {
    background: #d7d7d7;
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
}
`)

    const $ = window.jQuery,
          debug = true

    var services = {
        'E-Katalog':{
            s:'https://www.e-katalog.ru/ek-list.php?search_='
        },
        'YAMarket':{
            s:'https://market.yandex.ru/search?text='
        },
        'OZON':{
            s:'https://www.ozon.ru/search/?from_global=true&text='
        },
        'Citilink':{
            s:'https://www.citilink.ru/search/?text='
        },
        'Onlinetrade':{
            s:'https://www.onlinetrade.ru/sitesearch.html?query='
        },
        'Dns-shop':{
            s:'https://www.dns-shop.ru/search/?q='
        }
    }

    // Functions
    function log(text, ...other){
        if(debug){
            let tip = other[0] in Object.keys(console)? other[0]: 'log'
            console[tip](text, ...other)
        }
    }
    // end - Functions

    function getListGoods(){
        let self = this,
            list = $(".indexGoods__item"),//.not(".swiper-slide")
            past = $(".catalog__displayedItem__marksLine > .floatLeft")

        this.currentService = Object.keys(services)[0]

        if (past.length && /\.html.*$/i.test(location.href)){
            log("Модуль поиска, активирован для отдного товара...")
            let name = $(".productPage__card > .name").text() || $(".productPage__card").children().eq(0).text(),
                button = $("<a class='ic__hasSet search_goods_button'><span class='box_items'></span></a>").css({'margin-left': '8px', height: '24px', 'margin-right': 0}), //$("<div>Goods Find</div>").css({"font": "bold 1em monospace","margin-left": "50px",'color': '#0053b9','float': 'right','cursor':'pointer'})
                pastEl = button.find('.box_items')

            button.mouseenter(function(e){
                self.make_menu(pastEl, name)
            })

            button.mouseleave(function(e){
                self.del_menu(pastEl)
            })
            past.append(button)

        }

        if(list.length){
            log("Модуль поиска, активирован для товаров...")
            list.each(function(indx, el){
                if ($(el).find(".search_goods_button").length>0) return

                const name = $(el).find(".indexGoods__item__name").text(),
                      button = $("<a class='ic__hasSet search_goods_button'><span class='box_items'></span></a>"),
                      pastEl = button.find('.box_items'),
                      managerTop = $(el).find(".indexGoods__item__manageTop")

                button.mouseenter(function(e){
                    self.make_menu(pastEl, name)
                })

                button.mouseleave(function(e){
                    self.del_menu(pastEl)
                })

                if(managerTop.length){
                    managerTop.children().first().before(button)

                } else {
                    button.css({left: '50%', top: '-5%', display: 'block', 'z-index': '15','text-align':'left'})
                    $(el).append(button)
                }

            })


            // Reviews
            let sort = $('<div>').css('float', 'right').html(`<select id='sorted_reviews'>
            <option value="none">Без сортировки</option>
            <option value="dup">Дата по возр.</option>
            <option value="dud">Дата по убыв.</option>
            <option value="sup">Рейтинг по возр.</option>
            <option value="sd">Рейтинг по убыв.</option>
            </select>`), select = null

            $('#tabs_feedbacks h3:eq(0)').append(sort)
            select = $('#sorted_reviews')

            sort.change(()=>{
                const select_val = select.val()
                if(select_val == 'none') return

                let ritems = $('.reviewlist__item[itemprop]'),
                    arr_feed = [],
                    parent = ritems.parent().eq(0)

                ritems.each((idx,item)=>{
                    const $item = $(item)

                    if($item.hasClass('noDisplay')) $item.removeClass('noDisplay')

                    let feedback = $item.find('.feedbacksHeader_info')

                    if(feedback.length){
                        let stars, opit, date
                        if(feedback.length === 3) [stars, opit, date] = [...feedback.get()]
                        if(feedback.length === 2) [stars, date] = [...feedback.get()]

                        stars = stars.children[0].title.includes('Оценка') ? +stars.children[0].title.match(/(\d+)/g) : 0

                        let [_date, _time] = [...date.children[1].textContent.split(' ')]
                        _date = _date.slice(0,10).split('.').reverse().join('-')

                        _date = new Date(_date+' '+_time+':00')

                        arr_feed.push({el:$item, stars: stars, date: _date})

                    }
                })

                if(select_val == 'dup' || select_val == 'dud'){
                    arr_feed.sort(function(a,b) {
                        var an = a.date,
                            bn = b.date
                        return an - bn;
                    });

                    if(select_val == 'dud') arr_feed.reverse()

                }


                if(select_val == 'sup' || select_val == 'sd'){
                    arr_feed.sort(function(a,b) {
                        var an = a.stars,
                            bn = b.stars
                        return an - bn;
                    });

                    if(select_val == 'sd') arr_feed.reverse()

                }

                for(let i of arr_feed){
                    let el = i.el
                    el.detach().appendTo(parent)
                }
            })

        }
    }

    getListGoods.prototype.del_menu = function(el_past){
        $(el_past).find(".services_search_item_name").remove()
        //let c = $(el_past).find('.menu_cat').get(0)
        //if(c) el_past.removeChild(c)
    }

    getListGoods.prototype.selectService = function(el, menu, params){
        this.prevService.removeClass('service_active')
        this.prevService = el

        el.addClass('service_active')

        this.menu_update(menu, this.split_links(params.name))
    }

    getListGoods.prototype.menu_update = function(menu, params){
        menu.empty()

        $(params.items).each(function(indx,el){
            let li = $("<li></li>"),
                a = $("<a></a>").attr({"href":el.href,"target":"_blank", "title":el.title}).text(el.name)

            li.append(a)
            menu.append(li)
        })
    }

    getListGoods.prototype.make_menu = function(el_past, name){
        const self = this

        this.prevService = null

        let services_search_item_name = $("<div class='services_search_item_name'></div>"),
            div_items = $("<div class='services_search'></div>"),
            ul = $("<ul class='services_list'></ul>"),
            menu = $("<ul class='menu_cat'></ul>"),
            params = self.split_links(name)

        if (el_past.parentNode && el_past.parentNode.className.indexOf('floatLeft')!=-1) services_search_item_name.addClass("menu_cat_list")

        for(let s in services){
            const service = services[s]

            let li=$(`<li></li>`).attr('title', s).text(s).click(function(){
                self.currentService = s
                self.selectService(li, menu, params)
            })

            if(s == this.currentService && !li.hasClass('service_active')){
                this.prevService = li
                li.addClass('service_active')
            }

            ul.append(li)
        }
        div_items.append(ul)

        self.menu_update(menu, params)

        services_search_item_name.append(div_items,menu)

        $(el_past).append(services_search_item_name)
    }

    getListGoods.prototype.srez = function(text, s=0, e=30){
        return text.length>e?text.slice(s,e)+"...":text
    }

    getListGoods.prototype.split_links = function(name){

        let alllinksOrig = name.split(" "),
            alllinks = [...alllinksOrig],
            params = {name:name, items:[]}

        while(alllinks.length){
            let curPop = alllinks.join(' ')
            if(/(^\d{1}$)|\.{3}/i.test(curPop)) continue
            curPop = curPop.trim().replace(/,$/ig,'')
            params.items.push({'href':services[this.currentService].s+encodeURI(curPop),'name':this.srez(curPop,0, 200), 'title':curPop})
            curPop = alllinks.pop()
        }

        let advVariants = alllinksOrig.map((item)=>({'href':services[this.currentService].s+encodeURI(item),'name':this.srez(item,0, 200), 'title':item})).filter((cv)=>{
            for(let x of params.items) if(x.name == cv.name) return false
            return true
        })
        params.items = [...params.items,...advVariants]

        return params
    }

    new getListGoods()
})();
