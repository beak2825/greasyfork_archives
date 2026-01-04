// ==UserScript==
// @name         DAM product-shoot list resizing
// @namespace    http://leizingyiu.net/
// @version      20241126
// @description  Toggle the body class "yiu_dam_resizing" using Alt+C.
// @author       leizingyiu
// @match        http*://dam-aigc.tezign.com/zh-CN/product-shoot
// @grant        none
// @license     GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/518783/DAM%20product-shoot%20list%20resizing.user.js
// @updateURL https://update.greasyfork.org/scripts/518783/DAM%20product-shoot%20list%20resizing.meta.js
// ==/UserScript==

(function () {
    'use strict';

  var 左侧列表列数=3;
  var 其他列表缩略图宽高px=150;
  var 其他列表缩略图间隙px=10;
  var 参考图弹层大列表列数=12;
  var 样式名称 = 'yiu_dam_resizing';

  var styleId='yiu_DAM_resizing';
  var style = document.createElement('style');
  style.id=styleId;
  style.innerText=`
  body.${样式名称}{
	  --by-leizingyiu:'${样式名称}';
	}

	body.${样式名称} [class='grid transform grid-cols-2 gap-[10px] pb-[20px] transition-transform']{
		--style-from:var(--by-leizingyiu);
		--col: ${左侧列表列数};
		grid-template-columns: repeat(var(--col), minmax(0, 1fr))!important;
	}

	/* 下方历史预览图列表，修改 --size 将修改图片宽高，修改 --gap 则修改图片之间的间距 */
	body.${样式名称} .react-photo-gallery--gallery {
		--style-from:var(--by-leizingyiu);
		--size: ${其他列表缩略图宽高px}px!important;
		--gap: ${其他列表缩略图间隙px}px;
	}

	body.${样式名称} .react-photo-gallery--gallery > div {
		--style-from:var(--by-leizingyiu);
		height: var(--size)!important;
		position: relative!important;
	}

	body.${样式名称} .react-photo-gallery--gallery > div > div {
		--style-from:var(--by-leizingyiu);
		position: relative!important;
		left: auto!important;
		top: auto!important;
		display: block!important;
		float: left;
		width: var(--size)!important;
		height: var(--size)!important;
		margin-right: var(--gap);
		margin-top: var(--gap);
	}
	body.${样式名称} .react-photo-gallery--gallery div[class='group absolute absolute'] {
		--style-from:var(--by-leizingyiu);
		width: var(--size)!important;
		height: var(--size)!important;
	}

	/*去掉背景模糊*/
 	body.${样式名称}  .backdrop-blur-\[2px\],
	body.${样式名称}  [class='backdrop-blur-\[2px\]'],
	body.${样式名称}  [class='backdrop-blur-[2px]'],
	body.${样式名称}  [class='fixed bottom-0 left-0 right-0 top-0 bg-[rgba(0,0,0,0.8)] backdrop-blur-[2px] opacity-100'],
	body.${样式名称} #headlessui-portal-root>div>div>div>div{
		backdrop-filter: unset!important;
        --tw-backdrop-blur: unset!important;
	}

  body.${样式名称} * {
    backdrop-filter: unset !important;
}

	body.${样式名称} [id="headlessui-dialog-panel-:rb:"] [class="grid w-full flex-1 grid-cols-2 gap-4 px-1 pb-40 md:grid-cols-6 md:gap-[10px] md:px-0 md:pb-24"]{
		        grid-template-columns: repeat(${参考图弹层大列表列数}, minmax(0, 1fr));
	}


  body.${样式名称}	.react-photo-gallery--gallery>div>div>div>div{
		opacity: 0;
		transition: opacity 0.3s ease;
	}
  body.${样式名称}	.react-photo-gallery--gallery>div>div>div>div:first-child{
		opacity: 1
	}
  body.${样式名称}	.react-photo-gallery--gallery>div>div>div:hover>div{
		opacity: 1;
	}



`;

  if(document.getElementById(styleId)==null){
  document.body.appendChild(style);
  }


   // 监听键盘按键事件
    document.addEventListener('keydown', function (event) {
         if (event.altKey && event.code === 'KeyC') {
            const body = document.body;

            if(document.getElementById(styleId)==null){
              document.body.appendChild(style);
            }

            if (body.classList.contains(样式名称)) {
                body.classList.remove(样式名称);
                console.log(`Removed class "${样式名称}" from body`);
            } else {
                body.classList.add(样式名称);
                console.log(`Added class "${样式名称}" to body`);
            }

             event.preventDefault();
        }
    });
    document.body.classList.add(样式名称);

})();
