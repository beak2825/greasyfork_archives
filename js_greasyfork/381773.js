// ==UserScript==
// @name            filter_instances
// @namespace       [url=mailto:liuchenxing@xiaomi.com]liuchenxing@xiaomi.com[/url]
// @author          liuchenxing
// @description     过滤掉没权限操作的instance
// @match           http://oakbay.pt.xiaomi.srv/
// @match           http://tj1-vm-search000.kscn:9000/
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version         0.1
// @downloadURL https://update.greasyfork.org/scripts/381773/filter_instances.user.js
// @updateURL https://update.greasyfork.org/scripts/381773/filter_instances.meta.js
// ==/UserScript==
(function() {
    //console.log(location.hash);
	window.onload = function() {
        var intervalId = setInterval(function() {
        if (location.hash == '#/management/instance_setting' && $('table>>tr.ng-scope').length > 0) {
            $('table>>tr.ng-scope').filter(function(idx){
                return this.lastElementChild.children.length < 4;
            }).each(function(idx){
                this.hidden=true;
            });
            //clearInterval(intervalId);
        }
        }, 300);
    }
}
)();
