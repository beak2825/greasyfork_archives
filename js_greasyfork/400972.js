// ==UserScript==
// @name Spacom: Compass
// @description Порождение Тьмы
// @author toa
// @license MIT
// @version 1.0.0
// @grant GM_setValue
// @grant GM_getValue
// @match        https://spacom.ru/?act=game/map*
// @run-at       document-end
// @namespace https://greasyfork.org/users/10556
// @downloadURL https://update.greasyfork.org/scripts/400972/Spacom%3A%20Compass.user.js
// @updateURL https://update.greasyfork.org/scripts/400972/Spacom%3A%20Compass.meta.js
// ==/UserScript==

(function (window, undefined) {

    var w;
    if (typeof unsafeWindow != undefined) {
        w = unsafeWindow
    } else {
        w = window;
    }

    if (w.self != w.top) { return; }
    if (!w.compass) { w.compass = {}; }

    function getUserData(name){
        return JSON.parse(GM_getValue(name, "{}"));
    }

    function setUserData(name, data){
        GM_setValue(name, JSON.stringify(data));
    }

    function create_compass(){
        let dop_buttom = `<div id = 'dark_compass'
        style = 'position: fixed; z-index: 200; color: rgb(240, 252, 104); top: 40px; right: 5px; width: 110px; padding: 5px'>
        <div id="compass_help" title = "Help" style = "position: absolute; top: 0px; right: 0; width: 20px; height: 20px; font-size: 20px; cursor: pointer"><span><i class="fa fa-info-circle"></i></span></div>
        <svg version="1.1" id = 'svg_compass' title = "Показать метки" style = 'cursor: pointer' width="94.144058" height="106.87462" viewBox="0 0 94.144058 106.87462">
        <g transform="translate(-52.328439,-332.16621)">
        <path
        fill="#6666CC" fill-opacity="0.3" stroke="#CCCC66" stroke-opacity="0.5"
        d="m 99.400721,332.37406 a 46.864344,46.864344 0 0 0 -46.864434,46.86446 46.864344,46.864344 0 0 0 22.620378,40.03844 H 64.898859 v 19.55602 h 69.003221 v -19.55602 h -10.23233 a 46.864344,46.864344 0 0 0 22.5949,-40.03844 46.864344,46.864344 0 0 0 -46.863929,-46.86446 z"
        id="rect4520"
        inkscape:connector-curvature="0" />
            <text
        fill = "#CCCC66"
        x="98.999626"
        y="434.60361"
        id="ssdvsdv"><tspan
        sodipodi:role="line"
        id="dark_dist"
        x="98.999626"
        y="434.60361"
        style="font-size:12px;text-align:center;text-anchor:middle;stroke-width:0.62762702">---</tspan></text>
            <path
        style="transform-box: fill-box;transform-origin: 50% 50%"
        d="m 117.14611,406.80041 -17.990186,-19.65429 -17.990192,19.65429 8.995097,-29.16294 8.995095,-29.16298 8.995096,29.16298 z"
        fill = "#969696" id="compass" />
        </g></svg>
        <div id = "compass_list" style = "display: none">
        <div><i id="set_target_compass" style = "cursor: pointer" title = "Установить координаты" class="fa fa-dot-circle-o"></i>  <input style = "width: 80px" type="text" id="cur_target" value="---:---"></div>
        <div><input style = "width: 80px;font-size: 15px; background-color: #222;" type="text" id="coment_target" placeholder="Название" value="">  <i id="set_mark_compass" style = "cursor: pointer" title = "Поставить метку" class="fa fa-rocket"></i>
        </div></div></div>`;
        $("#radar + div").last().after(dop_buttom);
    }

    $("#map_container").mousemove(function(e){
        if (!e.buttons) return true;
        let coords = $("#cur_target").val();
        let reg_pars = coords.match(/(\d+):(\d+)/);
        if(reg_pars === null) {
            $("#compass").attr("fill", "#969696");
            return true;
        }
        let x_vizCentr = -scene.viewportTransform[4] + base_width/2;
        let y_vizCentr = -scene.viewportTransform[5] + base_height/2;
        let coord_target = returnXYbyCenter(x_vizCentr, y_vizCentr);
        compass.dark.curent_x = coord_target.x;
        compass.dark.curent_y = coord_target.y;
        compass.dark.rulez_set();
    });

    $(document).on("click", "#svg_compass", function(){ $("#compass_list").toggle();});

    $(document).on("click", "#compass_help", function(){
        let text = `<b>Как сим творением пользоваться?</b><br />
Чтобы активировать компас, достаточно один раз нажать по нему. Появится дополнительное поле и список имеющихся отметок.<br />
Координаты для отметки можно указать двумя способами: <br />либо ввести их вручную в поле прямо под компасом (вида '---:---'), <br />либо нажать на зеленую круглую кнопку рядом с этим полем.<br />
В случае, если выбран какой-нибудь флот или система, в указанное поле автоматически подставятся координаты этого объекта.<br />Если же никакой объект не выбран, то подставятся те координаты, на которых расположен текущий вид.<br />
Чтобы сохранить выбранную отметку, необходимо ввести для нее наименование в поле 'название',<br />после чего нажать на значок в форме ракеты. Эта метка будет запомнена, и появится в списке под компасом.<br />
Нажав на запомненную метку, компас укажет направление к ней и расстояние до нее.<br />
При зажатом CTRL компас спозиционирует карту на вашей метке.<br />
Чтобы удалить запомненную метку, необходимо нажать на ее название в списке, удерживая зажатой клавишу Alt.`;
        w.showSmallMessage(text);
    });

    $(document).on("click", "#set_mark_compass", function(){
            let coords = $("#cur_target").val();
            let reg_pars = coords.match(/(\d+):(\d+)/);
            if(reg_pars === null) return true;
            let coment = $("#coment_target").val();
            coment.trim();
            if(coment.length == 0) return true;
            compass.dark.set_mark({'x':Number(reg_pars[1]), 'y':Number(reg_pars[2]), 'coment':coment });
        });

    $(document).on("change", "#cur_target", function(){
        let coords = $(this).val();
        let reg_pars = coords.match(/(\d+):(\d+)/);
        if(reg_pars === null) {
            $("#compass").attr("fill", "#969696");
            return true;
        }
        let x_vizCentr = -scene.viewportTransform[4] + base_width/2;
        let y_vizCentr = -scene.viewportTransform[5] + base_height/2;
        let coord_target = returnXYbyCenter(x_vizCentr, y_vizCentr);
        compass.dark.target_x = Number(reg_pars[1]);
        compass.dark.target_y = Number(reg_pars[2]);
        compass.dark.curent_x = coord_target.x;
        compass.dark.curent_y = coord_target.y;
        compass.dark.rulez_set();
    });

    $(document).on("click", "#set_target_compass", function(e){
        let x_vizCentr = -scene.viewportTransform[4] + base_width/2;
        let y_vizCentr = -scene.viewportTransform[5] + base_height/2;
        let coord_target = returnXYbyCenter(x_vizCentr, y_vizCentr);
        if($("#coordinates_row").css("display") !== undefined){
            let url = document.location.href;
            let reg_pars = url.match(/(\d+):(\d+)$/);
            coord_target.x = Number(reg_pars[1]);
            coord_target.y = Number(reg_pars[2]);
        }
        $("#cur_target").val(coord_target.x+":"+coord_target.y);
        compass.dark.target_x = coord_target.x;
        compass.dark.target_y = coord_target.y;
        x_vizCentr = -scene.viewportTransform[4] + base_width/2;
        y_vizCentr = -scene.viewportTransform[5] + base_height/2;
        coord_target = returnXYbyCenter(x_vizCentr, y_vizCentr);
        compass.dark.curent_x = coord_target.x;
        compass.dark.curent_y = coord_target.y;
        compass.dark.rulez_set();
    });

    $(document).on("click", ".compass_mark", function(e){
        let title = $(this).attr('title');
        if(e.altKey){
            compass.dark.text_mark[title].remove();
            compass.dark.coord_mark[title].remove();
            delete compass.dark.user_mark[title];
            scene.renderAll();
            setUserData('mark'+server_id, compass.dark.user_mark);
            $(this).remove();
            return true;
        }
        let zapis = compass.dark.user_mark[title];
        if(e.ctrlKey) {
            let mark = compass.dark.user_mark[title];
            clickXY(mark.x, mark.y);
        }
        $("#cur_target").val(title);
        $("#coment_target").val(zapis.coment);
        $("#cur_target").change();
    });

    $(document).on("click", 'a[onclick ^= "clickXY"]',function(e){
        let coords = $("#cur_target").val();
        let reg_pars = coords.match(/(\d+):(\d+)/);
        if(reg_pars === null) {
            $("#compass").attr("fill", "#969696");
            return true;
        }
        let x_vizCentr = -scene.viewportTransform[4] + base_width/2;
        let y_vizCentr = -scene.viewportTransform[5] + base_height/2;
        let coord_target = returnXYbyCenter(x_vizCentr, y_vizCentr);
        compass.dark.curent_x = coord_target.x;
        compass.dark.curent_y = coord_target.y;
        compass.dark.rulez_set();
    });

    $(document).on("click", 'button[onclick ^= "setXYtoCenter"]',function(e){
        let coords = $("#cur_target").val();
        let reg_pars = coords.match(/(\d+):(\d+)/);
        if(reg_pars === null) {
            $("#compass").attr("fill", "#969696");
            return true;
        }
        let x_vizCentr = -scene.viewportTransform[4] + base_width/2;
        let y_vizCentr = -scene.viewportTransform[5] + base_height/2;
        let coord_target = returnXYbyCenter(x_vizCentr, y_vizCentr);
        compass.dark.curent_x = coord_target.x;
        compass.dark.curent_y = coord_target.y;
        compass.dark.rulez_set();
    });

    $(document).on("click", '#radar',function(e){
        let coords = $("#cur_target").val();
        let reg_pars = coords.match(/(\d+):(\d+)/);
        if(reg_pars === null) {
            $("#compass").attr("fill", "#969696");
            return true;
        }
        let x_vizCentr = -scene.viewportTransform[4] + base_width/2;
        let y_vizCentr = -scene.viewportTransform[5] + base_height/2;
        let coord_target = returnXYbyCenter(x_vizCentr, y_vizCentr);
        compass.dark.curent_x = coord_target.x;
        compass.dark.curent_y = coord_target.y;
        compass.dark.rulez_set();
    });

    compass.dark = {
        coord_mark: null,
        text_mark: null,
        user_mark: null,
        curent_x: null,
        curent_y: null,
        target_x: null,
        target_x: null,

        bild_list: function(){
            for(let coor_txt in this.user_mark){
                let mark = this.user_mark[coor_txt];
                let center = getCenterXY(mark.x, mark.y);
                $("#compass_list").append('<div class="compass_mark" style="cursor: pointer" title="'+coor_txt+'">'+mark.coment+'</div>');
                this.coord_mark[coor_txt] = new fabric.Path(
                    'M 10 10 l 20 20 m 0 -20 l -20 20',
                    { stroke: '#CACACA',
                     strokeWidth: 2,
                     opacity: 0.8,
                     left:  center.x,
                     top: center.y,
                     selectable: false,
                     fill: 'rgb(252, 104, 158)'});
                scene.add(this.coord_mark[coor_txt]);
                scene.sendToBack(this.coord_mark[coor_txt]);
                this.text_mark[coor_txt] = new fabric.Text(mark.coment, {
                    left:  center.x,
                    top: center.y+20,
                    fontSize: 15,
                    fontWeight: 'bold',
                    selectable: false,
                    opacity: 0.8,
                    fill: 'rgb(252, 104, 158)'
                });
                scene.add(this.text_mark[coor_txt]);
                scene.sendToBack(this.text_mark[coor_txt]);
            };
            scene.renderAll();
        },

        set_mark: function(mark)
        {
            let coor_txt = mark.x+":"+mark.y;
            this.user_mark[coor_txt] = mark;
            let center = getCenterXY(mark.x, mark.y);
            if(this.coord_mark[coor_txt] == undefined){
                $("#compass_list").append('<div class="compass_mark" style="cursor: pointer" title="'+coor_txt+'">'+mark.coment+'</div>');
                this.coord_mark[coor_txt] = new fabric.Path(
                    'M 10 10 l 20 20 m 0 -20 l -20 20',
                    { stroke: '#CACACA',
                     strokeWidth: 2,
                     opacity: 0.8,
                     left:  center.x,
                     top: center.y,
                     selectable: false,
                     fill: 'rgb(252, 104, 158)'});
                scene.add(this.coord_mark[coor_txt]);
                scene.sendToBack(this.coord_mark[coor_txt]);
                this.text_mark[coor_txt] = new fabric.Text(mark.coment, {
                    left:  center.x,
                    top: center.y+20,
                    fontSize: 15,
                    fontWeight: 'bold',
                    selectable: false,
                    opacity: 0.8,
                    fill: 'rgb(252, 104, 158)'
                });
                scene.add(this.text_mark[coor_txt]);
                scene.sendToBack(this.text_mark[coor_txt]);
                scene.renderAll();
                setUserData('mark'+server_id, this.user_mark);
            };
        },

        rulez_set: function()
        {
            let x1 = this.curent_x;
            let y1 = this.curent_y;
            let x2 = this.target_x;
            let y2 = this.target_y;

            let dis = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            let angl = Math.round(Math.acos((y1 - y2) / dis) / Math.PI * 180);
            let color = "#A60000";
            if (dis > 5) color = "#008500";
            $("#compass").attr("fill", color);

            if ((x1 - x2 > 0 && y1 - y2 < 0) || (x1 - x2 > 0 && y1 - y2 > 0)) {  angl = 180 + (180 - angl); }
            document.querySelector('tspan').textContent = Math.round(dis)+" св/л";
            $("#compass").attr('transform', "rotate("+angl+")");
        },

        init: function(){
            create_compass();
            this.coord_mark = {};
            this.text_mark = {};
            this.user_mark = getUserData('mark'+server_id);
            this.bild_list();
        }
    };

    if (w.map) {
		compass.dark.init();
	}

})(window);