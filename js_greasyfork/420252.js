// ==UserScript==
// @name            Mail.ru Filter News
// @name:ru         Mail.ru Фильтр новостей
// @namespace       https://github.com/AlekPet/
// @version         0.1.2.7.1
// @description     Highlight, user styles and hide news
// @description:ru  Подсветка, пользовательские стили и скрытие новостей
// @author          AlekPet 2021
// @license         MIT; https://raw.githubusercontent.com/AlekPet/Mail.ru-Filter-News/master/LICENSE
// @icon         data:image/svg+xml,%3Csvg viewBox%3D%220 0 95 32%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 xmlns%3Aserif%3D%22http%3A%2F%2Fwww.serif.com%2F%22 fill-rule%3D%22evenodd%22 clip-rule%3D%22evenodd%22 stroke-linejoin%3D%22round%22 stroke-miterlimit%3D%221.414%22%3E%3Cpath serif%3Aid%3D%2232_%40mail_w%22 fill%3D%22none%22 d%3D%22M0 0h95v32H0z%22%2F%3E%3CclipPath id%3D%22a%22%3E%3Cpath d%3D%22M0 0h95v32H0z%22%2F%3E%3C%2FclipPath%3E%3Cg clip-path%3D%22url(%23a)%22%3E%3Cpath fill%3D%22%23005ff9%22 d%3D%22M91.063 2.96h3.033v20.593h-3.033zM87.785 23.553h-3.033V8.96h3.033v14.593zM86.269 2.449a2.048 2.048 0 1 1-.001 4.095 2.048 2.048 0 0 1 .001-4.095zM81.475 23.553h-2.982v-1.596c-1.068 1.21-2.95 1.97-4.72 1.97a7.674 7.674 0 0 1-7.671-7.671 7.675 7.675 0 0 1 7.671-7.671c1.77 0 3.553.667 4.72 1.846V8.96h2.982v14.593zM73.87 11.651c2.61 0 4.664 1.868 4.664 4.605 0 2.738-2.054 4.622-4.664 4.622-2.611 0-4.595-2.011-4.595-4.622 0-2.61 1.984-4.605 4.595-4.605zM43.841 23.553H40.86V8.96h2.981v1.019c.662-.622 1.903-1.391 3.625-1.394 2.115 0 3.692.89 4.773 2.322 1.182-1.417 3.13-2.322 5.116-2.322 3.725 0 6.264 2.516 6.264 6.436v8.532h-2.981v-8.532a3.458 3.458 0 0 0-3.454-3.454 3.457 3.457 0 0 0-3.454 3.454v8.532h-2.981v-8.532a3.458 3.458 0 0 0-3.454-3.454 3.457 3.457 0 0 0-3.454 3.454v8.532z%22%2F%3E%3Cpath d%3D%22M20.813 16A4.818 4.818 0 0 1 16 20.813 4.818 4.818 0 0 1 11.187 16 4.818 4.818 0 0 1 16 11.187 4.818 4.818 0 0 1 20.813 16M16 0C7.178 0 0 7.178 0 16s7.178 16 16 16c3.232 0 6.349-.962 9.013-2.783l.046-.032-2.156-2.506-.036.024A12.672 12.672 0 0 1 16 28.72C8.986 28.72 3.28 23.014 3.28 16S8.986 3.28 16 3.28 28.72 8.986 28.72 16c0 .909-.101 1.829-.3 2.734-.402 1.651-1.558 2.157-2.426 2.09-.873-.071-1.894-.693-1.901-2.215V16c0-4.463-3.63-8.093-8.093-8.093S7.907 11.537 7.907 16s3.63 8.093 8.093 8.093a8.03 8.03 0 0 0 5.734-2.389 5.198 5.198 0 0 0 3.997 2.389 5.399 5.399 0 0 0 3.678-1.078c.959-.728 1.675-1.781 2.071-3.046.063-.204.179-.672.18-.675l.003-.017C31.896 18.262 32 17.25 32 16c0-8.822-7.178-16-16-16%22 fill%3D%22%23ff9e00%22 fill-rule%3D%22nonzero%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E
// @match        http*://mail.ru
// @noframes
// @run-at document-end
// @grant GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/420252/Mailru%20Filter%20News.user.js
// @updateURL https://update.greasyfork.org/scripts/420252/Mailru%20Filter%20News.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle("\
.filter_item_box{opacity: 0;height: 0;transition: transform 5s, height 3s, opacity 1s;-webkit-transition:transform 5s, height 3s, opacity 1s;overflow: hidden;}\
.filter_item_box_show{opacity: 1;height: auto;border-left: 8px solid #00ff45;}\
.filter_item_box.filter_item_box_show:before {\
content: 'Фильтры:';\
position: relative;\
margin: 20px;\
}\
.filter_item_box > div {transform: translateX(100vw);-webkit-transform: translateX(100vw);}\
.filter_item_box.filter_item_box_show > div {transform: translateX(0);-webkit-transform: translateX(0);}\
\
.filter_class{display: inline-block;padding: 2px;user-select:none;cursor:pointer;margin: 8px 6px 3px 6px;font-family: monospace;transition: 0.5s all;box-shadow:0 2px 2px silver;border: 3px solid;text-align: center;}\
.filter_class:hover{transform: scale(1.1);}\
\
.filter_item{font-size: 10px;border-radius: 4px;line-height:1;}\
.filter_item:hover{background-color: #40ffa087;}\
\
.add_filter_item{border-width:1px;border-radius: 100%;font-size: 14px;width: 15px;height: 15px;line-height: 0.5;}\
.add_filter_item:hover{background-color: #005ff9a1;color:#fff;}\
\
.filter_item_hide_legend:after {content: 'H';color: red;position: absolute;display: inline-block;margin-top: -11px;padding: 2px;border: 1px solid;background: #ffffffc7;}\
.filter_item_styles_legend:after {content: 'CS';color: limegreen;position: absolute;display: inline-block;margin-top: -11px;padding: 2px;border: 1px solid;background: #ffffffc7;}\
.filter_item_hide{display:none;}\
\
.tabs__filter_button{position: relative;display: -webkit-inline-flex;display: inline-flex;height: 27px;background: url(data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjMDAwMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik03Ni40MjgsMjguOTg4Qzc1LjQ2NSwzMy4wMjQsNjMuODU1LDQ1LjE4Niw1Ni41LDUyLjU3OVY3NC4zNmwtMTIsNi45MjhWNTIuNTc5ICBjLTcuMzU2LTcuMzk0LTE4Ljk2NS0xOS41NTUtMTkuOTI4LTIzLjU5MUMyNC41MjksMjguODI1LDI0LjUsMjguNjYyLDI0LjUsMjguNWMwLTMuODY2LDEyLjE5My04LDI2LThjMTMuODA3LDAsMjYsNC4xMzQsMjYsOCAgQzc2LjUsMjguNjYyLDc2LjQ3MSwyOC44MjUsNzYuNDI4LDI4Ljk4OHogTTUwLjUsMjMuNWMtMTIuMTUsMC0yMywyLjc5MS0yMyw1YzIsNSwyMCwyNCwyMCwyNHYyNGMyLTEsNC0yLDYtM3YtMjFjMCwwLDE4LTE5LDIwLTI0ICBDNzMuNSwyNi4yOTEsNjIuNjUsMjMuNSw1MC41LDIzLjV6IE02Mi41LDM5LjVjLTUuMzYzLDUuOTUtMTEuOTMsMTMtMTEuOTMsMTNzLTYuODYxLTcuMTk4LTEyLjA3LTEzICBDNDUuOTE3LDM5LjU4NSw1NS40MDcsMzkuNjEzLDYyLjUsMzkuNXoiPjwvcGF0aD48L3N2Zz4=);width: 27px;background-size: 27px;top: 5px;}\
.tabs__filter_button:after{\content: '';mix-blend-mode: screen;background: #000000;position: absolute;width: 100%;height: 100%;}\
.tabs__filter_button:hover:after, .tabs__filter_button.activefilter:after{background: #005ff9;}\
\
.tabs__filter_button_info {position: absolute;z-index:1;color: white;background: #005ff994;padding: 3px;left: 80%;top: -5px;border-radius: 3px;user-select: none;font-size: 10px;line-height: 1;box-shadow: 2px 2px 3px #c0c0c0eb;}\
\
.filter_item_setting > .panelSettingFilter {\
position: absolute;\
top: 50%;\
left: 50%;\
width: 350px;\
background: #ffd400bd;\
transform: translate(-50%, -50%) !important;\
z-index: 5;\
box-shadow: 2px 2px 4px #f3951c;\
border: 1px solid white;\
padding: 4px;\
display: none;\
text-align: center;\
font-family: monospace;\
transform: translate(-100%, -50%) !important;\
}\
.panelSettingFilter__title {\
background: linear-gradient(45deg, black, transparent);\
color: white;\
user-select:none;\
}\
.panelSettingFilter__close {\
float: right;\
transition: 1s all;\
cursor:pointer;\
user-select:none;\
}\
.panelSettingFilter__close:hover {\
color: black;\
}\
.panelSettingFilter__body{\
min-height: 50px;\
padding: 4px;\
}\
.panelSettingFilter__body > div{\
margin: 6px 0;\
background: #ffffffb3;\
padding: 2px;\
}\
.panelSettingFilter__foot{\
background: linear-gradient(45deg, silver, transparent);\
}\
.panelSettingFilter__foot button{\
margin: 0 5px;\
}\
.t_actions > input {\
margin: 0 5px;\
}\
.item_filter_glow {\
padding: 2px;\
animation: f_glow 2s infinite;\
}\
@keyframes f_glow{\
0%,100%{background: yellow; transform:scale(1);}\
50%{background: orange; transform:scale(1.05);}\
}\
#wipe_data_filters{\
font-size: 10px;\
color: white;\
float: right;\
background: #ff0000ad;\
width: 20px;\
cursor: pointer;\
}\
");

    var ObjMailNews = {
        filter_list: [],
        stylesList: {}
    }
    const debug = false

    function LS_save(){
        let _tmp = JSON.stringify(ObjMailNews)

        if(_tmp){
            GM_setValue('ObjMailNews', _tmp)
        }
    }

    function LS_load(){
        let _tmp = GM_getValue('ObjMailNews')

        ObjMailNews = _tmp ? JSON.parse(_tmp) : ObjMailNews

        if(!ObjMailNews.hasOwnProperty('stylesList')){
            ObjMailNews.stylesList = {}
        }

        ObjMailNews.filter_list.forEach((fil, indx)=>{
            if(typeof(fil.c_Styles) !== 'string'){
                let countStyles = Object.keys(ObjMailNews.stylesList).length,
                    id = randoMizeName()

                ObjMailNews.stylesList[id] = {title:`Style_${countStyles+1}`, style_params: fil.c_Styles}
                fil.c_Styles = ''
            }
        })

        log(ObjMailNews)
    }

    function log(){
        if(debug) console.log(...arguments)
    }

    function rndcolor(type=false){
        return type ? 'rgba('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+', 1.0)':'#'+Math.floor(Math.random()*16777215).toString(16)
    }

    function isValidStyle(opt, strColor){
        let op = new Option().style;
        if(!op.hasOwnProperty(opt)) return false
        op[opt] = strColor;
        return op[opt] !== '';
    }

    function addClassName(el,cls){
        let all_class = el.className.split(' ')
        all_class.push(cls)
        return all_class.join(' ')
    }

    function showHide(el){
        el.style.display = el.style.display == 'none' ? 'block' : 'none'
    }

    //
    function randoMizeName(size=10){
        let name = ''
        while(size>0){
            const maxMin = [
                [97,122],
                [65,90],
                [48,57]
            ],
                  selectRange = maxMin[Math.floor(Math.random()*maxMin.length)]


            name+= String.fromCharCode(Math.floor(Math.random()*(selectRange[1]-selectRange[0])+selectRange[0]))
            size--
        }
        return name
    }

    function inputTitleStyle(){
        let title = ''
        while(true){
            title = prompt('Введите название стиля: ')
            if(/^\s*$/g.test(title)){
                alert('Имя пустое!')
            } else{
                break
            }
        }
        return title
    }

    function addCustomStyles(customStyles){
        let id = randoMizeName(10),
            title = `Style_${Object.keys(ObjMailNews.stylesList).length+1}`

            if(confirm('Добавить название стилю?')){
                title = inputTitleStyle()
            }

        const massivStyles = customStylesGet(customStyles)

        if(!massivStyles.length){
            alert('Параметры настройки стиля, в тектовом поле пустое, нечего сохранять!')
            return
        }

        ObjMailNews.stylesList[id]=({
            title: title,
            style_params: massivStyles
        })

        LS_save();
    }


    function getOptionById(arr, s_id, option=null, onlyone=false, caseignore=false){
        let id_array = []
        for(let s in arr){
            let item = option ? arr[s][option] : arr[s]

            if(caseignore){
                item = item.toLowerCase()
                s_id = s_id.toLowerCase()
            }

            if(item == s_id){
                id_array.push(s)
                if(onlyone) break
            }

        }
        return id_array
    }

    function reDrawSelect(selectElement, lStyles){
        let options = '<option value="no-action">-- Выбрать стиль --</option>'

        if(Object.keys(lStyles).length){
            for(let li in lStyles){
                options+=`<option value="${li}">${lStyles[li].title}</option>`
                }
        } else {
            options = '<option value="no-action">-- Здесь нет стилей --</option>'
        }

        return options
    }

    // Custom Styles text value to object
    const customStylesGet = function(text){
        let massStyles = [],
            arrStyles = text.split('\n')

        if(arrStyles.length>0){
            arrStyles.forEach(function(el,idx){
                let key_val = el.split(':')
                if(key_val.length == 2) {
                    massStyles.push({propStyle: key_val[0].trim(), propValue: key_val[1].trim()})
                } else {
                    return true
                }
            })
        }
        return massStyles
    }

    var NewsDown = function(){

        let self = this

        // Manipulation with elements contains filters values
        this.decorateStyle = function(el, num){
            let itemObj = ObjMailNews.filter_list[num]

            if(itemObj && Object.keys(itemObj).length){

                if(itemObj.hide == '0'){
                    // Show
                    if(el.classList.contains('filter_item_hide')) el.classList.remove('filter_item_hide')

                    // if out hide == 0 to set bg and color
                    if(itemObj.bg_color){
                        let bg_color = itemObj.bg_color ? itemObj.bg_color : rndcolor()

                        el.style.setProperty('background', bg_color)
                    }

                    if(itemObj.font_color){
                        let color = itemObj.font_color ? itemObj.font_color : '',
                            element_a = el.querySelectorAll('a')

                        element_a.length>1 ? element_a[1].style.setProperty('color', 'inherit') : element_a[0].style.setProperty('color', 'inherit')
                        el.style.setProperty('color', color)

                    }
                    // ------------------------------------


                } else if(itemObj.hide == '1'){
                    // Hide
                    if(!el.classList.contains('filter_item_hide')) el.classList.add('filter_item_hide')

                } else if(itemObj.hide == '2' && itemObj.hasOwnProperty('c_Styles') && itemObj.c_Styles && ObjMailNews.stylesList.hasOwnProperty(itemObj.c_Styles)){
                    // Customs styles

                    if(el.classList.contains('filter_item_hide')) el.classList.remove('filter_item_hide')

                    let element_a = el.querySelectorAll('a'),
                        edit_a_element = element_a.length>1 ? element_a[1] : element_a[0]

                    ObjMailNews.stylesList[itemObj.c_Styles].style_params.forEach(function(_style, idx){
                        let propStyle = _style.propStyle,
                            propValue = _style.propValue

                        if(edit_a_element.style.hasOwnProperty(propStyle)) edit_a_element.style.setProperty(propStyle, 'inherit')
                        el.style.setProperty(propStyle, propValue)
                    })
                }
            }
        }

        // Change inside elements
        this.changeInside = function(el, text){
            let el_text = el.innerText || el.textContent,
                el_text_lower = el_text.toLowerCase()

            if(el_text_lower.includes(text)){
                const start = el_text_lower.indexOf(text),
                      end = start + text.length,
                      orig_text = el_text.slice(start,end),
                      newTextWithStyle = el_text.replaceAll(orig_text, `<span class="item_filter_glow">${orig_text}</span>`)

                el.innerHTML = newTextWithStyle
            }
        }

        this.findGlow = function(el, text){
            const self = this,
                  _nodes = Array.from(el.children)

            _nodes.forEach(function(_el,idx){
                if(_el.children.length>0){
                    self.findGlow(_el, text)
                } else {
                    if(_el.nodeType != 3 || _el.tagName != 'IMG'){
                        self.changeInside(_el,text)
                        return false
                    }
                }
            })
        }

        // Find news contains filters values
        this.findNews = function(mut, obs){
            let news = document.querySelectorAll("ul.tabs-content > li"),
                itemObj = ObjMailNews.filter_list,
                fElements = news.forEach(function(el){

                    let t_content = el.textContent.toLowerCase()

                    // Restore element
                    if(el.hasAttribute('style')) el.removeAttribute('style')

                    let element_a = el.querySelectorAll('a')
                    if(element_a.length>1){
                        if(element_a[1].hasAttribute('style')) element_a[1].removeAttribute('style')
                    } else {
                        if(element_a[0].hasAttribute('style')) element_a[0].removeAttribute('style')
                    }

                    if(el.classList.contains('flter_item_hide')) el.classList.remove('flter_item_hide')

                    // remove style find text highlight
                    el.querySelectorAll('span.item_filter_glow').forEach(function(_el){
                        _el.classList.remove('item_filter_glow')
                    })

                    for(let z in itemObj){
                        const title = itemObj[z].title.toLowerCase()
                        if(t_content.includes(title)){
                            self.findGlow(el, title)
                            self.decorateStyle(el, z)
                        }
                    }
                })
            }

        // Add new item to filter
        this.addItem = function(params){
            let title = params.name,
                bg_color = params.bg_color,
                font_color = params.font_color,
                hide = params.hide,
                c_Styles = params.c_Styles

            if(title && !/^\s*$/i.test(title)){
                if(getOptionById(ObjMailNews.filter_list, title, 'title', false, true).length>0){
                    alert(`Слово '${title}' уже есть в фильтрах!`)
                    return
                }
                ObjMailNews.filter_list.push({
                    title: title,
                    bg_color: isValidStyle('background', bg_color) ? bg_color : rndcolor(),
                    font_color: isValidStyle('color', font_color) ? font_color : '',
                    hide: +hide> 2 || typeof(+hide) !== 'number' ? '0' : hide,
                    c_Styles: c_Styles
                })

                this.listUpd()
                this.findNews()
                LS_save();
                // Hide window after click
                this.sh(this.panelSettingFilter, 'hide', null)
            } else {
                alert('Поле пустое!')
            }
        }

        // Edit exists filter item
        this.clickItem = function(params, itemObj){
            let title = params.name,
                bg_color = params.bg_color,
                font_color = params.font_color,
                hide = params.hide,
                c_Styles = params.c_Styles

            if(title && !/^\s*$/i.test(title)){
                itemObj.title = title
                itemObj.bg_color = isValidStyle('background', bg_color) ? bg_color : rndcolor()
                itemObj.font_color = isValidStyle('color', font_color) ? font_color : ''
                itemObj.hide = hide == null ? itemObj.hide : +hide> 2 || typeof(+hide) !== 'number' ? '0' : hide
                itemObj.c_Styles = c_Styles

                this.listUpd()
                this.findNews()
                LS_save()
                // Hide window after click
                //this.sh(this.panelSettingFilter, 'hide', null)
            } else {
                alert('Ошибка поля name')
            }
        }

        // Remove filter item
        this.removeItem = function(itemObj, num){
            if(confirm(`Удалить элемент: ${itemObj.title}`)){
                ObjMailNews.filter_list.splice(num, 1)
                this.listUpd()
                this.findNews()
                LS_save()
                this.sh(this.panelSettingFilter, 'hide', null)
            }
        }

        // Set default value fields
        this.defaultValue = function(){
            this.panel_name.value = ''
            this.panel_bg_color.value = rndcolor() || '#ffffff'
            this.panel_font_color.value = '#528fdf'
            this.panel_select[0].checked = true
            if(this.customStyles) this.customStyles.value = ''
        }

        // Set value fields from LocalStorage
        this.setValueOBJ = function(itemObj){
            this.panel_name.value = itemObj.title
            this.panel_bg_color.value = itemObj.bg_color
            this.panel_font_color.value = itemObj.font_color
            this.panel_select[+itemObj.hide].checked = true
        }

        // Custom Styles object to text
        this.customStylesSet = function(c_styles){
            let textStyles = ''
            if(c_styles.length>0){
                c_styles.forEach(function(el,idx){
                    if(el.hasOwnProperty('propStyle') && el.hasOwnProperty('propValue')){
                        textStyles += `${el.propStyle}:${el.propValue}\n`
                    }
                })
            }
            return textStyles
        }

        // Custom Styles check value
        this.customStylesIsset = function(ObjItem,_style){
            return ObjItem.filter((el) => el.propStyle.toLowerCase() == _style.toLowerCase())
        }


        // PopUp window setting, add and edit filtered items
        this.sh = function(el, tip, num){
            let new_nodes_save = this.panel_button_save.cloneNode(true),
                new_nodes_remove = this.panel_button_remove.cloneNode(true)

            this.panel_button_save.parentNode.replaceChild(new_nodes_save, this.panel_button_save);
            this.panel_button_save = new_nodes_save

            this.panel_button_remove.parentNode.replaceChild(new_nodes_remove, this.panel_button_remove);
            this.panel_button_remove = new_nodes_remove

            this.panelSettingFilter.setAttribute('data-item-id', num)

            // Add new item
            if(tip == 'addItem'){
                this.panel_button_remove.setAttribute('disabled', 'disabled')

                this.addremTextareaCS(null, false)

                this.defaultValue()

                this.panel_button_save.addEventListener('click', function(){
                    const selectRadio = self.panelSettingFilter.querySelectorAll('input[name=tip_actions]:checked')[0].value,
                          checked = self.panelSettingFilter.querySelectorAll('input[name=tip_actions]:checked')[0].value,
                          len_childs = self.custom_styles_box.children.length,

                          newItem = {
                              name: self.panel_name.value,
                              bg_color: self.panel_bg_color.value,
                              font_color: self.panel_font_color.value,
                              hide: selectRadio,
                              c_Styles: ''
                          }

                    if(checked == '2' && len_childs){
                        const selectStyle = self.custom_styles_box.querySelector('#c_style_select')
                        if(selectStyle && selectStyle.selectedIndex != 0){
                            newItem.c_Styles = selectStyle.value
                        }
                    }

                    self.addItem(newItem)
                    self.panel_button_remove.removeAttribute('disabled')
                })
            }

            // Edit item
            if(num && tip == 'clickItem'){
                this.panel_button_remove.removeAttribute('disabled')

                let itemObj = ObjMailNews.filter_list[num],
                    cStyles = itemObj.c_Styles

                this.setValueOBJ(itemObj)

                this.addremTextareaCS(null, false)

                if(itemObj.hide == '2'){
                    this.addremTextareaCS(itemObj.c_Styles)
                }


                this.panel_button_save.addEventListener('click', function(){
                    const selectRadio = self.panelSettingFilter.querySelectorAll('input[name=tip_actions]:checked')[0].value,
                          checked = self.panelSettingFilter.querySelectorAll('input[name=tip_actions]:checked')[0].value,
                          len_childs = self.custom_styles_box.children.length,

                          editItem = {
                              name: self.panel_name.value,
                              bg_color: self.panel_bg_color.value,
                              font_color: self.panel_font_color.value,
                              hide: selectRadio,
                              c_Styles: cStyles
                          }


                    if(checked == '2' && len_childs){
                        const selectStyle = self.custom_styles_box.querySelector('#c_style_select')
                        if(selectStyle && selectStyle.selectedIndex != 0){
                            editItem.c_Styles = selectStyle.value
                        } else {
                            editItem.c_Styles = ''
                        }
                    }

                    self.clickItem(editItem, itemObj)
                })

                this.panel_button_remove.addEventListener('click', function(event){
                    self.removeItem(itemObj, num)
                }, false)
            }

            // Other deafault value
            if(!tip || tip == 'hide'){
                this.defaultValue()
            }

            showHide(el)
        }

        // Show Hide Buttons and filter items
        this.showhide_panel = function(){
            if(!this.divBox.classList.contains('filter_item_box_show')){
                this.divBox.classList.add('filter_item_box_show')
                this.filter_button.classList.add('activefilter')
            } else {
                this.divBox.classList.remove('filter_item_box_show')
                this.filter_button.classList.remove('activefilter')
            }
        }

        // Update filter items
        this.listUpd = function(){
            this.divBox.innerHTML = ''

            for(let z in ObjMailNews.filter_list){
                let itemObj = ObjMailNews.filter_list[z],
                    d = document.createElement("div"),
                    cStyles = ObjMailNews.stylesList

                d.className = 'filter_class filter_item'
                d.textContent = itemObj.title
                d.title = 'Фильтр: '+d.textContent + (itemObj.hide == '1'?' (скрыть)': itemObj.hide == '2'? ` (польз. настройки Стиль: "${itemObj.c_Styles?cStyles[itemObj.c_Styles].title:'Пустой стиль'}")` : '')

                let issetValue = (cStyles.hasOwnProperty(itemObj.c_Styles) && itemObj.c_Styles) ? this.customStylesIsset(cStyles[itemObj.c_Styles].style_params,'border-color') : false
                d.setAttribute("style", `border-color: ${itemObj.hide == '2' && issetValue && issetValue.length>0 ? issetValue[0].propValue : itemObj.bg_color};color:${itemObj.font_color}`)

                if(itemObj.hasOwnProperty('hide')){
                    if(itemObj.hide == '1') d.classList.add("filter_item_hide_legend")
                    if(itemObj.hide == '2') d.classList.add("filter_item_styles_legend")
                }

                d.addEventListener('click', function(event){
                    self.sh(self.panelSettingFilter, 'clickItem', z)
                })

                this.divBox.appendChild(d)
            }

            let addButton = document.createElement("div")
            addButton.className = 'filter_class add_filter_item'
            addButton.textContent = '+'
            addButton.title = 'Добавить фильтр'
            addButton.addEventListener('click', function(){
                self.sh(self.panelSettingFilter, 'addItem', null)
            })
            this.divBox.appendChild(addButton)

            this.filter_button_info.textContent = ObjMailNews.filter_list.length
            this.filter_button.title = 'Фильтр (Элементов: '+this.filter_button_info.textContent+')'
        }


        this.addremTextareaCS = function(s_id = null, hide = true){
            let checked = this.panelSettingFilter.querySelectorAll('input[name=tip_actions]:checked')[0].value,
                len_childs = this.custom_styles_box.children.length

            if(checked == '2' && !len_childs && hide){
                //styles
                let lStyles = ObjMailNews.stylesList,
                    options='',

                    customStylesSelect = document.createElement('select'),
                    customStylesAdd = document.createElement('button'),
                    customStylesDel = document.createElement('button')

                customStylesAdd.textContent = 'Добавить'
                customStylesDel.textContent = 'Удалить'

                customStylesAdd.id = 'c_style_add'
                customStylesDel.id = 'c_style_del'
                customStylesSelect.id = 'c_style_select'

                /*options = '<option value="no-action">-- Выбрать стиль --</option>'

                if(Object.keys(lStyles).length){
                    for(let li in lStyles){
                        options+=`<option value="${li}">${lStyles[li].title}</option>`
                }
                } else {
                    options = '<option value="no-action">-- Здесь нет стилей --</option>'
                }*/
                options = reDrawSelect(customStylesSelect, lStyles)

                customStylesSelect.innerHTML = options

                let customStyles = document.createElement('textarea')
                customStyles.id = 'customStyles'
                customStyles.title = '<<Пользовательские настройки стилей>>\nПример:\nborder:2px dotted\nborder-color:limegreen\nbackground:linear-gradient(45deg, yellow, transparent)'
                const styles = {width: "300px", "max-width": "300px", "max-height": "200px"}
                for(const s in styles){
                    customStyles.style[s] = styles[s]
                }

                customStyles.placeholder = 'property: value'

                this.custom_styles_box.appendChild(customStylesSelect)
                this.custom_styles_box.appendChild(customStylesAdd)
                this.custom_styles_box.appendChild(customStylesDel)

                this.custom_styles_box.appendChild(customStyles)

                if(s_id && /[a-zA-z0-9]{10}/.test(s_id)){
                    const opt = customStylesSelect.querySelectorAll('option')
                    opt.forEach((el, indx)=>{
                        if(s_id == el.value){
                            customStylesSelect.selectedIndex = indx
                            return false
                        }
                    })
                    customStyles.value = this.customStylesSet(lStyles[s_id].style_params)
                }

                // Add event listeners
                let origStyle = customStyles.value
                customStyles.addEventListener('input', ()=>{
                    customStylesAdd.textContent = customStyles.value != origStyle ? 'Сохранить' : 'Добавить'
                })

                this.custom_styles_box.addEventListener('click', ()=>{
                    try{
                        event.stopPropagation()
                        const target = event.target

                        if(['c_style_add','c_style_del'].includes(target.id)){
                            let change = false

                            if(target.id == 'c_style_add'){

                                if(customStylesSelect.value in lStyles && confirm(`Вы хотите изменить параметры у ${customStylesSelect.selectedOptions[0].textContent}?`)){
                                    // Edit title
                                    if(confirm('Вы хотите изменить название стиля?')){
                                        const newTitle = inputTitleStyle()
                                        ObjMailNews.stylesList[customStylesSelect.value].title = newTitle
                                        customStylesSelect.selectedOptions[0].textContent = newTitle
                                    }

                                    // Edit style
                                    ObjMailNews.stylesList[customStylesSelect.value].style_params = customStylesGet(customStyles.value)

                                    LS_save()
                                    change = true
                                    origStyle = customStyles.value
                                    customStylesAdd.textContent = 'Добавить'
                                    alert('Стиль был обновлен!')
                                } else {
                                    addCustomStyles(customStyles.value)
                                    options = reDrawSelect(customStylesSelect, lStyles)
                                    customStylesSelect.innerHTML = options
                                    customStylesSelect.selectedIndex = Object.keys(ObjMailNews.stylesList).length+1
                                }

                            } else if(target.id == 'c_style_del'){
                                if(customStylesSelect.value == 'no-action'){
                                    return
                                }

                                if(confirm(`Вы действительно хотите удалить стиль "${customStylesSelect.selectedOptions[0].textContent}"?\nПри удалении стиля будут удалены пользовательские стили у фильтров!`)){
                                    const style_id = customStylesSelect.value

                                    if(lStyles.hasOwnProperty(style_id)){
                                        // Search filter includes this style
                                        const id_filter = getOptionById(ObjMailNews.filter_list, style_id, 'c_Styles')//deleteStyleFromFilters(style_id)

                                        if(id_filter.length){
                                            id_filter.forEach((id_item)=>{
                                                ObjMailNews.filter_list[id_item].c_Styles = ''
                                            })
                                        }

                                        // Delete from styles list
                                        delete ObjMailNews.stylesList[style_id]
                                        customStylesSelect.removeChild(customStylesSelect.selectedOptions[0])
                                        customStylesSelect.selectedIndex = 0
                                        customStyles.value = ''

                                        LS_save()
                                        change = true
                                        alert('Стиль был удален!')
                                    }
                                }
                            }

                            if(change){
                                this.listUpd()
                                this.findNews()
                            }
                        }

                    } catch(e){
                        throw new Error(e)
                    }
                })

                customStylesSelect.addEventListener('change', ()=>{
                    if(customStylesSelect.value == 'no-action'){
                        return
                    }

                    customStyles.value = this.customStylesSet(ObjMailNews.stylesList[customStylesSelect.value].style_params)
                })

            } else {
                if(len_childs){
                    //this.panel_action.removeChild(this.customStyles)
                    //this.customStyles = null
                    this.custom_styles_box.innerHTML=''
                }
            }
        }


        // Main function initilization
        this.init = function(){
            LS_load()

            let config = {
                attributes: true,
                //attributeFilter:["data-show-pixel"],
                childList: true,
                //subtree: true,
                //characterData: true
            },
                tabs = document.querySelector(".tabs"),
                elementMObj = document.querySelector("ul.tabs-content")//.parentNode

            this.divBox = document.createElement("div")
            this.divBox.classList.add('filter_item_box')

            this.divBoxSetting = document.createElement("div")
            this.divBoxSetting.classList.add('filter_item_setting')

            this.divBox.setAttribute("name","filter_itemBox")
            this.divBoxSetting.setAttribute("name","filter_itemSetting")

            this.filter_button = document.createElement("a")
            this.filter_button.href = '#'
            this.filter_button.title = 'Фильтр'
            this.filter_button.classList.add('tabs__filter_button')

            this.filter_button_info = document.createElement("div")
            this.filter_button_info.textContent = '...'
            this.filter_button_info.classList.add('tabs__filter_button_info')

            this.filter_button.appendChild(this.filter_button_info)

            this.listUpd()

            tabs.appendChild(this.filter_button)

            // !mail.ru#@#body > .zeropixel ~ * .searchContainer ~ .tabs + div[class] ~ div  <--- uBlock blocking userscript elements
            this.divBoxPre = document.createElement("span")

            this.divBoxPre.appendChild(this.divBox)
            this.divBoxPre.appendChild(this.divBoxSetting)

            tabs.parentElement.after(this.divBoxPre)

            //tabs.nextElementSibling.parentNode.insertBefore(this.divBoxSetting,tabs.nextElementSibling)

            //document.getElementById("grid:middle").appendChild(this.divBox,this.divBoxSetting)
            //document.getElementById("grid:middle").appendChild(this.divBoxSetting)

            this.filter_button.addEventListener('click', this.showhide_panel.bind(this))

            // Panel settings
            this.panelSettingFilter = document.createElement("div")
            this.panelSettingFilter.classList.add('panelSettingFilter')
            this.panelSettingFilter.setAttribute('style','display:none;')

            let htmlCode = '<div class="panelSettingFilter__title">'+
                '<span>Настройки фильтра</span>'+
                '<div class="panelSettingFilter__close">X</div>'+
                '</div>'+
                //'<form id="filter_form">'+
                '<div class="panelSettingFilter__body">'+
                '<div>Слово: <input type="text" placeholder="Название фильтра"/></div>'+
                '<div>Цвет фона: <input id="item_bg_color" type="color"/></div>'+
                '<div>Цвет текста: <input id="item_font_color" type="color"/></div>'+
                '<div class="t_actions">Тип:<br>'+
                '<input id="t_show" type="radio" name="tip_actions" value="0" checked/><label for="t_show">Показать</label>'+
                '<input id="t_hide" type="radio" name="tip_actions" value="1" /><label for="t_hide">Скрыть</label>'+
                '<input id="t_customs" type="radio" name="tip_actions" value="2" title="Смотрите CSS справочники, для настройки" /><label for="t_customs" title="Смотрите CSS справочники, для настройки">Польз. настр.</label>'+
                '<div class="custom_styles_box"></div>'+
                '</div>'+
                '<div class="panelSettingFilter__foot"><button id="item_save">Сохранить</button><button id="item_remove">Удалить</button><div title="Удалить все фильтры" id="wipe_data_filters">X</div></div>'//+
            //'</form>'

            this.panelSettingFilter.innerHTML = htmlCode
            this.divBoxSetting.appendChild(this.panelSettingFilter)
            //
            this.panel_action = this.panelSettingFilter.querySelector('.t_actions')
            this.panel_name = this.panelSettingFilter.querySelector('input[type=text]')
            this.panel_bg_color = this.panelSettingFilter.querySelector('#item_bg_color')
            this.panel_font_color = this.panelSettingFilter.querySelector('#item_font_color')
            this.panel_select = this.panelSettingFilter.querySelectorAll('input[name=tip_actions]')
            this.panel_button_save = this.panelSettingFilter.querySelector('#item_save')
            this.panel_button_remove = this.panelSettingFilter.querySelector('#item_remove')
            this.panelSettingFilter.querySelector('#wipe_data_filters').addEventListener('click', ()=>{
                if(confirm('Вы хотите удалить все ваши фильтры безвозвратно?')){
                    ObjMailNews.filter_list = []
                    LS_save()
                    self.listUpd()
                    self.findNews()
                }
            })

            this.panel_button_remove.setAttribute('disabled', 'disabled')

            this.custom_styles_box = this.panelSettingFilter.querySelector('.custom_styles_box')

            this.panelSettingFilter.querySelector('.panelSettingFilter__close').addEventListener('click', this.sh.bind(this,this.panelSettingFilter, 'hide', null))
            //
            this.panel_select.forEach(function(el,idx){
                el.addEventListener('change', function(){
                    try{
                        if(this.value == 2){
                            let num = self.panelSettingFilter.dataset.itemId
                            num = (typeof(num) == 'string' && num == 'null') ? JSON.parse('null') : num

                            self.addremTextareaCS(num)
                        } else {
                            self.addremTextareaCS(null, false)
                        }


                    } catch(e){
                        throw new Error(e)
                    }
                })
            })

            this.findNews()

            this.observer = new MutationObserver(this.findNews);
            this.observer.observe(elementMObj, config);
        }
    }

    document.body.onload = function(){
        new NewsDown().init()
    }

})();
