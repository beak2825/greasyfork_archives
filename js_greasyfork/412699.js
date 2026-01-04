// ==UserScript==
// @namespace    https://greasyfork.org/zh-CN/users/693451-fileclouddev

// @name       用GetBy.Download免费離線下載磁力鏈接，支持秒傳，类似迅雷、百度網盤、115或比特球
// @name:en    Download magnet links with GetBy.Download for free,instant downloads,like Xunlei,Baidu,offcloud
// @name:zh    用GetBy.Download免费離線下載磁力鏈接，支持秒傳，类似迅雷、百度網盤、115或比特球
// @name:zh-CN 用GetBy.Download免费离线下载磁力链接，支持秒传，类似迅雷、百度网盘、115或比特球
// @name:zh-TW 用GetBy.Download免费離線下載磁力鏈接，支持秒傳，类似迅雷、百度網盤、115或比特球
// @name:ja    GetBy.Downloadで無料のオフラインマグネットリンクをダウンロードします インスタントダウンロード
// @name:ko    GetBy.Download를사용하여무료및오프라인마그넷링크다운로드 즉시 다운로드

// @homepageURL       https://m.getby.download/dl/task

// @version             0.1.6
// @description         方便將页面的磁力鏈接交由支持離線下載的GetBy.Download下載，借助其免費的云端下載功能，快速完成种子文件、磁力鏈接的下載。只需在有磁力鏈接的网页中开启本插件，即可将该网页中原本"magnet"开头的磁力链接转为GetBy.Download的下载链接，点击下载链接，即可跳轉到GetBy.Download下載頁面，完成離線下載任務的添加和下载。
// @description:zh      方便將页面的磁力鏈接交由支持離線下載的GetBy.Download下載，借助其免費的云端下載功能，快速完成种子文件、磁力鏈接的下載。只需在有磁力鏈接的网页中开启本插件，即可将该网页中原本"magnet"开头的磁力链接转为GetBy.Download的下载链接，点击下载链接，即可跳轉到GetBy.Download下載頁面，完成離線下載任務的添加和下载。
// @description:zh-TW   方便將页面的磁力鏈接交由支持離線下載的GetBy.Download下載，借助其免費的云端下載功能，快速完成种子文件、磁力鏈接的下載。只需在有磁力鏈接的网页中开启本插件，即可将该网页中原本"magnet"开头的磁力链接转为GetBy.Download的下载链接，点击下载链接，即可跳轉到GetBy.Download下載頁面，完成離線下載任務的添加和下载。
// @description:zh-CN   方便将页面的磁力链接交由支持离线下载的GetBy.Download下载，借助其免费的云端下载功能，快速完成种子文件、磁力链接的下载。只需在有磁力链接的网页中开启本插件，即可将该网页中原本"magnet"开头的磁力链接转为GetBy.Download的下载链接，点击下载链接，即可跳转到GetBy.Download下载页面，完成离线下载任务的添加和下载。
// @description:en      This script can transfer magnet links to GetBy.Download which supports offline download, and with the help of its free downloading service, it can quickly complete your downloading.
// @description:ko      오프라인 다운로드를 지원하는 GetBy.Download에 마그네틱 링크를 편리하게 넘겨주고 무료 다운로드 기능을 사용하여 마그네틱 링크 다운로드를 신속하게 완료하세요. 마그네틱 링크가있는 웹 페이지에서이 플러그인을 열기 만하면 웹 페이지에서 "magnet"으로 시작하는 마그네틱 링크를 GetBy.Download의 다운로드 링크로 변환 할 수 있습니다. 다운로드 링크를 클릭하면 GetBy.Download 다운로드 페이지로 이동합니다. 오프라인 다운로드 작업 추가를 완료합니다.
// @description:ja      オフラインダウンロードをサポートするGetBy.Downloadに磁気リンクを便利に渡し、無料のダウンロード機能を使用して磁気リンクのダウンロードをすばやく完了します。磁気リンクのあるWebページでこのプラグインを開くだけで、Webページの「magnet」で始まる磁気リンクをGetBy.Downloadのダウンロードリンクに変換できます。ダウンロードリンクをクリックして、GetBy.Downloadダウンロードページにジャンプします。オフラインダウンロードタスクの追加を完了します。


// @author      fileclouddev
// @match       *://*/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/412699/%E7%94%A8GetByDownload%E5%85%8D%E8%B4%B9%E9%9B%A2%E7%B7%9A%E4%B8%8B%E8%BC%89%E7%A3%81%E5%8A%9B%E9%8F%88%E6%8E%A5%EF%BC%8C%E6%94%AF%E6%8C%81%E7%A7%92%E5%82%B3%EF%BC%8C%E7%B1%BB%E4%BC%BC%E8%BF%85%E9%9B%B7%E3%80%81%E7%99%BE%E5%BA%A6%E7%B6%B2%E7%9B%A4%E3%80%81115%E6%88%96%E6%AF%94%E7%89%B9%E7%90%83.user.js
// @updateURL https://update.greasyfork.org/scripts/412699/%E7%94%A8GetByDownload%E5%85%8D%E8%B4%B9%E9%9B%A2%E7%B7%9A%E4%B8%8B%E8%BC%89%E7%A3%81%E5%8A%9B%E9%8F%88%E6%8E%A5%EF%BC%8C%E6%94%AF%E6%8C%81%E7%A7%92%E5%82%B3%EF%BC%8C%E7%B1%BB%E4%BC%BC%E8%BF%85%E9%9B%B7%E3%80%81%E7%99%BE%E5%BA%A6%E7%B6%B2%E7%9B%A4%E3%80%81115%E6%88%96%E6%AF%94%E7%89%B9%E7%90%83.meta.js
// ==/UserScript==

(function() {
    'use strict';
var links = document.getElementsByTagName('a');
var reg40 = /^(?:magnet:\?xt=urn:btih:[a-fA-F0-9]{40})/;
var reg32 = /^(?:magnet:\?xt=urn:btih:[A-Z2-7]{32})/;
for (var i = 0; i < links.length; i++)
{
    var elem = links[i];
    if (elem.href.match(reg40) || elem.href.match(reg32)){
        var index = elem.href.indexOf('&');
        var hash = index > 0 ? elem.href.substring(20, index) : elem.href.substring(20, elem.href.length);
        elem.href='https://m.getby.download/dl/task/'+ hash;
        elem.target = '_blank';
        elem.title="用GetBy.Download下載";
    }
}
})();