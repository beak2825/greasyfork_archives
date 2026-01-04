// ==UserScript==
// @name        Insert code
// @namespace   Violentmonkey Scripts
// @match       https://developer.baidu.com/map/jsdemo.htm
// @grant       none
// @version     0.1.1
// @author      15d23
// @license      GPL
// @description 2023/9/29 21:04:59
// @downloadURL https://update.greasyfork.org/scripts/476331/Insert%20code.user.js
// @updateURL https://update.greasyfork.org/scripts/476331/Insert%20code.meta.js
// ==/UserScript==

(function() {
    let textarea = document.getElementById('myresource');
    if (textarea) {
        textarea.value = `http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>LOCATE</title>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <style type="text/css">
        html{height:100%}
        body{height:100%;margin:0px;padding:0px}
        #container{height:100%}
    </style>
    <script src="http://api.map.baidu.com/api?v=2.0&ak=您的秘钥">
    </script>
</head>

<body>
    <div id="container"></div>
    <script>
        var map = new BMap.Map("container");
        var point = new BMap.Point(116.404, 39.915);
        map.centerAndZoom(point, 15);
        map.enableScrollWheelZoom(true);

        //给地图添加点击事件，弹出距离输入对话框
        map.addEventListener("click", function(e) {
            var ds = window.prompt("Input Distance:(M)", "");

            var pt = e.point;
            var marker = new BMap.Marker(pt);
            map.addOverlay(marker);
            marker.enableDragging();

            //给图标添加右键监听，删除该位置及范围
            marker.addEventListener("rightclick", function(e) {
                map.removeOverlay(marker);
                map.removeOverlay(circle);
            });

            //地图范围圆形覆盖物
            var circle = new BMap.Circle(pt, ds);
            circle.setStrokeWeight(1);
            circle.setFillOpacity(0.2);
            map.addOverlay(circle);

            //给图标添加拖拽监听
            marker.addEventListener("dragging", function(e) {
                circle.setCenter(e.point);
            });

        });

    </script>
</body>
</html>`;
    }
})();