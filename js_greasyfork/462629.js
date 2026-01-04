// ==UserScript==
// @name         FF Scheduler The-West
// @namespace    http://tampermonkey.net/
// @version      1.00
// @description  FF Scheduler for The-West online game
// @author       ra1g
// @license      MIT
// @include      https://*.the-west.*/game.php*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAACjUlEQVR4nGNgGAWjYDADJSU9MVcz29JQZ6+tEW7eO0nBID3OZralKioGomRZ7mfrHB1n6/h1s4fn/+tBgf9vk4hBejZ6eP6PtXX6GmTnGEWS5SoqBqIgy5+FBv9/ERaCiSPD/79rrPn/pjj//5uiPDCNVV1YyH+QGSCzSAoJdwu7MpDPcRkKwu/bGlEwPrU7vbz/u9s4tRPtgFAHt51XAgNwGviusfb/+/bG/++a6/5/6OsEO+BtXSVO9dcCA/6HOLjtJtoBwQ5ue28EBeL1FSkYZBbITKId4GzrsmtRfe3/te0tYPxk3bL/5+fN/H91yVy42LqO1v8PVy+B8/FhkFnuDp6biHaAk7Pnyjev7/+/d+/y/39/31OEQWaAzAKZSbIDtm3fgNXQnTs3gekdOzb+7+hoR8EnTx5EUXvzxlnqOmDT5jX/IyPjwOyi4pL/794+/P/+3SMwPnXq0P+p0yajqAeZQVUHzJ03+39hYRGY3dvb/f/vn3dwudbWlv/3719BUf/i+R3qR0Eh1AHI+Pmz2/8bGuoxo2vXZvo4oK6u7v/DB9cwxKkeBf+wOODRw2v/m5ubsaqliwMqq6r/P3t6e2AccPfOxf/t7W04ywGaO6C0tOz/q5d3qewAF88loOyDywGLFs8H0z++v/y/ePECvCUhyAyQA51dvJYT7QATE5usw4d3/Vu/YdX/Xz9fE13somOQXpAZJ04e+Gdp7VhDtANUVAxEQ8Oi7n/98uz/ho2rwUXuocO7SMIgPSC9374+/x8cEnmf5KaZlZ2jH8gRp04f+geKQ1hxSywG6Tl56uC/kNCo+yCzSLIcBkCuBgWdu4fvUi+vgBWkYJAeKxunarIbpaNgFDDQCQAA4wuBo/w2IVQAAAAASUVORK5CYII=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462629/FF%20Scheduler%20The-West.user.js
// @updateURL https://update.greasyfork.org/scripts/462629/FF%20Scheduler%20The-West.meta.js
// ==/UserScript==

(function() {

    FFScheduler = {};
    FFScheduler.createMenuIcon = function() {
        let menuImage64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAACjUlEQVR4nGNgGAWjYDADJSU9MVcz29JQZ6+tEW7eO0nBID3OZralKioGomRZ7mfrHB1n6/h1s4fn/+tBgf9vk4hBejZ6eP6PtXX6GmTnGEWS5SoqBqIgy5+FBv9/ERaCiSPD/79rrPn/pjj//5uiPDCNVV1YyH+QGSCzSAoJdwu7MpDPcRkKwu/bGlEwPrU7vbz/u9s4tRPtgFAHt51XAgNwGviusfb/+/bG/++a6/5/6OsEO+BtXSVO9dcCA/6HOLjtJtoBwQ5ue28EBeL1FSkYZBbITKId4GzrsmtRfe3/te0tYPxk3bL/5+fN/H91yVy42LqO1v8PVy+B8/FhkFnuDp6biHaAk7Pnyjev7/+/d+/y/39/31OEQWaAzAKZSbIDtm3fgNXQnTs3gekdOzb+7+hoR8EnTx5EUXvzxlnqOmDT5jX/IyPjwOyi4pL/794+/P/+3SMwPnXq0P+p0yajqAeZQVUHzJ03+39hYRGY3dvb/f/vn3dwudbWlv/3719BUf/i+R3qR0Eh1AHI+Pmz2/8bGuoxo2vXZvo4oK6u7v/DB9cwxKkeBf+wOODRw2v/m5ubsaqliwMqq6r/P3t6e2AccPfOxf/t7W04ywGaO6C0tOz/q5d3qewAF88loOyDywGLFs8H0z++v/y/ePECvCUhyAyQA51dvJYT7QATE5usw4d3/Vu/YdX/Xz9fE13somOQXpAZJ04e+Gdp7VhDtANUVAxEQ8Oi7n/98uz/ho2rwUXuocO7SMIgPSC9374+/x8cEnmf5KaZlZ2jH8gRp04f+geKQ1hxSywG6Tl56uC/kNCo+yCzSLIcBkCuBgWdu4fvUi+vgBWkYJAeKxunarIbpaNgFDDQCQAA4wuBo/w2IVQAAAAASUVORK5CYII=';
        let menuDiv = $('<div class="ui_menucontainer" />');
        let openCalc = $('<div id="FFScheduler" class="menulink" onclick=FFScheduler.openWindow(); title="FF Scheduler" />').css('background-image', 'url(' + menuImage64 + ')');
        $('#ui_menubar').append((menuDiv).append(openCalc).append('<div class="menucontainer_bottom" />'));
    };
    FFScheduler.selectTab = function(key) {
        FFScheduler.window.tabIds[key].f(FFScheduler.window,key);
    };
    FFScheduler.removeActiveTab = function(window) {
        $('div.tw2gui_window_tab', window.divMain).removeClass('tw2gui_window_tab_active');
    };
    FFScheduler.addActiveTab = function(key,window) {
        $('div._tab_id_' + key, window.divMain).addClass('tw2gui_window_tab_active');
    };
    FFScheduler.removeWindowContent = function() {
        $(".FFSchedulerwindow").remove();
    };

    FFScheduler.FFSchedScreen = function() {
        let worldId = (window.location.href).substring(8, (window.location.href).indexOf('.'));
        let html = $("<div id=\'xp_calc'\ style = \'padding:0px;'\><iframe src='https://themodern.quest/schedule.html?name="+Character.name+"&worldId="+worldId+"&worldname="+Game.worldName+"' height='380' width=540' title='FFScheduler'></iframe> </div>");
        return html;
    }

    FFScheduler.openWindow = function() {
        let window = wman.open("FFScheduler").setResizeable(false).setMinSize(600, 480).setSize(600, 480).setMiniTitle("FF Scheduler");
        let tabs = {
            "ffsched":"FF Schedules"
        };
        let switchTabs = function(win,id) {
            let content = $('<div class=\'FFSchedulerwindow\'/>');
            switch(id) {
                case "ffsched":
                    FFScheduler.removeActiveTab(this);
                    FFScheduler.removeWindowContent();
                    FFScheduler.addActiveTab("ffsched",this);
                    content.append(FFScheduler.FFSchedScreen());
                    FFScheduler.window.appendToContentPane(content);
                    break;
            }
        }
        for(let tab in tabs) {
            window.addTab(tabs[tab],tab,switchTabs);
        }
        FFScheduler.window = window;
        FFScheduler.selectTab("ffsched");
    };
    $(document).ready(function() {
        try{
            FFScheduler.createMenuIcon();
        }catch(e) {
            console.log("Error: "+ e);
        }
    });
})();