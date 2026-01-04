// ==UserScript==
// @name         在控制台输出TL-WDR5620（千兆版）的MAC绑定内容
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description
// @author       simon
// @match        http://192.168.3.1
// @match        http://192.168.0.1
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @description TP路由器TL-WDR5620（兼容千兆版）的MAC绑定内容
// @downloadURL https://update.greasyfork.org/scripts/486366/%E5%9C%A8%E6%8E%A7%E5%88%B6%E5%8F%B0%E8%BE%93%E5%87%BATL-WDR5620%EF%BC%88%E5%8D%83%E5%85%86%E7%89%88%EF%BC%89%E7%9A%84MAC%E7%BB%91%E5%AE%9A%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/486366/%E5%9C%A8%E6%8E%A7%E5%88%B6%E5%8F%B0%E8%BE%93%E5%87%BATL-WDR5620%EF%BC%88%E5%8D%83%E5%85%86%E7%89%88%EF%BC%89%E7%9A%84MAC%E7%BB%91%E5%AE%9A%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==
window.onload = function () {
    'use strict';
    // 注册菜单
    GM_registerMenuCommand('#️⃣ 操作', function () {
        const modalHtml = `
            <div class="modal" id="myModal" tabindex="-1" role="dialog">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">操作</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                     <div class="form-group">
                      <label for="input2">结果列表</label>
                      <textarea id="resultlist" placeholder="IP结果列表，可以直接复制到Excel" cols="50"></textarea>
                      <button id="btnGetMACList" class="btn btn-success" >获取</button>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" id="saveInfo">保存</button>
                  </div>
                </div>
              </div>
            </div>`;
 
        // 获取模态框和输入框元素
        let modal = document.getElementById('myModal');
        if (modal == null) {
            // 将模态框添加到页面
            document.body.insertAdjacentHTML('beforeend', modalHtml);
 
            //重新获取模态框
            modal = document.getElementById('myModal');
 
            jQuery("#btnGetMACList").click(function () {
                var t = "";
                jQuery('#ipMacBindLease tbody tr').each(function () {
                    // 创建一个空字符串来存储每行的内容
                    var rowContent = '';
                    let tdid = 0;
                    // 遍历每个单元格
                    jQuery(this).find('td').each(function () {
                        // 获取单元格的文本内容，并追加到行内容字符串中
                        if (tdid == 1) {
                            var title = jQuery(this).attr('title');
                            if (title) {
                                rowContent += title + '\t';
                            }
                            else {
                                rowContent += jQuery(this).text() + '\t';
                            }
                            }else if(tdid == 2){
				rowContent += jQuery(this).text().replace(/[-]/g,":") + '\t';
				}else {
                            rowContent += jQuery(this).text() + '\t'; // 可根据需要使用适当的分隔符
                          }
                          tdid++;
                    });
                    // 添加换行符
                    rowContent += '\n';
 
                    // 打印或使用行内容
                    console.log(rowContent);
                    t += rowContent;
                    // 在这里你可以将 rowContent 用于其他目的，比如拼接到字符串、显示在页面上等
                });
                jQuery("#resultlist").val(t);
 
            });
        }
        // 打开模态框
        jQuery(modal).modal('show');
    });
 
    // 动态添加 Bootstrap CSS 样式文件
    const bootstrapCss = document.createElement('link');
    bootstrapCss.rel = 'stylesheet';
    bootstrapCss.href = 'https://cdn.staticfile.org/bootstrap/5.3.1/css/bootstrap.min.css';  // 根据实际路径进行修改
 
    document.head.appendChild(bootstrapCss);
 
    // 动态添加 jQuery 和 Bootstrap JavaScript 文件
    const jQueryScript = document.createElement('script');
    jQueryScript.src = 'https://cdn.staticfile.org/jquery/3.7.0/jquery.min.js';
    console.log("输出$");
    console.log($);
    jQueryScript.onload = function () {
        const bootstrapJs = document.createElement('script');
        bootstrapJs.src = 'https://cdn.staticfile.org/bootstrap/5.3.1/js/bootstrap.min.js';
        document.head.appendChild(bootstrapJs);
        var j1 = jQuery.noConflict();
 
    };
    document.head.appendChild(jQueryScript);
 
};