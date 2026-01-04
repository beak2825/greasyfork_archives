// ==UserScript==
// @name         B站直播间自定义覆盖
// @namespace    http://tampermonkey.net/
// @version      0.0.6
// @description  B站直播间自定义覆盖, 防止尴尬
// @author       Eric Lam
// @include      /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421315/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%AE%9A%E4%B9%89%E8%A6%86%E7%9B%96.user.js
// @updateURL https://update.greasyfork.org/scripts/421315/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%AE%9A%E4%B9%89%E8%A6%86%E7%9B%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('using embrassing cover for bilibili')


    function initialize(){
        const vid = $('div.bilibili-live-player-video').length ? $('div.bilibili-live-player-video') : $('div#live-player')
        const info = $('div.room-info-ctnr.dp-i-block').length ? $('div.room-info-ctnr.dp-i-block') : $('.rows-ctnr')

        $(document.head).append(`
<style>
  .slider {
    -webkit-appearance: none;
    height: 5px;
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    border-radius: 5px;
    -webkit-transition: .2s;
    transition: opacity .2s;
  }

  .slider:hover {
    opacity: 1;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 7px;
    height: 7px;
    background: #4CAF50;
    cursor: pointer;
  }

  .slider::-moz-range-thumb {
    width: 7px;
    height: 7px;
    background: black;
    border-radius: 50px;
    cursor: pointer;
  }
  /*
   hover menu
  */

   /* Dropdown Button */
.dropbtn {
    background-color: #e05684;
    color: white;
    padding: 5px;
    font-size: 12px;
    border: none;
  }

  /* The container <div> - needed to position the dropdown content */
  .dropdown {
    position: relative;
    display: inline-block;
  }

  /* Dropdown Content (Hidden by Default) */
  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f1f1f1;
    padding: 10px;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
  }

  /* Links inside the dropdown */
  .dropdown-content li {
    color: black;
    text-decoration: none;
    display: inline-block;
  }

.dropdown-content li div{
  color: red;
  font-size: 12px;
  display: inline-block;
}
</style>
`)
        vid.prepend(`
        <img id="cover"
            src="https://static-cdn.jtvnw.net/jtv_user_pictures/e91a3dcf-c15a-441a-b369-996922364cdc-profile_image-300x300.png"
            style="
                    width: 0%;
                    height: 100%;
                    z-index: 2;
                    position: absolute
        ">`)


        info.append(`
        <div class="dropdown">
            <a href="javascript: void(0)" class="dropbtn" type="button">覆蓋設定</a>
            <ul class="dropdown-content">
                <li>
                    <div>覆蓋寬度: </div>
                    <div>
                        <input type="range" min="0" max="100" value="0" class="slider" id="width-cover">
                    </div>
                </li>
                <li>
                    <div>向左移動: </div>
                    <div>
                        <input type="range" min="0" max="100" value="0" class="slider" id="width-move">
                    </div>
                </li>
                <li>
                    <div>覆蓋高度: </div>
                    <div>
                        <input type="range" min="0" max="100" value="100" class="slider" id="height-cover">
                    </div>
                </li>
                <li>
                    <div>向下移動: </div>
                    <div>
                        <input type="range" min="0" max="100" value="0" class="slider" id="height-move">
                    </div>
                </li>
            </ul>
        </div>
    `)

        $('.dropbtn').on('click', switchMenu)
        for(const key in changeable){
            $(`#${key}`).on('input', e => changeValue(changeable[key], e.currentTarget.value))
        }

        window.addEventListener('keydown', e => {
          if (!e.ctrlKey) return
          if (e.which == 90){
             e.preventDefault();
             if ($('#cover').is(':hidden')){
                 $('#cover').show()
             }else{
                 $('#cover').hide()
             }
          }else if (e.which == 81){
            e.preventDefault();
            changeValue('width', 100)
            $('#width-cover').val(100)
            changeValue('height', 100)
            $('#height-cover').val(100)
            changeValue('padding-left', 0)
            $('#width-move').val(0)
            changeValue('padding-top', 0)
            $('#height-move').val(0)
          }
        })

    }

    const changeable = {
        'width-cover': 'width',
        'width-move': 'padding-left',
        'height-cover': 'height',
        'height-move': 'padding-top'
    }

    function switchMenu(e){
        const btn = $(e.currentTarget);
        const v = !(btn.attr('show') === 'true')
        btn.attr('show', v)
        const color = v ? '#3e8e41' : '#e05684'
        const display = v ? 'block' : 'none'
        $('.dropdown-content').css('display', display)
        $('.dropbtn').css('background-color', color)
    }

    function changeValue(key, percent){
        const c = $('img#cover')
        if(c.length === 0) {
            console.warn('the image cover is unknown, skipped operation')
            return
        }
        const p = typeof percent === 'number' ? percent : parseInt(percent)
        if (isNaN(p)){
            console.warn('not a valid number in percentage')
            return
        }else if (p < 0 || p > 100){
            console.warn('percentage must be between 0 ~ 100.')
            return
        }
        c.css(key, `${percent}%`)
    }

    const sleep = async (ms) => new Promise((res, ) => setTimeout(res, ms))

    async function start(){
        await sleep(500)
        console.debug("bilibili streaming room detected.")
        initialize()
    }

    start().catch(err => console.error(err.message))

})();