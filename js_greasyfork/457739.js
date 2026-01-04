// ==UserScript==
// @name         百度搜索结果过滤
// @name:zh      百度搜索结果过滤
// @name:zh-CN   百度搜索结果过滤
// @name:zh-TW   百度搜索结果过滤
// @namespace    http://tampermonkey.net/
// @version      0.3
// @connect       *
// @description  兼容AC双列baidu脚本,搜索结果增加屏蔽按钮,有可视化列表查看编辑保存,支持通配符* ?
// @description:zh      兼容AC双列baidu脚本,搜索结果增加屏蔽按钮,有可视化列表查看编辑保存,支持通配符* ?
// @description:zh-CN   兼容AC双列baidu脚本,搜索结果增加屏蔽按钮,有可视化列表查看编辑保存,支持通配符* ?
// @description:zh-TW   兼容AC双列baidu脚本,搜索结果增加屏蔽按钮,有可视化列表查看编辑保存,支持通配符* ?
// @author       关公说爱情
// @license      MIT
// @match        https://*.baidu.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/layer.min.js
// @exclude      https://www.baidu.com/img/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/457739/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/457739/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const baiduHelper={};

    var $ = $ || window.$,
        removing = false,
        blacklist,
        refUrls={};

    $(document.body).append(`<link href="https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/theme/default/layer.min.css" rel="stylesheet">`);

    function globToRegex (glob) {
        var specialChars = "\\^$*+?.()|{}[]";
        var regexChars = ["^"];
        for (var i = 0; i < glob.length; ++i) {
            var c = glob.charAt(i);
            switch (c) {
                case '?':
                    regexChars.push(".");
                    break;
                case '*':
                    regexChars.push(".*");
                    break;
                default:
                    if (specialChars.indexOf(c) >= 0) {
                        regexChars.push("\\");
                    }
                    regexChars.push(c);
            }
        }
        regexChars.push("$");
        return new RegExp(regexChars.join(""));
    }

    baiduHelper.init = function(){
      blacklist = GM_getValue("blacklist");
      if(blacklist==undefined)
      {
        blacklist = [];
      }

      $('.s_tab_inner').append('<a id="showBlackList" href="javascript:;" class="s-tab-item">屏蔽列表</a>');
      $('#showBlackList').on('click', function () {
          let listvalue='';
          for (let x = 0; x < blacklist.length; x++) {
              listvalue += blacklist[x];
              if(x<blacklist.length - 1)
              {
                  listvalue += "\n";
              }
          }

          layer.prompt({
              title: '域名屏蔽列表,一行一个,支持 * ? 通配符!自动过滤空行',
              formType: 2,
              area: ['500px', '350px'],
              value:listvalue,
              yes: function (index, layero) {
                  let pass = $(document.getElementsByClassName('layui-layer-input')[0]).val();
                  if(pass.length > 0){
                      blacklist = pass.split('\n');
                  }
                  else{
                      blacklist = [];
                  }
                  blacklist = blacklist.filter(function (s) { return s && s.trim(); });
                  GM_setValue("blacklist",blacklist);
                  layer.close(index);
                }
          });
      });

      $('body').on('click', '.removeItemButton', function () {
          let domain = $(this).attr('data-domain');
          layer.confirm('是否将『'+domain+'』加入到屏蔽列表？', {
              btn: ['是','否']
          }, function(index){
              blacklist.push(domain);
              GM_setValue("blacklist",blacklist);
              baiduHelper.removeItem();
              layer.close(index)
          });
      });

      var beforeScrollTop = document.documentElement.scrollTop
        window.addEventListener("scroll", function (e) {
            var afterScrollTop = document.documentElement.scrollTop,
                delta = afterScrollTop - beforeScrollTop;
            if (delta === 0) return false;
            if (delta > 0) {
               var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
               let scrollDelta = 666;
               if (document.documentElement.scrollHeight <= document.documentElement.clientHeight + scrollTop + scrollDelta) {
                   if(!removing)
                   {
                       removing=true;
                       setTimeout(function() {
                           baiduHelper.addButton();
                           baiduHelper.removeItem();
                           removing=false;
                       }, 2000);
                   }
               }
            }
            beforeScrollTop = afterScrollTop;
        }, false);
    }

    baiduHelper.cleanAd = function(){
		$('#content_right').remove();
        $('#rs_new').remove();
        $('#foot').remove();
	};

    baiduHelper.removeItem = function(){
		let $rows = $('#content_left .new-pmd');
        $rows.each(function(){
            let $row = $(this);
            let mu = $row.attr('mu');
            let domain='';
            if(mu !== undefined )
            {
                domain = baiduHelper.getUrlDomain(mu);
            }else
            {
                domain = $row.attr('data-domain');
            }

            for (let x = 0; x < blacklist.length; x++) {
                if(globToRegex(blacklist[x]).test(domain))
                {
                    $(this).remove()
                    break;
                }
            }
        });
	};

    baiduHelper.getUrlDomain = function(refUrl){
        let domain = refUrl.split('/');
        if(domain[2])
        {
            return domain[2];
        }
        return '';
    };

    baiduHelper.addButton = function(){
        let $rows = $('#content_left .new-pmd');

        $rows.each(function(){
            let $row = $(this);
            let mu = $row.attr('mu');

            if(mu !==undefined)
            {
                let $tools = $row.find('.c-icon').closest(".c-row.c-gap-top-xsmall");
                let domain = baiduHelper.getUrlDomain(mu);
                $row.attr('data-domain',domain);
                if($tools.find('.removeItemButton').length==0)
                {
                    $tools.append('<a style="margin-left: 8px" class="removeItemButton" data-domain="' + domain + '"><span class="c-color-gray" aria-hidden="true">✌屏蔽它✌</span></a>');
                }
            }
            else
            {
                let $a = $(this).find('a').eq(1);
                if($a.length > 0)
                {
                    let href = $a.attr('href');
                    let refUrl = refUrls[href];
                    if(refUrl == undefined)
                    {
                        if(href.startsWith("http"))
                        {

                            let url = href.replace(/^http:/, "https:");
                            let request = GM_xmlhttpRequest({
                                url: url,
                                headers: {"Accept": "*/*", "Referer": url},
                                method: "GET",
                                timeout: 5000,
                                onreadystatechange: function (response) {
                                    if(response.readyState===4)
                                    {
                                        refUrls[href] = response.finalUrl;
                                        let domain = baiduHelper.getUrlDomain(refUrls[href]);
                                        let $tools = $row.find('.c-icon').closest(".c-row.c-gap-top-xsmall");
                                        if($tools.length==0)
                                        {
                                            $tools = $row.find('.c-icon').closest(".g");
                                        }
                                        if($tools.length >0 )
                                        {
                                            $row.attr('data-domain',domain);
                                            if($tools.find('.removeItemButton').length==0)
                                            {
                                                $tools.append('<a style="margin-left: 8px" class="removeItemButton" data-domain="' + domain + '"><span class="c-color-gray" aria-hidden="true">✌屏蔽它✌</span></a>')
                                            }
                                        }
                                    }
                                },
                                onerror: function (response) {

                                }
                            });
                        }
                    }
                    else
                    {

                    }
                }
            }
        });
	};

    baiduHelper.cleanAd();
    baiduHelper.init();
    baiduHelper.addButton();
    baiduHelper.removeItem();
})();