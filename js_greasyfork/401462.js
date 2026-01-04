// ==UserScript==
// @name         百度首页简洁版（最新可用）（支持手机）
// @namespace    blade
// @version      0.1.5
// @description  动画隐去搜索框下方的新闻&导航区域（PC），享受丝滑体验！手机直接跳转百度简洁版
// @author       UBlade
// @match        http*://www.baidu.com
// @match        http*://m.baidu.com
// @exclude      http*://www.baidu.com/s*
// @exclude      http*://m.baidu.com/s*
// @require https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/401462/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E7%AE%80%E6%B4%81%E7%89%88%EF%BC%88%E6%9C%80%E6%96%B0%E5%8F%AF%E7%94%A8%EF%BC%89%EF%BC%88%E6%94%AF%E6%8C%81%E6%89%8B%E6%9C%BA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/401462/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E7%AE%80%E6%B4%81%E7%89%88%EF%BC%88%E6%9C%80%E6%96%B0%E5%8F%AF%E7%94%A8%EF%BC%89%EF%BC%88%E6%94%AF%E6%8C%81%E6%89%8B%E6%9C%BA%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
     if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) { //移动端
         window.location.replace("https://www.baidu.com/?pu=sz%401321_480");
     }
     else{
         var returnbutton = 1; //是否显示恢复按钮
         var csscode = "<style type='text/css'>#backimg{position:absolute;left:50%;margin-left:-15px;margin-top:3px}</style>";
         var imgcode = "<img id='backimg' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAdHSURBVHjaxFdbaBzXGf7O3GdnZrU7q5t1iaKokuxYdhzJUUAPLqU1dp0mpaXQkKZ5MPRGaSAkL6UQaJ5aSvrSFtKHPJXiQpsSg93UFSi0dhMrtkyiOJGw7pbWkqzVrnZmd3bPXM7pw2rHktehjz4wnOEw53zn//7/+/9/COccD2NI9ZdXfv46AIBzDkIIMukUqtSHZSbAowiUUiQMo7PZzjzV0dE23JrJpDlnpOC4zuranY/z+fxHQeAvO+UKVEVBxBhkScLGVg6lsgdRFAEAb//uzf3A9w9BEFClFJ5XxuMDX/rK0OHHf9bT3fUN207LgiAgDCMQQiAKBABQ2CnyO+vrl65ev/HW57O3zquqhnSq6f9bfD9ofmcHIiH2s2dO/WHs6aeelxUV5VIJjuOCMRZ/W3dVQtfJkaHDpw8NDp7+5NObl/5+4b0fbufzt4Xdi30hMCEAQEAIQW47j8d6uofPvvj8e93d3a25XA6Vyt2YrvvjgnOOouNgO5+HoigYPT58qqvzwOxf3jn/rckbn1zSNA2cc+zdJtRfqtSHHwRYWc2i95HOL7/60x9N2elU68LCAlzXRRiGoJSiUqmAUgpKKarVKiil8H0fvu8jiiJ4noeZ2VtQZEX/ydmX/jlydOiFnaIDVVWhKvKDqCbYcUroaG9t/sFL37sUsQjZ7AYkUUQURfFXdZoFQYgtr1nD97GRvbOOjJ3G2Re/+2e3XJ5eW9+8aadTjRZn0ikYmorvPHfmQqopqS6v3AY4RxAECIIAYRiiUqmgWq2CMRav1ecoivbNhADrGxtgjOHbz5y+JACoeJVG4JW1LIaPHn7mySOHn55fXAIhJD6UMQbP86AoCnp7e8E5j6lljD3QYgBQFAWra1k82tPVMTY68n3q00aq21sy6O/rfWOn6MD3/TiQBEGA67pQFAWDg4MQBAFLS0vgu2wwxuIniiJEUU1me9fnoxBDhwZ+45bcPzUAD/b1HuxsbxvO5XL7QMvlMiRJwtDQUE3b1SrW19dBKY39XAdTVTVe28tEsVjEY729bZZpnQQwvg9YVbVTiYSOfD4PIggIggCUUsiyjOHhYWiaVrupJGFgYACcc0hSbXsYhigWi9ja2kIYhtB1PQatX4AAsNNNZxqAk0nziUKhgHyhAEmSwDmH67o4ceJEfFAduK+v74FJwXEczM7OYmtrK95DCIEsywijELqmHWmgOqFpfaVSGQAgiiIEQUAymcTS0hJaWlpiCoMgQD6fj2XFOYcgCGhtbUUymcTo6CgmJydRKBSgaRoYYxBFEX4QwkjoPQ3AfhjqGa0JriSBkFoG0/Ua9devX8fIyAhEUQSlFNPT04iiCKIoxnRaloVjx47BMAz09/fj2rVrcZyIogiBEEQgSoOcNEXZ5Kjdvv4QQpBKpVAoFDA1NVVjJpFAIpGAYRgwTROWZSGVSqFUKmFhYQEAYFkWLMsCYyw+S5IlANhuAHZKpdm9AVQHrvk/CcdxMD09Ddd1oes6JEmKXUIIgWEYCIIgdpUsyzEo5xxGIgHPq8w3AGc37v5bFEVIu1TvtZoQgqamJjiOg5mZGXDO44NFUYQoimCMQdd1AAClFIyxewbsJpNcoXC5AXh5ZXV8p+iUk5a1W63uge/Vdb1YhGEYp0xKKTRNQ0dHBwDAdV1QSmO5maaJatXHzNzCOw3Bld3YpGvrm2+PPnn05fnFJei6HoPXLWxvb48Dam9JZIzBtm2YpokgCJDNZiHLMiRJQqVSQUd7G27Ozr27fHvtTqOcEjquffzpr44NHXrZttPwvEpMVRiGkGUZ3d3dX9hRcM6Rz+eRzWbh+z5UVUUURTBNA4Io4vNb86802+nGXG0kDCyvZtffv3L1x9/8+sm3FpdXYv8qSk0Fi4uLEAThXiElJE4SQRDAdV0QQmLLgyDAI109mLj8wZufzc4tt7U0N1YnAo5mO4WJKx/+8cb0Z+cODvTvy1b1vO15XtwA1GfP8xCGIUzTjFMrAAz292FuYenKxfH3X1NVBZVqtdHipGXWZJHQcXF84gVBFMzjTxx5diu3DT8IIEkSFEWpaXI3aOpyqzcI9TKpaSq6Og5gdm7h6rl3L3zNNAxYlrmvV5P20gYAlmmi7FVw7m/nn3Mc9/Wx0eO/lGQJnueBMb5Pv3v9W89kdjoFFjH854PJ314cn3g14kBrs40oYg9u9hy3FIs/DGsWnv/Hv95YXF65ODZ6/LUDB9pPNiWTmbq06rcnhMRyc123NLewNP7fqx/9fmr65oRhJMAihsKO09AgxsAH+/vu9dPVKjgHmpImMun0VL5Q+EW5XE61tbacVlUViYQOQoRdaxk8r4IwDLGVy626pfKv+3p7Jm07DbdUQhBEkGUJ9/+wxMBfPTG2y9tutIJDEmtZLIqi1p1i8a+bd7cuiwJJVqlPdF3LiKIolEvlbVmWGOPczdj2ZndnZ5MsS4RzzoMg3HUhB7C/vyYP699JwEMa/xsAhxjer7PGbM4AAAAASUVORK5CYII=' height='30' width='30' alt='恢复' title='恢复'>";
         var myVar;
         function hide(ele){
             if(ele=='button'){
                 $('#backimg').hide();
             }
             else if(ele=='guide'){
                 $('#s_main').hide();
             }
         }
         function show(ele){
             if(ele=='button'){
                 if(returnbutton==1){
                     $('#form').after(imgcode);
                     $('#backimg').bind('click', function() {
                         moveup();
                         $('#s_main').fadeIn(1000, function(){show('guide')});
                     });
                     //回车时隐藏按钮
                     $(document).bind('keydown', function(event) {
                         if (event.keyCode == "13") {
                             $('#backimg').hide();
                         }
                     });
                     //点击搜索时隐藏按钮
                     $('#s_btn_wr').bind('click', function() {
                         $('#backimg').hide();
                     });
                 }
             }
             else if(ele=='guide'){
                 $('#s_main').show();
             }
         }
         function movedown(){
             $("#head_wrapper").animate({
                 top:"+=6%"
             },800,function(){show('button')});

         }
         function moveup(){
             hide('button');
             $("#head_wrapper").animate({
                 top:"-=6%"
             },800);
         }
         if(returnbutton==1){
             $('body').append(csscode);
         }
         $('#s_main').fadeOut(700, window.hide);
         movedown();
     }
})();