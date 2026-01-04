// ==UserScript==
// @name         Custom-Skin template
// @name:ja      カスタムスキン テンプレ
// @namespace    https://twitter.com/tannichi1/CustomSkinTemplate
// @version      0.1.0
// @description  Custom-Skin template for OGARio
// @description:ja OGARio のカスタムスキンを作る際のテンプレートを作成します
// @author       tannichi
// @match        https://twitter.com/tannichi1/
// @grant        none
// @require http://code.jquery.com/jquery-1.11.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/31562/Custom-Skin%20template.user.js
// @updateURL https://update.greasyfork.org/scripts/31562/Custom-Skin%20template.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var cfg = {};
    cfg.fontName = "ＭＳ Ｐゴシック";
    cfg.nickFontSize = 90;
    cfg.massFontSize = 130;
    $("#timeline").prepend('<div id="custom-skin-template" style="background-color:white;"></div>');
    var cst = $("#custom-skin-template");
    cst.append('<label title="画像の横サイズを２倍にします。長いニックネーム用。"><input id="cst-s1024" type="checkbox"/>横倍</label>&nbsp;&nbsp;');
    cst.append('<labell title="背景を白で塗りつぶします。非チェックだと透過色になります。"><input id="cst-back-white" type="checkbox" checked/>白背景</label>&nbsp;&nbsp;');
    cst.append('枠: ');
    cst.append('<label title="表示境界の丸を描画きます"><input id="cst-curcle" type="checkbox" checked/>丸</label>&nbsp;&nbsp;');
    cst.append('<label title="画像境界の四角を描画します"><input id="cst-box" type="checkbox"/>四角</label>&nbsp;&nbsp;');
    cst.append('<label title="中心線を描画します"><input id="cst-cross" type="checkbox"/>十字</label>&nbsp;&nbsp;');
    cst.append('<br />');
    cst.append('<label>名前:<input id="cst-nick" type="text" value="ニック?ネーム" maxlength="15"/></label>&nbsp;&nbsp;');
    cst.append('<br />');
    cst.append('<label>質量:<input id="cst-mass" type="text" value="1234" maxlength="15"/></label>&nbsp;&nbsp;');
    cst.append('<br />');
    cst.append('<label><input title="ニックネームと質量に縁取りをします" id="cst-stroke" type="checkbox" checked/>stroke</label>&nbsp;&nbsp;');
    cst.append('<br />');
    cst.append('<button title="描画を実行します" id="cst-draw">描画</button>&nbsp;&nbsp;');
    cst.append('&nbsp;&nbsp;');
    //cst.append('<label><input title="画像変換の際に SVG に変換します。非チェックの場合 PNG に変換します" id="cst-svg" type="checkbox"/>SVG</label>&nbsp;&nbsp;');
    cst.append('<button title="キャンバスから直接画像をコピーできないブラウザのために、画像を生成します" id="cst-convert">画像に変換</button>');
    cst.append('<br />');
    cst.append('<canvas id="cst-canvas" width="512" height="512"></canvas>');
    cst.append('<br />');
    cst.append('<div><img id="cst-image"/></div>');
    $('#cst-draw').click(do_drow);
    $('#cst-convert').click(do_convert);
    var cvs = $("#cst-canvas").get(0);
    function do_drow(){
        cfg.s1024 = $("#cst-s1024").prop('checked');
        cfg.curcle = $("#cst-curcle").prop('checked');
        cfg.box = $("#cst-box").prop('checked');
        cfg.cross = $("#cst-cross").prop('checked');
        cfg.backWhite = $("#cst-back-white").prop('checked');
        cfg.nick = $("#cst-nick").val();
        cfg.mass = $("#cst-mass").val();
        cfg.stroke = $("#cst-stroke").prop('checked');
        cfg.svg = $("#cst-svg").prop('checked');
        console.log("cst: cfg="+ JSON.stringify(cfg));
        var cvs_xSize = 512;
        var cvs_ySize = 512;
        var cvs_xOrg = 0;
        var cvs_yOrg = 0;
        if(cfg.s1024){
            cvs_xSize = 1024;
            cvs_xOrg = 256;
        }
        var cvs_xCenter = cvs_xOrg + 256;
        var cvs_yCenter = cvs_yOrg + 256;
        $(cvs).attr("width", cvs_xSize);
        $(cvs).attr("height", cvs_ySize);
        var ctx = cvs.getContext('2d');
        ctx.beginPath();
        if(cfg.backWhite){
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, cvs_xSize, cvs_ySize);
        }else{
            ctx.clearRect(0, 0, cvs_xSize, cvs_ySize);
        }
        if(cfg.box){
            ctx.strokeRect(cvs_xOrg, cvs_yOrg, 512, 512);
        }
        if(cfg.curcle){
            ctx.arc(cvs_xCenter, cvs_yCenter, 256, 0, Math.PI*2, false);
            ctx.stroke();
        }
        if(cfg.cross){
            ctx.moveTo(cvs_xCenter, 0);
            ctx.lineTo(cvs_xCenter, 512);
            ctx.moveTo(cvs_xOrg, cvs_yCenter);
            ctx.lineTo(cvs_xOrg + 512, cvs_yCenter);
            ctx.stroke();
        }
        ctx.textAlign = "center";
        var drawText = ctx.fillText;
        ctx.fillStyle = "rgb(254, 254, 254)";
        ctx.strokeStyle = "black";
        function fn_drawText(drawText){
            ctx.font = String(cfg.nickFontSize) +"px '"+ cfg.fontName +"'";
            drawText.call(ctx, cfg.nick, cvs_xCenter, cvs_yCenter + (cfg.nickFontSize * 0.2));
            ctx.font = String(cfg.massFontSize) +"px '"+ cfg.fontName +"'";
            drawText.call(ctx, cfg.mass, cvs_xCenter, cvs_yCenter + 128 + (cfg.massFontSize * 0.2));
        }
        fn_drawText(ctx.fillText);
        if(cfg.stroke){
            fn_drawText(ctx.strokeText);
        }
    }
    function do_convert(){
        var type = cfg.svg ? "image/svg+xml" : "image/png";
        var png = cvs.toDataURL(type);
        console.log("image type="+ type);
        $("#cst-image").attr("src", png);
    }
})();