// ==UserScript==
// @name         自由设计
// @namespace    https://gitee.com/zhangsongqiang/userscript/
// @version      1.02
// @description  自由设计网页
// @author       Zhangsq37
// @match        *://*/*
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACtklEQVRYR+2XW0gUYRTH/2dmM4tKd9KQpMjaQYkuEAVBEC4EQVAEzj5ET0ViruRr9OT6EvRa7G6SSE+xGxSBEBTBWhAFRRB0cV036S6pY2pUmztzYtQFLzPrbH6iD83rd/j+v/mfC+cjLPFHS6yP5QmgRFMtYNrFYMWtQ8TmQ72pOuQcz6RE0x0wjffT4+Y4MCmOPBfZSxDQORRUj9mehhIeZUNlDKA6EF3XG32ncnEzAHLiDHQB0hM2zPtuHcgyXv9oVgfmxF9OrfR6ECPgOMC39KAaAIjtAcI9N0B0AkC9HlTb3Yo7xW1se746ky2JMeEoA3eGv30KIOTPTo+f4YA3kkoQUGsa8H8/p3YtBKDsUvdac40UA9ERYnQOGQigWc3MvnNRALxt6RIyzDiAw2C+W+wZDXxp2PvT7oeEA6xr/6h4/vyKA3QIwD1pzAgMnq8Zc3JTKEBFR6o88xtxAvwAP2BZ1oYbto3kS6UwgPJwX4WB8TiIDjKQMIqKtdEzm/T56kgIwPpospJZsnJ+AMyPilaR1n/apiVtaBYM4G1Lb54quP0AHsvs0Qaaqvpna5VG326ReEUChC7HQVRoG5Zc666Sx60/p30AnhKZ2lBj9Wc720uvpGolGQlryA0HVb/tICoEoDzc68tKHCfGHoCfTRXcB6ecCwUoi7yrNmFYOd/NhBemx9BG6mv68hWcMADlamo7TFjiOwC8lJm0gSZf73zVLg4gnAyBpBYAryTI2mBwa3I+cetcGMDERZJZC1m6qZ9V37gRFwrgVnBOG4rugkJBhKWgUOFc/H8AVw4ogley6enyRtIXCeYFgG7rQV+dw0442eP/spTmqw1Jho+Bk9a6BzZbF2Utd1WchJDeqLY6LqW5A2Vi2sk7C3mY5N16mL8C3GP3cFmeTzNXdgoKWnIH/gIJuawwEqXgUAAAAABJRU5ErkJggg==
// @grant    GM_registerMenuCommand
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443799/%E8%87%AA%E7%94%B1%E8%AE%BE%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/443799/%E8%87%AA%E7%94%B1%E8%AE%BE%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    var title = document.title;
    var url = window.location.href;

    console.log(title);
    console.log(url);

    var topwindow_html = document.createElement("div");
    topwindow_html.innerHTML = '<div id="topwindow_btn"></div><div id="topwindow"></div><style> div#topwindow_btn{    width: 32px;    height: 32px;  position: fixed;    z-index: 100001;    top:10%;    left: 90%;}div#topwindow_btn>img{   width: 32px;   height:32px;   border-radius: 16px;   border: 0.3px solid black;   box-shadow: 2px 2px 7px 0px;   transition: 0.5s;}div#topwindow_btn img:hover{   box-shadow: 4px 4px 20px 0px;}div#topwindow{   width: 400px;   height: 600px;   opacity: 0.5;   border-radius: 16px;   border: 1px solid black;   background-color: lightgray;   z-index: 100000;   position: fixed;   top:10%;   left: calc(90% - 368px);   resize:vertical;   overflow: hidden;}<\style>';

    document.body.appendChild(topwindow_html);
    //document.body.appendChild(css);

    var btn = document.querySelector("div#topwindow_btn");
    btn.innerHTML = '<img alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACtklEQVRYR+2XW0gUYRTH/2dmM4tKd9KQpMjaQYkuEAVBEC4EQVAEzj5ET0ViruRr9OT6EvRa7G6SSE+xGxSBEBTBWhAFRRB0cV036S6pY2pUmztzYtQFLzPrbH6iD83rd/j+v/mfC+cjLPFHS6yP5QmgRFMtYNrFYMWtQ8TmQ72pOuQcz6RE0x0wjffT4+Y4MCmOPBfZSxDQORRUj9mehhIeZUNlDKA6EF3XG32ncnEzAHLiDHQB0hM2zPtuHcgyXv9oVgfmxF9OrfR6ECPgOMC39KAaAIjtAcI9N0B0AkC9HlTb3Yo7xW1se746ky2JMeEoA3eGv30KIOTPTo+f4YA3kkoQUGsa8H8/p3YtBKDsUvdac40UA9ERYnQOGQigWc3MvnNRALxt6RIyzDiAw2C+W+wZDXxp2PvT7oeEA6xr/6h4/vyKA3QIwD1pzAgMnq8Zc3JTKEBFR6o88xtxAvwAP2BZ1oYbto3kS6UwgPJwX4WB8TiIDjKQMIqKtdEzm/T56kgIwPpospJZsnJ+AMyPilaR1n/apiVtaBYM4G1Lb54quP0AHsvs0Qaaqvpna5VG326ReEUChC7HQVRoG5Zc666Sx60/p30AnhKZ2lBj9Wc720uvpGolGQlryA0HVb/tICoEoDzc68tKHCfGHoCfTRXcB6ecCwUoi7yrNmFYOd/NhBemx9BG6mv68hWcMADlamo7TFjiOwC8lJm0gSZf73zVLg4gnAyBpBYAryTI2mBwa3I+cetcGMDERZJZC1m6qZ9V37gRFwrgVnBOG4rugkJBhKWgUOFc/H8AVw4ogley6enyRtIXCeYFgG7rQV+dw0442eP/spTmqw1Jho+Bk9a6BzZbF2Utd1WchJDeqLY6LqW5A2Vi2sk7C3mY5N16mL8C3GP3cFmeTzNXdgoKWnIH/gIJuawwEqXgUAAAAABJRU5ErkJggg==">';
    var topwindow = document.querySelector("div#topwindow");
    topwindow.style.visibility = "hidden";



    document.onkeydown = handlekey;
    function handlekey(event) {
        // 当然还要组织浏览器的默认事件

        var key = event.code;
        var hasAltKey = event.altKey;
        if (hasAltKey && key == "KeyC") {
            btn_clicked();
            return false;
        }
    }

    btn.onclick = btn_clicked;

    function btn_clicked(){
        if(document.designMode=="on"){
            // topwindow.style.visibility = "hidden";
            //关闭窗口函数
            document.designMode="off";
            document.onclick=undefined;
            btn.title ="点击进入编辑模式";
            btn.innerHTML = '<img alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACtklEQVRYR+2XW0gUYRTH/2dmM4tKd9KQpMjaQYkuEAVBEC4EQVAEzj5ET0ViruRr9OT6EvRa7G6SSE+xGxSBEBTBWhAFRRB0cV036S6pY2pUmztzYtQFLzPrbH6iD83rd/j+v/mfC+cjLPFHS6yP5QmgRFMtYNrFYMWtQ8TmQ72pOuQcz6RE0x0wjffT4+Y4MCmOPBfZSxDQORRUj9mehhIeZUNlDKA6EF3XG32ncnEzAHLiDHQB0hM2zPtuHcgyXv9oVgfmxF9OrfR6ECPgOMC39KAaAIjtAcI9N0B0AkC9HlTb3Yo7xW1se746ky2JMeEoA3eGv30KIOTPTo+f4YA3kkoQUGsa8H8/p3YtBKDsUvdac40UA9ERYnQOGQigWc3MvnNRALxt6RIyzDiAw2C+W+wZDXxp2PvT7oeEA6xr/6h4/vyKA3QIwD1pzAgMnq8Zc3JTKEBFR6o88xtxAvwAP2BZ1oYbto3kS6UwgPJwX4WB8TiIDjKQMIqKtdEzm/T56kgIwPpospJZsnJ+AMyPilaR1n/apiVtaBYM4G1Lb54quP0AHsvs0Qaaqvpna5VG326ReEUChC7HQVRoG5Zc666Sx60/p30AnhKZ2lBj9Wc720uvpGolGQlryA0HVb/tICoEoDzc68tKHCfGHoCfTRXcB6ecCwUoi7yrNmFYOd/NhBemx9BG6mv68hWcMADlamo7TFjiOwC8lJm0gSZf73zVLg4gnAyBpBYAryTI2mBwa3I+cetcGMDERZJZC1m6qZ9V37gRFwrgVnBOG4rugkJBhKWgUOFc/H8AVw4ogley6enyRtIXCeYFgG7rQV+dw0442eP/spTmqw1Jho+Bk9a6BzZbF2Utd1WchJDeqLY6LqW5A2Vi2sk7C3mY5N16mL8C3GP3cFmeTzNXdgoKWnIH/gIJuawwEqXgUAAAAABJRU5ErkJggg==">';
        }
        else{
            // topwindow.style.visibility = "visible";
            //打开窗口函数
            document.designMode="on";

            document.onclick=function(e){return false};
            btn.title = "点击关闭编辑模式";

            btn.innerHTML = '<img alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABg0lEQVRYR+2WPUvDUBSG3xubq5SgDi4GjKVa8AMHreDSwcXFxUHwRyb+DqeKU1pKFKSrizg4pE2uXDEQQpL7EU2KNGNy7nkfzjnvzSFo+CEN62MJsLgVGDtmv0VnQe8ZH1Xm5KmDTSumdm8ajvLy5FYgcOhRBPgE8A3gruiwCIzniQGXAccM7PxwOnvMnilswdih9wS41YVIi/Mcn0Y4OH3FuzTAsA/TeqMegBtViKx4WRVLh3Boo221viGuZSFUxHk1hC546WIjnJseAbkSQaiKSwHwoImNrXjF9Aghl0UQOuLSADxwtNveNljkAmyQhdAVVwLgwX53zTGi2CUMFwkEf59YTdQi6XugzN/BzupeRJgL4IwL8ljucx1x5QokYJMOPWAxOMTJTxLtC0vogrxqpHteO0B24GptQd601zaEZVb7cxvKCMjEaNlQJbFKbAJT6gKdhKpnCgFUE6XLq3I2fyPax3oc0ocqN1ylhWRBVrIGl1LRsvmb37X+BUuAf1WBLyV/LzC+xXOdAAAAAElFTkSuQmCC">';
        }


    }
    //topwindow是窗口节点元素，宽400px；高600px
})();