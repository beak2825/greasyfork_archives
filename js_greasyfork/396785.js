// ==UserScript==
// @name     Dod DrawIt mod
// @version  2.4
// @description Εμφανίζει παλέτα με όλα τα χρώματα για τη ζωγραφική. Ενεργοποίηση/Απενεργοποίηση πατώντας τη περισπωμένη (~). Καθώς ζωγραφίζεις πάτα τους αριθμούς 1-4 για να αλλάξει μέγεθος το μολύβι.
// @match    https://www.dod.gr/*
// @match    https://apps.facebook.com/dodcommunity/*
// @grant    unsafeWindow
// @grant    GM_addStyle
// @grant    GM_getResourceText
// @grant    GM_getResourceURL
// @require  https://cdn.jsdelivr.net/gh/taufik-nurrohman/color-picker@73789b1469dcaa0ffb8b42c02c37f354b71a9546/color-picker.min.js
// @resource  colorpickerCSS https://cdn.jsdelivr.net/gh/taufik-nurrohman/color-picker@73789b1469dcaa0ffb8b42c02c37f354b71a9546/color-picker.min.css
// @resource  paletteImg https://i.postimg.cc/5ynWxzGK/palette.png
// @namespace https://greasyfork.org/users/448863
// @downloadURL https://update.greasyfork.org/scripts/396785/Dod%20DrawIt%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/396785/Dod%20DrawIt%20mod.meta.js
// ==/UserScript==


window.addEventListener('load', function(event){
    console.log('Dod DrawIt Mods');
    GM_addStyle(GM_getResourceText("colorpickerCSS"));
    unsafeWindow.$("head").append(`<style type="text/css">
.color-view {
display: block;
overflow: hidden;
width: 100%;
height: 50px;
border-radius: 0px 0px 10px 10px;
}
#colorpicker-container {
position: absolute;
z-index: 9;
text-align: center;
z-index: 10000;
}
#colorpicker-header {
padding: 10px;
cursor: move;
z-index: 10;
background-color: #3C3F4282;
color: #fff;
height: 30px;
border-radius: 10px 10px 0 0;
font-size: 10px;
}
.color-picker {
border-radius: 10px;
font-size: 20px;
}
.color-picker-h{
background-image: linear-gradient(to bottom,white 0%, black 100%);
}
.color-picker-sv{
width: 400px;
height: 200px;
background-image: url("${GM_getResourceURL('paletteImg')}");
}</style>`);

    document.addEventListener('keypress', function(e){
        if(e.code === "Backquote"){
            let game = unsafeWindow.Engine.MANAGERS.loadManager.getLoadQueueApplicationByName('drawit');
            if (game == null) return; game = game.instance;
            console.log("toggling color picker");
            let container = document.getElementById("colorpicker-container");
            if(container != null) {container.remove(); return;}
            unsafeWindow.$('#engineMain').append(`<div id="colorpicker-container"></div>`);
            container = document.getElementById("colorpicker-container");
            let picker = new CP(container, false, container);
            picker.self.classList.add('static');
            picker.enter();

            let preview = document.createElement('span');
            preview.className = 'color-view';
            picker.self.appendChild(preview);
            let header = document.createElement('span');
            header.className = 'color-view';
            header.id = "colorpicker-header";
            header.innerHTML = "Color Picker";
            dragElement(container, header);
            picker.self.insertBefore(header, picker.self.firstChild);

            let canvas = document.createElement("canvas"); canvas.width = 400; canvas.height = 200;
            let ctx = canvas.getContext("2d");
            let img = document.createElement("img");
            let leftPanel = document.getElementsByClassName("color-picker-sv")[0];
            let rightPanel = document.getElementsByClassName("color-picker-h")[0];
            let imgData = window.getComputedStyle(leftPanel).getPropertyValue("background-image");
            img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            img.src = imgData.substring(5, imgData.length-2);

            picker.on("change:sv", function() {
                let rgbArr = getPixelColor();
                preview.style.backgroundColor = "rgb(" + rgbArr[0] + "," + rgbArr[1] + "," + rgbArr[2] + ")";
            });
            picker.on("stop:sv", function() {
                if(!game.youAreTheArtist) return;
                let rgbArr = getPixelColor();
                setGameColor(rgbArr);
            });

            picker.on("change:h", function() {
                let r = rightPanel.getBoundingClientRect();
                let brightness = clamp(Math.floor(255*(1 - (unsafeWindow.event.clientY - r.top)/r.height)), 0, 255);
                preview.style.backgroundColor = "rgb(" + brightness + "," + brightness + "," + brightness + ")";
            });
            picker.on("stop:h", function() {
                if(!game.youAreTheArtist) return;
                let r = rightPanel.getBoundingClientRect();
                let brightness = clamp(Math.floor(255*(1 - (unsafeWindow.event.clientY - r.top)/r.height)), 0, 255);
                setGameColor([brightness,brightness,brightness]);
            });

            function getPixelColor(){
                let r = leftPanel.getBoundingClientRect();
                let x = clamp(canvas.width*(unsafeWindow.event.clientX - r.left)/r.width, 0, canvas.width - 1);
                let y = clamp(canvas.height*(unsafeWindow.event.clientY - r.top)/r.height, 0, canvas.height - 1);
                let rgba = ctx.getImageData(x, y, 1, 1).data;
                return [(rgba[0]<16?16:rgba[0]), rgba[1], rgba[2]];
            }

            function setGameColor(rgbArr){
                let colorValue = (rgbArr[0] << 16) + (rgbArr[1] << 8) + rgbArr[2];
                let colorStringPadded = colorValue.toString().padStart(6,'0');
                game.setColor(colorStringPadded);
                unsafeWindow.$('#molivaki>#pencil>').removeClass().addClass('pencil_default_mauro');
            }

            function clamp(val, min, max) {
                return val > max ? max : val < min ? min : val;
            }

        } else if(!isNaN(e.key) && e.key <= 4){
            let game = unsafeWindow.Engine.MANAGERS.loadManager.getLoadQueueApplicationByName('drawit');
            if (game == null || !game.instance.youAreTheArtist) return;
            game.instance.setSize(e.key);
        }
    });

    function dragElement(elmnt,header) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
});