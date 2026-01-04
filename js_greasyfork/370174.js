// ==UserScript==
// @name         Grab Radio 101.ru
// @namespace    https://github.com/AlekPet/
// @version      0.3.2
// @description  Grab radio stream from 101.ru
// @copyright    2018, AlekPet (https://github.com/AlekPet)
// @author       AlekPet
// @license      MIT; https://opensource.org/licenses/MIT
// @match        http*://101.ru/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAEIElEQVRIS+1Vf0zUZRj/PMcdx4FgtWzi8Ec6RNwqlxJII6RftmNm4VotQREtWJZpDDA2Gg3Eu7A1clISP7MthjJhTijdWrr+yLA1QR1Xo4aMtuAQwfR7P7h72vNl73Xc2fyr/urd3n2/977v9/k8n+f5fN4jZmb8i4P+B7hbdf+bErnOX+CBzD0UW1rEq+w7SJu4zY3Wk7iB+Xi7ZyOGrriQk3mdtpbGc7U9ku6WdfB+gIGz5RQ7Byewyp5PAy19rLEZboqGxpF4tmAJdTTf5H5HFKpsRiIiiPiCn/8EGgLghDA4V9bDCdaHMDqk4VeHH9sOrqQTrbf40mAkhIEKXlY7yJevjQLmKTycHMX208cNpS9v4A++qadzZYf5iRWpFMYgybadzu/v5UXPrcbokBtDDh/ybUl0vOVPnUHlASKDwaAz+O7HG5z//rforc/C0oWxeO2TVuQ++Si+uNiN1zOzsSFxfSiAE0m2fLrUdIE1jsJtvwkuWJCVt5BOHnNxv8OM96qg90DKIwBNpxxoqEiF0RiBXfXNyHtqHY71daEoaxMylj82CzDb5LdoHA9gRWMJx2evQcumblzne7CrIx3DjhnkWV36/sHDHjaYPfh5eBoUdQt1nT/R2aMZnPFIAlW0d3PtmTZCzDiKrZu5xlryNwPJSmjLnJmZgcfj0ae6SdS6lEeGKpPRaITJZNKnDL/fD5/PF4gV5gPZlOl2u+H1enUwKYd8KCCyJ0FlTanIYrHogPJbvpOzMvUzwXdRKAM5LAEVOwUiwSIiInRAeVcs5GxwUrraQi87xcDlcumH5bcEUUACIuUILp3ZbA7YQMqqGIcx8Din+Gz2x7j6w029oZa1iVzQvh6x982aS4EpFQnY5LSXX6n6GtWFa5GevIRUeVSP5jAYLGvlP65pSPtsB2AikoDDV6e5psiJ+DX3g+LisDTRh93lE4ToMezbbeE9efF4qbIHF0cu6+rZ+2IaV2/J1c2o90WVyK+5uX9nHWKeTkPk8kU4ktVF81KS+IVDqVye+zttrViGnG2WgAc+PzHJDZ2/oM2+mrfbTpP9zTT44ca7nY3o2luOBXH3zjo+uAfCYGzEhfSmnfjt+1G077+C52tT+MPicSppWIzFD5pR+IYPHb1j9MxGjadmJtFcs5ILar+iA4XrEL9gHoq//BRtRfswPyqGRAhzALwT03zGWhfogTDYbE/hQyVOKjmagGWJBqqsMvJHjWN6OVJS3dxqS+Z8ew/1jQwQosfxzpbHuSrnVZ3pHVWk1CH1Fw+IVOUpUzKSoVQk8pSmKpUpIcgZ+T5MRUpryo0iOZFrsKMlmDKVBBBQpZxgzyhPhfkg1Gyaps0xjyQhmctQjORdklBXhawrsDv+ZSoGUh41g10smSsm8lQllKdaV4n+BTVI+QRe6RsxAAAAAElFTkSuQmCC
// @run-at document-end
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addStyle
// @require https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/370174/Grab%20Radio%20101ru.user.js
// @updateURL https://update.greasyfork.org/scripts/370174/Grab%20Radio%20101ru.meta.js
// ==/UserScript==

GM_addStyle(`
#radio_box {
position: fixed;
top: 5%;
left: 50%;
margin-left: -300px;
width: 600px;
background: silver;
border: 1px solid silver;
z-index: 9999;
box-shadow: 4px 4px 8px silver;
z-index: 99999;
}
#names {
background: white;
text-align: center;
padding: 3px;
}
.menu_radios > li {
display: inline-block;
background: #737171;
padding: 0 3px;
border: 1px solid;
margin: 0 2px;
color: white;
font-size: 0.7em;
box-shadow: 2px 2px 5px silver;
cursor: pointer;
user-select: none;
}
.menu_radios > li:hover {
background: #4c1a1a;
}
div#outputs {
padding: 5px;
background: moccasin;
text-align: center;
max-height: 500px;
overflow-y: auto;
}
.selactive{
background: #4c1a1a !important;
}
.main_title, .main_title_small {
padding: 5px;
border: 1px solid;
font-size: 1.3em;
background: #949292;
color: white;
text-align: center;
font-family: cursive;
}
.main_title_small{
font-size: 0.9em;
background: #4a3737;
margin: 15px 0;
}
.box_inner > ul li, #outputs > ul li {
display: inline-block;
padding: 10px;
border: 1px solid;
margin: 10px;
background: #949292;
color: white;
cursor: pointer;
zoom: 0.5;
box-shadow: 8px 8px 20px black;
}
@-moz-document url-prefix() {
.box_inner > ul li, #outputs > ul li {
    width: 170px;
    word-wrap: break-word;
  }
li audio {
    transform: translate(-60px,0) scale(0.6);
}
}
#foot {
text-align: center;
padding: 5px;
background: dimgray;
border-top: 1px solid white;
}
div#box_codes {
position: fixed;
top: 5%;
left: 6%;
background: #d2cccc;
border: 1px solid silver;
text-align: center;
padding: 5px;
opacity: 0.8;
display:none;

}
textarea#texta {
width: 520px;
height: 400px;
}
.box_inner {
display: none;
}
.box_radio {
background: #504f4f;
margin-bottom: 2px;
color: white;
cursor:pointer;
}
.title_ganre {
background: #6f293f;
}
.textarea_info {
background: darkgray;
color: white;
padding: 3px;
}
.textarea_info > div{
float: right;
margin-right: 5px;
color: yellow;
cursor: pointer;
}
`);

(function() {
    'use strict';
    var canavas_img = false,
        radios_count = 0,
        radios_image_load = 0,
        debug = true,
        RadioObj = null

    function loadStorage(){
        let RadioObj_tmp = GM_getValue('RadioObj');

        RadioObj = (RadioObj_tmp) ? JSON.parse(GM_getValue('RadioObj')) : {
            options: {},
            allRadio:{}
        };
        if(debug) console.log(RadioObj)

        return (RadioObj.hasOwnProperty("allRadio") && Object.keys(RadioObj.allRadio).length)?true:false
    }

    function saveToStorage(){
        try{
            var save_data = JSON.stringify(RadioObj);

            if(save_data.length>0 && save_data !== null && save_data !=="" && save_data !== undefined){
                GM_setValue('RadioObj', save_data);
                if(debug) console.log("Сохраненно: ",RadioObj);
            }
        }catch(e){
            console.log(e);
        }
    }

    function ajax(urls){

        return $.ajax(
            {
                url: urls,
                async: false,
                xhrFields: { withCredentials: true},
                success: function(data){
                    return data
                },
                error: function(){
                    return "error"
                }
            }).responseText;
    }

    function getListGenres(data){
        let html = data,
            output ={},
            liEl = $(html).find("div.content__main > ul li"),
            liElLenght = liEl.length

        liEl.each(function(index, el){
            if(index != liElLenght-1) {
                let name = $(this).find("a").text().trim(),
                    link = '//101.ru'+$(this).find("a").attr("href")
                output[name]=({name: name, link: link})
            }
        })
        return output
    }

    function getListRadios(data){
        for(let x in data) {
            let elements = ajax(data[x].link),
                html = $(elements);
            if(!data[x].hasOwnProperty("radio")) data[x].radio = [];
            if(!data[x].hasOwnProperty("clear")) data[x].clear = [];

            $(html).find(".content__main > div.grid.grid_size_m > li").each(function(index,el){
                let name = $(this).find("a.grid__title > span").text(),
                    href = $(this).find("a.grid__title").attr("href"),
                    image = $(this).find("link").attr("href"),

                    json = getJson(href.slice(href.lastIndexOf("/")+1,href.length), true);

                let linksR = [];
                if(!json.includes("Канал не найден")){
                    let jsonP = JSON.parse(json);
                    jsonP = jsonP.result
                    for(let s = 0; s < jsonP.playlist.length; s++){
                        let file = jsonP.playlist[s].file,
                            cut = file.slice(0, file.lastIndexOf("?"));
                        linksR.push(cut)
                    }
                }

                if(json.includes("Канал не найден")){
                    data[x].clear.push({name:name,link:href,image:image, json:json})
                } else {
                    data[x].radio.push({name:name,link:href,image:image, json:linksR})
                    radios_count++
                }
            });
        }
        return data
    }

    function getJson(id, bo){
        let urls = bo ? "//101.ru/api/channel/getServers/"+id+"/channel/AAC/64/?dataFormat=html5" : "//101.ru/api/channel/getServers/"+id+"/channel/MP3/128/",
            otvet = ajax(urls)
        if(otvet.includes("Канал не поддерживает формат AAC")){
            otvet = getJson(id, false);
        }
        return otvet
    }

    function panel_v1(obj){
        let div = $("<div id='radio_box'>"+
                    "<div class='main_title'>Radio List 101.ru</div>"+
                    "<div id='outputs'>Пустой список!</div>"+
                    "<div id='foot'><button onclick=\"$(\'#box_codes\').toggle(\'slow\')\">Получить код</button></div>"+
                    "<div id='box_codes'><textarea id='texta' spellcheck='false'></textarea></div>"+
                    "</div>"),

            outuptCode = ``,

            past = $(div).find("#outputs").empty();

        for(let o in obj){ // Main genres
            let genre = obj[o],
                divA = $("<div class='box_radio'></div>"),
                divB = $("<div class='title_ganre'></div>").text(genre.name).click(function(event){
                    event.stopPropagation();
                    $(this).next(".box_inner").toggle('slow');
                }),
                divC = $("<div class='box_inner'></div>"),
                ul = $("<ul>"),
                text = ""

            for(let i=0;i<genre.radio.length;i++){
                outuptCode += `{\n`

                let radio = genre.radio[i]

                text += '<li><a href="'+radio.link+'" class="noajax" data-tooltip-block="#topchan82">'+
                    '<div class="cover logo" style="background-color: #eeeeee"><img src="'+radio.image+'" alt="'+radio.name+'"></div>'+
                    '<div class="h3 caps htitle">'+radio.name+'</div>'+
                    '</a>';

                outuptCode += `"title":"${radio.name}",\n"artist":"${genre.name} - 101.ru",\n"poster":"${radio.image}",`

                if(canavas_img) outuptCode += `\n"canvas":"${radio.canvasik}",\n`

                for(let s = 0 ; s<radio.json.length;s++){
                    text +='<div>'+radio.json[s]+'</div><audio controls preload="none"><source src="'+radio.json[s]+'" type="audio/mpeg"></source></audio>';
                    outuptCode += `"mp3":"${radio.json[s]}"`
                    if(s < radio.json.length-1) outuptCode += `,\n`
                }
                outuptCode += `\n},\n`

                // if(i < genre.radio.length-1) outuptCode +=  `\n},\n`

                text +='</li>';
            }
            $(ul).html(text)
            divC.append(ul)
            divA.append(divB,divC)
            past.append(divA)
        }
        $("body").append(div)
        $("#texta").val(outuptCode)
    }

    function panelv2_menu(obj){
        let div = $("<div id='radio_box'>"+
                    "<div class='main_title'>Radio List 101.ru</div>"+
                    "<div id='names'><ul class='menu_radios'></ul></div>"+
                    "<div id='outputs'>Пусто, выберите элемент!</div>"+
                    "<div id='foot'><button onclick=\"$(\'#box_codes\').toggle(\'slow\')\">Получить код</button></div>"+
                    "<div id='box_codes'>"+
                    "<div class='textarea_info'><span>None info</span><div onclick=\"$(\'#box_codes\').toggle(\'slow\')\">X</div></div>"+
                    "<textarea id='texta' spellcheck='false'></textarea>"+
                    "</div>"+
                    "</div>"),

            ul_menu = $(div).find(".menu_radios"),

            // All radios
            _liAll = $("<li>").text("Все").attr("title","Все").click(function(){
                $(".menu_radios > li.selactive").removeClass()
                $(this).addClass("selactive")
                $("#outputs").empty();

                let counts = 0
                const r_obj = {radio_list:{}}

                for(let o in obj){
                    const genre = obj[o]

                    counts+= genre.radio.length
                    $("#outputs").append($("<div class='main_title_small'>").text(o))
                    const outuptCode = loadRadioSelected(genre)
                    r_obj.radio_list[genre.name] = outuptCode
                }

                $("#texta").val(JSON.stringify(r_obj))
                $("body").find(".textarea_info > span").text(`Количество радиостанций: ${counts} (Все)`)
            })

        ul_menu.append(_liAll)

        // Make list ganres radios and ouput 1 ganres
        for(let o in obj){
            let genre = obj[o],
                _li = $("<li>").text(o).attr("title",o).click(function(){
                    $(".menu_radios > li.selactive").removeClass()
                    $(this).addClass("selactive")
                    $("#outputs").empty();

                    const outuptCode = loadRadioSelected(genre)
                    $("#texta").val(JSON.stringify({radio_list:{[genre.name]:outuptCode}}))
                    $("body").find(".textarea_info > span").text(`Количество радиостанций: ${genre.radio.length} (${o})`)
                })

            ul_menu.append(_li)
        }
        $("body").append(div)

        // Load default
        $(".menu_radios > li.selactive").removeClass()
        $(ul_menu).find("li:eq(1)").addClass("selactive")
        $("#outputs").empty();

        const outuptCode = loadRadioSelected(obj["Топ каналов"])
        $("#texta").val(JSON.stringify({radio_list:{"Топ каналов":outuptCode}}))
        $("body").find(".textarea_info > span").text(`Количество радиостанций: ${obj["Топ каналов"].radio.length} (Топ каналов)`)

    }

    function loadRadioSelected(genre){
        const ul = $("<ul>")

        let text = ""

        const r_obj = genre.radio.map(({name, image, canvasik, json, link})=>{
            text += '<li><a href="'+link+'" class="noajax" data-tooltip-block="#topchan82">'+
                    '<div class="cover logo" style="background-color: #eeeeee"><img src="'+image+'" alt="'+name+'" width="440px"></div>'+
                    '<div class="h3 caps htitle">'+name+'</div>'+
                    '</a>';

            const data_radio = {title:name, poster: image, mp3: json.map((url)=>{
                text +='<div>'+url+'</div><audio controls preload="none"><source src="'+url+'" type="audio/mpeg"></source></audio>'
                return url
            })}

            if(canavas_img) data_radio.canvas = canvasik;
            return data_radio
        })



        $(ul).html(text)
        $("#outputs").append(ul)

        return r_obj
    }

    function returnCanvas(params){
        let canvas = document.createElement("canvas"),
            ctx = null,
            img = new Image(),
            src = params.src,
            text = params.text,
            color = params.color,
            gradient = params.gradient || [],
            stroke = params.stroke || false,
            shadow = params.shadow || []

        if(text.includes(" ")){
        text = text.split(" ")
        }

        img.crossOrigin = "Anonymous";

        if(src.length && canvas.getContext('2d')){
            ctx = canvas.getContext("2d")

            img.onload = function(){
                if(debug) console.log("Load image: ", src)

                let w = canvas.width = this.width,
                    h = canvas.height = this.height;
                ctx.drawImage(img, 0, 0);

                if(color == null && gradient.length){
                    color = ctx.createLinearGradient(0,0,w,0);
                    for(let col=0;col<gradient.length;col++) color.addColorStop(gradient[col].proc,gradient[col].color);
                }

                ctx.font="20px Verdana";
                ctx.textAlign = 'center';

                if(shadow.length) {
                    ctx.shadowColor = shadow[0];
                    ctx.shadowBlur = shadow[1];
                    ctx.shadowOffsetX = ctx.shadowOffsetY= shadow[2];
                }

                if(stroke){
                    ctx.strokeStyle = color
                    if(Object.prototype.toString.call(text) == "[object Array]"){
                        for(let i=0;i<text.length;i++) ctx.strokeText(text[i], w/2, h/text.length+i*20+text.length)
                    } else {
                    ctx.strokeText(text,w/2,h/2);
                    }
                } else {
                    ctx.fillStyle = color
                    if(Object.prototype.toString.call(text) == "[object Array]"){
                        for(let i=0;i<text.length;i++) ctx.fillText(text[i], w/2, h/text.length+i*20+text.length)
                    } else {
                    ctx.fillText(text,w/2,h/2);
                    }
                }

                if(debug) console.log(canvas.toDataURL("image/png"))

                params.radio.canvasik = canvas.toDataURL("image/png")
                radios_image_load++
                return canvas.toDataURL("image/png")
            }

            img.onerror = function(){
                params.radio.canvasik = src
                return src
            }
            img.src= src
        }
    }

    function convertToCanvas(obj){
        for(let o in obj){ // Main genres
            let genre = obj[o]

            for(let i=0;i<genre.radio.length;i++){
                let radio = genre.radio[i],
                    canvasik

                canvasik = returnCanvas({
                    src: "."+radio.image.slice(radio.image.indexOf("/",7),radio.image.length),
                    text: radio.name,
                    color: null,
                    gradient: [{proc: 0, color: "black"},
                               {proc: 0.5, color: "red"},
                               {proc: 1, color: "black"}],
                    stroke: false,
                    shadow: ["black",10,20],
                    radio: radio
                });
            }
        }
        return obj
    }


    function OBJLengthEmpty(obj){
        return Object.keys(obj).length == 0 ? true : false
    }


    function init(){
        let interval = null,listGanres,listRadios,makePanelObject
        listGanres = getListGenres(ajax("//101.ru/radio-top"))

        if(OBJLengthEmpty(listGanres)){
            throw Error("Список жанров пуст!")
            return false
        }
        if(debug) console.log("Жанры полученны!",listGanres)

        listRadios = getListRadios(listGanres)

        if(OBJLengthEmpty(listRadios)){
            throw Error("Список радиостанций пуст!")
            return false
        }

        makePanelObject = (canavas_img)? convertToCanvas(listRadios): listRadios

        if(canavas_img && OBJLengthEmpty(makePanelObject)){
            throw Error("Список радиостанций, с canvas'ом пуст!")
            return false
        }

        if(debug) console.log("Список радиостанций получен!", "Найдено:", radios_count)

        if(canavas_img){
            interval = setInterval(function(){
                if(radios_image_load == radios_count){
                    if(debug) console.log("Loading images from canvas completed! Count:", radios_image_load)
                    clearInterval(interval)
                    //panel(makePanelObject)
                    if(!RadioObj.hasOwnProperty("allRadio")) RadioObj.allRadio = {};
                    RadioObj.allRadio = makePanelObject
                    saveToStorage()

                    panelv2_menu(makePanelObject)
                } else {
                    if(debug) console.log("Loading images from canvas:", radios_image_load,"/",radios_count)
                }
            }, 2000)
        } else {
            // panel(makePanelObject)
            if(!RadioObj.hasOwnProperty("allRadio")) RadioObj.allRadio = {};
            RadioObj.allRadio = makePanelObject
            saveToStorage()

            panelv2_menu(makePanelObject)
        }

    }

    function grabAgain(){
        if(confirm("Начать грабить 101.ru?")){
            canavas_img = confirm("Внимание:\nПеревести все изображения радиостанций в canvas?\n")
            init()
        }
    }

    if(loadStorage()){
        if(confirm("Загрузить сохраненные радио, с прошлого раза?")){
            if(confirm("Внимание:\nДобавить canvas в коды?\n")){
            if(RadioObj.hasOwnProperty("allRadio") &&
               RadioObj.allRadio.hasOwnProperty("Топ каналов") &&
               RadioObj.allRadio["Топ каналов"].hasOwnProperty("radio") &&
               RadioObj.allRadio["Топ каналов"].radio[0].hasOwnProperty("canvasik")){
                canavas_img = true
            } else {
                alert("Внимание:\nПоле с изображением в canvas не найдено!\nЗагрузка не возможна, начните грабить заново с canvas'ом!")
                canavas_img = false
            }
            }

            panelv2_menu(RadioObj.allRadio)
        } else {
            grabAgain()
        }
    } else {
        grabAgain()
    }
})();
