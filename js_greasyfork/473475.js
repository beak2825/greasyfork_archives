// ==UserScript==
// @name         夸克/阿里网盘批量重命名
// @namespace    https://github.com/isaced
// @version      2.2.0
// @author       isaced
// @description  夸克/阿里网盘中文件、文件夹批量重命名
// @license      MIT
// @icon         https://raw.githubusercontent.com/isaced/pan-naming-master/main/logo.svg
// @homepageURL  https://github.com/isaced/pan-naming-master
// @match        https://pan.quark.cn/*
// @match        https://www.aliyundrive.com/drive/file/*
// @match        https://www.alipan.com/drive/file/*
// @grant        unsafeWindow
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/473475/%E5%A4%B8%E5%85%8B%E9%98%BF%E9%87%8C%E7%BD%91%E7%9B%98%E6%89%B9%E9%87%8F%E9%87%8D%E5%91%BD%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/473475/%E5%A4%B8%E5%85%8B%E9%98%BF%E9%87%8C%E7%BD%91%E7%9B%98%E6%89%B9%E9%87%8F%E9%87%8D%E5%91%BD%E5%90%8D.meta.js
// ==/UserScript==

(t=>{const r=document.createElement("style");r.dataset.source="vite-plugin-monkey",r.textContent=t,document.head.append(r)})(` @tailwind base;*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,[type=button],[type=reset],[type=submit]{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}[data-tooltip-style^=light]+.tooltip>.tooltip-arrow:before{border-style:solid;border-color:#e5e7eb}[data-tooltip-style^=light]+.tooltip[data-popper-placement^=top]>.tooltip-arrow:before{border-bottom-width:1px;border-right-width:1px}[data-tooltip-style^=light]+.tooltip[data-popper-placement^=right]>.tooltip-arrow:before{border-bottom-width:1px;border-left-width:1px}[data-tooltip-style^=light]+.tooltip[data-popper-placement^=bottom]>.tooltip-arrow:before{border-top-width:1px;border-left-width:1px}[data-tooltip-style^=light]+.tooltip[data-popper-placement^=left]>.tooltip-arrow:before{border-top-width:1px;border-right-width:1px}.tooltip[data-popper-placement^=top]>.tooltip-arrow{bottom:-4px}.tooltip[data-popper-placement^=bottom]>.tooltip-arrow{top:-4px}.tooltip[data-popper-placement^=left]>.tooltip-arrow{right:-4px}.tooltip[data-popper-placement^=right]>.tooltip-arrow{left:-4px}.tooltip.invisible>.tooltip-arrow:before{visibility:hidden}[data-popper-arrow],[data-popper-arrow]:before{position:absolute;width:8px;height:8px;background:inherit}[data-popper-arrow]{visibility:hidden}[data-popper-arrow]:before{content:"";visibility:visible;transform:rotate(45deg)}[data-popper-arrow]:after{content:"";visibility:visible;transform:rotate(45deg);position:absolute;width:9px;height:9px;background:inherit}[role=tooltip]>[data-popper-arrow]:before{border-style:solid;border-color:#e5e7eb}.dark [role=tooltip]>[data-popper-arrow]:before{border-style:solid;border-color:#4b5563}[role=tooltip]>[data-popper-arrow]:after{border-style:solid;border-color:#e5e7eb}.dark [role=tooltip]>[data-popper-arrow]:after{border-style:solid;border-color:#4b5563}[data-popover][role=tooltip][data-popper-placement^=top]>[data-popper-arrow]:before{border-bottom-width:1px;border-right-width:1px}[data-popover][role=tooltip][data-popper-placement^=top]>[data-popper-arrow]:after{border-bottom-width:1px;border-right-width:1px}[data-popover][role=tooltip][data-popper-placement^=right]>[data-popper-arrow]:before{border-bottom-width:1px;border-left-width:1px}[data-popover][role=tooltip][data-popper-placement^=right]>[data-popper-arrow]:after{border-bottom-width:1px;border-left-width:1px}[data-popover][role=tooltip][data-popper-placement^=bottom]>[data-popper-arrow]:before{border-top-width:1px;border-left-width:1px}[data-popover][role=tooltip][data-popper-placement^=bottom]>[data-popper-arrow]:after{border-top-width:1px;border-left-width:1px}[data-popover][role=tooltip][data-popper-placement^=left]>[data-popper-arrow]:before{border-top-width:1px;border-right-width:1px}[data-popover][role=tooltip][data-popper-placement^=left]>[data-popper-arrow]:after{border-top-width:1px;border-right-width:1px}[data-popover][role=tooltip][data-popper-placement^=top]>[data-popper-arrow]{bottom:-5px}[data-popover][role=tooltip][data-popper-placement^=bottom]>[data-popper-arrow]{top:-5px}[data-popover][role=tooltip][data-popper-placement^=left]>[data-popper-arrow]{right:-5px}[data-popover][role=tooltip][data-popper-placement^=right]>[data-popper-arrow]{left:-5px}[type=text],[type=email],[type=url],[type=password],[type=number],[type=date],[type=datetime-local],[type=month],[type=search],[type=tel],[type=time],[type=week],[multiple],textarea,select{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:#fff;border-color:#6b7280;border-width:1px;border-radius:0;padding:.5rem .75rem;font-size:1rem;line-height:1.5rem;--tw-shadow: 0 0 #0000}[type=text]:focus,[type=email]:focus,[type=url]:focus,[type=password]:focus,[type=number]:focus,[type=date]:focus,[type=datetime-local]:focus,[type=month]:focus,[type=search]:focus,[type=tel]:focus,[type=time]:focus,[type=week]:focus,[multiple]:focus,textarea:focus,select:focus{outline:2px solid transparent;outline-offset:2px;--tw-ring-inset: var(--tw-empty, );--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: #1C64F2;--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);border-color:#1c64f2}input::-moz-placeholder,textarea::-moz-placeholder{color:#6b7280;opacity:1}input::placeholder,textarea::placeholder{color:#6b7280;opacity:1}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-date-and-time-value{min-height:1.5em}select:not([size]){background-image:url("data:image/svg+xml,%3csvg aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 10 6'%3e %3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m1 1 4 4 4-4'/%3e %3c/svg%3e");background-position:right .75rem center;background-repeat:no-repeat;background-size:.75em .75em;padding-right:2.5rem;-webkit-print-color-adjust:exact;print-color-adjust:exact}[multiple]{background-image:initial;background-position:initial;background-repeat:unset;background-size:initial;padding-right:.75rem;-webkit-print-color-adjust:unset;print-color-adjust:unset}[type=checkbox],[type=radio]{-webkit-appearance:none;-moz-appearance:none;appearance:none;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;display:inline-block;vertical-align:middle;background-origin:border-box;-webkit-user-select:none;-moz-user-select:none;user-select:none;flex-shrink:0;height:1rem;width:1rem;color:#1c64f2;background-color:#fff;border-color:#6b7280;border-width:1px;--tw-shadow: 0 0 #0000}[type=checkbox]{border-radius:0}[type=radio]{border-radius:100%}[type=checkbox]:focus,[type=radio]:focus{outline:2px solid transparent;outline-offset:2px;--tw-ring-inset: var(--tw-empty, );--tw-ring-offset-width: 2px;--tw-ring-offset-color: #fff;--tw-ring-color: #1C64F2;--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}[type=checkbox]:checked,[type=radio]:checked,.dark [type=checkbox]:checked,.dark [type=radio]:checked{border-color:transparent;background-color:currentColor;background-size:.55em .55em;background-position:center;background-repeat:no-repeat}[type=checkbox]:checked{background-image:url("data:image/svg+xml,%3csvg aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'%3e %3cpath stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M1 5.917 5.724 10.5 15 1.5'/%3e %3c/svg%3e");background-repeat:no-repeat;background-size:.55em .55em;-webkit-print-color-adjust:exact;print-color-adjust:exact}[type=radio]:checked{background-image:url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e");background-size:1em 1em}.dark [type=radio]:checked{background-image:url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e");background-size:1em 1em}[type=checkbox]:indeterminate{background-image:url("data:image/svg+xml,%3csvg aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'%3e %3cpath stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M1 5.917 5.724 10.5 15 1.5'/%3e %3c/svg%3e");background-color:currentColor;border-color:transparent;background-position:center;background-repeat:no-repeat;background-size:.55em .55em;-webkit-print-color-adjust:exact;print-color-adjust:exact}[type=checkbox]:indeterminate:hover,[type=checkbox]:indeterminate:focus{border-color:transparent;background-color:currentColor}[type=file]{background:unset;border-color:inherit;border-width:0;border-radius:0;padding:0;font-size:unset;line-height:inherit}[type=file]:focus{outline:1px auto inherit}input[type=file]::file-selector-button{color:#fff;background:#1F2937;border:0;font-weight:500;font-size:.875rem;cursor:pointer;padding:.625rem 1rem .625rem 2rem;margin-inline-start:-1rem;margin-inline-end:1rem}input[type=file]::file-selector-button:hover{background:#374151}.dark input[type=file]::file-selector-button{color:#fff;background:#4B5563}.dark input[type=file]::file-selector-button:hover{background:#6B7280}input[type=range]::-webkit-slider-thumb{height:1.25rem;width:1.25rem;background:#1C64F2;border-radius:9999px;border:0;appearance:none;-moz-appearance:none;-webkit-appearance:none;cursor:pointer}input[type=range]:disabled::-webkit-slider-thumb{background:#9CA3AF}.dark input[type=range]:disabled::-webkit-slider-thumb{background:#6B7280}input[type=range]:focus::-webkit-slider-thumb{outline:2px solid transparent;outline-offset:2px;--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000);--tw-ring-opacity: 1px;--tw-ring-color: rgb(164 202 254 / var(--tw-ring-opacity))}input[type=range]::-moz-range-thumb{height:1.25rem;width:1.25rem;background:#1C64F2;border-radius:9999px;border:0;appearance:none;-moz-appearance:none;-webkit-appearance:none;cursor:pointer}input[type=range]:disabled::-moz-range-thumb{background:#9CA3AF}.dark input[type=range]:disabled::-moz-range-thumb{background:#6B7280}input[type=range]::-moz-range-progress{background:#3F83F8}input[type=range]::-ms-fill-lower{background:#3F83F8}input[type=range].range-sm::-webkit-slider-thumb{height:1rem;width:1rem}input[type=range].range-lg::-webkit-slider-thumb{height:1.5rem;width:1.5rem}input[type=range].range-sm::-moz-range-thumb{height:1rem;width:1rem}input[type=range].range-lg::-moz-range-thumb{height:1.5rem;width:1.5rem}*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(63 131 248 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(63 131 248 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }@tailwind components;@tailwind utilities;.container{width:100%}@media (min-width: 640px){.container{max-width:640px}}@media (min-width: 768px){.container{max-width:768px}}@media (min-width: 1024px){.container{max-width:1024px}}@media (min-width: 1280px){.container{max-width:1280px}}@media (min-width: 1536px){.container{max-width:1536px}}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}.pointer-events-none{pointer-events:none}.static{position:static}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.sticky{position:sticky}.-inset-1{top:-.25rem;right:-.25rem;bottom:-.25rem;left:-.25rem}.inset-0{top:0;right:0;bottom:0;left:0}.inset-x-0{left:0;right:0}.inset-y-0{top:0;bottom:0}.-left-1{left:-.25rem}.-left-1\\.5{left:-.375rem}.-left-14{left:-3.5rem}.-left-3{left:-.75rem}.-left-\\[17px\\]{left:-17px}.-right-\\[16px\\]{right:-16px}.-right-\\[17px\\]{right:-17px}.bottom-0{bottom:0}.bottom-4{bottom:1rem}.bottom-5{bottom:1.25rem}.bottom-6{bottom:1.5rem}.left-0{left:0}.left-1{left:.25rem}.left-1\\/2{left:50%}.left-2{left:.5rem}.left-2\\.5{left:.625rem}.left-5{left:1.25rem}.right-0{right:0}.right-2{right:.5rem}.right-2\\.5{right:.625rem}.right-5{right:1.25rem}.right-6{right:1.5rem}.top-0{top:0}.top-1{top:.25rem}.top-1\\/2{top:50%}.top-2{top:.5rem}.top-3{top:.75rem}.top-4{top:1rem}.top-5{top:1.25rem}.top-6{top:1.5rem}.top-\\[124px\\]{top:124px}.top-\\[142px\\]{top:142px}.top-\\[178px\\]{top:178px}.top-\\[40px\\]{top:40px}.top-\\[72px\\]{top:72px}.top-\\[88px\\]{top:88px}.top-\\[calc\\(100\\%\\+1rem\\)\\]{top:calc(100% + 1rem)}.-z-10{z-index:-10}.z-0{z-index:0}.z-10{z-index:10}.z-30{z-index:30}.z-40{z-index:40}.z-50{z-index:50}.col-span-2{grid-column:span 2 / span 2}.m-0{margin:0}.m-0\\.5{margin:.125rem}.-mx-1{margin-left:-.25rem;margin-right:-.25rem}.-mx-1\\.5{margin-left:-.375rem;margin-right:-.375rem}.-my-1{margin-top:-.25rem;margin-bottom:-.25rem}.-my-1\\.5{margin-top:-.375rem;margin-bottom:-.375rem}.mx-2{margin-left:.5rem;margin-right:.5rem}.mx-4{margin-left:1rem;margin-right:1rem}.mx-auto{margin-left:auto;margin-right:auto}.my-1{margin-top:.25rem;margin-bottom:.25rem}.my-2{margin-top:.5rem;margin-bottom:.5rem}.my-8{margin-top:2rem;margin-bottom:2rem}.-mb-px{margin-bottom:-1px}.-ml-1{margin-left:-.25rem}.-ml-4{margin-left:-1rem}.-mr-1{margin-right:-.25rem}.-mr-1\\.5{margin-right:-.375rem}.-mt-px{margin-top:-1px}.mb-1{margin-bottom:.25rem}.mb-10{margin-bottom:2.5rem}.mb-2{margin-bottom:.5rem}.mb-2\\.5{margin-bottom:.625rem}.mb-3{margin-bottom:.75rem}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mb-6{margin-bottom:1.5rem}.mb-px{margin-bottom:1px}.ml-1{margin-left:.25rem}.ml-1\\.5{margin-left:.375rem}.ml-2{margin-left:.5rem}.ml-3{margin-left:.75rem}.ml-4{margin-left:1rem}.ml-5{margin-left:1.25rem}.ml-6{margin-left:1.5rem}.ml-auto{margin-left:auto}.mr-1{margin-right:.25rem}.mr-2{margin-right:.5rem}.mr-3{margin-right:.75rem}.mr-4{margin-right:1rem}.mt-1{margin-top:.25rem}.mt-1\\.5{margin-top:.375rem}.mt-2{margin-top:.5rem}.mt-3{margin-top:.75rem}.mt-4{margin-top:1rem}.mt-5{margin-top:1.25rem}.mt-6{margin-top:1.5rem}.mt-8{margin-top:2rem}.block{display:block}.inline-block{display:inline-block}.inline{display:inline}.flex{display:flex}.inline-flex{display:inline-flex}.table{display:table}.grid{display:grid}.contents{display:contents}.\\!hidden{display:none!important}.hidden{display:none}.h-0{height:0px}.h-0\\.5{height:.125rem}.h-1{height:.25rem}.h-10{height:2.5rem}.h-12{height:3rem}.h-14{height:3.5rem}.h-16{height:4rem}.h-2{height:.5rem}.h-2\\.5{height:.625rem}.h-20{height:5rem}.h-24{height:6rem}.h-3{height:.75rem}.h-3\\.5{height:.875rem}.h-36{height:9rem}.h-4{height:1rem}.h-48{height:12rem}.h-5{height:1.25rem}.h-56{height:14rem}.h-6{height:1.5rem}.h-64{height:16rem}.h-7{height:1.75rem}.h-72{height:18rem}.h-8{height:2rem}.h-80{height:20rem}.h-9{height:2.25rem}.h-96{height:24rem}.h-\\[10px\\]{height:10px}.h-\\[140px\\]{height:140px}.h-\\[156px\\]{height:156px}.h-\\[172px\\]{height:172px}.h-\\[17px\\]{height:17px}.h-\\[18px\\]{height:18px}.h-\\[193px\\]{height:193px}.h-\\[213px\\]{height:213px}.h-\\[24px\\]{height:24px}.h-\\[32px\\]{height:32px}.h-\\[41px\\]{height:41px}.h-\\[426px\\]{height:426px}.h-\\[454px\\]{height:454px}.h-\\[46px\\]{height:46px}.h-\\[52px\\]{height:52px}.h-\\[55px\\]{height:55px}.h-\\[572px\\]{height:572px}.h-\\[5px\\]{height:5px}.h-\\[600px\\]{height:600px}.h-\\[63px\\]{height:63px}.h-\\[64px\\]{height:64px}.h-auto{height:auto}.h-full{height:100%}.h-modal{height:calc(100% - 2rem)}.h-px{height:1px}.max-h-64{max-height:16rem}.max-h-full{max-height:100%}.w-1{width:.25rem}.w-1\\/2{width:50%}.w-10{width:2.5rem}.w-10\\/12{width:83.333333%}.w-11{width:2.75rem}.w-11\\/12{width:91.666667%}.w-12{width:3rem}.w-14{width:3.5rem}.w-2{width:.5rem}.w-2\\.5{width:.625rem}.w-2\\/4{width:50%}.w-20{width:5rem}.w-24{width:6rem}.w-3{width:.75rem}.w-3\\.5{width:.875rem}.w-32{width:8rem}.w-36{width:9rem}.w-4{width:1rem}.w-44{width:11rem}.w-48{width:12rem}.w-5{width:1.25rem}.w-6{width:1.5rem}.w-64{width:16rem}.w-8{width:2rem}.w-8\\/12{width:66.666667%}.w-80{width:20rem}.w-9{width:2.25rem}.w-9\\/12{width:75%}.w-\\[10px\\]{width:10px}.w-\\[148px\\]{width:148px}.w-\\[188px\\]{width:188px}.w-\\[1px\\]{width:1px}.w-\\[208px\\]{width:208px}.w-\\[272px\\]{width:272px}.w-\\[300px\\]{width:300px}.w-\\[3px\\]{width:3px}.w-\\[52px\\]{width:52px}.w-\\[56px\\]{width:56px}.w-\\[6px\\]{width:6px}.w-\\[calc\\(100\\%-2rem\\)\\]{width:calc(100% - 2rem)}.w-full{width:100%}.max-w-2xl{max-width:42rem}.max-w-4xl{max-width:56rem}.max-w-7xl{max-width:80rem}.max-w-\\[133px\\]{max-width:133px}.max-w-\\[301px\\]{max-width:301px}.max-w-\\[341px\\]{max-width:341px}.max-w-\\[351px\\]{max-width:351px}.max-w-\\[540px\\]{max-width:540px}.max-w-\\[640px\\]{max-width:640px}.max-w-\\[83px\\]{max-width:83px}.max-w-full{max-width:100%}.max-w-lg{max-width:32rem}.max-w-md{max-width:28rem}.max-w-screen-md{max-width:768px}.max-w-screen-xl{max-width:1280px}.max-w-sm{max-width:24rem}.max-w-xl{max-width:36rem}.max-w-xs{max-width:20rem}.flex-1{flex:1 1 0%}.flex-shrink-0,.shrink-0{flex-shrink:0}.origin-\\[0\\]{transform-origin:0}.-translate-x-1\\/2{--tw-translate-x: -50%;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.-translate-x-1\\/3{--tw-translate-x: -33.333333%;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.-translate-y-1\\/2{--tw-translate-y: -50%;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.-translate-y-1\\/3{--tw-translate-y: -33.333333%;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.-translate-y-4{--tw-translate-y: -1rem;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.-translate-y-6{--tw-translate-y: -1.5rem;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.translate-x-1\\/3{--tw-translate-x: 33.333333%;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.translate-y-1\\/3{--tw-translate-y: 33.333333%;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.rotate-45{--tw-rotate: 45deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.scale-75{--tw-scale-x: .75;--tw-scale-y: .75;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@keyframes pulse{50%{opacity:.5}}.animate-pulse{animation:pulse 2s cubic-bezier(.4,0,.6,1) infinite}@keyframes spin{to{transform:rotate(360deg)}}.animate-spin{animation:spin 1s linear infinite}.cursor-not-allowed{cursor:not-allowed}.cursor-pointer{cursor:pointer}.resize{resize:both}.list-inside{list-style-position:inside}.list-outside{list-style-position:outside}.list-decimal{list-style-type:decimal}.list-disc{list-style-type:disc}.list-none{list-style-type:none}.appearance-none{-webkit-appearance:none;-moz-appearance:none;appearance:none}.grid-flow-row{grid-auto-flow:row}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.grid-cols-5{grid-template-columns:repeat(5,minmax(0,1fr))}.grid-cols-7{grid-template-columns:repeat(7,minmax(0,1fr))}.flex-row{flex-direction:row}.flex-col{flex-direction:column}.flex-col-reverse{flex-direction:column-reverse}.flex-wrap{flex-wrap:wrap}.items-start{align-items:flex-start}.items-end{align-items:flex-end}.items-center{align-items:center}.items-baseline{align-items:baseline}.justify-start{justify-content:flex-start}.justify-end{justify-content:flex-end}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-1{gap:.25rem}.gap-2{gap:.5rem}.gap-3{gap:.75rem}.gap-4{gap:1rem}.gap-6{gap:1.5rem}.gap-8{gap:2rem}.gap-y-4{row-gap:1rem}.-space-x-px>:not([hidden])~:not([hidden]){--tw-space-x-reverse: 0;margin-right:calc(-1px * var(--tw-space-x-reverse));margin-left:calc(-1px * calc(1 - var(--tw-space-x-reverse)))}.space-x-1>:not([hidden])~:not([hidden]){--tw-space-x-reverse: 0;margin-right:calc(.25rem * var(--tw-space-x-reverse));margin-left:calc(.25rem * calc(1 - var(--tw-space-x-reverse)))}.space-x-2>:not([hidden])~:not([hidden]){--tw-space-x-reverse: 0;margin-right:calc(.5rem * var(--tw-space-x-reverse));margin-left:calc(.5rem * calc(1 - var(--tw-space-x-reverse)))}.space-x-3>:not([hidden])~:not([hidden]){--tw-space-x-reverse: 0;margin-right:calc(.75rem * var(--tw-space-x-reverse));margin-left:calc(.75rem * calc(1 - var(--tw-space-x-reverse)))}.space-x-4>:not([hidden])~:not([hidden]){--tw-space-x-reverse: 0;margin-right:calc(1rem * var(--tw-space-x-reverse));margin-left:calc(1rem * calc(1 - var(--tw-space-x-reverse)))}.space-x-5>:not([hidden])~:not([hidden]){--tw-space-x-reverse: 0;margin-right:calc(1.25rem * var(--tw-space-x-reverse));margin-left:calc(1.25rem * calc(1 - var(--tw-space-x-reverse)))}.space-x-6>:not([hidden])~:not([hidden]){--tw-space-x-reverse: 0;margin-right:calc(1.5rem * var(--tw-space-x-reverse));margin-left:calc(1.5rem * calc(1 - var(--tw-space-x-reverse)))}.space-y-1>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(.25rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.25rem * var(--tw-space-y-reverse))}.space-y-2>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(.5rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.5rem * var(--tw-space-y-reverse))}.space-y-2\\.5>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(.625rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.625rem * var(--tw-space-y-reverse))}.space-y-4>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(1rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1rem * var(--tw-space-y-reverse))}.space-y-6>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(1.5rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1.5rem * var(--tw-space-y-reverse))}.space-y-8>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(2rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(2rem * var(--tw-space-y-reverse))}.divide-x>:not([hidden])~:not([hidden]){--tw-divide-x-reverse: 0;border-right-width:calc(1px * var(--tw-divide-x-reverse));border-left-width:calc(1px * calc(1 - var(--tw-divide-x-reverse)))}.divide-y>:not([hidden])~:not([hidden]){--tw-divide-y-reverse: 0;border-top-width:calc(1px * calc(1 - var(--tw-divide-y-reverse)));border-bottom-width:calc(1px * var(--tw-divide-y-reverse))}.divide-blue-300>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(164 202 254 / var(--tw-divide-opacity))}.divide-blue-400>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(118 169 250 / var(--tw-divide-opacity))}.divide-gray-100>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(243 244 246 / var(--tw-divide-opacity))}.divide-gray-200>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(229 231 235 / var(--tw-divide-opacity))}.divide-gray-300>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(209 213 219 / var(--tw-divide-opacity))}.divide-gray-400>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(156 163 175 / var(--tw-divide-opacity))}.divide-gray-500>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(107 114 128 / var(--tw-divide-opacity))}.divide-gray-700>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(55 65 81 / var(--tw-divide-opacity))}.divide-green-300>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(132 225 188 / var(--tw-divide-opacity))}.divide-green-400>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(49 196 141 / var(--tw-divide-opacity))}.divide-indigo-300>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(180 198 252 / var(--tw-divide-opacity))}.divide-indigo-400>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(141 162 251 / var(--tw-divide-opacity))}.divide-orange-300>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(253 186 140 / var(--tw-divide-opacity))}.divide-pink-300>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(248 180 217 / var(--tw-divide-opacity))}.divide-pink-400>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(241 126 184 / var(--tw-divide-opacity))}.divide-purple-300>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(202 191 253 / var(--tw-divide-opacity))}.divide-purple-400>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(172 148 250 / var(--tw-divide-opacity))}.divide-red-300>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(248 180 180 / var(--tw-divide-opacity))}.divide-red-400>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(249 128 128 / var(--tw-divide-opacity))}.divide-yellow-300>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(250 202 21 / var(--tw-divide-opacity))}.divide-yellow-400>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(227 160 8 / var(--tw-divide-opacity))}.self-center{align-self:center}.overflow-hidden{overflow:hidden}.overflow-x-auto{overflow-x:auto}.overflow-y-auto{overflow-y:auto}.overflow-y-scroll{overflow-y:scroll}.overscroll-contain{overscroll-behavior:contain}.whitespace-normal{white-space:normal}.whitespace-nowrap{white-space:nowrap}.whitespace-pre{white-space:pre}.whitespace-pre-line{white-space:pre-line}.whitespace-pre-wrap{white-space:pre-wrap}.\\!rounded-md{border-radius:.375rem!important}.rounded{border-radius:.25rem}.rounded-\\[2\\.5rem\\]{border-radius:2.5rem}.rounded-\\[2rem\\]{border-radius:2rem}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:.5rem}.rounded-sm{border-radius:.125rem}.rounded-xl{border-radius:.75rem}.rounded-b{border-bottom-right-radius:.25rem;border-bottom-left-radius:.25rem}.rounded-b-\\[1rem\\]{border-bottom-right-radius:1rem;border-bottom-left-radius:1rem}.rounded-b-\\[2\\.5rem\\]{border-bottom-right-radius:2.5rem;border-bottom-left-radius:2.5rem}.rounded-b-lg{border-bottom-right-radius:.5rem;border-bottom-left-radius:.5rem}.rounded-b-xl{border-bottom-right-radius:.75rem;border-bottom-left-radius:.75rem}.rounded-l{border-top-left-radius:.25rem;border-bottom-left-radius:.25rem}.rounded-l-full{border-top-left-radius:9999px;border-bottom-left-radius:9999px}.rounded-l-lg{border-top-left-radius:.5rem;border-bottom-left-radius:.5rem}.rounded-r{border-top-right-radius:.25rem;border-bottom-right-radius:.25rem}.rounded-r-full{border-top-right-radius:9999px;border-bottom-right-radius:9999px}.rounded-r-lg{border-top-right-radius:.5rem;border-bottom-right-radius:.5rem}.rounded-t{border-top-left-radius:.25rem;border-top-right-radius:.25rem}.rounded-t-\\[2\\.5rem\\]{border-top-left-radius:2.5rem;border-top-right-radius:2.5rem}.rounded-t-lg{border-top-left-radius:.5rem;border-top-right-radius:.5rem}.rounded-t-md{border-top-left-radius:.375rem;border-top-right-radius:.375rem}.rounded-t-sm{border-top-left-radius:.125rem;border-top-right-radius:.125rem}.rounded-t-xl{border-top-left-radius:.75rem;border-top-right-radius:.75rem}.\\!border-0{border-width:0px!important}.border{border-width:1px}.border-0{border-width:0px}.border-2{border-width:2px}.border-\\[10px\\]{border-width:10px}.border-\\[14px\\]{border-width:14px}.border-\\[16px\\]{border-width:16px}.border-\\[8px\\]{border-width:8px}.border-x{border-left-width:1px;border-right-width:1px}.border-y{border-top-width:1px;border-bottom-width:1px}.border-b{border-bottom-width:1px}.border-b-2{border-bottom-width:2px}.border-l{border-left-width:1px}.border-l-0{border-left-width:0px}.border-l-4{border-left-width:4px}.border-r{border-right-width:1px}.border-t{border-top-width:1px}.border-dashed{border-style:dashed}.border-blue-300{--tw-border-opacity: 1;border-color:rgb(164 202 254 / var(--tw-border-opacity))}.border-blue-400{--tw-border-opacity: 1;border-color:rgb(118 169 250 / var(--tw-border-opacity))}.border-blue-700{--tw-border-opacity: 1;border-color:rgb(26 86 219 / var(--tw-border-opacity))}.border-gray-100{--tw-border-opacity: 1;border-color:rgb(243 244 246 / var(--tw-border-opacity))}.border-gray-200{--tw-border-opacity: 1;border-color:rgb(229 231 235 / var(--tw-border-opacity))}.border-gray-300{--tw-border-opacity: 1;border-color:rgb(209 213 219 / var(--tw-border-opacity))}.border-gray-500{--tw-border-opacity: 1;border-color:rgb(107 114 128 / var(--tw-border-opacity))}.border-gray-700{--tw-border-opacity: 1;border-color:rgb(55 65 81 / var(--tw-border-opacity))}.border-gray-800{--tw-border-opacity: 1;border-color:rgb(31 41 55 / var(--tw-border-opacity))}.border-gray-900{--tw-border-opacity: 1;border-color:rgb(17 24 39 / var(--tw-border-opacity))}.border-green-300{--tw-border-opacity: 1;border-color:rgb(132 225 188 / var(--tw-border-opacity))}.border-green-400{--tw-border-opacity: 1;border-color:rgb(49 196 141 / var(--tw-border-opacity))}.border-green-500{--tw-border-opacity: 1;border-color:rgb(14 159 110 / var(--tw-border-opacity))}.border-green-600{--tw-border-opacity: 1;border-color:rgb(5 122 85 / var(--tw-border-opacity))}.border-green-700{--tw-border-opacity: 1;border-color:rgb(4 108 78 / var(--tw-border-opacity))}.border-indigo-300{--tw-border-opacity: 1;border-color:rgb(180 198 252 / var(--tw-border-opacity))}.border-indigo-400{--tw-border-opacity: 1;border-color:rgb(141 162 251 / var(--tw-border-opacity))}.border-inherit{border-color:inherit}.border-orange-300{--tw-border-opacity: 1;border-color:rgb(253 186 140 / var(--tw-border-opacity))}.border-pink-300{--tw-border-opacity: 1;border-color:rgb(248 180 217 / var(--tw-border-opacity))}.border-pink-400{--tw-border-opacity: 1;border-color:rgb(241 126 184 / var(--tw-border-opacity))}.border-purple-300{--tw-border-opacity: 1;border-color:rgb(202 191 253 / var(--tw-border-opacity))}.border-purple-400{--tw-border-opacity: 1;border-color:rgb(172 148 250 / var(--tw-border-opacity))}.border-purple-700{--tw-border-opacity: 1;border-color:rgb(108 43 217 / var(--tw-border-opacity))}.border-red-300{--tw-border-opacity: 1;border-color:rgb(248 180 180 / var(--tw-border-opacity))}.border-red-400{--tw-border-opacity: 1;border-color:rgb(249 128 128 / var(--tw-border-opacity))}.border-red-500{--tw-border-opacity: 1;border-color:rgb(240 82 82 / var(--tw-border-opacity))}.border-red-600{--tw-border-opacity: 1;border-color:rgb(224 36 36 / var(--tw-border-opacity))}.border-red-700{--tw-border-opacity: 1;border-color:rgb(200 30 30 / var(--tw-border-opacity))}.border-transparent{border-color:transparent}.border-white{--tw-border-opacity: 1;border-color:rgb(255 255 255 / var(--tw-border-opacity))}.border-yellow-300{--tw-border-opacity: 1;border-color:rgb(250 202 21 / var(--tw-border-opacity))}.border-yellow-400{--tw-border-opacity: 1;border-color:rgb(227 160 8 / var(--tw-border-opacity))}.bg-blue-100{--tw-bg-opacity: 1;background-color:rgb(225 239 254 / var(--tw-bg-opacity))}.bg-blue-200{--tw-bg-opacity: 1;background-color:rgb(195 221 253 / var(--tw-bg-opacity))}.bg-blue-50{--tw-bg-opacity: 1;background-color:rgb(235 245 255 / var(--tw-bg-opacity))}.bg-blue-500{--tw-bg-opacity: 1;background-color:rgb(63 131 248 / var(--tw-bg-opacity))}.bg-blue-600{--tw-bg-opacity: 1;background-color:rgb(28 100 242 / var(--tw-bg-opacity))}.bg-blue-700{--tw-bg-opacity: 1;background-color:rgb(26 86 219 / var(--tw-bg-opacity))}.bg-blue-800{--tw-bg-opacity: 1;background-color:rgb(30 66 159 / var(--tw-bg-opacity))}.bg-gray-100{--tw-bg-opacity: 1;background-color:rgb(243 244 246 / var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity: 1;background-color:rgb(229 231 235 / var(--tw-bg-opacity))}.bg-gray-300{--tw-bg-opacity: 1;background-color:rgb(209 213 219 / var(--tw-bg-opacity))}.bg-gray-400{--tw-bg-opacity: 1;background-color:rgb(156 163 175 / var(--tw-bg-opacity))}.bg-gray-50{--tw-bg-opacity: 1;background-color:rgb(249 250 251 / var(--tw-bg-opacity))}.bg-gray-600{--tw-bg-opacity: 1;background-color:rgb(75 85 99 / var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity: 1;background-color:rgb(55 65 81 / var(--tw-bg-opacity))}.bg-gray-800{--tw-bg-opacity: 1;background-color:rgb(31 41 55 / var(--tw-bg-opacity))}.bg-gray-900{--tw-bg-opacity: 1;background-color:rgb(17 24 39 / var(--tw-bg-opacity))}.bg-green-100{--tw-bg-opacity: 1;background-color:rgb(222 247 236 / var(--tw-bg-opacity))}.bg-green-50{--tw-bg-opacity: 1;background-color:rgb(243 250 247 / var(--tw-bg-opacity))}.bg-green-500{--tw-bg-opacity: 1;background-color:rgb(14 159 110 / var(--tw-bg-opacity))}.bg-green-600{--tw-bg-opacity: 1;background-color:rgb(5 122 85 / var(--tw-bg-opacity))}.bg-green-700{--tw-bg-opacity: 1;background-color:rgb(4 108 78 / var(--tw-bg-opacity))}.bg-green-800{--tw-bg-opacity: 1;background-color:rgb(3 84 63 / var(--tw-bg-opacity))}.bg-indigo-100{--tw-bg-opacity: 1;background-color:rgb(229 237 255 / var(--tw-bg-opacity))}.bg-indigo-50{--tw-bg-opacity: 1;background-color:rgb(240 245 255 / var(--tw-bg-opacity))}.bg-indigo-500{--tw-bg-opacity: 1;background-color:rgb(104 117 245 / var(--tw-bg-opacity))}.bg-indigo-600{--tw-bg-opacity: 1;background-color:rgb(88 80 236 / var(--tw-bg-opacity))}.bg-indigo-800{--tw-bg-opacity: 1;background-color:rgb(66 56 157 / var(--tw-bg-opacity))}.bg-inherit{background-color:inherit}.bg-orange-100{--tw-bg-opacity: 1;background-color:rgb(254 236 220 / var(--tw-bg-opacity))}.bg-orange-50{--tw-bg-opacity: 1;background-color:rgb(255 248 241 / var(--tw-bg-opacity))}.bg-orange-600{--tw-bg-opacity: 1;background-color:rgb(208 56 1 / var(--tw-bg-opacity))}.bg-pink-100{--tw-bg-opacity: 1;background-color:rgb(252 232 243 / var(--tw-bg-opacity))}.bg-pink-50{--tw-bg-opacity: 1;background-color:rgb(253 242 248 / var(--tw-bg-opacity))}.bg-pink-500{--tw-bg-opacity: 1;background-color:rgb(231 70 148 / var(--tw-bg-opacity))}.bg-pink-800{--tw-bg-opacity: 1;background-color:rgb(153 21 75 / var(--tw-bg-opacity))}.bg-purple-100{--tw-bg-opacity: 1;background-color:rgb(237 235 254 / var(--tw-bg-opacity))}.bg-purple-50{--tw-bg-opacity: 1;background-color:rgb(246 245 255 / var(--tw-bg-opacity))}.bg-purple-500{--tw-bg-opacity: 1;background-color:rgb(144 97 249 / var(--tw-bg-opacity))}.bg-purple-600{--tw-bg-opacity: 1;background-color:rgb(126 58 242 / var(--tw-bg-opacity))}.bg-purple-700{--tw-bg-opacity: 1;background-color:rgb(108 43 217 / var(--tw-bg-opacity))}.bg-purple-800{--tw-bg-opacity: 1;background-color:rgb(85 33 181 / var(--tw-bg-opacity))}.bg-red-100{--tw-bg-opacity: 1;background-color:rgb(253 232 232 / var(--tw-bg-opacity))}.bg-red-50{--tw-bg-opacity: 1;background-color:rgb(253 242 242 / var(--tw-bg-opacity))}.bg-red-500{--tw-bg-opacity: 1;background-color:rgb(240 82 82 / var(--tw-bg-opacity))}.bg-red-600{--tw-bg-opacity: 1;background-color:rgb(224 36 36 / var(--tw-bg-opacity))}.bg-red-700{--tw-bg-opacity: 1;background-color:rgb(200 30 30 / var(--tw-bg-opacity))}.bg-red-900{--tw-bg-opacity: 1;background-color:rgb(119 29 29 / var(--tw-bg-opacity))}.bg-teal-500{--tw-bg-opacity: 1;background-color:rgb(6 148 162 / var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}.bg-white\\/30{background-color:#ffffff4d}.bg-yellow-100{--tw-bg-opacity: 1;background-color:rgb(253 246 178 / var(--tw-bg-opacity))}.bg-yellow-300{--tw-bg-opacity: 1;background-color:rgb(250 202 21 / var(--tw-bg-opacity))}.bg-yellow-400{--tw-bg-opacity: 1;background-color:rgb(227 160 8 / var(--tw-bg-opacity))}.bg-yellow-50{--tw-bg-opacity: 1;background-color:rgb(253 253 234 / var(--tw-bg-opacity))}.bg-yellow-500{--tw-bg-opacity: 1;background-color:rgb(194 120 3 / var(--tw-bg-opacity))}.bg-yellow-600{--tw-bg-opacity: 1;background-color:rgb(159 88 10 / var(--tw-bg-opacity))}.bg-opacity-50{--tw-bg-opacity: .5}.bg-opacity-75{--tw-bg-opacity: .75}.bg-gradient-to-br{background-image:linear-gradient(to bottom right,var(--tw-gradient-stops))}.bg-gradient-to-r{background-image:linear-gradient(to right,var(--tw-gradient-stops))}.from-blue-500{--tw-gradient-from: #3F83F8 var(--tw-gradient-from-position);--tw-gradient-to: rgb(63 131 248 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)}.from-cyan-400{--tw-gradient-from: #22d3ee var(--tw-gradient-from-position);--tw-gradient-to: rgb(34 211 238 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)}.from-cyan-500{--tw-gradient-from: #06b6d4 var(--tw-gradient-from-position);--tw-gradient-to: rgb(6 182 212 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)}.from-green-400{--tw-gradient-from: #31C48D var(--tw-gradient-from-position);--tw-gradient-to: rgb(49 196 141 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)}.from-lime-200{--tw-gradient-from: #d9f99d var(--tw-gradient-from-position);--tw-gradient-to: rgb(217 249 157 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)}.from-pink-400{--tw-gradient-from: #F17EB8 var(--tw-gradient-from-position);--tw-gradient-to: rgb(241 126 184 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)}.from-pink-500{--tw-gradient-from: #E74694 var(--tw-gradient-from-position);--tw-gradient-to: rgb(231 70 148 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)}.from-purple-500{--tw-gradient-from: #9061F9 var(--tw-gradient-from-position);--tw-gradient-to: rgb(144 97 249 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)}.from-purple-600{--tw-gradient-from: #7E3AF2 var(--tw-gradient-from-position);--tw-gradient-to: rgb(126 58 242 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)}.from-red-200{--tw-gradient-from: #FBD5D5 var(--tw-gradient-from-position);--tw-gradient-to: rgb(251 213 213 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)}.from-red-400{--tw-gradient-from: #F98080 var(--tw-gradient-from-position);--tw-gradient-to: rgb(249 128 128 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)}.from-sky-400{--tw-gradient-from: #38bdf8 var(--tw-gradient-from-position);--tw-gradient-to: rgb(56 189 248 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)}.from-teal-200{--tw-gradient-from: #AFECEF var(--tw-gradient-from-position);--tw-gradient-to: rgb(175 236 239 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)}.from-teal-400{--tw-gradient-from: #16BDCA var(--tw-gradient-from-position);--tw-gradient-to: rgb(22 189 202 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)}.via-blue-600{--tw-gradient-to: rgb(28 100 242 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), #1C64F2 var(--tw-gradient-via-position), var(--tw-gradient-to)}.via-cyan-500{--tw-gradient-to: rgb(6 182 212 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), #06b6d4 var(--tw-gradient-via-position), var(--tw-gradient-to)}.via-green-500{--tw-gradient-to: rgb(14 159 110 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), #0E9F6E var(--tw-gradient-via-position), var(--tw-gradient-to)}.via-lime-400{--tw-gradient-to: rgb(163 230 53 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), #a3e635 var(--tw-gradient-via-position), var(--tw-gradient-to)}.via-pink-500{--tw-gradient-to: rgb(231 70 148 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), #E74694 var(--tw-gradient-via-position), var(--tw-gradient-to)}.via-purple-600{--tw-gradient-to: rgb(126 58 242 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), #7E3AF2 var(--tw-gradient-via-position), var(--tw-gradient-to)}.via-red-300{--tw-gradient-to: rgb(248 180 180 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), #F8B4B4 var(--tw-gradient-via-position), var(--tw-gradient-to)}.via-red-500{--tw-gradient-to: rgb(240 82 82 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), #F05252 var(--tw-gradient-via-position), var(--tw-gradient-to)}.via-teal-500{--tw-gradient-to: rgb(6 148 162 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), #0694A2 var(--tw-gradient-via-position), var(--tw-gradient-to)}.to-blue-500{--tw-gradient-to: #3F83F8 var(--tw-gradient-to-position)}.to-blue-600{--tw-gradient-to: #1C64F2 var(--tw-gradient-to-position)}.to-blue-700{--tw-gradient-to: #1A56DB var(--tw-gradient-to-position)}.to-cyan-600{--tw-gradient-to: #0891b2 var(--tw-gradient-to-position)}.to-emerald-600{--tw-gradient-to: #059669 var(--tw-gradient-to-position)}.to-green-600{--tw-gradient-to: #057A55 var(--tw-gradient-to-position)}.to-lime-200{--tw-gradient-to: #d9f99d var(--tw-gradient-to-position)}.to-lime-500{--tw-gradient-to: #84cc16 var(--tw-gradient-to-position)}.to-orange-400{--tw-gradient-to: #FF8A4C var(--tw-gradient-to-position)}.to-pink-500{--tw-gradient-to: #E74694 var(--tw-gradient-to-position)}.to-pink-600{--tw-gradient-to: #D61F69 var(--tw-gradient-to-position)}.to-purple-700{--tw-gradient-to: #6C2BD9 var(--tw-gradient-to-position)}.to-red-600{--tw-gradient-to: #E02424 var(--tw-gradient-to-position)}.to-teal-600{--tw-gradient-to: #047481 var(--tw-gradient-to-position)}.to-yellow-200{--tw-gradient-to: #FCE96A var(--tw-gradient-to-position)}.bg-clip-text{-webkit-background-clip:text;background-clip:text}.fill-blue-600{fill:#1c64f2}.fill-gray-600{fill:#4b5563}.fill-green-500{fill:#0e9f6e}.fill-pink-600{fill:#d61f69}.fill-purple-600{fill:#7e3af2}.fill-red-600{fill:#e02424}.fill-white{fill:#fff}.fill-yellow-400{fill:#e3a008}.object-cover{-o-object-fit:cover;object-fit:cover}.\\!p-0{padding:0!important}.\\!p-2{padding:.5rem!important}.\\!p-3{padding:.75rem!important}.p-0{padding:0}.p-0\\.5{padding:.125rem}.p-1{padding:.25rem}.p-1\\.5{padding:.375rem}.p-2{padding:.5rem}.p-2\\.5{padding:.625rem}.p-3{padding:.75rem}.p-4{padding:1rem}.p-5{padding:1.25rem}.p-6{padding:1.5rem}.\\!px-0{padding-left:0!important;padding-right:0!important}.px-0{padding-left:0;padding-right:0}.px-2{padding-left:.5rem;padding-right:.5rem}.px-2\\.5{padding-left:.625rem;padding-right:.625rem}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.px-5{padding-left:1.25rem;padding-right:1.25rem}.px-6{padding-left:1.5rem;padding-right:1.5rem}.px-8{padding-left:2rem;padding-right:2rem}.py-0{padding-top:0;padding-bottom:0}.py-0\\.5{padding-top:.125rem;padding-bottom:.125rem}.py-1{padding-top:.25rem;padding-bottom:.25rem}.py-1\\.5{padding-top:.375rem;padding-bottom:.375rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.py-2\\.5{padding-top:.625rem;padding-bottom:.625rem}.py-3{padding-top:.75rem;padding-bottom:.75rem}.py-3\\.5{padding-top:.875rem;padding-bottom:.875rem}.py-4{padding-top:1rem;padding-bottom:1rem}.py-5{padding-top:1.25rem;padding-bottom:1.25rem}.pb-1{padding-bottom:.25rem}.pb-1\\.5{padding-bottom:.375rem}.pb-2{padding-bottom:.5rem}.pb-2\\.5{padding-bottom:.625rem}.pb-3{padding-bottom:.75rem}.pl-10{padding-left:2.5rem}.pl-11{padding-left:2.75rem}.pl-2{padding-left:.5rem}.pl-2\\.5{padding-left:.625rem}.pl-3{padding-left:.75rem}.pl-4{padding-left:1rem}.pl-9{padding-left:2.25rem}.pr-10{padding-right:2.5rem}.pr-11{padding-right:2.75rem}.pr-2{padding-right:.5rem}.pr-2\\.5{padding-right:.625rem}.pr-3{padding-right:.75rem}.pr-4{padding-right:1rem}.pr-9{padding-right:2.25rem}.pt-3{padding-top:.75rem}.pt-4{padding-top:1rem}.pt-5{padding-top:1.25rem}.text-left{text-align:left}.text-center{text-align:center}.text-right{text-align:right}.text-justify{text-align:justify}.text-2xl{font-size:1.5rem;line-height:2rem}.text-3xl{font-size:1.875rem;line-height:2.25rem}.text-4xl{font-size:2.25rem;line-height:2.5rem}.text-5xl{font-size:3rem;line-height:1}.text-6xl{font-size:3.75rem;line-height:1}.text-7xl{font-size:4.5rem;line-height:1}.text-8xl{font-size:6rem;line-height:1}.text-9xl{font-size:8rem;line-height:1}.text-base{font-size:1rem;line-height:1.5rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-black{font-weight:900}.font-bold{font-weight:700}.font-extrabold{font-weight:800}.font-extralight{font-weight:200}.font-light{font-weight:300}.font-medium{font-weight:500}.font-normal{font-weight:400}.font-semibold{font-weight:600}.font-thin{font-weight:100}.uppercase{text-transform:uppercase}.lowercase{text-transform:lowercase}.italic{font-style:italic}.leading-5{line-height:1.25rem}.leading-6{line-height:1.5rem}.leading-9{line-height:2.25rem}.leading-loose{line-height:2}.leading-none{line-height:1}.leading-normal{line-height:1.5}.leading-relaxed{line-height:1.625}.leading-tight{line-height:1.25}.tracking-normal{letter-spacing:0em}.tracking-tight{letter-spacing:-.025em}.tracking-tighter{letter-spacing:-.05em}.tracking-wide{letter-spacing:.025em}.tracking-wider{letter-spacing:.05em}.tracking-widest{letter-spacing:.1em}.\\!text-gray-900{--tw-text-opacity: 1 !important;color:rgb(17 24 39 / var(--tw-text-opacity))!important}.text-blue-100{--tw-text-opacity: 1;color:rgb(225 239 254 / var(--tw-text-opacity))}.text-blue-400{--tw-text-opacity: 1;color:rgb(118 169 250 / var(--tw-text-opacity))}.text-blue-50{--tw-text-opacity: 1;color:rgb(235 245 255 / var(--tw-text-opacity))}.text-blue-500{--tw-text-opacity: 1;color:rgb(63 131 248 / var(--tw-text-opacity))}.text-blue-600{--tw-text-opacity: 1;color:rgb(28 100 242 / var(--tw-text-opacity))}.text-blue-700{--tw-text-opacity: 1;color:rgb(26 86 219 / var(--tw-text-opacity))}.text-blue-800{--tw-text-opacity: 1;color:rgb(30 66 159 / var(--tw-text-opacity))}.text-gray-200{--tw-text-opacity: 1;color:rgb(229 231 235 / var(--tw-text-opacity))}.text-gray-300{--tw-text-opacity: 1;color:rgb(209 213 219 / var(--tw-text-opacity))}.text-gray-400{--tw-text-opacity: 1;color:rgb(156 163 175 / var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity: 1;color:rgb(107 114 128 / var(--tw-text-opacity))}.text-gray-600{--tw-text-opacity: 1;color:rgb(75 85 99 / var(--tw-text-opacity))}.text-gray-700{--tw-text-opacity: 1;color:rgb(55 65 81 / var(--tw-text-opacity))}.text-gray-800{--tw-text-opacity: 1;color:rgb(31 41 55 / var(--tw-text-opacity))}.text-gray-900{--tw-text-opacity: 1;color:rgb(17 24 39 / var(--tw-text-opacity))}.text-green-100{--tw-text-opacity: 1;color:rgb(222 247 236 / var(--tw-text-opacity))}.text-green-400{--tw-text-opacity: 1;color:rgb(49 196 141 / var(--tw-text-opacity))}.text-green-500{--tw-text-opacity: 1;color:rgb(14 159 110 / var(--tw-text-opacity))}.text-green-600{--tw-text-opacity: 1;color:rgb(5 122 85 / var(--tw-text-opacity))}.text-green-700{--tw-text-opacity: 1;color:rgb(4 108 78 / var(--tw-text-opacity))}.text-green-800{--tw-text-opacity: 1;color:rgb(3 84 63 / var(--tw-text-opacity))}.text-green-900{--tw-text-opacity: 1;color:rgb(1 71 55 / var(--tw-text-opacity))}.text-indigo-100{--tw-text-opacity: 1;color:rgb(229 237 255 / var(--tw-text-opacity))}.text-indigo-400{--tw-text-opacity: 1;color:rgb(141 162 251 / var(--tw-text-opacity))}.text-indigo-500{--tw-text-opacity: 1;color:rgb(104 117 245 / var(--tw-text-opacity))}.text-indigo-800{--tw-text-opacity: 1;color:rgb(66 56 157 / var(--tw-text-opacity))}.text-orange-500{--tw-text-opacity: 1;color:rgb(255 90 31 / var(--tw-text-opacity))}.text-orange-800{--tw-text-opacity: 1;color:rgb(138 44 13 / var(--tw-text-opacity))}.text-pink-100{--tw-text-opacity: 1;color:rgb(252 232 243 / var(--tw-text-opacity))}.text-pink-400{--tw-text-opacity: 1;color:rgb(241 126 184 / var(--tw-text-opacity))}.text-pink-500{--tw-text-opacity: 1;color:rgb(231 70 148 / var(--tw-text-opacity))}.text-pink-800{--tw-text-opacity: 1;color:rgb(153 21 75 / var(--tw-text-opacity))}.text-purple-100{--tw-text-opacity: 1;color:rgb(237 235 254 / var(--tw-text-opacity))}.text-purple-400{--tw-text-opacity: 1;color:rgb(172 148 250 / var(--tw-text-opacity))}.text-purple-500{--tw-text-opacity: 1;color:rgb(144 97 249 / var(--tw-text-opacity))}.text-purple-600{--tw-text-opacity: 1;color:rgb(126 58 242 / var(--tw-text-opacity))}.text-purple-700{--tw-text-opacity: 1;color:rgb(108 43 217 / var(--tw-text-opacity))}.text-purple-800{--tw-text-opacity: 1;color:rgb(85 33 181 / var(--tw-text-opacity))}.text-red-100{--tw-text-opacity: 1;color:rgb(253 232 232 / var(--tw-text-opacity))}.text-red-400{--tw-text-opacity: 1;color:rgb(249 128 128 / var(--tw-text-opacity))}.text-red-500{--tw-text-opacity: 1;color:rgb(240 82 82 / var(--tw-text-opacity))}.text-red-600{--tw-text-opacity: 1;color:rgb(224 36 36 / var(--tw-text-opacity))}.text-red-700{--tw-text-opacity: 1;color:rgb(200 30 30 / var(--tw-text-opacity))}.text-red-800{--tw-text-opacity: 1;color:rgb(155 28 28 / var(--tw-text-opacity))}.text-red-900{--tw-text-opacity: 1;color:rgb(119 29 29 / var(--tw-text-opacity))}.text-teal-600{--tw-text-opacity: 1;color:rgb(4 116 129 / var(--tw-text-opacity))}.text-transparent{color:transparent}.text-white{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}.text-yellow-100{--tw-text-opacity: 1;color:rgb(253 246 178 / var(--tw-text-opacity))}.text-yellow-400{--tw-text-opacity: 1;color:rgb(227 160 8 / var(--tw-text-opacity))}.text-yellow-500{--tw-text-opacity: 1;color:rgb(194 120 3 / var(--tw-text-opacity))}.text-yellow-800{--tw-text-opacity: 1;color:rgb(114 59 19 / var(--tw-text-opacity))}.underline{text-decoration-line:underline}.line-through{text-decoration-line:line-through}.decoration-blue-400{text-decoration-color:#76a9fa}.decoration-solid{text-decoration-style:solid}.decoration-2{text-decoration-thickness:2px}.underline-offset-2{text-underline-offset:2px}.placeholder-green-700::-moz-placeholder{--tw-placeholder-opacity: 1;color:rgb(4 108 78 / var(--tw-placeholder-opacity))}.placeholder-green-700::placeholder{--tw-placeholder-opacity: 1;color:rgb(4 108 78 / var(--tw-placeholder-opacity))}.placeholder-red-700::-moz-placeholder{--tw-placeholder-opacity: 1;color:rgb(200 30 30 / var(--tw-placeholder-opacity))}.placeholder-red-700::placeholder{--tw-placeholder-opacity: 1;color:rgb(200 30 30 / var(--tw-placeholder-opacity))}.opacity-30{opacity:.3}.opacity-40{opacity:.4}.opacity-50{opacity:.5}.opacity-60{opacity:.6}.shadow{--tw-shadow: 0 1px 3px 0 rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1);--tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-lg{--tw-shadow: 0 10px 15px -3px rgb(0 0 0 / .1), 0 4px 6px -4px rgb(0 0 0 / .1);--tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-md{--tw-shadow: 0 4px 6px -1px rgb(0 0 0 / .1), 0 2px 4px -2px rgb(0 0 0 / .1);--tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-sm{--tw-shadow: 0 1px 2px 0 rgb(0 0 0 / .05);--tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-xl{--tw-shadow: 0 20px 25px -5px rgb(0 0 0 / .1), 0 8px 10px -6px rgb(0 0 0 / .1);--tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-blue-500\\/50{--tw-shadow-color: rgb(63 131 248 / .5);--tw-shadow: var(--tw-shadow-colored)}.shadow-cyan-500\\/50{--tw-shadow-color: rgb(6 182 212 / .5);--tw-shadow: var(--tw-shadow-colored)}.shadow-gray-500\\/50{--tw-shadow-color: rgb(107 114 128 / .5);--tw-shadow: var(--tw-shadow-colored)}.shadow-green-500\\/50{--tw-shadow-color: rgb(14 159 110 / .5);--tw-shadow: var(--tw-shadow-colored)}.shadow-lime-500\\/50{--tw-shadow-color: rgb(132 204 22 / .5);--tw-shadow: var(--tw-shadow-colored)}.shadow-pink-500\\/50{--tw-shadow-color: rgb(231 70 148 / .5);--tw-shadow: var(--tw-shadow-colored)}.shadow-purple-500\\/50{--tw-shadow-color: rgb(144 97 249 / .5);--tw-shadow: var(--tw-shadow-colored)}.shadow-red-500\\/50{--tw-shadow-color: rgb(240 82 82 / .5);--tw-shadow: var(--tw-shadow-colored)}.shadow-teal-500\\/50{--tw-shadow-color: rgb(6 148 162 / .5);--tw-shadow: var(--tw-shadow-colored)}.shadow-yellow-500\\/50{--tw-shadow-color: rgb(194 120 3 / .5);--tw-shadow: var(--tw-shadow-colored)}.outline-none{outline:2px solid transparent;outline-offset:2px}.outline{outline-style:solid}.ring-0{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.ring-2{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.ring-8{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(8px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.ring-gray-300{--tw-ring-opacity: 1;--tw-ring-color: rgb(209 213 219 / var(--tw-ring-opacity))}.ring-white{--tw-ring-opacity: 1;--tw-ring-color: rgb(255 255 255 / var(--tw-ring-opacity))}.blur{--tw-blur: blur(8px);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,-webkit-backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-all{transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-transform{transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.duration-150{transition-duration:.15s}.duration-300{transition-duration:.3s}.duration-75{transition-duration:75ms}.ease-in{transition-timing-function:cubic-bezier(.4,0,1,1)}.first-letter\\:float-left:first-letter{float:left}.first-letter\\:mr-3:first-letter{margin-right:.75rem}.first-letter\\:text-7xl:first-letter{font-size:4.5rem;line-height:1}.first-letter\\:font-bold:first-letter{font-weight:700}.first-letter\\:text-gray-900:first-letter{--tw-text-opacity: 1;color:rgb(17 24 39 / var(--tw-text-opacity))}.first-line\\:uppercase:first-line{text-transform:uppercase}.first-line\\:tracking-widest:first-line{letter-spacing:.1em}.after\\:absolute:after{content:var(--tw-content);position:absolute}.after\\:left-\\[2px\\]:after{content:var(--tw-content);left:2px}.after\\:left-\\[4px\\]:after{content:var(--tw-content);left:4px}.after\\:top-0:after{content:var(--tw-content);top:0}.after\\:top-0\\.5:after{content:var(--tw-content);top:.125rem}.after\\:top-\\[2px\\]:after{content:var(--tw-content);top:2px}.after\\:h-4:after{content:var(--tw-content);height:1rem}.after\\:h-5:after{content:var(--tw-content);height:1.25rem}.after\\:h-6:after{content:var(--tw-content);height:1.5rem}.after\\:w-4:after{content:var(--tw-content);width:1rem}.after\\:w-5:after{content:var(--tw-content);width:1.25rem}.after\\:w-6:after{content:var(--tw-content);width:1.5rem}.after\\:rounded-full:after{content:var(--tw-content);border-radius:9999px}.after\\:border:after{content:var(--tw-content);border-width:1px}.after\\:border-gray-300:after{content:var(--tw-content);--tw-border-opacity: 1;border-color:rgb(209 213 219 / var(--tw-border-opacity))}.after\\:bg-white:after{content:var(--tw-content);--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}.after\\:transition-all:after{content:var(--tw-content);transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.after\\:content-\\[\\'\\'\\]:after{--tw-content: "";content:var(--tw-content)}.first\\:rounded-l-full:first-child{border-top-left-radius:9999px;border-bottom-left-radius:9999px}.first\\:rounded-l-lg:first-child{border-top-left-radius:.5rem;border-bottom-left-radius:.5rem}.first\\:rounded-t-lg:first-child{border-top-left-radius:.5rem;border-top-right-radius:.5rem}.first\\:border-l:first-child{border-left-width:1px}.last\\:mr-0:last-child{margin-right:0}.last\\:rounded-b-lg:last-child{border-bottom-right-radius:.5rem;border-bottom-left-radius:.5rem}.last\\:rounded-r-full:last-child{border-top-right-radius:9999px;border-bottom-right-radius:9999px}.last\\:rounded-r-lg:last-child{border-top-right-radius:.5rem;border-bottom-right-radius:.5rem}.last\\:border-b-0:last-child{border-bottom-width:0px}.last\\:border-r:last-child{border-right-width:1px}.odd\\:bg-blue-800:nth-child(odd){--tw-bg-opacity: 1;background-color:rgb(30 66 159 / var(--tw-bg-opacity))}.odd\\:bg-green-800:nth-child(odd){--tw-bg-opacity: 1;background-color:rgb(3 84 63 / var(--tw-bg-opacity))}.odd\\:bg-purple-800:nth-child(odd){--tw-bg-opacity: 1;background-color:rgb(85 33 181 / var(--tw-bg-opacity))}.odd\\:bg-red-800:nth-child(odd){--tw-bg-opacity: 1;background-color:rgb(155 28 28 / var(--tw-bg-opacity))}.odd\\:bg-white:nth-child(odd){--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}.odd\\:bg-yellow-800:nth-child(odd){--tw-bg-opacity: 1;background-color:rgb(114 59 19 / var(--tw-bg-opacity))}.even\\:bg-blue-700:nth-child(2n){--tw-bg-opacity: 1;background-color:rgb(26 86 219 / var(--tw-bg-opacity))}.even\\:bg-gray-50:nth-child(2n){--tw-bg-opacity: 1;background-color:rgb(249 250 251 / var(--tw-bg-opacity))}.even\\:bg-green-700:nth-child(2n){--tw-bg-opacity: 1;background-color:rgb(4 108 78 / var(--tw-bg-opacity))}.even\\:bg-purple-700:nth-child(2n){--tw-bg-opacity: 1;background-color:rgb(108 43 217 / var(--tw-bg-opacity))}.even\\:bg-red-700:nth-child(2n){--tw-bg-opacity: 1;background-color:rgb(200 30 30 / var(--tw-bg-opacity))}.even\\:bg-yellow-700:nth-child(2n){--tw-bg-opacity: 1;background-color:rgb(142 75 16 / var(--tw-bg-opacity))}.focus-within\\:ring-1:focus-within{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.hover\\:border-gray-300:hover{--tw-border-opacity: 1;border-color:rgb(209 213 219 / var(--tw-border-opacity))}.hover\\:bg-blue-100:hover{--tw-bg-opacity: 1;background-color:rgb(225 239 254 / var(--tw-bg-opacity))}.hover\\:bg-blue-200:hover{--tw-bg-opacity: 1;background-color:rgb(195 221 253 / var(--tw-bg-opacity))}.hover\\:bg-blue-400:hover{--tw-bg-opacity: 1;background-color:rgb(118 169 250 / var(--tw-bg-opacity))}.hover\\:bg-blue-700:hover{--tw-bg-opacity: 1;background-color:rgb(26 86 219 / var(--tw-bg-opacity))}.hover\\:bg-blue-800:hover{--tw-bg-opacity: 1;background-color:rgb(30 66 159 / var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity: 1;background-color:rgb(243 244 246 / var(--tw-bg-opacity))}.hover\\:bg-gray-200:hover{--tw-bg-opacity: 1;background-color:rgb(229 231 235 / var(--tw-bg-opacity))}.hover\\:bg-gray-300:hover{--tw-bg-opacity: 1;background-color:rgb(209 213 219 / var(--tw-bg-opacity))}.hover\\:bg-gray-50:hover{--tw-bg-opacity: 1;background-color:rgb(249 250 251 / var(--tw-bg-opacity))}.hover\\:bg-gray-600:hover{--tw-bg-opacity: 1;background-color:rgb(75 85 99 / var(--tw-bg-opacity))}.hover\\:bg-gray-900:hover{--tw-bg-opacity: 1;background-color:rgb(17 24 39 / var(--tw-bg-opacity))}.hover\\:bg-green-200:hover{--tw-bg-opacity: 1;background-color:rgb(188 240 218 / var(--tw-bg-opacity))}.hover\\:bg-green-400:hover{--tw-bg-opacity: 1;background-color:rgb(49 196 141 / var(--tw-bg-opacity))}.hover\\:bg-green-800:hover{--tw-bg-opacity: 1;background-color:rgb(3 84 63 / var(--tw-bg-opacity))}.hover\\:bg-indigo-200:hover{--tw-bg-opacity: 1;background-color:rgb(205 219 254 / var(--tw-bg-opacity))}.hover\\:bg-pink-200:hover{--tw-bg-opacity: 1;background-color:rgb(250 209 232 / var(--tw-bg-opacity))}.hover\\:bg-purple-200:hover{--tw-bg-opacity: 1;background-color:rgb(220 215 254 / var(--tw-bg-opacity))}.hover\\:bg-purple-400:hover{--tw-bg-opacity: 1;background-color:rgb(172 148 250 / var(--tw-bg-opacity))}.hover\\:bg-purple-800:hover{--tw-bg-opacity: 1;background-color:rgb(85 33 181 / var(--tw-bg-opacity))}.hover\\:bg-red-200:hover{--tw-bg-opacity: 1;background-color:rgb(251 213 213 / var(--tw-bg-opacity))}.hover\\:bg-red-400:hover{--tw-bg-opacity: 1;background-color:rgb(249 128 128 / var(--tw-bg-opacity))}.hover\\:bg-red-800:hover{--tw-bg-opacity: 1;background-color:rgb(155 28 28 / var(--tw-bg-opacity))}.hover\\:bg-transparent:hover{background-color:transparent}.hover\\:bg-yellow-200:hover{--tw-bg-opacity: 1;background-color:rgb(252 233 106 / var(--tw-bg-opacity))}.hover\\:bg-yellow-400:hover{--tw-bg-opacity: 1;background-color:rgb(227 160 8 / var(--tw-bg-opacity))}.hover\\:bg-yellow-500:hover{--tw-bg-opacity: 1;background-color:rgb(194 120 3 / var(--tw-bg-opacity))}.hover\\:bg-gradient-to-bl:hover{background-image:linear-gradient(to bottom left,var(--tw-gradient-stops))}.hover\\:bg-gradient-to-br:hover{background-image:linear-gradient(to bottom right,var(--tw-gradient-stops))}.hover\\:bg-gradient-to-l:hover{background-image:linear-gradient(to left,var(--tw-gradient-stops))}.hover\\:\\!text-inherit:hover{color:inherit!important}.hover\\:text-blue-700:hover{--tw-text-opacity: 1;color:rgb(26 86 219 / var(--tw-text-opacity))}.hover\\:text-blue-900:hover{--tw-text-opacity: 1;color:rgb(35 56 118 / var(--tw-text-opacity))}.hover\\:text-gray-400:hover{--tw-text-opacity: 1;color:rgb(156 163 175 / var(--tw-text-opacity))}.hover\\:text-gray-600:hover{--tw-text-opacity: 1;color:rgb(75 85 99 / var(--tw-text-opacity))}.hover\\:text-gray-700:hover{--tw-text-opacity: 1;color:rgb(55 65 81 / var(--tw-text-opacity))}.hover\\:text-gray-900:hover{--tw-text-opacity: 1;color:rgb(17 24 39 / var(--tw-text-opacity))}.hover\\:text-green-900:hover{--tw-text-opacity: 1;color:rgb(1 71 55 / var(--tw-text-opacity))}.hover\\:text-indigo-900:hover{--tw-text-opacity: 1;color:rgb(54 47 120 / var(--tw-text-opacity))}.hover\\:text-pink-900:hover{--tw-text-opacity: 1;color:rgb(117 26 61 / var(--tw-text-opacity))}.hover\\:text-purple-900:hover{--tw-text-opacity: 1;color:rgb(74 29 150 / var(--tw-text-opacity))}.hover\\:text-red-900:hover{--tw-text-opacity: 1;color:rgb(119 29 29 / var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}.hover\\:text-yellow-900:hover{--tw-text-opacity: 1;color:rgb(99 49 18 / var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:no-underline:hover{text-decoration-line:none}.focus\\:z-10:focus{z-index:10}.focus\\:z-40:focus{z-index:40}.focus\\:border-blue-500:focus{--tw-border-opacity: 1;border-color:rgb(63 131 248 / var(--tw-border-opacity))}.focus\\:border-gray-200:focus{--tw-border-opacity: 1;border-color:rgb(229 231 235 / var(--tw-border-opacity))}.focus\\:border-green-500:focus{--tw-border-opacity: 1;border-color:rgb(14 159 110 / var(--tw-border-opacity))}.focus\\:border-green-600:focus{--tw-border-opacity: 1;border-color:rgb(5 122 85 / var(--tw-border-opacity))}.focus\\:border-red-500:focus{--tw-border-opacity: 1;border-color:rgb(240 82 82 / var(--tw-border-opacity))}.focus\\:border-red-600:focus{--tw-border-opacity: 1;border-color:rgb(224 36 36 / var(--tw-border-opacity))}.focus\\:bg-gray-900:focus{--tw-bg-opacity: 1;background-color:rgb(17 24 39 / var(--tw-bg-opacity))}.focus\\:text-blue-700:focus{--tw-text-opacity: 1;color:rgb(26 86 219 / var(--tw-text-opacity))}.focus\\:text-white:focus{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}.focus\\:outline-none:focus{outline:2px solid transparent;outline-offset:2px}.focus\\:ring-0:focus{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.focus\\:ring-1:focus{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.focus\\:ring-2:focus{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.focus\\:ring-4:focus{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.focus\\:\\!ring-gray-300:focus{--tw-ring-opacity: 1 !important;--tw-ring-color: rgb(209 213 219 / var(--tw-ring-opacity)) !important}.focus\\:ring-blue-300:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(164 202 254 / var(--tw-ring-opacity))}.focus\\:ring-blue-400:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(118 169 250 / var(--tw-ring-opacity))}.focus\\:ring-blue-500:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(63 131 248 / var(--tw-ring-opacity))}.focus\\:ring-cyan-300:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(103 232 249 / var(--tw-ring-opacity))}.focus\\:ring-gray-200:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(229 231 235 / var(--tw-ring-opacity))}.focus\\:ring-gray-300:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(209 213 219 / var(--tw-ring-opacity))}.focus\\:ring-gray-400:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(156 163 175 / var(--tw-ring-opacity))}.focus\\:ring-green-200:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(188 240 218 / var(--tw-ring-opacity))}.focus\\:ring-green-300:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(132 225 188 / var(--tw-ring-opacity))}.focus\\:ring-green-400:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(49 196 141 / var(--tw-ring-opacity))}.focus\\:ring-green-500:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(14 159 110 / var(--tw-ring-opacity))}.focus\\:ring-indigo-400:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(141 162 251 / var(--tw-ring-opacity))}.focus\\:ring-lime-200:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(217 249 157 / var(--tw-ring-opacity))}.focus\\:ring-lime-300:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(190 242 100 / var(--tw-ring-opacity))}.focus\\:ring-orange-500:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(255 90 31 / var(--tw-ring-opacity))}.focus\\:ring-pink-200:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(250 209 232 / var(--tw-ring-opacity))}.focus\\:ring-pink-300:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(248 180 217 / var(--tw-ring-opacity))}.focus\\:ring-pink-400:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(241 126 184 / var(--tw-ring-opacity))}.focus\\:ring-purple-200:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(220 215 254 / var(--tw-ring-opacity))}.focus\\:ring-purple-300:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(202 191 253 / var(--tw-ring-opacity))}.focus\\:ring-purple-400:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(172 148 250 / var(--tw-ring-opacity))}.focus\\:ring-purple-500:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(144 97 249 / var(--tw-ring-opacity))}.focus\\:ring-red-100:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(253 232 232 / var(--tw-ring-opacity))}.focus\\:ring-red-300:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(248 180 180 / var(--tw-ring-opacity))}.focus\\:ring-red-400:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(249 128 128 / var(--tw-ring-opacity))}.focus\\:ring-red-500:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(240 82 82 / var(--tw-ring-opacity))}.focus\\:ring-teal-300:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(126 220 226 / var(--tw-ring-opacity))}.focus\\:ring-teal-500:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(6 148 162 / var(--tw-ring-opacity))}.focus\\:ring-yellow-300:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(250 202 21 / var(--tw-ring-opacity))}.focus\\:ring-yellow-400:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(227 160 8 / var(--tw-ring-opacity))}.focus\\:ring-yellow-500:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(194 120 3 / var(--tw-ring-opacity))}.active\\:bg-blue-600:active{--tw-bg-opacity: 1;background-color:rgb(28 100 242 / var(--tw-bg-opacity))}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:opacity-50:disabled{opacity:.5}.group:first-child .group-first\\:rounded-l-lg{border-top-left-radius:.5rem;border-bottom-left-radius:.5rem}.group:first-child .group-first\\:rounded-t-xl{border-top-left-radius:.75rem;border-top-right-radius:.75rem}.group:first-child .group-first\\:border-t{border-top-width:1px}.group:last-child .group-last\\:rounded-r-lg{border-top-right-radius:.5rem;border-bottom-right-radius:.5rem}.group:hover .group-hover\\:rotate-45{--tw-rotate: 45deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.group:hover .group-hover\\:bg-white\\/50{background-color:#ffffff80}.group:hover .group-hover\\:\\!bg-opacity-0{--tw-bg-opacity: 0 !important}.group:hover .group-hover\\:\\!text-inherit{color:inherit!important}.group:focus .group-focus\\:outline-none{outline:2px solid transparent;outline-offset:2px}.group:focus .group-focus\\:ring-4{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.group:focus .group-focus\\:ring-white{--tw-ring-opacity: 1;--tw-ring-color: rgb(255 255 255 / var(--tw-ring-opacity))}.peer:checked~.peer-checked\\:bg-blue-600{--tw-bg-opacity: 1;background-color:rgb(28 100 242 / var(--tw-bg-opacity))}.peer:checked~.peer-checked\\:bg-green-600{--tw-bg-opacity: 1;background-color:rgb(5 122 85 / var(--tw-bg-opacity))}.peer:checked~.peer-checked\\:bg-orange-500{--tw-bg-opacity: 1;background-color:rgb(255 90 31 / var(--tw-bg-opacity))}.peer:checked~.peer-checked\\:bg-purple-600{--tw-bg-opacity: 1;background-color:rgb(126 58 242 / var(--tw-bg-opacity))}.peer:checked~.peer-checked\\:bg-red-600{--tw-bg-opacity: 1;background-color:rgb(224 36 36 / var(--tw-bg-opacity))}.peer:checked~.peer-checked\\:bg-teal-600{--tw-bg-opacity: 1;background-color:rgb(4 116 129 / var(--tw-bg-opacity))}.peer:checked~.peer-checked\\:bg-yellow-400{--tw-bg-opacity: 1;background-color:rgb(227 160 8 / var(--tw-bg-opacity))}.peer:checked~.peer-checked\\:after\\:translate-x-full:after{content:var(--tw-content);--tw-translate-x: 100%;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.peer:checked~.peer-checked\\:after\\:border-white:after{content:var(--tw-content);--tw-border-opacity: 1;border-color:rgb(255 255 255 / var(--tw-border-opacity))}.peer:-moz-placeholder-shown~.peer-placeholder-shown\\:top-1\\/2{top:50%}.peer:placeholder-shown~.peer-placeholder-shown\\:top-1\\/2{top:50%}.peer:-moz-placeholder-shown~.peer-placeholder-shown\\:-translate-y-1\\/2{--tw-translate-y: -50%;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.peer:placeholder-shown~.peer-placeholder-shown\\:-translate-y-1\\/2{--tw-translate-y: -50%;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.peer:-moz-placeholder-shown~.peer-placeholder-shown\\:translate-y-0{--tw-translate-y: 0px;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.peer:placeholder-shown~.peer-placeholder-shown\\:translate-y-0{--tw-translate-y: 0px;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.peer:-moz-placeholder-shown~.peer-placeholder-shown\\:scale-100{--tw-scale-x: 1;--tw-scale-y: 1;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.peer:placeholder-shown~.peer-placeholder-shown\\:scale-100{--tw-scale-x: 1;--tw-scale-y: 1;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.peer:focus~.peer-focus\\:left-0{left:0}.peer:focus~.peer-focus\\:top-2{top:.5rem}.peer:focus~.peer-focus\\:-translate-y-4{--tw-translate-y: -1rem;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.peer:focus~.peer-focus\\:-translate-y-6{--tw-translate-y: -1.5rem;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.peer:focus~.peer-focus\\:scale-75{--tw-scale-x: .75;--tw-scale-y: .75;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.peer:focus~.peer-focus\\:px-2{padding-left:.5rem;padding-right:.5rem}.peer:focus~.peer-focus\\:ring-4{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.peer:focus~.peer-focus\\:ring-blue-300{--tw-ring-opacity: 1;--tw-ring-color: rgb(164 202 254 / var(--tw-ring-opacity))}.peer:focus~.peer-focus\\:ring-green-300{--tw-ring-opacity: 1;--tw-ring-color: rgb(132 225 188 / var(--tw-ring-opacity))}.peer:focus~.peer-focus\\:ring-orange-300{--tw-ring-opacity: 1;--tw-ring-color: rgb(253 186 140 / var(--tw-ring-opacity))}.peer:focus~.peer-focus\\:ring-purple-300{--tw-ring-opacity: 1;--tw-ring-color: rgb(202 191 253 / var(--tw-ring-opacity))}.peer:focus~.peer-focus\\:ring-red-300{--tw-ring-opacity: 1;--tw-ring-color: rgb(248 180 180 / var(--tw-ring-opacity))}.peer:focus~.peer-focus\\:ring-teal-300{--tw-ring-opacity: 1;--tw-ring-color: rgb(126 220 226 / var(--tw-ring-opacity))}.peer:focus~.peer-focus\\:ring-yellow-300{--tw-ring-opacity: 1;--tw-ring-color: rgb(250 202 21 / var(--tw-ring-opacity))}:is(.dark .dark\\:block){display:block}:is(.dark .dark\\:hidden){display:none}:is(.dark .dark\\:divide-blue-700)>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(26 86 219 / var(--tw-divide-opacity))}:is(.dark .dark\\:divide-blue-800)>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(30 66 159 / var(--tw-divide-opacity))}:is(.dark .dark\\:divide-gray-600)>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(75 85 99 / var(--tw-divide-opacity))}:is(.dark .dark\\:divide-gray-700)>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(55 65 81 / var(--tw-divide-opacity))}:is(.dark .dark\\:divide-gray-800)>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(31 41 55 / var(--tw-divide-opacity))}:is(.dark .dark\\:divide-green-700)>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(4 108 78 / var(--tw-divide-opacity))}:is(.dark .dark\\:divide-green-800)>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(3 84 63 / var(--tw-divide-opacity))}:is(.dark .dark\\:divide-indigo-700)>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(81 69 205 / var(--tw-divide-opacity))}:is(.dark .dark\\:divide-indigo-800)>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(66 56 157 / var(--tw-divide-opacity))}:is(.dark .dark\\:divide-orange-800)>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(138 44 13 / var(--tw-divide-opacity))}:is(.dark .dark\\:divide-pink-700)>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(191 18 93 / var(--tw-divide-opacity))}:is(.dark .dark\\:divide-pink-800)>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(153 21 75 / var(--tw-divide-opacity))}:is(.dark .dark\\:divide-purple-700)>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(108 43 217 / var(--tw-divide-opacity))}:is(.dark .dark\\:divide-purple-800)>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(85 33 181 / var(--tw-divide-opacity))}:is(.dark .dark\\:divide-red-700)>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(200 30 30 / var(--tw-divide-opacity))}:is(.dark .dark\\:divide-red-800)>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(155 28 28 / var(--tw-divide-opacity))}:is(.dark .dark\\:divide-yellow-700)>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(142 75 16 / var(--tw-divide-opacity))}:is(.dark .dark\\:divide-yellow-800)>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(114 59 19 / var(--tw-divide-opacity))}:is(.dark .dark\\:\\!border-gray-600){--tw-border-opacity: 1 !important;border-color:rgb(75 85 99 / var(--tw-border-opacity))!important}:is(.dark .dark\\:border-blue-400){--tw-border-opacity: 1;border-color:rgb(118 169 250 / var(--tw-border-opacity))}:is(.dark .dark\\:border-blue-500){--tw-border-opacity: 1;border-color:rgb(63 131 248 / var(--tw-border-opacity))}:is(.dark .dark\\:border-blue-800){--tw-border-opacity: 1;border-color:rgb(30 66 159 / var(--tw-border-opacity))}:is(.dark .dark\\:border-gray-500){--tw-border-opacity: 1;border-color:rgb(107 114 128 / var(--tw-border-opacity))}:is(.dark .dark\\:border-gray-600){--tw-border-opacity: 1;border-color:rgb(75 85 99 / var(--tw-border-opacity))}:is(.dark .dark\\:border-gray-700){--tw-border-opacity: 1;border-color:rgb(55 65 81 / var(--tw-border-opacity))}:is(.dark .dark\\:border-gray-800){--tw-border-opacity: 1;border-color:rgb(31 41 55 / var(--tw-border-opacity))}:is(.dark .dark\\:border-gray-900){--tw-border-opacity: 1;border-color:rgb(17 24 39 / var(--tw-border-opacity))}:is(.dark .dark\\:border-green-400){--tw-border-opacity: 1;border-color:rgb(49 196 141 / var(--tw-border-opacity))}:is(.dark .dark\\:border-green-500){--tw-border-opacity: 1;border-color:rgb(14 159 110 / var(--tw-border-opacity))}:is(.dark .dark\\:border-green-800){--tw-border-opacity: 1;border-color:rgb(3 84 63 / var(--tw-border-opacity))}:is(.dark .dark\\:border-indigo-400){--tw-border-opacity: 1;border-color:rgb(141 162 251 / var(--tw-border-opacity))}:is(.dark .dark\\:border-indigo-800){--tw-border-opacity: 1;border-color:rgb(66 56 157 / var(--tw-border-opacity))}:is(.dark .dark\\:border-orange-800){--tw-border-opacity: 1;border-color:rgb(138 44 13 / var(--tw-border-opacity))}:is(.dark .dark\\:border-pink-400){--tw-border-opacity: 1;border-color:rgb(241 126 184 / var(--tw-border-opacity))}:is(.dark .dark\\:border-pink-800){--tw-border-opacity: 1;border-color:rgb(153 21 75 / var(--tw-border-opacity))}:is(.dark .dark\\:border-purple-400){--tw-border-opacity: 1;border-color:rgb(172 148 250 / var(--tw-border-opacity))}:is(.dark .dark\\:border-purple-800){--tw-border-opacity: 1;border-color:rgb(85 33 181 / var(--tw-border-opacity))}:is(.dark .dark\\:border-red-400){--tw-border-opacity: 1;border-color:rgb(249 128 128 / var(--tw-border-opacity))}:is(.dark .dark\\:border-red-500){--tw-border-opacity: 1;border-color:rgb(240 82 82 / var(--tw-border-opacity))}:is(.dark .dark\\:border-red-800){--tw-border-opacity: 1;border-color:rgb(155 28 28 / var(--tw-border-opacity))}:is(.dark .dark\\:border-white){--tw-border-opacity: 1;border-color:rgb(255 255 255 / var(--tw-border-opacity))}:is(.dark .dark\\:border-yellow-300){--tw-border-opacity: 1;border-color:rgb(250 202 21 / var(--tw-border-opacity))}:is(.dark .dark\\:border-yellow-800){--tw-border-opacity: 1;border-color:rgb(114 59 19 / var(--tw-border-opacity))}:is(.dark .dark\\:border-r-gray-600){--tw-border-opacity: 1;border-right-color:rgb(75 85 99 / var(--tw-border-opacity))}:is(.dark .dark\\:border-r-gray-700){--tw-border-opacity: 1;border-right-color:rgb(55 65 81 / var(--tw-border-opacity))}:is(.dark .dark\\:bg-blue-400){--tw-bg-opacity: 1;background-color:rgb(118 169 250 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-blue-500){--tw-bg-opacity: 1;background-color:rgb(63 131 248 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-blue-600){--tw-bg-opacity: 1;background-color:rgb(28 100 242 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-blue-800){--tw-bg-opacity: 1;background-color:rgb(30 66 159 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-blue-900){--tw-bg-opacity: 1;background-color:rgb(35 56 118 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-gray-200){--tw-bg-opacity: 1;background-color:rgb(229 231 235 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-gray-300){--tw-bg-opacity: 1;background-color:rgb(209 213 219 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-gray-500){--tw-bg-opacity: 1;background-color:rgb(107 114 128 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-gray-600){--tw-bg-opacity: 1;background-color:rgb(75 85 99 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-gray-700){--tw-bg-opacity: 1;background-color:rgb(55 65 81 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-gray-800){--tw-bg-opacity: 1;background-color:rgb(31 41 55 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-gray-800\\/30){background-color:#1f29374d}:is(.dark .dark\\:bg-gray-900){--tw-bg-opacity: 1;background-color:rgb(17 24 39 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-green-400){--tw-bg-opacity: 1;background-color:rgb(49 196 141 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-green-500){--tw-bg-opacity: 1;background-color:rgb(14 159 110 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-green-600){--tw-bg-opacity: 1;background-color:rgb(5 122 85 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-green-800){--tw-bg-opacity: 1;background-color:rgb(3 84 63 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-green-900){--tw-bg-opacity: 1;background-color:rgb(1 71 55 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-indigo-400){--tw-bg-opacity: 1;background-color:rgb(141 162 251 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-indigo-500){--tw-bg-opacity: 1;background-color:rgb(104 117 245 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-indigo-800){--tw-bg-opacity: 1;background-color:rgb(66 56 157 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-indigo-900){--tw-bg-opacity: 1;background-color:rgb(54 47 120 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-inherit){background-color:inherit}:is(.dark .dark\\:bg-orange-700){--tw-bg-opacity: 1;background-color:rgb(180 52 3 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-orange-800){--tw-bg-opacity: 1;background-color:rgb(138 44 13 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-pink-400){--tw-bg-opacity: 1;background-color:rgb(241 126 184 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-pink-900){--tw-bg-opacity: 1;background-color:rgb(117 26 61 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-purple-400){--tw-bg-opacity: 1;background-color:rgb(172 148 250 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-purple-500){--tw-bg-opacity: 1;background-color:rgb(144 97 249 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-purple-600){--tw-bg-opacity: 1;background-color:rgb(126 58 242 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-purple-800){--tw-bg-opacity: 1;background-color:rgb(85 33 181 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-purple-900){--tw-bg-opacity: 1;background-color:rgb(74 29 150 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-red-500){--tw-bg-opacity: 1;background-color:rgb(240 82 82 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-red-600){--tw-bg-opacity: 1;background-color:rgb(224 36 36 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-red-800){--tw-bg-opacity: 1;background-color:rgb(155 28 28 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-red-900){--tw-bg-opacity: 1;background-color:rgb(119 29 29 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-transparent){background-color:transparent}:is(.dark .dark\\:bg-yellow-400){--tw-bg-opacity: 1;background-color:rgb(227 160 8 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-yellow-600){--tw-bg-opacity: 1;background-color:rgb(159 88 10 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-yellow-800){--tw-bg-opacity: 1;background-color:rgb(114 59 19 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-yellow-900){--tw-bg-opacity: 1;background-color:rgb(99 49 18 / var(--tw-bg-opacity))}:is(.dark .dark\\:bg-opacity-80){--tw-bg-opacity: .8}:is(.dark .dark\\:fill-gray-300){fill:#d1d5db}:is(.dark .dark\\:\\!text-white){--tw-text-opacity: 1 !important;color:rgb(255 255 255 / var(--tw-text-opacity))!important}:is(.dark .dark\\:text-blue-100){--tw-text-opacity: 1;color:rgb(225 239 254 / var(--tw-text-opacity))}:is(.dark .dark\\:text-blue-200){--tw-text-opacity: 1;color:rgb(195 221 253 / var(--tw-text-opacity))}:is(.dark .dark\\:text-blue-300){--tw-text-opacity: 1;color:rgb(164 202 254 / var(--tw-text-opacity))}:is(.dark .dark\\:text-blue-400){--tw-text-opacity: 1;color:rgb(118 169 250 / var(--tw-text-opacity))}:is(.dark .dark\\:text-blue-500){--tw-text-opacity: 1;color:rgb(63 131 248 / var(--tw-text-opacity))}:is(.dark .dark\\:text-gray-100){--tw-text-opacity: 1;color:rgb(243 244 246 / var(--tw-text-opacity))}:is(.dark .dark\\:text-gray-200){--tw-text-opacity: 1;color:rgb(229 231 235 / var(--tw-text-opacity))}:is(.dark .dark\\:text-gray-300){--tw-text-opacity: 1;color:rgb(209 213 219 / var(--tw-text-opacity))}:is(.dark .dark\\:text-gray-400){--tw-text-opacity: 1;color:rgb(156 163 175 / var(--tw-text-opacity))}:is(.dark .dark\\:text-gray-500){--tw-text-opacity: 1;color:rgb(107 114 128 / var(--tw-text-opacity))}:is(.dark .dark\\:text-gray-600){--tw-text-opacity: 1;color:rgb(75 85 99 / var(--tw-text-opacity))}:is(.dark .dark\\:text-gray-700){--tw-text-opacity: 1;color:rgb(55 65 81 / var(--tw-text-opacity))}:is(.dark .dark\\:text-gray-900){--tw-text-opacity: 1;color:rgb(17 24 39 / var(--tw-text-opacity))}:is(.dark .dark\\:text-green-100){--tw-text-opacity: 1;color:rgb(222 247 236 / var(--tw-text-opacity))}:is(.dark .dark\\:text-green-200){--tw-text-opacity: 1;color:rgb(188 240 218 / var(--tw-text-opacity))}:is(.dark .dark\\:text-green-300){--tw-text-opacity: 1;color:rgb(132 225 188 / var(--tw-text-opacity))}:is(.dark .dark\\:text-green-400){--tw-text-opacity: 1;color:rgb(49 196 141 / var(--tw-text-opacity))}:is(.dark .dark\\:text-green-500){--tw-text-opacity: 1;color:rgb(14 159 110 / var(--tw-text-opacity))}:is(.dark .dark\\:text-indigo-100){--tw-text-opacity: 1;color:rgb(229 237 255 / var(--tw-text-opacity))}:is(.dark .dark\\:text-indigo-200){--tw-text-opacity: 1;color:rgb(205 219 254 / var(--tw-text-opacity))}:is(.dark .dark\\:text-indigo-300){--tw-text-opacity: 1;color:rgb(180 198 252 / var(--tw-text-opacity))}:is(.dark .dark\\:text-indigo-400){--tw-text-opacity: 1;color:rgb(141 162 251 / var(--tw-text-opacity))}:is(.dark .dark\\:text-orange-200){--tw-text-opacity: 1;color:rgb(252 217 189 / var(--tw-text-opacity))}:is(.dark .dark\\:text-orange-400){--tw-text-opacity: 1;color:rgb(255 138 76 / var(--tw-text-opacity))}:is(.dark .dark\\:text-pink-100){--tw-text-opacity: 1;color:rgb(252 232 243 / var(--tw-text-opacity))}:is(.dark .dark\\:text-pink-300){--tw-text-opacity: 1;color:rgb(248 180 217 / var(--tw-text-opacity))}:is(.dark .dark\\:text-pink-400){--tw-text-opacity: 1;color:rgb(241 126 184 / var(--tw-text-opacity))}:is(.dark .dark\\:text-purple-100){--tw-text-opacity: 1;color:rgb(237 235 254 / var(--tw-text-opacity))}:is(.dark .dark\\:text-purple-200){--tw-text-opacity: 1;color:rgb(220 215 254 / var(--tw-text-opacity))}:is(.dark .dark\\:text-purple-300){--tw-text-opacity: 1;color:rgb(202 191 253 / var(--tw-text-opacity))}:is(.dark .dark\\:text-purple-400){--tw-text-opacity: 1;color:rgb(172 148 250 / var(--tw-text-opacity))}:is(.dark .dark\\:text-red-100){--tw-text-opacity: 1;color:rgb(253 232 232 / var(--tw-text-opacity))}:is(.dark .dark\\:text-red-200){--tw-text-opacity: 1;color:rgb(251 213 213 / var(--tw-text-opacity))}:is(.dark .dark\\:text-red-300){--tw-text-opacity: 1;color:rgb(248 180 180 / var(--tw-text-opacity))}:is(.dark .dark\\:text-red-400){--tw-text-opacity: 1;color:rgb(249 128 128 / var(--tw-text-opacity))}:is(.dark .dark\\:text-red-500){--tw-text-opacity: 1;color:rgb(240 82 82 / var(--tw-text-opacity))}:is(.dark .dark\\:text-white){--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}:is(.dark .dark\\:text-yellow-100){--tw-text-opacity: 1;color:rgb(253 246 178 / var(--tw-text-opacity))}:is(.dark .dark\\:text-yellow-200){--tw-text-opacity: 1;color:rgb(252 233 106 / var(--tw-text-opacity))}:is(.dark .dark\\:text-yellow-300){--tw-text-opacity: 1;color:rgb(250 202 21 / var(--tw-text-opacity))}:is(.dark .dark\\:decoration-blue-600){text-decoration-color:#1c64f2}:is(.dark .dark\\:placeholder-gray-400)::-moz-placeholder{--tw-placeholder-opacity: 1;color:rgb(156 163 175 / var(--tw-placeholder-opacity))}:is(.dark .dark\\:placeholder-gray-400)::placeholder{--tw-placeholder-opacity: 1;color:rgb(156 163 175 / var(--tw-placeholder-opacity))}:is(.dark .dark\\:placeholder-green-500)::-moz-placeholder{--tw-placeholder-opacity: 1;color:rgb(14 159 110 / var(--tw-placeholder-opacity))}:is(.dark .dark\\:placeholder-green-500)::placeholder{--tw-placeholder-opacity: 1;color:rgb(14 159 110 / var(--tw-placeholder-opacity))}:is(.dark .dark\\:placeholder-red-500)::-moz-placeholder{--tw-placeholder-opacity: 1;color:rgb(240 82 82 / var(--tw-placeholder-opacity))}:is(.dark .dark\\:placeholder-red-500)::placeholder{--tw-placeholder-opacity: 1;color:rgb(240 82 82 / var(--tw-placeholder-opacity))}:is(.dark .dark\\:opacity-25){opacity:.25}:is(.dark .dark\\:shadow-blue-800\\/80){--tw-shadow-color: rgb(30 66 159 / .8);--tw-shadow: var(--tw-shadow-colored)}:is(.dark .dark\\:shadow-cyan-800\\/80){--tw-shadow-color: rgb(21 94 117 / .8);--tw-shadow: var(--tw-shadow-colored)}:is(.dark .dark\\:shadow-gray-800\\/80){--tw-shadow-color: rgb(31 41 55 / .8);--tw-shadow: var(--tw-shadow-colored)}:is(.dark .dark\\:shadow-green-800\\/80){--tw-shadow-color: rgb(3 84 63 / .8);--tw-shadow: var(--tw-shadow-colored)}:is(.dark .dark\\:shadow-lime-800\\/80){--tw-shadow-color: rgb(63 98 18 / .8);--tw-shadow: var(--tw-shadow-colored)}:is(.dark .dark\\:shadow-pink-800\\/80){--tw-shadow-color: rgb(153 21 75 / .8);--tw-shadow: var(--tw-shadow-colored)}:is(.dark .dark\\:shadow-purple-800\\/80){--tw-shadow-color: rgb(85 33 181 / .8);--tw-shadow: var(--tw-shadow-colored)}:is(.dark .dark\\:shadow-red-800\\/80){--tw-shadow-color: rgb(155 28 28 / .8);--tw-shadow: var(--tw-shadow-colored)}:is(.dark .dark\\:shadow-teal-800\\/80){--tw-shadow-color: rgb(5 80 92 / .8);--tw-shadow: var(--tw-shadow-colored)}:is(.dark .dark\\:shadow-yellow-800\\/80){--tw-shadow-color: rgb(114 59 19 / .8);--tw-shadow: var(--tw-shadow-colored)}:is(.dark .dark\\:ring-gray-500){--tw-ring-opacity: 1;--tw-ring-color: rgb(107 114 128 / var(--tw-ring-opacity))}:is(.dark .dark\\:ring-gray-900){--tw-ring-opacity: 1;--tw-ring-color: rgb(17 24 39 / var(--tw-ring-opacity))}:is(.dark .dark\\:ring-offset-gray-800){--tw-ring-offset-color: #1F2937}:is(.dark .dark\\:first-letter\\:text-gray-100):first-letter{--tw-text-opacity: 1;color:rgb(243 244 246 / var(--tw-text-opacity))}:is(.dark .dark\\:last\\:border-r-gray-500:last-child){--tw-border-opacity: 1;border-right-color:rgb(107 114 128 / var(--tw-border-opacity))}:is(.dark .dark\\:last\\:border-r-gray-600:last-child){--tw-border-opacity: 1;border-right-color:rgb(75 85 99 / var(--tw-border-opacity))}:is(.dark .odd\\:dark\\:bg-blue-800):nth-child(odd){--tw-bg-opacity: 1;background-color:rgb(30 66 159 / var(--tw-bg-opacity))}:is(.dark .odd\\:dark\\:bg-gray-800):nth-child(odd){--tw-bg-opacity: 1;background-color:rgb(31 41 55 / var(--tw-bg-opacity))}:is(.dark .odd\\:dark\\:bg-green-800):nth-child(odd){--tw-bg-opacity: 1;background-color:rgb(3 84 63 / var(--tw-bg-opacity))}:is(.dark .odd\\:dark\\:bg-purple-800):nth-child(odd){--tw-bg-opacity: 1;background-color:rgb(85 33 181 / var(--tw-bg-opacity))}:is(.dark .odd\\:dark\\:bg-red-800):nth-child(odd){--tw-bg-opacity: 1;background-color:rgb(155 28 28 / var(--tw-bg-opacity))}:is(.dark .odd\\:dark\\:bg-yellow-800):nth-child(odd){--tw-bg-opacity: 1;background-color:rgb(114 59 19 / var(--tw-bg-opacity))}:is(.dark .even\\:dark\\:bg-blue-700):nth-child(2n){--tw-bg-opacity: 1;background-color:rgb(26 86 219 / var(--tw-bg-opacity))}:is(.dark .even\\:dark\\:bg-gray-700):nth-child(2n){--tw-bg-opacity: 1;background-color:rgb(55 65 81 / var(--tw-bg-opacity))}:is(.dark .even\\:dark\\:bg-green-700):nth-child(2n){--tw-bg-opacity: 1;background-color:rgb(4 108 78 / var(--tw-bg-opacity))}:is(.dark .even\\:dark\\:bg-purple-700):nth-child(2n){--tw-bg-opacity: 1;background-color:rgb(108 43 217 / var(--tw-bg-opacity))}:is(.dark .even\\:dark\\:bg-red-700):nth-child(2n){--tw-bg-opacity: 1;background-color:rgb(200 30 30 / var(--tw-bg-opacity))}:is(.dark .even\\:dark\\:bg-yellow-700):nth-child(2n){--tw-bg-opacity: 1;background-color:rgb(142 75 16 / var(--tw-bg-opacity))}:is(.dark .dark\\:hover\\:border-gray-500:hover){--tw-border-opacity: 1;border-color:rgb(107 114 128 / var(--tw-border-opacity))}:is(.dark .dark\\:hover\\:border-gray-600:hover){--tw-border-opacity: 1;border-color:rgb(75 85 99 / var(--tw-border-opacity))}:is(.dark .dark\\:hover\\:border-gray-700:hover){--tw-border-opacity: 1;border-color:rgb(55 65 81 / var(--tw-border-opacity))}:is(.dark .dark\\:hover\\:bg-blue-600:hover){--tw-bg-opacity: 1;background-color:rgb(28 100 242 / var(--tw-bg-opacity))}:is(.dark .dark\\:hover\\:bg-blue-700:hover){--tw-bg-opacity: 1;background-color:rgb(26 86 219 / var(--tw-bg-opacity))}:is(.dark .dark\\:hover\\:bg-blue-800:hover){--tw-bg-opacity: 1;background-color:rgb(30 66 159 / var(--tw-bg-opacity))}:is(.dark .dark\\:hover\\:bg-gray-600:hover){--tw-bg-opacity: 1;background-color:rgb(75 85 99 / var(--tw-bg-opacity))}:is(.dark .dark\\:hover\\:bg-gray-700:hover){--tw-bg-opacity: 1;background-color:rgb(55 65 81 / var(--tw-bg-opacity))}:is(.dark .dark\\:hover\\:bg-gray-800:hover){--tw-bg-opacity: 1;background-color:rgb(31 41 55 / var(--tw-bg-opacity))}:is(.dark .dark\\:hover\\:bg-green-600:hover){--tw-bg-opacity: 1;background-color:rgb(5 122 85 / var(--tw-bg-opacity))}:is(.dark .dark\\:hover\\:bg-green-700:hover){--tw-bg-opacity: 1;background-color:rgb(4 108 78 / var(--tw-bg-opacity))}:is(.dark .dark\\:hover\\:bg-green-800:hover){--tw-bg-opacity: 1;background-color:rgb(3 84 63 / var(--tw-bg-opacity))}:is(.dark .dark\\:hover\\:bg-indigo-800:hover){--tw-bg-opacity: 1;background-color:rgb(66 56 157 / var(--tw-bg-opacity))}:is(.dark .dark\\:hover\\:bg-pink-800:hover){--tw-bg-opacity: 1;background-color:rgb(153 21 75 / var(--tw-bg-opacity))}:is(.dark .dark\\:hover\\:bg-purple-500:hover){--tw-bg-opacity: 1;background-color:rgb(144 97 249 / var(--tw-bg-opacity))}:is(.dark .dark\\:hover\\:bg-purple-700:hover){--tw-bg-opacity: 1;background-color:rgb(108 43 217 / var(--tw-bg-opacity))}:is(.dark .dark\\:hover\\:bg-purple-800:hover){--tw-bg-opacity: 1;background-color:rgb(85 33 181 / var(--tw-bg-opacity))}:is(.dark .dark\\:hover\\:bg-red-600:hover){--tw-bg-opacity: 1;background-color:rgb(224 36 36 / var(--tw-bg-opacity))}:is(.dark .dark\\:hover\\:bg-red-700:hover){--tw-bg-opacity: 1;background-color:rgb(200 30 30 / var(--tw-bg-opacity))}:is(.dark .dark\\:hover\\:bg-red-800:hover){--tw-bg-opacity: 1;background-color:rgb(155 28 28 / var(--tw-bg-opacity))}:is(.dark .dark\\:hover\\:bg-yellow-400:hover){--tw-bg-opacity: 1;background-color:rgb(227 160 8 / var(--tw-bg-opacity))}:is(.dark .dark\\:hover\\:bg-yellow-800:hover){--tw-bg-opacity: 1;background-color:rgb(114 59 19 / var(--tw-bg-opacity))}:is(.dark .hover\\:dark\\:bg-gray-800):hover{--tw-bg-opacity: 1;background-color:rgb(31 41 55 / var(--tw-bg-opacity))}:is(.dark .dark\\:hover\\:text-blue-300:hover){--tw-text-opacity: 1;color:rgb(164 202 254 / var(--tw-text-opacity))}:is(.dark .dark\\:hover\\:text-gray-300:hover){--tw-text-opacity: 1;color:rgb(209 213 219 / var(--tw-text-opacity))}:is(.dark .dark\\:hover\\:text-green-300:hover){--tw-text-opacity: 1;color:rgb(132 225 188 / var(--tw-text-opacity))}:is(.dark .dark\\:hover\\:text-indigo-300:hover){--tw-text-opacity: 1;color:rgb(180 198 252 / var(--tw-text-opacity))}:is(.dark .dark\\:hover\\:text-pink-300:hover){--tw-text-opacity: 1;color:rgb(248 180 217 / var(--tw-text-opacity))}:is(.dark .dark\\:hover\\:text-purple-300:hover){--tw-text-opacity: 1;color:rgb(202 191 253 / var(--tw-text-opacity))}:is(.dark .dark\\:hover\\:text-red-300:hover){--tw-text-opacity: 1;color:rgb(248 180 180 / var(--tw-text-opacity))}:is(.dark .dark\\:hover\\:text-white:hover){--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}:is(.dark .dark\\:hover\\:text-yellow-300:hover){--tw-text-opacity: 1;color:rgb(250 202 21 / var(--tw-text-opacity))}:is(.dark .dark\\:focus\\:border-blue-500:focus){--tw-border-opacity: 1;border-color:rgb(63 131 248 / var(--tw-border-opacity))}:is(.dark .dark\\:focus\\:border-green-500:focus){--tw-border-opacity: 1;border-color:rgb(14 159 110 / var(--tw-border-opacity))}:is(.dark .dark\\:focus\\:border-red-500:focus){--tw-border-opacity: 1;border-color:rgb(240 82 82 / var(--tw-border-opacity))}:is(.dark .dark\\:focus\\:text-white:focus){--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}:is(.dark .dark\\:focus\\:ring-blue-500:focus){--tw-ring-opacity: 1;--tw-ring-color: rgb(63 131 248 / var(--tw-ring-opacity))}:is(.dark .dark\\:focus\\:ring-blue-600:focus){--tw-ring-opacity: 1;--tw-ring-color: rgb(28 100 242 / var(--tw-ring-opacity))}:is(.dark .dark\\:focus\\:ring-blue-800:focus){--tw-ring-opacity: 1;--tw-ring-color: rgb(30 66 159 / var(--tw-ring-opacity))}:is(.dark .dark\\:focus\\:ring-cyan-800:focus){--tw-ring-opacity: 1;--tw-ring-color: rgb(21 94 117 / var(--tw-ring-opacity))}:is(.dark .dark\\:focus\\:ring-gray-500:focus){--tw-ring-opacity: 1;--tw-ring-color: rgb(107 114 128 / var(--tw-ring-opacity))}:is(.dark .dark\\:focus\\:ring-gray-700:focus){--tw-ring-opacity: 1;--tw-ring-color: rgb(55 65 81 / var(--tw-ring-opacity))}:is(.dark .dark\\:focus\\:ring-gray-800:focus){--tw-ring-opacity: 1;--tw-ring-color: rgb(31 41 55 / var(--tw-ring-opacity))}:is(.dark .dark\\:focus\\:ring-green-500:focus){--tw-ring-opacity: 1;--tw-ring-color: rgb(14 159 110 / var(--tw-ring-opacity))}:is(.dark .dark\\:focus\\:ring-green-600:focus){--tw-ring-opacity: 1;--tw-ring-color: rgb(5 122 85 / var(--tw-ring-opacity))}:is(.dark .dark\\:focus\\:ring-green-800:focus){--tw-ring-opacity: 1;--tw-ring-color: rgb(3 84 63 / var(--tw-ring-opacity))}:is(.dark .dark\\:focus\\:ring-lime-800:focus){--tw-ring-opacity: 1;--tw-ring-color: rgb(63 98 18 / var(--tw-ring-opacity))}:is(.dark .dark\\:focus\\:ring-orange-600:focus){--tw-ring-opacity: 1;--tw-ring-color: rgb(208 56 1 / var(--tw-ring-opacity))}:is(.dark .dark\\:focus\\:ring-pink-800:focus){--tw-ring-opacity: 1;--tw-ring-color: rgb(153 21 75 / var(--tw-ring-opacity))}:is(.dark .dark\\:focus\\:ring-purple-600:focus){--tw-ring-opacity: 1;--tw-ring-color: rgb(126 58 242 / var(--tw-ring-opacity))}:is(.dark .dark\\:focus\\:ring-purple-800:focus){--tw-ring-opacity: 1;--tw-ring-color: rgb(85 33 181 / var(--tw-ring-opacity))}:is(.dark .dark\\:focus\\:ring-purple-900:focus){--tw-ring-opacity: 1;--tw-ring-color: rgb(74 29 150 / var(--tw-ring-opacity))}:is(.dark .dark\\:focus\\:ring-red-400:focus){--tw-ring-opacity: 1;--tw-ring-color: rgb(249 128 128 / var(--tw-ring-opacity))}:is(.dark .dark\\:focus\\:ring-red-500:focus){--tw-ring-opacity: 1;--tw-ring-color: rgb(240 82 82 / var(--tw-ring-opacity))}:is(.dark .dark\\:focus\\:ring-red-600:focus){--tw-ring-opacity: 1;--tw-ring-color: rgb(224 36 36 / var(--tw-ring-opacity))}:is(.dark .dark\\:focus\\:ring-red-800:focus){--tw-ring-opacity: 1;--tw-ring-color: rgb(155 28 28 / var(--tw-ring-opacity))}:is(.dark .dark\\:focus\\:ring-red-900:focus){--tw-ring-opacity: 1;--tw-ring-color: rgb(119 29 29 / var(--tw-ring-opacity))}:is(.dark .dark\\:focus\\:ring-teal-600:focus){--tw-ring-opacity: 1;--tw-ring-color: rgb(4 116 129 / var(--tw-ring-opacity))}:is(.dark .dark\\:focus\\:ring-teal-700:focus){--tw-ring-opacity: 1;--tw-ring-color: rgb(3 102 114 / var(--tw-ring-opacity))}:is(.dark .dark\\:focus\\:ring-teal-800:focus){--tw-ring-opacity: 1;--tw-ring-color: rgb(5 80 92 / var(--tw-ring-opacity))}:is(.dark .dark\\:focus\\:ring-yellow-600:focus){--tw-ring-opacity: 1;--tw-ring-color: rgb(159 88 10 / var(--tw-ring-opacity))}:is(.dark .dark\\:focus\\:ring-yellow-900:focus){--tw-ring-opacity: 1;--tw-ring-color: rgb(99 49 18 / var(--tw-ring-opacity))}:is(.dark .group:hover .dark\\:group-hover\\:bg-gray-800\\/60){background-color:#1f293799}:is(.dark .group:focus .dark\\:group-focus\\:ring-gray-800\\/70){--tw-ring-color: rgb(31 41 55 / .7)}:is(.dark .peer:focus~.dark\\:peer-focus\\:ring-blue-800){--tw-ring-opacity: 1;--tw-ring-color: rgb(30 66 159 / var(--tw-ring-opacity))}:is(.dark .peer:focus~.dark\\:peer-focus\\:ring-green-800){--tw-ring-opacity: 1;--tw-ring-color: rgb(3 84 63 / var(--tw-ring-opacity))}:is(.dark .peer:focus~.dark\\:peer-focus\\:ring-orange-800){--tw-ring-opacity: 1;--tw-ring-color: rgb(138 44 13 / var(--tw-ring-opacity))}:is(.dark .peer:focus~.dark\\:peer-focus\\:ring-purple-800){--tw-ring-opacity: 1;--tw-ring-color: rgb(85 33 181 / var(--tw-ring-opacity))}:is(.dark .peer:focus~.dark\\:peer-focus\\:ring-red-800){--tw-ring-opacity: 1;--tw-ring-color: rgb(155 28 28 / var(--tw-ring-opacity))}:is(.dark .peer:focus~.dark\\:peer-focus\\:ring-teal-800){--tw-ring-opacity: 1;--tw-ring-color: rgb(5 80 92 / var(--tw-ring-opacity))}:is(.dark .peer:focus~.dark\\:peer-focus\\:ring-yellow-800){--tw-ring-opacity: 1;--tw-ring-color: rgb(114 59 19 / var(--tw-ring-opacity))}@media (min-width: 640px){.sm\\:order-last{order:9999}.sm\\:mb-0{margin-bottom:0}.sm\\:mt-0{margin-top:0}.sm\\:flex{display:flex}.sm\\:grid{display:grid}.sm\\:h-10{height:2.5rem}.sm\\:h-6{height:1.5rem}.sm\\:h-64{height:16rem}.sm\\:h-7{height:1.75rem}.sm\\:h-9{height:2.25rem}.sm\\:w-10{width:2.5rem}.sm\\:w-6{width:1.5rem}.sm\\:w-96{width:24rem}.sm\\:w-auto{width:auto}.sm\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.sm\\:divide-x>:not([hidden])~:not([hidden]){--tw-divide-x-reverse: 0;border-right-width:calc(1px * var(--tw-divide-x-reverse));border-left-width:calc(1px * calc(1 - var(--tw-divide-x-reverse)))}.sm\\:rounded-lg{border-radius:.5rem}.sm\\:p-5{padding:1.25rem}.sm\\:p-6{padding:1.5rem}.sm\\:p-8{padding:2rem}.sm\\:px-16{padding-left:4rem;padding-right:4rem}.sm\\:px-4{padding-left:1rem;padding-right:1rem}.sm\\:pl-4{padding-left:1rem}.sm\\:pr-4{padding-right:1rem}.sm\\:pr-8{padding-right:2rem}.sm\\:text-center{text-align:center}.sm\\:text-base{font-size:1rem;line-height:1.5rem}.sm\\:text-sm{font-size:.875rem;line-height:1.25rem}.sm\\:text-xs{font-size:.75rem;line-height:1rem}.sm\\:ring-8{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(8px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.first\\:sm\\:pl-0:first-child{padding-left:0}.last\\:sm\\:pr-0:last-child{padding-right:0}}@media (min-width: 768px){.md\\:inset-0{top:0;right:0;bottom:0;left:0}.md\\:mb-0{margin-bottom:0}.md\\:ml-2{margin-left:.5rem}.md\\:mr-6{margin-right:1.5rem}.md\\:mt-0{margin-top:0}.md\\:block{display:block}.md\\:flex{display:flex}.md\\:grid{display:grid}.md\\:hidden{display:none}.md\\:h-\\[21px\\]{height:21px}.md\\:h-\\[262px\\]{height:262px}.md\\:h-\\[278px\\]{height:278px}.md\\:h-\\[294px\\]{height:294px}.md\\:h-\\[42px\\]{height:42px}.md\\:h-\\[654px\\]{height:654px}.md\\:h-\\[682px\\]{height:682px}.md\\:h-\\[8px\\]{height:8px}.md\\:h-\\[95px\\]{height:95px}.md\\:h-auto{height:auto}.md\\:h-full{height:100%}.md\\:w-1\\/3{width:33.333333%}.md\\:w-2\\/3{width:66.666667%}.md\\:w-48{width:12rem}.md\\:w-\\[96px\\]{width:96px}.md\\:w-auto{width:auto}.md\\:max-w-\\[142px\\]{max-width:142px}.md\\:max-w-\\[512px\\]{max-width:512px}.md\\:max-w-\\[597px\\]{max-width:597px}.md\\:max-w-xl{max-width:36rem}.md\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.md\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.md\\:flex-row{flex-direction:row}.md\\:flex-row-reverse{flex-direction:row-reverse}.md\\:items-center{align-items:center}.md\\:justify-between{justify-content:space-between}.md\\:gap-8{gap:2rem}.md\\:gap-x-0{-moz-column-gap:0px;column-gap:0px}.md\\:space-x-3>:not([hidden])~:not([hidden]){--tw-space-x-reverse: 0;margin-right:calc(.75rem * var(--tw-space-x-reverse));margin-left:calc(.75rem * calc(1 - var(--tw-space-x-reverse)))}.md\\:space-x-8>:not([hidden])~:not([hidden]){--tw-space-x-reverse: 0;margin-right:calc(2rem * var(--tw-space-x-reverse));margin-left:calc(2rem * calc(1 - var(--tw-space-x-reverse)))}.md\\:space-y-0>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(0px * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(0px * var(--tw-space-y-reverse))}.md\\:divide-y-0>:not([hidden])~:not([hidden]){--tw-divide-y-reverse: 0;border-top-width:calc(0px * calc(1 - var(--tw-divide-y-reverse)));border-bottom-width:calc(0px * var(--tw-divide-y-reverse))}.md\\:rounded-none{border-radius:0}.md\\:rounded-l-lg{border-top-left-radius:.5rem;border-bottom-left-radius:.5rem}.md\\:rounded-r-lg{border-top-right-radius:.5rem;border-bottom-right-radius:.5rem}.md\\:border-0{border-width:0px}.md\\:bg-transparent{background-color:transparent}.md\\:p-0{padding:0}.md\\:p-6{padding:1.5rem}.md\\:p-8{padding:2rem}.md\\:px-6{padding-left:1.5rem;padding-right:1.5rem}.md\\:py-8{padding-top:2rem;padding-bottom:2rem}.md\\:text-5xl{font-size:3rem;line-height:1}.md\\:text-lg{font-size:1.125rem;line-height:1.75rem}.md\\:text-sm{font-size:.875rem;line-height:1.25rem}.md\\:font-medium{font-weight:500}.md\\:hover\\:bg-transparent:hover{background-color:transparent}:is(.dark .md\\:dark\\:bg-transparent){background-color:transparent}:is(.dark .md\\:dark\\:text-white){--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}:is(.dark .md\\:dark\\:hover\\:bg-transparent:hover){background-color:transparent}:is(.dark .md\\:dark\\:hover\\:text-white:hover){--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}}@media (min-width: 1024px){.lg\\:max-w-7xl{max-width:80rem}.lg\\:text-6xl{font-size:3.75rem;line-height:1}.lg\\:text-xl{font-size:1.25rem;line-height:1.75rem}}@media (min-width: 1280px){.xl\\:h-80{height:20rem}.xl\\:px-48{padding-left:12rem;padding-right:12rem}}@media (min-width: 1536px){.\\32xl\\:h-96{height:24rem}}.active.svelte-1o2b5yq{opacity:1} `);

(function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  function noop() {
  }
  const identity = (x) => x;
  function assign(tar, src) {
    for (const k in src)
      tar[k] = src[k];
    return (
      /** @type {T & S} */
      tar
    );
  }
  function run(fn) {
    return fn();
  }
  function blank_object() {
    return /* @__PURE__ */ Object.create(null);
  }
  function run_all(fns) {
    fns.forEach(run);
  }
  function is_function(thing) {
    return typeof thing === "function";
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
  }
  function is_empty(obj) {
    return Object.keys(obj).length === 0;
  }
  function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
      const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
      return definition[0](slot_ctx);
    }
  }
  function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
  }
  function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
      const lets = definition[2](fn(dirty));
      if ($$scope.dirty === void 0) {
        return lets;
      }
      if (typeof lets === "object") {
        const merged = [];
        const len = Math.max($$scope.dirty.length, lets.length);
        for (let i = 0; i < len; i += 1) {
          merged[i] = $$scope.dirty[i] | lets[i];
        }
        return merged;
      }
      return $$scope.dirty | lets;
    }
    return $$scope.dirty;
  }
  function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
    if (slot_changes) {
      const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
      slot.p(slot_context, slot_changes);
    }
  }
  function get_all_dirty_from_scope($$scope) {
    if ($$scope.ctx.length > 32) {
      const dirty = [];
      const length = $$scope.ctx.length / 32;
      for (let i = 0; i < length; i++) {
        dirty[i] = -1;
      }
      return dirty;
    }
    return -1;
  }
  function exclude_internal_props(props) {
    const result = {};
    for (const k in props)
      if (k[0] !== "$")
        result[k] = props[k];
    return result;
  }
  function compute_rest_props(props, keys) {
    const rest = {};
    keys = new Set(keys);
    for (const k in props)
      if (!keys.has(k) && k[0] !== "$")
        rest[k] = props[k];
    return rest;
  }
  function compute_slots(slots) {
    const result = {};
    for (const key in slots) {
      result[key] = true;
    }
    return result;
  }
  function action_destroyer(action_result) {
    return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
  }
  const is_client = typeof window !== "undefined";
  let now = is_client ? () => window.performance.now() : () => Date.now();
  let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
  const tasks = /* @__PURE__ */ new Set();
  function run_tasks(now2) {
    tasks.forEach((task) => {
      if (!task.c(now2)) {
        tasks.delete(task);
        task.f();
      }
    });
    if (tasks.size !== 0)
      raf(run_tasks);
  }
  function loop(callback) {
    let task;
    if (tasks.size === 0)
      raf(run_tasks);
    return {
      promise: new Promise((fulfill) => {
        tasks.add(task = { c: callback, f: fulfill });
      }),
      abort() {
        tasks.delete(task);
      }
    };
  }
  function append(target, node) {
    target.appendChild(node);
  }
  function get_root_for_style(node) {
    if (!node)
      return document;
    const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
    if (root && /** @type {ShadowRoot} */
    root.host) {
      return (
        /** @type {ShadowRoot} */
        root
      );
    }
    return node.ownerDocument;
  }
  function append_empty_stylesheet(node) {
    const style_element = element("style");
    style_element.textContent = "/* empty */";
    append_stylesheet(get_root_for_style(node), style_element);
    return style_element.sheet;
  }
  function append_stylesheet(node, style) {
    append(
      /** @type {Document} */
      node.head || node,
      style
    );
    return style.sheet;
  }
  function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
  }
  function detach(node) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }
  function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
      if (iterations[i])
        iterations[i].d(detaching);
    }
  }
  function element(name) {
    return document.createElement(name);
  }
  function svg_element(name) {
    return document.createElementNS("http://www.w3.org/2000/svg", name);
  }
  function text(data) {
    return document.createTextNode(data);
  }
  function space() {
    return text(" ");
  }
  function empty() {
    return text("");
  }
  function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
  }
  function prevent_default(fn) {
    return function(event) {
      event.preventDefault();
      return fn.call(this, event);
    };
  }
  function stop_propagation(fn) {
    return function(event) {
      event.stopPropagation();
      return fn.call(this, event);
    };
  }
  function attr(node, attribute, value) {
    if (value == null)
      node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
      node.setAttribute(attribute, value);
  }
  const always_set_through_set_attribute = ["width", "height"];
  function set_attributes(node, attributes) {
    const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
    for (const key in attributes) {
      if (attributes[key] == null) {
        node.removeAttribute(key);
      } else if (key === "style") {
        node.style.cssText = attributes[key];
      } else if (key === "__value") {
        node.value = node[key] = attributes[key];
      } else if (descriptors[key] && descriptors[key].set && always_set_through_set_attribute.indexOf(key) === -1) {
        node[key] = attributes[key];
      } else {
        attr(node, key, attributes[key]);
      }
    }
  }
  function set_custom_element_data_map(node, data_map) {
    Object.keys(data_map).forEach((key) => {
      set_custom_element_data(node, key, data_map[key]);
    });
  }
  function set_custom_element_data(node, prop, value) {
    if (prop in node) {
      node[prop] = typeof node[prop] === "boolean" && value === "" ? true : value;
    } else {
      attr(node, prop, value);
    }
  }
  function set_dynamic_element_data(tag) {
    return /-/.test(tag) ? set_custom_element_data_map : set_attributes;
  }
  function init_binding_group(group) {
    let _inputs;
    return {
      /* push */
      p(...inputs) {
        _inputs = inputs;
        _inputs.forEach((input) => group.push(input));
      },
      /* remove */
      r() {
        _inputs.forEach((input) => group.splice(group.indexOf(input), 1));
      }
    };
  }
  function children(element2) {
    return Array.from(element2.childNodes);
  }
  function set_data(text2, data) {
    data = "" + data;
    if (text2.data === data)
      return;
    text2.data = /** @type {string} */
    data;
  }
  function set_input_value(input, value) {
    input.value = value == null ? "" : value;
  }
  function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
    return new CustomEvent(type, { detail, bubbles, cancelable });
  }
  const managed_styles = /* @__PURE__ */ new Map();
  let active = 0;
  function hash(str) {
    let hash2 = 5381;
    let i = str.length;
    while (i--)
      hash2 = (hash2 << 5) - hash2 ^ str.charCodeAt(i);
    return hash2 >>> 0;
  }
  function create_style_information(doc, node) {
    const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
    managed_styles.set(doc, info);
    return info;
  }
  function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
    const step = 16.666 / duration;
    let keyframes = "{\n";
    for (let p = 0; p <= 1; p += step) {
      const t = a + (b - a) * ease(p);
      keyframes += p * 100 + `%{${fn(t, 1 - t)}}
`;
    }
    const rule = keyframes + `100% {${fn(b, 1 - b)}}
}`;
    const name = `__svelte_${hash(rule)}_${uid}`;
    const doc = get_root_for_style(node);
    const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
    if (!rules[name]) {
      rules[name] = true;
      stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
    }
    const animation = node.style.animation || "";
    node.style.animation = `${animation ? `${animation}, ` : ""}${name} ${duration}ms linear ${delay}ms 1 both`;
    active += 1;
    return name;
  }
  function delete_rule(node, name) {
    const previous = (node.style.animation || "").split(", ");
    const next = previous.filter(
      name ? (anim) => anim.indexOf(name) < 0 : (anim) => anim.indexOf("__svelte") === -1
      // remove all Svelte animations
    );
    const deleted = previous.length - next.length;
    if (deleted) {
      node.style.animation = next.join(", ");
      active -= deleted;
      if (!active)
        clear_rules();
    }
  }
  function clear_rules() {
    raf(() => {
      if (active)
        return;
      managed_styles.forEach((info) => {
        const { ownerNode } = info.stylesheet;
        if (ownerNode)
          detach(ownerNode);
      });
      managed_styles.clear();
    });
  }
  let current_component;
  function set_current_component(component) {
    current_component = component;
  }
  function get_current_component() {
    if (!current_component)
      throw new Error("Function called outside component initialization");
    return current_component;
  }
  function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
  }
  function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail, { cancelable = false } = {}) => {
      const callbacks = component.$$.callbacks[type];
      if (callbacks) {
        const event = custom_event(
          /** @type {string} */
          type,
          detail,
          { cancelable }
        );
        callbacks.slice().forEach((fn) => {
          fn.call(component, event);
        });
        return !event.defaultPrevented;
      }
      return true;
    };
  }
  function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
    return context;
  }
  function getContext(key) {
    return get_current_component().$$.context.get(key);
  }
  function bubble(component, event) {
    const callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
      callbacks.slice().forEach((fn) => fn.call(this, event));
    }
  }
  const dirty_components = [];
  const binding_callbacks = [];
  let render_callbacks = [];
  const flush_callbacks = [];
  const resolved_promise = /* @__PURE__ */ Promise.resolve();
  let update_scheduled = false;
  function schedule_update() {
    if (!update_scheduled) {
      update_scheduled = true;
      resolved_promise.then(flush);
    }
  }
  function add_render_callback(fn) {
    render_callbacks.push(fn);
  }
  function add_flush_callback(fn) {
    flush_callbacks.push(fn);
  }
  const seen_callbacks = /* @__PURE__ */ new Set();
  let flushidx = 0;
  function flush() {
    if (flushidx !== 0) {
      return;
    }
    const saved_component = current_component;
    do {
      try {
        while (flushidx < dirty_components.length) {
          const component = dirty_components[flushidx];
          flushidx++;
          set_current_component(component);
          update(component.$$);
        }
      } catch (e) {
        dirty_components.length = 0;
        flushidx = 0;
        throw e;
      }
      set_current_component(null);
      dirty_components.length = 0;
      flushidx = 0;
      while (binding_callbacks.length)
        binding_callbacks.pop()();
      for (let i = 0; i < render_callbacks.length; i += 1) {
        const callback = render_callbacks[i];
        if (!seen_callbacks.has(callback)) {
          seen_callbacks.add(callback);
          callback();
        }
      }
      render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
      flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
  }
  function update($$) {
    if ($$.fragment !== null) {
      $$.update();
      run_all($$.before_update);
      const dirty = $$.dirty;
      $$.dirty = [-1];
      $$.fragment && $$.fragment.p($$.ctx, dirty);
      $$.after_update.forEach(add_render_callback);
    }
  }
  function flush_render_callbacks(fns) {
    const filtered = [];
    const targets = [];
    render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
    targets.forEach((c) => c());
    render_callbacks = filtered;
  }
  let promise;
  function wait() {
    if (!promise) {
      promise = Promise.resolve();
      promise.then(() => {
        promise = null;
      });
    }
    return promise;
  }
  function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event(`${direction ? "intro" : "outro"}${kind}`));
  }
  const outroing = /* @__PURE__ */ new Set();
  let outros;
  function group_outros() {
    outros = {
      r: 0,
      c: [],
      p: outros
      // parent group
    };
  }
  function check_outros() {
    if (!outros.r) {
      run_all(outros.c);
    }
    outros = outros.p;
  }
  function transition_in(block, local) {
    if (block && block.i) {
      outroing.delete(block);
      block.i(local);
    }
  }
  function transition_out(block, local, detach2, callback) {
    if (block && block.o) {
      if (outroing.has(block))
        return;
      outroing.add(block);
      outros.c.push(() => {
        outroing.delete(block);
        if (callback) {
          if (detach2)
            block.d(1);
          callback();
        }
      });
      block.o(local);
    } else if (callback) {
      callback();
    }
  }
  const null_transition = { duration: 0 };
  function create_bidirectional_transition(node, fn, params, intro) {
    const options = { direction: "both" };
    let config = fn(node, params, options);
    let t = intro ? 0 : 1;
    let running_program = null;
    let pending_program = null;
    let animation_name = null;
    let original_inert_value;
    function clear_animation() {
      if (animation_name)
        delete_rule(node, animation_name);
    }
    function init2(program, duration) {
      const d = (
        /** @type {Program['d']} */
        program.b - t
      );
      duration *= Math.abs(d);
      return {
        a: t,
        b: program.b,
        d,
        duration,
        start: program.start,
        end: program.start + duration,
        group: program.group
      };
    }
    function go(b) {
      const {
        delay = 0,
        duration = 300,
        easing = identity,
        tick = noop,
        css
      } = config || null_transition;
      const program = {
        start: now() + delay,
        b
      };
      if (!b) {
        program.group = outros;
        outros.r += 1;
      }
      if ("inert" in node) {
        if (b) {
          if (original_inert_value !== void 0) {
            node.inert = original_inert_value;
          }
        } else {
          original_inert_value = /** @type {HTMLElement} */
          node.inert;
          node.inert = true;
        }
      }
      if (running_program || pending_program) {
        pending_program = program;
      } else {
        if (css) {
          clear_animation();
          animation_name = create_rule(node, t, b, duration, delay, easing, css);
        }
        if (b)
          tick(0, 1);
        running_program = init2(program, duration);
        add_render_callback(() => dispatch(node, b, "start"));
        loop((now2) => {
          if (pending_program && now2 > pending_program.start) {
            running_program = init2(pending_program, duration);
            pending_program = null;
            dispatch(node, running_program.b, "start");
            if (css) {
              clear_animation();
              animation_name = create_rule(
                node,
                t,
                running_program.b,
                running_program.duration,
                0,
                easing,
                config.css
              );
            }
          }
          if (running_program) {
            if (now2 >= running_program.end) {
              tick(t = running_program.b, 1 - t);
              dispatch(node, running_program.b, "end");
              if (!pending_program) {
                if (running_program.b) {
                  clear_animation();
                } else {
                  if (!--running_program.group.r)
                    run_all(running_program.group.c);
                }
              }
              running_program = null;
            } else if (now2 >= running_program.start) {
              const p = now2 - running_program.start;
              t = running_program.a + running_program.d * easing(p / running_program.duration);
              tick(t, 1 - t);
            }
          }
          return !!(running_program || pending_program);
        });
      }
    }
    return {
      run(b) {
        if (is_function(config)) {
          wait().then(() => {
            const opts = { direction: b ? "in" : "out" };
            config = config(opts);
            go(b);
          });
        } else {
          go(b);
        }
      },
      end() {
        clear_animation();
        running_program = pending_program = null;
      }
    };
  }
  function ensure_array_like(array_like_or_iterator) {
    return (array_like_or_iterator == null ? void 0 : array_like_or_iterator.length) !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
  }
  function get_spread_update(levels, updates) {
    const update2 = {};
    const to_null_out = {};
    const accounted_for = { $$scope: 1 };
    let i = levels.length;
    while (i--) {
      const o = levels[i];
      const n = updates[i];
      if (n) {
        for (const key in o) {
          if (!(key in n))
            to_null_out[key] = 1;
        }
        for (const key in n) {
          if (!accounted_for[key]) {
            update2[key] = n[key];
            accounted_for[key] = 1;
          }
        }
        levels[i] = n;
      } else {
        for (const key in o) {
          accounted_for[key] = 1;
        }
      }
    }
    for (const key in to_null_out) {
      if (!(key in update2))
        update2[key] = void 0;
    }
    return update2;
  }
  function get_spread_object(spread_props) {
    return typeof spread_props === "object" && spread_props !== null ? spread_props : {};
  }
  function bind(component, name, callback) {
    const index = component.$$.props[name];
    if (index !== void 0) {
      component.$$.bound[index] = callback;
      callback(component.$$.ctx[index]);
    }
  }
  function create_component(block) {
    block && block.c();
  }
  function mount_component(component, target, anchor) {
    const { fragment, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    add_render_callback(() => {
      const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
      if (component.$$.on_destroy) {
        component.$$.on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
  }
  function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
      flush_render_callbacks($$.after_update);
      run_all($$.on_destroy);
      $$.fragment && $$.fragment.d(detaching);
      $$.on_destroy = $$.fragment = null;
      $$.ctx = [];
    }
  }
  function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
      dirty_components.push(component);
      schedule_update();
      component.$$.dirty.fill(0);
    }
    component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
  }
  function init(component, options, instance2, create_fragment2, not_equal, props, append_styles, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
      fragment: null,
      ctx: [],
      // state
      props,
      update: noop,
      not_equal,
      bound: blank_object(),
      // lifecycle
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
      // everything else
      callbacks: blank_object(),
      dirty,
      skip_bound: false,
      root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
      const value = rest.length ? rest[0] : ret;
      if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
        if (!$$.skip_bound && $$.bound[i])
          $$.bound[i](value);
        if (ready)
          make_dirty(component, i);
      }
      return ret;
    }) : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
    if (options.target) {
      if (options.hydrate) {
        const nodes = children(options.target);
        $$.fragment && $$.fragment.l(nodes);
        nodes.forEach(detach);
      } else {
        $$.fragment && $$.fragment.c();
      }
      if (options.intro)
        transition_in(component.$$.fragment);
      mount_component(component, options.target, options.anchor);
      flush();
    }
    set_current_component(parent_component);
  }
  class SvelteComponent {
    constructor() {
      /**
       * ### PRIVATE API
       *
       * Do not use, may change at any time
       *
       * @type {any}
       */
      __publicField(this, "$$");
      /**
       * ### PRIVATE API
       *
       * Do not use, may change at any time
       *
       * @type {any}
       */
      __publicField(this, "$$set");
    }
    /** @returns {void} */
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    /**
     * @template {Extract<keyof Events, string>} K
     * @param {K} type
     * @param {((e: Events[K]) => void) | null | undefined} callback
     * @returns {() => void}
     */
    $on(type, callback) {
      if (!is_function(callback)) {
        return noop;
      }
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1)
          callbacks.splice(index, 1);
      };
    }
    /**
     * @param {Partial<Props>} props
     * @returns {void}
     */
    $set(props) {
      if (this.$$set && !is_empty(props)) {
        this.$$.skip_bound = true;
        this.$$set(props);
        this.$$.skip_bound = false;
      }
    }
  }
  const PUBLIC_VERSION = "4";
  if (typeof window !== "undefined")
    (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(PUBLIC_VERSION);
  const subscriber_queue = [];
  function writable(value, start = noop) {
    let stop;
    const subscribers = /* @__PURE__ */ new Set();
    function set(new_value) {
      if (safe_not_equal(value, new_value)) {
        value = new_value;
        if (stop) {
          const run_queue = !subscriber_queue.length;
          for (const subscriber of subscribers) {
            subscriber[1]();
            subscriber_queue.push(subscriber, value);
          }
          if (run_queue) {
            for (let i = 0; i < subscriber_queue.length; i += 2) {
              subscriber_queue[i][0](subscriber_queue[i + 1]);
            }
            subscriber_queue.length = 0;
          }
        }
      }
    }
    function update2(fn) {
      set(fn(value));
    }
    function subscribe(run2, invalidate = noop) {
      const subscriber = [run2, invalidate];
      subscribers.add(subscriber);
      if (subscribers.size === 1) {
        stop = start(set, update2) || noop;
      }
      run2(value);
      return () => {
        subscribers.delete(subscriber);
        if (subscribers.size === 0 && stop) {
          stop();
          stop = null;
        }
      };
    }
    return { set, update: update2, subscribe };
  }
  function twJoin() {
    var index = 0;
    var argument;
    var resolvedValue;
    var string = "";
    while (index < arguments.length) {
      if (argument = arguments[index++]) {
        if (resolvedValue = toValue(argument)) {
          string && (string += " ");
          string += resolvedValue;
        }
      }
    }
    return string;
  }
  function toValue(mix) {
    if (typeof mix === "string") {
      return mix;
    }
    var resolvedValue;
    var string = "";
    for (var k = 0; k < mix.length; k++) {
      if (mix[k]) {
        if (resolvedValue = toValue(mix[k])) {
          string && (string += " ");
          string += resolvedValue;
        }
      }
    }
    return string;
  }
  var CLASS_PART_SEPARATOR = "-";
  function createClassUtils(config) {
    var classMap = createClassMap(config);
    var conflictingClassGroups = config.conflictingClassGroups, _config$conflictingCl = config.conflictingClassGroupModifiers, conflictingClassGroupModifiers = _config$conflictingCl === void 0 ? {} : _config$conflictingCl;
    function getClassGroupId(className) {
      var classParts = className.split(CLASS_PART_SEPARATOR);
      if (classParts[0] === "" && classParts.length !== 1) {
        classParts.shift();
      }
      return getGroupRecursive(classParts, classMap) || getGroupIdForArbitraryProperty(className);
    }
    function getConflictingClassGroupIds(classGroupId, hasPostfixModifier) {
      var conflicts = conflictingClassGroups[classGroupId] || [];
      if (hasPostfixModifier && conflictingClassGroupModifiers[classGroupId]) {
        return [].concat(conflicts, conflictingClassGroupModifiers[classGroupId]);
      }
      return conflicts;
    }
    return {
      getClassGroupId,
      getConflictingClassGroupIds
    };
  }
  function getGroupRecursive(classParts, classPartObject) {
    var _a;
    if (classParts.length === 0) {
      return classPartObject.classGroupId;
    }
    var currentClassPart = classParts[0];
    var nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
    var classGroupFromNextClassPart = nextClassPartObject ? getGroupRecursive(classParts.slice(1), nextClassPartObject) : void 0;
    if (classGroupFromNextClassPart) {
      return classGroupFromNextClassPart;
    }
    if (classPartObject.validators.length === 0) {
      return void 0;
    }
    var classRest = classParts.join(CLASS_PART_SEPARATOR);
    return (_a = classPartObject.validators.find(function(_ref) {
      var validator = _ref.validator;
      return validator(classRest);
    })) == null ? void 0 : _a.classGroupId;
  }
  var arbitraryPropertyRegex = /^\[(.+)\]$/;
  function getGroupIdForArbitraryProperty(className) {
    if (arbitraryPropertyRegex.test(className)) {
      var arbitraryPropertyClassName = arbitraryPropertyRegex.exec(className)[1];
      var property = arbitraryPropertyClassName == null ? void 0 : arbitraryPropertyClassName.substring(0, arbitraryPropertyClassName.indexOf(":"));
      if (property) {
        return "arbitrary.." + property;
      }
    }
  }
  function createClassMap(config) {
    var theme = config.theme, prefix = config.prefix;
    var classMap = {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    };
    var prefixedClassGroupEntries = getPrefixedClassGroupEntries(Object.entries(config.classGroups), prefix);
    prefixedClassGroupEntries.forEach(function(_ref2) {
      var classGroupId = _ref2[0], classGroup = _ref2[1];
      processClassesRecursively(classGroup, classMap, classGroupId, theme);
    });
    return classMap;
  }
  function processClassesRecursively(classGroup, classPartObject, classGroupId, theme) {
    classGroup.forEach(function(classDefinition) {
      if (typeof classDefinition === "string") {
        var classPartObjectToEdit = classDefinition === "" ? classPartObject : getPart(classPartObject, classDefinition);
        classPartObjectToEdit.classGroupId = classGroupId;
        return;
      }
      if (typeof classDefinition === "function") {
        if (isThemeGetter(classDefinition)) {
          processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
          return;
        }
        classPartObject.validators.push({
          validator: classDefinition,
          classGroupId
        });
        return;
      }
      Object.entries(classDefinition).forEach(function(_ref3) {
        var key = _ref3[0], classGroup2 = _ref3[1];
        processClassesRecursively(classGroup2, getPart(classPartObject, key), classGroupId, theme);
      });
    });
  }
  function getPart(classPartObject, path) {
    var currentClassPartObject = classPartObject;
    path.split(CLASS_PART_SEPARATOR).forEach(function(pathPart) {
      if (!currentClassPartObject.nextPart.has(pathPart)) {
        currentClassPartObject.nextPart.set(pathPart, {
          nextPart: /* @__PURE__ */ new Map(),
          validators: []
        });
      }
      currentClassPartObject = currentClassPartObject.nextPart.get(pathPart);
    });
    return currentClassPartObject;
  }
  function isThemeGetter(func) {
    return func.isThemeGetter;
  }
  function getPrefixedClassGroupEntries(classGroupEntries, prefix) {
    if (!prefix) {
      return classGroupEntries;
    }
    return classGroupEntries.map(function(_ref4) {
      var classGroupId = _ref4[0], classGroup = _ref4[1];
      var prefixedClassGroup = classGroup.map(function(classDefinition) {
        if (typeof classDefinition === "string") {
          return prefix + classDefinition;
        }
        if (typeof classDefinition === "object") {
          return Object.fromEntries(Object.entries(classDefinition).map(function(_ref5) {
            var key = _ref5[0], value = _ref5[1];
            return [prefix + key, value];
          }));
        }
        return classDefinition;
      });
      return [classGroupId, prefixedClassGroup];
    });
  }
  function createLruCache(maxCacheSize) {
    if (maxCacheSize < 1) {
      return {
        get: function get() {
          return void 0;
        },
        set: function set() {
        }
      };
    }
    var cacheSize = 0;
    var cache = /* @__PURE__ */ new Map();
    var previousCache = /* @__PURE__ */ new Map();
    function update2(key, value) {
      cache.set(key, value);
      cacheSize++;
      if (cacheSize > maxCacheSize) {
        cacheSize = 0;
        previousCache = cache;
        cache = /* @__PURE__ */ new Map();
      }
    }
    return {
      get: function get(key) {
        var value = cache.get(key);
        if (value !== void 0) {
          return value;
        }
        if ((value = previousCache.get(key)) !== void 0) {
          update2(key, value);
          return value;
        }
      },
      set: function set(key, value) {
        if (cache.has(key)) {
          cache.set(key, value);
        } else {
          update2(key, value);
        }
      }
    };
  }
  var IMPORTANT_MODIFIER = "!";
  function createSplitModifiers(config) {
    var separator = config.separator || ":";
    var isSeparatorSingleCharacter = separator.length === 1;
    var firstSeparatorCharacter = separator[0];
    var separatorLength = separator.length;
    return function splitModifiers(className) {
      var modifiers = [];
      var bracketDepth = 0;
      var modifierStart = 0;
      var postfixModifierPosition;
      for (var index = 0; index < className.length; index++) {
        var currentCharacter = className[index];
        if (bracketDepth === 0) {
          if (currentCharacter === firstSeparatorCharacter && (isSeparatorSingleCharacter || className.slice(index, index + separatorLength) === separator)) {
            modifiers.push(className.slice(modifierStart, index));
            modifierStart = index + separatorLength;
            continue;
          }
          if (currentCharacter === "/") {
            postfixModifierPosition = index;
            continue;
          }
        }
        if (currentCharacter === "[") {
          bracketDepth++;
        } else if (currentCharacter === "]") {
          bracketDepth--;
        }
      }
      var baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.substring(modifierStart);
      var hasImportantModifier = baseClassNameWithImportantModifier.startsWith(IMPORTANT_MODIFIER);
      var baseClassName = hasImportantModifier ? baseClassNameWithImportantModifier.substring(1) : baseClassNameWithImportantModifier;
      var maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : void 0;
      return {
        modifiers,
        hasImportantModifier,
        baseClassName,
        maybePostfixModifierPosition
      };
    };
  }
  function sortModifiers(modifiers) {
    if (modifiers.length <= 1) {
      return modifiers;
    }
    var sortedModifiers = [];
    var unsortedModifiers = [];
    modifiers.forEach(function(modifier) {
      var isArbitraryVariant = modifier[0] === "[";
      if (isArbitraryVariant) {
        sortedModifiers.push.apply(sortedModifiers, unsortedModifiers.sort().concat([modifier]));
        unsortedModifiers = [];
      } else {
        unsortedModifiers.push(modifier);
      }
    });
    sortedModifiers.push.apply(sortedModifiers, unsortedModifiers.sort());
    return sortedModifiers;
  }
  function createConfigUtils(config) {
    return {
      cache: createLruCache(config.cacheSize),
      splitModifiers: createSplitModifiers(config),
      ...createClassUtils(config)
    };
  }
  var SPLIT_CLASSES_REGEX = /\s+/;
  function mergeClassList(classList, configUtils) {
    var splitModifiers = configUtils.splitModifiers, getClassGroupId = configUtils.getClassGroupId, getConflictingClassGroupIds = configUtils.getConflictingClassGroupIds;
    var classGroupsInConflict = /* @__PURE__ */ new Set();
    return classList.trim().split(SPLIT_CLASSES_REGEX).map(function(originalClassName) {
      var _splitModifiers = splitModifiers(originalClassName), modifiers = _splitModifiers.modifiers, hasImportantModifier = _splitModifiers.hasImportantModifier, baseClassName = _splitModifiers.baseClassName, maybePostfixModifierPosition = _splitModifiers.maybePostfixModifierPosition;
      var classGroupId = getClassGroupId(maybePostfixModifierPosition ? baseClassName.substring(0, maybePostfixModifierPosition) : baseClassName);
      var hasPostfixModifier = Boolean(maybePostfixModifierPosition);
      if (!classGroupId) {
        if (!maybePostfixModifierPosition) {
          return {
            isTailwindClass: false,
            originalClassName
          };
        }
        classGroupId = getClassGroupId(baseClassName);
        if (!classGroupId) {
          return {
            isTailwindClass: false,
            originalClassName
          };
        }
        hasPostfixModifier = false;
      }
      var variantModifier = sortModifiers(modifiers).join(":");
      var modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
      return {
        isTailwindClass: true,
        modifierId,
        classGroupId,
        originalClassName,
        hasPostfixModifier
      };
    }).reverse().filter(function(parsed) {
      if (!parsed.isTailwindClass) {
        return true;
      }
      var modifierId = parsed.modifierId, classGroupId = parsed.classGroupId, hasPostfixModifier = parsed.hasPostfixModifier;
      var classId = modifierId + classGroupId;
      if (classGroupsInConflict.has(classId)) {
        return false;
      }
      classGroupsInConflict.add(classId);
      getConflictingClassGroupIds(classGroupId, hasPostfixModifier).forEach(function(group) {
        return classGroupsInConflict.add(modifierId + group);
      });
      return true;
    }).reverse().map(function(parsed) {
      return parsed.originalClassName;
    }).join(" ");
  }
  function createTailwindMerge() {
    for (var _len = arguments.length, createConfig = new Array(_len), _key = 0; _key < _len; _key++) {
      createConfig[_key] = arguments[_key];
    }
    var configUtils;
    var cacheGet;
    var cacheSet;
    var functionToCall = initTailwindMerge;
    function initTailwindMerge(classList) {
      var firstCreateConfig = createConfig[0], restCreateConfig = createConfig.slice(1);
      var config = restCreateConfig.reduce(function(previousConfig, createConfigCurrent) {
        return createConfigCurrent(previousConfig);
      }, firstCreateConfig());
      configUtils = createConfigUtils(config);
      cacheGet = configUtils.cache.get;
      cacheSet = configUtils.cache.set;
      functionToCall = tailwindMerge;
      return tailwindMerge(classList);
    }
    function tailwindMerge(classList) {
      var cachedResult = cacheGet(classList);
      if (cachedResult) {
        return cachedResult;
      }
      var result = mergeClassList(classList, configUtils);
      cacheSet(classList, result);
      return result;
    }
    return function callTailwindMerge() {
      return functionToCall(twJoin.apply(null, arguments));
    };
  }
  function fromTheme(key) {
    var themeGetter = function themeGetter2(theme) {
      return theme[key] || [];
    };
    themeGetter.isThemeGetter = true;
    return themeGetter;
  }
  var arbitraryValueRegex = /^\[(?:([a-z-]+):)?(.+)\]$/i;
  var fractionRegex = /^\d+\/\d+$/;
  var stringLengths = /* @__PURE__ */ new Set(["px", "full", "screen"]);
  var tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
  var lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
  var shadowRegex = /^-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
  function isLength(value) {
    return isNumber(value) || stringLengths.has(value) || fractionRegex.test(value) || isArbitraryLength(value);
  }
  function isArbitraryLength(value) {
    return getIsArbitraryValue(value, "length", isLengthOnly);
  }
  function isArbitrarySize(value) {
    return getIsArbitraryValue(value, "size", isNever);
  }
  function isArbitraryPosition(value) {
    return getIsArbitraryValue(value, "position", isNever);
  }
  function isArbitraryUrl(value) {
    return getIsArbitraryValue(value, "url", isUrl);
  }
  function isArbitraryNumber(value) {
    return getIsArbitraryValue(value, "number", isNumber);
  }
  function isNumber(value) {
    return !Number.isNaN(Number(value));
  }
  function isPercent(value) {
    return value.endsWith("%") && isNumber(value.slice(0, -1));
  }
  function isInteger(value) {
    return isIntegerOnly(value) || getIsArbitraryValue(value, "number", isIntegerOnly);
  }
  function isArbitraryValue(value) {
    return arbitraryValueRegex.test(value);
  }
  function isAny() {
    return true;
  }
  function isTshirtSize(value) {
    return tshirtUnitRegex.test(value);
  }
  function isArbitraryShadow(value) {
    return getIsArbitraryValue(value, "", isShadow);
  }
  function getIsArbitraryValue(value, label, testValue) {
    var result = arbitraryValueRegex.exec(value);
    if (result) {
      if (result[1]) {
        return result[1] === label;
      }
      return testValue(result[2]);
    }
    return false;
  }
  function isLengthOnly(value) {
    return lengthUnitRegex.test(value);
  }
  function isNever() {
    return false;
  }
  function isUrl(value) {
    return value.startsWith("url(");
  }
  function isIntegerOnly(value) {
    return Number.isInteger(Number(value));
  }
  function isShadow(value) {
    return shadowRegex.test(value);
  }
  function getDefaultConfig() {
    var colors = fromTheme("colors");
    var spacing2 = fromTheme("spacing");
    var blur = fromTheme("blur");
    var brightness = fromTheme("brightness");
    var borderColor = fromTheme("borderColor");
    var borderRadius = fromTheme("borderRadius");
    var borderSpacing = fromTheme("borderSpacing");
    var borderWidth = fromTheme("borderWidth");
    var contrast = fromTheme("contrast");
    var grayscale = fromTheme("grayscale");
    var hueRotate = fromTheme("hueRotate");
    var invert = fromTheme("invert");
    var gap = fromTheme("gap");
    var gradientColorStops = fromTheme("gradientColorStops");
    var gradientColorStopPositions = fromTheme("gradientColorStopPositions");
    var inset = fromTheme("inset");
    var margin = fromTheme("margin");
    var opacity = fromTheme("opacity");
    var padding = fromTheme("padding");
    var saturate = fromTheme("saturate");
    var scale = fromTheme("scale");
    var sepia = fromTheme("sepia");
    var skew = fromTheme("skew");
    var space2 = fromTheme("space");
    var translate = fromTheme("translate");
    var getOverscroll = function getOverscroll2() {
      return ["auto", "contain", "none"];
    };
    var getOverflow = function getOverflow2() {
      return ["auto", "hidden", "clip", "visible", "scroll"];
    };
    var getSpacingWithAutoAndArbitrary = function getSpacingWithAutoAndArbitrary2() {
      return ["auto", isArbitraryValue, spacing2];
    };
    var getSpacingWithArbitrary = function getSpacingWithArbitrary2() {
      return [isArbitraryValue, spacing2];
    };
    var getLengthWithEmpty = function getLengthWithEmpty2() {
      return ["", isLength];
    };
    var getNumberWithAutoAndArbitrary = function getNumberWithAutoAndArbitrary2() {
      return ["auto", isNumber, isArbitraryValue];
    };
    var getPositions = function getPositions2() {
      return ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"];
    };
    var getLineStyles = function getLineStyles2() {
      return ["solid", "dashed", "dotted", "double", "none"];
    };
    var getBlendModes = function getBlendModes2() {
      return ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity", "plus-lighter"];
    };
    var getAlign = function getAlign2() {
      return ["start", "end", "center", "between", "around", "evenly", "stretch"];
    };
    var getZeroAndEmpty = function getZeroAndEmpty2() {
      return ["", "0", isArbitraryValue];
    };
    var getBreaks = function getBreaks2() {
      return ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"];
    };
    var getNumber = function getNumber2() {
      return [isNumber, isArbitraryNumber];
    };
    var getNumberAndArbitrary = function getNumberAndArbitrary2() {
      return [isNumber, isArbitraryValue];
    };
    return {
      cacheSize: 500,
      theme: {
        colors: [isAny],
        spacing: [isLength],
        blur: ["none", "", isTshirtSize, isArbitraryValue],
        brightness: getNumber(),
        borderColor: [colors],
        borderRadius: ["none", "", "full", isTshirtSize, isArbitraryValue],
        borderSpacing: getSpacingWithArbitrary(),
        borderWidth: getLengthWithEmpty(),
        contrast: getNumber(),
        grayscale: getZeroAndEmpty(),
        hueRotate: getNumberAndArbitrary(),
        invert: getZeroAndEmpty(),
        gap: getSpacingWithArbitrary(),
        gradientColorStops: [colors],
        gradientColorStopPositions: [isPercent, isArbitraryLength],
        inset: getSpacingWithAutoAndArbitrary(),
        margin: getSpacingWithAutoAndArbitrary(),
        opacity: getNumber(),
        padding: getSpacingWithArbitrary(),
        saturate: getNumber(),
        scale: getNumber(),
        sepia: getZeroAndEmpty(),
        skew: getNumberAndArbitrary(),
        space: getSpacingWithArbitrary(),
        translate: getSpacingWithArbitrary()
      },
      classGroups: {
        // Layout
        /**
         * Aspect Ratio
         * @see https://tailwindcss.com/docs/aspect-ratio
         */
        aspect: [{
          aspect: ["auto", "square", "video", isArbitraryValue]
        }],
        /**
         * Container
         * @see https://tailwindcss.com/docs/container
         */
        container: ["container"],
        /**
         * Columns
         * @see https://tailwindcss.com/docs/columns
         */
        columns: [{
          columns: [isTshirtSize]
        }],
        /**
         * Break After
         * @see https://tailwindcss.com/docs/break-after
         */
        "break-after": [{
          "break-after": getBreaks()
        }],
        /**
         * Break Before
         * @see https://tailwindcss.com/docs/break-before
         */
        "break-before": [{
          "break-before": getBreaks()
        }],
        /**
         * Break Inside
         * @see https://tailwindcss.com/docs/break-inside
         */
        "break-inside": [{
          "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
        }],
        /**
         * Box Decoration Break
         * @see https://tailwindcss.com/docs/box-decoration-break
         */
        "box-decoration": [{
          "box-decoration": ["slice", "clone"]
        }],
        /**
         * Box Sizing
         * @see https://tailwindcss.com/docs/box-sizing
         */
        box: [{
          box: ["border", "content"]
        }],
        /**
         * Display
         * @see https://tailwindcss.com/docs/display
         */
        display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
        /**
         * Floats
         * @see https://tailwindcss.com/docs/float
         */
        "float": [{
          "float": ["right", "left", "none"]
        }],
        /**
         * Clear
         * @see https://tailwindcss.com/docs/clear
         */
        clear: [{
          clear: ["left", "right", "both", "none"]
        }],
        /**
         * Isolation
         * @see https://tailwindcss.com/docs/isolation
         */
        isolation: ["isolate", "isolation-auto"],
        /**
         * Object Fit
         * @see https://tailwindcss.com/docs/object-fit
         */
        "object-fit": [{
          object: ["contain", "cover", "fill", "none", "scale-down"]
        }],
        /**
         * Object Position
         * @see https://tailwindcss.com/docs/object-position
         */
        "object-position": [{
          object: [].concat(getPositions(), [isArbitraryValue])
        }],
        /**
         * Overflow
         * @see https://tailwindcss.com/docs/overflow
         */
        overflow: [{
          overflow: getOverflow()
        }],
        /**
         * Overflow X
         * @see https://tailwindcss.com/docs/overflow
         */
        "overflow-x": [{
          "overflow-x": getOverflow()
        }],
        /**
         * Overflow Y
         * @see https://tailwindcss.com/docs/overflow
         */
        "overflow-y": [{
          "overflow-y": getOverflow()
        }],
        /**
         * Overscroll Behavior
         * @see https://tailwindcss.com/docs/overscroll-behavior
         */
        overscroll: [{
          overscroll: getOverscroll()
        }],
        /**
         * Overscroll Behavior X
         * @see https://tailwindcss.com/docs/overscroll-behavior
         */
        "overscroll-x": [{
          "overscroll-x": getOverscroll()
        }],
        /**
         * Overscroll Behavior Y
         * @see https://tailwindcss.com/docs/overscroll-behavior
         */
        "overscroll-y": [{
          "overscroll-y": getOverscroll()
        }],
        /**
         * Position
         * @see https://tailwindcss.com/docs/position
         */
        position: ["static", "fixed", "absolute", "relative", "sticky"],
        /**
         * Top / Right / Bottom / Left
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        inset: [{
          inset: [inset]
        }],
        /**
         * Right / Left
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        "inset-x": [{
          "inset-x": [inset]
        }],
        /**
         * Top / Bottom
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        "inset-y": [{
          "inset-y": [inset]
        }],
        /**
         * Start
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        start: [{
          start: [inset]
        }],
        /**
         * End
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        end: [{
          end: [inset]
        }],
        /**
         * Top
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        top: [{
          top: [inset]
        }],
        /**
         * Right
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        right: [{
          right: [inset]
        }],
        /**
         * Bottom
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        bottom: [{
          bottom: [inset]
        }],
        /**
         * Left
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        left: [{
          left: [inset]
        }],
        /**
         * Visibility
         * @see https://tailwindcss.com/docs/visibility
         */
        visibility: ["visible", "invisible", "collapse"],
        /**
         * Z-Index
         * @see https://tailwindcss.com/docs/z-index
         */
        z: [{
          z: ["auto", isInteger]
        }],
        // Flexbox and Grid
        /**
         * Flex Basis
         * @see https://tailwindcss.com/docs/flex-basis
         */
        basis: [{
          basis: getSpacingWithAutoAndArbitrary()
        }],
        /**
         * Flex Direction
         * @see https://tailwindcss.com/docs/flex-direction
         */
        "flex-direction": [{
          flex: ["row", "row-reverse", "col", "col-reverse"]
        }],
        /**
         * Flex Wrap
         * @see https://tailwindcss.com/docs/flex-wrap
         */
        "flex-wrap": [{
          flex: ["wrap", "wrap-reverse", "nowrap"]
        }],
        /**
         * Flex
         * @see https://tailwindcss.com/docs/flex
         */
        flex: [{
          flex: ["1", "auto", "initial", "none", isArbitraryValue]
        }],
        /**
         * Flex Grow
         * @see https://tailwindcss.com/docs/flex-grow
         */
        grow: [{
          grow: getZeroAndEmpty()
        }],
        /**
         * Flex Shrink
         * @see https://tailwindcss.com/docs/flex-shrink
         */
        shrink: [{
          shrink: getZeroAndEmpty()
        }],
        /**
         * Order
         * @see https://tailwindcss.com/docs/order
         */
        order: [{
          order: ["first", "last", "none", isInteger]
        }],
        /**
         * Grid Template Columns
         * @see https://tailwindcss.com/docs/grid-template-columns
         */
        "grid-cols": [{
          "grid-cols": [isAny]
        }],
        /**
         * Grid Column Start / End
         * @see https://tailwindcss.com/docs/grid-column
         */
        "col-start-end": [{
          col: ["auto", {
            span: ["full", isInteger]
          }, isArbitraryValue]
        }],
        /**
         * Grid Column Start
         * @see https://tailwindcss.com/docs/grid-column
         */
        "col-start": [{
          "col-start": getNumberWithAutoAndArbitrary()
        }],
        /**
         * Grid Column End
         * @see https://tailwindcss.com/docs/grid-column
         */
        "col-end": [{
          "col-end": getNumberWithAutoAndArbitrary()
        }],
        /**
         * Grid Template Rows
         * @see https://tailwindcss.com/docs/grid-template-rows
         */
        "grid-rows": [{
          "grid-rows": [isAny]
        }],
        /**
         * Grid Row Start / End
         * @see https://tailwindcss.com/docs/grid-row
         */
        "row-start-end": [{
          row: ["auto", {
            span: [isInteger]
          }, isArbitraryValue]
        }],
        /**
         * Grid Row Start
         * @see https://tailwindcss.com/docs/grid-row
         */
        "row-start": [{
          "row-start": getNumberWithAutoAndArbitrary()
        }],
        /**
         * Grid Row End
         * @see https://tailwindcss.com/docs/grid-row
         */
        "row-end": [{
          "row-end": getNumberWithAutoAndArbitrary()
        }],
        /**
         * Grid Auto Flow
         * @see https://tailwindcss.com/docs/grid-auto-flow
         */
        "grid-flow": [{
          "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
        }],
        /**
         * Grid Auto Columns
         * @see https://tailwindcss.com/docs/grid-auto-columns
         */
        "auto-cols": [{
          "auto-cols": ["auto", "min", "max", "fr", isArbitraryValue]
        }],
        /**
         * Grid Auto Rows
         * @see https://tailwindcss.com/docs/grid-auto-rows
         */
        "auto-rows": [{
          "auto-rows": ["auto", "min", "max", "fr", isArbitraryValue]
        }],
        /**
         * Gap
         * @see https://tailwindcss.com/docs/gap
         */
        gap: [{
          gap: [gap]
        }],
        /**
         * Gap X
         * @see https://tailwindcss.com/docs/gap
         */
        "gap-x": [{
          "gap-x": [gap]
        }],
        /**
         * Gap Y
         * @see https://tailwindcss.com/docs/gap
         */
        "gap-y": [{
          "gap-y": [gap]
        }],
        /**
         * Justify Content
         * @see https://tailwindcss.com/docs/justify-content
         */
        "justify-content": [{
          justify: ["normal"].concat(getAlign())
        }],
        /**
         * Justify Items
         * @see https://tailwindcss.com/docs/justify-items
         */
        "justify-items": [{
          "justify-items": ["start", "end", "center", "stretch"]
        }],
        /**
         * Justify Self
         * @see https://tailwindcss.com/docs/justify-self
         */
        "justify-self": [{
          "justify-self": ["auto", "start", "end", "center", "stretch"]
        }],
        /**
         * Align Content
         * @see https://tailwindcss.com/docs/align-content
         */
        "align-content": [{
          content: ["normal"].concat(getAlign(), ["baseline"])
        }],
        /**
         * Align Items
         * @see https://tailwindcss.com/docs/align-items
         */
        "align-items": [{
          items: ["start", "end", "center", "baseline", "stretch"]
        }],
        /**
         * Align Self
         * @see https://tailwindcss.com/docs/align-self
         */
        "align-self": [{
          self: ["auto", "start", "end", "center", "stretch", "baseline"]
        }],
        /**
         * Place Content
         * @see https://tailwindcss.com/docs/place-content
         */
        "place-content": [{
          "place-content": [].concat(getAlign(), ["baseline"])
        }],
        /**
         * Place Items
         * @see https://tailwindcss.com/docs/place-items
         */
        "place-items": [{
          "place-items": ["start", "end", "center", "baseline", "stretch"]
        }],
        /**
         * Place Self
         * @see https://tailwindcss.com/docs/place-self
         */
        "place-self": [{
          "place-self": ["auto", "start", "end", "center", "stretch"]
        }],
        // Spacing
        /**
         * Padding
         * @see https://tailwindcss.com/docs/padding
         */
        p: [{
          p: [padding]
        }],
        /**
         * Padding X
         * @see https://tailwindcss.com/docs/padding
         */
        px: [{
          px: [padding]
        }],
        /**
         * Padding Y
         * @see https://tailwindcss.com/docs/padding
         */
        py: [{
          py: [padding]
        }],
        /**
         * Padding Start
         * @see https://tailwindcss.com/docs/padding
         */
        ps: [{
          ps: [padding]
        }],
        /**
         * Padding End
         * @see https://tailwindcss.com/docs/padding
         */
        pe: [{
          pe: [padding]
        }],
        /**
         * Padding Top
         * @see https://tailwindcss.com/docs/padding
         */
        pt: [{
          pt: [padding]
        }],
        /**
         * Padding Right
         * @see https://tailwindcss.com/docs/padding
         */
        pr: [{
          pr: [padding]
        }],
        /**
         * Padding Bottom
         * @see https://tailwindcss.com/docs/padding
         */
        pb: [{
          pb: [padding]
        }],
        /**
         * Padding Left
         * @see https://tailwindcss.com/docs/padding
         */
        pl: [{
          pl: [padding]
        }],
        /**
         * Margin
         * @see https://tailwindcss.com/docs/margin
         */
        m: [{
          m: [margin]
        }],
        /**
         * Margin X
         * @see https://tailwindcss.com/docs/margin
         */
        mx: [{
          mx: [margin]
        }],
        /**
         * Margin Y
         * @see https://tailwindcss.com/docs/margin
         */
        my: [{
          my: [margin]
        }],
        /**
         * Margin Start
         * @see https://tailwindcss.com/docs/margin
         */
        ms: [{
          ms: [margin]
        }],
        /**
         * Margin End
         * @see https://tailwindcss.com/docs/margin
         */
        me: [{
          me: [margin]
        }],
        /**
         * Margin Top
         * @see https://tailwindcss.com/docs/margin
         */
        mt: [{
          mt: [margin]
        }],
        /**
         * Margin Right
         * @see https://tailwindcss.com/docs/margin
         */
        mr: [{
          mr: [margin]
        }],
        /**
         * Margin Bottom
         * @see https://tailwindcss.com/docs/margin
         */
        mb: [{
          mb: [margin]
        }],
        /**
         * Margin Left
         * @see https://tailwindcss.com/docs/margin
         */
        ml: [{
          ml: [margin]
        }],
        /**
         * Space Between X
         * @see https://tailwindcss.com/docs/space
         */
        "space-x": [{
          "space-x": [space2]
        }],
        /**
         * Space Between X Reverse
         * @see https://tailwindcss.com/docs/space
         */
        "space-x-reverse": ["space-x-reverse"],
        /**
         * Space Between Y
         * @see https://tailwindcss.com/docs/space
         */
        "space-y": [{
          "space-y": [space2]
        }],
        /**
         * Space Between Y Reverse
         * @see https://tailwindcss.com/docs/space
         */
        "space-y-reverse": ["space-y-reverse"],
        // Sizing
        /**
         * Width
         * @see https://tailwindcss.com/docs/width
         */
        w: [{
          w: ["auto", "min", "max", "fit", isArbitraryValue, spacing2]
        }],
        /**
         * Min-Width
         * @see https://tailwindcss.com/docs/min-width
         */
        "min-w": [{
          "min-w": ["min", "max", "fit", isArbitraryValue, isLength]
        }],
        /**
         * Max-Width
         * @see https://tailwindcss.com/docs/max-width
         */
        "max-w": [{
          "max-w": ["0", "none", "full", "min", "max", "fit", "prose", {
            screen: [isTshirtSize]
          }, isTshirtSize, isArbitraryValue]
        }],
        /**
         * Height
         * @see https://tailwindcss.com/docs/height
         */
        h: [{
          h: [isArbitraryValue, spacing2, "auto", "min", "max", "fit"]
        }],
        /**
         * Min-Height
         * @see https://tailwindcss.com/docs/min-height
         */
        "min-h": [{
          "min-h": ["min", "max", "fit", isArbitraryValue, isLength]
        }],
        /**
         * Max-Height
         * @see https://tailwindcss.com/docs/max-height
         */
        "max-h": [{
          "max-h": [isArbitraryValue, spacing2, "min", "max", "fit"]
        }],
        // Typography
        /**
         * Font Size
         * @see https://tailwindcss.com/docs/font-size
         */
        "font-size": [{
          text: ["base", isTshirtSize, isArbitraryLength]
        }],
        /**
         * Font Smoothing
         * @see https://tailwindcss.com/docs/font-smoothing
         */
        "font-smoothing": ["antialiased", "subpixel-antialiased"],
        /**
         * Font Style
         * @see https://tailwindcss.com/docs/font-style
         */
        "font-style": ["italic", "not-italic"],
        /**
         * Font Weight
         * @see https://tailwindcss.com/docs/font-weight
         */
        "font-weight": [{
          font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", isArbitraryNumber]
        }],
        /**
         * Font Family
         * @see https://tailwindcss.com/docs/font-family
         */
        "font-family": [{
          font: [isAny]
        }],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-normal": ["normal-nums"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-ordinal": ["ordinal"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-slashed-zero": ["slashed-zero"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-figure": ["lining-nums", "oldstyle-nums"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-spacing": ["proportional-nums", "tabular-nums"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-fraction": ["diagonal-fractions", "stacked-fractons"],
        /**
         * Letter Spacing
         * @see https://tailwindcss.com/docs/letter-spacing
         */
        tracking: [{
          tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", isArbitraryValue]
        }],
        /**
         * Line Clamp
         * @see https://tailwindcss.com/docs/line-clamp
         */
        "line-clamp": [{
          "line-clamp": ["none", isNumber, isArbitraryNumber]
        }],
        /**
         * Line Height
         * @see https://tailwindcss.com/docs/line-height
         */
        leading: [{
          leading: ["none", "tight", "snug", "normal", "relaxed", "loose", isArbitraryValue, isLength]
        }],
        /**
         * List Style Image
         * @see https://tailwindcss.com/docs/list-style-image
         */
        "list-image": [{
          "list-image": ["none", isArbitraryValue]
        }],
        /**
         * List Style Type
         * @see https://tailwindcss.com/docs/list-style-type
         */
        "list-style-type": [{
          list: ["none", "disc", "decimal", isArbitraryValue]
        }],
        /**
         * List Style Position
         * @see https://tailwindcss.com/docs/list-style-position
         */
        "list-style-position": [{
          list: ["inside", "outside"]
        }],
        /**
         * Placeholder Color
         * @deprecated since Tailwind CSS v3.0.0
         * @see https://tailwindcss.com/docs/placeholder-color
         */
        "placeholder-color": [{
          placeholder: [colors]
        }],
        /**
         * Placeholder Opacity
         * @see https://tailwindcss.com/docs/placeholder-opacity
         */
        "placeholder-opacity": [{
          "placeholder-opacity": [opacity]
        }],
        /**
         * Text Alignment
         * @see https://tailwindcss.com/docs/text-align
         */
        "text-alignment": [{
          text: ["left", "center", "right", "justify", "start", "end"]
        }],
        /**
         * Text Color
         * @see https://tailwindcss.com/docs/text-color
         */
        "text-color": [{
          text: [colors]
        }],
        /**
         * Text Opacity
         * @see https://tailwindcss.com/docs/text-opacity
         */
        "text-opacity": [{
          "text-opacity": [opacity]
        }],
        /**
         * Text Decoration
         * @see https://tailwindcss.com/docs/text-decoration
         */
        "text-decoration": ["underline", "overline", "line-through", "no-underline"],
        /**
         * Text Decoration Style
         * @see https://tailwindcss.com/docs/text-decoration-style
         */
        "text-decoration-style": [{
          decoration: [].concat(getLineStyles(), ["wavy"])
        }],
        /**
         * Text Decoration Thickness
         * @see https://tailwindcss.com/docs/text-decoration-thickness
         */
        "text-decoration-thickness": [{
          decoration: ["auto", "from-font", isLength]
        }],
        /**
         * Text Underline Offset
         * @see https://tailwindcss.com/docs/text-underline-offset
         */
        "underline-offset": [{
          "underline-offset": ["auto", isArbitraryValue, isLength]
        }],
        /**
         * Text Decoration Color
         * @see https://tailwindcss.com/docs/text-decoration-color
         */
        "text-decoration-color": [{
          decoration: [colors]
        }],
        /**
         * Text Transform
         * @see https://tailwindcss.com/docs/text-transform
         */
        "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
        /**
         * Text Overflow
         * @see https://tailwindcss.com/docs/text-overflow
         */
        "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
        /**
         * Text Indent
         * @see https://tailwindcss.com/docs/text-indent
         */
        indent: [{
          indent: getSpacingWithArbitrary()
        }],
        /**
         * Vertical Alignment
         * @see https://tailwindcss.com/docs/vertical-align
         */
        "vertical-align": [{
          align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", isArbitraryValue]
        }],
        /**
         * Whitespace
         * @see https://tailwindcss.com/docs/whitespace
         */
        whitespace: [{
          whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
        }],
        /**
         * Word Break
         * @see https://tailwindcss.com/docs/word-break
         */
        "break": [{
          "break": ["normal", "words", "all", "keep"]
        }],
        /**
         * Hyphens
         * @see https://tailwindcss.com/docs/hyphens
         */
        hyphens: [{
          hyphens: ["none", "manual", "auto"]
        }],
        /**
         * Content
         * @see https://tailwindcss.com/docs/content
         */
        content: [{
          content: ["none", isArbitraryValue]
        }],
        // Backgrounds
        /**
         * Background Attachment
         * @see https://tailwindcss.com/docs/background-attachment
         */
        "bg-attachment": [{
          bg: ["fixed", "local", "scroll"]
        }],
        /**
         * Background Clip
         * @see https://tailwindcss.com/docs/background-clip
         */
        "bg-clip": [{
          "bg-clip": ["border", "padding", "content", "text"]
        }],
        /**
         * Background Opacity
         * @deprecated since Tailwind CSS v3.0.0
         * @see https://tailwindcss.com/docs/background-opacity
         */
        "bg-opacity": [{
          "bg-opacity": [opacity]
        }],
        /**
         * Background Origin
         * @see https://tailwindcss.com/docs/background-origin
         */
        "bg-origin": [{
          "bg-origin": ["border", "padding", "content"]
        }],
        /**
         * Background Position
         * @see https://tailwindcss.com/docs/background-position
         */
        "bg-position": [{
          bg: [].concat(getPositions(), [isArbitraryPosition])
        }],
        /**
         * Background Repeat
         * @see https://tailwindcss.com/docs/background-repeat
         */
        "bg-repeat": [{
          bg: ["no-repeat", {
            repeat: ["", "x", "y", "round", "space"]
          }]
        }],
        /**
         * Background Size
         * @see https://tailwindcss.com/docs/background-size
         */
        "bg-size": [{
          bg: ["auto", "cover", "contain", isArbitrarySize]
        }],
        /**
         * Background Image
         * @see https://tailwindcss.com/docs/background-image
         */
        "bg-image": [{
          bg: ["none", {
            "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, isArbitraryUrl]
        }],
        /**
         * Background Color
         * @see https://tailwindcss.com/docs/background-color
         */
        "bg-color": [{
          bg: [colors]
        }],
        /**
         * Gradient Color Stops From Position
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-from-pos": [{
          from: [gradientColorStopPositions]
        }],
        /**
         * Gradient Color Stops Via Position
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-via-pos": [{
          via: [gradientColorStopPositions]
        }],
        /**
         * Gradient Color Stops To Position
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-to-pos": [{
          to: [gradientColorStopPositions]
        }],
        /**
         * Gradient Color Stops From
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-from": [{
          from: [gradientColorStops]
        }],
        /**
         * Gradient Color Stops Via
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-via": [{
          via: [gradientColorStops]
        }],
        /**
         * Gradient Color Stops To
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-to": [{
          to: [gradientColorStops]
        }],
        // Borders
        /**
         * Border Radius
         * @see https://tailwindcss.com/docs/border-radius
         */
        rounded: [{
          rounded: [borderRadius]
        }],
        /**
         * Border Radius Start
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-s": [{
          "rounded-s": [borderRadius]
        }],
        /**
         * Border Radius End
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-e": [{
          "rounded-e": [borderRadius]
        }],
        /**
         * Border Radius Top
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-t": [{
          "rounded-t": [borderRadius]
        }],
        /**
         * Border Radius Right
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-r": [{
          "rounded-r": [borderRadius]
        }],
        /**
         * Border Radius Bottom
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-b": [{
          "rounded-b": [borderRadius]
        }],
        /**
         * Border Radius Left
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-l": [{
          "rounded-l": [borderRadius]
        }],
        /**
         * Border Radius Start Start
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-ss": [{
          "rounded-ss": [borderRadius]
        }],
        /**
         * Border Radius Start End
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-se": [{
          "rounded-se": [borderRadius]
        }],
        /**
         * Border Radius End End
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-ee": [{
          "rounded-ee": [borderRadius]
        }],
        /**
         * Border Radius End Start
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-es": [{
          "rounded-es": [borderRadius]
        }],
        /**
         * Border Radius Top Left
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-tl": [{
          "rounded-tl": [borderRadius]
        }],
        /**
         * Border Radius Top Right
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-tr": [{
          "rounded-tr": [borderRadius]
        }],
        /**
         * Border Radius Bottom Right
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-br": [{
          "rounded-br": [borderRadius]
        }],
        /**
         * Border Radius Bottom Left
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-bl": [{
          "rounded-bl": [borderRadius]
        }],
        /**
         * Border Width
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w": [{
          border: [borderWidth]
        }],
        /**
         * Border Width X
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-x": [{
          "border-x": [borderWidth]
        }],
        /**
         * Border Width Y
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-y": [{
          "border-y": [borderWidth]
        }],
        /**
         * Border Width Start
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-s": [{
          "border-s": [borderWidth]
        }],
        /**
         * Border Width End
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-e": [{
          "border-e": [borderWidth]
        }],
        /**
         * Border Width Top
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-t": [{
          "border-t": [borderWidth]
        }],
        /**
         * Border Width Right
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-r": [{
          "border-r": [borderWidth]
        }],
        /**
         * Border Width Bottom
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-b": [{
          "border-b": [borderWidth]
        }],
        /**
         * Border Width Left
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-l": [{
          "border-l": [borderWidth]
        }],
        /**
         * Border Opacity
         * @see https://tailwindcss.com/docs/border-opacity
         */
        "border-opacity": [{
          "border-opacity": [opacity]
        }],
        /**
         * Border Style
         * @see https://tailwindcss.com/docs/border-style
         */
        "border-style": [{
          border: [].concat(getLineStyles(), ["hidden"])
        }],
        /**
         * Divide Width X
         * @see https://tailwindcss.com/docs/divide-width
         */
        "divide-x": [{
          "divide-x": [borderWidth]
        }],
        /**
         * Divide Width X Reverse
         * @see https://tailwindcss.com/docs/divide-width
         */
        "divide-x-reverse": ["divide-x-reverse"],
        /**
         * Divide Width Y
         * @see https://tailwindcss.com/docs/divide-width
         */
        "divide-y": [{
          "divide-y": [borderWidth]
        }],
        /**
         * Divide Width Y Reverse
         * @see https://tailwindcss.com/docs/divide-width
         */
        "divide-y-reverse": ["divide-y-reverse"],
        /**
         * Divide Opacity
         * @see https://tailwindcss.com/docs/divide-opacity
         */
        "divide-opacity": [{
          "divide-opacity": [opacity]
        }],
        /**
         * Divide Style
         * @see https://tailwindcss.com/docs/divide-style
         */
        "divide-style": [{
          divide: getLineStyles()
        }],
        /**
         * Border Color
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color": [{
          border: [borderColor]
        }],
        /**
         * Border Color X
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-x": [{
          "border-x": [borderColor]
        }],
        /**
         * Border Color Y
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-y": [{
          "border-y": [borderColor]
        }],
        /**
         * Border Color Top
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-t": [{
          "border-t": [borderColor]
        }],
        /**
         * Border Color Right
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-r": [{
          "border-r": [borderColor]
        }],
        /**
         * Border Color Bottom
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-b": [{
          "border-b": [borderColor]
        }],
        /**
         * Border Color Left
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-l": [{
          "border-l": [borderColor]
        }],
        /**
         * Divide Color
         * @see https://tailwindcss.com/docs/divide-color
         */
        "divide-color": [{
          divide: [borderColor]
        }],
        /**
         * Outline Style
         * @see https://tailwindcss.com/docs/outline-style
         */
        "outline-style": [{
          outline: [""].concat(getLineStyles())
        }],
        /**
         * Outline Offset
         * @see https://tailwindcss.com/docs/outline-offset
         */
        "outline-offset": [{
          "outline-offset": [isArbitraryValue, isLength]
        }],
        /**
         * Outline Width
         * @see https://tailwindcss.com/docs/outline-width
         */
        "outline-w": [{
          outline: [isLength]
        }],
        /**
         * Outline Color
         * @see https://tailwindcss.com/docs/outline-color
         */
        "outline-color": [{
          outline: [colors]
        }],
        /**
         * Ring Width
         * @see https://tailwindcss.com/docs/ring-width
         */
        "ring-w": [{
          ring: getLengthWithEmpty()
        }],
        /**
         * Ring Width Inset
         * @see https://tailwindcss.com/docs/ring-width
         */
        "ring-w-inset": ["ring-inset"],
        /**
         * Ring Color
         * @see https://tailwindcss.com/docs/ring-color
         */
        "ring-color": [{
          ring: [colors]
        }],
        /**
         * Ring Opacity
         * @see https://tailwindcss.com/docs/ring-opacity
         */
        "ring-opacity": [{
          "ring-opacity": [opacity]
        }],
        /**
         * Ring Offset Width
         * @see https://tailwindcss.com/docs/ring-offset-width
         */
        "ring-offset-w": [{
          "ring-offset": [isLength]
        }],
        /**
         * Ring Offset Color
         * @see https://tailwindcss.com/docs/ring-offset-color
         */
        "ring-offset-color": [{
          "ring-offset": [colors]
        }],
        // Effects
        /**
         * Box Shadow
         * @see https://tailwindcss.com/docs/box-shadow
         */
        shadow: [{
          shadow: ["", "inner", "none", isTshirtSize, isArbitraryShadow]
        }],
        /**
         * Box Shadow Color
         * @see https://tailwindcss.com/docs/box-shadow-color
         */
        "shadow-color": [{
          shadow: [isAny]
        }],
        /**
         * Opacity
         * @see https://tailwindcss.com/docs/opacity
         */
        opacity: [{
          opacity: [opacity]
        }],
        /**
         * Mix Blend Mode
         * @see https://tailwindcss.com/docs/mix-blend-mode
         */
        "mix-blend": [{
          "mix-blend": getBlendModes()
        }],
        /**
         * Background Blend Mode
         * @see https://tailwindcss.com/docs/background-blend-mode
         */
        "bg-blend": [{
          "bg-blend": getBlendModes()
        }],
        // Filters
        /**
         * Filter
         * @deprecated since Tailwind CSS v3.0.0
         * @see https://tailwindcss.com/docs/filter
         */
        filter: [{
          filter: ["", "none"]
        }],
        /**
         * Blur
         * @see https://tailwindcss.com/docs/blur
         */
        blur: [{
          blur: [blur]
        }],
        /**
         * Brightness
         * @see https://tailwindcss.com/docs/brightness
         */
        brightness: [{
          brightness: [brightness]
        }],
        /**
         * Contrast
         * @see https://tailwindcss.com/docs/contrast
         */
        contrast: [{
          contrast: [contrast]
        }],
        /**
         * Drop Shadow
         * @see https://tailwindcss.com/docs/drop-shadow
         */
        "drop-shadow": [{
          "drop-shadow": ["", "none", isTshirtSize, isArbitraryValue]
        }],
        /**
         * Grayscale
         * @see https://tailwindcss.com/docs/grayscale
         */
        grayscale: [{
          grayscale: [grayscale]
        }],
        /**
         * Hue Rotate
         * @see https://tailwindcss.com/docs/hue-rotate
         */
        "hue-rotate": [{
          "hue-rotate": [hueRotate]
        }],
        /**
         * Invert
         * @see https://tailwindcss.com/docs/invert
         */
        invert: [{
          invert: [invert]
        }],
        /**
         * Saturate
         * @see https://tailwindcss.com/docs/saturate
         */
        saturate: [{
          saturate: [saturate]
        }],
        /**
         * Sepia
         * @see https://tailwindcss.com/docs/sepia
         */
        sepia: [{
          sepia: [sepia]
        }],
        /**
         * Backdrop Filter
         * @deprecated since Tailwind CSS v3.0.0
         * @see https://tailwindcss.com/docs/backdrop-filter
         */
        "backdrop-filter": [{
          "backdrop-filter": ["", "none"]
        }],
        /**
         * Backdrop Blur
         * @see https://tailwindcss.com/docs/backdrop-blur
         */
        "backdrop-blur": [{
          "backdrop-blur": [blur]
        }],
        /**
         * Backdrop Brightness
         * @see https://tailwindcss.com/docs/backdrop-brightness
         */
        "backdrop-brightness": [{
          "backdrop-brightness": [brightness]
        }],
        /**
         * Backdrop Contrast
         * @see https://tailwindcss.com/docs/backdrop-contrast
         */
        "backdrop-contrast": [{
          "backdrop-contrast": [contrast]
        }],
        /**
         * Backdrop Grayscale
         * @see https://tailwindcss.com/docs/backdrop-grayscale
         */
        "backdrop-grayscale": [{
          "backdrop-grayscale": [grayscale]
        }],
        /**
         * Backdrop Hue Rotate
         * @see https://tailwindcss.com/docs/backdrop-hue-rotate
         */
        "backdrop-hue-rotate": [{
          "backdrop-hue-rotate": [hueRotate]
        }],
        /**
         * Backdrop Invert
         * @see https://tailwindcss.com/docs/backdrop-invert
         */
        "backdrop-invert": [{
          "backdrop-invert": [invert]
        }],
        /**
         * Backdrop Opacity
         * @see https://tailwindcss.com/docs/backdrop-opacity
         */
        "backdrop-opacity": [{
          "backdrop-opacity": [opacity]
        }],
        /**
         * Backdrop Saturate
         * @see https://tailwindcss.com/docs/backdrop-saturate
         */
        "backdrop-saturate": [{
          "backdrop-saturate": [saturate]
        }],
        /**
         * Backdrop Sepia
         * @see https://tailwindcss.com/docs/backdrop-sepia
         */
        "backdrop-sepia": [{
          "backdrop-sepia": [sepia]
        }],
        // Tables
        /**
         * Border Collapse
         * @see https://tailwindcss.com/docs/border-collapse
         */
        "border-collapse": [{
          border: ["collapse", "separate"]
        }],
        /**
         * Border Spacing
         * @see https://tailwindcss.com/docs/border-spacing
         */
        "border-spacing": [{
          "border-spacing": [borderSpacing]
        }],
        /**
         * Border Spacing X
         * @see https://tailwindcss.com/docs/border-spacing
         */
        "border-spacing-x": [{
          "border-spacing-x": [borderSpacing]
        }],
        /**
         * Border Spacing Y
         * @see https://tailwindcss.com/docs/border-spacing
         */
        "border-spacing-y": [{
          "border-spacing-y": [borderSpacing]
        }],
        /**
         * Table Layout
         * @see https://tailwindcss.com/docs/table-layout
         */
        "table-layout": [{
          table: ["auto", "fixed"]
        }],
        /**
         * Caption Side
         * @see https://tailwindcss.com/docs/caption-side
         */
        caption: [{
          caption: ["top", "bottom"]
        }],
        // Transitions and Animation
        /**
         * Tranisition Property
         * @see https://tailwindcss.com/docs/transition-property
         */
        transition: [{
          transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", isArbitraryValue]
        }],
        /**
         * Transition Duration
         * @see https://tailwindcss.com/docs/transition-duration
         */
        duration: [{
          duration: getNumberAndArbitrary()
        }],
        /**
         * Transition Timing Function
         * @see https://tailwindcss.com/docs/transition-timing-function
         */
        ease: [{
          ease: ["linear", "in", "out", "in-out", isArbitraryValue]
        }],
        /**
         * Transition Delay
         * @see https://tailwindcss.com/docs/transition-delay
         */
        delay: [{
          delay: getNumberAndArbitrary()
        }],
        /**
         * Animation
         * @see https://tailwindcss.com/docs/animation
         */
        animate: [{
          animate: ["none", "spin", "ping", "pulse", "bounce", isArbitraryValue]
        }],
        // Transforms
        /**
         * Transform
         * @see https://tailwindcss.com/docs/transform
         */
        transform: [{
          transform: ["", "gpu", "none"]
        }],
        /**
         * Scale
         * @see https://tailwindcss.com/docs/scale
         */
        scale: [{
          scale: [scale]
        }],
        /**
         * Scale X
         * @see https://tailwindcss.com/docs/scale
         */
        "scale-x": [{
          "scale-x": [scale]
        }],
        /**
         * Scale Y
         * @see https://tailwindcss.com/docs/scale
         */
        "scale-y": [{
          "scale-y": [scale]
        }],
        /**
         * Rotate
         * @see https://tailwindcss.com/docs/rotate
         */
        rotate: [{
          rotate: [isInteger, isArbitraryValue]
        }],
        /**
         * Translate X
         * @see https://tailwindcss.com/docs/translate
         */
        "translate-x": [{
          "translate-x": [translate]
        }],
        /**
         * Translate Y
         * @see https://tailwindcss.com/docs/translate
         */
        "translate-y": [{
          "translate-y": [translate]
        }],
        /**
         * Skew X
         * @see https://tailwindcss.com/docs/skew
         */
        "skew-x": [{
          "skew-x": [skew]
        }],
        /**
         * Skew Y
         * @see https://tailwindcss.com/docs/skew
         */
        "skew-y": [{
          "skew-y": [skew]
        }],
        /**
         * Transform Origin
         * @see https://tailwindcss.com/docs/transform-origin
         */
        "transform-origin": [{
          origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", isArbitraryValue]
        }],
        // Interactivity
        /**
         * Accent Color
         * @see https://tailwindcss.com/docs/accent-color
         */
        accent: [{
          accent: ["auto", colors]
        }],
        /**
         * Appearance
         * @see https://tailwindcss.com/docs/appearance
         */
        appearance: ["appearance-none"],
        /**
         * Cursor
         * @see https://tailwindcss.com/docs/cursor
         */
        cursor: [{
          cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", isArbitraryValue]
        }],
        /**
         * Caret Color
         * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
         */
        "caret-color": [{
          caret: [colors]
        }],
        /**
         * Pointer Events
         * @see https://tailwindcss.com/docs/pointer-events
         */
        "pointer-events": [{
          "pointer-events": ["none", "auto"]
        }],
        /**
         * Resize
         * @see https://tailwindcss.com/docs/resize
         */
        resize: [{
          resize: ["none", "y", "x", ""]
        }],
        /**
         * Scroll Behavior
         * @see https://tailwindcss.com/docs/scroll-behavior
         */
        "scroll-behavior": [{
          scroll: ["auto", "smooth"]
        }],
        /**
         * Scroll Margin
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-m": [{
          "scroll-m": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Margin X
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-mx": [{
          "scroll-mx": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Margin Y
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-my": [{
          "scroll-my": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Margin Start
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-ms": [{
          "scroll-ms": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Margin End
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-me": [{
          "scroll-me": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Margin Top
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-mt": [{
          "scroll-mt": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Margin Right
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-mr": [{
          "scroll-mr": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Margin Bottom
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-mb": [{
          "scroll-mb": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Margin Left
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-ml": [{
          "scroll-ml": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Padding
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-p": [{
          "scroll-p": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Padding X
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-px": [{
          "scroll-px": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Padding Y
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-py": [{
          "scroll-py": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Padding Start
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-ps": [{
          "scroll-ps": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Padding End
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pe": [{
          "scroll-pe": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Padding Top
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pt": [{
          "scroll-pt": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Padding Right
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pr": [{
          "scroll-pr": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Padding Bottom
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pb": [{
          "scroll-pb": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Padding Left
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pl": [{
          "scroll-pl": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Snap Align
         * @see https://tailwindcss.com/docs/scroll-snap-align
         */
        "snap-align": [{
          snap: ["start", "end", "center", "align-none"]
        }],
        /**
         * Scroll Snap Stop
         * @see https://tailwindcss.com/docs/scroll-snap-stop
         */
        "snap-stop": [{
          snap: ["normal", "always"]
        }],
        /**
         * Scroll Snap Type
         * @see https://tailwindcss.com/docs/scroll-snap-type
         */
        "snap-type": [{
          snap: ["none", "x", "y", "both"]
        }],
        /**
         * Scroll Snap Type Strictness
         * @see https://tailwindcss.com/docs/scroll-snap-type
         */
        "snap-strictness": [{
          snap: ["mandatory", "proximity"]
        }],
        /**
         * Touch Action
         * @see https://tailwindcss.com/docs/touch-action
         */
        touch: [{
          touch: ["auto", "none", "pinch-zoom", "manipulation", {
            pan: ["x", "left", "right", "y", "up", "down"]
          }]
        }],
        /**
         * User Select
         * @see https://tailwindcss.com/docs/user-select
         */
        select: [{
          select: ["none", "text", "all", "auto"]
        }],
        /**
         * Will Change
         * @see https://tailwindcss.com/docs/will-change
         */
        "will-change": [{
          "will-change": ["auto", "scroll", "contents", "transform", isArbitraryValue]
        }],
        // SVG
        /**
         * Fill
         * @see https://tailwindcss.com/docs/fill
         */
        fill: [{
          fill: [colors, "none"]
        }],
        /**
         * Stroke Width
         * @see https://tailwindcss.com/docs/stroke-width
         */
        "stroke-w": [{
          stroke: [isLength, isArbitraryNumber]
        }],
        /**
         * Stroke
         * @see https://tailwindcss.com/docs/stroke
         */
        stroke: [{
          stroke: [colors, "none"]
        }],
        // Accessibility
        /**
         * Screen Readers
         * @see https://tailwindcss.com/docs/screen-readers
         */
        sr: ["sr-only", "not-sr-only"]
      },
      conflictingClassGroups: {
        overflow: ["overflow-x", "overflow-y"],
        overscroll: ["overscroll-x", "overscroll-y"],
        inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
        "inset-x": ["right", "left"],
        "inset-y": ["top", "bottom"],
        flex: ["basis", "grow", "shrink"],
        gap: ["gap-x", "gap-y"],
        p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
        px: ["pr", "pl"],
        py: ["pt", "pb"],
        m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
        mx: ["mr", "ml"],
        my: ["mt", "mb"],
        "font-size": ["leading"],
        "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
        "fvn-ordinal": ["fvn-normal"],
        "fvn-slashed-zero": ["fvn-normal"],
        "fvn-figure": ["fvn-normal"],
        "fvn-spacing": ["fvn-normal"],
        "fvn-fraction": ["fvn-normal"],
        rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
        "rounded-s": ["rounded-ss", "rounded-es"],
        "rounded-e": ["rounded-se", "rounded-ee"],
        "rounded-t": ["rounded-tl", "rounded-tr"],
        "rounded-r": ["rounded-tr", "rounded-br"],
        "rounded-b": ["rounded-br", "rounded-bl"],
        "rounded-l": ["rounded-tl", "rounded-bl"],
        "border-spacing": ["border-spacing-x", "border-spacing-y"],
        "border-w": ["border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
        "border-w-x": ["border-w-r", "border-w-l"],
        "border-w-y": ["border-w-t", "border-w-b"],
        "border-color": ["border-color-t", "border-color-r", "border-color-b", "border-color-l"],
        "border-color-x": ["border-color-r", "border-color-l"],
        "border-color-y": ["border-color-t", "border-color-b"],
        "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
        "scroll-mx": ["scroll-mr", "scroll-ml"],
        "scroll-my": ["scroll-mt", "scroll-mb"],
        "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
        "scroll-px": ["scroll-pr", "scroll-pl"],
        "scroll-py": ["scroll-pt", "scroll-pb"]
      },
      conflictingClassGroupModifiers: {
        "font-size": ["leading"]
      }
    };
  }
  var twMerge = /* @__PURE__ */ createTailwindMerge(getDefaultConfig);
  function create_dynamic_element$3(ctx) {
    let svelte_element;
    let use_action;
    let svelte_element_transition;
    let current;
    let mounted;
    let dispose;
    const default_slot_template = (
      /*#slots*/
      ctx[14].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[13],
      null
    );
    let svelte_element_levels = [
      /*$$restProps*/
      ctx[8],
      { class: (
        /*divClass*/
        ctx[7]
      ) },
      { role: (
        /*role*/
        ctx[6]
      ) }
    ];
    let svelte_element_data = {};
    for (let i = 0; i < svelte_element_levels.length; i += 1) {
      svelte_element_data = assign(svelte_element_data, svelte_element_levels[i]);
    }
    return {
      c() {
        svelte_element = element(
          /*tag*/
          ctx[1]
        );
        if (default_slot)
          default_slot.c();
        set_dynamic_element_data(
          /*tag*/
          ctx[1]
        )(svelte_element, svelte_element_data);
      },
      m(target, anchor) {
        insert(target, svelte_element, anchor);
        if (default_slot) {
          default_slot.m(svelte_element, null);
        }
        ctx[20](svelte_element);
        current = true;
        if (!mounted) {
          dispose = [
            action_destroyer(use_action = /*use*/
            ctx[4].call(
              null,
              svelte_element,
              /*options*/
              ctx[5]
            )),
            listen(
              svelte_element,
              "click",
              /*click_handler*/
              ctx[15]
            ),
            listen(
              svelte_element,
              "mouseenter",
              /*mouseenter_handler*/
              ctx[16]
            ),
            listen(
              svelte_element,
              "mouseleave",
              /*mouseleave_handler*/
              ctx[17]
            ),
            listen(
              svelte_element,
              "focusin",
              /*focusin_handler*/
              ctx[18]
            ),
            listen(
              svelte_element,
              "focusout",
              /*focusout_handler*/
              ctx[19]
            )
          ];
          mounted = true;
        }
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          8192)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx,
              /*$$scope*/
              ctx[13],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx[13]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx[13],
                dirty,
                null
              ),
              null
            );
          }
        }
        set_dynamic_element_data(
          /*tag*/
          ctx[1]
        )(svelte_element, svelte_element_data = get_spread_update(svelte_element_levels, [
          dirty & /*$$restProps*/
          256 && /*$$restProps*/
          ctx[8],
          (!current || dirty & /*divClass*/
          128) && { class: (
            /*divClass*/
            ctx[7]
          ) },
          (!current || dirty & /*role*/
          64) && { role: (
            /*role*/
            ctx[6]
          ) }
        ]));
        if (use_action && is_function(use_action.update) && dirty & /*options*/
        32)
          use_action.update.call(
            null,
            /*options*/
            ctx[5]
          );
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        if (local) {
          add_render_callback(() => {
            if (!current)
              return;
            if (!svelte_element_transition)
              svelte_element_transition = create_bidirectional_transition(
                svelte_element,
                /*transition*/
                ctx[2],
                /*params*/
                ctx[3],
                true
              );
            svelte_element_transition.run(1);
          });
        }
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        if (local) {
          if (!svelte_element_transition)
            svelte_element_transition = create_bidirectional_transition(
              svelte_element,
              /*transition*/
              ctx[2],
              /*params*/
              ctx[3],
              false
            );
          svelte_element_transition.run(0);
        }
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(svelte_element);
        }
        if (default_slot)
          default_slot.d(detaching);
        ctx[20](null);
        if (detaching && svelte_element_transition)
          svelte_element_transition.end();
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_fragment$k(ctx) {
    let previous_tag = (
      /*tag*/
      ctx[1]
    );
    let svelte_element_anchor;
    let tag_will_be_removed = false;
    let current;
    let svelte_element = (
      /*tag*/
      ctx[1] && create_dynamic_element$3(ctx)
    );
    return {
      c() {
        if (svelte_element)
          svelte_element.c();
        svelte_element_anchor = empty();
      },
      m(target, anchor) {
        if (svelte_element)
          svelte_element.m(target, anchor);
        insert(target, svelte_element_anchor, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        if (
          /*tag*/
          ctx2[1]
        ) {
          if (!previous_tag) {
            svelte_element = create_dynamic_element$3(ctx2);
            previous_tag = /*tag*/
            ctx2[1];
            svelte_element.c();
            transition_in(svelte_element);
            svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
          } else if (safe_not_equal(
            previous_tag,
            /*tag*/
            ctx2[1]
          )) {
            svelte_element.d(1);
            svelte_element = create_dynamic_element$3(ctx2);
            previous_tag = /*tag*/
            ctx2[1];
            svelte_element.c();
            if (tag_will_be_removed) {
              tag_will_be_removed = false;
              transition_in(svelte_element);
            }
            svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
          } else {
            if (tag_will_be_removed) {
              tag_will_be_removed = false;
              transition_in(svelte_element);
            }
            svelte_element.p(ctx2, dirty);
          }
        } else if (previous_tag) {
          tag_will_be_removed = true;
          group_outros();
          transition_out(svelte_element, 1, 1, () => {
            svelte_element = null;
            previous_tag = /*tag*/
            ctx2[1];
            tag_will_be_removed = false;
          });
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(svelte_element, local);
        current = true;
      },
      o(local) {
        transition_out(svelte_element, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(svelte_element_anchor);
        }
        if (svelte_element)
          svelte_element.d(detaching);
      }
    };
  }
  function instance$k($$self, $$props, $$invalidate) {
    const omit_props_names = [
      "tag",
      "color",
      "rounded",
      "border",
      "shadow",
      "transition",
      "params",
      "node",
      "use",
      "options",
      "role"
    ];
    let $$restProps = compute_rest_props($$props, omit_props_names);
    let { $$slots: slots = {}, $$scope } = $$props;
    const null_transition2 = () => ({ duration: 0 });
    const noop2 = () => {
    };
    setContext("background", true);
    let { tag = $$restProps.href ? "a" : "div" } = $$props;
    let { color = "default" } = $$props;
    let { rounded = false } = $$props;
    let { border = false } = $$props;
    let { shadow = false } = $$props;
    let { transition = null_transition2 } = $$props;
    let { params = {} } = $$props;
    let { node = void 0 } = $$props;
    let { use = noop2 } = $$props;
    let { options = {} } = $$props;
    let { role = void 0 } = $$props;
    const bgColors = {
      gray: "bg-gray-50 dark:bg-gray-800",
      red: "bg-red-50 dark:bg-gray-800",
      yellow: "bg-yellow-50 dark:bg-gray-800 ",
      green: "bg-green-50 dark:bg-gray-800 ",
      indigo: "bg-indigo-50 dark:bg-gray-800 ",
      purple: "bg-purple-50 dark:bg-gray-800 ",
      pink: "bg-pink-50 dark:bg-gray-800 ",
      blue: "bg-blue-50 dark:bg-gray-800 ",
      light: "bg-gray-50 dark:bg-gray-700",
      dark: "bg-gray-50 dark:bg-gray-800",
      default: "bg-white dark:bg-gray-800",
      dropdown: "bg-white dark:bg-gray-700",
      navbar: "bg-white dark:bg-gray-900",
      navbarUl: "bg-gray-50 dark:bg-gray-800",
      form: "bg-gray-50 dark:bg-gray-700",
      primary: "bg-primary-50 dark:bg-gray-800 ",
      orange: "bg-orange-50 dark:bg-orange-800",
      none: ""
    };
    const textColors = {
      gray: "text-gray-800 dark:text-gray-300",
      red: "text-red-800 dark:text-red-400",
      yellow: "text-yellow-800 dark:text-yellow-300",
      green: "text-green-800 dark:text-green-400",
      indigo: "text-indigo-800 dark:text-indigo-400",
      purple: "text-purple-800 dark:text-purple-400",
      pink: "text-pink-800 dark:text-pink-400",
      blue: "text-blue-800 dark:text-blue-400",
      light: "text-gray-700 dark:text-gray-300",
      dark: "text-gray-700 dark:text-gray-300",
      default: "text-gray-500 dark:text-gray-400",
      dropdown: "text-gray-700 dark:text-gray-200",
      navbar: "text-gray-700 dark:text-gray-200",
      navbarUl: "text-gray-700 dark:text-gray-400",
      form: "text-gray-900 dark:text-white",
      primary: "text-primary-800 dark:text-primary-400",
      orange: "text-orange-800 dark:text-orange-400",
      none: ""
    };
    const borderColors = {
      gray: "border-gray-300 dark:border-gray-800 divide-gray-300 dark:divide-gray-800",
      red: "border-red-300 dark:border-red-800 divide-red-300 dark:divide-red-800",
      yellow: "border-yellow-300 dark:border-yellow-800 divide-yellow-300 dark:divide-yellow-800",
      green: "border-green-300 dark:border-green-800 divide-green-300 dark:divide-green-800",
      indigo: "border-indigo-300 dark:border-indigo-800 divide-indigo-300 dark:divide-indigo-800",
      purple: "border-purple-300 dark:border-purple-800 divide-purple-300 dark:divide-purple-800",
      pink: "border-pink-300 dark:border-pink-800 divide-pink-300 dark:divide-pink-800",
      blue: "border-blue-300 dark:border-blue-800 divide-blue-300 dark:divide-blue-800",
      light: "border-gray-500 divide-gray-500",
      dark: "border-gray-500 divide-gray-500",
      default: "border-gray-200 dark:border-gray-700 divide-gray-200 dark:divide-gray-700",
      dropdown: "border-gray-100 dark:border-gray-600 divide-gray-100 dark:divide-gray-600",
      navbar: "border-gray-100 dark:border-gray-700 divide-gray-100 dark:divide-gray-700",
      navbarUl: "border-gray-100 dark:border-gray-700 divide-gray-100 dark:divide-gray-700",
      form: "border-gray-300 dark:border-gray-700 divide-gray-300 dark:divide-gray-700",
      primary: "border-primary-500 dark:border-primary-200  divide-primary-500 dark:divide-primary-200 ",
      orange: "border-orange-300 dark:border-orange-800 divide-orange-300 dark:divide-orange-800",
      none: ""
    };
    let divClass;
    function click_handler(event) {
      bubble.call(this, $$self, event);
    }
    function mouseenter_handler(event) {
      bubble.call(this, $$self, event);
    }
    function mouseleave_handler(event) {
      bubble.call(this, $$self, event);
    }
    function focusin_handler(event) {
      bubble.call(this, $$self, event);
    }
    function focusout_handler(event) {
      bubble.call(this, $$self, event);
    }
    function svelte_element_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        node = $$value;
        $$invalidate(0, node);
      });
    }
    $$self.$$set = ($$new_props) => {
      $$invalidate(26, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      $$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
      if ("tag" in $$new_props)
        $$invalidate(1, tag = $$new_props.tag);
      if ("color" in $$new_props)
        $$invalidate(9, color = $$new_props.color);
      if ("rounded" in $$new_props)
        $$invalidate(10, rounded = $$new_props.rounded);
      if ("border" in $$new_props)
        $$invalidate(11, border = $$new_props.border);
      if ("shadow" in $$new_props)
        $$invalidate(12, shadow = $$new_props.shadow);
      if ("transition" in $$new_props)
        $$invalidate(2, transition = $$new_props.transition);
      if ("params" in $$new_props)
        $$invalidate(3, params = $$new_props.params);
      if ("node" in $$new_props)
        $$invalidate(0, node = $$new_props.node);
      if ("use" in $$new_props)
        $$invalidate(4, use = $$new_props.use);
      if ("options" in $$new_props)
        $$invalidate(5, options = $$new_props.options);
      if ("role" in $$new_props)
        $$invalidate(6, role = $$new_props.role);
      if ("$$scope" in $$new_props)
        $$invalidate(13, $$scope = $$new_props.$$scope);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*color*/
      512) {
        $$invalidate(9, color = color ?? "default");
      }
      if ($$self.$$.dirty & /*color*/
      512) {
        setContext("color", color);
      }
      $$invalidate(7, divClass = twMerge(bgColors[color], textColors[color], rounded && "rounded-lg", border && "border", borderColors[color], shadow && "shadow-md", $$props.class));
    };
    $$props = exclude_internal_props($$props);
    return [
      node,
      tag,
      transition,
      params,
      use,
      options,
      role,
      divClass,
      $$restProps,
      color,
      rounded,
      border,
      shadow,
      $$scope,
      slots,
      click_handler,
      mouseenter_handler,
      mouseleave_handler,
      focusin_handler,
      focusout_handler,
      svelte_element_binding
    ];
  }
  class Frame extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$k, create_fragment$k, safe_not_equal, {
        tag: 1,
        color: 9,
        rounded: 10,
        border: 11,
        shadow: 12,
        transition: 2,
        params: 3,
        node: 0,
        use: 4,
        options: 5,
        role: 6
      });
    }
  }
  const get_default_slot_changes_1 = (dirty) => ({ svgSize: dirty & /*size*/
  4 });
  const get_default_slot_context_1 = (ctx) => ({
    svgSize: (
      /*svgSizes*/
      ctx[5][
        /*size*/
        ctx[2]
      ]
    )
  });
  const get_default_slot_changes$2 = (dirty) => ({ svgSize: dirty & /*size*/
  4 });
  const get_default_slot_context$2 = (ctx) => ({
    svgSize: (
      /*svgSizes*/
      ctx[5][
        /*size*/
        ctx[2]
      ]
    )
  });
  function create_else_block$3(ctx) {
    let button;
    let t;
    let button_aria_label_value;
    let current;
    let mounted;
    let dispose;
    let if_block = (
      /*name*/
      ctx[0] && create_if_block_2$1(ctx)
    );
    const default_slot_template = (
      /*#slots*/
      ctx[9].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[8],
      get_default_slot_context_1
    );
    let button_levels = [
      { type: "button" },
      /*$$restProps*/
      ctx[6],
      { class: (
        /*buttonClass*/
        ctx[4]
      ) },
      {
        "aria-label": button_aria_label_value = /*ariaLabel*/
        ctx[1] ?? /*name*/
        ctx[0]
      }
    ];
    let button_data = {};
    for (let i = 0; i < button_levels.length; i += 1) {
      button_data = assign(button_data, button_levels[i]);
    }
    return {
      c() {
        button = element("button");
        if (if_block)
          if_block.c();
        t = space();
        if (default_slot)
          default_slot.c();
        set_attributes(button, button_data);
      },
      m(target, anchor) {
        insert(target, button, anchor);
        if (if_block)
          if_block.m(button, null);
        append(button, t);
        if (default_slot) {
          default_slot.m(button, null);
        }
        if (button.autofocus)
          button.focus();
        current = true;
        if (!mounted) {
          dispose = listen(
            button,
            "click",
            /*click_handler*/
            ctx[10]
          );
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (
          /*name*/
          ctx2[0]
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
          } else {
            if_block = create_if_block_2$1(ctx2);
            if_block.c();
            if_block.m(button, t);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope, size*/
          260)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[8],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[8]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[8],
                dirty,
                get_default_slot_changes_1
              ),
              get_default_slot_context_1
            );
          }
        }
        set_attributes(button, button_data = get_spread_update(button_levels, [
          { type: "button" },
          dirty & /*$$restProps*/
          64 && /*$$restProps*/
          ctx2[6],
          (!current || dirty & /*buttonClass*/
          16) && { class: (
            /*buttonClass*/
            ctx2[4]
          ) },
          (!current || dirty & /*ariaLabel, name*/
          3 && button_aria_label_value !== (button_aria_label_value = /*ariaLabel*/
          ctx2[1] ?? /*name*/
          ctx2[0])) && { "aria-label": button_aria_label_value }
        ]));
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(button);
        }
        if (if_block)
          if_block.d();
        if (default_slot)
          default_slot.d(detaching);
        mounted = false;
        dispose();
      }
    };
  }
  function create_if_block$8(ctx) {
    let a;
    let t;
    let a_aria_label_value;
    let current;
    let if_block = (
      /*name*/
      ctx[0] && create_if_block_1$2(ctx)
    );
    const default_slot_template = (
      /*#slots*/
      ctx[9].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[8],
      get_default_slot_context$2
    );
    let a_levels = [
      { href: (
        /*href*/
        ctx[3]
      ) },
      /*$$restProps*/
      ctx[6],
      { class: (
        /*buttonClass*/
        ctx[4]
      ) },
      {
        "aria-label": a_aria_label_value = /*ariaLabel*/
        ctx[1] ?? /*name*/
        ctx[0]
      }
    ];
    let a_data = {};
    for (let i = 0; i < a_levels.length; i += 1) {
      a_data = assign(a_data, a_levels[i]);
    }
    return {
      c() {
        a = element("a");
        if (if_block)
          if_block.c();
        t = space();
        if (default_slot)
          default_slot.c();
        set_attributes(a, a_data);
      },
      m(target, anchor) {
        insert(target, a, anchor);
        if (if_block)
          if_block.m(a, null);
        append(a, t);
        if (default_slot) {
          default_slot.m(a, null);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (
          /*name*/
          ctx2[0]
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
          } else {
            if_block = create_if_block_1$2(ctx2);
            if_block.c();
            if_block.m(a, t);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope, size*/
          260)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[8],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[8]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[8],
                dirty,
                get_default_slot_changes$2
              ),
              get_default_slot_context$2
            );
          }
        }
        set_attributes(a, a_data = get_spread_update(a_levels, [
          (!current || dirty & /*href*/
          8) && { href: (
            /*href*/
            ctx2[3]
          ) },
          dirty & /*$$restProps*/
          64 && /*$$restProps*/
          ctx2[6],
          (!current || dirty & /*buttonClass*/
          16) && { class: (
            /*buttonClass*/
            ctx2[4]
          ) },
          (!current || dirty & /*ariaLabel, name*/
          3 && a_aria_label_value !== (a_aria_label_value = /*ariaLabel*/
          ctx2[1] ?? /*name*/
          ctx2[0])) && { "aria-label": a_aria_label_value }
        ]));
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(a);
        }
        if (if_block)
          if_block.d();
        if (default_slot)
          default_slot.d(detaching);
      }
    };
  }
  function create_if_block_2$1(ctx) {
    let span;
    let t;
    return {
      c() {
        span = element("span");
        t = text(
          /*name*/
          ctx[0]
        );
        attr(span, "class", "sr-only");
      },
      m(target, anchor) {
        insert(target, span, anchor);
        append(span, t);
      },
      p(ctx2, dirty) {
        if (dirty & /*name*/
        1)
          set_data(
            t,
            /*name*/
            ctx2[0]
          );
      },
      d(detaching) {
        if (detaching) {
          detach(span);
        }
      }
    };
  }
  function create_if_block_1$2(ctx) {
    let span;
    let t;
    return {
      c() {
        span = element("span");
        t = text(
          /*name*/
          ctx[0]
        );
        attr(span, "class", "sr-only");
      },
      m(target, anchor) {
        insert(target, span, anchor);
        append(span, t);
      },
      p(ctx2, dirty) {
        if (dirty & /*name*/
        1)
          set_data(
            t,
            /*name*/
            ctx2[0]
          );
      },
      d(detaching) {
        if (detaching) {
          detach(span);
        }
      }
    };
  }
  function create_fragment$j(ctx) {
    let current_block_type_index;
    let if_block;
    let if_block_anchor;
    let current;
    const if_block_creators = [create_if_block$8, create_else_block$3];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      if (
        /*href*/
        ctx2[3]
      )
        return 0;
      return 1;
    }
    current_block_type_index = select_block_type(ctx);
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    return {
      c() {
        if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if_blocks[current_block_type_index].m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if_blocks[current_block_type_index].d(detaching);
      }
    };
  }
  function instance$j($$self, $$props, $$invalidate) {
    const omit_props_names = ["color", "name", "ariaLabel", "size", "href"];
    let $$restProps = compute_rest_props($$props, omit_props_names);
    let { $$slots: slots = {}, $$scope } = $$props;
    const background = getContext("background");
    let { color = "default" } = $$props;
    let { name = void 0 } = $$props;
    let { ariaLabel = void 0 } = $$props;
    let { size = "md" } = $$props;
    let { href = void 0 } = $$props;
    const colors = {
      dark: "text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600",
      gray: "text-gray-500 focus:ring-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 dark:hover:text-gray-300",
      red: "text-red-500 focus:ring-red-400 hover:bg-red-200 dark:hover:bg-red-800 dark:hover:text-red-300",
      yellow: "text-yellow-500 focus:ring-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-800 dark:hover:text-yellow-300",
      green: "text-green-500 focus:ring-green-400 hover:bg-green-200 dark:hover:bg-green-800 dark:hover:text-green-300",
      indigo: "text-indigo-500 focus:ring-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800 dark:hover:text-indigo-300",
      purple: "text-purple-500 focus:ring-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800 dark:hover:text-purple-300",
      pink: "text-pink-500 focus:ring-pink-400 hover:bg-pink-200 dark:hover:bg-pink-800 dark:hover:text-pink-300",
      blue: "text-blue-500 focus:ring-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 dark:hover:text-blue-300",
      primary: "text-primary-500 focus:ring-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800 dark:hover:text-primary-300",
      default: "focus:ring-gray-400"
    };
    const sizing = {
      xs: "m-0.5 rounded-sm focus:ring-1 p-0.5",
      sm: "m-0.5 rounded focus:ring-1 p-0.5",
      md: "m-0.5 rounded-lg focus:ring-2 p-1.5",
      lg: "m-0.5 rounded-lg focus:ring-2 p-2.5"
    };
    let buttonClass;
    const svgSizes = {
      xs: "w-3 h-3",
      sm: "w-3.5 h-3.5",
      md: "w-5 h-5",
      lg: "w-5 h-5"
    };
    function click_handler(event) {
      bubble.call(this, $$self, event);
    }
    $$self.$$set = ($$new_props) => {
      $$invalidate(14, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      $$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
      if ("color" in $$new_props)
        $$invalidate(7, color = $$new_props.color);
      if ("name" in $$new_props)
        $$invalidate(0, name = $$new_props.name);
      if ("ariaLabel" in $$new_props)
        $$invalidate(1, ariaLabel = $$new_props.ariaLabel);
      if ("size" in $$new_props)
        $$invalidate(2, size = $$new_props.size);
      if ("href" in $$new_props)
        $$invalidate(3, href = $$new_props.href);
      if ("$$scope" in $$new_props)
        $$invalidate(8, $$scope = $$new_props.$$scope);
    };
    $$self.$$.update = () => {
      $$invalidate(4, buttonClass = twMerge(
        "focus:outline-none whitespace-normal",
        sizing[size],
        colors[color],
        color === "default" && (background ? "hover:bg-gray-100 dark:hover:bg-gray-600" : "hover:bg-gray-100 dark:hover:bg-gray-700"),
        $$props.class
      ));
    };
    $$props = exclude_internal_props($$props);
    return [
      name,
      ariaLabel,
      size,
      href,
      buttonClass,
      svgSizes,
      $$restProps,
      color,
      $$scope,
      slots,
      click_handler
    ];
  }
  class ToolbarButton extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$j, create_fragment$j, safe_not_equal, {
        color: 7,
        name: 0,
        ariaLabel: 1,
        size: 2,
        href: 3
      });
    }
  }
  function create_default_slot$6(ctx) {
    let svg;
    let path;
    let svg_class_value;
    return {
      c() {
        svg = svg_element("svg");
        path = svg_element("path");
        attr(path, "fill-rule", "evenodd");
        attr(path, "d", "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z");
        attr(path, "clip-rule", "evenodd");
        attr(svg, "class", svg_class_value = /*svgSize*/
        ctx[4]);
        attr(svg, "fill", "currentColor");
        attr(svg, "viewBox", "0 0 20 20");
        attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      },
      m(target, anchor) {
        insert(target, svg, anchor);
        append(svg, path);
      },
      p(ctx2, dirty) {
        if (dirty & /*svgSize*/
        16 && svg_class_value !== (svg_class_value = /*svgSize*/
        ctx2[4])) {
          attr(svg, "class", svg_class_value);
        }
      },
      d(detaching) {
        if (detaching) {
          detach(svg);
        }
      }
    };
  }
  function create_fragment$i(ctx) {
    let toolbarbutton;
    let current;
    const toolbarbutton_spread_levels = [
      { name: (
        /*name*/
        ctx[0]
      ) },
      /*$$restProps*/
      ctx[1],
      {
        class: twMerge(
          "ml-auto",
          /*$$props*/
          ctx[2].class
        )
      }
    ];
    let toolbarbutton_props = {
      $$slots: {
        default: [
          create_default_slot$6,
          ({ svgSize }) => ({ 4: svgSize }),
          ({ svgSize }) => svgSize ? 16 : 0
        ]
      },
      $$scope: { ctx }
    };
    for (let i = 0; i < toolbarbutton_spread_levels.length; i += 1) {
      toolbarbutton_props = assign(toolbarbutton_props, toolbarbutton_spread_levels[i]);
    }
    toolbarbutton = new ToolbarButton({ props: toolbarbutton_props });
    toolbarbutton.$on(
      "click",
      /*click_handler*/
      ctx[3]
    );
    return {
      c() {
        create_component(toolbarbutton.$$.fragment);
      },
      m(target, anchor) {
        mount_component(toolbarbutton, target, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        const toolbarbutton_changes = dirty & /*name, $$restProps, $$props*/
        7 ? get_spread_update(toolbarbutton_spread_levels, [
          dirty & /*name*/
          1 && { name: (
            /*name*/
            ctx2[0]
          ) },
          dirty & /*$$restProps*/
          2 && get_spread_object(
            /*$$restProps*/
            ctx2[1]
          ),
          dirty & /*$$props*/
          4 && {
            class: twMerge(
              "ml-auto",
              /*$$props*/
              ctx2[2].class
            )
          }
        ]) : {};
        if (dirty & /*$$scope, svgSize*/
        48) {
          toolbarbutton_changes.$$scope = { dirty, ctx: ctx2 };
        }
        toolbarbutton.$set(toolbarbutton_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(toolbarbutton.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(toolbarbutton.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(toolbarbutton, detaching);
      }
    };
  }
  function instance$i($$self, $$props, $$invalidate) {
    const omit_props_names = ["name"];
    let $$restProps = compute_rest_props($$props, omit_props_names);
    let { name = "Close" } = $$props;
    function click_handler(event) {
      bubble.call(this, $$self, event);
    }
    $$self.$$set = ($$new_props) => {
      $$invalidate(2, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      $$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
      if ("name" in $$new_props)
        $$invalidate(0, name = $$new_props.name);
    };
    $$props = exclude_internal_props($$props);
    return [name, $$restProps, $$props, click_handler];
  }
  class CloseButton extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$i, create_fragment$i, safe_not_equal, { name: 0 });
    }
  }
  function create_dynamic_element$2(ctx) {
    let svelte_element;
    let svelte_element_type_value;
    let svelte_element_role_value;
    let current;
    let mounted;
    let dispose;
    const default_slot_template = (
      /*#slots*/
      ctx[10].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[9],
      null
    );
    let svelte_element_levels = [
      {
        type: svelte_element_type_value = /*href*/
        ctx[0] ? void 0 : (
          /*type*/
          ctx[1]
        )
      },
      { href: (
        /*href*/
        ctx[0]
      ) },
      {
        role: svelte_element_role_value = /*href*/
        ctx[0] ? "link" : "button"
      },
      /*$$restProps*/
      ctx[3],
      { class: (
        /*buttonClass*/
        ctx[2]
      ) }
    ];
    let svelte_element_data = {};
    for (let i = 0; i < svelte_element_levels.length; i += 1) {
      svelte_element_data = assign(svelte_element_data, svelte_element_levels[i]);
    }
    return {
      c() {
        svelte_element = element(
          /*href*/
          ctx[0] ? "a" : "button"
        );
        if (default_slot)
          default_slot.c();
        set_dynamic_element_data(
          /*href*/
          ctx[0] ? "a" : "button"
        )(svelte_element, svelte_element_data);
      },
      m(target, anchor) {
        insert(target, svelte_element, anchor);
        if (default_slot) {
          default_slot.m(svelte_element, null);
        }
        current = true;
        if (!mounted) {
          dispose = [
            listen(
              svelte_element,
              "click",
              /*click_handler*/
              ctx[11]
            ),
            listen(
              svelte_element,
              "change",
              /*change_handler*/
              ctx[12]
            ),
            listen(
              svelte_element,
              "keydown",
              /*keydown_handler*/
              ctx[13]
            ),
            listen(
              svelte_element,
              "keyup",
              /*keyup_handler*/
              ctx[14]
            ),
            listen(
              svelte_element,
              "touchstart",
              /*touchstart_handler*/
              ctx[15]
            ),
            listen(
              svelte_element,
              "touchend",
              /*touchend_handler*/
              ctx[16]
            ),
            listen(
              svelte_element,
              "touchcancel",
              /*touchcancel_handler*/
              ctx[17]
            ),
            listen(
              svelte_element,
              "mouseenter",
              /*mouseenter_handler*/
              ctx[18]
            ),
            listen(
              svelte_element,
              "mouseleave",
              /*mouseleave_handler*/
              ctx[19]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          512)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[9],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[9]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[9],
                dirty,
                null
              ),
              null
            );
          }
        }
        set_dynamic_element_data(
          /*href*/
          ctx2[0] ? "a" : "button"
        )(svelte_element, svelte_element_data = get_spread_update(svelte_element_levels, [
          (!current || dirty & /*href, type*/
          3 && svelte_element_type_value !== (svelte_element_type_value = /*href*/
          ctx2[0] ? void 0 : (
            /*type*/
            ctx2[1]
          ))) && { type: svelte_element_type_value },
          (!current || dirty & /*href*/
          1) && { href: (
            /*href*/
            ctx2[0]
          ) },
          (!current || dirty & /*href*/
          1 && svelte_element_role_value !== (svelte_element_role_value = /*href*/
          ctx2[0] ? "link" : "button")) && { role: svelte_element_role_value },
          dirty & /*$$restProps*/
          8 && /*$$restProps*/
          ctx2[3],
          (!current || dirty & /*buttonClass*/
          4) && { class: (
            /*buttonClass*/
            ctx2[2]
          ) }
        ]));
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(svelte_element);
        }
        if (default_slot)
          default_slot.d(detaching);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_fragment$h(ctx) {
    let previous_tag = (
      /*href*/
      ctx[0] ? "a" : "button"
    );
    let svelte_element_anchor;
    let current;
    let svelte_element = (
      /*href*/
      (ctx[0] ? "a" : "button") && create_dynamic_element$2(ctx)
    );
    return {
      c() {
        if (svelte_element)
          svelte_element.c();
        svelte_element_anchor = empty();
      },
      m(target, anchor) {
        if (svelte_element)
          svelte_element.m(target, anchor);
        insert(target, svelte_element_anchor, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        if (
          /*href*/
          ctx2[0] ? "a" : "button"
        ) {
          if (!previous_tag) {
            svelte_element = create_dynamic_element$2(ctx2);
            previous_tag = /*href*/
            ctx2[0] ? "a" : "button";
            svelte_element.c();
            svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
          } else if (safe_not_equal(
            previous_tag,
            /*href*/
            ctx2[0] ? "a" : "button"
          )) {
            svelte_element.d(1);
            svelte_element = create_dynamic_element$2(ctx2);
            previous_tag = /*href*/
            ctx2[0] ? "a" : "button";
            svelte_element.c();
            svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
          } else {
            svelte_element.p(ctx2, dirty);
          }
        } else if (previous_tag) {
          svelte_element.d(1);
          svelte_element = null;
          previous_tag = /*href*/
          ctx2[0] ? "a" : "button";
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(svelte_element, local);
        current = true;
      },
      o(local) {
        transition_out(svelte_element, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(svelte_element_anchor);
        }
        if (svelte_element)
          svelte_element.d(detaching);
      }
    };
  }
  function instance$h($$self, $$props, $$invalidate) {
    const omit_props_names = ["pill", "outline", "size", "href", "type", "color", "shadow"];
    let $$restProps = compute_rest_props($$props, omit_props_names);
    let { $$slots: slots = {}, $$scope } = $$props;
    const group = getContext("group");
    let { pill = false } = $$props;
    let { outline = false } = $$props;
    let { size = group ? "sm" : "md" } = $$props;
    let { href = void 0 } = $$props;
    let { type = "button" } = $$props;
    let { color = group ? outline ? "dark" : "alternative" : "primary" } = $$props;
    let { shadow = false } = $$props;
    const colorClasses2 = {
      alternative: "text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 hover:text-primary-700 focus:text-primary-700 dark:focus:text-white dark:hover:text-white",
      blue: "text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700",
      dark: "text-white bg-gray-800 hover:bg-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700",
      green: "text-white bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700",
      light: "text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600",
      primary: "text-white bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700",
      purple: "text-white bg-purple-700 hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-700",
      red: "text-white bg-red-700 hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700",
      yellow: "text-white bg-yellow-400 hover:bg-yellow-500 ",
      none: ""
    };
    const coloredFocusClasses = {
      alternative: "focus:ring-gray-200 dark:focus:ring-gray-700",
      blue: "focus:ring-blue-300 dark:focus:ring-blue-800",
      dark: "focus:ring-gray-300 dark:focus:ring-gray-700",
      green: "focus:ring-green-300 dark:focus:ring-green-800",
      light: "focus:ring-gray-200 dark:focus:ring-gray-700",
      primary: "focus:ring-primary-300 dark:focus:ring-primary-800",
      purple: "focus:ring-purple-300 dark:focus:ring-purple-900",
      red: "focus:ring-red-300 dark:focus:ring-red-900",
      yellow: "focus:ring-yellow-300 dark:focus:ring-yellow-900",
      none: ""
    };
    const coloredShadowClasses = {
      alternative: "shadow-gray-500/50 dark:shadow-gray-800/80",
      blue: "shadow-blue-500/50 dark:shadow-blue-800/80",
      dark: "shadow-gray-500/50 dark:shadow-gray-800/80",
      green: "shadow-green-500/50 dark:shadow-green-800/80",
      light: "shadow-gray-500/50 dark:shadow-gray-800/80",
      primary: "shadow-primary-500/50 dark:shadow-primary-800/80",
      purple: "shadow-purple-500/50 dark:shadow-purple-800/80",
      red: "shadow-red-500/50 dark:shadow-red-800/80 ",
      yellow: "shadow-yellow-500/50 dark:shadow-yellow-800/80 ",
      none: ""
    };
    const outlineClasses = {
      alternative: "text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:bg-gray-900 focus:text-white focus:ring-gray-300 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800",
      blue: "text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600",
      dark: "text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:bg-gray-900 focus:text-white dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-600",
      green: "text-green-700 hover:text-white border border-green-700 hover:bg-green-800 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600",
      light: "text-gray-500 hover:text-gray-900 bg-white border border-gray-200 dark:border-gray-600 dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600",
      primary: "text-primary-700 hover:text-white border border-primary-700 hover:bg-primary-700 dark:border-primary-500 dark:text-primary-500 dark:hover:text-white dark:hover:bg-primary-600",
      purple: "text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500",
      red: "text-red-700 hover:text-white border border-red-700 hover:bg-red-800 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600",
      yellow: "text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400",
      none: ""
    };
    const sizeClasses = {
      xs: "px-3 py-2 text-xs",
      sm: "px-4 py-2 text-sm",
      md: "px-5 py-2.5 text-sm",
      lg: "px-5 py-3 text-base",
      xl: "px-6 py-3.5 text-base"
    };
    const hasBorder = () => outline || color === "alternative" || color === "light";
    let buttonClass;
    function click_handler(event) {
      bubble.call(this, $$self, event);
    }
    function change_handler(event) {
      bubble.call(this, $$self, event);
    }
    function keydown_handler(event) {
      bubble.call(this, $$self, event);
    }
    function keyup_handler(event) {
      bubble.call(this, $$self, event);
    }
    function touchstart_handler(event) {
      bubble.call(this, $$self, event);
    }
    function touchend_handler(event) {
      bubble.call(this, $$self, event);
    }
    function touchcancel_handler(event) {
      bubble.call(this, $$self, event);
    }
    function mouseenter_handler(event) {
      bubble.call(this, $$self, event);
    }
    function mouseleave_handler(event) {
      bubble.call(this, $$self, event);
    }
    $$self.$$set = ($$new_props) => {
      $$invalidate(27, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      $$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
      if ("pill" in $$new_props)
        $$invalidate(4, pill = $$new_props.pill);
      if ("outline" in $$new_props)
        $$invalidate(5, outline = $$new_props.outline);
      if ("size" in $$new_props)
        $$invalidate(6, size = $$new_props.size);
      if ("href" in $$new_props)
        $$invalidate(0, href = $$new_props.href);
      if ("type" in $$new_props)
        $$invalidate(1, type = $$new_props.type);
      if ("color" in $$new_props)
        $$invalidate(7, color = $$new_props.color);
      if ("shadow" in $$new_props)
        $$invalidate(8, shadow = $$new_props.shadow);
      if ("$$scope" in $$new_props)
        $$invalidate(9, $$scope = $$new_props.$$scope);
    };
    $$self.$$.update = () => {
      $$invalidate(2, buttonClass = twMerge(
        "text-center font-medium",
        group ? "focus:ring-2" : "focus:ring-4",
        group && "focus:z-10",
        group || "focus:outline-none",
        "inline-flex items-center justify-center " + sizeClasses[size],
        outline ? outlineClasses[color] : colorClasses2[color],
        color === "alternative" && (group ? "dark:bg-gray-700 dark:text-white dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-600" : "dark:bg-transparent dark:border-gray-600 dark:hover:border-gray-700"),
        outline && color === "dark" && (group ? "dark:text-white dark:border-white" : "dark:text-gray-400 dark:border-gray-700"),
        coloredFocusClasses[color],
        hasBorder() && group && "border-l-0 first:border-l",
        group ? pill && "first:rounded-l-full last:rounded-r-full" || "first:rounded-l-lg last:rounded-r-lg" : pill && "rounded-full" || "rounded-lg",
        shadow && "shadow-lg",
        shadow && coloredShadowClasses[color],
        $$props.disabled && "cursor-not-allowed opacity-50",
        $$props.class
      ));
    };
    $$props = exclude_internal_props($$props);
    return [
      href,
      type,
      buttonClass,
      $$restProps,
      pill,
      outline,
      size,
      color,
      shadow,
      $$scope,
      slots,
      click_handler,
      change_handler,
      keydown_handler,
      keyup_handler,
      touchstart_handler,
      touchend_handler,
      touchcancel_handler,
      mouseenter_handler,
      mouseleave_handler
    ];
  }
  class Button extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$h, create_fragment$h, safe_not_equal, {
        pill: 4,
        outline: 5,
        size: 6,
        href: 0,
        type: 1,
        color: 7,
        shadow: 8
      });
    }
  }
  function create_else_block$2(ctx) {
    let current;
    const default_slot_template = (
      /*#slots*/
      ctx[5].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[4],
      null
    );
    return {
      c() {
        if (default_slot)
          default_slot.c();
      },
      m(target, anchor) {
        if (default_slot) {
          default_slot.m(target, anchor);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          16)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[4],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[4]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[4],
                dirty,
                null
              ),
              null
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (default_slot)
          default_slot.d(detaching);
      }
    };
  }
  function create_if_block$7(ctx) {
    let previous_tag = (
      /*tag*/
      ctx[0]
    );
    let svelte_element_anchor;
    let current;
    let svelte_element = (
      /*tag*/
      ctx[0] && create_dynamic_element$1(ctx)
    );
    return {
      c() {
        if (svelte_element)
          svelte_element.c();
        svelte_element_anchor = empty();
      },
      m(target, anchor) {
        if (svelte_element)
          svelte_element.m(target, anchor);
        insert(target, svelte_element_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        if (
          /*tag*/
          ctx2[0]
        ) {
          if (!previous_tag) {
            svelte_element = create_dynamic_element$1(ctx2);
            previous_tag = /*tag*/
            ctx2[0];
            svelte_element.c();
            svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
          } else if (safe_not_equal(
            previous_tag,
            /*tag*/
            ctx2[0]
          )) {
            svelte_element.d(1);
            svelte_element = create_dynamic_element$1(ctx2);
            previous_tag = /*tag*/
            ctx2[0];
            svelte_element.c();
            svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
          } else {
            svelte_element.p(ctx2, dirty);
          }
        } else if (previous_tag) {
          svelte_element.d(1);
          svelte_element = null;
          previous_tag = /*tag*/
          ctx2[0];
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(svelte_element, local);
        current = true;
      },
      o(local) {
        transition_out(svelte_element, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(svelte_element_anchor);
        }
        if (svelte_element)
          svelte_element.d(detaching);
      }
    };
  }
  function create_dynamic_element$1(ctx) {
    let svelte_element;
    let current;
    let mounted;
    let dispose;
    const default_slot_template = (
      /*#slots*/
      ctx[5].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[4],
      null
    );
    let svelte_element_levels = [
      /*$$restProps*/
      ctx[3]
    ];
    let svelte_element_data = {};
    for (let i = 0; i < svelte_element_levels.length; i += 1) {
      svelte_element_data = assign(svelte_element_data, svelte_element_levels[i]);
    }
    return {
      c() {
        svelte_element = element(
          /*tag*/
          ctx[0]
        );
        if (default_slot)
          default_slot.c();
        set_dynamic_element_data(
          /*tag*/
          ctx[0]
        )(svelte_element, svelte_element_data);
      },
      m(target, anchor) {
        insert(target, svelte_element, anchor);
        if (default_slot) {
          default_slot.m(svelte_element, null);
        }
        current = true;
        if (!mounted) {
          dispose = action_destroyer(
            /*use*/
            ctx[2].call(null, svelte_element)
          );
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          16)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[4],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[4]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[4],
                dirty,
                null
              ),
              null
            );
          }
        }
        set_dynamic_element_data(
          /*tag*/
          ctx2[0]
        )(svelte_element, svelte_element_data = get_spread_update(svelte_element_levels, [dirty & /*$$restProps*/
        8 && /*$$restProps*/
        ctx2[3]]));
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(svelte_element);
        }
        if (default_slot)
          default_slot.d(detaching);
        mounted = false;
        dispose();
      }
    };
  }
  function create_fragment$g(ctx) {
    let current_block_type_index;
    let if_block;
    let if_block_anchor;
    let current;
    const if_block_creators = [create_if_block$7, create_else_block$2];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      if (
        /*show*/
        ctx2[1]
      )
        return 0;
      return 1;
    }
    current_block_type_index = select_block_type(ctx);
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    return {
      c() {
        if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if_blocks[current_block_type_index].m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if_blocks[current_block_type_index].d(detaching);
      }
    };
  }
  function instance$g($$self, $$props, $$invalidate) {
    const omit_props_names = ["tag", "show", "use"];
    let $$restProps = compute_rest_props($$props, omit_props_names);
    let { $$slots: slots = {}, $$scope } = $$props;
    let { tag = "div" } = $$props;
    let { show } = $$props;
    let { use = () => {
    } } = $$props;
    $$self.$$set = ($$new_props) => {
      $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
      $$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
      if ("tag" in $$new_props)
        $$invalidate(0, tag = $$new_props.tag);
      if ("show" in $$new_props)
        $$invalidate(1, show = $$new_props.show);
      if ("use" in $$new_props)
        $$invalidate(2, use = $$new_props.use);
      if ("$$scope" in $$new_props)
        $$invalidate(4, $$scope = $$new_props.$$scope);
    };
    return [tag, show, use, $$restProps, $$scope, slots];
  }
  class Wrapper extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$g, create_fragment$g, safe_not_equal, { tag: 0, show: 1, use: 2 });
    }
  }
  function create_else_block$1(ctx) {
    let current;
    const default_slot_template = (
      /*#slots*/
      ctx[7].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[6],
      null
    );
    return {
      c() {
        if (default_slot)
          default_slot.c();
      },
      m(target, anchor) {
        if (default_slot) {
          default_slot.m(target, anchor);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          64)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[6],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[6]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[6],
                dirty,
                null
              ),
              null
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (default_slot)
          default_slot.d(detaching);
      }
    };
  }
  function create_if_block$6(ctx) {
    let label;
    let current;
    const default_slot_template = (
      /*#slots*/
      ctx[7].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[6],
      null
    );
    let label_levels = [
      /*$$restProps*/
      ctx[3],
      { class: (
        /*labelClass*/
        ctx[2]
      ) }
    ];
    let label_data = {};
    for (let i = 0; i < label_levels.length; i += 1) {
      label_data = assign(label_data, label_levels[i]);
    }
    return {
      c() {
        label = element("label");
        if (default_slot)
          default_slot.c();
        set_attributes(label, label_data);
      },
      m(target, anchor) {
        insert(target, label, anchor);
        if (default_slot) {
          default_slot.m(label, null);
        }
        ctx[8](label);
        current = true;
      },
      p(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          64)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[6],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[6]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[6],
                dirty,
                null
              ),
              null
            );
          }
        }
        set_attributes(label, label_data = get_spread_update(label_levels, [
          dirty & /*$$restProps*/
          8 && /*$$restProps*/
          ctx2[3],
          (!current || dirty & /*labelClass*/
          4) && { class: (
            /*labelClass*/
            ctx2[2]
          ) }
        ]));
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(label);
        }
        if (default_slot)
          default_slot.d(detaching);
        ctx[8](null);
      }
    };
  }
  function create_fragment$f(ctx) {
    let current_block_type_index;
    let if_block;
    let if_block_anchor;
    let current;
    const if_block_creators = [create_if_block$6, create_else_block$1];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      if (
        /*show*/
        ctx2[0]
      )
        return 0;
      return 1;
    }
    current_block_type_index = select_block_type(ctx);
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    return {
      c() {
        if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if_blocks[current_block_type_index].m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if_blocks[current_block_type_index].d(detaching);
      }
    };
  }
  function instance$f($$self, $$props, $$invalidate) {
    let labelClass2;
    const omit_props_names = ["color", "defaultClass", "show"];
    let $$restProps = compute_rest_props($$props, omit_props_names);
    let { $$slots: slots = {}, $$scope } = $$props;
    let { color = "gray" } = $$props;
    let { defaultClass = "text-sm font-medium block" } = $$props;
    let { show = true } = $$props;
    let node;
    const colorClasses2 = {
      gray: "text-gray-900 dark:text-gray-300",
      green: "text-green-700 dark:text-green-500",
      red: "text-red-700 dark:text-red-500",
      disabled: "text-gray-400 dark:text-gray-500"
    };
    function label_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        node = $$value;
        $$invalidate(1, node);
      });
    }
    $$self.$$set = ($$new_props) => {
      $$invalidate(10, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      $$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
      if ("color" in $$new_props)
        $$invalidate(4, color = $$new_props.color);
      if ("defaultClass" in $$new_props)
        $$invalidate(5, defaultClass = $$new_props.defaultClass);
      if ("show" in $$new_props)
        $$invalidate(0, show = $$new_props.show);
      if ("$$scope" in $$new_props)
        $$invalidate(6, $$scope = $$new_props.$$scope);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*node, color*/
      18) {
        {
          const control = node == null ? void 0 : node.control;
          $$invalidate(4, color = (control == null ? void 0 : control.disabled) ? "disabled" : color);
        }
      }
      $$invalidate(2, labelClass2 = twMerge(defaultClass, colorClasses2[color], $$props.class));
    };
    $$props = exclude_internal_props($$props);
    return [
      show,
      node,
      labelClass2,
      $$restProps,
      color,
      defaultClass,
      $$scope,
      slots,
      label_binding
    ];
  }
  class Label extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$f, create_fragment$f, safe_not_equal, { color: 4, defaultClass: 5, show: 0 });
    }
  }
  function create_default_slot$5(ctx) {
    let input;
    let input_class_value;
    let t;
    let current;
    let binding_group;
    let mounted;
    let dispose;
    let input_levels = [
      { type: "radio" },
      { __value: (
        /*value*/
        ctx[4]
      ) },
      /*$$restProps*/
      ctx[8],
      {
        class: input_class_value = inputClass(
          /*custom*/
          ctx[2],
          /*color*/
          ctx[1],
          false,
          /*background*/
          ctx[5],
          /*$$slots*/
          ctx[7].default || /*$$props*/
          ctx[6].class
        )
      }
    ];
    let input_data = {};
    for (let i = 0; i < input_levels.length; i += 1) {
      input_data = assign(input_data, input_levels[i]);
    }
    const default_slot_template = (
      /*#slots*/
      ctx[9].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[23],
      null
    );
    binding_group = init_binding_group(
      /*$$binding_groups*/
      ctx[22][0]
    );
    return {
      c() {
        input = element("input");
        t = space();
        if (default_slot)
          default_slot.c();
        set_attributes(input, input_data);
        binding_group.p(input);
      },
      m(target, anchor) {
        insert(target, input, anchor);
        if (input.autofocus)
          input.focus();
        input.checked = input.__value === /*group*/
        ctx[0];
        insert(target, t, anchor);
        if (default_slot) {
          default_slot.m(target, anchor);
        }
        current = true;
        if (!mounted) {
          dispose = [
            listen(
              input,
              "change",
              /*input_change_handler*/
              ctx[21]
            ),
            listen(
              input,
              "blur",
              /*blur_handler*/
              ctx[10]
            ),
            listen(
              input,
              "change",
              /*change_handler*/
              ctx[11]
            ),
            listen(
              input,
              "click",
              /*click_handler*/
              ctx[12]
            ),
            listen(
              input,
              "focus",
              /*focus_handler*/
              ctx[13]
            ),
            listen(
              input,
              "keydown",
              /*keydown_handler*/
              ctx[14]
            ),
            listen(
              input,
              "keypress",
              /*keypress_handler*/
              ctx[15]
            ),
            listen(
              input,
              "keyup",
              /*keyup_handler*/
              ctx[16]
            ),
            listen(
              input,
              "mouseenter",
              /*mouseenter_handler*/
              ctx[17]
            ),
            listen(
              input,
              "mouseleave",
              /*mouseleave_handler*/
              ctx[18]
            ),
            listen(
              input,
              "mouseover",
              /*mouseover_handler*/
              ctx[19]
            ),
            listen(
              input,
              "paste",
              /*paste_handler*/
              ctx[20]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        set_attributes(input, input_data = get_spread_update(input_levels, [
          { type: "radio" },
          (!current || dirty & /*value*/
          16) && { __value: (
            /*value*/
            ctx2[4]
          ) },
          dirty & /*$$restProps*/
          256 && /*$$restProps*/
          ctx2[8],
          (!current || dirty & /*custom, color, $$slots, $$props*/
          198 && input_class_value !== (input_class_value = inputClass(
            /*custom*/
            ctx2[2],
            /*color*/
            ctx2[1],
            false,
            /*background*/
            ctx2[5],
            /*$$slots*/
            ctx2[7].default || /*$$props*/
            ctx2[6].class
          ))) && { class: input_class_value }
        ]));
        if (dirty & /*group*/
        1) {
          input.checked = input.__value === /*group*/
          ctx2[0];
        }
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          8388608)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[23],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[23]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[23],
                dirty,
                null
              ),
              null
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(input);
          detach(t);
        }
        if (default_slot)
          default_slot.d(detaching);
        binding_group.r();
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_fragment$e(ctx) {
    let label;
    let current;
    label = new Label({
      props: {
        class: labelClass(
          /*inline*/
          ctx[3],
          /*$$props*/
          ctx[6].class
        ),
        show: (
          /*$$slots*/
          ctx[7].default
        ),
        $$slots: { default: [create_default_slot$5] },
        $$scope: { ctx }
      }
    });
    return {
      c() {
        create_component(label.$$.fragment);
      },
      m(target, anchor) {
        mount_component(label, target, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        const label_changes = {};
        if (dirty & /*inline, $$props*/
        72)
          label_changes.class = labelClass(
            /*inline*/
            ctx2[3],
            /*$$props*/
            ctx2[6].class
          );
        if (dirty & /*$$slots*/
        128)
          label_changes.show = /*$$slots*/
          ctx2[7].default;
        if (dirty & /*$$scope, value, $$restProps, custom, color, $$slots, $$props, group*/
        8389079) {
          label_changes.$$scope = { dirty, ctx: ctx2 };
        }
        label.$set(label_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(label.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(label.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(label, detaching);
      }
    };
  }
  const colorClasses = {
    primary: "text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600",
    secondary: "text-secondary-600 focus:ring-secondary-500 dark:focus:ring-secondary-600",
    red: "text-red-600 focus:ring-red-500 dark:focus:ring-red-600",
    green: "text-green-600 focus:ring-green-500 dark:focus:ring-green-600",
    purple: "text-purple-600 focus:ring-purple-500 dark:focus:ring-purple-600",
    teal: "text-teal-600 focus:ring-teal-500 dark:focus:ring-teal-600",
    yellow: "text-yellow-400 focus:ring-yellow-500 dark:focus:ring-yellow-600",
    orange: "text-orange-500 focus:ring-orange-500 dark:focus:ring-orange-600",
    blue: "text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600"
  };
  const labelClass = (inline, extraClass) => twMerge(inline ? "inline-flex" : "flex", "items-center", extraClass);
  let spacing = "mr-2";
  const inputClass = (custom, color, rounded, tinted, extraClass) => twMerge(
    "w-4 h-4 bg-gray-100 border-gray-300 dark:ring-offset-gray-800 focus:ring-2",
    spacing,
    tinted ? "dark:bg-gray-600 dark:border-gray-500" : "dark:bg-gray-700 dark:border-gray-600",
    custom && "sr-only peer",
    rounded && "rounded",
    colorClasses[color],
    extraClass
  );
  function instance$e($$self, $$props, $$invalidate) {
    const omit_props_names = ["color", "custom", "inline", "group", "value"];
    let $$restProps = compute_rest_props($$props, omit_props_names);
    let { $$slots: slots = {}, $$scope } = $$props;
    const $$slots = compute_slots(slots);
    let { color = "primary" } = $$props;
    let { custom = false } = $$props;
    let { inline = false } = $$props;
    let { group = "" } = $$props;
    let { value = "" } = $$props;
    let background = getContext("background");
    const $$binding_groups = [[]];
    function blur_handler(event) {
      bubble.call(this, $$self, event);
    }
    function change_handler(event) {
      bubble.call(this, $$self, event);
    }
    function click_handler(event) {
      bubble.call(this, $$self, event);
    }
    function focus_handler(event) {
      bubble.call(this, $$self, event);
    }
    function keydown_handler(event) {
      bubble.call(this, $$self, event);
    }
    function keypress_handler(event) {
      bubble.call(this, $$self, event);
    }
    function keyup_handler(event) {
      bubble.call(this, $$self, event);
    }
    function mouseenter_handler(event) {
      bubble.call(this, $$self, event);
    }
    function mouseleave_handler(event) {
      bubble.call(this, $$self, event);
    }
    function mouseover_handler(event) {
      bubble.call(this, $$self, event);
    }
    function paste_handler(event) {
      bubble.call(this, $$self, event);
    }
    function input_change_handler() {
      group = this.__value;
      $$invalidate(0, group);
    }
    $$self.$$set = ($$new_props) => {
      $$invalidate(6, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      $$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
      if ("color" in $$new_props)
        $$invalidate(1, color = $$new_props.color);
      if ("custom" in $$new_props)
        $$invalidate(2, custom = $$new_props.custom);
      if ("inline" in $$new_props)
        $$invalidate(3, inline = $$new_props.inline);
      if ("group" in $$new_props)
        $$invalidate(0, group = $$new_props.group);
      if ("value" in $$new_props)
        $$invalidate(4, value = $$new_props.value);
      if ("$$scope" in $$new_props)
        $$invalidate(23, $$scope = $$new_props.$$scope);
    };
    $$props = exclude_internal_props($$props);
    return [
      group,
      color,
      custom,
      inline,
      value,
      background,
      $$props,
      $$slots,
      $$restProps,
      slots,
      blur_handler,
      change_handler,
      click_handler,
      focus_handler,
      keydown_handler,
      keypress_handler,
      keyup_handler,
      mouseenter_handler,
      mouseleave_handler,
      mouseover_handler,
      paste_handler,
      input_change_handler,
      $$binding_groups,
      $$scope
    ];
  }
  class Radio extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$e, create_fragment$e, safe_not_equal, {
        color: 1,
        custom: 2,
        inline: 3,
        group: 0,
        value: 4
      });
    }
  }
  function create_default_slot$4(ctx) {
    let input;
    let input_class_value;
    let init_action;
    let t;
    let current;
    let mounted;
    let dispose;
    let input_levels = [
      { type: "checkbox" },
      { __value: (
        /*value*/
        ctx[5]
      ) },
      /*$$restProps*/
      ctx[12],
      {
        class: input_class_value = twMerge(
          /*spacing*/
          ctx[6],
          inputClass(
            /*custom*/
            ctx[3],
            /*color*/
            ctx[2],
            true,
            /*background*/
            ctx[7],
            /*$$slots*/
            ctx[11].default || /*$$props*/
            ctx[10].class
          )
        )
      }
    ];
    let input_data = {};
    for (let i = 0; i < input_levels.length; i += 1) {
      input_data = assign(input_data, input_levels[i]);
    }
    const default_slot_template = (
      /*#slots*/
      ctx[13].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[26],
      null
    );
    return {
      c() {
        input = element("input");
        t = space();
        if (default_slot)
          default_slot.c();
        set_attributes(input, input_data);
      },
      m(target, anchor) {
        insert(target, input, anchor);
        if (input.autofocus)
          input.focus();
        input.checked = /*checked*/
        ctx[1];
        insert(target, t, anchor);
        if (default_slot) {
          default_slot.m(target, anchor);
        }
        current = true;
        if (!mounted) {
          dispose = [
            action_destroyer(init_action = /*init*/
            ctx[8].call(
              null,
              input,
              /*group*/
              ctx[0]
            )),
            listen(
              input,
              "change",
              /*input_change_handler*/
              ctx[25]
            ),
            listen(
              input,
              "keyup",
              /*keyup_handler*/
              ctx[14]
            ),
            listen(
              input,
              "keydown",
              /*keydown_handler*/
              ctx[15]
            ),
            listen(
              input,
              "keypress",
              /*keypress_handler*/
              ctx[16]
            ),
            listen(
              input,
              "focus",
              /*focus_handler*/
              ctx[17]
            ),
            listen(
              input,
              "blur",
              /*blur_handler*/
              ctx[18]
            ),
            listen(
              input,
              "click",
              /*click_handler*/
              ctx[19]
            ),
            listen(
              input,
              "mouseover",
              /*mouseover_handler*/
              ctx[20]
            ),
            listen(
              input,
              "mouseenter",
              /*mouseenter_handler*/
              ctx[21]
            ),
            listen(
              input,
              "mouseleave",
              /*mouseleave_handler*/
              ctx[22]
            ),
            listen(
              input,
              "paste",
              /*paste_handler*/
              ctx[23]
            ),
            listen(
              input,
              "change",
              /*onChange*/
              ctx[9]
            ),
            listen(
              input,
              "change",
              /*change_handler*/
              ctx[24]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        set_attributes(input, input_data = get_spread_update(input_levels, [
          { type: "checkbox" },
          (!current || dirty & /*value*/
          32) && { __value: (
            /*value*/
            ctx2[5]
          ) },
          dirty & /*$$restProps*/
          4096 && /*$$restProps*/
          ctx2[12],
          (!current || dirty & /*spacing, custom, color, $$slots, $$props*/
          3148 && input_class_value !== (input_class_value = twMerge(
            /*spacing*/
            ctx2[6],
            inputClass(
              /*custom*/
              ctx2[3],
              /*color*/
              ctx2[2],
              true,
              /*background*/
              ctx2[7],
              /*$$slots*/
              ctx2[11].default || /*$$props*/
              ctx2[10].class
            )
          ))) && { class: input_class_value }
        ]));
        if (init_action && is_function(init_action.update) && dirty & /*group*/
        1)
          init_action.update.call(
            null,
            /*group*/
            ctx2[0]
          );
        if (dirty & /*checked*/
        2) {
          input.checked = /*checked*/
          ctx2[1];
        }
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          67108864)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[26],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[26]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[26],
                dirty,
                null
              ),
              null
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(input);
          detach(t);
        }
        if (default_slot)
          default_slot.d(detaching);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_fragment$d(ctx) {
    let label;
    let current;
    label = new Label({
      props: {
        class: labelClass(
          /*inline*/
          ctx[4],
          /*$$props*/
          ctx[10].class
        ),
        show: (
          /*$$slots*/
          ctx[11].default
        ),
        $$slots: { default: [create_default_slot$4] },
        $$scope: { ctx }
      }
    });
    return {
      c() {
        create_component(label.$$.fragment);
      },
      m(target, anchor) {
        mount_component(label, target, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        const label_changes = {};
        if (dirty & /*inline, $$props*/
        1040)
          label_changes.class = labelClass(
            /*inline*/
            ctx2[4],
            /*$$props*/
            ctx2[10].class
          );
        if (dirty & /*$$slots*/
        2048)
          label_changes.show = /*$$slots*/
          ctx2[11].default;
        if (dirty & /*$$scope, value, $$restProps, spacing, custom, color, $$slots, $$props, checked, group*/
        67116143) {
          label_changes.$$scope = { dirty, ctx: ctx2 };
        }
        label.$set(label_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(label.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(label.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(label, detaching);
      }
    };
  }
  function instance$d($$self, $$props, $$invalidate) {
    const omit_props_names = ["color", "custom", "inline", "group", "value", "checked", "spacing"];
    let $$restProps = compute_rest_props($$props, omit_props_names);
    let { $$slots: slots = {}, $$scope } = $$props;
    const $$slots = compute_slots(slots);
    let { color = "primary" } = $$props;
    let { custom = false } = $$props;
    let { inline = false } = $$props;
    let { group = [] } = $$props;
    let { value = "on" } = $$props;
    let { checked = void 0 } = $$props;
    let { spacing: spacing2 = "mr-2" } = $$props;
    let background = getContext("background");
    function init2(_, _group) {
      if (checked === void 0)
        $$invalidate(1, checked = _group.includes(value));
      onChange();
      return {
        update(_group2) {
          $$invalidate(1, checked = _group2.includes(value));
        }
      };
    }
    function onChange() {
      const index = group.indexOf(value);
      if (checked === void 0)
        $$invalidate(1, checked = index >= 0);
      if (checked) {
        if (index < 0) {
          group.push(value);
          $$invalidate(0, group);
        }
      } else {
        if (index >= 0) {
          group.splice(index, 1);
          $$invalidate(0, group);
        }
      }
    }
    function keyup_handler(event) {
      bubble.call(this, $$self, event);
    }
    function keydown_handler(event) {
      bubble.call(this, $$self, event);
    }
    function keypress_handler(event) {
      bubble.call(this, $$self, event);
    }
    function focus_handler(event) {
      bubble.call(this, $$self, event);
    }
    function blur_handler(event) {
      bubble.call(this, $$self, event);
    }
    function click_handler(event) {
      bubble.call(this, $$self, event);
    }
    function mouseover_handler(event) {
      bubble.call(this, $$self, event);
    }
    function mouseenter_handler(event) {
      bubble.call(this, $$self, event);
    }
    function mouseleave_handler(event) {
      bubble.call(this, $$self, event);
    }
    function paste_handler(event) {
      bubble.call(this, $$self, event);
    }
    function change_handler(event) {
      bubble.call(this, $$self, event);
    }
    function input_change_handler() {
      checked = this.checked;
      $$invalidate(1, checked);
    }
    $$self.$$set = ($$new_props) => {
      $$invalidate(10, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      $$invalidate(12, $$restProps = compute_rest_props($$props, omit_props_names));
      if ("color" in $$new_props)
        $$invalidate(2, color = $$new_props.color);
      if ("custom" in $$new_props)
        $$invalidate(3, custom = $$new_props.custom);
      if ("inline" in $$new_props)
        $$invalidate(4, inline = $$new_props.inline);
      if ("group" in $$new_props)
        $$invalidate(0, group = $$new_props.group);
      if ("value" in $$new_props)
        $$invalidate(5, value = $$new_props.value);
      if ("checked" in $$new_props)
        $$invalidate(1, checked = $$new_props.checked);
      if ("spacing" in $$new_props)
        $$invalidate(6, spacing2 = $$new_props.spacing);
      if ("$$scope" in $$new_props)
        $$invalidate(26, $$scope = $$new_props.$$scope);
    };
    $$props = exclude_internal_props($$props);
    return [
      group,
      checked,
      color,
      custom,
      inline,
      value,
      spacing2,
      background,
      init2,
      onChange,
      $$props,
      $$slots,
      $$restProps,
      slots,
      keyup_handler,
      keydown_handler,
      keypress_handler,
      focus_handler,
      blur_handler,
      click_handler,
      mouseover_handler,
      mouseenter_handler,
      mouseleave_handler,
      paste_handler,
      change_handler,
      input_change_handler,
      $$scope
    ];
  }
  class Checkbox extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$d, create_fragment$d, safe_not_equal, {
        color: 2,
        custom: 3,
        inline: 4,
        group: 0,
        value: 5,
        checked: 1,
        spacing: 6
      });
    }
  }
  const get_right_slot_changes = (dirty) => ({});
  const get_right_slot_context = (ctx) => ({});
  const get_default_slot_changes$1 = (dirty) => ({
    props: dirty[0] & /*$$restProps, inputClass*/
    72
  });
  const get_default_slot_context$1 = (ctx) => ({
    props: {
      .../*$$restProps*/
      ctx[6],
      class: (
        /*inputClass*/
        ctx[3]
      )
    }
  });
  const get_left_slot_changes = (dirty) => ({});
  const get_left_slot_context = (ctx) => ({});
  function create_if_block_1$1(ctx) {
    let div;
    let div_class_value;
    let current;
    const left_slot_template = (
      /*#slots*/
      ctx[11].left
    );
    const left_slot = create_slot(
      left_slot_template,
      ctx,
      /*$$scope*/
      ctx[26],
      get_left_slot_context
    );
    return {
      c() {
        div = element("div");
        if (left_slot)
          left_slot.c();
        attr(div, "class", div_class_value = twMerge(
          /*floatClass*/
          ctx[2],
          /*$$props*/
          ctx[4].classLeft
        ) + " left-0 pl-2.5 pointer-events-none");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if (left_slot) {
          left_slot.m(div, null);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (left_slot) {
          if (left_slot.p && (!current || dirty[0] & /*$$scope*/
          67108864)) {
            update_slot_base(
              left_slot,
              left_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[26],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[26]
              ) : get_slot_changes(
                left_slot_template,
                /*$$scope*/
                ctx2[26],
                dirty,
                get_left_slot_changes
              ),
              get_left_slot_context
            );
          }
        }
        if (!current || dirty[0] & /*floatClass, $$props*/
        20 && div_class_value !== (div_class_value = twMerge(
          /*floatClass*/
          ctx2[2],
          /*$$props*/
          ctx2[4].classLeft
        ) + " left-0 pl-2.5 pointer-events-none")) {
          attr(div, "class", div_class_value);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(left_slot, local);
        current = true;
      },
      o(local) {
        transition_out(left_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        if (left_slot)
          left_slot.d(detaching);
      }
    };
  }
  function fallback_block$3(ctx) {
    let input;
    let mounted;
    let dispose;
    let input_levels = [
      /*$$restProps*/
      ctx[6],
      { type: (
        /*type*/
        ctx[1]
      ) },
      { class: (
        /*inputClass*/
        ctx[3]
      ) }
    ];
    let input_data = {};
    for (let i = 0; i < input_levels.length; i += 1) {
      input_data = assign(input_data, input_levels[i]);
    }
    return {
      c() {
        input = element("input");
        set_attributes(input, input_data);
      },
      m(target, anchor) {
        insert(target, input, anchor);
        if (input.autofocus)
          input.focus();
        set_input_value(
          input,
          /*value*/
          ctx[0]
        );
        if (!mounted) {
          dispose = [
            listen(
              input,
              "input",
              /*input_input_handler*/
              ctx[25]
            ),
            listen(
              input,
              "blur",
              /*blur_handler*/
              ctx[12]
            ),
            listen(
              input,
              "change",
              /*change_handler*/
              ctx[13]
            ),
            listen(
              input,
              "click",
              /*click_handler*/
              ctx[14]
            ),
            listen(
              input,
              "contextmenu",
              /*contextmenu_handler*/
              ctx[15]
            ),
            listen(
              input,
              "focus",
              /*focus_handler*/
              ctx[16]
            ),
            listen(
              input,
              "keydown",
              /*keydown_handler*/
              ctx[17]
            ),
            listen(
              input,
              "keypress",
              /*keypress_handler*/
              ctx[18]
            ),
            listen(
              input,
              "keyup",
              /*keyup_handler*/
              ctx[19]
            ),
            listen(
              input,
              "mouseover",
              /*mouseover_handler*/
              ctx[20]
            ),
            listen(
              input,
              "mouseenter",
              /*mouseenter_handler*/
              ctx[21]
            ),
            listen(
              input,
              "mouseleave",
              /*mouseleave_handler*/
              ctx[22]
            ),
            listen(
              input,
              "paste",
              /*paste_handler*/
              ctx[23]
            ),
            listen(
              input,
              "input",
              /*input_handler*/
              ctx[24]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        set_attributes(input, input_data = get_spread_update(input_levels, [
          dirty[0] & /*$$restProps*/
          64 && /*$$restProps*/
          ctx2[6],
          dirty[0] & /*type*/
          2 && { type: (
            /*type*/
            ctx2[1]
          ) },
          dirty[0] & /*inputClass*/
          8 && { class: (
            /*inputClass*/
            ctx2[3]
          ) }
        ]));
        if (dirty[0] & /*value*/
        1 && input.value !== /*value*/
        ctx2[0]) {
          set_input_value(
            input,
            /*value*/
            ctx2[0]
          );
        }
      },
      d(detaching) {
        if (detaching) {
          detach(input);
        }
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_if_block$5(ctx) {
    let div;
    let div_class_value;
    let current;
    const right_slot_template = (
      /*#slots*/
      ctx[11].right
    );
    const right_slot = create_slot(
      right_slot_template,
      ctx,
      /*$$scope*/
      ctx[26],
      get_right_slot_context
    );
    return {
      c() {
        div = element("div");
        if (right_slot)
          right_slot.c();
        attr(div, "class", div_class_value = twMerge(
          /*floatClass*/
          ctx[2],
          /*$$props*/
          ctx[4].classRight
        ) + " right-0 pr-2.5");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if (right_slot) {
          right_slot.m(div, null);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (right_slot) {
          if (right_slot.p && (!current || dirty[0] & /*$$scope*/
          67108864)) {
            update_slot_base(
              right_slot,
              right_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[26],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[26]
              ) : get_slot_changes(
                right_slot_template,
                /*$$scope*/
                ctx2[26],
                dirty,
                get_right_slot_changes
              ),
              get_right_slot_context
            );
          }
        }
        if (!current || dirty[0] & /*floatClass, $$props*/
        20 && div_class_value !== (div_class_value = twMerge(
          /*floatClass*/
          ctx2[2],
          /*$$props*/
          ctx2[4].classRight
        ) + " right-0 pr-2.5")) {
          attr(div, "class", div_class_value);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(right_slot, local);
        current = true;
      },
      o(local) {
        transition_out(right_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        if (right_slot)
          right_slot.d(detaching);
      }
    };
  }
  function create_default_slot$3(ctx) {
    let t0;
    let t1;
    let if_block1_anchor;
    let current;
    let if_block0 = (
      /*$$slots*/
      ctx[5].left && create_if_block_1$1(ctx)
    );
    const default_slot_template = (
      /*#slots*/
      ctx[11].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[26],
      get_default_slot_context$1
    );
    const default_slot_or_fallback = default_slot || fallback_block$3(ctx);
    let if_block1 = (
      /*$$slots*/
      ctx[5].right && create_if_block$5(ctx)
    );
    return {
      c() {
        if (if_block0)
          if_block0.c();
        t0 = space();
        if (default_slot_or_fallback)
          default_slot_or_fallback.c();
        t1 = space();
        if (if_block1)
          if_block1.c();
        if_block1_anchor = empty();
      },
      m(target, anchor) {
        if (if_block0)
          if_block0.m(target, anchor);
        insert(target, t0, anchor);
        if (default_slot_or_fallback) {
          default_slot_or_fallback.m(target, anchor);
        }
        insert(target, t1, anchor);
        if (if_block1)
          if_block1.m(target, anchor);
        insert(target, if_block1_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        if (
          /*$$slots*/
          ctx2[5].left
        ) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
            if (dirty[0] & /*$$slots*/
            32) {
              transition_in(if_block0, 1);
            }
          } else {
            if_block0 = create_if_block_1$1(ctx2);
            if_block0.c();
            transition_in(if_block0, 1);
            if_block0.m(t0.parentNode, t0);
          }
        } else if (if_block0) {
          group_outros();
          transition_out(if_block0, 1, 1, () => {
            if_block0 = null;
          });
          check_outros();
        }
        if (default_slot) {
          if (default_slot.p && (!current || dirty[0] & /*$$scope, $$restProps, inputClass*/
          67108936)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[26],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[26]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[26],
                dirty,
                get_default_slot_changes$1
              ),
              get_default_slot_context$1
            );
          }
        } else {
          if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty[0] & /*$$restProps, type, inputClass, value*/
          75)) {
            default_slot_or_fallback.p(ctx2, !current ? [-1, -1] : dirty);
          }
        }
        if (
          /*$$slots*/
          ctx2[5].right
        ) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
            if (dirty[0] & /*$$slots*/
            32) {
              transition_in(if_block1, 1);
            }
          } else {
            if_block1 = create_if_block$5(ctx2);
            if_block1.c();
            transition_in(if_block1, 1);
            if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
          }
        } else if (if_block1) {
          group_outros();
          transition_out(if_block1, 1, 1, () => {
            if_block1 = null;
          });
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block0);
        transition_in(default_slot_or_fallback, local);
        transition_in(if_block1);
        current = true;
      },
      o(local) {
        transition_out(if_block0);
        transition_out(default_slot_or_fallback, local);
        transition_out(if_block1);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(t0);
          detach(t1);
          detach(if_block1_anchor);
        }
        if (if_block0)
          if_block0.d(detaching);
        if (default_slot_or_fallback)
          default_slot_or_fallback.d(detaching);
        if (if_block1)
          if_block1.d(detaching);
      }
    };
  }
  function create_fragment$c(ctx) {
    let wrapper;
    let current;
    wrapper = new Wrapper({
      props: {
        class: "relative w-full",
        show: (
          /*$$slots*/
          ctx[5].left || /*$$slots*/
          ctx[5].right
        ),
        $$slots: { default: [create_default_slot$3] },
        $$scope: { ctx }
      }
    });
    return {
      c() {
        create_component(wrapper.$$.fragment);
      },
      m(target, anchor) {
        mount_component(wrapper, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const wrapper_changes = {};
        if (dirty[0] & /*$$slots*/
        32)
          wrapper_changes.show = /*$$slots*/
          ctx2[5].left || /*$$slots*/
          ctx2[5].right;
        if (dirty[0] & /*$$scope, floatClass, $$props, $$slots, $$restProps, type, inputClass, value*/
        67108991) {
          wrapper_changes.$$scope = { dirty, ctx: ctx2 };
        }
        wrapper.$set(wrapper_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(wrapper.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(wrapper.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(wrapper, detaching);
      }
    };
  }
  function clampSize(s) {
    return s && s === "xs" ? "sm" : s === "xl" ? "lg" : s;
  }
  function instance$c($$self, $$props, $$invalidate) {
    let _size;
    const omit_props_names = ["type", "value", "size", "defaultClass", "color", "floatClass"];
    let $$restProps = compute_rest_props($$props, omit_props_names);
    let { $$slots: slots = {}, $$scope } = $$props;
    const $$slots = compute_slots(slots);
    let { type = "text" } = $$props;
    let { value = void 0 } = $$props;
    let { size = void 0 } = $$props;
    let { defaultClass = "block w-full disabled:cursor-not-allowed disabled:opacity-50" } = $$props;
    let { color = "base" } = $$props;
    let { floatClass = "flex absolute inset-y-0 items-center text-gray-500 dark:text-gray-400" } = $$props;
    const borderClasses = {
      base: "border-gray-300 dark:border-gray-600",
      tinted: "border-gray-300 dark:border-gray-500",
      green: "border-green-500 dark:border-green-400",
      red: "border-red-500 dark:border-red-400"
    };
    const ringClasses = {
      base: "focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500",
      green: "focus:ring-green-500 focus:border-green-500 dark:focus:border-green-500 dark:focus:ring-green-500",
      red: "focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-500 dark:focus:border-red-500"
    };
    const colorClasses2 = {
      base: "bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400",
      tinted: "bg-gray-50 text-gray-900 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400",
      green: "bg-green-50 text-green-900 placeholder-green-700 dark:text-green-400 dark:placeholder-green-500 dark:bg-gray-700",
      red: "bg-red-50 text-red-900 placeholder-red-700 dark:text-red-500 dark:placeholder-red-500 dark:bg-gray-700"
    };
    let background = getContext("background");
    let group = getContext("group");
    const textSizes = {
      sm: "sm:text-xs",
      md: "text-sm",
      lg: "sm:text-base"
    };
    const leftPadding = { sm: "pl-9", md: "pl-10", lg: "pl-11" };
    const rightPadding = { sm: "pr-9", md: "pr-10", lg: "pr-11" };
    const inputPadding = { sm: "p-2", md: "p-2.5", lg: "p-3" };
    let inputClass2;
    function blur_handler(event) {
      bubble.call(this, $$self, event);
    }
    function change_handler(event) {
      bubble.call(this, $$self, event);
    }
    function click_handler(event) {
      bubble.call(this, $$self, event);
    }
    function contextmenu_handler(event) {
      bubble.call(this, $$self, event);
    }
    function focus_handler(event) {
      bubble.call(this, $$self, event);
    }
    function keydown_handler(event) {
      bubble.call(this, $$self, event);
    }
    function keypress_handler(event) {
      bubble.call(this, $$self, event);
    }
    function keyup_handler(event) {
      bubble.call(this, $$self, event);
    }
    function mouseover_handler(event) {
      bubble.call(this, $$self, event);
    }
    function mouseenter_handler(event) {
      bubble.call(this, $$self, event);
    }
    function mouseleave_handler(event) {
      bubble.call(this, $$self, event);
    }
    function paste_handler(event) {
      bubble.call(this, $$self, event);
    }
    function input_handler(event) {
      bubble.call(this, $$self, event);
    }
    function input_input_handler() {
      value = this.value;
      $$invalidate(0, value);
    }
    $$self.$$set = ($$new_props) => {
      $$invalidate(4, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      $$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
      if ("type" in $$new_props)
        $$invalidate(1, type = $$new_props.type);
      if ("value" in $$new_props)
        $$invalidate(0, value = $$new_props.value);
      if ("size" in $$new_props)
        $$invalidate(7, size = $$new_props.size);
      if ("defaultClass" in $$new_props)
        $$invalidate(8, defaultClass = $$new_props.defaultClass);
      if ("color" in $$new_props)
        $$invalidate(9, color = $$new_props.color);
      if ("floatClass" in $$new_props)
        $$invalidate(2, floatClass = $$new_props.floatClass);
      if ("$$scope" in $$new_props)
        $$invalidate(26, $$scope = $$new_props.$$scope);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty[0] & /*size*/
      128) {
        $$invalidate(10, _size = size || clampSize(group == null ? void 0 : group.size) || "md");
      }
      {
        const _color = color === "base" && background ? "tinted" : color;
        $$invalidate(3, inputClass2 = twMerge([
          defaultClass,
          $$slots.left && leftPadding[_size] || $$slots.right && rightPadding[_size] || inputPadding[_size],
          ringClasses[color],
          colorClasses2[_color],
          borderClasses[_color],
          textSizes[_size],
          group || "rounded-lg",
          group && "first:rounded-l-lg last:rounded-r-lg",
          group && "border-l-0 first:border-l last:border-r",
          $$props.class
        ]));
      }
    };
    $$props = exclude_internal_props($$props);
    return [
      value,
      type,
      floatClass,
      inputClass2,
      $$props,
      $$slots,
      $$restProps,
      size,
      defaultClass,
      color,
      _size,
      slots,
      blur_handler,
      change_handler,
      click_handler,
      contextmenu_handler,
      focus_handler,
      keydown_handler,
      keypress_handler,
      keyup_handler,
      mouseover_handler,
      mouseenter_handler,
      mouseleave_handler,
      paste_handler,
      input_handler,
      input_input_handler,
      $$scope
    ];
  }
  class Input extends SvelteComponent {
    constructor(options) {
      super();
      init(
        this,
        options,
        instance$c,
        create_fragment$c,
        safe_not_equal,
        {
          type: 1,
          value: 0,
          size: 7,
          defaultClass: 8,
          color: 9,
          floatClass: 2
        },
        null,
        [-1, -1]
      );
    }
  }
  const selectorTabbable = `
  a[href], area[href], input:not([disabled]):not([tabindex='-1']),
  button:not([disabled]):not([tabindex='-1']),select:not([disabled]):not([tabindex='-1']),
  textarea:not([disabled]):not([tabindex='-1']),
  iframe, object, embed, *[tabindex]:not([tabindex='-1']):not([disabled]), *[contenteditable=true]
`;
  function focusTrap(node) {
    function handleFocusTrap(e) {
      let isTabPressed = e.key === "Tab" || e.keyCode === 9;
      if (!isTabPressed) {
        return;
      }
      const tabbable = Array.from(node.querySelectorAll(selectorTabbable));
      let index = tabbable.indexOf(document.activeElement ?? node);
      if (index === -1 && e.shiftKey)
        index = 0;
      index += tabbable.length + (e.shiftKey ? -1 : 1);
      index %= tabbable.length;
      tabbable[index].focus();
      e.preventDefault();
    }
    document.addEventListener("keydown", handleFocusTrap, true);
    return {
      destroy() {
        document.removeEventListener("keydown", handleFocusTrap, true);
      }
    };
  }
  const get_footer_slot_changes = (dirty) => ({});
  const get_footer_slot_context = (ctx) => ({});
  const get_header_slot_changes = (dirty) => ({});
  const get_header_slot_context = (ctx) => ({});
  function create_if_block$4(ctx) {
    let div0;
    let t;
    let div2;
    let div1;
    let frame;
    let div1_class_value;
    let current;
    let mounted;
    let dispose;
    const frame_spread_levels = [
      { rounded: true },
      { shadow: true },
      /*$$restProps*/
      ctx[13],
      { class: (
        /*frameClass*/
        ctx[4]
      ) }
    ];
    let frame_props = {
      $$slots: { default: [create_default_slot$2] },
      $$scope: { ctx }
    };
    for (let i = 0; i < frame_spread_levels.length; i += 1) {
      frame_props = assign(frame_props, frame_spread_levels[i]);
    }
    frame = new Frame({ props: frame_props });
    return {
      c() {
        div0 = element("div");
        t = space();
        div2 = element("div");
        div1 = element("div");
        create_component(frame.$$.fragment);
        attr(div0, "class", twMerge(
          "fixed inset-0 z-40",
          /*backdropCls*/
          ctx[10]
        ));
        attr(div1, "class", div1_class_value = "flex relative " + /*sizes*/
        ctx[7][
          /*size*/
          ctx[2]
        ] + " w-full max-h-full");
        attr(div2, "class", twMerge("fixed top-0 left-0 right-0 h-modal md:inset-0 md:h-full z-50 w-full p-4 flex", .../*getPlacementClasses*/
        ctx[6]()));
        attr(div2, "tabindex", "-1");
        attr(div2, "aria-modal", "true");
        attr(div2, "role", "dialog");
      },
      m(target, anchor) {
        insert(target, div0, anchor);
        insert(target, t, anchor);
        insert(target, div2, anchor);
        append(div2, div1);
        mount_component(frame, div1, null);
        current = true;
        if (!mounted) {
          dispose = [
            listen(
              div2,
              "keydown",
              /*handleKeys*/
              ctx[11]
            ),
            listen(div2, "wheel", prevent_default(
              /*wheel_handler*/
              ctx[21]
            ), { passive: false }),
            action_destroyer(
              /*prepareFocus*/
              ctx[5].call(null, div2)
            ),
            action_destroyer(focusTrap.call(null, div2)),
            listen(
              div2,
              "click",
              /*onAutoClose*/
              ctx[8]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        const frame_changes = dirty & /*$$restProps, frameClass*/
        8208 ? get_spread_update(frame_spread_levels, [
          frame_spread_levels[0],
          frame_spread_levels[1],
          dirty & /*$$restProps*/
          8192 && get_spread_object(
            /*$$restProps*/
            ctx2[13]
          ),
          dirty & /*frameClass*/
          16 && { class: (
            /*frameClass*/
            ctx2[4]
          ) }
        ]) : {};
        if (dirty & /*$$scope, $$restProps, $$slots, $$props, permanent, title*/
        8417290) {
          frame_changes.$$scope = { dirty, ctx: ctx2 };
        }
        frame.$set(frame_changes);
        if (!current || dirty & /*size*/
        4 && div1_class_value !== (div1_class_value = "flex relative " + /*sizes*/
        ctx2[7][
          /*size*/
          ctx2[2]
        ] + " w-full max-h-full")) {
          attr(div1, "class", div1_class_value);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(frame.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(frame.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div0);
          detach(t);
          detach(div2);
        }
        destroy_component(frame);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_if_block_4(ctx) {
    let closebutton;
    let current;
    closebutton = new CloseButton({
      props: {
        name: "Close modal",
        class: "absolute top-3 right-2.5",
        color: (
          /*$$restProps*/
          ctx[13].color
        )
      }
    });
    closebutton.$on(
      "click",
      /*hide*/
      ctx[9]
    );
    return {
      c() {
        create_component(closebutton.$$.fragment);
      },
      m(target, anchor) {
        mount_component(closebutton, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const closebutton_changes = {};
        if (dirty & /*$$restProps*/
        8192)
          closebutton_changes.color = /*$$restProps*/
          ctx2[13].color;
        closebutton.$set(closebutton_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(closebutton.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(closebutton.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(closebutton, detaching);
      }
    };
  }
  function create_if_block_2(ctx) {
    let frame;
    let current;
    frame = new Frame({
      props: {
        color: (
          /*$$restProps*/
          ctx[13].color
        ),
        class: "flex justify-between items-center p-4 rounded-t border-b",
        $$slots: { default: [create_default_slot_2$2] },
        $$scope: { ctx }
      }
    });
    return {
      c() {
        create_component(frame.$$.fragment);
      },
      m(target, anchor) {
        mount_component(frame, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const frame_changes = {};
        if (dirty & /*$$restProps*/
        8192)
          frame_changes.color = /*$$restProps*/
          ctx2[13].color;
        if (dirty & /*$$scope, $$restProps, permanent, title*/
        8396810) {
          frame_changes.$$scope = { dirty, ctx: ctx2 };
        }
        frame.$set(frame_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(frame.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(frame.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(frame, detaching);
      }
    };
  }
  function fallback_block$2(ctx) {
    let h3;
    let t;
    let h3_class_value;
    return {
      c() {
        h3 = element("h3");
        t = text(
          /*title*/
          ctx[1]
        );
        attr(h3, "class", h3_class_value = "text-xl font-semibold " + /*$$restProps*/
        (ctx[13].color ? "" : "text-gray-900 dark:text-white") + " p-0");
      },
      m(target, anchor) {
        insert(target, h3, anchor);
        append(h3, t);
      },
      p(ctx2, dirty) {
        if (dirty & /*title*/
        2)
          set_data(
            t,
            /*title*/
            ctx2[1]
          );
        if (dirty & /*$$restProps*/
        8192 && h3_class_value !== (h3_class_value = "text-xl font-semibold " + /*$$restProps*/
        (ctx2[13].color ? "" : "text-gray-900 dark:text-white") + " p-0")) {
          attr(h3, "class", h3_class_value);
        }
      },
      d(detaching) {
        if (detaching) {
          detach(h3);
        }
      }
    };
  }
  function create_if_block_3(ctx) {
    let closebutton;
    let current;
    closebutton = new CloseButton({
      props: {
        name: "Close modal",
        color: (
          /*$$restProps*/
          ctx[13].color
        )
      }
    });
    closebutton.$on(
      "click",
      /*hide*/
      ctx[9]
    );
    return {
      c() {
        create_component(closebutton.$$.fragment);
      },
      m(target, anchor) {
        mount_component(closebutton, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const closebutton_changes = {};
        if (dirty & /*$$restProps*/
        8192)
          closebutton_changes.color = /*$$restProps*/
          ctx2[13].color;
        closebutton.$set(closebutton_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(closebutton.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(closebutton.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(closebutton, detaching);
      }
    };
  }
  function create_default_slot_2$2(ctx) {
    let t;
    let if_block_anchor;
    let current;
    const header_slot_template = (
      /*#slots*/
      ctx[20].header
    );
    const header_slot = create_slot(
      header_slot_template,
      ctx,
      /*$$scope*/
      ctx[23],
      get_header_slot_context
    );
    const header_slot_or_fallback = header_slot || fallback_block$2(ctx);
    let if_block = !/*permanent*/
    ctx[3] && create_if_block_3(ctx);
    return {
      c() {
        if (header_slot_or_fallback)
          header_slot_or_fallback.c();
        t = space();
        if (if_block)
          if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if (header_slot_or_fallback) {
          header_slot_or_fallback.m(target, anchor);
        }
        insert(target, t, anchor);
        if (if_block)
          if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        if (header_slot) {
          if (header_slot.p && (!current || dirty & /*$$scope*/
          8388608)) {
            update_slot_base(
              header_slot,
              header_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[23],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[23]
              ) : get_slot_changes(
                header_slot_template,
                /*$$scope*/
                ctx2[23],
                dirty,
                get_header_slot_changes
              ),
              get_header_slot_context
            );
          }
        } else {
          if (header_slot_or_fallback && header_slot_or_fallback.p && (!current || dirty & /*$$restProps, title*/
          8194)) {
            header_slot_or_fallback.p(ctx2, !current ? -1 : dirty);
          }
        }
        if (!/*permanent*/
        ctx2[3]) {
          if (if_block) {
            if_block.p(ctx2, dirty);
            if (dirty & /*permanent*/
            8) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block_3(ctx2);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(header_slot_or_fallback, local);
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(header_slot_or_fallback, local);
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(t);
          detach(if_block_anchor);
        }
        if (header_slot_or_fallback)
          header_slot_or_fallback.d(detaching);
        if (if_block)
          if_block.d(detaching);
      }
    };
  }
  function create_if_block_1(ctx) {
    let frame;
    let current;
    frame = new Frame({
      props: {
        color: (
          /*$$restProps*/
          ctx[13].color
        ),
        class: "flex items-center p-6 space-x-2 rounded-b border-t",
        $$slots: { default: [create_default_slot_1$2] },
        $$scope: { ctx }
      }
    });
    return {
      c() {
        create_component(frame.$$.fragment);
      },
      m(target, anchor) {
        mount_component(frame, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const frame_changes = {};
        if (dirty & /*$$restProps*/
        8192)
          frame_changes.color = /*$$restProps*/
          ctx2[13].color;
        if (dirty & /*$$scope*/
        8388608) {
          frame_changes.$$scope = { dirty, ctx: ctx2 };
        }
        frame.$set(frame_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(frame.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(frame.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(frame, detaching);
      }
    };
  }
  function create_default_slot_1$2(ctx) {
    let current;
    const footer_slot_template = (
      /*#slots*/
      ctx[20].footer
    );
    const footer_slot = create_slot(
      footer_slot_template,
      ctx,
      /*$$scope*/
      ctx[23],
      get_footer_slot_context
    );
    return {
      c() {
        if (footer_slot)
          footer_slot.c();
      },
      m(target, anchor) {
        if (footer_slot) {
          footer_slot.m(target, anchor);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (footer_slot) {
          if (footer_slot.p && (!current || dirty & /*$$scope*/
          8388608)) {
            update_slot_base(
              footer_slot,
              footer_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[23],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[23]
              ) : get_slot_changes(
                footer_slot_template,
                /*$$scope*/
                ctx2[23],
                dirty,
                get_footer_slot_changes
              ),
              get_footer_slot_context
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(footer_slot, local);
        current = true;
      },
      o(local) {
        transition_out(footer_slot, local);
        current = false;
      },
      d(detaching) {
        if (footer_slot)
          footer_slot.d(detaching);
      }
    };
  }
  function create_default_slot$2(ctx) {
    let current_block_type_index;
    let if_block0;
    let t0;
    let div;
    let div_class_value;
    let t1;
    let if_block1_anchor;
    let current;
    let mounted;
    let dispose;
    const if_block_creators = [create_if_block_2, create_if_block_4];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      if (
        /*$$slots*/
        ctx2[14].header || /*title*/
        ctx2[1]
      )
        return 0;
      if (!/*permanent*/
      ctx2[3])
        return 1;
      return -1;
    }
    if (~(current_block_type_index = select_block_type(ctx))) {
      if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    }
    const default_slot_template = (
      /*#slots*/
      ctx[20].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[23],
      null
    );
    let if_block1 = (
      /*$$slots*/
      ctx[14].footer && create_if_block_1(ctx)
    );
    return {
      c() {
        if (if_block0)
          if_block0.c();
        t0 = space();
        div = element("div");
        if (default_slot)
          default_slot.c();
        t1 = space();
        if (if_block1)
          if_block1.c();
        if_block1_anchor = empty();
        attr(div, "class", div_class_value = twMerge(
          "p-6 space-y-6 flex-1 overflow-y-auto overscroll-contain",
          /*$$props*/
          ctx[12].bodyClass
        ));
        attr(div, "role", "document");
      },
      m(target, anchor) {
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].m(target, anchor);
        }
        insert(target, t0, anchor);
        insert(target, div, anchor);
        if (default_slot) {
          default_slot.m(div, null);
        }
        insert(target, t1, anchor);
        if (if_block1)
          if_block1.m(target, anchor);
        insert(target, if_block1_anchor, anchor);
        current = true;
        if (!mounted) {
          dispose = [
            listen(div, "keydown", stop_propagation(
              /*handleKeys*/
              ctx[11]
            )),
            listen(div, "wheel", stop_propagation(
              /*wheel_handler_1*/
              ctx[22]
            ), { passive: true })
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2);
        if (current_block_type_index === previous_block_index) {
          if (~current_block_type_index) {
            if_blocks[current_block_type_index].p(ctx2, dirty);
          }
        } else {
          if (if_block0) {
            group_outros();
            transition_out(if_blocks[previous_block_index], 1, 1, () => {
              if_blocks[previous_block_index] = null;
            });
            check_outros();
          }
          if (~current_block_type_index) {
            if_block0 = if_blocks[current_block_type_index];
            if (!if_block0) {
              if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
              if_block0.c();
            } else {
              if_block0.p(ctx2, dirty);
            }
            transition_in(if_block0, 1);
            if_block0.m(t0.parentNode, t0);
          } else {
            if_block0 = null;
          }
        }
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          8388608)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[23],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[23]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[23],
                dirty,
                null
              ),
              null
            );
          }
        }
        if (!current || dirty & /*$$props*/
        4096 && div_class_value !== (div_class_value = twMerge(
          "p-6 space-y-6 flex-1 overflow-y-auto overscroll-contain",
          /*$$props*/
          ctx2[12].bodyClass
        ))) {
          attr(div, "class", div_class_value);
        }
        if (
          /*$$slots*/
          ctx2[14].footer
        ) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
            if (dirty & /*$$slots*/
            16384) {
              transition_in(if_block1, 1);
            }
          } else {
            if_block1 = create_if_block_1(ctx2);
            if_block1.c();
            transition_in(if_block1, 1);
            if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
          }
        } else if (if_block1) {
          group_outros();
          transition_out(if_block1, 1, 1, () => {
            if_block1 = null;
          });
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block0);
        transition_in(default_slot, local);
        transition_in(if_block1);
        current = true;
      },
      o(local) {
        transition_out(if_block0);
        transition_out(default_slot, local);
        transition_out(if_block1);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(t0);
          detach(div);
          detach(t1);
          detach(if_block1_anchor);
        }
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].d(detaching);
        }
        if (default_slot)
          default_slot.d(detaching);
        if (if_block1)
          if_block1.d(detaching);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_fragment$b(ctx) {
    let if_block_anchor;
    let current;
    let if_block = (
      /*open*/
      ctx[0] && create_if_block$4(ctx)
    );
    return {
      c() {
        if (if_block)
          if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if (if_block)
          if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        if (
          /*open*/
          ctx2[0]
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
            if (dirty & /*open*/
            1) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block$4(ctx2);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if (if_block)
          if_block.d(detaching);
      }
    };
  }
  function instance$b($$self, $$props, $$invalidate) {
    const omit_props_names = [
      "open",
      "title",
      "size",
      "placement",
      "autoclose",
      "permanent",
      "backdropClass",
      "defaultClass",
      "outsideclose"
    ];
    let $$restProps = compute_rest_props($$props, omit_props_names);
    let { $$slots: slots = {}, $$scope } = $$props;
    const $$slots = compute_slots(slots);
    let { open = false } = $$props;
    let { title = "" } = $$props;
    let { size = "md" } = $$props;
    let { placement = "center" } = $$props;
    let { autoclose = false } = $$props;
    let { permanent = false } = $$props;
    let { backdropClass = "bg-gray-900 bg-opacity-50 dark:bg-opacity-80" } = $$props;
    let { defaultClass = "relative flex flex-col mx-auto" } = $$props;
    let { outsideclose = false } = $$props;
    const dispatch2 = createEventDispatcher();
    function prepareFocus(node) {
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT);
      let n;
      while (n = walker.nextNode()) {
        if (n instanceof HTMLElement) {
          const el = n;
          const [x, y] = isScrollable(el);
          if (x || y)
            el.tabIndex = 0;
        }
      }
      node.focus();
    }
    const getPlacementClasses = () => {
      switch (placement) {
        case "top-left":
          return ["justify-start", "items-start"];
        case "top-center":
          return ["justify-center", "items-start"];
        case "top-right":
          return ["justify-end", "items-start"];
        case "center-left":
          return ["justify-start", "items-center"];
        case "center":
          return ["justify-center", "items-center"];
        case "center-right":
          return ["justify-end", "items-center"];
        case "bottom-left":
          return ["justify-start", "items-end"];
        case "bottom-center":
          return ["justify-center", "items-end"];
        case "bottom-right":
          return ["justify-end", "items-end"];
        default:
          return ["justify-center", "items-center"];
      }
    };
    const sizes = {
      xs: "max-w-md",
      sm: "max-w-lg",
      md: "max-w-2xl",
      lg: "max-w-4xl",
      xl: "max-w-7xl"
    };
    const onAutoClose = (e) => {
      const target = e.target;
      if (autoclose && (target == null ? void 0 : target.tagName) === "BUTTON")
        hide(e);
      if (outsideclose && target === e.currentTarget)
        hide(e);
    };
    const hide = (e) => {
      e.preventDefault();
      $$invalidate(0, open = false);
    };
    let frameClass;
    const isScrollable = (e) => [
      e.scrollWidth > e.clientWidth && ["scroll", "auto"].indexOf(getComputedStyle(e).overflowX) >= 0,
      e.scrollHeight > e.clientHeight && ["scroll", "auto"].indexOf(getComputedStyle(e).overflowY) >= 0
    ];
    let backdropCls = twMerge(backdropClass, $$props.classBackdrop);
    function handleKeys(e) {
      if (e.key === "Escape" && !permanent)
        return hide(e);
    }
    function wheel_handler(event) {
      bubble.call(this, $$self, event);
    }
    function wheel_handler_1(event) {
      bubble.call(this, $$self, event);
    }
    $$self.$$set = ($$new_props) => {
      $$invalidate(12, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      $$invalidate(13, $$restProps = compute_rest_props($$props, omit_props_names));
      if ("open" in $$new_props)
        $$invalidate(0, open = $$new_props.open);
      if ("title" in $$new_props)
        $$invalidate(1, title = $$new_props.title);
      if ("size" in $$new_props)
        $$invalidate(2, size = $$new_props.size);
      if ("placement" in $$new_props)
        $$invalidate(15, placement = $$new_props.placement);
      if ("autoclose" in $$new_props)
        $$invalidate(16, autoclose = $$new_props.autoclose);
      if ("permanent" in $$new_props)
        $$invalidate(3, permanent = $$new_props.permanent);
      if ("backdropClass" in $$new_props)
        $$invalidate(17, backdropClass = $$new_props.backdropClass);
      if ("defaultClass" in $$new_props)
        $$invalidate(18, defaultClass = $$new_props.defaultClass);
      if ("outsideclose" in $$new_props)
        $$invalidate(19, outsideclose = $$new_props.outsideclose);
      if ("$$scope" in $$new_props)
        $$invalidate(23, $$scope = $$new_props.$$scope);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*open*/
      1) {
        dispatch2(open ? "open" : "hide");
      }
      $$invalidate(4, frameClass = twMerge(defaultClass, "w-full", $$props.class));
    };
    $$props = exclude_internal_props($$props);
    return [
      open,
      title,
      size,
      permanent,
      frameClass,
      prepareFocus,
      getPlacementClasses,
      sizes,
      onAutoClose,
      hide,
      backdropCls,
      handleKeys,
      $$props,
      $$restProps,
      $$slots,
      placement,
      autoclose,
      backdropClass,
      defaultClass,
      outsideclose,
      slots,
      wheel_handler,
      wheel_handler_1,
      $$scope
    ];
  }
  class Modal extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$b, create_fragment$b, safe_not_equal, {
        open: 0,
        title: 1,
        size: 2,
        placement: 15,
        autoclose: 16,
        permanent: 3,
        backdropClass: 17,
        defaultClass: 18,
        outsideclose: 19
      });
    }
  }
  function create_fragment$a(ctx) {
    let svg;
    let path0;
    let path1;
    let svg_class_value;
    return {
      c() {
        svg = svg_element("svg");
        path0 = svg_element("path");
        path1 = svg_element("path");
        attr(path0, "d", "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z");
        attr(
          path0,
          "fill",
          /*currentColor*/
          ctx[2]
        );
        attr(path1, "d", "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z");
        attr(
          path1,
          "fill",
          /*currentFill*/
          ctx[1]
        );
        attr(svg, "role", "status");
        attr(svg, "class", svg_class_value = twMerge(
          "inline -mt-px animate-spin dark:text-gray-600",
          /*iconsize*/
          ctx[3],
          /*bg*/
          ctx[0],
          /*fillColorClass*/
          ctx[4],
          /*$$props*/
          ctx[5].class
        ));
        attr(svg, "viewBox", "0 0 100 101");
        attr(svg, "fill", "none");
        attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      },
      m(target, anchor) {
        insert(target, svg, anchor);
        append(svg, path0);
        append(svg, path1);
      },
      p(ctx2, [dirty]) {
        if (dirty & /*currentColor*/
        4) {
          attr(
            path0,
            "fill",
            /*currentColor*/
            ctx2[2]
          );
        }
        if (dirty & /*currentFill*/
        2) {
          attr(
            path1,
            "fill",
            /*currentFill*/
            ctx2[1]
          );
        }
        if (dirty & /*bg, $$props*/
        33 && svg_class_value !== (svg_class_value = twMerge(
          "inline -mt-px animate-spin dark:text-gray-600",
          /*iconsize*/
          ctx2[3],
          /*bg*/
          ctx2[0],
          /*fillColorClass*/
          ctx2[4],
          /*$$props*/
          ctx2[5].class
        ))) {
          attr(svg, "class", svg_class_value);
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(svg);
        }
      }
    };
  }
  function instance$a($$self, $$props, $$invalidate) {
    let { color = "primary" } = $$props;
    let { bg = "text-gray-300" } = $$props;
    let { customColor = "" } = $$props;
    let { size = "8" } = $$props;
    let { currentFill = "currentFill" } = $$props;
    let { currentColor = "currentColor" } = $$props;
    let iconsize = `w-${size} h-${size}`;
    if (currentFill !== "currentFill") {
      color = void 0;
    }
    const fillColorClasses = {
      primary: "fill-primary-600",
      blue: "fill-blue-600",
      gray: "fill-gray-600 dark:fill-gray-300",
      green: "fill-green-500",
      red: "fill-red-600",
      yellow: "fill-yellow-400",
      pink: "fill-pink-600",
      purple: "fill-purple-600",
      white: "fill-white",
      custom: customColor
    };
    let fillColorClass = color === void 0 ? "" : fillColorClasses[color] ?? fillColorClasses.blue;
    $$self.$$set = ($$new_props) => {
      $$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      if ("color" in $$new_props)
        $$invalidate(6, color = $$new_props.color);
      if ("bg" in $$new_props)
        $$invalidate(0, bg = $$new_props.bg);
      if ("customColor" in $$new_props)
        $$invalidate(7, customColor = $$new_props.customColor);
      if ("size" in $$new_props)
        $$invalidate(8, size = $$new_props.size);
      if ("currentFill" in $$new_props)
        $$invalidate(1, currentFill = $$new_props.currentFill);
      if ("currentColor" in $$new_props)
        $$invalidate(2, currentColor = $$new_props.currentColor);
    };
    $$props = exclude_internal_props($$props);
    return [
      bg,
      currentFill,
      currentColor,
      iconsize,
      fillColorClass,
      $$props,
      color,
      customColor,
      size
    ];
  }
  class Spinner extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$a, create_fragment$a, safe_not_equal, {
        color: 6,
        bg: 0,
        customColor: 7,
        size: 8,
        currentFill: 1,
        currentColor: 2
      });
    }
  }
  function create_fragment$9(ctx) {
    let div;
    let table;
    let table_class_value;
    let div_class_value;
    let current;
    const default_slot_template = (
      /*#slots*/
      ctx[11].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[10],
      null
    );
    let table_levels = [
      /*$$restProps*/
      ctx[4],
      {
        class: table_class_value = twMerge(
          "w-full text-left text-sm",
          /*colors*/
          ctx[3][
            /*color*/
            ctx[2]
          ],
          /*$$props*/
          ctx[5].class
        )
      }
    ];
    let table_data = {};
    for (let i = 0; i < table_levels.length; i += 1) {
      table_data = assign(table_data, table_levels[i]);
    }
    return {
      c() {
        div = element("div");
        table = element("table");
        if (default_slot)
          default_slot.c();
        set_attributes(table, table_data);
        attr(div, "class", div_class_value = twJoin(
          /*divClass*/
          ctx[0],
          /*shadow*/
          ctx[1] && "shadow-md sm:rounded-lg"
        ));
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, table);
        if (default_slot) {
          default_slot.m(table, null);
        }
        current = true;
      },
      p(ctx2, [dirty]) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          1024)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[10],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[10]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[10],
                dirty,
                null
              ),
              null
            );
          }
        }
        set_attributes(table, table_data = get_spread_update(table_levels, [
          dirty & /*$$restProps*/
          16 && /*$$restProps*/
          ctx2[4],
          (!current || dirty & /*color, $$props*/
          36 && table_class_value !== (table_class_value = twMerge(
            "w-full text-left text-sm",
            /*colors*/
            ctx2[3][
              /*color*/
              ctx2[2]
            ],
            /*$$props*/
            ctx2[5].class
          ))) && { class: table_class_value }
        ]));
        if (!current || dirty & /*divClass, shadow*/
        3 && div_class_value !== (div_class_value = twJoin(
          /*divClass*/
          ctx2[0],
          /*shadow*/
          ctx2[1] && "shadow-md sm:rounded-lg"
        ))) {
          attr(div, "class", div_class_value);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        if (default_slot)
          default_slot.d(detaching);
      }
    };
  }
  function instance$9($$self, $$props, $$invalidate) {
    const omit_props_names = ["divClass", "striped", "hoverable", "noborder", "shadow", "color", "customeColor"];
    let $$restProps = compute_rest_props($$props, omit_props_names);
    let { $$slots: slots = {}, $$scope } = $$props;
    let { divClass = "relative overflow-x-auto" } = $$props;
    let { striped = false } = $$props;
    let { hoverable = false } = $$props;
    let { noborder = false } = $$props;
    let { shadow = false } = $$props;
    let { color = "default" } = $$props;
    let { customeColor = "" } = $$props;
    const colors = {
      default: "text-gray-500 dark:text-gray-400",
      blue: "text-blue-100 dark:text-blue-100",
      green: "text-green-100 dark:text-green-100",
      red: "text-red-100 dark:text-red-100",
      yellow: "text-yellow-100 dark:text-yellow-100",
      purple: "text-purple-100 dark:text-purple-100",
      indigo: "text-indigo-100 dark:text-indigo-100",
      pink: "text-pink-100 dark:text-pink-100",
      custom: customeColor
    };
    $$self.$$set = ($$new_props) => {
      $$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      $$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
      if ("divClass" in $$new_props)
        $$invalidate(0, divClass = $$new_props.divClass);
      if ("striped" in $$new_props)
        $$invalidate(6, striped = $$new_props.striped);
      if ("hoverable" in $$new_props)
        $$invalidate(7, hoverable = $$new_props.hoverable);
      if ("noborder" in $$new_props)
        $$invalidate(8, noborder = $$new_props.noborder);
      if ("shadow" in $$new_props)
        $$invalidate(1, shadow = $$new_props.shadow);
      if ("color" in $$new_props)
        $$invalidate(2, color = $$new_props.color);
      if ("customeColor" in $$new_props)
        $$invalidate(9, customeColor = $$new_props.customeColor);
      if ("$$scope" in $$new_props)
        $$invalidate(10, $$scope = $$new_props.$$scope);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*striped*/
      64) {
        setContext("striped", striped);
      }
      if ($$self.$$.dirty & /*hoverable*/
      128) {
        setContext("hoverable", hoverable);
      }
      if ($$self.$$.dirty & /*noborder*/
      256) {
        setContext("noborder", noborder);
      }
      if ($$self.$$.dirty & /*color*/
      4) {
        setContext("color", color);
      }
    };
    $$props = exclude_internal_props($$props);
    return [
      divClass,
      shadow,
      color,
      colors,
      $$restProps,
      $$props,
      striped,
      hoverable,
      noborder,
      customeColor,
      $$scope,
      slots
    ];
  }
  class Table extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$9, create_fragment$9, safe_not_equal, {
        divClass: 0,
        striped: 6,
        hoverable: 7,
        noborder: 8,
        shadow: 1,
        color: 2,
        customeColor: 9
      });
    }
  }
  function create_fragment$8(ctx) {
    let tbody;
    let current;
    const default_slot_template = (
      /*#slots*/
      ctx[2].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[1],
      null
    );
    return {
      c() {
        tbody = element("tbody");
        if (default_slot)
          default_slot.c();
        attr(
          tbody,
          "class",
          /*tableBodyClass*/
          ctx[0]
        );
      },
      m(target, anchor) {
        insert(target, tbody, anchor);
        if (default_slot) {
          default_slot.m(tbody, null);
        }
        current = true;
      },
      p(ctx2, [dirty]) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          2)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[1],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[1]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[1],
                dirty,
                null
              ),
              null
            );
          }
        }
        if (!current || dirty & /*tableBodyClass*/
        1) {
          attr(
            tbody,
            "class",
            /*tableBodyClass*/
            ctx2[0]
          );
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(tbody);
        }
        if (default_slot)
          default_slot.d(detaching);
      }
    };
  }
  function instance$8($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    let { tableBodyClass = void 0 } = $$props;
    $$self.$$set = ($$props2) => {
      if ("tableBodyClass" in $$props2)
        $$invalidate(0, tableBodyClass = $$props2.tableBodyClass);
      if ("$$scope" in $$props2)
        $$invalidate(1, $$scope = $$props2.$$scope);
    };
    return [tableBodyClass, $$scope, slots];
  }
  class TableBody extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$8, create_fragment$8, safe_not_equal, { tableBodyClass: 0 });
    }
  }
  function create_dynamic_element(ctx) {
    let svelte_element;
    let svelte_element_role_value;
    let current;
    let mounted;
    let dispose;
    const default_slot_template = (
      /*#slots*/
      ctx[6].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[5],
      null
    );
    let svelte_element_levels = [
      /*$$restProps*/
      ctx[2],
      { class: (
        /*tdClassfinal*/
        ctx[0]
      ) },
      {
        role: svelte_element_role_value = /*$$props*/
        ctx[1].onclick ? "button" : void 0
      }
    ];
    let svelte_element_data = {};
    for (let i = 0; i < svelte_element_levels.length; i += 1) {
      svelte_element_data = assign(svelte_element_data, svelte_element_levels[i]);
    }
    return {
      c() {
        svelte_element = element(
          /*$$props*/
          ctx[1].onclick ? "button" : "td"
        );
        if (default_slot)
          default_slot.c();
        set_dynamic_element_data(
          /*$$props*/
          ctx[1].onclick ? "button" : "td"
        )(svelte_element, svelte_element_data);
      },
      m(target, anchor) {
        insert(target, svelte_element, anchor);
        if (default_slot) {
          default_slot.m(svelte_element, null);
        }
        current = true;
        if (!mounted) {
          dispose = listen(
            svelte_element,
            "click",
            /*click_handler*/
            ctx[7]
          );
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          32)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[5],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[5]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[5],
                dirty,
                null
              ),
              null
            );
          }
        }
        set_dynamic_element_data(
          /*$$props*/
          ctx2[1].onclick ? "button" : "td"
        )(svelte_element, svelte_element_data = get_spread_update(svelte_element_levels, [
          dirty & /*$$restProps*/
          4 && /*$$restProps*/
          ctx2[2],
          (!current || dirty & /*tdClassfinal*/
          1) && { class: (
            /*tdClassfinal*/
            ctx2[0]
          ) },
          (!current || dirty & /*$$props*/
          2 && svelte_element_role_value !== (svelte_element_role_value = /*$$props*/
          ctx2[1].onclick ? "button" : void 0)) && { role: svelte_element_role_value }
        ]));
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(svelte_element);
        }
        if (default_slot)
          default_slot.d(detaching);
        mounted = false;
        dispose();
      }
    };
  }
  function create_fragment$7(ctx) {
    let previous_tag = (
      /*$$props*/
      ctx[1].onclick ? "button" : "td"
    );
    let svelte_element_anchor;
    let current;
    let svelte_element = (
      /*$$props*/
      (ctx[1].onclick ? "button" : "td") && create_dynamic_element(ctx)
    );
    return {
      c() {
        if (svelte_element)
          svelte_element.c();
        svelte_element_anchor = empty();
      },
      m(target, anchor) {
        if (svelte_element)
          svelte_element.m(target, anchor);
        insert(target, svelte_element_anchor, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        if (
          /*$$props*/
          ctx2[1].onclick ? "button" : "td"
        ) {
          if (!previous_tag) {
            svelte_element = create_dynamic_element(ctx2);
            previous_tag = /*$$props*/
            ctx2[1].onclick ? "button" : "td";
            svelte_element.c();
            svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
          } else if (safe_not_equal(
            previous_tag,
            /*$$props*/
            ctx2[1].onclick ? "button" : "td"
          )) {
            svelte_element.d(1);
            svelte_element = create_dynamic_element(ctx2);
            previous_tag = /*$$props*/
            ctx2[1].onclick ? "button" : "td";
            svelte_element.c();
            svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
          } else {
            svelte_element.p(ctx2, dirty);
          }
        } else if (previous_tag) {
          svelte_element.d(1);
          svelte_element = null;
          previous_tag = /*$$props*/
          ctx2[1].onclick ? "button" : "td";
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(svelte_element, local);
        current = true;
      },
      o(local) {
        transition_out(svelte_element, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(svelte_element_anchor);
        }
        if (svelte_element)
          svelte_element.d(detaching);
      }
    };
  }
  function instance$7($$self, $$props, $$invalidate) {
    const omit_props_names = ["tdClass"];
    let $$restProps = compute_rest_props($$props, omit_props_names);
    let { $$slots: slots = {}, $$scope } = $$props;
    let { tdClass = "px-6 py-4 whitespace-nowrap font-medium " } = $$props;
    let color = "default";
    color = getContext("color");
    let tdClassfinal;
    function click_handler(event) {
      bubble.call(this, $$self, event);
    }
    $$self.$$set = ($$new_props) => {
      $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      $$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
      if ("tdClass" in $$new_props)
        $$invalidate(3, tdClass = $$new_props.tdClass);
      if ("$$scope" in $$new_props)
        $$invalidate(5, $$scope = $$new_props.$$scope);
    };
    $$self.$$.update = () => {
      $$invalidate(0, tdClassfinal = twMerge(
        tdClass,
        color === "default" ? "text-gray-900 dark:text-white" : "text-blue-50 whitespace-nowrap dark:text-blue-100",
        $$props.class
      ));
    };
    $$props = exclude_internal_props($$props);
    return [
      tdClassfinal,
      $$props,
      $$restProps,
      tdClass,
      color,
      $$scope,
      slots,
      click_handler
    ];
  }
  class TableBodyCell extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$7, create_fragment$7, safe_not_equal, { tdClass: 3 });
    }
  }
  function create_fragment$6(ctx) {
    let tr;
    let current;
    let mounted;
    let dispose;
    const default_slot_template = (
      /*#slots*/
      ctx[4].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[3],
      null
    );
    let tr_levels = [
      /*$$restProps*/
      ctx[1],
      { class: (
        /*trClass*/
        ctx[0]
      ) }
    ];
    let tr_data = {};
    for (let i = 0; i < tr_levels.length; i += 1) {
      tr_data = assign(tr_data, tr_levels[i]);
    }
    return {
      c() {
        tr = element("tr");
        if (default_slot)
          default_slot.c();
        set_attributes(tr, tr_data);
      },
      m(target, anchor) {
        insert(target, tr, anchor);
        if (default_slot) {
          default_slot.m(tr, null);
        }
        current = true;
        if (!mounted) {
          dispose = [
            listen(
              tr,
              "click",
              /*click_handler*/
              ctx[5]
            ),
            listen(
              tr,
              "contextmenu",
              /*contextmenu_handler*/
              ctx[6]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          8)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[3],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[3]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[3],
                dirty,
                null
              ),
              null
            );
          }
        }
        set_attributes(tr, tr_data = get_spread_update(tr_levels, [
          dirty & /*$$restProps*/
          2 && /*$$restProps*/
          ctx2[1],
          (!current || dirty & /*trClass*/
          1) && { class: (
            /*trClass*/
            ctx2[0]
          ) }
        ]));
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(tr);
        }
        if (default_slot)
          default_slot.d(detaching);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function instance$6($$self, $$props, $$invalidate) {
    const omit_props_names = ["color"];
    let $$restProps = compute_rest_props($$props, omit_props_names);
    let { $$slots: slots = {}, $$scope } = $$props;
    let { color = getContext("color") } = $$props;
    const colors = {
      default: "bg-white dark:bg-gray-800 dark:border-gray-700",
      blue: "bg-blue-500 border-blue-400",
      green: "bg-green-500 border-green-400",
      red: "bg-red-500 border-red-400",
      yellow: "bg-yellow-500 border-yellow-400",
      purple: "bg-purple-500 border-purple-400",
      custom: ""
    };
    const hoverColors = {
      default: "hover:bg-gray-50 dark:hover:bg-gray-600",
      blue: "hover:bg-blue-400",
      green: "hover:bg-green-400",
      red: "hover:bg-red-400",
      yellow: "hover:bg-yellow-400",
      purple: "hover:bg-purple-400",
      custom: ""
    };
    const stripColors = {
      default: "odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700",
      blue: "odd:bg-blue-800 even:bg-blue-700 odd:dark:bg-blue-800 even:dark:bg-blue-700",
      green: "odd:bg-green-800 even:bg-green-700 odd:dark:bg-green-800 even:dark:bg-green-700",
      red: "odd:bg-red-800 even:bg-red-700 odd:dark:bg-red-800 even:dark:bg-red-700",
      yellow: "odd:bg-yellow-800 even:bg-yellow-700 odd:dark:bg-yellow-800 even:dark:bg-yellow-700",
      purple: "odd:bg-purple-800 even:bg-purple-700 odd:dark:bg-purple-800 even:dark:bg-purple-700",
      custom: ""
    };
    let trClass;
    function click_handler(event) {
      bubble.call(this, $$self, event);
    }
    function contextmenu_handler(event) {
      bubble.call(this, $$self, event);
    }
    $$self.$$set = ($$new_props) => {
      $$invalidate(10, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      $$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
      if ("color" in $$new_props)
        $$invalidate(2, color = $$new_props.color);
      if ("$$scope" in $$new_props)
        $$invalidate(3, $$scope = $$new_props.$$scope);
    };
    $$self.$$.update = () => {
      $$invalidate(0, trClass = twMerge([
        !getContext("noborder") && "border-b last:border-b-0",
        colors[color],
        getContext("hoverable") && hoverColors[color],
        getContext("striped") && stripColors[color],
        $$props.class
      ]));
    };
    $$props = exclude_internal_props($$props);
    return [
      trClass,
      $$restProps,
      color,
      $$scope,
      slots,
      click_handler,
      contextmenu_handler
    ];
  }
  class TableBodyRow extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$6, create_fragment$6, safe_not_equal, { color: 2 });
    }
  }
  function create_else_block(ctx) {
    let current;
    const default_slot_template = (
      /*#slots*/
      ctx[6].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[5],
      null
    );
    return {
      c() {
        if (default_slot)
          default_slot.c();
      },
      m(target, anchor) {
        if (default_slot) {
          default_slot.m(target, anchor);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          32)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[5],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[5]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[5],
                dirty,
                null
              ),
              null
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (default_slot)
          default_slot.d(detaching);
      }
    };
  }
  function create_if_block$3(ctx) {
    let tr;
    let current;
    const default_slot_template = (
      /*#slots*/
      ctx[6].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[5],
      null
    );
    return {
      c() {
        tr = element("tr");
        if (default_slot)
          default_slot.c();
      },
      m(target, anchor) {
        insert(target, tr, anchor);
        if (default_slot) {
          default_slot.m(tr, null);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          32)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[5],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[5]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[5],
                dirty,
                null
              ),
              null
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(tr);
        }
        if (default_slot)
          default_slot.d(detaching);
      }
    };
  }
  function create_fragment$5(ctx) {
    let thead;
    let current_block_type_index;
    let if_block;
    let current;
    const if_block_creators = [create_if_block$3, create_else_block];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      if (
        /*defaultRow*/
        ctx2[0]
      )
        return 0;
      return 1;
    }
    current_block_type_index = select_block_type(ctx);
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    let thead_levels = [
      /*$$restProps*/
      ctx[2],
      { class: (
        /*theadClassfinal*/
        ctx[1]
      ) }
    ];
    let thead_data = {};
    for (let i = 0; i < thead_levels.length; i += 1) {
      thead_data = assign(thead_data, thead_levels[i]);
    }
    return {
      c() {
        thead = element("thead");
        if_block.c();
        set_attributes(thead, thead_data);
      },
      m(target, anchor) {
        insert(target, thead, anchor);
        if_blocks[current_block_type_index].m(thead, null);
        current = true;
      },
      p(ctx2, [dirty]) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(thead, null);
        }
        set_attributes(thead, thead_data = get_spread_update(thead_levels, [
          dirty & /*$$restProps*/
          4 && /*$$restProps*/
          ctx2[2],
          (!current || dirty & /*theadClassfinal*/
          2) && { class: (
            /*theadClassfinal*/
            ctx2[1]
          ) }
        ]));
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(thead);
        }
        if_blocks[current_block_type_index].d();
      }
    };
  }
  function instance$5($$self, $$props, $$invalidate) {
    let theadClassfinal;
    const omit_props_names = ["theadClass", "defaultRow"];
    let $$restProps = compute_rest_props($$props, omit_props_names);
    let { $$slots: slots = {}, $$scope } = $$props;
    let { theadClass = "text-xs uppercase" } = $$props;
    let { defaultRow = true } = $$props;
    let color;
    color = getContext("color");
    let noborder = getContext("noborder");
    let striped = getContext("striped");
    let defaultBgColor = noborder || striped ? "" : "bg-gray-50 dark:bg-gray-700";
    const bgColors = {
      default: defaultBgColor,
      blue: "bg-blue-600",
      green: "bg-green-600",
      red: "bg-red-600",
      yellow: "bg-yellow-600",
      purple: "bg-purple-600",
      custom: ""
    };
    let textColor = color === "default" ? "text-gray-700 dark:text-gray-400" : color === "custom" ? "" : "text-white  dark:text-white";
    let borderColors = striped ? "" : color === "default" ? "border-gray-700" : color === "custom" ? "" : `border-${color}-400`;
    $$self.$$set = ($$new_props) => {
      $$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      $$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
      if ("theadClass" in $$new_props)
        $$invalidate(3, theadClass = $$new_props.theadClass);
      if ("defaultRow" in $$new_props)
        $$invalidate(0, defaultRow = $$new_props.defaultRow);
      if ("$$scope" in $$new_props)
        $$invalidate(5, $$scope = $$new_props.$$scope);
    };
    $$self.$$.update = () => {
      $$invalidate(1, theadClassfinal = twMerge(theadClass, textColor, striped && borderColors, bgColors[color], $$props.class));
    };
    $$props = exclude_internal_props($$props);
    return [defaultRow, theadClassfinal, $$restProps, theadClass, color, $$scope, slots];
  }
  class TableHead extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$5, create_fragment$5, safe_not_equal, { theadClass: 3, defaultRow: 0 });
    }
  }
  function create_fragment$4(ctx) {
    let th;
    let th_class_value;
    let current;
    let mounted;
    let dispose;
    const default_slot_template = (
      /*#slots*/
      ctx[4].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[3],
      null
    );
    let th_levels = [
      /*$$restProps*/
      ctx[1],
      {
        class: th_class_value = twMerge(
          /*padding*/
          ctx[0],
          /*$$props*/
          ctx[2].class
        )
      }
    ];
    let th_data = {};
    for (let i = 0; i < th_levels.length; i += 1) {
      th_data = assign(th_data, th_levels[i]);
    }
    return {
      c() {
        th = element("th");
        if (default_slot)
          default_slot.c();
        set_attributes(th, th_data);
      },
      m(target, anchor) {
        insert(target, th, anchor);
        if (default_slot) {
          default_slot.m(th, null);
        }
        current = true;
        if (!mounted) {
          dispose = [
            listen(
              th,
              "click",
              /*click_handler*/
              ctx[5]
            ),
            listen(
              th,
              "focus",
              /*focus_handler*/
              ctx[6]
            ),
            listen(
              th,
              "keydown",
              /*keydown_handler*/
              ctx[7]
            ),
            listen(
              th,
              "keypress",
              /*keypress_handler*/
              ctx[8]
            ),
            listen(
              th,
              "keyup",
              /*keyup_handler*/
              ctx[9]
            ),
            listen(
              th,
              "mouseenter",
              /*mouseenter_handler*/
              ctx[10]
            ),
            listen(
              th,
              "mouseleave",
              /*mouseleave_handler*/
              ctx[11]
            ),
            listen(
              th,
              "mouseover",
              /*mouseover_handler*/
              ctx[12]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          8)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[3],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[3]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[3],
                dirty,
                null
              ),
              null
            );
          }
        }
        set_attributes(th, th_data = get_spread_update(th_levels, [
          dirty & /*$$restProps*/
          2 && /*$$restProps*/
          ctx2[1],
          (!current || dirty & /*padding, $$props*/
          5 && th_class_value !== (th_class_value = twMerge(
            /*padding*/
            ctx2[0],
            /*$$props*/
            ctx2[2].class
          ))) && { class: th_class_value }
        ]));
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(th);
        }
        if (default_slot)
          default_slot.d(detaching);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function instance$4($$self, $$props, $$invalidate) {
    const omit_props_names = ["padding"];
    let $$restProps = compute_rest_props($$props, omit_props_names);
    let { $$slots: slots = {}, $$scope } = $$props;
    let { padding = "px-6 py-3" } = $$props;
    function click_handler(event) {
      bubble.call(this, $$self, event);
    }
    function focus_handler(event) {
      bubble.call(this, $$self, event);
    }
    function keydown_handler(event) {
      bubble.call(this, $$self, event);
    }
    function keypress_handler(event) {
      bubble.call(this, $$self, event);
    }
    function keyup_handler(event) {
      bubble.call(this, $$self, event);
    }
    function mouseenter_handler(event) {
      bubble.call(this, $$self, event);
    }
    function mouseleave_handler(event) {
      bubble.call(this, $$self, event);
    }
    function mouseover_handler(event) {
      bubble.call(this, $$self, event);
    }
    $$self.$$set = ($$new_props) => {
      $$invalidate(2, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      $$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
      if ("padding" in $$new_props)
        $$invalidate(0, padding = $$new_props.padding);
      if ("$$scope" in $$new_props)
        $$invalidate(3, $$scope = $$new_props.$$scope);
    };
    $$props = exclude_internal_props($$props);
    return [
      padding,
      $$restProps,
      $$props,
      $$scope,
      slots,
      click_handler,
      focus_handler,
      keydown_handler,
      keypress_handler,
      keyup_handler,
      mouseenter_handler,
      mouseleave_handler,
      mouseover_handler
    ];
  }
  class TableHeadCell extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$4, create_fragment$4, safe_not_equal, { padding: 0 });
    }
  }
  const get_title_slot_changes = (dirty) => ({});
  const get_title_slot_context = (ctx) => ({});
  function fallback_block$1(ctx) {
    let t;
    return {
      c() {
        t = text(
          /*title*/
          ctx[1]
        );
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      p(ctx2, dirty) {
        if (dirty & /*title*/
        2)
          set_data(
            t,
            /*title*/
            ctx2[1]
          );
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
      }
    };
  }
  function create_if_block$2(ctx) {
    let div1;
    let div0;
    let current;
    let mounted;
    let dispose;
    const default_slot_template = (
      /*#slots*/
      ctx[10].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[9],
      null
    );
    return {
      c() {
        div1 = element("div");
        div0 = element("div");
        if (default_slot)
          default_slot.c();
        attr(div1, "class", "hidden tab_content_placeholder");
      },
      m(target, anchor) {
        insert(target, div1, anchor);
        append(div1, div0);
        if (default_slot) {
          default_slot.m(div0, null);
        }
        current = true;
        if (!mounted) {
          dispose = action_destroyer(
            /*init*/
            ctx[3].call(null, div0)
          );
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          512)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[9],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[9]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[9],
                dirty,
                null
              ),
              null
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div1);
        }
        if (default_slot)
          default_slot.d(detaching);
        mounted = false;
        dispose();
      }
    };
  }
  function create_fragment$3(ctx) {
    let li;
    let button;
    let t;
    let li_class_value;
    let current;
    let mounted;
    let dispose;
    const title_slot_template = (
      /*#slots*/
      ctx[10].title
    );
    const title_slot = create_slot(
      title_slot_template,
      ctx,
      /*$$scope*/
      ctx[9],
      get_title_slot_context
    );
    const title_slot_or_fallback = title_slot || fallback_block$1(ctx);
    let button_levels = [
      { type: "button" },
      { role: "tab" },
      /*$$restProps*/
      ctx[5],
      { class: (
        /*buttonClass*/
        ctx[2]
      ) }
    ];
    let button_data = {};
    for (let i = 0; i < button_levels.length; i += 1) {
      button_data = assign(button_data, button_levels[i]);
    }
    let if_block = (
      /*open*/
      ctx[0] && create_if_block$2(ctx)
    );
    return {
      c() {
        li = element("li");
        button = element("button");
        if (title_slot_or_fallback)
          title_slot_or_fallback.c();
        t = space();
        if (if_block)
          if_block.c();
        set_attributes(button, button_data);
        attr(li, "class", li_class_value = twMerge(
          "group",
          /*$$props*/
          ctx[4].class
        ));
        attr(li, "role", "presentation");
      },
      m(target, anchor) {
        insert(target, li, anchor);
        append(li, button);
        if (title_slot_or_fallback) {
          title_slot_or_fallback.m(button, null);
        }
        if (button.autofocus)
          button.focus();
        append(li, t);
        if (if_block)
          if_block.m(li, null);
        current = true;
        if (!mounted) {
          dispose = [
            listen(
              button,
              "click",
              /*click_handler_1*/
              ctx[21]
            ),
            listen(
              button,
              "blur",
              /*blur_handler*/
              ctx[11]
            ),
            listen(
              button,
              "click",
              /*click_handler*/
              ctx[12]
            ),
            listen(
              button,
              "contextmenu",
              /*contextmenu_handler*/
              ctx[13]
            ),
            listen(
              button,
              "focus",
              /*focus_handler*/
              ctx[14]
            ),
            listen(
              button,
              "keydown",
              /*keydown_handler*/
              ctx[15]
            ),
            listen(
              button,
              "keypress",
              /*keypress_handler*/
              ctx[16]
            ),
            listen(
              button,
              "keyup",
              /*keyup_handler*/
              ctx[17]
            ),
            listen(
              button,
              "mouseenter",
              /*mouseenter_handler*/
              ctx[18]
            ),
            listen(
              button,
              "mouseleave",
              /*mouseleave_handler*/
              ctx[19]
            ),
            listen(
              button,
              "mouseover",
              /*mouseover_handler*/
              ctx[20]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (title_slot) {
          if (title_slot.p && (!current || dirty & /*$$scope*/
          512)) {
            update_slot_base(
              title_slot,
              title_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[9],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[9]
              ) : get_slot_changes(
                title_slot_template,
                /*$$scope*/
                ctx2[9],
                dirty,
                get_title_slot_changes
              ),
              get_title_slot_context
            );
          }
        } else {
          if (title_slot_or_fallback && title_slot_or_fallback.p && (!current || dirty & /*title*/
          2)) {
            title_slot_or_fallback.p(ctx2, !current ? -1 : dirty);
          }
        }
        set_attributes(button, button_data = get_spread_update(button_levels, [
          { type: "button" },
          { role: "tab" },
          dirty & /*$$restProps*/
          32 && /*$$restProps*/
          ctx2[5],
          (!current || dirty & /*buttonClass*/
          4) && { class: (
            /*buttonClass*/
            ctx2[2]
          ) }
        ]));
        if (
          /*open*/
          ctx2[0]
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
            if (dirty & /*open*/
            1) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block$2(ctx2);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(li, null);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
        if (!current || dirty & /*$$props*/
        16 && li_class_value !== (li_class_value = twMerge(
          "group",
          /*$$props*/
          ctx2[4].class
        ))) {
          attr(li, "class", li_class_value);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(title_slot_or_fallback, local);
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(title_slot_or_fallback, local);
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(li);
        }
        if (title_slot_or_fallback)
          title_slot_or_fallback.d(detaching);
        if (if_block)
          if_block.d();
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function instance$3($$self, $$props, $$invalidate) {
    const omit_props_names = ["open", "title", "activeClasses", "inactiveClasses", "defaultClass"];
    let $$restProps = compute_rest_props($$props, omit_props_names);
    let { $$slots: slots = {}, $$scope } = $$props;
    let { open = false } = $$props;
    let { title = "Tab title" } = $$props;
    let { activeClasses = void 0 } = $$props;
    let { inactiveClasses = void 0 } = $$props;
    let { defaultClass = "inline-block text-sm font-medium text-center disabled:cursor-not-allowed" } = $$props;
    const ctx = getContext("ctx") ?? {};
    const selected = ctx.selected ?? writable();
    function init2(node) {
      selected.set(node);
      const destroy = selected.subscribe((x) => {
        if (x !== node) {
          $$invalidate(0, open = false);
        }
      });
      return { destroy };
    }
    let buttonClass;
    function blur_handler(event) {
      bubble.call(this, $$self, event);
    }
    function click_handler(event) {
      bubble.call(this, $$self, event);
    }
    function contextmenu_handler(event) {
      bubble.call(this, $$self, event);
    }
    function focus_handler(event) {
      bubble.call(this, $$self, event);
    }
    function keydown_handler(event) {
      bubble.call(this, $$self, event);
    }
    function keypress_handler(event) {
      bubble.call(this, $$self, event);
    }
    function keyup_handler(event) {
      bubble.call(this, $$self, event);
    }
    function mouseenter_handler(event) {
      bubble.call(this, $$self, event);
    }
    function mouseleave_handler(event) {
      bubble.call(this, $$self, event);
    }
    function mouseover_handler(event) {
      bubble.call(this, $$self, event);
    }
    const click_handler_1 = () => $$invalidate(0, open = true);
    $$self.$$set = ($$new_props) => {
      $$invalidate(4, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      $$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
      if ("open" in $$new_props)
        $$invalidate(0, open = $$new_props.open);
      if ("title" in $$new_props)
        $$invalidate(1, title = $$new_props.title);
      if ("activeClasses" in $$new_props)
        $$invalidate(6, activeClasses = $$new_props.activeClasses);
      if ("inactiveClasses" in $$new_props)
        $$invalidate(7, inactiveClasses = $$new_props.inactiveClasses);
      if ("defaultClass" in $$new_props)
        $$invalidate(8, defaultClass = $$new_props.defaultClass);
      if ("$$scope" in $$new_props)
        $$invalidate(9, $$scope = $$new_props.$$scope);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*defaultClass, open, activeClasses, inactiveClasses*/
      449) {
        $$invalidate(2, buttonClass = twMerge(
          defaultClass,
          open ? activeClasses ?? ctx.activeClasses : inactiveClasses ?? ctx.inactiveClasses,
          open && "active"
        ));
      }
    };
    $$props = exclude_internal_props($$props);
    return [
      open,
      title,
      buttonClass,
      init2,
      $$props,
      $$restProps,
      activeClasses,
      inactiveClasses,
      defaultClass,
      $$scope,
      slots,
      blur_handler,
      click_handler,
      contextmenu_handler,
      focus_handler,
      keydown_handler,
      keypress_handler,
      keyup_handler,
      mouseenter_handler,
      mouseleave_handler,
      mouseover_handler,
      click_handler_1
    ];
  }
  class TabItem extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$3, create_fragment$3, safe_not_equal, {
        open: 0,
        title: 1,
        activeClasses: 6,
        inactiveClasses: 7,
        defaultClass: 8
      });
    }
  }
  const get_divider_slot_changes = (dirty) => ({});
  const get_divider_slot_context = (ctx) => ({});
  const get_default_slot_changes = (dirty) => ({ style: dirty & /*style*/
  2 });
  const get_default_slot_context = (ctx) => ({ style: (
    /*style*/
    ctx[1]
  ) });
  function create_if_block$1(ctx) {
    let current;
    const divider_slot_template = (
      /*#slots*/
      ctx[9].divider
    );
    const divider_slot = create_slot(
      divider_slot_template,
      ctx,
      /*$$scope*/
      ctx[8],
      get_divider_slot_context
    );
    const divider_slot_or_fallback = divider_slot || fallback_block();
    return {
      c() {
        if (divider_slot_or_fallback)
          divider_slot_or_fallback.c();
      },
      m(target, anchor) {
        if (divider_slot_or_fallback) {
          divider_slot_or_fallback.m(target, anchor);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (divider_slot) {
          if (divider_slot.p && (!current || dirty & /*$$scope*/
          256)) {
            update_slot_base(
              divider_slot,
              divider_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[8],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[8]
              ) : get_slot_changes(
                divider_slot_template,
                /*$$scope*/
                ctx2[8],
                dirty,
                get_divider_slot_changes
              ),
              get_divider_slot_context
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(divider_slot_or_fallback, local);
        current = true;
      },
      o(local) {
        transition_out(divider_slot_or_fallback, local);
        current = false;
      },
      d(detaching) {
        if (divider_slot_or_fallback)
          divider_slot_or_fallback.d(detaching);
      }
    };
  }
  function fallback_block(ctx) {
    let div;
    return {
      c() {
        div = element("div");
        attr(div, "class", "h-px bg-gray-200 dark:bg-gray-700");
      },
      m(target, anchor) {
        insert(target, div, anchor);
      },
      p: noop,
      d(detaching) {
        if (detaching) {
          detach(div);
        }
      }
    };
  }
  function create_fragment$2(ctx) {
    let ul;
    let t0;
    let t1;
    let div;
    let current;
    let mounted;
    let dispose;
    const default_slot_template = (
      /*#slots*/
      ctx[9].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[8],
      get_default_slot_context
    );
    let if_block = (
      /*divider*/
      ctx[0] && create_if_block$1(ctx)
    );
    return {
      c() {
        ul = element("ul");
        if (default_slot)
          default_slot.c();
        t0 = space();
        if (if_block)
          if_block.c();
        t1 = space();
        div = element("div");
        attr(
          ul,
          "class",
          /*ulClass*/
          ctx[3]
        );
        attr(
          div,
          "class",
          /*contentClass*/
          ctx[2]
        );
        attr(div, "role", "tabpanel");
        attr(div, "aria-labelledby", "id-tab");
      },
      m(target, anchor) {
        insert(target, ul, anchor);
        if (default_slot) {
          default_slot.m(ul, null);
        }
        insert(target, t0, anchor);
        if (if_block)
          if_block.m(target, anchor);
        insert(target, t1, anchor);
        insert(target, div, anchor);
        current = true;
        if (!mounted) {
          dispose = action_destroyer(
            /*init*/
            ctx[4].call(null, div)
          );
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope, style*/
          258)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[8],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[8]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[8],
                dirty,
                get_default_slot_changes
              ),
              get_default_slot_context
            );
          }
        }
        if (!current || dirty & /*ulClass*/
        8) {
          attr(
            ul,
            "class",
            /*ulClass*/
            ctx2[3]
          );
        }
        if (
          /*divider*/
          ctx2[0]
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
            if (dirty & /*divider*/
            1) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block$1(ctx2);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(t1.parentNode, t1);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
        if (!current || dirty & /*contentClass*/
        4) {
          attr(
            div,
            "class",
            /*contentClass*/
            ctx2[2]
          );
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(ul);
          detach(t0);
          detach(t1);
          detach(div);
        }
        if (default_slot)
          default_slot.d(detaching);
        if (if_block)
          if_block.d(detaching);
        mounted = false;
        dispose();
      }
    };
  }
  function instance$2($$self, $$props, $$invalidate) {
    let ulClass;
    let { $$slots: slots = {}, $$scope } = $$props;
    let { style = "none" } = $$props;
    let { defaultClass = "flex flex-wrap space-x-2" } = $$props;
    let { contentClass = "p-4 bg-gray-50 rounded-lg dark:bg-gray-800 mt-4" } = $$props;
    let { divider = true } = $$props;
    let { activeClasses = "p-4 text-primary-600 bg-gray-100 rounded-t-lg dark:bg-gray-800 dark:text-primary-500" } = $$props;
    let { inactiveClasses = "p-4 text-gray-500 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300" } = $$props;
    const styledActiveClasses = {
      full: "p-4 w-full group-first:rounded-l-lg group-last:rounded-r-lg text-gray-900 bg-gray-100 focus:ring-4 focus:ring-primary-300 focus:outline-none dark:bg-gray-700 dark:text-white",
      pill: "py-3 px-4 text-white bg-primary-600 rounded-lg",
      underline: "p-4 text-primary-600 border-b-2 border-primary-600 dark:text-primary-500 dark:border-primary-500",
      none: ""
    };
    const styledInactiveClasses = {
      full: "p-4 w-full group-first:rounded-l-lg group-last:rounded-r-lg text-gray-500 dark:text-gray-400 bg-white hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-primary-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700",
      pill: "py-3 px-4 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white",
      underline: "p-4 border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-gray-500 dark:text-gray-400",
      none: ""
    };
    const ctx = {
      activeClasses: styledActiveClasses[style] || activeClasses,
      inactiveClasses: styledInactiveClasses[style] || inactiveClasses,
      selected: writable()
    };
    setContext("ctx", ctx);
    function init2(node) {
      const destroy = ctx.selected.subscribe((x) => {
        if (x)
          node.replaceChildren(x);
      });
      return { destroy };
    }
    $$self.$$set = ($$new_props) => {
      $$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      if ("style" in $$new_props)
        $$invalidate(1, style = $$new_props.style);
      if ("defaultClass" in $$new_props)
        $$invalidate(5, defaultClass = $$new_props.defaultClass);
      if ("contentClass" in $$new_props)
        $$invalidate(2, contentClass = $$new_props.contentClass);
      if ("divider" in $$new_props)
        $$invalidate(0, divider = $$new_props.divider);
      if ("activeClasses" in $$new_props)
        $$invalidate(6, activeClasses = $$new_props.activeClasses);
      if ("inactiveClasses" in $$new_props)
        $$invalidate(7, inactiveClasses = $$new_props.inactiveClasses);
      if ("$$scope" in $$new_props)
        $$invalidate(8, $$scope = $$new_props.$$scope);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*style, divider*/
      3) {
        $$invalidate(0, divider = ["full", "pill"].includes(style) ? false : divider);
      }
      $$invalidate(3, ulClass = twMerge(defaultClass, style === "underline" && "-mb-px", $$props.class));
    };
    $$props = exclude_internal_props($$props);
    return [
      divider,
      style,
      contentClass,
      ulClass,
      init2,
      defaultClass,
      activeClasses,
      inactiveClasses,
      $$scope,
      slots
    ];
  }
  class Tabs extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$2, create_fragment$2, safe_not_equal, {
        style: 1,
        defaultClass: 5,
        contentClass: 2,
        divider: 0,
        activeClasses: 6,
        inactiveClasses: 7
      });
    }
  }
  var AddingMode = /* @__PURE__ */ ((AddingMode2) => {
    AddingMode2[AddingMode2["Before"] = 0] = "Before";
    AddingMode2[AddingMode2["After"] = 1] = "After";
    return AddingMode2;
  })(AddingMode || {});
  function create_default_slot_3$1(ctx) {
    let t;
    return {
      c() {
        t = text("添加文本");
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
      }
    };
  }
  function create_default_slot_2$1(ctx) {
    let t;
    return {
      c() {
        t = text("位置");
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
      }
    };
  }
  function create_default_slot_1$1(ctx) {
    let t;
    return {
      c() {
        t = text("名称之前");
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
      }
    };
  }
  function create_default_slot$1(ctx) {
    let t;
    return {
      c() {
        t = text("名称之后");
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
      }
    };
  }
  function create_fragment$1(ctx) {
    let div3;
    let div0;
    let label0;
    let t0;
    let input;
    let updating_value;
    let t1;
    let div2;
    let label1;
    let t2;
    let div1;
    let radio0;
    let updating_group;
    let t3;
    let radio1;
    let updating_group_1;
    let current;
    label0 = new Label({
      props: {
        for: "default-input",
        class: "block mb-2",
        $$slots: { default: [create_default_slot_3$1] },
        $$scope: { ctx }
      }
    });
    function input_value_binding(value) {
      ctx[2](value);
    }
    let input_props = { id: "default-input", required: true };
    if (
      /*addingText*/
      ctx[0] !== void 0
    ) {
      input_props.value = /*addingText*/
      ctx[0];
    }
    input = new Input({ props: input_props });
    binding_callbacks.push(() => bind(input, "value", input_value_binding));
    label1 = new Label({
      props: {
        for: "first_name",
        class: "mb-2",
        $$slots: { default: [create_default_slot_2$1] },
        $$scope: { ctx }
      }
    });
    function radio0_group_binding(value) {
      ctx[3](value);
    }
    let radio0_props = {
      value: AddingMode.Before,
      $$slots: { default: [create_default_slot_1$1] },
      $$scope: { ctx }
    };
    if (
      /*addingMode*/
      ctx[1] !== void 0
    ) {
      radio0_props.group = /*addingMode*/
      ctx[1];
    }
    radio0 = new Radio({ props: radio0_props });
    binding_callbacks.push(() => bind(radio0, "group", radio0_group_binding));
    function radio1_group_binding(value) {
      ctx[4](value);
    }
    let radio1_props = {
      value: AddingMode.After,
      $$slots: { default: [create_default_slot$1] },
      $$scope: { ctx }
    };
    if (
      /*addingMode*/
      ctx[1] !== void 0
    ) {
      radio1_props.group = /*addingMode*/
      ctx[1];
    }
    radio1 = new Radio({ props: radio1_props });
    binding_callbacks.push(() => bind(radio1, "group", radio1_group_binding));
    return {
      c() {
        div3 = element("div");
        div0 = element("div");
        create_component(label0.$$.fragment);
        t0 = space();
        create_component(input.$$.fragment);
        t1 = space();
        div2 = element("div");
        create_component(label1.$$.fragment);
        t2 = space();
        div1 = element("div");
        create_component(radio0.$$.fragment);
        t3 = space();
        create_component(radio1.$$.fragment);
        attr(div1, "class", "flex gap-4");
        attr(div3, "class", "space-y-4");
      },
      m(target, anchor) {
        insert(target, div3, anchor);
        append(div3, div0);
        mount_component(label0, div0, null);
        append(div0, t0);
        mount_component(input, div0, null);
        append(div3, t1);
        append(div3, div2);
        mount_component(label1, div2, null);
        append(div2, t2);
        append(div2, div1);
        mount_component(radio0, div1, null);
        append(div1, t3);
        mount_component(radio1, div1, null);
        current = true;
      },
      p(ctx2, [dirty]) {
        const label0_changes = {};
        if (dirty & /*$$scope*/
        32) {
          label0_changes.$$scope = { dirty, ctx: ctx2 };
        }
        label0.$set(label0_changes);
        const input_changes = {};
        if (!updating_value && dirty & /*addingText*/
        1) {
          updating_value = true;
          input_changes.value = /*addingText*/
          ctx2[0];
          add_flush_callback(() => updating_value = false);
        }
        input.$set(input_changes);
        const label1_changes = {};
        if (dirty & /*$$scope*/
        32) {
          label1_changes.$$scope = { dirty, ctx: ctx2 };
        }
        label1.$set(label1_changes);
        const radio0_changes = {};
        if (dirty & /*$$scope*/
        32) {
          radio0_changes.$$scope = { dirty, ctx: ctx2 };
        }
        if (!updating_group && dirty & /*addingMode*/
        2) {
          updating_group = true;
          radio0_changes.group = /*addingMode*/
          ctx2[1];
          add_flush_callback(() => updating_group = false);
        }
        radio0.$set(radio0_changes);
        const radio1_changes = {};
        if (dirty & /*$$scope*/
        32) {
          radio1_changes.$$scope = { dirty, ctx: ctx2 };
        }
        if (!updating_group_1 && dirty & /*addingMode*/
        2) {
          updating_group_1 = true;
          radio1_changes.group = /*addingMode*/
          ctx2[1];
          add_flush_callback(() => updating_group_1 = false);
        }
        radio1.$set(radio1_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(label0.$$.fragment, local);
        transition_in(input.$$.fragment, local);
        transition_in(label1.$$.fragment, local);
        transition_in(radio0.$$.fragment, local);
        transition_in(radio1.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(label0.$$.fragment, local);
        transition_out(input.$$.fragment, local);
        transition_out(label1.$$.fragment, local);
        transition_out(radio0.$$.fragment, local);
        transition_out(radio1.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div3);
        }
        destroy_component(label0);
        destroy_component(input);
        destroy_component(label1);
        destroy_component(radio0);
        destroy_component(radio1);
      }
    };
  }
  function instance$1($$self, $$props, $$invalidate) {
    let { addingText } = $$props;
    let { addingMode } = $$props;
    function input_value_binding(value) {
      addingText = value;
      $$invalidate(0, addingText);
    }
    function radio0_group_binding(value) {
      addingMode = value;
      $$invalidate(1, addingMode);
    }
    function radio1_group_binding(value) {
      addingMode = value;
      $$invalidate(1, addingMode);
    }
    $$self.$$set = ($$props2) => {
      if ("addingText" in $$props2)
        $$invalidate(0, addingText = $$props2.addingText);
      if ("addingMode" in $$props2)
        $$invalidate(1, addingMode = $$props2.addingMode);
    };
    return [
      addingText,
      addingMode,
      input_value_binding,
      radio0_group_binding,
      radio1_group_binding
    ];
  }
  class AddingTextForm extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$1, create_fragment$1, safe_not_equal, { addingText: 0, addingMode: 1 });
    }
  }
  function replace({ orgText, searchText, replaceText, isRegex }) {
    if (!searchText) {
      return orgText;
    }
    let search = searchText;
    if (isRegex) {
      try {
        search = new RegExp(searchText, "g");
      } catch (e) {
        return orgText;
      }
    }
    return orgText.replace(search, replaceText);
  }
  function adding({
    orgText,
    addingText,
    addingMode
  }) {
    if (!addingText) {
      return orgText;
    }
    if (addingMode === AddingMode.Before) {
      return addingText + orgText;
    }
    if (addingMode === AddingMode.After) {
      return orgText + addingText;
    }
    return orgText;
  }
  function renameFile(site, fileId, fileName, driveId) {
    if (!fileId || !fileName || fileName.length === 0) {
      return;
    }
    console.log(
      "[vite-plugin-monkey] renameFile",
      site,
      fileId,
      fileName,
      driveId
    );
    if (site === "kuake") {
      return fetch(
        "https://drive-pc.quark.cn/1/clouddrive/file/rename?pr=ucpro&fr=pc",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ fid: fileId, file_name: fileName })
        }
      );
    } else if (site === "aliyun") {
      let token = JSON.parse(getToken());
      if (!token) {
        alert("请先登录！");
        return;
      }
      let tokenStr = token.token_type + " " + token.access_token;
      console.log("[vite-plugin-monkey] update authorization:", tokenStr);
      return fetch(
        "https://api.aliyundrive.com/v3/file/update",
        {
          method: "POST",
          headers: {
            "authority": "api.aliyundrive.com",
            "authorization": tokenStr,
            "content-type": "application/json;charset=UTF-8"
          },
          body: JSON.stringify({
            drive_id: driveId,
            file_id: fileId,
            name: fileName,
            check_name_mode: "refuse"
          })
        }
      );
    }
  }
  function getToken() {
    let token = localStorage.getItem("token");
    if (isBlank(token)) {
      token = sessionStorage.getItem("token");
      if (isBlank(token)) {
        token = getCookie("token");
      }
    }
    return token;
  }
  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i].trim();
      if (c.indexOf(name) == 0)
        return c.substring(name.length, c.length);
    }
    return "";
  }
  function isBlank(str) {
    if (str == null || str === "")
      return true;
    else if (str.trim() === "")
      return true;
    else
      return false;
  }
  function get_each_context(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[35] = list[i];
    return child_ctx;
  }
  function create_default_slot_19(ctx) {
    let checkbox;
    let current;
    checkbox = new Checkbox({});
    checkbox.$on(
      "change",
      /*change_handler*/
      ctx[17]
    );
    return {
      c() {
        create_component(checkbox.$$.fragment);
      },
      m(target, anchor) {
        mount_component(checkbox, target, anchor);
        current = true;
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(checkbox.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(checkbox.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(checkbox, detaching);
      }
    };
  }
  function create_default_slot_18(ctx) {
    let t;
    return {
      c() {
        t = text("文件名称");
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
      }
    };
  }
  function create_default_slot_17(ctx) {
    let tableheadcell0;
    let t;
    let tableheadcell1;
    let current;
    tableheadcell0 = new TableHeadCell({
      props: {
        class: "w-4",
        $$slots: { default: [create_default_slot_19] },
        $$scope: { ctx }
      }
    });
    tableheadcell1 = new TableHeadCell({
      props: {
        $$slots: { default: [create_default_slot_18] },
        $$scope: { ctx }
      }
    });
    return {
      c() {
        create_component(tableheadcell0.$$.fragment);
        t = space();
        create_component(tableheadcell1.$$.fragment);
      },
      m(target, anchor) {
        mount_component(tableheadcell0, target, anchor);
        insert(target, t, anchor);
        mount_component(tableheadcell1, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const tableheadcell0_changes = {};
        if (dirty[0] & /*selectedFileIds, aliyundriveFileList*/
        1536 | dirty[1] & /*$$scope*/
        128) {
          tableheadcell0_changes.$$scope = { dirty, ctx: ctx2 };
        }
        tableheadcell0.$set(tableheadcell0_changes);
        const tableheadcell1_changes = {};
        if (dirty[1] & /*$$scope*/
        128) {
          tableheadcell1_changes.$$scope = { dirty, ctx: ctx2 };
        }
        tableheadcell1.$set(tableheadcell1_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(tableheadcell0.$$.fragment, local);
        transition_in(tableheadcell1.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(tableheadcell0.$$.fragment, local);
        transition_out(tableheadcell1.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
        destroy_component(tableheadcell0, detaching);
        destroy_component(tableheadcell1, detaching);
      }
    };
  }
  function create_default_slot_16(ctx) {
    let checkbox;
    let updating_group;
    let current;
    function checkbox_group_binding(value) {
      ctx[18](value);
    }
    let checkbox_props = { value: (
      /*file*/
      ctx[35].file_id
    ) };
    if (
      /*selectedFileIds*/
      ctx[9] !== void 0
    ) {
      checkbox_props.group = /*selectedFileIds*/
      ctx[9];
    }
    checkbox = new Checkbox({ props: checkbox_props });
    binding_callbacks.push(() => bind(checkbox, "group", checkbox_group_binding));
    return {
      c() {
        create_component(checkbox.$$.fragment);
      },
      m(target, anchor) {
        mount_component(checkbox, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const checkbox_changes = {};
        if (dirty[0] & /*aliyundriveFileList*/
        1024)
          checkbox_changes.value = /*file*/
          ctx2[35].file_id;
        if (!updating_group && dirty[0] & /*selectedFileIds*/
        512) {
          updating_group = true;
          checkbox_changes.group = /*selectedFileIds*/
          ctx2[9];
          add_flush_callback(() => updating_group = false);
        }
        checkbox.$set(checkbox_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(checkbox.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(checkbox.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(checkbox, detaching);
      }
    };
  }
  function create_default_slot_15(ctx) {
    let t_value = (
      /*file*/
      ctx[35].name + ""
    );
    let t;
    return {
      c() {
        t = text(t_value);
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*aliyundriveFileList*/
        1024 && t_value !== (t_value = /*file*/
        ctx2[35].name + ""))
          set_data(t, t_value);
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
      }
    };
  }
  function create_default_slot_14(ctx) {
    let tablebodycell0;
    let t0;
    let tablebodycell1;
    let t1;
    let current;
    tablebodycell0 = new TableBodyCell({
      props: {
        $$slots: { default: [create_default_slot_16] },
        $$scope: { ctx }
      }
    });
    tablebodycell1 = new TableBodyCell({
      props: {
        $$slots: { default: [create_default_slot_15] },
        $$scope: { ctx }
      }
    });
    return {
      c() {
        create_component(tablebodycell0.$$.fragment);
        t0 = space();
        create_component(tablebodycell1.$$.fragment);
        t1 = space();
      },
      m(target, anchor) {
        mount_component(tablebodycell0, target, anchor);
        insert(target, t0, anchor);
        mount_component(tablebodycell1, target, anchor);
        insert(target, t1, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const tablebodycell0_changes = {};
        if (dirty[0] & /*aliyundriveFileList, selectedFileIds*/
        1536 | dirty[1] & /*$$scope*/
        128) {
          tablebodycell0_changes.$$scope = { dirty, ctx: ctx2 };
        }
        tablebodycell0.$set(tablebodycell0_changes);
        const tablebodycell1_changes = {};
        if (dirty[0] & /*aliyundriveFileList*/
        1024 | dirty[1] & /*$$scope*/
        128) {
          tablebodycell1_changes.$$scope = { dirty, ctx: ctx2 };
        }
        tablebodycell1.$set(tablebodycell1_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(tablebodycell0.$$.fragment, local);
        transition_in(tablebodycell1.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(tablebodycell0.$$.fragment, local);
        transition_out(tablebodycell1.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(t0);
          detach(t1);
        }
        destroy_component(tablebodycell0, detaching);
        destroy_component(tablebodycell1, detaching);
      }
    };
  }
  function create_each_block(ctx) {
    let tablebodyrow;
    let current;
    tablebodyrow = new TableBodyRow({
      props: {
        $$slots: { default: [create_default_slot_14] },
        $$scope: { ctx }
      }
    });
    return {
      c() {
        create_component(tablebodyrow.$$.fragment);
      },
      m(target, anchor) {
        mount_component(tablebodyrow, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const tablebodyrow_changes = {};
        if (dirty[0] & /*aliyundriveFileList, selectedFileIds*/
        1536 | dirty[1] & /*$$scope*/
        128) {
          tablebodyrow_changes.$$scope = { dirty, ctx: ctx2 };
        }
        tablebodyrow.$set(tablebodyrow_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(tablebodyrow.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(tablebodyrow.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(tablebodyrow, detaching);
      }
    };
  }
  function create_default_slot_13(ctx) {
    let each_1_anchor;
    let current;
    let each_value = ensure_array_like(
      /*aliyundriveFileList*/
      ctx[10]
    );
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    }
    const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
      each_blocks[i] = null;
    });
    return {
      c() {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        each_1_anchor = empty();
      },
      m(target, anchor) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(target, anchor);
          }
        }
        insert(target, each_1_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*aliyundriveFileList, selectedFileIds*/
        1536) {
          each_value = ensure_array_like(
            /*aliyundriveFileList*/
            ctx2[10]
          );
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
              transition_in(each_blocks[i], 1);
            } else {
              each_blocks[i] = create_each_block(child_ctx);
              each_blocks[i].c();
              transition_in(each_blocks[i], 1);
              each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
            }
          }
          group_outros();
          for (i = each_value.length; i < each_blocks.length; i += 1) {
            out(i);
          }
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        for (let i = 0; i < each_value.length; i += 1) {
          transition_in(each_blocks[i]);
        }
        current = true;
      },
      o(local) {
        each_blocks = each_blocks.filter(Boolean);
        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(each_1_anchor);
        }
        destroy_each(each_blocks, detaching);
      }
    };
  }
  function create_default_slot_12(ctx) {
    let tablehead;
    let t;
    let tablebody;
    let current;
    tablehead = new TableHead({
      props: {
        $$slots: { default: [create_default_slot_17] },
        $$scope: { ctx }
      }
    });
    tablebody = new TableBody({
      props: {
        $$slots: { default: [create_default_slot_13] },
        $$scope: { ctx }
      }
    });
    return {
      c() {
        create_component(tablehead.$$.fragment);
        t = space();
        create_component(tablebody.$$.fragment);
      },
      m(target, anchor) {
        mount_component(tablehead, target, anchor);
        insert(target, t, anchor);
        mount_component(tablebody, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const tablehead_changes = {};
        if (dirty[0] & /*selectedFileIds, aliyundriveFileList*/
        1536 | dirty[1] & /*$$scope*/
        128) {
          tablehead_changes.$$scope = { dirty, ctx: ctx2 };
        }
        tablehead.$set(tablehead_changes);
        const tablebody_changes = {};
        if (dirty[0] & /*aliyundriveFileList, selectedFileIds*/
        1536 | dirty[1] & /*$$scope*/
        128) {
          tablebody_changes.$$scope = { dirty, ctx: ctx2 };
        }
        tablebody.$set(tablebody_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(tablehead.$$.fragment, local);
        transition_in(tablebody.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(tablehead.$$.fragment, local);
        transition_out(tablebody.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
        destroy_component(tablehead, detaching);
        destroy_component(tablebody, detaching);
      }
    };
  }
  function create_default_slot_11(ctx) {
    let table;
    let current;
    table = new Table({
      props: {
        hoverable: true,
        $$slots: { default: [create_default_slot_12] },
        $$scope: { ctx }
      }
    });
    return {
      c() {
        create_component(table.$$.fragment);
      },
      m(target, anchor) {
        mount_component(table, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const table_changes = {};
        if (dirty[0] & /*aliyundriveFileList, selectedFileIds*/
        1536 | dirty[1] & /*$$scope*/
        128) {
          table_changes.$$scope = { dirty, ctx: ctx2 };
        }
        table.$set(table_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(table.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(table.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(table, detaching);
      }
    };
  }
  function create_default_slot_10(ctx) {
    let t;
    return {
      c() {
        t = text("继续");
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
      }
    };
  }
  function create_default_slot_9(ctx) {
    let t;
    return {
      c() {
        t = text("取消");
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
      }
    };
  }
  function create_footer_slot_1(ctx) {
    let button0;
    let t;
    let button1;
    let current;
    button0 = new Button({
      props: {
        color: "blue",
        disabled: (
          /*selectedFileIds*/
          ctx[9].length === 0
        ),
        $$slots: { default: [create_default_slot_10] },
        $$scope: { ctx }
      }
    });
    button0.$on(
      "click",
      /*click_handler*/
      ctx[15]
    );
    button1 = new Button({
      props: {
        color: "alternative",
        $$slots: { default: [create_default_slot_9] },
        $$scope: { ctx }
      }
    });
    button1.$on(
      "click",
      /*click_handler_1*/
      ctx[16]
    );
    return {
      c() {
        create_component(button0.$$.fragment);
        t = space();
        create_component(button1.$$.fragment);
      },
      m(target, anchor) {
        mount_component(button0, target, anchor);
        insert(target, t, anchor);
        mount_component(button1, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const button0_changes = {};
        if (dirty[0] & /*selectedFileIds*/
        512)
          button0_changes.disabled = /*selectedFileIds*/
          ctx2[9].length === 0;
        if (dirty[1] & /*$$scope*/
        128) {
          button0_changes.$$scope = { dirty, ctx: ctx2 };
        }
        button0.$set(button0_changes);
        const button1_changes = {};
        if (dirty[1] & /*$$scope*/
        128) {
          button1_changes.$$scope = { dirty, ctx: ctx2 };
        }
        button1.$set(button1_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(button0.$$.fragment, local);
        transition_in(button1.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(button0.$$.fragment, local);
        transition_out(button1.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
        destroy_component(button0, detaching);
        destroy_component(button1, detaching);
      }
    };
  }
  function create_default_slot_8(ctx) {
    let t;
    return {
      c() {
        t = text("正则");
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
      }
    };
  }
  function create_default_slot_7(ctx) {
    let t;
    let checkbox;
    let updating_checked;
    let current;
    function checkbox_checked_binding(value) {
      ctx[22](value);
    }
    let checkbox_props = {
      class: "ml-5",
      $$slots: { default: [create_default_slot_8] },
      $$scope: { ctx }
    };
    if (
      /*isRegex*/
      ctx[1] !== void 0
    ) {
      checkbox_props.checked = /*isRegex*/
      ctx[1];
    }
    checkbox = new Checkbox({ props: checkbox_props });
    binding_callbacks.push(() => bind(checkbox, "checked", checkbox_checked_binding));
    return {
      c() {
        t = text("查找 ");
        create_component(checkbox.$$.fragment);
      },
      m(target, anchor) {
        insert(target, t, anchor);
        mount_component(checkbox, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const checkbox_changes = {};
        if (dirty[1] & /*$$scope*/
        128) {
          checkbox_changes.$$scope = { dirty, ctx: ctx2 };
        }
        if (!updating_checked && dirty[0] & /*isRegex*/
        2) {
          updating_checked = true;
          checkbox_changes.checked = /*isRegex*/
          ctx2[1];
          add_flush_callback(() => updating_checked = false);
        }
        checkbox.$set(checkbox_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(checkbox.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(checkbox.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
        destroy_component(checkbox, detaching);
      }
    };
  }
  function create_default_slot_6(ctx) {
    let t;
    return {
      c() {
        t = text("替换成");
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
      }
    };
  }
  function create_default_slot_5(ctx) {
    let div2;
    let div0;
    let label0;
    let t0;
    let input0;
    let updating_value;
    let t1;
    let div1;
    let label1;
    let t2;
    let input1;
    let updating_value_1;
    let current;
    label0 = new Label({
      props: {
        for: "default-input",
        class: "block mb-2 flex items-center",
        $$slots: { default: [create_default_slot_7] },
        $$scope: { ctx }
      }
    });
    function input0_value_binding(value) {
      ctx[23](value);
    }
    let input0_props = { id: "default-input", required: true };
    if (
      /*searchText*/
      ctx[0] !== void 0
    ) {
      input0_props.value = /*searchText*/
      ctx[0];
    }
    input0 = new Input({ props: input0_props });
    binding_callbacks.push(() => bind(input0, "value", input0_value_binding));
    label1 = new Label({
      props: {
        for: "first_name",
        class: "mb-2",
        $$slots: { default: [create_default_slot_6] },
        $$scope: { ctx }
      }
    });
    function input1_value_binding(value) {
      ctx[24](value);
    }
    let input1_props = {
      type: "text",
      id: "first_name",
      required: true
    };
    if (
      /*replaceText*/
      ctx[2] !== void 0
    ) {
      input1_props.value = /*replaceText*/
      ctx[2];
    }
    input1 = new Input({ props: input1_props });
    binding_callbacks.push(() => bind(input1, "value", input1_value_binding));
    return {
      c() {
        div2 = element("div");
        div0 = element("div");
        create_component(label0.$$.fragment);
        t0 = space();
        create_component(input0.$$.fragment);
        t1 = space();
        div1 = element("div");
        create_component(label1.$$.fragment);
        t2 = space();
        create_component(input1.$$.fragment);
        attr(div2, "class", "space-y-4");
      },
      m(target, anchor) {
        insert(target, div2, anchor);
        append(div2, div0);
        mount_component(label0, div0, null);
        append(div0, t0);
        mount_component(input0, div0, null);
        append(div2, t1);
        append(div2, div1);
        mount_component(label1, div1, null);
        append(div1, t2);
        mount_component(input1, div1, null);
        current = true;
      },
      p(ctx2, dirty) {
        const label0_changes = {};
        if (dirty[0] & /*isRegex*/
        2 | dirty[1] & /*$$scope*/
        128) {
          label0_changes.$$scope = { dirty, ctx: ctx2 };
        }
        label0.$set(label0_changes);
        const input0_changes = {};
        if (!updating_value && dirty[0] & /*searchText*/
        1) {
          updating_value = true;
          input0_changes.value = /*searchText*/
          ctx2[0];
          add_flush_callback(() => updating_value = false);
        }
        input0.$set(input0_changes);
        const label1_changes = {};
        if (dirty[1] & /*$$scope*/
        128) {
          label1_changes.$$scope = { dirty, ctx: ctx2 };
        }
        label1.$set(label1_changes);
        const input1_changes = {};
        if (!updating_value_1 && dirty[0] & /*replaceText*/
        4) {
          updating_value_1 = true;
          input1_changes.value = /*replaceText*/
          ctx2[2];
          add_flush_callback(() => updating_value_1 = false);
        }
        input1.$set(input1_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(label0.$$.fragment, local);
        transition_in(input0.$$.fragment, local);
        transition_in(label1.$$.fragment, local);
        transition_in(input1.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(label0.$$.fragment, local);
        transition_out(input0.$$.fragment, local);
        transition_out(label1.$$.fragment, local);
        transition_out(input1.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div2);
        }
        destroy_component(label0);
        destroy_component(input0);
        destroy_component(label1);
        destroy_component(input1);
      }
    };
  }
  function create_default_slot_4(ctx) {
    let addingtextform;
    let updating_addingMode;
    let updating_addingText;
    let current;
    function addingtextform_addingMode_binding(value) {
      ctx[26](value);
    }
    function addingtextform_addingText_binding(value) {
      ctx[27](value);
    }
    let addingtextform_props = {};
    if (
      /*addingMode*/
      ctx[5] !== void 0
    ) {
      addingtextform_props.addingMode = /*addingMode*/
      ctx[5];
    }
    if (
      /*addingText*/
      ctx[4] !== void 0
    ) {
      addingtextform_props.addingText = /*addingText*/
      ctx[4];
    }
    addingtextform = new AddingTextForm({ props: addingtextform_props });
    binding_callbacks.push(() => bind(addingtextform, "addingMode", addingtextform_addingMode_binding));
    binding_callbacks.push(() => bind(addingtextform, "addingText", addingtextform_addingText_binding));
    return {
      c() {
        create_component(addingtextform.$$.fragment);
      },
      m(target, anchor) {
        mount_component(addingtextform, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const addingtextform_changes = {};
        if (!updating_addingMode && dirty[0] & /*addingMode*/
        32) {
          updating_addingMode = true;
          addingtextform_changes.addingMode = /*addingMode*/
          ctx2[5];
          add_flush_callback(() => updating_addingMode = false);
        }
        if (!updating_addingText && dirty[0] & /*addingText*/
        16) {
          updating_addingText = true;
          addingtextform_changes.addingText = /*addingText*/
          ctx2[4];
          add_flush_callback(() => updating_addingText = false);
        }
        addingtextform.$set(addingtextform_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(addingtextform.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(addingtextform.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(addingtextform, detaching);
      }
    };
  }
  function create_default_slot_3(ctx) {
    let tabitem0;
    let updating_open;
    let t;
    let tabitem1;
    let current;
    function tabitem0_open_binding(value) {
      ctx[25](value);
    }
    let tabitem0_props = {
      title: "替换文本",
      $$slots: { default: [create_default_slot_5] },
      $$scope: { ctx }
    };
    if (
      /*isReplaceMode*/
      ctx[3] !== void 0
    ) {
      tabitem0_props.open = /*isReplaceMode*/
      ctx[3];
    }
    tabitem0 = new TabItem({ props: tabitem0_props });
    binding_callbacks.push(() => bind(tabitem0, "open", tabitem0_open_binding));
    tabitem1 = new TabItem({
      props: {
        title: "添加文本",
        $$slots: { default: [create_default_slot_4] },
        $$scope: { ctx }
      }
    });
    return {
      c() {
        create_component(tabitem0.$$.fragment);
        t = space();
        create_component(tabitem1.$$.fragment);
      },
      m(target, anchor) {
        mount_component(tabitem0, target, anchor);
        insert(target, t, anchor);
        mount_component(tabitem1, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const tabitem0_changes = {};
        if (dirty[0] & /*replaceText, searchText, isRegex*/
        7 | dirty[1] & /*$$scope*/
        128) {
          tabitem0_changes.$$scope = { dirty, ctx: ctx2 };
        }
        if (!updating_open && dirty[0] & /*isReplaceMode*/
        8) {
          updating_open = true;
          tabitem0_changes.open = /*isReplaceMode*/
          ctx2[3];
          add_flush_callback(() => updating_open = false);
        }
        tabitem0.$set(tabitem0_changes);
        const tabitem1_changes = {};
        if (dirty[0] & /*addingMode, addingText*/
        48 | dirty[1] & /*$$scope*/
        128) {
          tabitem1_changes.$$scope = { dirty, ctx: ctx2 };
        }
        tabitem1.$set(tabitem1_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(tabitem0.$$.fragment, local);
        transition_in(tabitem1.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(tabitem0.$$.fragment, local);
        transition_out(tabitem1.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
        destroy_component(tabitem0, detaching);
        destroy_component(tabitem1, detaching);
      }
    };
  }
  function create_default_slot_2(ctx) {
    let div1;
    let tabs;
    let t0;
    let div0;
    let t1;
    let t2;
    let current;
    tabs = new Tabs({
      props: {
        $$slots: { default: [create_default_slot_3] },
        $$scope: { ctx }
      }
    });
    return {
      c() {
        div1 = element("div");
        create_component(tabs.$$.fragment);
        t0 = space();
        div0 = element("div");
        t1 = text("示例：");
        t2 = text(
          /*exampleText*/
          ctx[11]
        );
        attr(div0, "class", "mt-5");
      },
      m(target, anchor) {
        insert(target, div1, anchor);
        mount_component(tabs, div1, null);
        append(div1, t0);
        append(div1, div0);
        append(div0, t1);
        append(div0, t2);
        current = true;
      },
      p(ctx2, dirty) {
        const tabs_changes = {};
        if (dirty[0] & /*addingMode, addingText, isReplaceMode, replaceText, searchText, isRegex*/
        63 | dirty[1] & /*$$scope*/
        128) {
          tabs_changes.$$scope = { dirty, ctx: ctx2 };
        }
        tabs.$set(tabs_changes);
        if (!current || dirty[0] & /*exampleText*/
        2048)
          set_data(
            t2,
            /*exampleText*/
            ctx2[11]
          );
      },
      i(local) {
        if (current)
          return;
        transition_in(tabs.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(tabs.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div1);
        }
        destroy_component(tabs);
      }
    };
  }
  function create_if_block(ctx) {
    let spinner;
    let current;
    spinner = new Spinner({
      props: { class: "mr-3", size: "4", color: "white" }
    });
    return {
      c() {
        create_component(spinner.$$.fragment);
      },
      m(target, anchor) {
        mount_component(spinner, target, anchor);
        current = true;
      },
      i(local) {
        if (current)
          return;
        transition_in(spinner.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(spinner.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(spinner, detaching);
      }
    };
  }
  function create_default_slot_1(ctx) {
    let t;
    let current;
    let if_block = (
      /*isLoading*/
      ctx[8] && create_if_block()
    );
    return {
      c() {
        if (if_block)
          if_block.c();
        t = text("\n      重新命名");
      },
      m(target, anchor) {
        if (if_block)
          if_block.m(target, anchor);
        insert(target, t, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        if (
          /*isLoading*/
          ctx2[8]
        ) {
          if (if_block) {
            if (dirty[0] & /*isLoading*/
            256) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block();
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(t.parentNode, t);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
        if (if_block)
          if_block.d(detaching);
      }
    };
  }
  function create_default_slot(ctx) {
    let t;
    return {
      c() {
        t = text("取消");
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
      }
    };
  }
  function create_footer_slot(ctx) {
    let button0;
    let t;
    let button1;
    let current;
    button0 = new Button({
      props: {
        color: "blue",
        disabled: (
          /*isLoading*/
          ctx[8]
        ),
        $$slots: { default: [create_default_slot_1] },
        $$scope: { ctx }
      }
    });
    button0.$on(
      "click",
      /*click_handler_2*/
      ctx[20]
    );
    button1 = new Button({
      props: {
        color: "alternative",
        $$slots: { default: [create_default_slot] },
        $$scope: { ctx }
      }
    });
    button1.$on(
      "click",
      /*click_handler_3*/
      ctx[21]
    );
    return {
      c() {
        create_component(button0.$$.fragment);
        t = space();
        create_component(button1.$$.fragment);
      },
      m(target, anchor) {
        mount_component(button0, target, anchor);
        insert(target, t, anchor);
        mount_component(button1, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const button0_changes = {};
        if (dirty[0] & /*isLoading*/
        256)
          button0_changes.disabled = /*isLoading*/
          ctx2[8];
        if (dirty[0] & /*isLoading*/
        256 | dirty[1] & /*$$scope*/
        128) {
          button0_changes.$$scope = { dirty, ctx: ctx2 };
        }
        button0.$set(button0_changes);
        const button1_changes = {};
        if (dirty[1] & /*$$scope*/
        128) {
          button1_changes.$$scope = { dirty, ctx: ctx2 };
        }
        button1.$set(button1_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(button0.$$.fragment, local);
        transition_in(button1.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(button0.$$.fragment, local);
        transition_out(button1.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
        destroy_component(button0, detaching);
        destroy_component(button1, detaching);
      }
    };
  }
  function create_fragment(ctx) {
    let modal0;
    let updating_open;
    let t;
    let modal1;
    let updating_open_1;
    let current;
    function modal0_open_binding(value) {
      ctx[19](value);
    }
    let modal0_props = {
      title: "选择文件",
      $$slots: {
        footer: [create_footer_slot_1],
        default: [create_default_slot_11]
      },
      $$scope: { ctx }
    };
    if (
      /*isShowingSelectFileModal*/
      ctx[7] !== void 0
    ) {
      modal0_props.open = /*isShowingSelectFileModal*/
      ctx[7];
    }
    modal0 = new Modal({ props: modal0_props });
    binding_callbacks.push(() => bind(modal0, "open", modal0_open_binding));
    function modal1_open_binding(value) {
      ctx[28](value);
    }
    let modal1_props = {
      title: "批量重命名",
      $$slots: {
        footer: [create_footer_slot],
        default: [create_default_slot_2]
      },
      $$scope: { ctx }
    };
    if (
      /*isShowingRenameModal*/
      ctx[6] !== void 0
    ) {
      modal1_props.open = /*isShowingRenameModal*/
      ctx[6];
    }
    modal1 = new Modal({ props: modal1_props });
    binding_callbacks.push(() => bind(modal1, "open", modal1_open_binding));
    return {
      c() {
        create_component(modal0.$$.fragment);
        t = space();
        create_component(modal1.$$.fragment);
      },
      m(target, anchor) {
        mount_component(modal0, target, anchor);
        insert(target, t, anchor);
        mount_component(modal1, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const modal0_changes = {};
        if (dirty[0] & /*isShowingSelectFileModal, selectedFileIds, aliyundriveFileList*/
        1664 | dirty[1] & /*$$scope*/
        128) {
          modal0_changes.$$scope = { dirty, ctx: ctx2 };
        }
        if (!updating_open && dirty[0] & /*isShowingSelectFileModal*/
        128) {
          updating_open = true;
          modal0_changes.open = /*isShowingSelectFileModal*/
          ctx2[7];
          add_flush_callback(() => updating_open = false);
        }
        modal0.$set(modal0_changes);
        const modal1_changes = {};
        if (dirty[0] & /*isShowingRenameModal, isLoading, exampleText, addingMode, addingText, isReplaceMode, replaceText, searchText, isRegex*/
        2431 | dirty[1] & /*$$scope*/
        128) {
          modal1_changes.$$scope = { dirty, ctx: ctx2 };
        }
        if (!updating_open_1 && dirty[0] & /*isShowingRenameModal*/
        64) {
          updating_open_1 = true;
          modal1_changes.open = /*isShowingRenameModal*/
          ctx2[6];
          add_flush_callback(() => updating_open_1 = false);
        }
        modal1.$set(modal1_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(modal0.$$.fragment, local);
        transition_in(modal1.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(modal0.$$.fragment, local);
        transition_out(modal1.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
        destroy_component(modal0, detaching);
        destroy_component(modal1, detaching);
      }
    };
  }
  function getSelectedItems() {
    const items = [];
    document.querySelectorAll(".ant-table-row-selected").forEach((el) => {
      const fileId = el.getAttribute("data-row-key");
      const fileName = el.querySelector(".filename-text").textContent;
      items.push({ fileId, fileName });
    });
    console.log("[vite-plugin-monkey] selected:", items);
    return items;
  }
  function instance($$self, $$props, $$invalidate) {
    let exampleText;
    let isShowingRenameModal = false;
    let isShowingSelectFileModal = false;
    let searchText;
    let isRegex;
    let replaceText = "";
    let exampleInput;
    let isLoading = false;
    let isReplaceMode = true;
    let addingText = "";
    let addingMode = AddingMode.Before;
    let selectedFileIds = [];
    let site = window.location.host.includes("ali") ? "aliyun" : "kuake";
    let aliyundriveFileList = [];
    let aliyundriveFileRouter = "";
    if (site === "aliyun") {
      console.log("[vite-plugin-monkey] site....", window);
      onMount(() => {
        const originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(data) {
          this.addEventListener("load", function(event) {
            if (this.status == 200) {
              const responseURL = this.responseURL;
              if (responseURL.indexOf("/file/list") > 0) {
                var response = this.response;
                try {
                  response = JSON.parse(response);
                } catch (error) {
                }
                console.log("[vite-plugin-monkey] response:", response);
                if (aliyundriveFileRouter !== window.location.href) {
                  aliyundriveFileRouter = window.location.href;
                  $$invalidate(10, aliyundriveFileList = []);
                }
                const fileIdsSet = new Set(aliyundriveFileList.map((item) => item.file_id));
                const newAliyundriveFileList = response.items.filter((item) => !fileIdsSet.has(item.file_id));
                if (newAliyundriveFileList.length > 0) {
                  aliyundriveFileList.push(...newAliyundriveFileList);
                }
                if (aliyundriveFileList) {
                  setTimeout(
                    () => {
                      showRenameButton();
                    },
                    200
                  );
                }
              }
            }
          });
          originalSend.call(this, data);
        };
      });
    } else if (site === "kuake") {
      window.addEventListener("load", () => {
        showRenameButton();
      });
    }
    function showRenameButton() {
      const isExist = document.body.querySelector("#renameBtn");
      if (isExist) {
        return;
      }
      const renameBtn = document.createElement("button");
      renameBtn.id = "renameBtn";
      renameBtn.className = " absolute right-2 top-2 p-2 w-10 w-10 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue rounded-full ";
      renameBtn.innerHTML = "🛠";
      renameBtn.addEventListener("click", () => {
        console.log("[vite-plugin-monkey] rename click");
        if (site === "aliyun") {
          showSelectFileModal();
        } else {
          showDialog();
        }
      });
      document.body.appendChild(renameBtn);
    }
    function showSelectFileModal() {
      $$invalidate(7, isShowingSelectFileModal = true);
    }
    function showDialog() {
      var _a;
      if (site === "kuake") {
        if (getSelectedItems().length == 0) {
          alert("请先选中文件");
          return;
        }
        const selectedItems = getSelectedItems();
        $$invalidate(14, exampleInput = (_a = selectedItems == null ? void 0 : selectedItems[0]) == null ? void 0 : _a.fileName);
      } else {
        console.log("[vite-plugin-monkey] select files:", selectedFileIds);
        $$invalidate(14, exampleInput = aliyundriveFileList.find((item) => selectedFileIds.includes(item.file_id)).name);
      }
      $$invalidate(6, isShowingRenameModal = true);
    }
    async function rename() {
      if (site === "kuake") {
        for (const item of getSelectedItems()) {
          const newFileName = process(item.fileName);
          if (!newFileName || newFileName === item.fileName) {
            continue;
          }
          await renameFile(site, item.fileId, newFileName, null);
        }
      } else {
        for (const fileId of selectedFileIds) {
          const file = aliyundriveFileList.find((item) => item.file_id === fileId);
          const newFileName = process(file.name);
          if (!newFileName || newFileName === file.name) {
            continue;
          }
          await renameFile(site, fileId, newFileName, file.drive_id);
        }
      }
    }
    async function submit() {
      console.log("[vite-plugin-monkey] submit");
      console.log({ findText: searchText, replaceText });
      $$invalidate(8, isLoading = true);
      await rename();
      $$invalidate(8, isLoading = false);
      $$invalidate(6, isShowingRenameModal = false);
      window.location.reload();
    }
    function process(orgText) {
      console.log("[vite-plugin-monkey] process", {
        orgText,
        searchText,
        replaceText,
        addingText,
        addingMode
      });
      if (isReplaceMode) {
        if (!searchText || searchText.length === 0) {
          return null;
        }
      } else {
        if (!addingText || addingText.length === 0) {
          return null;
        }
      }
      return isReplaceMode ? replace({
        orgText,
        searchText,
        replaceText,
        isRegex
      }) : adding({ orgText, addingText, addingMode });
    }
    const click_handler = () => {
      $$invalidate(7, isShowingSelectFileModal = false);
      showDialog();
    };
    const click_handler_1 = () => $$invalidate(7, isShowingSelectFileModal = false);
    const change_handler = (e) => {
      const cheked = e.target.checked;
      cheked ? $$invalidate(9, selectedFileIds = aliyundriveFileList.map((item) => item.file_id)) : $$invalidate(9, selectedFileIds = []);
    };
    function checkbox_group_binding(value) {
      selectedFileIds = value;
      $$invalidate(9, selectedFileIds);
    }
    function modal0_open_binding(value) {
      isShowingSelectFileModal = value;
      $$invalidate(7, isShowingSelectFileModal);
    }
    const click_handler_2 = () => {
      submit();
    };
    const click_handler_3 = () => $$invalidate(6, isShowingRenameModal = false);
    function checkbox_checked_binding(value) {
      isRegex = value;
      $$invalidate(1, isRegex);
    }
    function input0_value_binding(value) {
      searchText = value;
      $$invalidate(0, searchText);
    }
    function input1_value_binding(value) {
      replaceText = value;
      $$invalidate(2, replaceText);
    }
    function tabitem0_open_binding(value) {
      isReplaceMode = value;
      $$invalidate(3, isReplaceMode);
    }
    function addingtextform_addingMode_binding(value) {
      addingMode = value;
      $$invalidate(5, addingMode);
    }
    function addingtextform_addingText_binding(value) {
      addingText = value;
      $$invalidate(4, addingText);
    }
    function modal1_open_binding(value) {
      isShowingRenameModal = value;
      $$invalidate(6, isShowingRenameModal);
    }
    $$self.$$.update = () => {
      if ($$self.$$.dirty[0] & /*isReplaceMode, exampleInput, searchText, replaceText, isRegex, addingText, addingMode*/
      16447) {
        $$invalidate(11, exampleText = isReplaceMode ? replace({
          orgText: exampleInput,
          searchText,
          replaceText,
          isRegex
        }) : adding({
          orgText: exampleInput,
          addingText,
          addingMode
        }));
      }
    };
    return [
      searchText,
      isRegex,
      replaceText,
      isReplaceMode,
      addingText,
      addingMode,
      isShowingRenameModal,
      isShowingSelectFileModal,
      isLoading,
      selectedFileIds,
      aliyundriveFileList,
      exampleText,
      showDialog,
      submit,
      exampleInput,
      click_handler,
      click_handler_1,
      change_handler,
      checkbox_group_binding,
      modal0_open_binding,
      click_handler_2,
      click_handler_3,
      checkbox_checked_binding,
      input0_value_binding,
      input1_value_binding,
      tabitem0_open_binding,
      addingtextform_addingMode_binding,
      addingtextform_addingText_binding,
      modal1_open_binding
    ];
  }
  class App extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance, create_fragment, safe_not_equal, {}, null, [-1, -1]);
    }
  }
  new App({
    target: (() => {
      const app2 = document.createElement("div");
      document.body.append(app2);
      return app2;
    })()
  });

})();
