// ==UserScript==
// @name         172商品列表优化
// @namespace    http://tampermonkey.net/
// @version      1.0.8
// @description  优化一些让人不适的前端页面设计
// @author       aotmd
// @match        https://haoka.lot-ml.com/view/project/pro_list.html*
// @license MIT
// @run-at document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/476642/172%E5%95%86%E5%93%81%E5%88%97%E8%A1%A8%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/476642/172%E5%95%86%E5%93%81%E5%88%97%E8%A1%A8%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
// 默认每页数据条数
const defaultPage = 100;

// 获取用户设置的每页数据条数
let Page = GM_getValue('Page', defaultPage);

// 提供设置每页数据条数的选项
GM_registerMenuCommand('设置自动显示的每页数据条数', () => {
    let userInput = prompt('请输入数据条数:', Page);
    if (userInput !== null) {
        Page = parseInt(userInput, 10);
        if (!isNaN(Page) && Page > 0) {
            GM_setValue('Page', Page);
            alert('数据条数已更新为: ' + Page);
        } else {
            alert('无效的输入，请输入一个正整数。');
        }
    }
});

( function() {
    function changeText() {
        // 取得102
        var divs = document.querySelectorAll( 'div.layui-table-cell.laytable-cell-1-0-2' );
        if ( divs == null ) {
            return;
        }
        for ( var i = 0; i < divs.length; i++ ) {
            // 取得年龄
            var age = divs[ i ].querySelector( 'font' );
            if ( age ) {
                var parent = age.parentNode;
                // 判断年龄是否在首节点
                if ( parent.firstChild !== age ) {
                    // 移除多余描述
                    var ageText = age.textContent;
                    var ageRange = ageText.match( /\d+-\d+/ );
                    if ( ageRange ) {
                        age.textContent = '[' + ageRange[ 0 ] + ']';
                    }
                    // 将年龄放到首节点
                    parent.insertBefore( age, parent.firstChild );
                }
            }
        }
        const mySelect = document.querySelector( ".layui-laypage-limits > select" );
        mySelect.options[0].value=Page;
        mySelect.options[0].text=Page +' 条/页';
    }
    var flag1 = window.setInterval( () => {
        // 选择要观察的节点
        var targetNode = document.getElementById( 'layui-content' );
        if ( targetNode ) {
            clearInterval( flag1 );

            // 自动延迟显示1000条记录
            var flag2=window.setInterval( () => {
                const mySelect = document.querySelector( ".layui-laypage-limits > select" );
                if ( mySelect ) {
                    clearInterval( flag2 );
                    mySelect.options[0].value=Page;
                    mySelect.options[0].text=Page +' 条/页';
                    mySelect.value = Page+'';
                    mySelect.dispatchEvent( new Event( "change" ) )
                }
            }, 50 );

            // 创建一个观察器实例并定义回调函数
            var observer = new MutationObserver( function( mutations ) {
                try {
                    // 元素不存在则移除并终止
                    if ( !document.contains( targetNode ) ) {
                        observer.disconnect();
                        return;
                    }
                    // 先关闭再修改
                    observer.disconnect();
                    changeText();
                } catch ( e ) {
                    console.error( e );
                } finally {
                    // 修改后继续监听
                    observer.observe( targetNode, config );
                }
            } );

            // 配置观察器选项
            var config = {
                attributes: true,
                childList: true,
                subtree: true
            };

            // 传入目标节点和观察器的配置选项
            observer.observe( targetNode, config );
        }
    }, 50 );

    addStyle( `
/*全局设置*/
table {
  width: 100%;
  table-layout: auto;
}
.layui-table-view .layui-table td, .layui-table-view .layui-table th {
    padding: 2px;
}
.layui-table-cell {
    line-height: 1.5;
    font-family: Microsoft YaHei UI,微软雅黑,"iconfont","FontAwesome"!important;
}
/*关闭动画*/
.layui-table tr {
    transition: unset!important;
    -webkit-transition: unset!important;
}
/*响应式布局修复*/
@media screen and (min-width: 760px){
    .layui-col-md1, .layui-col-md10, .layui-col-md11, .layui-col-md12, .layui-col-md2, .layui-col-md3, .layui-col-md4, .layui-col-md5, .layui-col-md6, .layui-col-md7, .layui-col-md8, .layui-col-md9 {
        float: left;
    }
}
/*商品页不用点击查看禁发区*/
.layui-table-cell > span {
    display: inline!important;
    font-size: 10px;
}
.layui-table-cell a[style*="color: rgb"] {
    display: none;
    height: 0px;
}

/*宽度定义以及出现滚动条*/
.layui-table-cell.laytable-cell-1-0-0 {
    width: 50px;
}
.layui-table-cell.laytable-cell-1-0-1 {
    width: 108px;
}
.layui-table-cell.laytable-cell-1-0-2 > font {
    vertical-align: text-bottom;
}
.layui-table-cell{
    --102MinWidth:300px;/* 设置最小宽度为300像素 */
    --109MinWidth:260px;
    --RemainingWidth:calc( 100vw - 989px - 50px - 80px - var(--102MinWidth) - var(--109MinWidth) );
}
.layui-table-cell.laytable-cell-1-0-2 {
    max-height: 105px;
    width: max( var(--102MinWidth) , calc( var(--102MinWidth) + var(--RemainingWidth) * 0.8 ) );
    overflow: auto;
}
.layui-table-cell.laytable-cell-1-0-3 {
    width: 50px;
}
.layui-table-cell.laytable-cell-1-0-4 {
    width: 52px;
}
.layui-table-cell.laytable-cell-1-0-5 {
    width: 52px;
}
.layui-table-cell.laytable-cell-1-0-6 {
    width: 52px;
}
.layui-table-cell.laytable-cell-1-0-7 {
    width: 50px;
}
/*.layui-table-cell.laytable-cell-1-0-8 {
    width: 50px;
}*/
font.sm_1_on,.sm_2 {/*按钮置0*/
    padding: 0px;
}
.layui-table-cell.laytable-cell-1-0-9 {
    width: 100px;
}
.layui-table-cell.laytable-cell-1-0-8 {
    max-height: 108px;
    width: max( var(--109MinWidth) , calc( var(--109MinWidth) + var(--RemainingWidth) * 0.2 ) );
    font-size: 10px;
    overflow-y: auto;
    overflow-x: hidden;
}
.layui-table-cell.laytable-cell-1-0-10 {
    width: 50px;
}
/*消除br的作用*/
.layui-table-cell.laytable-cell-1-0-10 > br {
    content: "\\0020\\0020";
    padding-left: 2em;
}
/*.layui-table-cell.laytable-cell-1-0-11 {
    width: 90px;
}
.layui-table-cell.laytable-cell-1-0-13 {
    width: 60px;
}*/
span.sm_1_on {
    padding: 0px;
}
.layui-table-cell.laytable-cell-1-0-11 {
    width: 465px;
}
.layui-table-cell.laytable-cell-1-0-11 > button {
    margin: 0px;
}
.layui-table-cell.laytable-cell-1-0-11 >div {
    display: inline;
}
/*滚动条变细*/
* {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 1, 0.2) rgba(0, 0, 1, 0.05);
}
::-webkit-scrollbar{
    width: 8px;
    height: 10px;
    background: rgba(255,255,255, 0.2);
}
::-webkit-scrollbar-thumb:vertical {
    width: 6px;
    height: 6px;
}
::-webkit-scrollbar-thumb:hover {
    transition: 1s;
    height: 60px;
    width: 60px;
    border:1px solid #ab23fd;
}
::-webkit-scrollbar:hover{
    border:1px solid rgba(255,255,255,0.5);
}
::-webkit-scrollbar-thumb {
    background: rgba(0,0,1, 0.8);
    border-radius: 100px;
}
/*1.0.2 滚动条上移到整个界面,方便PC端*/
.layui-table-box, .layui-table-body.layui-table-main {
    display: inline-block;
}
        ` );

    //添加css样式
    function addStyle( rules ) {
        let styleElement = document.createElement( 'style' );
        styleElement[ "type" ] = 'text/css';
        document.getElementsByTagName( 'head' )[ 0 ].appendChild( styleElement );
        styleElement.appendChild( document.createTextNode( rules ) );
    }
} )();