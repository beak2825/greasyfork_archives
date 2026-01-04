// ==UserScript==
// @license MIT
// @name         ⚡刪除廣告元素
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  使用快捷鍵，任意刪除頁面上廣告元素
// @author       You
// @match         *://*/*
// @require      https://code.jquery.com/jquery-3.6.3.min.js
// @icon         https://www.hexschool.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477210/%E2%9A%A1%E5%88%AA%E9%99%A4%E5%BB%A3%E5%91%8A%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/477210/%E2%9A%A1%E5%88%AA%E9%99%A4%E5%BB%A3%E5%91%8A%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==

(function() {
    //---------------------------------------

    // 宣告變數
    let set
    let Check = true;
    let List=[]

    //設定選取的border色彩效果
    let styleNeon = `@keyframes neon-color {
        from {
        filter: hue-rotate(0deg);
        }

        to {
        filter: hue-rotate(360deg);
        }
    }`

    $('style:last').append(styleNeon)

    //設定cdn使用Sweetalert套件
    let Sweetalert2=`<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>`
    $('html').append(Sweetalert2)

    //使用者點選某個元素 執行刪除元素function
    function SetDeleteEl(e){
        e.preventDefault();
        set=e.target.class
        console.log(set)
        const border={
        border:"4px dotted red"
        }

        const Neon={
        animation: "neon-color 2.5s linear infinite"
        }

        const NoBorder={
            border:"none"
            }

        const StopNeon={
            animation: ""
            }

        Object.assign(e.target.style,border)
        Object.assign(e.target.style,Neon)
        //e.target.remove()

        if (Check==true){
        Swal.fire({
          title: '確定要刪除這個元素?',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: '確認',
          denyButtonText: `取消`,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            e.target.remove()

            List.push(e.target.className)
            localStorage.setItem('List',List);

            Check=false;
            Swal.fire('成功刪除此元素!', '', 'success')
          } else if (result.isDenied) {
            Check=false;
            Swal.fire('動作已取消', '', 'info')
            Object.assign(e.target.style,NoBorder)
            Object.assign(e.target.style,StopNeon)

          };
      });
    }
            //選取流程結束後  解開選取流程的事件綁定
            $('body').unbind('click',SetDeleteEl)
    }

    //toast.js cdn匯入

    const toastJS = ` <link href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.css" rel="stylesheet"  />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.js"></script>`
    $('body').append(toastJS);

    // 當使用者按下Ctrl+Q 就執行主程序
    document.addEventListener('keydown', function(e){
        if(e.which==81 && e.ctrlKey==true){
            RemoveListItem();
            toastr.options = {
                // 參數設定[註1]
                "closeButton": false, // 顯示關閉按鈕
                "debug": false, // 除錯
                "newestOnTop": false,  // 最新一筆顯示在最上面
                "progressBar": false, // 顯示隱藏時間進度條
                "positionClass": "toast-bottom-right",
                "preventDuplicates": false, // 隱藏重覆訊息
                "onclick": null, // 當點選提示訊息時，則執行此函式
                "showDuration": "300", // 顯示時間(單位: 毫秒)
                "hideDuration": "1000", // 隱藏時間(單位: 毫秒)
                "timeOut": "2000", // 當超過此設定時間時，則隱藏提示訊息(單位: 毫秒)
                "extendedTimeOut": "1000", // 當使用者觸碰到提示訊息時，離開後超過此設定時間則隱藏提示訊息(單位: 毫秒)
                "showEasing": "swing", // 顯示動畫時間曲線
                "hideEasing": "linear", // 隱藏動畫時間曲線
                "showMethod": "fadeIn", // 顯示動畫效果
                "hideMethod": "fadeOut" // 隱藏動畫效果
            }
            toastr.success( "已開啟刪除元素模式！" );
            $('body').on('click',SetDeleteEl)
            Check=true
        }})

    function RemoveListItem(){
        if (localStorage.getItem('List')!=null){

            item=localStorage.getItem('List').split(',')
            for (i=0;i<item.length;i++){
                item[i]='.'+item[i]
                item[i]=item[i].replaceAll(' ','.')
                try{
                document.querySelector(item[i]).remove()}
                catch{}
            }

            // item='.'+item
            // item=item.replaceAll(' ','.')
            // document.querySelector(item).remove()
        }
    }
//--------------------------------------------------------

})();