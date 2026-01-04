// ==UserScript==
// @name         E-Hentai图片尺寸自适应
// @name:en      E-Hentai Scaling
// @namespace    http://tampermonkey.net/
// @description  为PC端浏览器访问E-Hentai提供更好的图片自适应策略
// @description:en Better responsive pictures for E-hentai on PC browser
// @version      1.05
// @author       NilClass
// @match        https://exhentai.org/s/*
// @match        https://e-hentai.org/s/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450652/E-Hentai%E5%9B%BE%E7%89%87%E5%B0%BA%E5%AF%B8%E8%87%AA%E9%80%82%E5%BA%94.user.js
// @updateURL https://update.greasyfork.org/scripts/450652/E-Hentai%E5%9B%BE%E7%89%87%E5%B0%BA%E5%AF%B8%E8%87%AA%E9%80%82%E5%BA%94.meta.js
// ==/UserScript==

function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}

function addStyle(styleString) {
  const style = document.createElement('style');
  style.textContent = styleString.trim();
  document.head.append(style);
}

const DASH_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
</svg>
`;

const TOOL_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-wrench-adjustable-circle-fill" viewBox="0 0 16 16">
  <path d="M6.705 8.139a.25.25 0 0 0-.288-.376l-1.5.5.159.474.808-.27-.595.894a.25.25 0 0 0 .287.376l.808-.27-.595.894a.25.25 0 0 0 .287.376l1.5-.5-.159-.474-.808.27.596-.894a.25.25 0 0 0-.288-.376l-.808.27.596-.894Z"/>
  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16Zm-6.202-4.751 1.988-1.657a4.5 4.5 0 0 1 7.537-4.623L7.497 6.5l1 2.5 1.333 3.11c-.56.251-1.18.39-1.833.39a4.49 4.49 0 0 1-1.592-.29L4.747 14.2a7.031 7.031 0 0 1-2.949-2.951ZM12.496 8a4.491 4.491 0 0 1-1.703 3.526L9.497 8.5l2.959-1.11c.027.2.04.403.04.61Z"/>
</svg>
`;

(function() {
    'use strict';
    // Add UI
    const addUI = ()=>{
        document.body.appendChild(createElementFromHTML(`
            <div class="ex_scaling_ui inactive" id="ex_scaling_ui">
                <div class="ex_scaling_ui_title">
                    <div id="ex_scaling_ui_main_title" class="inactive">E-Hentai Scaling Toolbox</div>
                    <div class="ex_scaling_ui_close_button" id="ex_scaling_ui_close_button">
                        ${TOOL_ICON}
                    </div>
                </div>
                <div id="ex_scaling_ui_content" class="inactive">
                    <div class="ex_scaling_ui_option_title">
                        <span>Scaling Factor: <span id="ex_scaling_ui_scaling_factor">1</span></span>
                        <span id="ex_scaling_save" class="inactive">save</span>
                    </div>
                    <div class="slidecontainer">
                        <input type="range" min="0" max="200" value="100" class="slider" id="myRange">
                    </div>

                </div>
            </div>
        `));
        addStyle(`
            .ex_scaling_ui_close_button{
                font-weight: bold;
                cursor: pointer;
                transition-duration: 0.2s;
            }
            .ex_scaling_ui_close_button:hover{
                color: #993399;
            }
            .ex_scaling_ui{
                position: fixed;
                top: 0px;
                background: white;
                color: black;
                margin: 20px;
                padding: 10px;
                filter: drop-shadow(0 .5rem 1rem black);
                width: 250px;
                z-index: 114514;
            }
            .ex_scaling_ui.inactive{
                width: auto
            }
            .ex_scaling_ui_title{
                display: flex;
                justify-content: space-between;
                font-size: medium;
            }
            #ex_scaling_ui_content.inactive{
                display: none;
            }
            #ex_scaling_ui_main_title.inactive{
                display: none;
            }
            #ex_scaling_save.inactive{
                display: none;
            }
            #ex_scaling_save{
                font-weight: bold;
                cursor: pointer;
                transition-duration: 0.2s;
            }
            #ex_scaling_save:hover{
                color: #993399;
            }
            .ex_scaling_ui_option_title{
                margin-top: 20px;
                font-size: medium;
                text-align: left;
                color: grey;
                display: flex;
                justify-content: space-between;
            }
            .slidecontainer {
                margin-top: 10px;
                width: 100%; /* Width of the outside container */
            }

            /* The slider itself */
            .slider {
            -webkit-appearance: none;  /* Override default CSS styles */
            appearance: none;
            width: 100%; /* Full-width */
            height: 10px; /* Specified height */
            background: #d3d3d3; /* Grey background */
            outline: none; /* Remove outline */
            opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
            -webkit-transition: .2s; /* 0.2 seconds transition on hover */
            transition: opacity .2s;
            }

            /* Mouse-over effects */
            .slider:hover {
            opacity: 1; /* Fully shown on mouse-over */
            }

            /* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */
            .slider::-webkit-slider-thumb {
            -webkit-appearance: none; /* Override default look */
            appearance: none;
            width: 10px; /* Set a specific slider handle width */
            height: 25px; /* Slider handle height */
            background: #993399; /* Green background */
            cursor: pointer; /* Cursor on hover */
            }

            .slider::-moz-range-thumb {
            width: 10px; /* Set a specific slider handle width */
            height: 25px; /* Slider handle height */
            background: #993399; /* Green background */
            cursor: pointer; /* Cursor on hover */
            }
        `);
    }
    var page = -1;
    var ratio = 1;
    var scaling_factor = localStorage.getItem("ex_scaling_factor") || 1;
    var original_scaling_factor = localStorage.getItem("ex_scaling_factor") || 1;

    const scaleImg = ()=>{
        var pageNumber = parseInt(document.querySelectorAll("#i2 .sn span")[0].innerHTML);
        var slider = document.getElementById("myRange");
        // var scaling_factor = (slider?.value || 100)/100;
        // var ah = parseInt(document.getElementById("img").style.maxHeight);
        // var aw = parseInt(document.getElementById("img").style.maxWidth);
        var ah = parseInt(document.getElementById("img").style.height);
        var aw = parseInt(document.getElementById("img").style.width);
        var iw = parseInt(document.getElementById("i1").style.width);
        var ih = parseInt(document.getElementById("i1").style.height);
        if(page!=pageNumber){
            ratio = aw/ah;
            if(!isNaN(ratio)){
                page = pageNumber;
            }
        }
        var h = (window.innerHeight-(180));
        var w = h*ratio;

        if(w>=iw){
            w = iw-10;
            h = w/ratio;
        }
        h = h*scaling_factor;
        w = w*scaling_factor;
        if(ah!=h||aw!=w){
            document.getElementById("img").style.maxHeight = h+'px';
            document.getElementById("img").style.height = h+'px';
            document.getElementById("img").style.maxWidth = w+'px';
            document.getElementById("img").style.width = w+'px';
            document.getElementById("i1").style.minWidth = w+10+'px';
        }

    }
    window.addEventListener('load',()=>{
        addUI();
        var slider = document.getElementById("myRange");
        var output = document.getElementById("ex_scaling_ui_scaling_factor");
        var save_btn = document.getElementById("ex_scaling_save");
        slider.value = scaling_factor*100;
        output.innerHTML = scaling_factor;
        slider.oninput = function() {
            output.innerHTML = this.value/100;
            scaling_factor = this.value/100;
            original_scaling_factor = localStorage.getItem("ex_scaling_factor") || 1;
            if((scaling_factor != original_scaling_factor && save_btn.classList.contains("inactive"))
              || (scaling_factor == original_scaling_factor && !save_btn.classList.contains("inactive"))){
                save_btn.classList.toggle("inactive");
            }
            scaleImg();
        }
        save_btn.onclick = function(){
            localStorage.setItem("ex_scaling_factor", scaling_factor);
            this.classList.toggle("inactive");
        }
        var button = document.getElementById("ex_scaling_ui_close_button");
        button.onclick = ()=>{
            var content = document.getElementById("ex_scaling_ui_content");
            var main_title = document.getElementById("ex_scaling_ui_main_title");
            var window = document.getElementById("ex_scaling_ui");
            if(content.classList.contains("inactive")){
                button.innerHTML = DASH_ICON;
            }else{
                button.innerHTML = TOOL_ICON;
            }
            content.classList.toggle("inactive");
            main_title.classList.toggle("inactive");
            window.classList.toggle("inactive");
        }
        scaleImg();
        setInterval(()=>{
            scaleImg();
        }, 500);
    });
    window.addEventListener('resize',()=>{
        scaleImg();
    });

    //scaleImg();
})();