// ==UserScript==
// @name         查询手机号归属地
// @version      1.0.1
// @namespace    https://github.com/tangfei/tampermonkey_phone_location
// @description  选中符合手机号规则的网页内容进行查询，若不符合规则则不进行查询
// @icon         data:image/jpg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCMRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAADKgAwAEAAAAAQAAADIAAAAA/+0AOFBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAAAOEJJTQQlAAAAAAAQ1B2M2Y8AsgTpgAmY7PhCfv/AABEIADIAMgMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/3QAEAAT/2gAMAwEAAhEDEQA/AP04lligieaaRY441Lu7nCqo6knsK8V8bfHi4aaTTvBKIsSkqdQlTcX94kPAHozdfTvR8ePG0zXC+CdPmKxKqy6gVP3yeUiPsB8xHfK+9eR6fElxqNpBMu5JbmGNwe6tIoI/ImviM+z6qqrwmEdraN9b9l2t1e9/TX7bIsipOksXi1e+qXS3d979Ftb8Lt/q/ijXW+06jqWq32/nczyMh+gHy/kKgtX1ywcS2LanbOpyDCJoz/47ioPjv+0/8W/ht8d9X+HnhjW9OsfD1glpFa2/9lxOYi9uj/fPUbmPHYGsWL9rP46GVA3iexILqCP7Kh9R7V3LgirO1SVfV63s/wDM5f8AXOnC9ONDTtf/AIB614T+N/ijRZUg11zrNlnDeZhbhB/svwG+jfmK950DxBpPibTItX0a7E9tLxnGGRh1Vh1Vh3Br58+OFrbWvxFvfs0CRCa2t55Ai4BkZTubHqcDNUvhj42m8GeIomllb+zb5lhvY88AE4WUD1U9/wC7keleXl+c1stxbweKnzwT5bvda2v6d09unn6GPyajmOEWMwsOWbV7LZ6Xt69n16+X1BRQMkZCkg9COhow39xvyr70+DP/0PevEOpSaxr2parM25ru7llz7biF/wDHQB+FRaT/AMhaw/6/IP8A0atMv7V7G/urGUEPbTyQsD6q5X+lP0n/AJC1h/1+Qf8Ao1a/F25Sq3lvfU/ZkoxpWhtbT7jxX9tEkftKeLCpwQtgQfQ/ZI65/RL8alZ2l5xucoHHowYA/rW5+2pc20f7S3i1JLqFGCWGVaRQf+PSPsTXnfgLWrQXraWb2A+a6yxgSqfmBG4dfTB/Cv6Egr0ovyR+DSa9o/U+6fjv/wAlFuP+vG1/9BavPSAwKt0PB+lehfHf/kotx/142v8A6C1efCvwbNv9+rf4n+bP27Kv9xo/4V+R7VoXxkltdE0+1uJA0sNpDHISeSwQAn86vf8AC6x/eX864HSvhhqWpaXZ6isEmLq3jmH/AAJQf61a/wCFR6n/AM8ZK3+uY/uzn+qYDsj/0frH43eE5dE8UNrsER+xawfM3DolwB86/iAGH/AvSvPrOdbS9trt1ZlgnjmYKMkhXDED3wK+uvEGgaZ4m0mfRtXg822nHODhkYdHU9mB5Br5v8bfDHxF4MneV4HvtMz+7vYUyAPSRRyh/wDHfQ9q/O8/yarhq8sVRV4Sd3bo+t/Lrf5dr/oWQZxSxNFYWs7TSsvNdLefl8/T3ObWPgN4oH9u3dz4Gvbm7QMZ71bUzNgYAff84IwBg8jGKraVH8C4rZH1CP4bi5UkloVsgAM8V8wG1tJiZWtoJC3VjGrZ/HFH2Gy/58bf/v0v+FdK4xq6ful97/yOd8H0r6VH9x23xa8R6N4q8c3mq6BeJd2Qiht0nj5SQoDuKHuuTgHocHHFYvhXw3d+LdetNBtFP+kN++cf8soR99z9B+pFHhvwpr3iy6FnoGnvcYOHl+7DEPVn6D6dfavo34e/D7TvAmnNHG4udQuQPtV1txux0RB2QenUnk15+X5bWzvFPEVI2pt3b6b3su/by/B+hmGY0ckwqw9OV5pWS+W7/rX8uptoorO3itLaFFigRY41x0UDAH5CpN7f3I/ypKK/R/ZU/wCVH5z7ap/Mz//S/TqjAJAPQnBHqKKB95f94UAeNfGTQtDtZGubXRrGGVgSZI7dFYn6gZrjvhjpWl6lqUS6jptrdDf0mhV/5iu/+Nn3T9DXFfCT/kKRf79flOM/39+p+qYT/cF6H0TFbW9nFHbWkEcESoNscaBVH0A4p9K/3l/3BSV+pUv4cfQ/L638SXqFFFFaGZ//2Q==
// @author       Tom Tang
// @grant        GM_xmlhttpRequest
// @license      MIT
// @match        *://*/*
// @require        https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/401863/%E6%9F%A5%E8%AF%A2%E6%89%8B%E6%9C%BA%E5%8F%B7%E5%BD%92%E5%B1%9E%E5%9C%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/401863/%E6%9F%A5%E8%AF%A2%E6%89%8B%E6%9C%BA%E5%8F%B7%E5%BD%92%E5%B1%9E%E5%9C%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /**
   * 字符串模板格式化
   * StringFormat("ab{0}c{1}ed",1,"q")  output "ab1cqed"
   */
  function StringFormat(formatStr) {
      var args = arguments;
      return formatStr.replace(/\{(\d+)\}/g, function (m, i) {
          i = parseInt(i);
          return args[i + 1];
      });
  }

  function DateFormat(date, formatStr) {
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(formatStr)) {
        formatStr = formatStr.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(formatStr)) {
        formatStr = formatStr.replace(
          RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return formatStr;
  }

  function get_location(icon, phone, e){
      var url = 'https://v.showji.com/Locating/showji.com20180331.aspx?m=' + phone +'&output=json';
      GM_xmlhttpRequest({
          method: "GET",
          url: url,
          responseType: 'json',
          onload: function (request) {
              // console.log(request);
              if(request.status != 200){
                  get_location_second(icon, phone, e);
              }else{
                var result_json = request.response;
                var html_string = result_json["Mobile"] + "：" + result_json["Province"] + result_json['City'] + result_json['Corp'];
                $(icon).html(html_string);
                $(icon).show().css({
                    left: e.pageX + 'px',
                    top : e.pageY + 12 + 'px'
                });
                isSelect=false;
                console.log(result_json);
              }
          },
          onerror: function (e) {
              get_location_second(icon, phone, e);
          }
      });
  }

  function get_location_second(icon, phone, e){
      // 使用的淘宝的免费接口
      var url = 'https://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=' + phone;
      GM_xmlhttpRequest({
          method: "GET",
          url: url,
          onload: function (request) {
              var data = request.responseText.split("=")[1];
              var result_json = JSON.parse(data.replace(/(\w+):'([^']*)'/g,"\"$1\":\"$2\""));
              var html_string = result_json["telString"] + "：" + result_json["carrier"];
              $(icon).html(html_string);
              $(icon).show().css({
                  left: e.pageX + 'px',
                  top : e.pageY + 12 + 'px'
              });
              isSelect=false;
              console.log(result_json);
          },
          onerror: function (e) {
              console.log('调用淘宝api出错了');
              console.error(e);
          }
      });
  }

  function ClearBubble(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
  }

  var isSelect=false;
  //主程序
  var PhoneLocation=function(){
      var phoneIconBase64="data:image/jpg;base64,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";
      var $doc=$(document);
      var $body=$("html body");
      var $head=$("html head");
      var randomCode="yyMM000000";    //属性随机码，年月加六位随机码。用于元素属性后缀，以防止属性名称重复。
      var createHtml=function(){
        var phoneIconHtml=StringFormat('<div id="phone{0}" class="phone{0}" style="background-color: rgb(245, 245, 245);box-sizing: content-box;cursor: pointer;z-index: 2147483647;border-width: 1px;border-style: solid;border-color: rgb(220, 220, 220);border-image: initial;border-radius: 5px;padding: 0.5px;position: absolute;display: none"><div class="phoneIcon{0}" style="background-size: 125px;height: 25px;width: 125px;"></div></div>',randomCode,phoneIconBase64);
        $body.append(StringFormat('<div id="webTrans{0}">',randomCode)+phoneIconHtml+'</div>');
      };
      var ShowPhoneIcon=function(){
        var icon = "div#phone" + randomCode;
        var $phoneIcon=$(icon);
        var isPanel=false;
        var isphoneIcon=false;
        $doc.on({
          "selectionchange":function(e){
            isSelect=true;
          },
          "mousedown":function(e){
            var $targetEl=$(e.target);
            isPanel=$targetEl.parents().is("div.JPopBox-tip-white");
            isphoneIcon=$targetEl.parents().is(StringFormat("div#phone{0}",randomCode));
            //点击图标外域时，隐藏图标
            if(!isphoneIcon && !isPanel){
              $phoneIcon.hide();
            }
            else {
              if(isphoneIcon){
                ClearBubble(e);
              }
            }
          },
          "mouseup":function(e){
            var selectText = window.getSelection().toString().trim();
            var pattern = /^1[3456789]\d{9}$/;
            if (pattern.test(selectText)){
              if(!isPanel&&isSelect&&selectText){
                  get_location(icon, selectText, e);
              }
            }else{
              // console.log("不是手机号");
            }
          }
        });
        $phoneIcon.click(function(e){
          var selecter=window.getSelection();
          var selectText = selecter.toString().trim();
          $phoneIcon.hide();
        });
    };
    this.init=function(){
      randomCode=DateFormat(new Date(),"yyMM").toString()+(Math.floor(Math.random() * (999999 - 100000 + 1) ) + 100000).toString();
      createHtml();
      ShowPhoneIcon();
    };
  };
  var phone_location = new PhoneLocation();
  phone_location.init();

}());