// ==UserScript==
// @name         BezpiecznyKlucz 500+
// @version      0.9
// @description  System generaowania obrazów z tekstu.
// @author       tRNA
// @license      GNU AGPLv3
// @match        http://*.wykop.pl/*
// @namespace    https://greasyfork.org/pl/users/56863
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22487/BezpiecznyKlucz%20500%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/22487/BezpiecznyKlucz%20500%2B.meta.js
// ==/UserScript==
(function(r,k){"function"==typeof define&&define.amd?define([],k):"object"==typeof exports?module.exports=k():r.download=k()})(this,function(){return function k(a,b,g){function q(p){var a=p.split(/[:;,]/);p=a[1];var a=("base64"==a[2]?atob:decodeURIComponent)(a.pop()),d=a.length,b=0,c=new Uint8Array(d);for(b;b<d;++b)c[b]=a.charCodeAt(b);return new f([c],{type:p})}function l(a,b){if("download"in d)return d.href=a,d.setAttribute("download",m),d.className="download-js-link",d.innerHTML="downloading...",d.style.display="none",document.body.appendChild(d),setTimeout(function(){d.click(),document.body.removeChild(d),!0===b&&setTimeout(function(){e.URL.revokeObjectURL(d.href)},250)},66),!0;if(/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent))return a=a.replace(/^data:([\w\/\-\+]+)/,"application/octet-stream"),!window.open(a)&&confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")&&(location.href=a),!0;var c=document.createElement("iframe");document.body.appendChild(c),b||(a="data:"+a.replace(/^data:([\w\/\-\+]+)/,"application/octet-stream")),c.src=a,setTimeout(function(){document.body.removeChild(c)},333)}var e=window,c=g||"application/octet-stream",h=!b&&!g&&a,d=document.createElement("a");g=function(a){return String(a)};var f=e.Blob||e.MozBlob||e.WebKitBlob||g,m=b||"download",f=f.call?f.bind(e):Blob;"true"===String(this)&&(a=[a,c],c=a[0],a=a[1]);if(h&&2048>h.length&&(m=h.split("/").pop().split("?")[0],d.href=h,-1!==d.href.indexOf(h))){var n=new XMLHttpRequest;return n.open("GET",h,!0),n.responseType="blob",n.onload=function(a){k(a.target.response,m,"application/octet-stream")},setTimeout(function(){n.send()},0),n}if(/^data\:[\w+\-]+\/[\w+\-]+[,;]/.test(a)){if(!(2096103.424<a.length&&f!==g))return navigator.msSaveBlob?navigator.msSaveBlob(q(a),m):l(a);a=q(a),c=a.type||"application/octet-stream"}b=a instanceof f?a:new f([a],{type:c});if(navigator.msSaveBlob)return navigator.msSaveBlob(b,m);if(e.URL)l(e.URL.createObjectURL(b),!0);else{if("string"==typeof b||b.constructor===g)try{return l("data:"+c+";base64,"+e.btoa(b))}catch(p){return l("data:"+c+","+encodeURIComponent(b))}c=new FileReader,c.onload=function(a){l(this.result)},c.readAsDataURL(b)}return!0}});// download.js by dandavis (CC BY 4.0)
$(document).ready(function() {
    function AddButton() {
        $('head').append('<style type="text/css"> .affect.close{cursor:pointer;}#NumberKeys{width: 12%;height: 29px;} #TrnImg{width: 100%;} #NumberKeys{ color: #000 !important;} #NumberKeys:focus{color: #000 !important;}</style>');
        $(".row.buttons.dnone").find("a.button.openAddSurveyOverlay").after('<a class="button openAddKeyOverlay" style="margin-left: 4px;"><i class="fa fa-lock"></i></a>');
    }
    function Main() {
        formHtml = '<div class="AddPopKeyOverlay" style="display:none;"> <div class="overlay" style="display: block;"></div><div class="summary popup openAddKeyOverlay"> <div class="lcontrast"> <div><h3 class="dark">Generator kluczy</h3></div><a class="affect close"><i class="fa fa-times red"></i></a><div><div> <label for="NumberKeys">Ilość: </label> <input type="number" id="NumberKeys" min="0" max="19" step="1"> <button class="button" id="TrnAdd">Dodaj</button> <button class="button" id="TrnGen">Generuj</button> <button class="button" id="TrnDel">Usuń</button><button class="button" id="TrnSav">Zapisz</button> <button class="button" id="TrnAut">Auto</button></div><div><label for="TrnColor">Wersja kolorystyczna: </label> <input type="radio" name="TrnColor" value="1" checked> Jasna <input type="radio" name="TrnColor" value="2"> Ciemna</div></div><table style="width:100%"> <tr> <td><div style="display:block;clear:both;"> <div id="TrnBlock"></div></div></td><td><p id="TrnInfo" style="display:none">Jest to przykładowy obraz, prawdziwy jest większy ( ͡° ͜ʖ ͡°)</p><canvas id="TrnCanvas" style="display: none;"></canvas><img id="TrnImg"></div></td></tr></table> </div></div></div>';
        $("#commentFormContainer").after(formHtml);
        $("#TrnGen").hide();
        $("#TrnSav").hide();
        $("#TrnAut").hide();
        $(".AddPopKeyOverlay").show();
        window.NumKeys = 0;
        if (NumKeys !== 0) {
            NumKeys = 0;
        }
        window.CanHeight = 0;
        window.BackgroundColor = "#FFF";
        window.TextColor = "#000";
        window.AltTextColor = "#6f7072";
        window.HashID = '96ab4f6d41dad67';
        $(".affect.close").click(function() {
            $(".AddPopKeyOverlay").hide();
            $(".AddPopKeyOverlay").remove();
        });
        $('#TrnAdd').click(function() {
            if ($("#NumberKeys").val() > 19) {
                alert("Przekroczono dozwoloną wartość!");
                return false;
            }
            RealNumKeys = $("#NumberKeys").val();
            if (RealNumKeys <= 0) {
                RealNumKeys = 1;
            }
            while (NumKeys <= $("#NumberKeys").val() - 1) {
                $("#TrnBlock").append('<div><input type="text" id="line' + NumKeys + '" name="line1" style="width:200px;" /></div>');
                NumKeys++;
            }
            $("#TrnGen").show();
        });
        $('#TrnGen').click(function() {
            if ($('input[name="TrnColor"]:checked').length > 0) {
                var test = $('input[name="TrnColor"]:checked').val();
                if (test == 1) {
                    BackgroundColor = "#FFF";
                    TextColor = "#000";
                } else {
                    BackgroundColor = "#2c2c2c";
                    TextColor = "#FFF";
                    AltTextColor = "FFF";
                }
            }
            if (RealNumKeys === 0) {
                CanHeight = 30;
            } else {
                CanHeight = RealNumKeys * 30;
            }
            updateCanvas();
            $("#TrnSav").show();
            $("#TrnAut").show();
        });
        $('#TrnDel').click(function() {
            var NumOfNumKeys = $("#NumberKeys").val() - 1;
            if (NumOfNumKeys > 0) {
                NumKeys = NumOfNumKeys;
                RealNumKeys = NumOfNumKeys;
                $('#NumberKeys').val(NumOfNumKeys);
                $("#line" + NumOfNumKeys).remove();
                if (NumOfNumKeys === 0) {
                    $("#TrnGen").hide();
                }
            }
        });
        $('#TrnSav').click(function() {
            var random = Math.floor((Math.random() * 10) + 1);
            download($('#TrnImg').attr('src'), "Rozdajo" + random + ".png", "image/png");
        });
        $('#TrnAut').click(function() {
            var random = Math.floor((Math.random() * 10) + 1);
            download($('#TrnImg').attr('src'), "Rozdajo" + random + ".png", "image/png");
            $("a.affect.close").trigger("click");
            $("a.button.openAddMediaOverlay").trigger("click");
            $("li.selectFile a").trigger("click");
        });
    }
    AddButton();
    $(document).on('click', 'a.button.openAddKeyOverlay', function(e) {
        e.preventDefault();
        setTimeout(Main, 10);
    });

    function updateCanvas() {
        var canvas = $('#TrnCanvas')[0];
        var context = canvas.getContext('2d');
        var maxWith = canvas.width;
        var imageObj = new Image();
        imageObj.onload = function() {
            context.drawImage(imageObj, 0, 0);
        };
        imageObj.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAABlBMVEX///////9VfPVsAAAACklEQVQImWNgAAAAAgAB9HFkpgAAAABJRU5ErkJggg==";
        context.canvas.width = 475;
        context.canvas.height = CanHeight + 20;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(imageObj, 0, 0);
        context.fillStyle = BackgroundColor;
        context.fillRect(0, 0, 475, CanHeight + 20);
        context.fillStyle = TextColor;
        context.textAlign = "center";
        context.font = "bold 28pt Courier New";
        var a = 0;
        for (var i = 0; i < $("#NumberKeys").val(); i++) {
            a = a + 1;
            context.fillText($('#line' + i + '').val(), canvas.width * 0.5, a * 30, maxWith);
        }
        a = 0;
        context.font = '10pt Calibri';
        context.textAlign = 'right';
        context.fillStyle = AltTextColor;
        context.fillText("Powered by tRNA", canvas.width, CanHeight + 17, maxWith);
        document.getElementById('TrnImg').src = canvas.toDataURL();
        $("#TrnInfo").show();
    }
});