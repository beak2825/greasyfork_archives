// ==UserScript==
// @name         msu-marketplace-tool
// @namespace    npm/vite-plugin-monkey
// @version      0.0.1
// @author       monkey
// @description  mus marketplace tool
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=msu.io
// @match        https://msu.io/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/540111/msu-marketplace-tool.user.js
// @updateURL https://update.greasyfork.org/scripts/540111/msu-marketplace-tool.meta.js
// ==/UserScript==

(o=>{if(typeof GM_addStyle=="function"){GM_addStyle(o);return}const e=document.createElement("style");e.textContent=o,document.head.append(e)})(` /*! tailwindcss v4.1.8 | MIT License | https://tailwindcss.com */@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-border-style:solid;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000}}}@layer theme{:root,:host{--font-sans:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;--color-gray-300:oklch(87.2% .01 258.338);--spacing:.25rem;--text-xs:.75rem;--text-xs--line-height:calc(1/.75);--text-xl:1.25rem;--text-xl--line-height:calc(1.75/1.25);--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;line-height:1.5;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab,red,red)){::placeholder{color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){-webkit-appearance:button;-moz-appearance:button;appearance:button}::file-selector-button{-webkit-appearance:button;-moz-appearance:button;appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}:where(:root),:root:has(input.theme-controller[value=light]:checked),[data-theme=light]{color-scheme:light;--color-base-100:oklch(100% 0 0);--color-base-200:oklch(98% 0 0);--color-base-300:oklch(95% 0 0);--color-base-content:oklch(21% .006 285.885);--color-primary:oklch(45% .24 277.023);--color-primary-content:oklch(93% .034 272.788);--color-secondary:oklch(65% .241 354.308);--color-secondary-content:oklch(94% .028 342.258);--color-accent:oklch(77% .152 181.912);--color-accent-content:oklch(38% .063 188.416);--color-neutral:oklch(14% .005 285.823);--color-neutral-content:oklch(92% .004 286.32);--color-info:oklch(74% .16 232.661);--color-info-content:oklch(29% .066 243.157);--color-success:oklch(76% .177 163.223);--color-success-content:oklch(37% .077 168.94);--color-warning:oklch(82% .189 84.429);--color-warning-content:oklch(41% .112 45.904);--color-error:oklch(71% .194 13.428);--color-error-content:oklch(27% .105 12.094);--radius-selector:.5rem;--radius-field:.25rem;--radius-box:.5rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:1;--noise:0}@media (prefers-color-scheme:dark){:root{color-scheme:dark;--color-base-100:oklch(25.33% .016 252.42);--color-base-200:oklch(23.26% .014 253.1);--color-base-300:oklch(21.15% .012 254.09);--color-base-content:oklch(97.807% .029 256.847);--color-primary:oklch(58% .233 277.117);--color-primary-content:oklch(96% .018 272.314);--color-secondary:oklch(65% .241 354.308);--color-secondary-content:oklch(94% .028 342.258);--color-accent:oklch(77% .152 181.912);--color-accent-content:oklch(38% .063 188.416);--color-neutral:oklch(14% .005 285.823);--color-neutral-content:oklch(92% .004 286.32);--color-info:oklch(74% .16 232.661);--color-info-content:oklch(29% .066 243.157);--color-success:oklch(76% .177 163.223);--color-success-content:oklch(37% .077 168.94);--color-warning:oklch(82% .189 84.429);--color-warning-content:oklch(41% .112 45.904);--color-error:oklch(71% .194 13.428);--color-error-content:oklch(27% .105 12.094);--radius-selector:.5rem;--radius-field:.25rem;--radius-box:.5rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:1;--noise:0}}:root:has(input.theme-controller[value=light]:checked),[data-theme=light]{color-scheme:light;--color-base-100:oklch(100% 0 0);--color-base-200:oklch(98% 0 0);--color-base-300:oklch(95% 0 0);--color-base-content:oklch(21% .006 285.885);--color-primary:oklch(45% .24 277.023);--color-primary-content:oklch(93% .034 272.788);--color-secondary:oklch(65% .241 354.308);--color-secondary-content:oklch(94% .028 342.258);--color-accent:oklch(77% .152 181.912);--color-accent-content:oklch(38% .063 188.416);--color-neutral:oklch(14% .005 285.823);--color-neutral-content:oklch(92% .004 286.32);--color-info:oklch(74% .16 232.661);--color-info-content:oklch(29% .066 243.157);--color-success:oklch(76% .177 163.223);--color-success-content:oklch(37% .077 168.94);--color-warning:oklch(82% .189 84.429);--color-warning-content:oklch(41% .112 45.904);--color-error:oklch(71% .194 13.428);--color-error-content:oklch(27% .105 12.094);--radius-selector:.5rem;--radius-field:.25rem;--radius-box:.5rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:1;--noise:0}:root:has(input.theme-controller[value=dark]:checked),[data-theme=dark]{color-scheme:dark;--color-base-100:oklch(25.33% .016 252.42);--color-base-200:oklch(23.26% .014 253.1);--color-base-300:oklch(21.15% .012 254.09);--color-base-content:oklch(97.807% .029 256.847);--color-primary:oklch(58% .233 277.117);--color-primary-content:oklch(96% .018 272.314);--color-secondary:oklch(65% .241 354.308);--color-secondary-content:oklch(94% .028 342.258);--color-accent:oklch(77% .152 181.912);--color-accent-content:oklch(38% .063 188.416);--color-neutral:oklch(14% .005 285.823);--color-neutral-content:oklch(92% .004 286.32);--color-info:oklch(74% .16 232.661);--color-info-content:oklch(29% .066 243.157);--color-success:oklch(76% .177 163.223);--color-success-content:oklch(37% .077 168.94);--color-warning:oklch(82% .189 84.429);--color-warning-content:oklch(41% .112 45.904);--color-error:oklch(71% .194 13.428);--color-error-content:oklch(27% .105 12.094);--radius-selector:.5rem;--radius-field:.25rem;--radius-box:.5rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:1;--noise:0}@property --radialprogress{syntax: "<percentage>"; inherits: true; initial-value: 0%;}:root{scrollbar-color:currentColor #0000}@supports (color:color-mix(in lab,red,red)){:root{scrollbar-color:color-mix(in oklch,currentColor 35%,#0000)#0000}}:root{--fx-noise:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.34' numOctaves='4' stitchTiles='stitch'%3E%3C/feTurbulence%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)' opacity='0.2'%3E%3C/rect%3E%3C/svg%3E")}:root:has(.modal-open,.modal[open],.modal:target,.modal-toggle:checked,.drawer:not([class*=drawer-open])>.drawer-toggle:checked){overflow:hidden}:where(:root:has(.modal-open,.modal[open],.modal:target,.modal-toggle:checked,.drawer:not(.drawer-open)>.drawer-toggle:checked)){scrollbar-gutter:stable;background-image:linear-gradient(var(--color-base-100),var(--color-base-100));--root-bg:var(--color-base-100)}@supports (color:color-mix(in lab,red,red)){:where(:root:has(.modal-open,.modal[open],.modal:target,.modal-toggle:checked,.drawer:not(.drawer-open)>.drawer-toggle:checked)){--root-bg:color-mix(in srgb,var(--color-base-100),oklch(0% 0 0) 40%)}}:where(.modal[open],.modal-open,.modal-toggle:checked+.modal):not(.modal-start,.modal-end){scrollbar-gutter:stable}:root,[data-theme]{background-color:var(--root-bg,var(--color-base-100));color:var(--color-base-content)}}@layer components;@layer utilities{.tooltip{--tt-bg:var(--color-neutral);--tt-off: calc(100% + .5rem) ;--tt-tail: calc(100% + 1px + .25rem) ;display:inline-block;position:relative}.tooltip>:where(.tooltip-content),.tooltip:where([data-tip]):before{border-radius:var(--radius-field);text-align:center;white-space:normal;max-width:20rem;color:var(--color-neutral-content);opacity:0;background-color:var(--tt-bg);pointer-events:none;z-index:2;--tw-content:attr(data-tip);content:var(--tw-content);width:max-content;padding-block:.25rem;padding-inline:.5rem;font-size:.875rem;line-height:1.25;transition:opacity .2s cubic-bezier(.4,0,.2,1) 75ms,transform .2s cubic-bezier(.4,0,.2,1) 75ms;position:absolute}.tooltip:after{opacity:0;background-color:var(--tt-bg);content:"";pointer-events:none;--mask-tooltip:url("data:image/svg+xml,%3Csvg width='10' height='4' viewBox='0 0 8 4' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0.500009 1C3.5 1 3.00001 4 5.00001 4C7 4 6.5 1 9.5 1C10 1 10 0.499897 10 0H0C-1.99338e-08 0.5 0 1 0.500009 1Z' fill='black'/%3E%3C/svg%3E%0A");width:.625rem;height:.25rem;-webkit-mask-position:-1px 0;mask-position:-1px 0;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-image:var(--mask-tooltip);mask-image:var(--mask-tooltip);transition:opacity .2s cubic-bezier(.4,0,.2,1) 75ms,transform .2s cubic-bezier(.4,0,.2,1) 75ms;display:block;position:absolute}:is(.tooltip.tooltip-open,.tooltip[data-tip]:not([data-tip=""]):hover,.tooltip:not(:has(.tooltip-content:empty)):has(.tooltip-content):hover,.tooltip:has(:focus-visible))>.tooltip-content,:is(.tooltip.tooltip-open,.tooltip[data-tip]:not([data-tip=""]):hover,.tooltip:not(:has(.tooltip-content:empty)):has(.tooltip-content):hover,.tooltip:has(:focus-visible))[data-tip]:before,:is(.tooltip.tooltip-open,.tooltip[data-tip]:not([data-tip=""]):hover,.tooltip:not(:has(.tooltip-content:empty)):has(.tooltip-content):hover,.tooltip:has(:focus-visible)):after{opacity:1;--tt-pos:0rem;transition:opacity .2s cubic-bezier(.4,0,.2,1),transform .2s cubic-bezier(.4,0,.2,1)}.tooltip>.tooltip-content,.tooltip[data-tip]:before{transform:translate(-50%)translateY(var(--tt-pos,.25rem));inset:auto auto var(--tt-off)50%}.tooltip:after{transform:translate(-50%)translateY(var(--tt-pos,.25rem));inset:auto auto var(--tt-tail)50%}.tab{cursor:pointer;-webkit-appearance:none;-moz-appearance:none;appearance:none;text-align:center;webkit-user-select:none;-webkit-user-select:none;user-select:none;flex-wrap:wrap;justify-content:center;align-items:center;display:inline-flex;position:relative}@media (hover:hover){.tab:hover{color:var(--color-base-content)}}.tab{--tab-p:1rem;--tab-bg:var(--color-base-100);--tab-border-color:var(--color-base-300);--tab-radius-ss:0;--tab-radius-se:0;--tab-radius-es:0;--tab-radius-ee:0;--tab-order:0;--tab-radius-min:calc(.75rem - var(--border));order:var(--tab-order);height:var(--tab-height);border-color:#0000;padding-inline-start:var(--tab-p);padding-inline-end:var(--tab-p);font-size:.875rem}.tab:is(input[type=radio]){min-width:fit-content}.tab:is(input[type=radio]):after{content:attr(aria-label)}.tab:is(label){position:relative}.tab:is(label) input{cursor:pointer;-webkit-appearance:none;-moz-appearance:none;appearance:none;opacity:0;position:absolute;top:0;right:0;bottom:0;left:0}:is(.tab:checked,.tab:is(label:has(:checked)),.tab:is(.tab-active,[aria-selected=true]))+.tab-content{height:calc(100% - var(--tab-height) + var(--border));display:block}.tab:not(:checked,label:has(:checked),:hover,.tab-active,[aria-selected=true]){color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.tab:not(:checked,label:has(:checked),:hover,.tab-active,[aria-selected=true]){color:color-mix(in oklab,var(--color-base-content)50%,transparent)}}.tab:not(input):empty{cursor:default;flex-grow:1}.tab:focus{--tw-outline-style:none;outline-style:none}@media (forced-colors:active){.tab:focus{outline-offset:2px;outline:2px solid #0000}}.tab:focus-visible,.tab:is(label:has(:checked:focus-visible)){outline-offset:-5px;outline:2px solid}.tab[disabled]{pointer-events:none;opacity:.4}.floating-label{display:block;position:relative}.floating-label input{display:block}.floating-label input::placeholder,.floating-label textarea::placeholder{transition:top .1s ease-out,translate .1s ease-out,scale .1s ease-out,opacity .1s ease-out}.floating-label>span{z-index:1;background-color:var(--color-base-100);opacity:0;inset-inline-start:.75rem;top:calc(var(--size-field,.25rem)*10/2);pointer-events:none;border-radius:2px;padding-inline:.25rem;font-size:.875rem;line-height:1;transition:top .1s ease-out,translate .1s ease-out,scale .1s ease-out,opacity .1s ease-out;position:absolute;translate:0 -50%}:is(.floating-label:focus-within,.floating-label:not(:has(input:placeholder-shown,textarea:placeholder-shown))) ::placeholder{opacity:0;pointer-events:auto;top:0;translate:-12.5% calc(-50% - .125em);scale:.75}:is(.floating-label:focus-within,.floating-label:not(:has(input:placeholder-shown,textarea:placeholder-shown)))>span{opacity:1;pointer-events:auto;z-index:2;top:0;translate:-12.5% calc(-50% - .125em);scale:.75}.floating-label:has(:disabled,[disabled])>span{opacity:0}.floating-label:has(.input-xs,.select-xs,.textarea-xs) span{top:calc(var(--size-field,.25rem)*6/2);font-size:.6875rem}.floating-label:has(.input-sm,.select-sm,.textarea-sm) span{top:calc(var(--size-field,.25rem)*8/2);font-size:.75rem}.floating-label:has(.input-md,.select-md,.textarea-md) span{top:calc(var(--size-field,.25rem)*10/2);font-size:.875rem}.floating-label:has(.input-lg,.select-lg,.textarea-lg) span{top:calc(var(--size-field,.25rem)*12/2);font-size:1.125rem}.floating-label:has(.input-xl,.select-xl,.textarea-xl) span{top:calc(var(--size-field,.25rem)*14/2);font-size:1.375rem}.dropdown{position-area:var(--anchor-v,bottom)var(--anchor-h,span-right);display:inline-block;position:relative}.dropdown>:not(summary):focus{--tw-outline-style:none;outline-style:none}@media (forced-colors:active){.dropdown>:not(summary):focus{outline-offset:2px;outline:2px solid #0000}}.dropdown .dropdown-content{position:absolute}.dropdown:not(details,.dropdown-open,.dropdown-hover:hover,:focus-within) .dropdown-content{transform-origin:top;opacity:0;display:none;scale:95%}.dropdown[popover],.dropdown .dropdown-content{z-index:999;transition-behavior:allow-discrete;transition-property:opacity,scale,display;transition-duration:.2s;transition-timing-function:cubic-bezier(.4,0,.2,1);animation:.2s dropdown}@starting-style{.dropdown[popover],.dropdown .dropdown-content{opacity:0;scale:95%}}:is(.dropdown.dropdown-open,.dropdown:not(.dropdown-hover):focus,.dropdown:focus-within)>[tabindex]:first-child{pointer-events:none}:is(.dropdown.dropdown-open,.dropdown:not(.dropdown-hover):focus,.dropdown:focus-within) .dropdown-content{opacity:1}.dropdown.dropdown-hover:hover .dropdown-content{opacity:1;scale:100%}.dropdown:is(details) summary::-webkit-details-marker{display:none}:is(.dropdown.dropdown-open,.dropdown:focus,.dropdown:focus-within) .dropdown-content{scale:100%}.dropdown:where([popover]){background:0 0}.dropdown[popover]{color:inherit;position:fixed}@supports not (position-area:bottom){.dropdown[popover]{margin:auto}.dropdown[popover].dropdown-open:not(:popover-open){transform-origin:top;opacity:0;display:none;scale:95%}.dropdown[popover]::backdrop{background-color:oklab(0% none none/.3)}}.dropdown[popover]:not(.dropdown-open,:popover-open){transform-origin:top;opacity:0;display:none;scale:95%}.input{cursor:text;border:var(--border)solid #0000;-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:var(--color-base-100);vertical-align:middle;white-space:nowrap;width:clamp(3rem,20rem,100%);height:var(--size);touch-action:manipulation;border-color:var(--input-color);box-shadow:0 1px var(--input-color) inset,0 -1px oklch(100% 0 0/calc(var(--depth)*.1)) inset;border-start-start-radius:var(--join-ss,var(--radius-field));border-start-end-radius:var(--join-se,var(--radius-field));border-end-end-radius:var(--join-ee,var(--radius-field));border-end-start-radius:var(--join-es,var(--radius-field));flex-shrink:1;align-items:center;gap:.5rem;padding-inline:.75rem;font-size:.875rem;display:inline-flex;position:relative}@supports (color:color-mix(in lab,red,red)){.input{box-shadow:0 1px color-mix(in oklab,var(--input-color)calc(var(--depth)*10%),#0000) inset,0 -1px oklch(100% 0 0/calc(var(--depth)*.1)) inset}}.input{--size:calc(var(--size-field,.25rem)*10);--input-color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.input{--input-color:color-mix(in oklab,var(--color-base-content)20%,#0000)}}.input:where(input){display:inline-flex}.input :where(input){-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:#0000;border:none;width:100%;height:100%;display:inline-flex}.input :where(input):focus,.input :where(input):focus-within{--tw-outline-style:none;outline-style:none}@media (forced-colors:active){.input :where(input):focus,.input :where(input):focus-within{outline-offset:2px;outline:2px solid #0000}}.input :where(input[type=url]),.input :where(input[type=email]){direction:ltr}.input :where(input[type=date]){display:inline-block}.input:focus,.input:focus-within{--input-color:var(--color-base-content);box-shadow:0 1px var(--input-color)}@supports (color:color-mix(in lab,red,red)){.input:focus,.input:focus-within{box-shadow:0 1px color-mix(in oklab,var(--input-color)calc(var(--depth)*10%),#0000)}}.input:focus,.input:focus-within{outline:2px solid var(--input-color);outline-offset:2px;isolation:isolate;z-index:1}.input:has(>input[disabled]),.input:is(:disabled,[disabled]){cursor:not-allowed;border-color:var(--color-base-200);background-color:var(--color-base-200);color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.input:has(>input[disabled]),.input:is(:disabled,[disabled]){color:color-mix(in oklab,var(--color-base-content)40%,transparent)}}:is(.input:has(>input[disabled]),.input:is(:disabled,[disabled]))::placeholder{color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){:is(.input:has(>input[disabled]),.input:is(:disabled,[disabled]))::placeholder{color:color-mix(in oklab,var(--color-base-content)20%,transparent)}}.input:has(>input[disabled]),.input:is(:disabled,[disabled]){box-shadow:none}.input:has(>input[disabled])>input[disabled]{cursor:not-allowed}.input::-webkit-date-and-time-value{text-align:inherit}.input[type=number]::-webkit-inner-spin-button{margin-block:-.75rem;margin-inline-end:-.75rem}.input::-webkit-calendar-picker-indicator{position:absolute;inset-inline-end:.75em}.tabs-border .tab{--tab-border-color:#0000 #0000 var(--tab-border-color)#0000;border-radius:var(--radius-field);position:relative}.tabs-border .tab:before{--tw-content:"";content:var(--tw-content);background-color:var(--tab-border-color);border-radius:var(--radius-field);width:80%;height:3px;transition:background-color .2s;position:absolute;bottom:0;left:10%}:is(.tabs-border .tab:is(.tab-active,[aria-selected=true]):not(.tab-disabled,[disabled]),.tabs-border .tab:is(input:checked),.tabs-border .tab:is(label:has(:checked))):before{--tab-border-color:currentColor;border-top:3px solid}.absolute{position:absolute}.fixed{position:fixed}.relative{position:relative}.sticky{position:sticky}.dropdown-left{--anchor-h:left;--anchor-v:span-bottom}.dropdown-left .dropdown-content{transform-origin:100%;inset-inline-end:100%;top:0;bottom:auto}.top-0{top:calc(var(--spacing)*0)}.top-2{top:calc(var(--spacing)*2)}.top-20{top:calc(var(--spacing)*20)}.right-1{right:calc(var(--spacing)*1)}.bottom-1{bottom:calc(var(--spacing)*1)}.left-0{left:calc(var(--spacing)*0)}.left-1\\/2{left:50%}.z-50{z-index:50}.z-\\[99999\\]{z-index:99999}.col-span-4{grid-column:span 4/span 4}.input-xs{--size:calc(var(--size-field,.25rem)*6);font-size:.6875rem}.input-xs[type=number]::-webkit-inner-spin-button{margin-block:-.25rem;margin-inline-end:-.75rem}.mr-0{margin-right:calc(var(--spacing)*0)}.ml-auto{margin-left:auto}.tabs{--tabs-height:auto;--tabs-direction:row;--tab-height:calc(var(--size-field,.25rem)*10);height:var(--tabs-height);flex-wrap:wrap;flex-direction:var(--tabs-direction);display:flex}.flex{display:flex}.grid{display:grid}.hidden{display:none}.aspect-square{aspect-ratio:1}.h-\\[1\\.5em\\]{height:1.5em}.h-full{height:100%}.w-full{width:100%}.shrink-0{flex-shrink:0}.transform{transform:var(--tw-rotate-x,)var(--tw-rotate-y,)var(--tw-rotate-z,)var(--tw-skew-x,)var(--tw-skew-y,)}.cursor-pointer{cursor:pointer}.auto-rows-max{grid-auto-rows:max-content}.grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.flex-col{flex-direction:column}.place-items-center{place-items:center}.items-center{align-items:center}.gap-1{gap:calc(var(--spacing)*1)}.truncate{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.overflow-y-auto{overflow-y:auto}.rounded{border-radius:.25rem}.\\!border{border-style:var(--tw-border-style)!important;border-width:1px!important}.border{border-style:var(--tw-border-style);border-width:1px}.border-gray-300{border-color:var(--color-gray-300)}.border-primary\\/50{border-color:var(--color-primary)}@supports (color:color-mix(in lab,red,red)){.border-primary\\/50{border-color:color-mix(in oklab,var(--color-primary)50%,transparent)}}.bg-base-100{background-color:var(--color-base-100)}.bg-transparent{background-color:#0000}.p-2{padding:calc(var(--spacing)*2)}.px-2{padding-inline:calc(var(--spacing)*2)}.pb-2{padding-bottom:calc(var(--spacing)*2)}.text-center{text-align:center}.text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}.text-xs{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height))}.tabs-xs{--tab-height:calc(var(--size-field,.25rem)*6)}.tabs-xs :where(.tab){--tab-p:.375rem;--tab-radius-min:calc(.5rem - var(--border));font-size:.75rem}.whitespace-pre-line{white-space:pre-line}.text-primary{color:var(--color-primary)}.opacity-50{opacity:.5}.shadow-sm{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a),0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}@media (hover:hover){.hover\\:text-primary:hover{color:var(--color-primary)}}}@keyframes radio{0%{padding:5px}50%{padding:3px}}@keyframes skeleton{0%{background-position:150%}to{background-position:-50%}}@keyframes progress{50%{background-position-x:-115%}}@keyframes toast{0%{opacity:0;scale:.9}to{opacity:1;scale:1}}@keyframes dropdown{0%{opacity:0}}@keyframes rating{0%,40%{filter:brightness(1.05)contrast(1.05);scale:1.1}}@property --tw-rotate-x{syntax:"*";inherits:false}@property --tw-rotate-y{syntax:"*";inherits:false}@property --tw-rotate-z{syntax:"*";inherits:false}@property --tw-skew-x{syntax:"*";inherits:false}@property --tw-skew-y{syntax:"*";inherits:false}@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:"*";inherits:false}@property --tw-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:"*";inherits:false}@property --tw-inset-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:"*";inherits:false}@property --tw-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:"*";inherits:false}@property --tw-inset-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:"*";inherits:false}@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:"*";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000} `);

(function () {
  'use strict';

  var _a;
  const DEV = false;
  var is_array = Array.isArray;
  var index_of = Array.prototype.indexOf;
  var array_from = Array.from;
  var define_property = Object.defineProperty;
  var get_descriptor = Object.getOwnPropertyDescriptor;
  var get_descriptors = Object.getOwnPropertyDescriptors;
  var object_prototype = Object.prototype;
  var array_prototype = Array.prototype;
  var get_prototype_of = Object.getPrototypeOf;
  var is_extensible = Object.isExtensible;
  function is_function(thing) {
    return typeof thing === "function";
  }
  const noop = () => {
  };
  function run_all(arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i]();
    }
  }
  function to_array(value, n) {
    if (Array.isArray(value)) {
      return value;
    }
    if (!(Symbol.iterator in value)) {
      return Array.from(value);
    }
    const array = [];
    for (const element of value) {
      array.push(element);
      if (array.length === n) break;
    }
    return array;
  }
  const DERIVED = 1 << 1;
  const EFFECT = 1 << 2;
  const RENDER_EFFECT = 1 << 3;
  const BLOCK_EFFECT = 1 << 4;
  const BRANCH_EFFECT = 1 << 5;
  const ROOT_EFFECT = 1 << 6;
  const BOUNDARY_EFFECT = 1 << 7;
  const UNOWNED = 1 << 8;
  const DISCONNECTED = 1 << 9;
  const CLEAN = 1 << 10;
  const DIRTY = 1 << 11;
  const MAYBE_DIRTY = 1 << 12;
  const INERT = 1 << 13;
  const DESTROYED = 1 << 14;
  const EFFECT_RAN = 1 << 15;
  const EFFECT_TRANSPARENT = 1 << 16;
  const HEAD_EFFECT = 1 << 19;
  const EFFECT_HAS_DERIVED = 1 << 20;
  const EFFECT_IS_UPDATING = 1 << 21;
  const STATE_SYMBOL = Symbol("$state");
  const LOADING_ATTR_SYMBOL = Symbol("");
  function equals(value) {
    return value === this.v;
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
  }
  function safe_equals(value) {
    return !safe_not_equal(value, this.v);
  }
  function effect_in_teardown(rune) {
    {
      throw new Error(`https://svelte.dev/e/effect_in_teardown`);
    }
  }
  function effect_in_unowned_derived() {
    {
      throw new Error(`https://svelte.dev/e/effect_in_unowned_derived`);
    }
  }
  function effect_orphan(rune) {
    {
      throw new Error(`https://svelte.dev/e/effect_orphan`);
    }
  }
  function effect_update_depth_exceeded() {
    {
      throw new Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
    }
  }
  function state_descriptors_fixed() {
    {
      throw new Error(`https://svelte.dev/e/state_descriptors_fixed`);
    }
  }
  function state_prototype_fixed() {
    {
      throw new Error(`https://svelte.dev/e/state_prototype_fixed`);
    }
  }
  function state_unsafe_mutation() {
    {
      throw new Error(`https://svelte.dev/e/state_unsafe_mutation`);
    }
  }
  let tracing_mode_flag = false;
  const EACH_ITEM_REACTIVE = 1;
  const EACH_INDEX_REACTIVE = 1 << 1;
  const EACH_ITEM_IMMUTABLE = 1 << 4;
  const TRANSITION_GLOBAL = 1 << 2;
  const TEMPLATE_FRAGMENT = 1;
  const TEMPLATE_USE_IMPORT_NODE = 1 << 1;
  const UNINITIALIZED = Symbol();
  const NAMESPACE_HTML = "http://www.w3.org/1999/xhtml";
  let component_context = null;
  function set_component_context(context) {
    component_context = context;
  }
  function push(props, runes = false, fn) {
    var ctx = component_context = {
      p: component_context,
      c: null,
      d: false,
      e: null,
      m: false,
      s: props,
      x: null,
      l: null
    };
    teardown(() => {
      ctx.d = true;
    });
  }
  function pop(component) {
    const context_stack_item = component_context;
    if (context_stack_item !== null) {
      const component_effects = context_stack_item.e;
      if (component_effects !== null) {
        var previous_effect = active_effect;
        var previous_reaction = active_reaction;
        context_stack_item.e = null;
        try {
          for (var i = 0; i < component_effects.length; i++) {
            var component_effect = component_effects[i];
            set_active_effect(component_effect.effect);
            set_active_reaction(component_effect.reaction);
            effect(component_effect.fn);
          }
        } finally {
          set_active_effect(previous_effect);
          set_active_reaction(previous_reaction);
        }
      }
      component_context = context_stack_item.p;
      context_stack_item.m = true;
    }
    return (
      /** @type {T} */
      {}
    );
  }
  function is_runes() {
    return true;
  }
  function proxy(value) {
    if (typeof value !== "object" || value === null || STATE_SYMBOL in value) {
      return value;
    }
    const prototype = get_prototype_of(value);
    if (prototype !== object_prototype && prototype !== array_prototype) {
      return value;
    }
    var sources = /* @__PURE__ */ new Map();
    var is_proxied_array = is_array(value);
    var version = /* @__PURE__ */ state(0);
    var reaction = active_reaction;
    var with_parent = (fn) => {
      var previous_reaction = active_reaction;
      set_active_reaction(reaction);
      var result = fn();
      set_active_reaction(previous_reaction);
      return result;
    };
    if (is_proxied_array) {
      sources.set("length", /* @__PURE__ */ state(
        /** @type {any[]} */
        value.length
      ));
    }
    return new Proxy(
      /** @type {any} */
      value,
      {
        defineProperty(_, prop, descriptor) {
          if (!("value" in descriptor) || descriptor.configurable === false || descriptor.enumerable === false || descriptor.writable === false) {
            state_descriptors_fixed();
          }
          var s = sources.get(prop);
          if (s === void 0) {
            s = with_parent(() => /* @__PURE__ */ state(descriptor.value));
            sources.set(prop, s);
          } else {
            set(
              s,
              with_parent(() => proxy(descriptor.value))
            );
          }
          return true;
        },
        deleteProperty(target, prop) {
          var s = sources.get(prop);
          if (s === void 0) {
            if (prop in target) {
              sources.set(
                prop,
                with_parent(() => /* @__PURE__ */ state(UNINITIALIZED))
              );
              update_version(version);
            }
          } else {
            if (is_proxied_array && typeof prop === "string") {
              var ls = (
                /** @type {Source<number>} */
                sources.get("length")
              );
              var n = Number(prop);
              if (Number.isInteger(n) && n < ls.v) {
                set(ls, n);
              }
            }
            set(s, UNINITIALIZED);
            update_version(version);
          }
          return true;
        },
        get(target, prop, receiver) {
          var _a2;
          if (prop === STATE_SYMBOL) {
            return value;
          }
          var s = sources.get(prop);
          var exists = prop in target;
          if (s === void 0 && (!exists || ((_a2 = get_descriptor(target, prop)) == null ? void 0 : _a2.writable))) {
            s = with_parent(() => /* @__PURE__ */ state(proxy(exists ? target[prop] : UNINITIALIZED)));
            sources.set(prop, s);
          }
          if (s !== void 0) {
            var v = get(s);
            return v === UNINITIALIZED ? void 0 : v;
          }
          return Reflect.get(target, prop, receiver);
        },
        getOwnPropertyDescriptor(target, prop) {
          var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
          if (descriptor && "value" in descriptor) {
            var s = sources.get(prop);
            if (s) descriptor.value = get(s);
          } else if (descriptor === void 0) {
            var source2 = sources.get(prop);
            var value2 = source2 == null ? void 0 : source2.v;
            if (source2 !== void 0 && value2 !== UNINITIALIZED) {
              return {
                enumerable: true,
                configurable: true,
                value: value2,
                writable: true
              };
            }
          }
          return descriptor;
        },
        has(target, prop) {
          var _a2;
          if (prop === STATE_SYMBOL) {
            return true;
          }
          var s = sources.get(prop);
          var has = s !== void 0 && s.v !== UNINITIALIZED || Reflect.has(target, prop);
          if (s !== void 0 || active_effect !== null && (!has || ((_a2 = get_descriptor(target, prop)) == null ? void 0 : _a2.writable))) {
            if (s === void 0) {
              s = with_parent(() => /* @__PURE__ */ state(has ? proxy(target[prop]) : UNINITIALIZED));
              sources.set(prop, s);
            }
            var value2 = get(s);
            if (value2 === UNINITIALIZED) {
              return false;
            }
          }
          return has;
        },
        set(target, prop, value2, receiver) {
          var _a2;
          var s = sources.get(prop);
          var has = prop in target;
          if (is_proxied_array && prop === "length") {
            for (var i = value2; i < /** @type {Source<number>} */
            s.v; i += 1) {
              var other_s = sources.get(i + "");
              if (other_s !== void 0) {
                set(other_s, UNINITIALIZED);
              } else if (i in target) {
                other_s = with_parent(() => /* @__PURE__ */ state(UNINITIALIZED));
                sources.set(i + "", other_s);
              }
            }
          }
          if (s === void 0) {
            if (!has || ((_a2 = get_descriptor(target, prop)) == null ? void 0 : _a2.writable)) {
              s = with_parent(() => /* @__PURE__ */ state(void 0));
              set(
                s,
                with_parent(() => proxy(value2))
              );
              sources.set(prop, s);
            }
          } else {
            has = s.v !== UNINITIALIZED;
            set(
              s,
              with_parent(() => proxy(value2))
            );
          }
          var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
          if (descriptor == null ? void 0 : descriptor.set) {
            descriptor.set.call(receiver, value2);
          }
          if (!has) {
            if (is_proxied_array && typeof prop === "string") {
              var ls = (
                /** @type {Source<number>} */
                sources.get("length")
              );
              var n = Number(prop);
              if (Number.isInteger(n) && n >= ls.v) {
                set(ls, n + 1);
              }
            }
            update_version(version);
          }
          return true;
        },
        ownKeys(target) {
          get(version);
          var own_keys = Reflect.ownKeys(target).filter((key2) => {
            var source3 = sources.get(key2);
            return source3 === void 0 || source3.v !== UNINITIALIZED;
          });
          for (var [key, source2] of sources) {
            if (source2.v !== UNINITIALIZED && !(key in target)) {
              own_keys.push(key);
            }
          }
          return own_keys;
        },
        setPrototypeOf() {
          state_prototype_fixed();
        }
      }
    );
  }
  function update_version(signal, d = 1) {
    set(signal, signal.v + d);
  }
  // @__NO_SIDE_EFFECTS__
  function derived(fn) {
    var flags = DERIVED | DIRTY;
    var parent_derived = active_reaction !== null && (active_reaction.f & DERIVED) !== 0 ? (
      /** @type {Derived} */
      active_reaction
    ) : null;
    if (active_effect === null || parent_derived !== null && (parent_derived.f & UNOWNED) !== 0) {
      flags |= UNOWNED;
    } else {
      active_effect.f |= EFFECT_HAS_DERIVED;
    }
    const signal = {
      ctx: component_context,
      deps: null,
      effects: null,
      equals,
      f: flags,
      fn,
      reactions: null,
      rv: 0,
      v: (
        /** @type {V} */
        null
      ),
      wv: 0,
      parent: parent_derived ?? active_effect
    };
    return signal;
  }
  // @__NO_SIDE_EFFECTS__
  function user_derived(fn) {
    const d = /* @__PURE__ */ derived(fn);
    push_reaction_value(d);
    return d;
  }
  // @__NO_SIDE_EFFECTS__
  function derived_safe_equal(fn) {
    const signal = /* @__PURE__ */ derived(fn);
    signal.equals = safe_equals;
    return signal;
  }
  function destroy_derived_effects(derived2) {
    var effects = derived2.effects;
    if (effects !== null) {
      derived2.effects = null;
      for (var i = 0; i < effects.length; i += 1) {
        destroy_effect(
          /** @type {Effect} */
          effects[i]
        );
      }
    }
  }
  function get_derived_parent_effect(derived2) {
    var parent = derived2.parent;
    while (parent !== null) {
      if ((parent.f & DERIVED) === 0) {
        return (
          /** @type {Effect} */
          parent
        );
      }
      parent = parent.parent;
    }
    return null;
  }
  function execute_derived(derived2) {
    var value;
    var prev_active_effect = active_effect;
    set_active_effect(get_derived_parent_effect(derived2));
    {
      try {
        destroy_derived_effects(derived2);
        value = update_reaction(derived2);
      } finally {
        set_active_effect(prev_active_effect);
      }
    }
    return value;
  }
  function update_derived(derived2) {
    var value = execute_derived(derived2);
    if (!derived2.equals(value)) {
      derived2.v = value;
      derived2.wv = increment_write_version();
    }
    if (is_destroying_effect) return;
    var status = (skip_reaction || (derived2.f & UNOWNED) !== 0) && derived2.deps !== null ? MAYBE_DIRTY : CLEAN;
    set_signal_status(derived2, status);
  }
  const old_values = /* @__PURE__ */ new Map();
  function source(v, stack) {
    var signal = {
      f: 0,
      // TODO ideally we could skip this altogether, but it causes type errors
      v,
      reactions: null,
      equals,
      rv: 0,
      wv: 0
    };
    return signal;
  }
  // @__NO_SIDE_EFFECTS__
  function state(v, stack) {
    const s = source(v);
    push_reaction_value(s);
    return s;
  }
  // @__NO_SIDE_EFFECTS__
  function mutable_source(initial_value, immutable = false) {
    const s = source(initial_value);
    if (!immutable) {
      s.equals = safe_equals;
    }
    return s;
  }
  function set(source2, value, should_proxy = false) {
    if (active_reaction !== null && !untracking && is_runes() && (active_reaction.f & (DERIVED | BLOCK_EFFECT)) !== 0 && !(reaction_sources == null ? void 0 : reaction_sources.includes(source2))) {
      state_unsafe_mutation();
    }
    let new_value = should_proxy ? proxy(value) : value;
    return internal_set(source2, new_value);
  }
  function internal_set(source2, value) {
    if (!source2.equals(value)) {
      var old_value = source2.v;
      if (is_destroying_effect) {
        old_values.set(source2, value);
      } else {
        old_values.set(source2, old_value);
      }
      source2.v = value;
      if ((source2.f & DERIVED) !== 0) {
        if ((source2.f & DIRTY) !== 0) {
          execute_derived(
            /** @type {Derived} */
            source2
          );
        }
        set_signal_status(source2, (source2.f & UNOWNED) === 0 ? CLEAN : MAYBE_DIRTY);
      }
      source2.wv = increment_write_version();
      mark_reactions(source2, DIRTY);
      if (active_effect !== null && (active_effect.f & CLEAN) !== 0 && (active_effect.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0) {
        if (untracked_writes === null) {
          set_untracked_writes([source2]);
        } else {
          untracked_writes.push(source2);
        }
      }
    }
    return value;
  }
  function mark_reactions(signal, status) {
    var reactions = signal.reactions;
    if (reactions === null) return;
    var length = reactions.length;
    for (var i = 0; i < length; i++) {
      var reaction = reactions[i];
      var flags = reaction.f;
      if ((flags & DIRTY) !== 0) continue;
      set_signal_status(reaction, status);
      if ((flags & (CLEAN | UNOWNED)) !== 0) {
        if ((flags & DERIVED) !== 0) {
          mark_reactions(
            /** @type {Derived} */
            reaction,
            MAYBE_DIRTY
          );
        } else {
          schedule_effect(
            /** @type {Effect} */
            reaction
          );
        }
      }
    }
  }
  let hydrating = false;
  var $window;
  var $document;
  var is_firefox;
  var first_child_getter;
  var next_sibling_getter;
  function init_operations() {
    if ($window !== void 0) {
      return;
    }
    $window = window;
    $document = document;
    is_firefox = /Firefox/.test(navigator.userAgent);
    var element_prototype = Element.prototype;
    var node_prototype = Node.prototype;
    var text_prototype = Text.prototype;
    first_child_getter = get_descriptor(node_prototype, "firstChild").get;
    next_sibling_getter = get_descriptor(node_prototype, "nextSibling").get;
    if (is_extensible(element_prototype)) {
      element_prototype.__click = void 0;
      element_prototype.__className = void 0;
      element_prototype.__attributes = null;
      element_prototype.__style = void 0;
      element_prototype.__e = void 0;
    }
    if (is_extensible(text_prototype)) {
      text_prototype.__t = void 0;
    }
  }
  function create_text(value = "") {
    return document.createTextNode(value);
  }
  // @__NO_SIDE_EFFECTS__
  function get_first_child(node) {
    return first_child_getter.call(node);
  }
  // @__NO_SIDE_EFFECTS__
  function get_next_sibling(node) {
    return next_sibling_getter.call(node);
  }
  function child(node, is_text) {
    {
      return /* @__PURE__ */ get_first_child(node);
    }
  }
  function first_child(fragment, is_text) {
    {
      var first = (
        /** @type {DocumentFragment} */
        /* @__PURE__ */ get_first_child(
          /** @type {Node} */
          fragment
        )
      );
      if (first instanceof Comment && first.data === "") return /* @__PURE__ */ get_next_sibling(first);
      return first;
    }
  }
  function sibling(node, count = 1, is_text = false) {
    let next_sibling = node;
    while (count--) {
      next_sibling = /** @type {TemplateNode} */
      /* @__PURE__ */ get_next_sibling(next_sibling);
    }
    {
      return next_sibling;
    }
  }
  function clear_text_content(node) {
    node.textContent = "";
  }
  function validate_effect(rune) {
    if (active_effect === null && active_reaction === null) {
      effect_orphan();
    }
    if (active_reaction !== null && (active_reaction.f & UNOWNED) !== 0 && active_effect === null) {
      effect_in_unowned_derived();
    }
    if (is_destroying_effect) {
      effect_in_teardown();
    }
  }
  function push_effect(effect2, parent_effect) {
    var parent_last = parent_effect.last;
    if (parent_last === null) {
      parent_effect.last = parent_effect.first = effect2;
    } else {
      parent_last.next = effect2;
      effect2.prev = parent_last;
      parent_effect.last = effect2;
    }
  }
  function create_effect(type, fn, sync, push2 = true) {
    var parent = active_effect;
    var effect2 = {
      ctx: component_context,
      deps: null,
      nodes_start: null,
      nodes_end: null,
      f: type | DIRTY,
      first: null,
      fn,
      last: null,
      next: null,
      parent,
      prev: null,
      teardown: null,
      transitions: null,
      wv: 0
    };
    if (sync) {
      try {
        update_effect(effect2);
        effect2.f |= EFFECT_RAN;
      } catch (e) {
        destroy_effect(effect2);
        throw e;
      }
    } else if (fn !== null) {
      schedule_effect(effect2);
    }
    var inert = sync && effect2.deps === null && effect2.first === null && effect2.nodes_start === null && effect2.teardown === null && (effect2.f & (EFFECT_HAS_DERIVED | BOUNDARY_EFFECT)) === 0;
    if (!inert && push2) {
      if (parent !== null) {
        push_effect(effect2, parent);
      }
      if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0) {
        var derived2 = (
          /** @type {Derived} */
          active_reaction
        );
        (derived2.effects ?? (derived2.effects = [])).push(effect2);
      }
    }
    return effect2;
  }
  function teardown(fn) {
    const effect2 = create_effect(RENDER_EFFECT, null, false);
    set_signal_status(effect2, CLEAN);
    effect2.teardown = fn;
    return effect2;
  }
  function user_effect(fn) {
    validate_effect();
    var defer = active_effect !== null && (active_effect.f & BRANCH_EFFECT) !== 0 && component_context !== null && !component_context.m;
    if (defer) {
      var context = (
        /** @type {ComponentContext} */
        component_context
      );
      (context.e ?? (context.e = [])).push({
        fn,
        effect: active_effect,
        reaction: active_reaction
      });
    } else {
      var signal = effect(fn);
      return signal;
    }
  }
  function component_root(fn) {
    const effect2 = create_effect(ROOT_EFFECT, fn, true);
    return (options = {}) => {
      return new Promise((fulfil) => {
        if (options.outro) {
          pause_effect(effect2, () => {
            destroy_effect(effect2);
            fulfil(void 0);
          });
        } else {
          destroy_effect(effect2);
          fulfil(void 0);
        }
      });
    };
  }
  function effect(fn) {
    return create_effect(EFFECT, fn, false);
  }
  function render_effect(fn) {
    return create_effect(RENDER_EFFECT, fn, true);
  }
  function template_effect(fn, thunks = [], d = derived) {
    const deriveds = thunks.map(d);
    const effect2 = () => fn(...deriveds.map(get));
    return block(effect2);
  }
  function block(fn, flags = 0) {
    return create_effect(RENDER_EFFECT | BLOCK_EFFECT | flags, fn, true);
  }
  function branch(fn, push2 = true) {
    return create_effect(RENDER_EFFECT | BRANCH_EFFECT, fn, true, push2);
  }
  function execute_effect_teardown(effect2) {
    var teardown2 = effect2.teardown;
    if (teardown2 !== null) {
      const previously_destroying_effect = is_destroying_effect;
      const previous_reaction = active_reaction;
      set_is_destroying_effect(true);
      set_active_reaction(null);
      try {
        teardown2.call(null);
      } finally {
        set_is_destroying_effect(previously_destroying_effect);
        set_active_reaction(previous_reaction);
      }
    }
  }
  function destroy_effect_children(signal, remove_dom = false) {
    var effect2 = signal.first;
    signal.first = signal.last = null;
    while (effect2 !== null) {
      var next = effect2.next;
      if ((effect2.f & ROOT_EFFECT) !== 0) {
        effect2.parent = null;
      } else {
        destroy_effect(effect2, remove_dom);
      }
      effect2 = next;
    }
  }
  function destroy_block_effect_children(signal) {
    var effect2 = signal.first;
    while (effect2 !== null) {
      var next = effect2.next;
      if ((effect2.f & BRANCH_EFFECT) === 0) {
        destroy_effect(effect2);
      }
      effect2 = next;
    }
  }
  function destroy_effect(effect2, remove_dom = true) {
    var removed = false;
    if ((remove_dom || (effect2.f & HEAD_EFFECT) !== 0) && effect2.nodes_start !== null) {
      remove_effect_dom(
        effect2.nodes_start,
        /** @type {TemplateNode} */
        effect2.nodes_end
      );
      removed = true;
    }
    destroy_effect_children(effect2, remove_dom && !removed);
    remove_reactions(effect2, 0);
    set_signal_status(effect2, DESTROYED);
    var transitions = effect2.transitions;
    if (transitions !== null) {
      for (const transition2 of transitions) {
        transition2.stop();
      }
    }
    execute_effect_teardown(effect2);
    var parent = effect2.parent;
    if (parent !== null && parent.first !== null) {
      unlink_effect(effect2);
    }
    effect2.next = effect2.prev = effect2.teardown = effect2.ctx = effect2.deps = effect2.fn = effect2.nodes_start = effect2.nodes_end = null;
  }
  function remove_effect_dom(node, end) {
    while (node !== null) {
      var next = node === end ? null : (
        /** @type {TemplateNode} */
        /* @__PURE__ */ get_next_sibling(node)
      );
      node.remove();
      node = next;
    }
  }
  function unlink_effect(effect2) {
    var parent = effect2.parent;
    var prev = effect2.prev;
    var next = effect2.next;
    if (prev !== null) prev.next = next;
    if (next !== null) next.prev = prev;
    if (parent !== null) {
      if (parent.first === effect2) parent.first = next;
      if (parent.last === effect2) parent.last = prev;
    }
  }
  function pause_effect(effect2, callback) {
    var transitions = [];
    pause_children(effect2, transitions, true);
    run_out_transitions(transitions, () => {
      destroy_effect(effect2);
      if (callback) callback();
    });
  }
  function run_out_transitions(transitions, fn) {
    var remaining = transitions.length;
    if (remaining > 0) {
      var check = () => --remaining || fn();
      for (var transition2 of transitions) {
        transition2.out(check);
      }
    } else {
      fn();
    }
  }
  function pause_children(effect2, transitions, local) {
    if ((effect2.f & INERT) !== 0) return;
    effect2.f ^= INERT;
    if (effect2.transitions !== null) {
      for (const transition2 of effect2.transitions) {
        if (transition2.is_global || local) {
          transitions.push(transition2);
        }
      }
    }
    var child2 = effect2.first;
    while (child2 !== null) {
      var sibling2 = child2.next;
      var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
      pause_children(child2, transitions, transparent ? local : false);
      child2 = sibling2;
    }
  }
  function resume_effect(effect2) {
    resume_children(effect2, true);
  }
  function resume_children(effect2, local) {
    if ((effect2.f & INERT) === 0) return;
    effect2.f ^= INERT;
    if ((effect2.f & CLEAN) === 0) {
      effect2.f ^= CLEAN;
    }
    if (check_dirtiness(effect2)) {
      set_signal_status(effect2, DIRTY);
      schedule_effect(effect2);
    }
    var child2 = effect2.first;
    while (child2 !== null) {
      var sibling2 = child2.next;
      var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
      resume_children(child2, transparent ? local : false);
      child2 = sibling2;
    }
    if (effect2.transitions !== null) {
      for (const transition2 of effect2.transitions) {
        if (transition2.is_global || local) {
          transition2.in();
        }
      }
    }
  }
  let micro_tasks = [];
  let idle_tasks = [];
  function run_micro_tasks() {
    var tasks = micro_tasks;
    micro_tasks = [];
    run_all(tasks);
  }
  function run_idle_tasks() {
    var tasks = idle_tasks;
    idle_tasks = [];
    run_all(tasks);
  }
  function queue_micro_task(fn) {
    if (micro_tasks.length === 0) {
      queueMicrotask(run_micro_tasks);
    }
    micro_tasks.push(fn);
  }
  function flush_tasks() {
    if (micro_tasks.length > 0) {
      run_micro_tasks();
    }
    if (idle_tasks.length > 0) {
      run_idle_tasks();
    }
  }
  let is_throwing_error = false;
  let is_flushing = false;
  let last_scheduled_effect = null;
  let is_updating_effect = false;
  let is_destroying_effect = false;
  function set_is_destroying_effect(value) {
    is_destroying_effect = value;
  }
  let queued_root_effects = [];
  let active_reaction = null;
  let untracking = false;
  function set_active_reaction(reaction) {
    active_reaction = reaction;
  }
  let active_effect = null;
  function set_active_effect(effect2) {
    active_effect = effect2;
  }
  let reaction_sources = null;
  function push_reaction_value(value) {
    if (active_reaction !== null && active_reaction.f & EFFECT_IS_UPDATING) {
      if (reaction_sources === null) {
        reaction_sources = [value];
      } else {
        reaction_sources.push(value);
      }
    }
  }
  let new_deps = null;
  let skipped_deps = 0;
  let untracked_writes = null;
  function set_untracked_writes(value) {
    untracked_writes = value;
  }
  let write_version = 1;
  let read_version = 0;
  let skip_reaction = false;
  function increment_write_version() {
    return ++write_version;
  }
  function check_dirtiness(reaction) {
    var _a2;
    var flags = reaction.f;
    if ((flags & DIRTY) !== 0) {
      return true;
    }
    if ((flags & MAYBE_DIRTY) !== 0) {
      var dependencies = reaction.deps;
      var is_unowned = (flags & UNOWNED) !== 0;
      if (dependencies !== null) {
        var i;
        var dependency;
        var is_disconnected = (flags & DISCONNECTED) !== 0;
        var is_unowned_connected = is_unowned && active_effect !== null && !skip_reaction;
        var length = dependencies.length;
        if (is_disconnected || is_unowned_connected) {
          var derived2 = (
            /** @type {Derived} */
            reaction
          );
          var parent = derived2.parent;
          for (i = 0; i < length; i++) {
            dependency = dependencies[i];
            if (is_disconnected || !((_a2 = dependency == null ? void 0 : dependency.reactions) == null ? void 0 : _a2.includes(derived2))) {
              (dependency.reactions ?? (dependency.reactions = [])).push(derived2);
            }
          }
          if (is_disconnected) {
            derived2.f ^= DISCONNECTED;
          }
          if (is_unowned_connected && parent !== null && (parent.f & UNOWNED) === 0) {
            derived2.f ^= UNOWNED;
          }
        }
        for (i = 0; i < length; i++) {
          dependency = dependencies[i];
          if (check_dirtiness(
            /** @type {Derived} */
            dependency
          )) {
            update_derived(
              /** @type {Derived} */
              dependency
            );
          }
          if (dependency.wv > reaction.wv) {
            return true;
          }
        }
      }
      if (!is_unowned || active_effect !== null && !skip_reaction) {
        set_signal_status(reaction, CLEAN);
      }
    }
    return false;
  }
  function propagate_error(error, effect2) {
    var current = effect2;
    while (current !== null) {
      if ((current.f & BOUNDARY_EFFECT) !== 0) {
        try {
          current.fn(error);
          return;
        } catch {
          current.f ^= BOUNDARY_EFFECT;
        }
      }
      current = current.parent;
    }
    is_throwing_error = false;
    throw error;
  }
  function should_rethrow_error(effect2) {
    return (effect2.f & DESTROYED) === 0 && (effect2.parent === null || (effect2.parent.f & BOUNDARY_EFFECT) === 0);
  }
  function handle_error(error, effect2, previous_effect, component_context2) {
    if (is_throwing_error) {
      if (previous_effect === null) {
        is_throwing_error = false;
      }
      if (should_rethrow_error(effect2)) {
        throw error;
      }
      return;
    }
    if (previous_effect !== null) {
      is_throwing_error = true;
    }
    propagate_error(error, effect2);
    if (should_rethrow_error(effect2)) {
      throw error;
    }
  }
  function schedule_possible_effect_self_invalidation(signal, effect2, root2 = true) {
    var reactions = signal.reactions;
    if (reactions === null) return;
    for (var i = 0; i < reactions.length; i++) {
      var reaction = reactions[i];
      if (reaction_sources == null ? void 0 : reaction_sources.includes(signal)) continue;
      if ((reaction.f & DERIVED) !== 0) {
        schedule_possible_effect_self_invalidation(
          /** @type {Derived} */
          reaction,
          effect2,
          false
        );
      } else if (effect2 === reaction) {
        if (root2) {
          set_signal_status(reaction, DIRTY);
        } else if ((reaction.f & CLEAN) !== 0) {
          set_signal_status(reaction, MAYBE_DIRTY);
        }
        schedule_effect(
          /** @type {Effect} */
          reaction
        );
      }
    }
  }
  function update_reaction(reaction) {
    var _a2;
    var previous_deps = new_deps;
    var previous_skipped_deps = skipped_deps;
    var previous_untracked_writes = untracked_writes;
    var previous_reaction = active_reaction;
    var previous_skip_reaction = skip_reaction;
    var previous_reaction_sources = reaction_sources;
    var previous_component_context = component_context;
    var previous_untracking = untracking;
    var flags = reaction.f;
    new_deps = /** @type {null | Value[]} */
    null;
    skipped_deps = 0;
    untracked_writes = null;
    skip_reaction = (flags & UNOWNED) !== 0 && (untracking || !is_updating_effect || active_reaction === null);
    active_reaction = (flags & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
    reaction_sources = null;
    set_component_context(reaction.ctx);
    untracking = false;
    read_version++;
    reaction.f |= EFFECT_IS_UPDATING;
    try {
      var result = (
        /** @type {Function} */
        (0, reaction.fn)()
      );
      var deps = reaction.deps;
      if (new_deps !== null) {
        var i;
        remove_reactions(reaction, skipped_deps);
        if (deps !== null && skipped_deps > 0) {
          deps.length = skipped_deps + new_deps.length;
          for (i = 0; i < new_deps.length; i++) {
            deps[skipped_deps + i] = new_deps[i];
          }
        } else {
          reaction.deps = deps = new_deps;
        }
        if (!skip_reaction) {
          for (i = skipped_deps; i < deps.length; i++) {
            ((_a2 = deps[i]).reactions ?? (_a2.reactions = [])).push(reaction);
          }
        }
      } else if (deps !== null && skipped_deps < deps.length) {
        remove_reactions(reaction, skipped_deps);
        deps.length = skipped_deps;
      }
      if (is_runes() && untracked_writes !== null && !untracking && deps !== null && (reaction.f & (DERIVED | MAYBE_DIRTY | DIRTY)) === 0) {
        for (i = 0; i < /** @type {Source[]} */
        untracked_writes.length; i++) {
          schedule_possible_effect_self_invalidation(
            untracked_writes[i],
            /** @type {Effect} */
            reaction
          );
        }
      }
      if (previous_reaction !== null && previous_reaction !== reaction) {
        read_version++;
        if (untracked_writes !== null) {
          if (previous_untracked_writes === null) {
            previous_untracked_writes = untracked_writes;
          } else {
            previous_untracked_writes.push(.../** @type {Source[]} */
            untracked_writes);
          }
        }
      }
      return result;
    } finally {
      new_deps = previous_deps;
      skipped_deps = previous_skipped_deps;
      untracked_writes = previous_untracked_writes;
      active_reaction = previous_reaction;
      skip_reaction = previous_skip_reaction;
      reaction_sources = previous_reaction_sources;
      set_component_context(previous_component_context);
      untracking = previous_untracking;
      reaction.f ^= EFFECT_IS_UPDATING;
    }
  }
  function remove_reaction(signal, dependency) {
    let reactions = dependency.reactions;
    if (reactions !== null) {
      var index2 = index_of.call(reactions, signal);
      if (index2 !== -1) {
        var new_length = reactions.length - 1;
        if (new_length === 0) {
          reactions = dependency.reactions = null;
        } else {
          reactions[index2] = reactions[new_length];
          reactions.pop();
        }
      }
    }
    if (reactions === null && (dependency.f & DERIVED) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
    // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
    // allows us to skip the expensive work of disconnecting and immediately reconnecting it
    (new_deps === null || !new_deps.includes(dependency))) {
      set_signal_status(dependency, MAYBE_DIRTY);
      if ((dependency.f & (UNOWNED | DISCONNECTED)) === 0) {
        dependency.f ^= DISCONNECTED;
      }
      destroy_derived_effects(
        /** @type {Derived} **/
        dependency
      );
      remove_reactions(
        /** @type {Derived} **/
        dependency,
        0
      );
    }
  }
  function remove_reactions(signal, start_index) {
    var dependencies = signal.deps;
    if (dependencies === null) return;
    for (var i = start_index; i < dependencies.length; i++) {
      remove_reaction(signal, dependencies[i]);
    }
  }
  function update_effect(effect2) {
    var flags = effect2.f;
    if ((flags & DESTROYED) !== 0) {
      return;
    }
    set_signal_status(effect2, CLEAN);
    var previous_effect = active_effect;
    var previous_component_context = component_context;
    var was_updating_effect = is_updating_effect;
    active_effect = effect2;
    is_updating_effect = true;
    try {
      if ((flags & BLOCK_EFFECT) !== 0) {
        destroy_block_effect_children(effect2);
      } else {
        destroy_effect_children(effect2);
      }
      execute_effect_teardown(effect2);
      var teardown2 = update_reaction(effect2);
      effect2.teardown = typeof teardown2 === "function" ? teardown2 : null;
      effect2.wv = write_version;
      var deps = effect2.deps;
      var dep;
      if (DEV && tracing_mode_flag && (effect2.f & DIRTY) !== 0 && deps !== null) ;
      if (DEV) ;
    } catch (error) {
      handle_error(error, effect2, previous_effect, previous_component_context || effect2.ctx);
    } finally {
      is_updating_effect = was_updating_effect;
      active_effect = previous_effect;
    }
  }
  function infinite_loop_guard() {
    try {
      effect_update_depth_exceeded();
    } catch (error) {
      if (last_scheduled_effect !== null) {
        {
          handle_error(error, last_scheduled_effect, null);
        }
      } else {
        throw error;
      }
    }
  }
  function flush_queued_root_effects() {
    var was_updating_effect = is_updating_effect;
    try {
      var flush_count = 0;
      is_updating_effect = true;
      while (queued_root_effects.length > 0) {
        if (flush_count++ > 1e3) {
          infinite_loop_guard();
        }
        var root_effects = queued_root_effects;
        var length = root_effects.length;
        queued_root_effects = [];
        for (var i = 0; i < length; i++) {
          var collected_effects = process_effects(root_effects[i]);
          flush_queued_effects(collected_effects);
        }
        old_values.clear();
      }
    } finally {
      is_flushing = false;
      is_updating_effect = was_updating_effect;
      last_scheduled_effect = null;
    }
  }
  function flush_queued_effects(effects) {
    var length = effects.length;
    if (length === 0) return;
    for (var i = 0; i < length; i++) {
      var effect2 = effects[i];
      if ((effect2.f & (DESTROYED | INERT)) === 0) {
        try {
          if (check_dirtiness(effect2)) {
            update_effect(effect2);
            if (effect2.deps === null && effect2.first === null && effect2.nodes_start === null) {
              if (effect2.teardown === null) {
                unlink_effect(effect2);
              } else {
                effect2.fn = null;
              }
            }
          }
        } catch (error) {
          handle_error(error, effect2, null, effect2.ctx);
        }
      }
    }
  }
  function schedule_effect(signal) {
    if (!is_flushing) {
      is_flushing = true;
      queueMicrotask(flush_queued_root_effects);
    }
    var effect2 = last_scheduled_effect = signal;
    while (effect2.parent !== null) {
      effect2 = effect2.parent;
      var flags = effect2.f;
      if ((flags & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
        if ((flags & CLEAN) === 0) return;
        effect2.f ^= CLEAN;
      }
    }
    queued_root_effects.push(effect2);
  }
  function process_effects(root2) {
    var effects = [];
    var effect2 = root2;
    while (effect2 !== null) {
      var flags = effect2.f;
      var is_branch = (flags & (BRANCH_EFFECT | ROOT_EFFECT)) !== 0;
      var is_skippable_branch = is_branch && (flags & CLEAN) !== 0;
      if (!is_skippable_branch && (flags & INERT) === 0) {
        if ((flags & EFFECT) !== 0) {
          effects.push(effect2);
        } else if (is_branch) {
          effect2.f ^= CLEAN;
        } else {
          try {
            if (check_dirtiness(effect2)) {
              update_effect(effect2);
            }
          } catch (error) {
            handle_error(error, effect2, null, effect2.ctx);
          }
        }
        var child2 = effect2.first;
        if (child2 !== null) {
          effect2 = child2;
          continue;
        }
      }
      var parent = effect2.parent;
      effect2 = effect2.next;
      while (effect2 === null && parent !== null) {
        effect2 = parent.next;
        parent = parent.parent;
      }
    }
    return effects;
  }
  function flushSync(fn) {
    var result;
    while (true) {
      flush_tasks();
      if (queued_root_effects.length === 0) {
        return (
          /** @type {T} */
          result
        );
      }
      is_flushing = true;
      flush_queued_root_effects();
    }
  }
  async function tick() {
    await Promise.resolve();
    flushSync();
  }
  function get(signal) {
    var flags = signal.f;
    var is_derived = (flags & DERIVED) !== 0;
    if (active_reaction !== null && !untracking) {
      if (!(reaction_sources == null ? void 0 : reaction_sources.includes(signal))) {
        var deps = active_reaction.deps;
        if (signal.rv < read_version) {
          signal.rv = read_version;
          if (new_deps === null && deps !== null && deps[skipped_deps] === signal) {
            skipped_deps++;
          } else if (new_deps === null) {
            new_deps = [signal];
          } else if (!skip_reaction || !new_deps.includes(signal)) {
            new_deps.push(signal);
          }
        }
      }
    } else if (is_derived && /** @type {Derived} */
    signal.deps === null && /** @type {Derived} */
    signal.effects === null) {
      var derived2 = (
        /** @type {Derived} */
        signal
      );
      var parent = derived2.parent;
      if (parent !== null && (parent.f & UNOWNED) === 0) {
        derived2.f ^= UNOWNED;
      }
    }
    if (is_derived) {
      derived2 = /** @type {Derived} */
      signal;
      if (check_dirtiness(derived2)) {
        update_derived(derived2);
      }
    }
    if (is_destroying_effect && old_values.has(signal)) {
      return old_values.get(signal);
    }
    return signal.v;
  }
  function untrack(fn) {
    var previous_untracking = untracking;
    try {
      untracking = true;
      return fn();
    } finally {
      untracking = previous_untracking;
    }
  }
  const STATUS_MASK = -7169;
  function set_signal_status(signal, status) {
    signal.f = signal.f & STATUS_MASK | status;
  }
  function deep_read_state(value) {
    if (typeof value !== "object" || !value || value instanceof EventTarget) {
      return;
    }
    if (STATE_SYMBOL in value) {
      deep_read(value);
    } else if (!Array.isArray(value)) {
      for (let key in value) {
        const prop = value[key];
        if (typeof prop === "object" && prop && STATE_SYMBOL in prop) {
          deep_read(prop);
        }
      }
    }
  }
  function deep_read(value, visited = /* @__PURE__ */ new Set()) {
    if (typeof value === "object" && value !== null && // We don't want to traverse DOM elements
    !(value instanceof EventTarget) && !visited.has(value)) {
      visited.add(value);
      if (value instanceof Date) {
        value.getTime();
      }
      for (let key in value) {
        try {
          deep_read(value[key], visited);
        } catch (e) {
        }
      }
      const proto = get_prototype_of(value);
      if (proto !== Object.prototype && proto !== Array.prototype && proto !== Map.prototype && proto !== Set.prototype && proto !== Date.prototype) {
        const descriptors = get_descriptors(proto);
        for (let key in descriptors) {
          const get2 = descriptors[key].get;
          if (get2) {
            try {
              get2.call(value);
            } catch (e) {
            }
          }
        }
      }
    }
  }
  const PASSIVE_EVENTS = ["touchstart", "touchmove"];
  function is_passive_event(name) {
    return PASSIVE_EVENTS.includes(name);
  }
  let listening_to_form_reset = false;
  function add_form_reset_listener() {
    if (!listening_to_form_reset) {
      listening_to_form_reset = true;
      document.addEventListener(
        "reset",
        (evt) => {
          Promise.resolve().then(() => {
            var _a2;
            if (!evt.defaultPrevented) {
              for (
                const e of
                /**@type {HTMLFormElement} */
                evt.target.elements
              ) {
                (_a2 = e.__on_r) == null ? void 0 : _a2.call(e);
              }
            }
          });
        },
        // In the capture phase to guarantee we get noticed of it (no possiblity of stopPropagation)
        { capture: true }
      );
    }
  }
  function without_reactive_context(fn) {
    var previous_reaction = active_reaction;
    var previous_effect = active_effect;
    set_active_reaction(null);
    set_active_effect(null);
    try {
      return fn();
    } finally {
      set_active_reaction(previous_reaction);
      set_active_effect(previous_effect);
    }
  }
  function listen_to_event_and_reset_event(element, event2, handler, on_reset = handler) {
    element.addEventListener(event2, () => without_reactive_context(handler));
    const prev = element.__on_r;
    if (prev) {
      element.__on_r = () => {
        prev();
        on_reset(true);
      };
    } else {
      element.__on_r = () => on_reset(true);
    }
    add_form_reset_listener();
  }
  const all_registered_events = /* @__PURE__ */ new Set();
  const root_event_handles = /* @__PURE__ */ new Set();
  function create_event(event_name, dom, handler, options = {}) {
    function target_handler(event2) {
      if (!options.capture) {
        handle_event_propagation.call(dom, event2);
      }
      if (!event2.cancelBubble) {
        return without_reactive_context(() => {
          return handler == null ? void 0 : handler.call(this, event2);
        });
      }
    }
    if (event_name.startsWith("pointer") || event_name.startsWith("touch") || event_name === "wheel") {
      queue_micro_task(() => {
        dom.addEventListener(event_name, target_handler, options);
      });
    } else {
      dom.addEventListener(event_name, target_handler, options);
    }
    return target_handler;
  }
  function event(event_name, dom, handler, capture, passive) {
    var options = { capture, passive };
    var target_handler = create_event(event_name, dom, handler, options);
    if (dom === document.body || // @ts-ignore
    dom === window || // @ts-ignore
    dom === document || // Firefox has quirky behavior, it can happen that we still get "canplay" events when the element is already removed
    dom instanceof HTMLMediaElement) {
      teardown(() => {
        dom.removeEventListener(event_name, target_handler, options);
      });
    }
  }
  function delegate(events) {
    for (var i = 0; i < events.length; i++) {
      all_registered_events.add(events[i]);
    }
    for (var fn of root_event_handles) {
      fn(events);
    }
  }
  function handle_event_propagation(event2) {
    var _a2;
    var handler_element = this;
    var owner_document = (
      /** @type {Node} */
      handler_element.ownerDocument
    );
    var event_name = event2.type;
    var path = ((_a2 = event2.composedPath) == null ? void 0 : _a2.call(event2)) || [];
    var current_target = (
      /** @type {null | Element} */
      path[0] || event2.target
    );
    var path_idx = 0;
    var handled_at = event2.__root;
    if (handled_at) {
      var at_idx = path.indexOf(handled_at);
      if (at_idx !== -1 && (handler_element === document || handler_element === /** @type {any} */
      window)) {
        event2.__root = handler_element;
        return;
      }
      var handler_idx = path.indexOf(handler_element);
      if (handler_idx === -1) {
        return;
      }
      if (at_idx <= handler_idx) {
        path_idx = at_idx;
      }
    }
    current_target = /** @type {Element} */
    path[path_idx] || event2.target;
    if (current_target === handler_element) return;
    define_property(event2, "currentTarget", {
      configurable: true,
      get() {
        return current_target || owner_document;
      }
    });
    var previous_reaction = active_reaction;
    var previous_effect = active_effect;
    set_active_reaction(null);
    set_active_effect(null);
    try {
      var throw_error;
      var other_errors = [];
      while (current_target !== null) {
        var parent_element = current_target.assignedSlot || current_target.parentNode || /** @type {any} */
        current_target.host || null;
        try {
          var delegated = current_target["__" + event_name];
          if (delegated != null && (!/** @type {any} */
          current_target.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          event2.target === current_target)) {
            if (is_array(delegated)) {
              var [fn, ...data] = delegated;
              fn.apply(current_target, [event2, ...data]);
            } else {
              delegated.call(current_target, event2);
            }
          }
        } catch (error) {
          if (throw_error) {
            other_errors.push(error);
          } else {
            throw_error = error;
          }
        }
        if (event2.cancelBubble || parent_element === handler_element || parent_element === null) {
          break;
        }
        current_target = parent_element;
      }
      if (throw_error) {
        for (let error of other_errors) {
          queueMicrotask(() => {
            throw error;
          });
        }
        throw throw_error;
      }
    } finally {
      event2.__root = handler_element;
      delete event2.currentTarget;
      set_active_reaction(previous_reaction);
      set_active_effect(previous_effect);
    }
  }
  function create_fragment_from_html(html) {
    var elem = document.createElement("template");
    elem.innerHTML = html.replaceAll("<!>", "<!---->");
    return elem.content;
  }
  function assign_nodes(start, end) {
    var effect2 = (
      /** @type {Effect} */
      active_effect
    );
    if (effect2.nodes_start === null) {
      effect2.nodes_start = start;
      effect2.nodes_end = end;
    }
  }
  // @__NO_SIDE_EFFECTS__
  function from_html(content, flags) {
    var is_fragment = (flags & TEMPLATE_FRAGMENT) !== 0;
    var use_import_node = (flags & TEMPLATE_USE_IMPORT_NODE) !== 0;
    var node;
    var has_start = !content.startsWith("<!>");
    return () => {
      if (node === void 0) {
        node = create_fragment_from_html(has_start ? content : "<!>" + content);
        if (!is_fragment) node = /** @type {Node} */
        /* @__PURE__ */ get_first_child(node);
      }
      var clone = (
        /** @type {TemplateNode} */
        use_import_node || is_firefox ? document.importNode(node, true) : node.cloneNode(true)
      );
      if (is_fragment) {
        var start = (
          /** @type {TemplateNode} */
          /* @__PURE__ */ get_first_child(clone)
        );
        var end = (
          /** @type {TemplateNode} */
          clone.lastChild
        );
        assign_nodes(start, end);
      } else {
        assign_nodes(clone, clone);
      }
      return clone;
    };
  }
  function comment() {
    var frag = document.createDocumentFragment();
    var start = document.createComment("");
    var anchor = create_text();
    frag.append(start, anchor);
    assign_nodes(start, anchor);
    return frag;
  }
  function append(anchor, dom) {
    if (anchor === null) {
      return;
    }
    anchor.before(
      /** @type {Node} */
      dom
    );
  }
  let should_intro = true;
  function set_text(text, value) {
    var str = value == null ? "" : typeof value === "object" ? value + "" : value;
    if (str !== (text.__t ?? (text.__t = text.nodeValue))) {
      text.__t = str;
      text.nodeValue = str + "";
    }
  }
  function mount(component, options) {
    return _mount(component, options);
  }
  const document_listeners = /* @__PURE__ */ new Map();
  function _mount(Component, { target, anchor, props = {}, events, context, intro = true }) {
    init_operations();
    var registered_events = /* @__PURE__ */ new Set();
    var event_handle = (events2) => {
      for (var i = 0; i < events2.length; i++) {
        var event_name = events2[i];
        if (registered_events.has(event_name)) continue;
        registered_events.add(event_name);
        var passive = is_passive_event(event_name);
        target.addEventListener(event_name, handle_event_propagation, { passive });
        var n = document_listeners.get(event_name);
        if (n === void 0) {
          document.addEventListener(event_name, handle_event_propagation, { passive });
          document_listeners.set(event_name, 1);
        } else {
          document_listeners.set(event_name, n + 1);
        }
      }
    };
    event_handle(array_from(all_registered_events));
    root_event_handles.add(event_handle);
    var component = void 0;
    var unmount2 = component_root(() => {
      var anchor_node = anchor ?? target.appendChild(create_text());
      branch(() => {
        if (context) {
          push({});
          var ctx = (
            /** @type {ComponentContext} */
            component_context
          );
          ctx.c = context;
        }
        if (events) {
          props.$$events = events;
        }
        should_intro = intro;
        component = Component(anchor_node, props) || {};
        should_intro = true;
        if (context) {
          pop();
        }
      });
      return () => {
        var _a2;
        for (var event_name of registered_events) {
          target.removeEventListener(event_name, handle_event_propagation);
          var n = (
            /** @type {number} */
            document_listeners.get(event_name)
          );
          if (--n === 0) {
            document.removeEventListener(event_name, handle_event_propagation);
            document_listeners.delete(event_name);
          } else {
            document_listeners.set(event_name, n);
          }
        }
        root_event_handles.delete(event_handle);
        if (anchor_node !== anchor) {
          (_a2 = anchor_node.parentNode) == null ? void 0 : _a2.removeChild(anchor_node);
        }
      };
    });
    mounted_components.set(component, unmount2);
    return component;
  }
  let mounted_components = /* @__PURE__ */ new WeakMap();
  function unmount(component, options) {
    const fn = mounted_components.get(component);
    if (fn) {
      mounted_components.delete(component);
      return fn(options);
    }
    return Promise.resolve();
  }
  function if_block(node, fn, [root_index, hydrate_index] = [0, 0]) {
    var anchor = node;
    var consequent_effect = null;
    var alternate_effect = null;
    var condition = UNINITIALIZED;
    var flags = root_index > 0 ? EFFECT_TRANSPARENT : 0;
    var has_branch = false;
    const set_branch = (fn2, flag = true) => {
      has_branch = true;
      update_branch(flag, fn2);
    };
    const update_branch = (new_condition, fn2) => {
      if (condition === (condition = new_condition)) return;
      if (condition) {
        if (consequent_effect) {
          resume_effect(consequent_effect);
        } else if (fn2) {
          consequent_effect = branch(() => fn2(anchor));
        }
        if (alternate_effect) {
          pause_effect(alternate_effect, () => {
            alternate_effect = null;
          });
        }
      } else {
        if (alternate_effect) {
          resume_effect(alternate_effect);
        } else if (fn2) {
          alternate_effect = branch(() => fn2(anchor, [root_index + 1, hydrate_index]));
        }
        if (consequent_effect) {
          pause_effect(consequent_effect, () => {
            consequent_effect = null;
          });
        }
      }
    };
    block(() => {
      has_branch = false;
      fn(set_branch);
      if (!has_branch) {
        update_branch(null, null);
      }
    }, flags);
  }
  function index(_, i) {
    return i;
  }
  function pause_effects(state2, items, controlled_anchor, items_map) {
    var transitions = [];
    var length = items.length;
    for (var i = 0; i < length; i++) {
      pause_children(items[i].e, transitions, true);
    }
    var is_controlled = length > 0 && transitions.length === 0 && controlled_anchor !== null;
    if (is_controlled) {
      var parent_node = (
        /** @type {Element} */
        /** @type {Element} */
        controlled_anchor.parentNode
      );
      clear_text_content(parent_node);
      parent_node.append(
        /** @type {Element} */
        controlled_anchor
      );
      items_map.clear();
      link(state2, items[0].prev, items[length - 1].next);
    }
    run_out_transitions(transitions, () => {
      for (var i2 = 0; i2 < length; i2++) {
        var item = items[i2];
        if (!is_controlled) {
          items_map.delete(item.k);
          link(state2, item.prev, item.next);
        }
        destroy_effect(item.e, !is_controlled);
      }
    });
  }
  function each(node, flags, get_collection, get_key, render_fn, fallback_fn = null) {
    var anchor = node;
    var state2 = { flags, items: /* @__PURE__ */ new Map(), first: null };
    var fallback = null;
    var was_empty = false;
    var each_array = /* @__PURE__ */ derived_safe_equal(() => {
      var collection = get_collection();
      return is_array(collection) ? collection : collection == null ? [] : array_from(collection);
    });
    block(() => {
      var array = get(each_array);
      var length = array.length;
      if (was_empty && length === 0) {
        return;
      }
      was_empty = length === 0;
      {
        reconcile(array, state2, anchor, render_fn, flags, get_key, get_collection);
      }
      if (fallback_fn !== null) {
        if (length === 0) {
          if (fallback) {
            resume_effect(fallback);
          } else {
            fallback = branch(() => fallback_fn(anchor));
          }
        } else if (fallback !== null) {
          pause_effect(fallback, () => {
            fallback = null;
          });
        }
      }
      get(each_array);
    });
  }
  function reconcile(array, state2, anchor, render_fn, flags, get_key, get_collection) {
    var length = array.length;
    var items = state2.items;
    var first = state2.first;
    var current = first;
    var seen;
    var prev = null;
    var matched = [];
    var stashed = [];
    var value;
    var key;
    var item;
    var i;
    for (i = 0; i < length; i += 1) {
      value = array[i];
      key = get_key(value, i);
      item = items.get(key);
      if (item === void 0) {
        var child_anchor = current ? (
          /** @type {TemplateNode} */
          current.e.nodes_start
        ) : anchor;
        prev = create_item(
          child_anchor,
          state2,
          prev,
          prev === null ? state2.first : prev.next,
          value,
          key,
          i,
          render_fn,
          flags,
          get_collection
        );
        items.set(key, prev);
        matched = [];
        stashed = [];
        current = prev.next;
        continue;
      }
      {
        update_item(item, value, i);
      }
      if ((item.e.f & INERT) !== 0) {
        resume_effect(item.e);
      }
      if (item !== current) {
        if (seen !== void 0 && seen.has(item)) {
          if (matched.length < stashed.length) {
            var start = stashed[0];
            var j;
            prev = start.prev;
            var a = matched[0];
            var b = matched[matched.length - 1];
            for (j = 0; j < matched.length; j += 1) {
              move(matched[j], start, anchor);
            }
            for (j = 0; j < stashed.length; j += 1) {
              seen.delete(stashed[j]);
            }
            link(state2, a.prev, b.next);
            link(state2, prev, a);
            link(state2, b, start);
            current = start;
            prev = b;
            i -= 1;
            matched = [];
            stashed = [];
          } else {
            seen.delete(item);
            move(item, current, anchor);
            link(state2, item.prev, item.next);
            link(state2, item, prev === null ? state2.first : prev.next);
            link(state2, prev, item);
            prev = item;
          }
          continue;
        }
        matched = [];
        stashed = [];
        while (current !== null && current.k !== key) {
          if ((current.e.f & INERT) === 0) {
            (seen ?? (seen = /* @__PURE__ */ new Set())).add(current);
          }
          stashed.push(current);
          current = current.next;
        }
        if (current === null) {
          continue;
        }
        item = current;
      }
      matched.push(item);
      prev = item;
      current = item.next;
    }
    if (current !== null || seen !== void 0) {
      var to_destroy = seen === void 0 ? [] : array_from(seen);
      while (current !== null) {
        if ((current.e.f & INERT) === 0) {
          to_destroy.push(current);
        }
        current = current.next;
      }
      var destroy_length = to_destroy.length;
      if (destroy_length > 0) {
        var controlled_anchor = null;
        pause_effects(state2, to_destroy, controlled_anchor, items);
      }
    }
    active_effect.first = state2.first && state2.first.e;
    active_effect.last = prev && prev.e;
  }
  function update_item(item, value, index2, type) {
    {
      internal_set(item.v, value);
    }
    {
      item.i = index2;
    }
  }
  function create_item(anchor, state2, prev, next, value, key, index2, render_fn, flags, get_collection) {
    var reactive = (flags & EACH_ITEM_REACTIVE) !== 0;
    var mutable = (flags & EACH_ITEM_IMMUTABLE) === 0;
    var v = reactive ? mutable ? /* @__PURE__ */ mutable_source(value) : source(value) : value;
    var i = (flags & EACH_INDEX_REACTIVE) === 0 ? index2 : source(index2);
    var item = {
      i,
      v,
      k: key,
      a: null,
      // @ts-expect-error
      e: null,
      prev,
      next
    };
    try {
      item.e = branch(() => render_fn(anchor, v, i, get_collection), hydrating);
      item.e.prev = prev && prev.e;
      item.e.next = next && next.e;
      if (prev === null) {
        state2.first = item;
      } else {
        prev.next = item;
        prev.e.next = item.e;
      }
      if (next !== null) {
        next.prev = item;
        next.e.prev = item.e;
      }
      return item;
    } finally {
    }
  }
  function move(item, next, anchor) {
    var end = item.next ? (
      /** @type {TemplateNode} */
      item.next.e.nodes_start
    ) : anchor;
    var dest = next ? (
      /** @type {TemplateNode} */
      next.e.nodes_start
    ) : anchor;
    var node = (
      /** @type {TemplateNode} */
      item.e.nodes_start
    );
    while (node !== end) {
      var next_node = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ get_next_sibling(node)
      );
      dest.before(node);
      node = next_node;
    }
  }
  function link(state2, prev, next) {
    if (prev === null) {
      state2.first = next;
    } else {
      prev.next = next;
      prev.e.next = next && next.e;
    }
    if (next !== null) {
      next.prev = prev;
      next.e.prev = prev && prev.e;
    }
  }
  function action(dom, action2, get_value) {
    effect(() => {
      var payload = untrack(() => action2(dom, get_value == null ? void 0 : get_value()) || {});
      if (get_value && (payload == null ? void 0 : payload.update)) {
        var inited = false;
        var prev = (
          /** @type {any} */
          {}
        );
        render_effect(() => {
          var value = get_value();
          deep_read_state(value);
          if (inited && safe_not_equal(prev, value)) {
            prev = value;
            payload.update(value);
          }
        });
        inited = true;
      }
      if (payload == null ? void 0 : payload.destroy) {
        return () => (
          /** @type {Function} */
          payload.destroy()
        );
      }
    });
  }
  function to_class(value, hash, directives) {
    var classname = value == null ? "" : "" + value;
    return classname === "" ? null : classname;
  }
  function to_style(value, styles) {
    return value == null ? null : String(value);
  }
  function set_class(dom, is_html, value, hash, prev_classes, next_classes) {
    var prev = dom.__className;
    if (prev !== value || prev === void 0) {
      var next_class_name = to_class(value);
      {
        if (next_class_name == null) {
          dom.removeAttribute("class");
        } else if (is_html) {
          dom.className = next_class_name;
        } else {
          dom.setAttribute("class", next_class_name);
        }
      }
      dom.__className = value;
    }
    return next_classes;
  }
  function set_style(dom, value, prev_styles, next_styles) {
    var prev = dom.__style;
    if (prev !== value) {
      var next_style_attr = to_style(value);
      {
        if (next_style_attr == null) {
          dom.removeAttribute("style");
        } else {
          dom.style.cssText = next_style_attr;
        }
      }
      dom.__style = value;
    }
    return next_styles;
  }
  const IS_CUSTOM_ELEMENT = Symbol("is custom element");
  const IS_HTML = Symbol("is html");
  function set_attribute(element, attribute, value, skip_warning) {
    var attributes = get_attributes(element);
    if (attributes[attribute] === (attributes[attribute] = value)) return;
    if (attribute === "loading") {
      element[LOADING_ATTR_SYMBOL] = value;
    }
    if (value == null) {
      element.removeAttribute(attribute);
    } else if (typeof value !== "string" && get_setters(element).includes(attribute)) {
      element[attribute] = value;
    } else {
      element.setAttribute(attribute, value);
    }
  }
  function get_attributes(element) {
    return (
      /** @type {Record<string | symbol, unknown>} **/
      // @ts-expect-error
      element.__attributes ?? (element.__attributes = {
        [IS_CUSTOM_ELEMENT]: element.nodeName.includes("-"),
        [IS_HTML]: element.namespaceURI === NAMESPACE_HTML
      })
    );
  }
  var setters_cache = /* @__PURE__ */ new Map();
  function get_setters(element) {
    var setters = setters_cache.get(element.nodeName);
    if (setters) return setters;
    setters_cache.set(element.nodeName, setters = []);
    var descriptors;
    var proto = element;
    var element_proto = Element.prototype;
    while (element_proto !== proto) {
      descriptors = get_descriptors(proto);
      for (var key in descriptors) {
        if (descriptors[key].set) {
          setters.push(key);
        }
      }
      proto = get_prototype_of(proto);
    }
    return setters;
  }
  const now = () => performance.now();
  const raf = {
    // don't access requestAnimationFrame eagerly outside method
    // this allows basic testing of user code without JSDOM
    // bunder will eval and remove ternary when the user's app is built
    tick: (
      /** @param {any} _ */
      (_) => requestAnimationFrame(_)
    ),
    now: () => now(),
    tasks: /* @__PURE__ */ new Set()
  };
  function run_tasks() {
    const now2 = raf.now();
    raf.tasks.forEach((task) => {
      if (!task.c(now2)) {
        raf.tasks.delete(task);
        task.f();
      }
    });
    if (raf.tasks.size !== 0) {
      raf.tick(run_tasks);
    }
  }
  function loop(callback) {
    let task;
    if (raf.tasks.size === 0) {
      raf.tick(run_tasks);
    }
    return {
      promise: new Promise((fulfill) => {
        raf.tasks.add(task = { c: callback, f: fulfill });
      }),
      abort() {
        raf.tasks.delete(task);
      }
    };
  }
  function dispatch_event(element, type) {
    without_reactive_context(() => {
      element.dispatchEvent(new CustomEvent(type));
    });
  }
  function css_property_to_camelcase(style) {
    if (style === "float") return "cssFloat";
    if (style === "offset") return "cssOffset";
    if (style.startsWith("--")) return style;
    const parts = style.split("-");
    if (parts.length === 1) return parts[0];
    return parts[0] + parts.slice(1).map(
      /** @param {any} word */
      (word) => word[0].toUpperCase() + word.slice(1)
    ).join("");
  }
  function css_to_keyframe(css) {
    const keyframe = {};
    const parts = css.split(";");
    for (const part of parts) {
      const [property, value] = part.split(":");
      if (!property || value === void 0) break;
      const formatted_property = css_property_to_camelcase(property.trim());
      keyframe[formatted_property] = value.trim();
    }
    return keyframe;
  }
  const linear$1 = (t) => t;
  function transition(flags, element, get_fn, get_params) {
    var is_global = (flags & TRANSITION_GLOBAL) !== 0;
    var direction = "both";
    var current_options;
    var inert = element.inert;
    var overflow = element.style.overflow;
    var intro;
    var outro;
    function get_options() {
      var previous_reaction = active_reaction;
      var previous_effect = active_effect;
      set_active_reaction(null);
      set_active_effect(null);
      try {
        return current_options ?? (current_options = get_fn()(element, (get_params == null ? void 0 : get_params()) ?? /** @type {P} */
        {}, {
          direction
        }));
      } finally {
        set_active_reaction(previous_reaction);
        set_active_effect(previous_effect);
      }
    }
    var transition2 = {
      is_global,
      in() {
        element.inert = inert;
        dispatch_event(element, "introstart");
        intro = animate(element, get_options(), outro, 1, () => {
          dispatch_event(element, "introend");
          intro == null ? void 0 : intro.abort();
          intro = current_options = void 0;
          element.style.overflow = overflow;
        });
      },
      out(fn) {
        element.inert = true;
        dispatch_event(element, "outrostart");
        outro = animate(element, get_options(), intro, 0, () => {
          dispatch_event(element, "outroend");
          fn == null ? void 0 : fn();
        });
      },
      stop: () => {
        intro == null ? void 0 : intro.abort();
        outro == null ? void 0 : outro.abort();
      }
    };
    var e = (
      /** @type {Effect} */
      active_effect
    );
    (e.transitions ?? (e.transitions = [])).push(transition2);
    if (should_intro) {
      var run = is_global;
      if (!run) {
        var block2 = (
          /** @type {Effect | null} */
          e.parent
        );
        while (block2 && (block2.f & EFFECT_TRANSPARENT) !== 0) {
          while (block2 = block2.parent) {
            if ((block2.f & BLOCK_EFFECT) !== 0) break;
          }
        }
        run = !block2 || (block2.f & EFFECT_RAN) !== 0;
      }
      if (run) {
        effect(() => {
          untrack(() => transition2.in());
        });
      }
    }
  }
  function animate(element, options, counterpart, t2, on_finish) {
    var is_intro = t2 === 1;
    if (is_function(options)) {
      var a;
      var aborted = false;
      queue_micro_task(() => {
        if (aborted) return;
        var o = options({ direction: is_intro ? "in" : "out" });
        a = animate(element, o, counterpart, t2, on_finish);
      });
      return {
        abort: () => {
          aborted = true;
          a == null ? void 0 : a.abort();
        },
        deactivate: () => a.deactivate(),
        reset: () => a.reset(),
        t: () => a.t()
      };
    }
    counterpart == null ? void 0 : counterpart.deactivate();
    if (!(options == null ? void 0 : options.duration)) {
      on_finish();
      return {
        abort: noop,
        deactivate: noop,
        reset: noop,
        t: () => t2
      };
    }
    const { delay = 0, css, tick: tick2, easing = linear$1 } = options;
    var keyframes = [];
    if (is_intro && counterpart === void 0) {
      if (tick2) {
        tick2(0, 1);
      }
      if (css) {
        var styles = css_to_keyframe(css(0, 1));
        keyframes.push(styles, styles);
      }
    }
    var get_t = () => 1 - t2;
    var animation = element.animate(keyframes, { duration: delay, fill: "forwards" });
    animation.onfinish = () => {
      animation.cancel();
      var t1 = (counterpart == null ? void 0 : counterpart.t()) ?? 1 - t2;
      counterpart == null ? void 0 : counterpart.abort();
      var delta = t2 - t1;
      var duration = (
        /** @type {number} */
        options.duration * Math.abs(delta)
      );
      var keyframes2 = [];
      if (duration > 0) {
        var needs_overflow_hidden = false;
        if (css) {
          var n = Math.ceil(duration / (1e3 / 60));
          for (var i = 0; i <= n; i += 1) {
            var t = t1 + delta * easing(i / n);
            var styles2 = css_to_keyframe(css(t, 1 - t));
            keyframes2.push(styles2);
            needs_overflow_hidden || (needs_overflow_hidden = styles2.overflow === "hidden");
          }
        }
        if (needs_overflow_hidden) {
          element.style.overflow = "hidden";
        }
        get_t = () => {
          var time = (
            /** @type {number} */
            /** @type {globalThis.Animation} */
            animation.currentTime
          );
          return t1 + delta * easing(time / duration);
        };
        if (tick2) {
          loop(() => {
            if (animation.playState !== "running") return false;
            var t3 = get_t();
            tick2(t3, 1 - t3);
            return true;
          });
        }
      }
      animation = element.animate(keyframes2, { duration, fill: "forwards" });
      animation.onfinish = () => {
        get_t = () => t2;
        tick2 == null ? void 0 : tick2(t2, 1 - t2);
        on_finish();
      };
    };
    return {
      abort: () => {
        if (animation) {
          animation.cancel();
          animation.effect = null;
          animation.onfinish = noop;
        }
      },
      deactivate: () => {
        on_finish = noop;
      },
      reset: () => {
        if (t2 === 0) {
          tick2 == null ? void 0 : tick2(1, 0);
        }
      },
      t: () => get_t()
    };
  }
  function bind_value(input, get2, set2 = get2) {
    listen_to_event_and_reset_event(input, "input", (is_reset) => {
      var value = is_reset ? input.defaultValue : input.value;
      value = is_numberlike_input(input) ? to_number(value) : value;
      set2(value);
      if (value !== (value = get2())) {
        var start = input.selectionStart;
        var end = input.selectionEnd;
        input.value = value ?? "";
        if (end !== null) {
          input.selectionStart = start;
          input.selectionEnd = Math.min(end, input.value.length);
        }
      }
    });
    if (
      // If we are hydrating and the value has since changed,
      // then use the updated value from the input instead.
      // If defaultValue is set, then value == defaultValue
      // TODO Svelte 6: remove input.value check and set to empty string?
      untrack(get2) == null && input.value
    ) {
      set2(is_numberlike_input(input) ? to_number(input.value) : input.value);
    }
    render_effect(() => {
      var value = get2();
      if (is_numberlike_input(input) && value === to_number(input.value)) {
        return;
      }
      if (input.type === "date" && !value && !input.value) {
        return;
      }
      if (value !== input.value) {
        input.value = value ?? "";
      }
    });
  }
  function is_numberlike_input(input) {
    var type = input.type;
    return type === "number" || type === "range";
  }
  function to_number(value) {
    return value === "" ? null : +value;
  }
  const PUBLIC_VERSION = "5";
  if (typeof window !== "undefined") {
    ((_a = window.__svelte ?? (window.__svelte = {})).v ?? (_a.v = /* @__PURE__ */ new Set())).add(PUBLIC_VERSION);
  }
  const plainText = "5 O'Clock Shadow\nAncient Tank Chair\nAngel Cloud Label Ring\nAngel Cloud Chat Ring\nAngel Halo\nAngelic Emerald\nApple Bubble Gum\nAquatic Letter Eye Accessory\nArabian Hat\nArabian Outfit\nArabian Shoes\nArkarium Storytime Chair\nAthena Pierce's Class\nAttitude Cap\nAttitude Ribbon\nAurora Jewel Mount\nAzure Teddy Dress\nAzure Teddy Hat\nAzure Teddy Headband\nAzure Teddy Loafers\nAzure Teddy Suit\nBaby Angel Wings\nBaby Chick Chat Ring\nBaby Chick Label Ring\nBadge of Chiu\nBadge of Donarr\nBadge of Junna\nBadge of Mano\nBadge of Pruba\nBadge of Saturnus\nBadge of Wodan\nBall and Chain\nBalrog\nBalrog Chair\nBalrog's Fur Shoes\nBalrog's Leather Shoes\nBamboo Sword\nBanana Peel Shoes\nBandage Strip\nBark Gloves\nBark Hat\nBark Suit\nBark Wings\nBasic Mask\nBeach Babe Outfit\nBeach Bum Outfit\nBeach Party Fireworks\nBeach Party Head Decoration\nBeach Party Slippers\nBeach Party Swimsuit A\nBeach Party Swimsuit B\nBee Train\nBerserk Chain\nBlack Bean Mark\nBlack Heaven Amusement Park Ride Chair\nBlack Heaven Train Chair\nBlack Scooter\nBlack Wing Master's Hat\nBlack Wyvern\nBlackheart Mount\nBlade Rifle\nBlasted Feather\nBlaze Capsule\nBlooming Forest Floral Crown\nBlooming Forest Outfit A\nBlooming Forest Outfit B\nBlooming Forest Shoes\nBlooming Forest Weapon\nBlue Caped Uniform\nBlue Nightmare Dress\nBlue Nightmare Fedora\nBlue Nightmare Hairpin\nBlue Nightmare Shoes\nBlue Nightmare Suit\nBlue Pre-School Hat\nBold Luxury School Uniform A\nBold Luxury School Uniform B\nBroccoli Hat\nBronze Arrows for Bow\nBronze Arrows for Crossbow\nBrown Ankle Boots\nBrown Hunting Cap\nBrown Teddy Hairband\nBrown Teddy Label Ring\nBrown Teddy Outfit\nBrown Teddy Quote Ring\nBubble Flip Flops\nBullets\nCamel Wagon\nCandy Candy\nCape Mark Beret\nCape Ribbon Beret\nCape Uniform Shoes A\nCape Uniform Shoes B\nCatty Arkarium\nCatty Hilla\nCatty Magnus\nCatty Von Leon\nChaos Horntail Necklace\nChaos Pierre Hat\nChaos Queen's Tiara\nChaos Vellum's Helm\nChaos Von Bon Helmet\nChaos Zakum Helmet\nChaos Zakum's Tree Branch\nCheerful School Uniform A\nCheerful School Uniform B\nCherry Bubblegum\nChicken\nChicken Charm\nChicken Coataroo\nChicken Glovaroo\nChicken Hataroo\nChicky Pile\nChicky-Chicky Boom\nChief Chair\nChief Hat\nChocolate Heart\nClassy School Uniform A\nClassy School Uniform B\nCoin Crazy Chair\nColorful Camo Beanie\nCommander Arkarium Mask\nCommander Damien Mask\nCommander Hilla Mask\nCommander Lotus Mask\nCommander Magnus Mask\nCommander Von Leon Mask\nCondensed Power Crystal\nConfident Luxury School Uniform A\nConfident Luxury School Uniform B\nConstruction Hardhat\nCotton Bell\nCotton Hat\nCozy Cotton Candy A\nCozy Cotton Candy B\nCreepy Shoes\nCreepy Skull\nCreepy Soul\nCrimson Queen's Throne\nCrispy Carrot Duds\nCrispy Carrot Flippers\nCrispy Carrot Skateboard\nCrystal Ventus Badge\nCygnus Dress\nCygnus Face\nCygnus Garden Chair\nCygnus Hair\nCygnus Sandals\nCygnus' Best Friend\nCygnus's Guard\nDamien's Eyepatch\nDark Jack's Scar\nDea Sidus Earring\nDeath Sender Charm\nDenim Cargos\nDiamond Pickaxe\nDigitized Damage Skin\nDog Charm\nDominator Pendant\nDouble Power Suit\nDown in the Dumps\nDowny Purple Cozy Outfit\nDowny Purple Soft Outfit\nDragon Charm\nDragonoir Mount\nDreaming Magic\nDreaming Unicorn\nDrill Machine Chair\nDylan's Silk Hat\nES Square\nEckhart's Best Friend\nElite Knight Boots\nElite Knight Cape\nElite Knight Dual Swords\nElite Knight Hat\nElite Knight Suit\nEmerald Glow\nEmerald Pin\nEmerald Ribbon\nEnraged Zakum Belt\nEnraged Zakum Cape\nEnraged Zakum Helmet\nEternal Bullets\nEvolving Berserk Chain\nEvolving Blasted Feather\nEvolving Death Sender Charm\nEvolving Falcon Eye\nEvolving Metallic Blue Book <Epode>\nEvolving Rusty Book <Epode>\nEvolving Sacred Rosary\nEvolving Slashing Shadow\nEvolving True Shot\nEvolving Virtues Medal\nEvolving White Gold Book <Epode>\nEvolving Wrist Armor\nFalcon Eye\nFish on a Stick\nFlame Throwing Stars\nFlower Dance\nFluid Gloves\nFluid Hat\nFluid Suit\nFluid Wings\nFlying Battle Chair\nFrameless Glasses\nFrancis' Best Friend\nFrankenbalrog Chair\nFriends of the Forest Camping Chair\nFritto Mask\nFunky School Uniform A\nFunky School Uniform B\nGalactic Flame Cape\nGalactic Fragment\nGalactic Guardian\nGalactic Hero Suit\nGalactic Legend A\nGargoyle\nGelimer Chat Ring\nGelimer Label Ring\nGentle Dylan\nGentleman's Mustache\nGhost Groom Shoes\nGhost Groom Tuxedo\nGhost Groom Wedding Fedora\nGhost Suit\nGiant Bullets\nGiant Pop with a Swirl\nGiant Rooster\nGladiator Armor\nGladiator Cape\nGladiator Helmet\nGlamor Hair\nGlaze Capsule\nGlory Guard Cape\nGlory Guard Ceremonial Sword\nGlory Guard Hat\nGlory Guard Mount\nGlory Guard Uniform\nGoatee\nGoblin Fire\nGold Maple Leaf Emblem\nGolden Armor\nGolden Bell Dress\nGolden Bell Outfit\nGolden Bell Shoes\nGolden Clover Belt\nGolden Fox Ears\nGolden Fox Tail\nGolden Honey Pot\nGolden Pickaxe\nGolden Shoes\nGolden Trench Helmet\nGothic Boots\nGothic Headband\nGothic Mini Hat\nGothic Overall\nGrand Master Boots\nGrand Master Hat\nGrand Master Sword\nGrand Master Uniform\nGreen Suspenders\nHappy Pierre Chair\nHarp Seal\nHarp Seal Doll Gloves\nHarp Seal Doll Outfit\nHarp Seal Mask\nHawaiian Sunhat\nHawkeye's Best Friend\nHeart Kitty Fishing Rod\nHeart Kitty Hat\nHeart Kitty Outfit\nHeart Kitty Plate\nHekaton's Fist\nHekaton's Rest\nHellhound\nHeroes Damien Chat Ring\nHeroes Damien Label Ring\nHidden Balrog\nHilla & Magnus Chair\nHilla Face\nHilla Snowfield Mount\nHilla's Style Maker\nHoney Bee Chat Ring\nHoney Bee Label Ring\nHoneybee Antenna Hairband\nHoneybee Damage Skin\nHoneybee Suit\nHoneybee Wings\nHorntail Necklace\nHoya Hat\nHoya Roar\nHoya Shorts\nHoya T-shirt\nHwabi Throwing Stars\nIcicles\nIfia's Earrings\nIfia's Necklace\nIfia's Ring\nIgnis Gloves\nIgnis Hat\nIgnis Suit\nIgnis Wings\nIlbi Throwing Stars\nInferno Wolf Mount\nInfinite Throwing Knives\nIrena's Best Friend\nJadeite Charm\nJailbird Cap\nJailbird Uniform\nJailbreak Spoon\nJiggly Slime\nKaiserion\nKiss Mark\nKitty Paint\nKritias Damage Skin\nKumbi Throwing Stars\nLady Rosalia\nLalala Ring\nLarge Fork\nLiberated Kaiserium\nLilin's Best Friend\nLittle Darling Beret\nLittle Darling Outfit A\nLittle Darling Outfit B\nLittle Darling Shoes A\nLittle Darling Shoes B\nLittle Red Riding Dress\nLord Pirate Chair\nLord Pirate Prisoner\nLord Zakum Throne\nLotus's Black Wing Shoes\nLotus's Black Wings Uniform\nLucky Clover\nLucky Clover Hat A\nLucky Clover Hat B\nLucky Clover Outfit A\nLucky Clover Outfit B\nLudibrium Chair\nM-Force Chair\nM-Forcer Boots\nM-Forcer Gloves\nMad Mage Cape\nMad Mage Gloves\nMad Mage Hood\nMad Mage Makeup\nMad Mage Shoes\nMad Mage Staff\nMad Mage Suit\nMagic Crest\nMagic Lamp Chair\nMagic Unicorn\nMagician Hat\nMagnus Face\nManji Mask\nManji Outfit\nMaple Doctor's Scrubs A\nMaple Doctor's Scrubs B\nMaple Momentree Crown A\nMaple Momentree Crown B\nMaple Momentree Robe A\nMaple Momentree Robe B\nMaple Momentree Shoes A\nMaple Momentree Shoes B\nMaple Momentree Wings\nMarron Glace A\nMarron Glace B\nMechanator Pendant\nMemory Flow\nMeow Candy Chaser\nMeow Candy Hat\nMeow Candy Hunter\nMeow Candy Shoes\nMeow Candy Star Tail\nMercury Cloak\nMercury Gloves\nMercury Jean Skirt\nMercury Leather Jacket A\nMercury Leather Jacket B\nMercury Lightning\nMercury Sword\nMercury Washed Jeans\nMetallic Blue Book <Epode>\nMighty Banana Chat Ring\nMighty Banana Label Ring\nMighty Bullets\nMihile's Best Friend\nMilitary Pop Star\nMimic Protocol Style Look\nMobile Mansion Chat Ring\nMobile Mansion Label Ring\nModest School Uniform A\nModest School Uniform B\nMokbi Throwing Stars\nMonkey Charm\nMonster Park Damage Skin\nMoon Bunny Costume\nMoon Bunny Gloves\nMoon Bunny Headgear\nMoon Bunny Paws\nMoonlight Fairy Maillot\nMoonlight Fairy Shoes\nMoonlight Fairy Tunic\nMoonlight Fairy Wings\nMu Lung Scarecrow Chair\nMummy Hat\nMummy Mask\nMummy Suit\nMush Ado About Nothing Chair\nMushroom's Song\nMystic Rose Feather\nMystic Rose Soul\nMystic Ruby Crown\nNative Hog\nNatural School Uniform A\nNatural School Uniform B\nNeckerchief Fascinator (Ivory)\nNeckerchief Fascinator (Navy)\nNeckerchief Fascinator (Purple)\nNeckerchief Fascinator (Red)\nNeinheart's Best Friend\nNeo Castle Accessory\nNeo Castle Dress\nNeo Castle Shoes\nNeo Castle Suit\nNeon Green Boots\nNeophyte Belt\nNeophyte Cloak\nNeophyte Earrings\nNeophyte Eye Accessory\nNeophyte Mark\nNeophyte Pendant\nNeophyte Ring\nNeophyte Shoulders\nNew Veamoth Wings\nNew Weird Pink Bean Face Accessory\nNew Weird Slime Face Accessory\nNew Weird Yeti Face Accessory\nNewspaper Cape\nNight Hat\nNight Magician A\nNight Magician B\nNight Magician Chat Ring\nNight Magician Label Ring\nNoble Ifia's Ring\nNostalgic Luxury School Uniform A\nNostalgic Luxury School Uniform B\nOdette Ballet Slippers\nOdette Tiara\nOdette Tutu\nOdile Ballet Slippers\nOdile Tiara\nOdile Tutu\nOrange Mushroom Dungarees\nOrange Mushroom Stylish Cap\nOrchid's Best Friend\nOutsized Sailor Coat (Black & Ivory)\nOutsized Sailor Coat (Navy & White)\nOutsized Sailor Coat (White & Purple)\nOutsized Sailor Coat (White & Red)\nOz's Best Friend\nPale Student Teacher's Lecture\nPanda Teddy Hairband\nPanda Teddy Outfit\nPaper Boat Hat\nPapulatus Clock Chair\nPapulatus Mark\nParty Quest Blue Damage Skin\nParty Quest Damage Skin\nPepe Balloon\nPepe Dungarees\nPepe Sleeping Bag Chair\nPepe Stylish Cap\nPharaoh Crown\nPierre Hat\nPig Charm\nPink Antique Parasol\nPink Bean Balloon\nPink Bean Chair\nPink Bean Dungarees\nPink Bean Stylish Cap\nPink Bean Tail\nPink Dude School Uniform\nPink Frill Swim Skirt\nPink Girl School Uniform\nPink Holy Cup\nPink Shock Pop Star\nPink Teddy Hairband\nPink Teddy Outfit\nPirate Emblem Flag\nPollo Mask\nPre-School Pants\nPre-School Uniform Skirt\nPre-School Uniform Top A\nPre-School Uniform Top B\nPremium Floral Print School Uniform A\nPremium Floral Print School Uniform B\nPrim School Uniform A\nPrim School Uniform B\nPromised Time\nPuppet Strings\nPurple Shoes\nPyramid Chair\nQuality Arrows for Bow\nQuality Arrows for Crossbow\nQueen's Tiara\nRagged Top\nRaiden Gloves\nRaiden Hat\nRaiden Suit\nRaiden Wings\nRailroad Engineer Chair\nRat Charm\nRed Caped Uniform\nRed Hood Bandana\nRed Pre-School Hat\nRed Ribbon Shoes\nRed Rose Chat Ring\nRed Rose Label Ring\nRed-Feathered Bandana\nRex's Hyena\nRibbon Frilled top\nRosalia's Rose\nRose\nRoyal Black Metal Shoulder\nRoyal Mystic Cape\nRoyal Mystic Shoes\nRoyal Mystic Uniform A\nRoyal Mystic Uniform B\nRusty Book <Epode>\nSacred Rosary\nSage Training Hat\nSage Training Outfit\nSalt and Pepper Cape\nScary Toy Gift\nScouter\nSea Otter Slammer\nSeal Wave Snuggler\nSeven Days Badge\nShark Bite Shoes\nShark Bodysuit\nShark Cape\nShark Hoodie\nSharp Arrows for Bow\nSharp Arrows for Crossbow\nShimmering Emerald\nShining Emerald\nShining Magic\nShining Unicorn\nShiny Bullets\nSilver Blossom Ring\nSilver Fox Ears\nSilver Fox Tail\nSilver Maple Leaf Emblem\nSkateboard\nSkull Beanie\nSkull Shirt\nSlashing Shadow\nSlime Damage Skin\nSlime Dungarees\nSlime Stylish Cap\nSnake Charm\nSnake High-tops\nSnake Snapback Hat\nSnowballs\nSoft Cotton Candy\nSoul Teddy Chair\nSpace Pirate Helmet\nSpace Pirate Open Helmet\nSpace Pirate Topper\nSpaceship\nSplit Bullets\nSpooky Shoes B\nSpooky Skull\nSpooky Soul\nSpring Camping Boots\nSpring Camping Hat\nSpring Camping Outfit A\nSpring Camping Outfit B\nStar & Moon Hairpin\nStar of Ereve\nStarglimmer Cape\nStarglimmer Outfit\nStarglimmer Shoes\nStarglimmer Tiara\nStarlight Aurora Damage Skin\nStarlight Guide\nStarlight Leader\nStarlight Wings\nSteak Outfit\nSteel Arrows for Bow\nSteel Arrows for Crossbow\nSteely Throwing Knives\nStone of Eternal Life\nStrawberry Delight\nStrawberry Fork\nStrawberry Hairband\nStrawberry Outfit A\nStrawberry Outfit B\nStrawberry Shoes A\nStrawberry Shoes B\nStriped Bucket Hat\nStriped Overalls\nStriped Shoes\nStriped Suspenders Shorts\nStrong Arrows for Bow\nStrong Arrows for Crossbow\nSubi Throwing Stars\nSubmarine\nSuitcase\nSuper Scribbler\nSuper Summer Snorkel\nSweet Cotton Candy\nSweet Snake\nTania Bolero\nTania Cloak\nTania En Fuego\nTania Gloves\nTania Sword\nTania Tailored Jacket\nTania Tartan Pants\nTania Tartan Skirt\nTeddy's Winder\nTenacious Ribbon Pig Hat\nTitanium Arrows for Bow\nTitanium Arrows for Crossbow\nTobi Throwing Stars\nToga\nTorn-Up Jeans\nTraining Dummy Mount\nTrench Coat\nTriumphant Ribbon Pig Hat\nTriumphant Zakum Hat\nTrue Shot\nTwinkling Boy Hat\nTwinkling Cotton Candy\nTwinkling Girl Hat\nVeamoth Armor\nVeamoth Chat Ring\nVeamoth Label Ring\nVeamoth Shoes\nVeamoth Sword\nVeamoth Wig A\nVeamoth Wig B\nVellum Mask\nVellum Mount\nVellum Rock Chair\nVellum's Helm\nVioletta Express Chair\nVirtues Medallion\nVital Bullets\nVoltarix Gloves\nVoltarix Hat\nVoltarix Suit\nVoltarix Wings\nVon Bon Helmet\nVon Bon Mask\nVon Bon's Fury Chair\nVon Bon's Von Chair\nWar Paint\nWaterworks Cape\nWhite Fiancee\nWhite Gold Book <Epode>\nWhite High Top\nWhite M-Forcer Helmet\nWhite M-Forcer Outfit\nWhite Proposal\nWill o' the Wisps\nWooden Tops\nWrist Armor\nWulbi Throwing Stars\nYeti\nYeti Dungarees\nYeti Stylish Cap\nYeti and Pepe Damage Skin\nZakum Arms\nZakum Helmet\nZakum's Poisonic Axe\nZakum's Poisonic Bow\nZakum's Poisonic Crossbow\nZakum's Poisonic Dagger\nZakum's Poisonic Guards\nZakum's Poisonic Gun\nZakum's Poisonic Hammer\nZakum's Poisonic Knuckle\nZakum's Poisonic Polearm\nZakum's Poisonic Sledgehammer\nZakum's Poisonic Spear\nZakum's Poisonic Staff\nZakum's Poisonic Sword\nZakum's Poisonic Two-handed Axe\nZakum's Poisonic Two-handed Sword\nZakum's Poisonic Wand\nZakum's Tree Branch";
  const map = new Map(plainText.split(/[\r\n]+/g).map((name) => [name, { name }]));
  const linear = (x) => x;
  function fade(node, { delay = 0, duration = 400, easing = linear } = {}) {
    const o = +getComputedStyle(node).opacity;
    return {
      delay,
      duration,
      easing,
      css: (t) => `opacity: ${t * o}`
    };
  }
  function hover(node, options) {
    let currentElement = null;
    const f = (event2) => {
      if (event2.type === "mouseover") {
        if (currentElement) return;
        const target = event2.target.closest(options.target);
        if (!target) return;
        currentElement = target;
        node.dispatchEvent(new CustomEvent("HoverEnter", { detail: { target: currentElement } }));
      } else {
        if (!currentElement) return;
        let relatedTarget = event2.relatedTarget;
        while (relatedTarget) {
          if (relatedTarget === currentElement) return;
          relatedTarget = relatedTarget.parentNode;
        }
        node.dispatchEvent(new CustomEvent("HoverLeave", { detail: { target: currentElement } }));
        currentElement = null;
      }
    };
    user_effect(() => {
      if (options.disabled) return;
      node.addEventListener("mouseover", f, true);
      node.addEventListener("mouseout", f, false);
    });
  }
  const waitUntil = async (condition) => new Promise((resolve) => {
    const raf2 = () => (condition == null ? void 0 : condition()) ? resolve() : requestAnimationFrame(raf2);
    requestAnimationFrame(raf2);
  });
  const getReactProps = (ele) => ele[Object.keys(ele).find((k) => k.startsWith("__reactProps"))];
  var root_1$1 = /* @__PURE__ */ from_html(`<div><div class="tooltip-content"><div class="whitespace-pre-line"> </div></div></div>`);
  function Tooltip($$anchor) {
    let current = /* @__PURE__ */ state(null);
    const position = /* @__PURE__ */ user_derived(() => {
      var _a2;
      if (!get(current)) return { x: 0, y: 0 };
      const { x, y, width } = (_a2 = get(current)) == null ? void 0 : _a2.getBoundingClientRect();
      return { x: x + width / 2, y };
    });
    function handleHover(event2) {
      const type = event2.type;
      if (type === "HoverLeave") {
        set(current, null);
        return;
      }
      set(current, event2.detail.target, true);
    }
    var fragment = comment();
    action($document.body, ($$node, $$action_arg) => hover == null ? void 0 : hover($$node, $$action_arg), () => ({ target: "[data-tip]" }));
    event("HoverEnter", $document.body, handleHover);
    event("HoverLeave", $document.body, handleHover);
    var node = first_child(fragment);
    {
      var consequent = ($$anchor2) => {
        var div = root_1$1();
        set_class(div, 1, "tooltip fixed left-0 top-0 z-[99999] tooltip-open");
        var div_1 = child(div);
        var div_2 = child(div_1);
        var text = child(div_2);
        template_effect(() => {
          var _a2, _b;
          set_style(div, `transform: translate3d(${get(position).x}px, ${get(position).y}px, 0)`);
          set_text(text, (_b = (_a2 = get(current)) == null ? void 0 : _a2.dataset) == null ? void 0 : _b.tip);
        });
        append($$anchor2, div);
      };
      if_block(node, ($$render) => {
        if (get(current)) $$render(consequent);
      });
    }
    append($$anchor, fragment);
  }
  const Balrog = { "name": "Balrog", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140004.png" };
  const Bullets = { "name": "Bullets", "imageUrl": "https://api-static.msu.io/itemimages/icon/3153000.png" };
  const Chicken = { "name": "Chicken", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140019.png" };
  const Submarine = { "name": "Submarine", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140114.png" };
  const Suitcase = { "name": "Suitcase", "imageUrl": "https://api-static.msu.io/itemimages/icon/1702293.png" };
  const Toga = { "name": "Toga", "imageUrl": "https://api-static.msu.io/itemimages/icon/1052030.png" };
  const Yeti = { "name": "Yeti", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140017.png" };
  const Microyeti = { "name": "Microyeti", "imageUrl": "https://api-static.msu.io/itemimages/icon/5000769.png" };
  const Rose = { "name": "Rose", "imageUrl": "https://api-static.msu.io/itemimages/icon/1012006.png" };
  const Scouter = { "name": "Scouter", "imageUrl": "https://api-static.msu.io/itemimages/icon/1022262.png" };
  const Skateboard = { "name": "Skateboard", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140076.png" };
  const Snowballs = { "name": "Snowballs", "imageUrl": "https://api-static.msu.io/itemimages/icon/3152008.png" };
  const Spaceship = { "name": "Spaceship", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140178.png" };
  const Freckles = { "name": "Freckles", "imageUrl": "https://api-static.msu.io/itemimages/icon/1011003.png" };
  const Cactus = { "name": "Cactus", "imageUrl": "https://api-static.msu.io/itemimages/icon/1702059.png" };
  const Gargoyle = { "name": "Gargoyle", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140068.png" };
  const Goatee = { "name": "Goatee", "imageUrl": "https://api-static.msu.io/itemimages/icon/1010001.png" };
  const Hellhound = { "name": "Hellhound", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140070.png" };
  const Icicles = { "name": "Icicles", "imageUrl": "https://api-static.msu.io/itemimages/icon/3152010.png" };
  const Kaiserion = { "name": "Kaiserion", "imageUrl": "https://api-static.msu.io/itemimages/icon/1402205.png" };
  const galleryData = {
    "Angel Cloud Label Ring": { "name": "Angel Cloud Label Ring", "imageUrl": "https://api-static.msu.io/itemimages/icon/1112150.png" },
    "5 O'Clock Shadow": { "name": "5 O'Clock Shadow", "imageUrl": "https://api-static.msu.io/itemimages/icon/1010003.png" },
    "Apple Bubble Gum": { "name": "Apple Bubble Gum", "imageUrl": "https://api-static.msu.io/itemimages/icon/1012096.png" },
    "Ancient Tank Chair": { "name": "Ancient Tank Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3010761.png" },
    "Angel Cloud Chat Ring": { "name": "Angel Cloud Chat Ring", "imageUrl": "https://api-static.msu.io/itemimages/icon/1112262.png" },
    "Angel Halo": { "name": "Angel Halo", "imageUrl": "https://api-static.msu.io/itemimages/icon/1003685.png" },
    "Angelic Emerald": { "name": "Angelic Emerald", "imageUrl": "https://api-static.msu.io/itemimages/icon/1102356.png" },
    "Aquatic Letter Eye Accessory": { "name": "Aquatic Letter Eye Accessory", "imageUrl": "https://api-static.msu.io/itemimages/icon/1022231.png" },
    "Arabian Hat": { "name": "Arabian Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005435.png" },
    "Arabian Outfit": { "name": "Arabian Outfit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1053504.png" },
    "Arabian Shoes": { "name": "Arabian Shoes", "imageUrl": "https://api-static.msu.io/itemimages/icon/1073392.png" },
    "Arkarium Storytime Chair": { "name": "Arkarium Storytime Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3010941.png" },
    "Athena Pierce's Class": { "name": "Athena Pierce's Class", "imageUrl": "https://api-static.msu.io/itemimages/icon/3015115.png" },
    "Attitude Cap": { "name": "Attitude Cap", "imageUrl": "https://api-static.msu.io/itemimages/icon/1000106.png" },
    "Attitude Ribbon": { "name": "Attitude Ribbon", "imageUrl": "https://api-static.msu.io/itemimages/icon/1001129.png" },
    "Aurora Jewel Mount": { "name": "Aurora Jewel Mount", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140285.png" },
    "Azure Teddy Dress": { "name": "Azure Teddy Dress", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051612.png" },
    "Azure Teddy Hat": { "name": "Azure Teddy Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1000107.png" },
    "Azure Teddy Headband": { "name": "Azure Teddy Headband", "imageUrl": "https://api-static.msu.io/itemimages/icon/1001130.png" },
    "Azure Teddy Loafers": { "name": "Azure Teddy Loafers", "imageUrl": "https://api-static.msu.io/itemimages/icon/1073424.png" },
    "Azure Teddy Suit": { "name": "Azure Teddy Suit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050541.png" },
    "Baby Angel Wings": { "name": "Baby Angel Wings", "imageUrl": "https://api-static.msu.io/itemimages/icon/1102005.png" },
    "Baby Chick Chat Ring": { "name": "Baby Chick Chat Ring", "imageUrl": "https://api-static.msu.io/itemimages/icon/1115063.png" },
    "Vital Bullets": { "name": "Vital Bullets", "imageUrl": "https://api-static.msu.io/itemimages/icon/3153003.png" },
    "Zakum's Poisonic Wand": { "name": "Zakum's Poisonic Wand", "imageUrl": "https://api-static.msu.io/itemimages/icon/1372204.png" },
    "Zakum's Tree Branch": { "name": "Zakum's Tree Branch", "imageUrl": "https://api-static.msu.io/itemimages/icon/1372049.png" },
    "Badge of Chiu": { "name": "Badge of Chiu", "imageUrl": "https://api-static.msu.io/itemimages/icon/1182194.png" },
    "Badge of Donarr": { "name": "Badge of Donarr", "imageUrl": "https://api-static.msu.io/itemimages/icon/1182196.png" },
    "Badge of Junna": { "name": "Badge of Junna", "imageUrl": "https://api-static.msu.io/itemimages/icon/1182199.png" },
    "Badge of Mano": { "name": "Badge of Mano", "imageUrl": "https://api-static.msu.io/itemimages/icon/1182193.png" },
    "Badge of Pruba": { "name": "Badge of Pruba", "imageUrl": "https://api-static.msu.io/itemimages/icon/1182197.png" },
    "Badge of Saturnus": { "name": "Badge of Saturnus", "imageUrl": "https://api-static.msu.io/itemimages/icon/1182198.png" },
    "Badge of Wodan": { "name": "Badge of Wodan", "imageUrl": "https://api-static.msu.io/itemimages/icon/1182195.png" },
    "Ball and Chain": { "name": "Ball and Chain", "imageUrl": "https://api-static.msu.io/itemimages/icon/1073282.png" },
    Balrog,
    "Balrog Chair": { "name": "Balrog Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3010636.png" },
    "Hidden Balrog": { "name": "Hidden Balrog", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140092.png" },
    "Balrog's Fur Shoes": { "name": "Balrog's Fur Shoes", "imageUrl": "https://api-static.msu.io/itemimages/icon/1072376.png" },
    "Balrog's Leather Shoes": { "name": "Balrog's Leather Shoes", "imageUrl": "https://api-static.msu.io/itemimages/icon/1072375.png" },
    "Bamboo Sword": { "name": "Bamboo Sword", "imageUrl": "https://api-static.msu.io/itemimages/icon/1703018.png" },
    "Banana Peel Shoes": { "name": "Banana Peel Shoes", "imageUrl": "https://api-static.msu.io/itemimages/icon/1073721.png" },
    "Bandage Strip": { "name": "Bandage Strip", "imageUrl": "https://api-static.msu.io/itemimages/icon/1012027.png" },
    "Frankenbalrog Chair": { "name": "Frankenbalrog Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3015521.png" },
    "Bark Hat": { "name": "Bark Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1006347.png" },
    "Basic Mask": { "name": "Basic Mask", "imageUrl": "https://api-static.msu.io/itemimages/icon/1022330.png" },
    "Bark Gloves": { "name": "Bark Gloves", "imageUrl": "https://api-static.msu.io/itemimages/icon/1082794.png" },
    "Bark Suit": { "name": "Bark Suit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1054060.png" },
    "Bark Wings": { "name": "Bark Wings", "imageUrl": "https://api-static.msu.io/itemimages/icon/1103633.png" },
    "Beach Babe Outfit": { "name": "Beach Babe Outfit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051359.png" },
    "Beach Bum Outfit": { "name": "Beach Bum Outfit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050293.png" },
    "Beach Party Fireworks": { "name": "Beach Party Fireworks", "imageUrl": "https://api-static.msu.io/itemimages/icon/1703236.png" },
    "Beach Party Head Decoration": { "name": "Beach Party Head Decoration", "imageUrl": "https://api-static.msu.io/itemimages/icon/1006043.png" },
    "Beach Party Slippers": { "name": "Beach Party Slippers", "imageUrl": "https://api-static.msu.io/itemimages/icon/1073668.png" },
    "Beach Party Swimsuit A": { "name": "Beach Party Swimsuit A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051723.png" },
    "Beach Party Swimsuit B": { "name": "Beach Party Swimsuit B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050650.png" },
    "Bee Train": { "name": "Bee Train", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140064.png" },
    "Berserk Chain": { "name": "Berserk Chain", "imageUrl": "https://api-static.msu.io/itemimages/icon/1352222.png" },
    "Evolving Berserk Chain": { "name": "Evolving Berserk Chain", "imageUrl": "https://api-static.msu.io/itemimages/icon/1352223.png" },
    "Toy RIfle": { "name": "Toy RIfle", "imageUrl": "https://api-static.msu.io/itemimages/icon/1702014.png" },
    "Super Suave": { "name": "Super Suave", "imageUrl": "https://api-static.msu.io/itemimages/icon/1791053.png" },
    "Smart Aleck": { "name": "Smart Aleck", "imageUrl": "https://api-static.msu.io/itemimages/icon/1790009.png" },
    "Spring Ribbon Hair": { "name": "Spring Ribbon Hair", "imageUrl": "https://api-static.msu.io/itemimages/icon/1791299.png" },
    "Julian Hair": { "name": "Julian Hair", "imageUrl": "https://api-static.msu.io/itemimages/icon/1791072.png" },
    "Black Bean Mark": { "name": "Black Bean Mark", "imageUrl": "https://api-static.msu.io/itemimages/icon/1022232.png" },
    "Black Heaven Train Chair": { "name": "Black Heaven Train Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3015049.png" },
    "Black Scooter": { "name": "Black Scooter", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140201.png" },
    "Black Wyvern": { "name": "Black Wyvern", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140104.png" },
    "Blackheart Mount": { "name": "Blackheart Mount", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140224.png" },
    "Blade Rifle": { "name": "Blade Rifle", "imageUrl": "https://api-static.msu.io/itemimages/icon/1703482.png" },
    "Blasted Feather": { "name": "Blasted Feather", "imageUrl": "https://api-static.msu.io/itemimages/icon/1352262.png" },
    "Blaze Capsule": { "name": "Blaze Capsule", "imageUrl": "https://api-static.msu.io/itemimages/icon/3153007.png" },
    "Blooming Forest Floral Crown": { "name": "Blooming Forest Floral Crown", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005801.png" },
    "Blooming Forest Outfit A": { "name": "Blooming Forest Outfit A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050586.png" },
    "Blooming Forest Outfit B": { "name": "Blooming Forest Outfit B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051659.png" },
    "Blooming Forest Shoes": { "name": "Blooming Forest Shoes", "imageUrl": "https://api-static.msu.io/itemimages/icon/1073546.png" },
    "Blooming Forest Weapon": { "name": "Blooming Forest Weapon", "imageUrl": "https://api-static.msu.io/itemimages/icon/1703094.png" },
    "Blue Caped Uniform": { "name": "Blue Caped Uniform", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050743.png" },
    "Blue Nightmare Dress": { "name": "Blue Nightmare Dress", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051641.png" },
    "Blue Nightmare Fedora": { "name": "Blue Nightmare Fedora", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005647.png" },
    "Blue Nightmare Hairpin": { "name": "Blue Nightmare Hairpin", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005648.png" },
    "Blue Nightmare Shoes": { "name": "Blue Nightmare Shoes", "imageUrl": "https://api-static.msu.io/itemimages/icon/1073488.png" },
    "Blue Nightmare Suit": { "name": "Blue Nightmare Suit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050569.png" },
    "Blue Pre-School Hat": { "name": "Blue Pre-School Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1002190.png" },
    "Bold Luxury School Uniform B": { "name": "Bold Luxury School Uniform B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051401.png" },
    "Broccoli Hat": { "name": "Broccoli Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1006157.png" },
    "Bronze Arrows for Bow": { "name": "Bronze Arrows for Bow", "imageUrl": "https://api-static.msu.io/itemimages/icon/3150000.png" },
    "Bronze Arrows for Crossbow": { "name": "Bronze Arrows for Crossbow", "imageUrl": "https://api-static.msu.io/itemimages/icon/3151000.png" },
    "Brown Ankle Boots": { "name": "Brown Ankle Boots", "imageUrl": "https://api-static.msu.io/itemimages/icon/1072478.png" },
    "Brown Hunting Cap": { "name": "Brown Hunting Cap", "imageUrl": "https://api-static.msu.io/itemimages/icon/1003163.png" },
    "Brown Teddy Hairband": { "name": "Brown Teddy Hairband", "imageUrl": "https://api-static.msu.io/itemimages/icon/1006378.png" },
    "Brown Teddy Label Ring": { "name": "Brown Teddy Label Ring", "imageUrl": "https://api-static.msu.io/itemimages/icon/1112126.png" },
    "Brown Teddy Outfit": { "name": "Brown Teddy Outfit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1054081.png" },
    "Brown Teddy Quote Ring": { "name": "Brown Teddy Quote Ring", "imageUrl": "https://api-static.msu.io/itemimages/icon/1112236.png" },
    "Bubble Flip Flops": { "name": "Bubble Flip Flops", "imageUrl": "https://api-static.msu.io/itemimages/icon/1072843.png" },
    Bullets,
    "Camel Wagon": { "name": "Camel Wagon", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140134.png" },
    "Candy Candy": { "name": "Candy Candy", "imageUrl": "https://api-static.msu.io/itemimages/icon/1004117.png" },
    "Cape Mark Beret": { "name": "Cape Mark Beret", "imageUrl": "https://api-static.msu.io/itemimages/icon/1000138.png" },
    "Cape Ribbon Beret": { "name": "Cape Ribbon Beret", "imageUrl": "https://api-static.msu.io/itemimages/icon/1001164.png" },
    "Cape Uniform Shoes A": { "name": "Cape Uniform Shoes A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1071197.png" },
    "Cape Uniform Shoes B": { "name": "Cape Uniform Shoes B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1070181.png" },
    "Catty Arkarium": { "name": "Catty Arkarium", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005160.png" },
    "Catty Hilla": { "name": "Catty Hilla", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005162.png" },
    "Catty Magnus": { "name": "Catty Magnus", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005159.png" },
    "Catty Von Leon": { "name": "Catty Von Leon", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005161.png" },
    "Chaos Horntail Necklace": { "name": "Chaos Horntail Necklace", "imageUrl": "https://api-static.msu.io/itemimages/icon/1122076.png" },
    "Chaos Pierre Hat": { "name": "Chaos Pierre Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1003719.png" },
    "Chaos Queen's Tiara": { "name": "Chaos Queen's Tiara", "imageUrl": "https://api-static.msu.io/itemimages/icon/1003721.png" },
    "Chaos Vellum's Helm": { "name": "Chaos Vellum's Helm", "imageUrl": "https://api-static.msu.io/itemimages/icon/1003722.png" },
    "Chaos Von Bon Helmet": { "name": "Chaos Von Bon Helmet", "imageUrl": "https://api-static.msu.io/itemimages/icon/1003720.png" },
    "Chaos Zakum Helmet": { "name": "Chaos Zakum Helmet", "imageUrl": "https://api-static.msu.io/itemimages/icon/1003112.png" },
    "Chaos Zakum's Tree Branch": { "name": "Chaos Zakum's Tree Branch", "imageUrl": "https://api-static.msu.io/itemimages/icon/1372073.png" },
    "Cheerful School Uniform A": { "name": "Cheerful School Uniform A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050330.png" },
    "Cherry Bubblegum": { "name": "Cherry Bubblegum", "imageUrl": "https://api-static.msu.io/itemimages/icon/1012085.png" },
    Chicken,
    "Chicken Charm": { "name": "Chicken Charm", "imageUrl": "https://api-static.msu.io/itemimages/icon/1162039.png" },
    "Chicken Coataroo": { "name": "Chicken Coataroo", "imageUrl": "https://api-static.msu.io/itemimages/icon/1052661.png" },
    "Chicken Glovaroo": { "name": "Chicken Glovaroo", "imageUrl": "https://api-static.msu.io/itemimages/icon/1082549.png" },
    "Chicken Hataroo": { "name": "Chicken Hataroo", "imageUrl": "https://api-static.msu.io/itemimages/icon/1003965.png" },
    "Chicky-Chicky Boom": { "name": "Chicky-Chicky Boom", "imageUrl": "https://api-static.msu.io/itemimages/icon/1702461.png" },
    "Chief Hat": { "name": "Chief Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1000020.png" },
    "Chocolate Heart": { "name": "Chocolate Heart", "imageUrl": "https://api-static.msu.io/itemimages/icon/1012616.png" },
    "Enraged Zakum Helmet": { "name": "Enraged Zakum Helmet", "imageUrl": "https://api-static.msu.io/itemimages/icon/1004637.png" },
    "Evolving Wrist Armor": { "name": "Evolving Wrist Armor", "imageUrl": "https://api-static.msu.io/itemimages/icon/1352903.png" },
    "New Weird Yeti Face Accessory": { "name": "New Weird Yeti Face Accessory", "imageUrl": "https://api-static.msu.io/itemimages/icon/1012754.png" },
    "Starlight Leader": { "name": "Starlight Leader", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050725.png" },
    "Starlight Wings": { "name": "Starlight Wings", "imageUrl": "https://api-static.msu.io/itemimages/icon/1003865.png" },
    "Steak Outfit": { "name": "Steak Outfit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1053946.png" },
    "Steel Arrows for Bow": { "name": "Steel Arrows for Bow", "imageUrl": "https://api-static.msu.io/itemimages/icon/3150001.png" },
    "Steel Arrows for Crossbow": { "name": "Steel Arrows for Crossbow", "imageUrl": "https://api-static.msu.io/itemimages/icon/3151001.png" },
    "Steely Throwing Knives": { "name": "Steely Throwing Knives", "imageUrl": "https://api-static.msu.io/itemimages/icon/3152005.png" },
    "Stone of Eternal Life": { "name": "Stone of Eternal Life", "imageUrl": "https://api-static.msu.io/itemimages/icon/1162009.png" },
    "Strawberry Delight": { "name": "Strawberry Delight", "imageUrl": "https://api-static.msu.io/itemimages/icon/1702329.png" },
    "Strawberry Fork": { "name": "Strawberry Fork", "imageUrl": "https://api-static.msu.io/itemimages/icon/1703336.png" },
    "Strawberry Hairband": { "name": "Strawberry Hairband", "imageUrl": "https://api-static.msu.io/itemimages/icon/1006216.png" },
    "Strawberry Outfit A": { "name": "Strawberry Outfit A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051769.png" },
    "Strawberry Outfit B": { "name": "Strawberry Outfit B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050696.png" },
    "Strawberry Shoes A": { "name": "Strawberry Shoes A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1070165.png" },
    "Strawberry Shoes B": { "name": "Strawberry Shoes B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1071181.png" },
    "Striped Bucket Hat": { "name": "Striped Bucket Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1006220.png" },
    "Striped Overalls": { "name": "Striped Overalls", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050702.png" },
    "Striped Shoes": { "name": "Striped Shoes", "imageUrl": "https://api-static.msu.io/itemimages/icon/1073752.png" },
    "Striped Suspenders Shorts": { "name": "Striped Suspenders Shorts", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051775.png" },
    "Strong Arrows for Bow": { "name": "Strong Arrows for Bow", "imageUrl": "https://api-static.msu.io/itemimages/icon/3150003.png" },
    "Strong Arrows for Crossbow": { "name": "Strong Arrows for Crossbow", "imageUrl": "https://api-static.msu.io/itemimages/icon/3151003.png" },
    "Subi Throwing Stars": { "name": "Subi Throwing Stars", "imageUrl": "https://api-static.msu.io/itemimages/icon/3152000.png" },
    Submarine,
    Suitcase,
    "Super Scribbler": { "name": "Super Scribbler", "imageUrl": "https://api-static.msu.io/itemimages/icon/1702952.png" },
    "Super Summer Snorkel": { "name": "Super Summer Snorkel", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005192.png" },
    "Sweet Cotton Candy": { "name": "Sweet Cotton Candy", "imageUrl": "https://api-static.msu.io/itemimages/icon/1006221.png" },
    "Sweet Snake": { "name": "Sweet Snake", "imageUrl": "https://api-static.msu.io/itemimages/icon/1702476.png" },
    "Tania Bolero": { "name": "Tania Bolero", "imageUrl": "https://api-static.msu.io/itemimages/icon/1041138.png" },
    "Tania Cloak": { "name": "Tania Cloak", "imageUrl": "https://api-static.msu.io/itemimages/icon/1102148.png" },
    "Tania En Fuego": { "name": "Tania En Fuego", "imageUrl": "https://api-static.msu.io/itemimages/icon/1072327.png" },
    "Tania Gloves": { "name": "Tania Gloves", "imageUrl": "https://api-static.msu.io/itemimages/icon/1082224.png" },
    "Tania Sword": { "name": "Tania Sword", "imageUrl": "https://api-static.msu.io/itemimages/icon/1702149.png" },
    "Tania Tailored Jacket": { "name": "Tania Tailored Jacket", "imageUrl": "https://api-static.msu.io/itemimages/icon/1040137.png" },
    "Tania Tartan Pants": { "name": "Tania Tartan Pants", "imageUrl": "https://api-static.msu.io/itemimages/icon/1060120.png" },
    "Tania Tartan Skirt": { "name": "Tania Tartan Skirt", "imageUrl": "https://api-static.msu.io/itemimages/icon/1061141.png" },
    "Teddy's Winder": { "name": "Teddy's Winder", "imageUrl": "https://api-static.msu.io/itemimages/icon/1103650.png" },
    "Tenacious Ribbon Pig Hat": { "name": "Tenacious Ribbon Pig Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1003905.png" },
    "Titanium Arrows for Bow": { "name": "Titanium Arrows for Bow", "imageUrl": "https://api-static.msu.io/itemimages/icon/3150005.png" },
    "Titanium Arrows for Crossbow": { "name": "Titanium Arrows for Crossbow", "imageUrl": "https://api-static.msu.io/itemimages/icon/3151005.png" },
    "Tobi Throwing Stars": { "name": "Tobi Throwing Stars", "imageUrl": "https://api-static.msu.io/itemimages/icon/3152004.png" },
    Toga,
    "Torn-Up Jeans": { "name": "Torn-Up Jeans", "imageUrl": "https://api-static.msu.io/itemimages/icon/1060108.png" },
    "Training Dummy Mount": { "name": "Training Dummy Mount", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140241.png" },
    "Trench Coat": { "name": "Trench Coat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1052309.png" },
    "Triumphant Ribbon Pig Hat": { "name": "Triumphant Ribbon Pig Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1003904.png" },
    "Triumphant Zakum Hat": { "name": "Triumphant Zakum Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1003906.png" },
    "True Shot": { "name": "True Shot", "imageUrl": "https://api-static.msu.io/itemimages/icon/1352272.png" },
    "Twinkling Boy Hat": { "name": "Twinkling Boy Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1000044.png" },
    "Twinkling Cotton Candy": { "name": "Twinkling Cotton Candy", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140191.png" },
    "Twinkling Girl Hat": { "name": "Twinkling Girl Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1001064.png" },
    "Veamoth Armor": { "name": "Veamoth Armor", "imageUrl": "https://api-static.msu.io/itemimages/icon/1052092.png" },
    "Veamoth Chat Ring": { "name": "Veamoth Chat Ring", "imageUrl": "https://api-static.msu.io/itemimages/icon/1115204.png" },
    "Veamoth Label Ring": { "name": "Veamoth Label Ring", "imageUrl": "https://api-static.msu.io/itemimages/icon/1115305.png" },
    "Veamoth Shoes": { "name": "Veamoth Shoes", "imageUrl": "https://api-static.msu.io/itemimages/icon/1072282.png" },
    "Veamoth Sword": { "name": "Veamoth Sword", "imageUrl": "https://api-static.msu.io/itemimages/icon/1702120.png" },
    "Veamoth Wig A": { "name": "Veamoth Wig A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1000031.png" },
    "Veamoth Wig B": { "name": "Veamoth Wig B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1001046.png" },
    "Vellum Mask": { "name": "Vellum Mask", "imageUrl": "https://api-static.msu.io/itemimages/icon/1012517.png" },
    "Vellum Mount": { "name": "Vellum Mount", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140078.png" },
    "Vellum Rock Chair": { "name": "Vellum Rock Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3010515.png" },
    "Vellum's Helm": { "name": "Vellum's Helm", "imageUrl": "https://api-static.msu.io/itemimages/icon/1003718.png" },
    "Violetta Express Chair": { "name": "Violetta Express Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3015048.png" },
    "Virtues Medallion": { "name": "Virtues Medallion", "imageUrl": "https://api-static.msu.io/itemimages/icon/1352202.png" },
    "Voltarix Gloves": { "name": "Voltarix Gloves", "imageUrl": "https://api-static.msu.io/itemimages/icon/1082795.png" },
    "Voltarix Hat": { "name": "Voltarix Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1006348.png" },
    "Voltarix Suit": { "name": "Voltarix Suit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1054061.png" },
    "Voltarix Wings": { "name": "Voltarix Wings", "imageUrl": "https://api-static.msu.io/itemimages/icon/1103634.png" },
    "Von Bon Helmet": { "name": "Von Bon Helmet", "imageUrl": "https://api-static.msu.io/itemimages/icon/1003716.png" },
    "Von Bon Mask": { "name": "Von Bon Mask", "imageUrl": "https://api-static.msu.io/itemimages/icon/1012518.png" },
    "Von Bon's Fury Chair": { "name": "Von Bon's Fury Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3010675.png" },
    "Von Bon's Von Chair": { "name": "Von Bon's Von Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3010512.png" },
    "War Paint": { "name": "War Paint", "imageUrl": "https://api-static.msu.io/itemimages/icon/1012025.png" },
    "Waterworks Cape": { "name": "Waterworks Cape", "imageUrl": "https://api-static.msu.io/itemimages/icon/1102143.png" },
    "White Fiancee": { "name": "White Fiancee", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051389.png" },
    "White Gold Book <Epode>": { "name": "White Gold Book <Epode>", "imageUrl": "https://api-static.msu.io/itemimages/icon/1352252.png" },
    "White High Top": { "name": "White High Top", "imageUrl": "https://api-static.msu.io/itemimages/icon/1071026.png" },
    "White M-Forcer Helmet": { "name": "White M-Forcer Helmet", "imageUrl": "https://api-static.msu.io/itemimages/icon/1004935.png" },
    "White M-Forcer Outfit": { "name": "White M-Forcer Outfit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1053147.png" },
    "White Proposal": { "name": "White Proposal", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050318.png" },
    "Will o' the Wisps": { "name": "Will o' the Wisps", "imageUrl": "https://api-static.msu.io/itemimages/icon/1032136.png" },
    "Wooden Tops": { "name": "Wooden Tops", "imageUrl": "https://api-static.msu.io/itemimages/icon/3152009.png" },
    "Wrist Armor": { "name": "Wrist Armor", "imageUrl": "https://api-static.msu.io/itemimages/icon/1352902.png" },
    "Wulbi Throwing Stars": { "name": "Wulbi Throwing Stars", "imageUrl": "https://api-static.msu.io/itemimages/icon/3152001.png" },
    Yeti,
    "Yeti Dungarees": { "name": "Yeti Dungarees", "imageUrl": "https://api-static.msu.io/itemimages/icon/1053500.png" },
    "Yeti Stylish Cap": { "name": "Yeti Stylish Cap", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005431.png" },
    "Yeti and Pepe Damage Skin": { "name": "Yeti and Pepe Damage Skin", "imageUrl": "https://api-static.msu.io/itemimages/icon/3135014.png" },
    "Zakum Arms": { "name": "Zakum Arms", "imageUrl": "https://api-static.msu.io/itemimages/icon/1102154.png" },
    "Zakum Helmet": { "name": "Zakum Helmet", "imageUrl": "https://api-static.msu.io/itemimages/icon/1002357.png" },
    "Zakum's Poisonic Axe": { "name": "Zakum's Poisonic Axe", "imageUrl": "https://api-static.msu.io/itemimages/icon/1312182.png" },
    "Zakum's Poisonic Bow": { "name": "Zakum's Poisonic Bow", "imageUrl": "https://api-static.msu.io/itemimages/icon/1452235.png" },
    "Zakum's Poisonic Crossbow": { "name": "Zakum's Poisonic Crossbow", "imageUrl": "https://api-static.msu.io/itemimages/icon/1462222.png" },
    "Zakum's Poisonic Dagger": { "name": "Zakum's Poisonic Dagger", "imageUrl": "https://api-static.msu.io/itemimages/icon/1332257.png" },
    "Zakum's Poisonic Guards": { "name": "Zakum's Poisonic Guards", "imageUrl": "https://api-static.msu.io/itemimages/icon/1472244.png" },
    "Zakum's Poisonic Gun": { "name": "Zakum's Poisonic Gun", "imageUrl": "https://api-static.msu.io/itemimages/icon/1492209.png" },
    "Zakum's Poisonic Hammer": { "name": "Zakum's Poisonic Hammer", "imageUrl": "https://api-static.msu.io/itemimages/icon/1322233.png" },
    "Zakum's Poisonic Knuckle": { "name": "Zakum's Poisonic Knuckle", "imageUrl": "https://api-static.msu.io/itemimages/icon/1482199.png" },
    "Zakum's Poisonic Polearm": { "name": "Zakum's Poisonic Polearm", "imageUrl": "https://api-static.msu.io/itemimages/icon/1442251.png" },
    "Zakum's Poisonic Sledgehammer": { "name": "Zakum's Poisonic Sledgehammer", "imageUrl": "https://api-static.msu.io/itemimages/icon/1422168.png" },
    "Zakum's Poisonic Spear": { "name": "Zakum's Poisonic Spear", "imageUrl": "https://api-static.msu.io/itemimages/icon/1432197.png" },
    "Zakum's Poisonic Staff": { "name": "Zakum's Poisonic Staff", "imageUrl": "https://api-static.msu.io/itemimages/icon/1382242.png" },
    "Zakum's Poisonic Sword": { "name": "Zakum's Poisonic Sword", "imageUrl": "https://api-static.msu.io/itemimages/icon/1302312.png" },
    "Zakum's Poisonic Two-handed Axe": { "name": "Zakum's Poisonic Two-handed Axe", "imageUrl": "https://api-static.msu.io/itemimages/icon/1412161.png" },
    "Zakum's Poisonic Two-handed Sword": { "name": "Zakum's Poisonic Two-handed Sword", "imageUrl": "https://api-static.msu.io/itemimages/icon/1402233.png" },
    "Microyeti Horn": { "name": "Microyeti Horn", "imageUrl": "https://api-static.msu.io/itemimages/icon/1802624.png" },
    Microyeti,
    "Mini Yeti": { "name": "Mini Yeti", "imageUrl": "https://api-static.msu.io/itemimages/icon/5000020.png" },
    "Me Yeti Too": { "name": "Me Yeti Too", "imageUrl": "https://api-static.msu.io/itemimages/icon/1053641.png" },
    "Yeti Horn": { "name": "Yeti Horn", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005657.png" },
    "Yeti Mic": { "name": "Yeti Mic", "imageUrl": "https://api-static.msu.io/itemimages/icon/1703050.png" },
    "Mystic Rose Feather": { "name": "Mystic Rose Feather", "imageUrl": "https://api-static.msu.io/itemimages/icon/1000132.png" },
    "Mystic Rose Soul": { "name": "Mystic Rose Soul", "imageUrl": "https://api-static.msu.io/itemimages/icon/1703418.png" },
    "Prim School Uniform B": { "name": "Prim School Uniform B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051394.png" },
    "Promised Time": { "name": "Promised Time", "imageUrl": "https://api-static.msu.io/itemimages/icon/1703422.png" },
    "Puppet Strings": { "name": "Puppet Strings", "imageUrl": "https://api-static.msu.io/itemimages/icon/1102157.png" },
    "Purple Shoes": { "name": "Purple Shoes", "imageUrl": "https://api-static.msu.io/itemimages/icon/1073418.png" },
    "Pyramid Chair": { "name": "Pyramid Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3010743.png" },
    "Quality Arrows for Bow": { "name": "Quality Arrows for Bow", "imageUrl": "https://api-static.msu.io/itemimages/icon/3150002.png" },
    "Quality Arrows for Crossbow": { "name": "Quality Arrows for Crossbow", "imageUrl": "https://api-static.msu.io/itemimages/icon/3151002.png" },
    "Queen's Tiara": { "name": "Queen's Tiara", "imageUrl": "https://api-static.msu.io/itemimages/icon/1003717.png" },
    "Ragged Top": { "name": "Ragged Top", "imageUrl": "https://api-static.msu.io/itemimages/icon/1040119.png" },
    "Raiden Gloves": { "name": "Raiden Gloves", "imageUrl": "https://api-static.msu.io/itemimages/icon/1082793.png" },
    "Raiden Hat": { "name": "Raiden Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1006346.png" },
    "Raiden Suit": { "name": "Raiden Suit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1054059.png" },
    "Raiden Wings": { "name": "Raiden Wings", "imageUrl": "https://api-static.msu.io/itemimages/icon/1103632.png" },
    "Railroad Engineer Chair": { "name": "Railroad Engineer Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3015050.png" },
    "Rat Charm": { "name": "Rat Charm", "imageUrl": "https://api-static.msu.io/itemimages/icon/1162040.png" },
    "Red Caped Uniform": { "name": "Red Caped Uniform", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051822.png" },
    "Red Hood Bandana": { "name": "Red Hood Bandana", "imageUrl": "https://api-static.msu.io/itemimages/icon/1001066.png" },
    "Red Pre-School Hat": { "name": "Red Pre-School Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1002191.png" },
    "Red Ribbon Shoes": { "name": "Red Ribbon Shoes", "imageUrl": "https://api-static.msu.io/itemimages/icon/1071032.png" },
    "Red Rose Chat Ring": { "name": "Red Rose Chat Ring", "imageUrl": "https://api-static.msu.io/itemimages/icon/1112252.png" },
    "Red Rose Label Ring": { "name": "Red Rose Label Ring", "imageUrl": "https://api-static.msu.io/itemimages/icon/1112141.png" },
    "Red-Feathered Bandana": { "name": "Red-Feathered Bandana", "imageUrl": "https://api-static.msu.io/itemimages/icon/1001026.png" },
    "Rex's Hyena": { "name": "Rex's Hyena", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140306.png" },
    "Ribbon Frilled top": { "name": "Ribbon Frilled top", "imageUrl": "https://api-static.msu.io/itemimages/icon/1041142.png" },
    "Rosalia's Rose": { "name": "Rosalia's Rose", "imageUrl": "https://api-static.msu.io/itemimages/icon/1001099.png" },
    Rose,
    "Royal Black Metal Shoulder": { "name": "Royal Black Metal Shoulder", "imageUrl": "https://api-static.msu.io/itemimages/icon/1152170.png" },
    "Royal Mystic Cape": { "name": "Royal Mystic Cape", "imageUrl": "https://api-static.msu.io/itemimages/icon/1103648.png" },
    "Royal Mystic Shoes": { "name": "Royal Mystic Shoes", "imageUrl": "https://api-static.msu.io/itemimages/icon/1073807.png" },
    "Royal Mystic Uniform A": { "name": "Royal Mystic Uniform A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051794.png" },
    "Royal Mystic Uniform B": { "name": "Royal Mystic Uniform B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050722.png" },
    "Rusty Book <Epode>": { "name": "Rusty Book <Epode>", "imageUrl": "https://api-static.msu.io/itemimages/icon/1352232.png" },
    "Sacred Rosary": { "name": "Sacred Rosary", "imageUrl": "https://api-static.msu.io/itemimages/icon/1352212.png" },
    "Sage Training Hat": { "name": "Sage Training Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005575.png" },
    "Sage Training Outfit": { "name": "Sage Training Outfit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1053606.png" },
    "Salt and Pepper Cape": { "name": "Salt and Pepper Cape", "imageUrl": "https://api-static.msu.io/itemimages/icon/1103549.png" },
    "Scary Toy Gift": { "name": "Scary Toy Gift", "imageUrl": "https://api-static.msu.io/itemimages/icon/3010683.png" },
    Scouter,
    "Sea Otter Slammer": { "name": "Sea Otter Slammer", "imageUrl": "https://api-static.msu.io/itemimages/icon/1702446.png" },
    "Seal Wave Snuggler": { "name": "Seal Wave Snuggler", "imageUrl": "https://api-static.msu.io/itemimages/icon/1702454.png" },
    "Seven Days Badge": { "name": "Seven Days Badge", "imageUrl": "https://api-static.msu.io/itemimages/icon/1182200.png" },
    "Shark Bite Shoes": { "name": "Shark Bite Shoes", "imageUrl": "https://api-static.msu.io/itemimages/icon/1073144.png" },
    "Shark Bodysuit": { "name": "Shark Bodysuit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1053040.png" },
    "Shark Cape": { "name": "Shark Cape", "imageUrl": "https://api-static.msu.io/itemimages/icon/1102926.png" },
    "Shark Hoodie": { "name": "Shark Hoodie", "imageUrl": "https://api-static.msu.io/itemimages/icon/1004756.png" },
    "Sharp Arrows for Bow": { "name": "Sharp Arrows for Bow", "imageUrl": "https://api-static.msu.io/itemimages/icon/3150004.png" },
    "Sharp Arrows for Crossbow": { "name": "Sharp Arrows for Crossbow", "imageUrl": "https://api-static.msu.io/itemimages/icon/3151004.png" },
    "Shimmering Emerald": { "name": "Shimmering Emerald", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051862.png" },
    "Shining Emerald": { "name": "Shining Emerald", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050784.png" },
    "Shining Magic": { "name": "Shining Magic", "imageUrl": "https://api-static.msu.io/itemimages/icon/1071204.png" },
    "Shining Unicorn": { "name": "Shining Unicorn", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051861.png" },
    "Shiny Bullets": { "name": "Shiny Bullets", "imageUrl": "https://api-static.msu.io/itemimages/icon/3153004.png" },
    "Silver Blossom Ring": { "name": "Silver Blossom Ring", "imageUrl": "https://api-static.msu.io/itemimages/icon/1113149.png" },
    "Silver Fox Ears": { "name": "Silver Fox Ears", "imageUrl": "https://api-static.msu.io/itemimages/icon/1002843.png" },
    "Silver Fox Tail": { "name": "Silver Fox Tail", "imageUrl": "https://api-static.msu.io/itemimages/icon/1102188.png" },
    "Silver Maple Leaf Emblem": { "name": "Silver Maple Leaf Emblem", "imageUrl": "https://api-static.msu.io/itemimages/icon/1190300.png" },
    Skateboard,
    "Skull Beanie": { "name": "Skull Beanie", "imageUrl": "https://api-static.msu.io/itemimages/icon/1002566.png" },
    "Skull Shirt": { "name": "Skull Shirt", "imageUrl": "https://api-static.msu.io/itemimages/icon/1042087.png" },
    "Slashing Shadow": { "name": "Slashing Shadow", "imageUrl": "https://api-static.msu.io/itemimages/icon/1352282.png" },
    "Slime Damage Skin": { "name": "Slime Damage Skin", "imageUrl": "https://api-static.msu.io/itemimages/icon/3135148.png" },
    "Slime Dungarees": { "name": "Slime Dungarees", "imageUrl": "https://api-static.msu.io/itemimages/icon/1053502.png" },
    "Slime Stylish Cap": { "name": "Slime Stylish Cap", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005433.png" },
    "Snake Charm": { "name": "Snake Charm", "imageUrl": "https://api-static.msu.io/itemimages/icon/1162042.png" },
    "Snake High-tops": { "name": "Snake High-tops", "imageUrl": "https://api-static.msu.io/itemimages/icon/1072889.png" },
    "Snake Snapback Hat": { "name": "Snake Snapback Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1004035.png" },
    Snowballs,
    "Soft Cotton Candy": { "name": "Soft Cotton Candy", "imageUrl": "https://api-static.msu.io/itemimages/icon/1073753.png" },
    "Soul Teddy Chair": { "name": "Soul Teddy Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3010537.png" },
    "Space Pirate Helmet": { "name": "Space Pirate Helmet", "imageUrl": "https://api-static.msu.io/itemimages/icon/1006238.png" },
    "Space Pirate Open Helmet": { "name": "Space Pirate Open Helmet", "imageUrl": "https://api-static.msu.io/itemimages/icon/1006240.png" },
    "Space Pirate Topper": { "name": "Space Pirate Topper", "imageUrl": "https://api-static.msu.io/itemimages/icon/1006239.png" },
    Spaceship,
    "Split Bullets": { "name": "Split Bullets", "imageUrl": "https://api-static.msu.io/itemimages/icon/3153001.png" },
    "Spooky Shoes B": { "name": "Spooky Shoes B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1071190.png" },
    "Spooky Skull": { "name": "Spooky Skull", "imageUrl": "https://api-static.msu.io/itemimages/icon/1006371.png" },
    "Spooky Soul": { "name": "Spooky Soul", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051793.png" },
    "Spring Camping Boots": { "name": "Spring Camping Boots", "imageUrl": "https://api-static.msu.io/itemimages/icon/1073763.png" },
    "Spring Camping Hat": { "name": "Spring Camping Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1006253.png" },
    "Spring Camping Outfit A": { "name": "Spring Camping Outfit A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051777.png" },
    "Spring Camping Outfit B": { "name": "Spring Camping Outfit B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050704.png" },
    "Star & Moon Hairpin": { "name": "Star & Moon Hairpin", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005615.png" },
    "Star of Ereve": { "name": "Star of Ereve", "imageUrl": "https://api-static.msu.io/itemimages/icon/1001075.png" },
    "Starglimmer Cape": { "name": "Starglimmer Cape", "imageUrl": "https://api-static.msu.io/itemimages/icon/1103410.png" },
    "Starglimmer Outfit": { "name": "Starglimmer Outfit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1053816.png" },
    "Starglimmer Shoes": { "name": "Starglimmer Shoes", "imageUrl": "https://api-static.msu.io/itemimages/icon/1073610.png" },
    "Starglimmer Tiara": { "name": "Starglimmer Tiara", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005941.png" },
    "Starlight Aurora Damage Skin": { "name": "Starlight Aurora Damage Skin", "imageUrl": "https://api-static.msu.io/itemimages/icon/3135070.png" },
    "Premium Floral Print School Uniform B": { "name": "Premium Floral Print School Uniform B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051404.png" },
    "Displeased Face": { "name": "Displeased Face", "imageUrl": "https://api-static.msu.io/itemimages/icon/1790213.png" },
    Freckles,
    Cactus,
    "Twinkling Eyes": { "name": "Twinkling Eyes", "imageUrl": "https://api-static.msu.io/itemimages/icon/1022075.png" },
    "Pink-Ribboned Quote Ring": { "name": "Pink-Ribboned Quote Ring", "imageUrl": "https://api-static.msu.io/itemimages/icon/1112206.png" },
    "Classy School Uniform B": { "name": "Classy School Uniform B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051395.png" },
    "Coin Crazy Chair": { "name": "Coin Crazy Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3018100.png" },
    "Colorful Camo Beanie": { "name": "Colorful Camo Beanie", "imageUrl": "https://api-static.msu.io/itemimages/icon/1006468.png" },
    "Commander Arkarium Mask": { "name": "Commander Arkarium Mask", "imageUrl": "https://api-static.msu.io/itemimages/icon/1004145.png" },
    "Commander Hilla Mask": { "name": "Commander Hilla Mask", "imageUrl": "https://api-static.msu.io/itemimages/icon/1004148.png" },
    "Commander Magnus Mask": { "name": "Commander Magnus Mask", "imageUrl": "https://api-static.msu.io/itemimages/icon/1004143.png" },
    "Commander Von Leon Mask": { "name": "Commander Von Leon Mask", "imageUrl": "https://api-static.msu.io/itemimages/icon/1004144.png" },
    "Condensed Power Crystal": { "name": "Condensed Power Crystal", "imageUrl": "https://api-static.msu.io/itemimages/icon/1012478.png" },
    "Confident Luxury School Uniform A": { "name": "Confident Luxury School Uniform A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050333.png" },
    "Construction Hardhat": { "name": "Construction Hardhat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1002238.png" },
    "Cotton Bell": { "name": "Cotton Bell", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005483.png" },
    "Cotton Hat": { "name": "Cotton Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005482.png" },
    "Cozy Cotton Candy A": { "name": "Cozy Cotton Candy A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050697.png" },
    "Cozy Cotton Candy B": { "name": "Cozy Cotton Candy B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051770.png" },
    "Creepy Shoes": { "name": "Creepy Shoes", "imageUrl": "https://api-static.msu.io/itemimages/icon/1073815.png" },
    "Creepy Skull": { "name": "Creepy Skull", "imageUrl": "https://api-static.msu.io/itemimages/icon/1006370.png" },
    "Creepy Soul": { "name": "Creepy Soul", "imageUrl": "https://api-static.msu.io/itemimages/icon/1054086.png" },
    "Crimson Queen's Throne": { "name": "Crimson Queen's Throne", "imageUrl": "https://api-static.msu.io/itemimages/icon/3010514.png" },
    "Crispy Carrot Duds": { "name": "Crispy Carrot Duds", "imageUrl": "https://api-static.msu.io/itemimages/icon/1053335.png" },
    "Crispy Carrot Flippers": { "name": "Crispy Carrot Flippers", "imageUrl": "https://api-static.msu.io/itemimages/icon/1073297.png" },
    "Crispy Carrot Skateboard": { "name": "Crispy Carrot Skateboard", "imageUrl": "https://api-static.msu.io/itemimages/icon/1702849.png" },
    "Crystal Ventus Badge": { "name": "Crystal Ventus Badge", "imageUrl": "https://api-static.msu.io/itemimages/icon/1182087.png" },
    "Cygnus Dress": { "name": "Cygnus Dress", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051277.png" },
    "Cygnus Face": { "name": "Cygnus Face", "imageUrl": "https://api-static.msu.io/itemimages/icon/1790147.png" },
    "Cygnus Garden Chair": { "name": "Cygnus Garden Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3018788.png" },
    "Cygnus Hair": { "name": "Cygnus Hair", "imageUrl": "https://api-static.msu.io/itemimages/icon/1791302.png" },
    "Cygnus Sandals": { "name": "Cygnus Sandals", "imageUrl": "https://api-static.msu.io/itemimages/icon/1071037.png" },
    "Cygnus' Best Friend": { "name": "Cygnus' Best Friend", "imageUrl": "https://api-static.msu.io/itemimages/icon/3010867.png" },
    "Cygnus's Guard": { "name": "Cygnus's Guard", "imageUrl": "https://api-static.msu.io/itemimages/icon/1702757.png" },
    "Pink Frill Swim Skirt": { "name": "Pink Frill Swim Skirt", "imageUrl": "https://api-static.msu.io/itemimages/icon/1061148.png" },
    "Pink Girl School Uniform": { "name": "Pink Girl School Uniform", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051398.png" },
    "Pink Holy Cup": { "name": "Pink Holy Cup", "imageUrl": "https://api-static.msu.io/itemimages/icon/1162025.png" },
    "Pink Shock Pop Star": { "name": "Pink Shock Pop Star", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051232.png" },
    "Pink Teddy Hairband": { "name": "Pink Teddy Hairband", "imageUrl": "https://api-static.msu.io/itemimages/icon/1006377.png" },
    "Pink Teddy Outfit": { "name": "Pink Teddy Outfit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1054080.png" },
    "Pirate Emblem Flag": { "name": "Pirate Emblem Flag", "imageUrl": "https://api-static.msu.io/itemimages/icon/1102152.png" },
    "Pollo Mask": { "name": "Pollo Mask", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005630.png" },
    "Pre-School Pants": { "name": "Pre-School Pants", "imageUrl": "https://api-static.msu.io/itemimages/icon/1060067.png" },
    "Pre-School Uniform Skirt": { "name": "Pre-School Uniform Skirt", "imageUrl": "https://api-static.msu.io/itemimages/icon/1061068.png" },
    "Pre-School Uniform Top A": { "name": "Pre-School Uniform Top A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1040078.png" },
    "Pre-School Uniform Top B": { "name": "Pre-School Uniform Top B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1041073.png" },
    "Dark Jack's Scar": { "name": "Dark Jack's Scar", "imageUrl": "https://api-static.msu.io/itemimages/icon/1012048.png" },
    "Dea Sidus Earring": { "name": "Dea Sidus Earring", "imageUrl": "https://api-static.msu.io/itemimages/icon/1032241.png" },
    "Death Sender Charm": { "name": "Death Sender Charm", "imageUrl": "https://api-static.msu.io/itemimages/icon/1352292.png" },
    "Denim Cargos": { "name": "Denim Cargos", "imageUrl": "https://api-static.msu.io/itemimages/icon/1062041.png" },
    "Diamond Pickaxe": { "name": "Diamond Pickaxe", "imageUrl": "https://api-static.msu.io/itemimages/icon/1703292.png" },
    "Digitized Damage Skin": { "name": "Digitized Damage Skin", "imageUrl": "https://api-static.msu.io/itemimages/icon/3135000.png" },
    "Dog Charm": { "name": "Dog Charm", "imageUrl": "https://api-static.msu.io/itemimages/icon/1162044.png" },
    "Dominator Pendant": { "name": "Dominator Pendant", "imageUrl": "https://api-static.msu.io/itemimages/icon/1122150.png" },
    "Double Power Suit": { "name": "Double Power Suit", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140029.png" },
    "Down in the Dumps": { "name": "Down in the Dumps", "imageUrl": "https://api-static.msu.io/itemimages/icon/1103102.png" },
    "Downy Purple Cozy Outfit": { "name": "Downy Purple Cozy Outfit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050539.png" },
    "Downy Purple Soft Outfit": { "name": "Downy Purple Soft Outfit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051610.png" },
    "Dragon Charm": { "name": "Dragon Charm", "imageUrl": "https://api-static.msu.io/itemimages/icon/1162043.png" },
    "Dragonoir Mount": { "name": "Dragonoir Mount", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140040.png" },
    "Dreaming Magic": { "name": "Dreaming Magic", "imageUrl": "https://api-static.msu.io/itemimages/icon/1070189.png" },
    "Dreaming Unicorn": { "name": "Dreaming Unicorn", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050782.png" },
    "Drill Machine Chair": { "name": "Drill Machine Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3010405.png" },
    "Evolving Death Sender Charm": { "name": "Evolving Death Sender Charm", "imageUrl": "https://api-static.msu.io/itemimages/icon/1352293.png" },
    "Dylan's Silk Hat": { "name": "Dylan's Silk Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1000077.png" },
    "ES Square": { "name": "ES Square", "imageUrl": "https://api-static.msu.io/itemimages/icon/1162013.png" },
    "Eckhart's Best Friend": { "name": "Eckhart's Best Friend", "imageUrl": "https://api-static.msu.io/itemimages/icon/3010871.png" },
    "Elite Knight Boots": { "name": "Elite Knight Boots", "imageUrl": "https://api-static.msu.io/itemimages/icon/1073740.png" },
    "Elite Knight Cape": { "name": "Elite Knight Cape", "imageUrl": "https://api-static.msu.io/itemimages/icon/1103570.png" },
    "Elite Knight Dual Swords": { "name": "Elite Knight Dual Swords", "imageUrl": "https://api-static.msu.io/itemimages/icon/1703330.png" },
    "Elite Knight Hat": { "name": "Elite Knight Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1006195.png" },
    "Elite Knight Suit": { "name": "Elite Knight Suit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1053965.png" },
    "Emerald Glow": { "name": "Emerald Glow", "imageUrl": "https://api-static.msu.io/itemimages/icon/1073972.png" },
    "Emerald Pin": { "name": "Emerald Pin", "imageUrl": "https://api-static.msu.io/itemimages/icon/1006571.png" },
    "Emerald Ribbon": { "name": "Emerald Ribbon", "imageUrl": "https://api-static.msu.io/itemimages/icon/1006572.png" },
    "Enraged Zakum Belt": { "name": "Enraged Zakum Belt", "imageUrl": "https://api-static.msu.io/itemimages/icon/1132296.png" },
    "Enraged Zakum Cape": { "name": "Enraged Zakum Cape", "imageUrl": "https://api-static.msu.io/itemimages/icon/1102871.png" },
    "Eternal Bullets": { "name": "Eternal Bullets", "imageUrl": "https://api-static.msu.io/itemimages/icon/3153005.png" },
    "Evolving Blasted Feather": { "name": "Evolving Blasted Feather", "imageUrl": "https://api-static.msu.io/itemimages/icon/1352263.png" },
    "Evolving Falcon Eye": { "name": "Evolving Falcon Eye", "imageUrl": "https://api-static.msu.io/itemimages/icon/1352913.png" },
    "Evolving Metallic Blue Book <Epode>": { "name": "Evolving Metallic Blue Book <Epode>", "imageUrl": "https://api-static.msu.io/itemimages/icon/1352243.png" },
    "Evolving Rusty Book <Epode>": { "name": "Evolving Rusty Book <Epode>", "imageUrl": "https://api-static.msu.io/itemimages/icon/1352233.png" },
    "Evolving Sacred Rosary": { "name": "Evolving Sacred Rosary", "imageUrl": "https://api-static.msu.io/itemimages/icon/1352213.png" },
    "Evolving Slashing Shadow": { "name": "Evolving Slashing Shadow", "imageUrl": "https://api-static.msu.io/itemimages/icon/1352283.png" },
    "Evolving True Shot": { "name": "Evolving True Shot", "imageUrl": "https://api-static.msu.io/itemimages/icon/1352273.png" },
    "Evolving Virtues Medal": { "name": "Evolving Virtues Medal", "imageUrl": "https://api-static.msu.io/itemimages/icon/1352203.png" },
    "Evolving White Gold Book <Epode>": { "name": "Evolving White Gold Book <Epode>", "imageUrl": "https://api-static.msu.io/itemimages/icon/1352253.png" },
    "Falcon Eye": { "name": "Falcon Eye", "imageUrl": "https://api-static.msu.io/itemimages/icon/1352912.png" },
    "Fish on a Stick": { "name": "Fish on a Stick", "imageUrl": "https://api-static.msu.io/itemimages/icon/1702781.png" },
    "Flame Throwing Stars": { "name": "Flame Throwing Stars", "imageUrl": "https://api-static.msu.io/itemimages/icon/3152011.png" },
    "Flower Dance": { "name": "Flower Dance", "imageUrl": "https://api-static.msu.io/itemimages/icon/1702501.png" },
    "Fluid Gloves": { "name": "Fluid Gloves", "imageUrl": "https://api-static.msu.io/itemimages/icon/1082796.png" },
    "Fluid Hat": { "name": "Fluid Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1006349.png" },
    "Fluid Suit": { "name": "Fluid Suit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1054062.png" },
    "Fluid Wings": { "name": "Fluid Wings", "imageUrl": "https://api-static.msu.io/itemimages/icon/1103635.png" },
    "Flying Battle Chair": { "name": "Flying Battle Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140065.png" },
    "Frameless Glasses": { "name": "Frameless Glasses", "imageUrl": "https://api-static.msu.io/itemimages/icon/1022037.png" },
    "Snowman Costume": { "name": "Snowman Costume", "imageUrl": "https://api-static.msu.io/itemimages/icon/1052897.png" },
    "Outsized Sailor Coat (White & Purple)": { "name": "Outsized Sailor Coat (White & Purple)", "imageUrl": "https://api-static.msu.io/itemimages/icon/1053388.png" },
    "Outsized Sailor Coat (White & Red)": { "name": "Outsized Sailor Coat (White & Red)", "imageUrl": "https://api-static.msu.io/itemimages/icon/1053389.png" },
    "Oz's Best Friend": { "name": "Oz's Best Friend", "imageUrl": "https://api-static.msu.io/itemimages/icon/3010869.png" },
    "Pale Student Teacher's Lecture": { "name": "Pale Student Teacher's Lecture", "imageUrl": "https://api-static.msu.io/itemimages/icon/3015117.png" },
    "Panda Teddy Hairband": { "name": "Panda Teddy Hairband", "imageUrl": "https://api-static.msu.io/itemimages/icon/1006376.png" },
    "Panda Teddy Outfit": { "name": "Panda Teddy Outfit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1054079.png" },
    "Paper Boat Hat": { "name": "Paper Boat Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1002523.png" },
    "Papulatus Clock Chair": { "name": "Papulatus Clock Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3016206.png" },
    "Papulatus Mark": { "name": "Papulatus Mark", "imageUrl": "https://api-static.msu.io/itemimages/icon/1022277.png" },
    "Party Quest Blue Damage Skin": { "name": "Party Quest Blue Damage Skin", "imageUrl": "https://api-static.msu.io/itemimages/icon/3135155.png" },
    "Party Quest Damage Skin": { "name": "Party Quest Damage Skin", "imageUrl": "https://api-static.msu.io/itemimages/icon/3135154.png" },
    "Pepe Balloon": { "name": "Pepe Balloon", "imageUrl": "https://api-static.msu.io/itemimages/icon/1102141.png" },
    "Pepe Dungarees": { "name": "Pepe Dungarees", "imageUrl": "https://api-static.msu.io/itemimages/icon/1053503.png" },
    "Pepe Sleeping Bag Chair": { "name": "Pepe Sleeping Bag Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3018018.png" },
    "Pepe Stylish Cap": { "name": "Pepe Stylish Cap", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005434.png" },
    "Pharaoh Crown": { "name": "Pharaoh Crown", "imageUrl": "https://api-static.msu.io/itemimages/icon/1003008.png" },
    "Pierre Hat": { "name": "Pierre Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1003715.png" },
    "Pig Charm": { "name": "Pig Charm", "imageUrl": "https://api-static.msu.io/itemimages/icon/1162045.png" },
    "Pink Antique Parasol": { "name": "Pink Antique Parasol", "imageUrl": "https://api-static.msu.io/itemimages/icon/1702519.png" },
    "Pink Bean Balloon": { "name": "Pink Bean Balloon", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140049.png" },
    "Pink Bean Chair": { "name": "Pink Bean Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3010307.png" },
    "Pink Bean Dungarees": { "name": "Pink Bean Dungarees", "imageUrl": "https://api-static.msu.io/itemimages/icon/1053499.png" },
    "Pink Bean Stylish Cap": { "name": "Pink Bean Stylish Cap", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005430.png" },
    "Pink Bean Tail": { "name": "Pink Bean Tail", "imageUrl": "https://api-static.msu.io/itemimages/icon/1103234.png" },
    "Fritto Mask": { "name": "Fritto Mask", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005631.png" },
    "Funky School Uniform A": { "name": "Funky School Uniform A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050329.png" },
    "Funky School Uniform B": { "name": "Funky School Uniform B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051399.png" },
    "Galactic Flame Cape": { "name": "Galactic Flame Cape", "imageUrl": "https://api-static.msu.io/itemimages/icon/1102202.png" },
    "Galactic Guardian": { "name": "Galactic Guardian", "imageUrl": "https://api-static.msu.io/itemimages/icon/1006379.png" },
    "Odette Ballet Slippers": { "name": "Odette Ballet Slippers", "imageUrl": "https://api-static.msu.io/itemimages/icon/1072857.png" },
    "Odette Tiara": { "name": "Odette Tiara", "imageUrl": "https://api-static.msu.io/itemimages/icon/1003951.png" },
    "Odette Tutu": { "name": "Odette Tutu", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051374.png" },
    "Odile Ballet Slippers": { "name": "Odile Ballet Slippers", "imageUrl": "https://api-static.msu.io/itemimages/icon/1072858.png" },
    "Odile Tiara": { "name": "Odile Tiara", "imageUrl": "https://api-static.msu.io/itemimages/icon/1003952.png" },
    "Odile Tutu": { "name": "Odile Tutu", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051375.png" },
    "Orange Mushroom Dungarees": { "name": "Orange Mushroom Dungarees", "imageUrl": "https://api-static.msu.io/itemimages/icon/1053501.png" },
    "Orange Mushroom Stylish Cap": { "name": "Orange Mushroom Stylish Cap", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005432.png" },
    "Orchid's Best Friend": { "name": "Orchid's Best Friend", "imageUrl": "https://api-static.msu.io/itemimages/icon/3010874.png" },
    "Outsized Sailor Coat (Black & Ivory)": { "name": "Outsized Sailor Coat (Black & Ivory)", "imageUrl": "https://api-static.msu.io/itemimages/icon/1053386.png" },
    "Candlelight hat": { "name": "Candlelight hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1002569.png" },
    "Galactic Legend A": { "name": "Galactic Legend A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1702212.png" },
    Gargoyle,
    "Gelimer Label Ring": { "name": "Gelimer Label Ring", "imageUrl": "https://api-static.msu.io/itemimages/icon/1115533.png" },
    "Gentle Dylan": { "name": "Gentle Dylan", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050343.png" },
    "Gentleman's Mustache": { "name": "Gentleman's Mustache", "imageUrl": "https://api-static.msu.io/itemimages/icon/1012024.png" },
    "Ghost Groom Shoes": { "name": "Ghost Groom Shoes", "imageUrl": "https://api-static.msu.io/itemimages/icon/1070172.png" },
    "Ghost Groom Tuxedo": { "name": "Ghost Groom Tuxedo", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050724.png" },
    "Ghost Groom Wedding Fedora": { "name": "Ghost Groom Wedding Fedora", "imageUrl": "https://api-static.msu.io/itemimages/icon/1000131.png" },
    "Ghost Suit": { "name": "Ghost Suit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051076.png" },
    "Giant Bullets": { "name": "Giant Bullets", "imageUrl": "https://api-static.msu.io/itemimages/icon/3153006.png" },
    "Giant Pop with a Swirl": { "name": "Giant Pop with a Swirl", "imageUrl": "https://api-static.msu.io/itemimages/icon/1702182.png" },
    "Giant Rooster": { "name": "Giant Rooster", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140063.png" },
    "Gladiator Armor": { "name": "Gladiator Armor", "imageUrl": "https://api-static.msu.io/itemimages/icon/1053705.png" },
    "Gladiator Cape": { "name": "Gladiator Cape", "imageUrl": "https://api-static.msu.io/itemimages/icon/1102923.png" },
    "Gladiator Helmet": { "name": "Gladiator Helmet", "imageUrl": "https://api-static.msu.io/itemimages/icon/1004747.png" },
    "Glamor Hair": { "name": "Glamor Hair", "imageUrl": "https://api-static.msu.io/itemimages/icon/1791289.png" },
    "Glaze Capsule": { "name": "Glaze Capsule", "imageUrl": "https://api-static.msu.io/itemimages/icon/3153008.png" },
    "Glory Guard Cape": { "name": "Glory Guard Cape", "imageUrl": "https://api-static.msu.io/itemimages/icon/1103209.png" },
    "Glory Guard Ceremonial Sword": { "name": "Glory Guard Ceremonial Sword", "imageUrl": "https://api-static.msu.io/itemimages/icon/1702942.png" },
    "Glory Guard Hat": { "name": "Glory Guard Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005392.png" },
    "Glory Guard Mount": { "name": "Glory Guard Mount", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140254.png" },
    "Glory Guard Uniform": { "name": "Glory Guard Uniform", "imageUrl": "https://api-static.msu.io/itemimages/icon/1053463.png" },
    Goatee,
    "Goblin Fire": { "name": "Goblin Fire", "imageUrl": "https://api-static.msu.io/itemimages/icon/1702423.png" },
    "Gold Maple Leaf Emblem": { "name": "Gold Maple Leaf Emblem", "imageUrl": "https://api-static.msu.io/itemimages/icon/1190301.png" },
    "Golden Armor": { "name": "Golden Armor", "imageUrl": "https://api-static.msu.io/itemimages/icon/1052084.png" },
    "Golden Bell Dress": { "name": "Golden Bell Dress", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051350.png" },
    "Golden Bell Outfit": { "name": "Golden Bell Outfit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050284.png" },
    "Golden Bell Shoes": { "name": "Golden Bell Shoes", "imageUrl": "https://api-static.msu.io/itemimages/icon/1072821.png" },
    "Golden Clover Belt": { "name": "Golden Clover Belt", "imageUrl": "https://api-static.msu.io/itemimages/icon/1132272.png" },
    "Golden Fox Ears": { "name": "Golden Fox Ears", "imageUrl": "https://api-static.msu.io/itemimages/icon/1002842.png" },
    "Golden Fox Tail": { "name": "Golden Fox Tail", "imageUrl": "https://api-static.msu.io/itemimages/icon/1102187.png" },
    "Golden Honey Pot": { "name": "Golden Honey Pot", "imageUrl": "https://api-static.msu.io/itemimages/icon/1703416.png" },
    "Golden Pickaxe": { "name": "Golden Pickaxe", "imageUrl": "https://api-static.msu.io/itemimages/icon/1703291.png" },
    "Golden Shoes": { "name": "Golden Shoes", "imageUrl": "https://api-static.msu.io/itemimages/icon/1072280.png" },
    "Golden Trench Helmet": { "name": "Golden Trench Helmet", "imageUrl": "https://api-static.msu.io/itemimages/icon/1002599.png" },
    "Gothic Boots": { "name": "Gothic Boots", "imageUrl": "https://api-static.msu.io/itemimages/icon/1071021.png" },
    "Gothic Headband": { "name": "Gothic Headband", "imageUrl": "https://api-static.msu.io/itemimages/icon/1001049.png" },
    "Gothic Mini Hat": { "name": "Gothic Mini Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1001048.png" },
    "Gothic Overall": { "name": "Gothic Overall", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051163.png" },
    "Grand Master Boots": { "name": "Grand Master Boots", "imageUrl": "https://api-static.msu.io/itemimages/icon/1073430.png" },
    "Grand Master Hat": { "name": "Grand Master Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005504.png" },
    "Grand Master Sword": { "name": "Grand Master Sword", "imageUrl": "https://api-static.msu.io/itemimages/icon/1702983.png" },
    "Grand Master Uniform": { "name": "Grand Master Uniform", "imageUrl": "https://api-static.msu.io/itemimages/icon/1053545.png" },
    "Green Suspenders": { "name": "Green Suspenders", "imageUrl": "https://api-static.msu.io/itemimages/icon/1042127.png" },
    "Happy Pierre Chair": { "name": "Happy Pierre Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3010513.png" },
    "Harp Seal": { "name": "Harp Seal", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140227.png" },
    "Harp Seal Doll Gloves": { "name": "Harp Seal Doll Gloves", "imageUrl": "https://api-static.msu.io/itemimages/icon/1082493.png" },
    "Harp Seal Doll Outfit": { "name": "Harp Seal Doll Outfit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1052587.png" },
    "Harp Seal Mask": { "name": "Harp Seal Mask", "imageUrl": "https://api-static.msu.io/itemimages/icon/1003776.png" },
    "Hawaiian Sunhat": { "name": "Hawaiian Sunhat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1003920.png" },
    "Hawkeye's Best Friend": { "name": "Hawkeye's Best Friend", "imageUrl": "https://api-static.msu.io/itemimages/icon/3010872.png" },
    "Harp Seal Hat": { "name": "Harp Seal Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1802365.png" },
    "Natural School Uniform B": { "name": "Natural School Uniform B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051396.png" },
    "Neckerchief Fascinator (Ivory)": { "name": "Neckerchief Fascinator (Ivory)", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005287.png" },
    "Neckerchief Fascinator (Navy)": { "name": "Neckerchief Fascinator (Navy)", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005284.png" },
    "Neckerchief Fascinator (Purple)": { "name": "Neckerchief Fascinator (Purple)", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005285.png" },
    "Neckerchief Fascinator (Red)": { "name": "Neckerchief Fascinator (Red)", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005286.png" },
    "Neinheart's Best Friend": { "name": "Neinheart's Best Friend", "imageUrl": "https://api-static.msu.io/itemimages/icon/3010868.png" },
    "Neo Castle Accessory": { "name": "Neo Castle Accessory", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005700.png" },
    "Neo Castle Dress": { "name": "Neo Castle Dress", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051645.png" },
    "Neo Castle Shoes": { "name": "Neo Castle Shoes", "imageUrl": "https://api-static.msu.io/itemimages/icon/1073507.png" },
    "Neo Castle Suit": { "name": "Neo Castle Suit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050573.png" },
    "Neon Green Boots": { "name": "Neon Green Boots", "imageUrl": "https://api-static.msu.io/itemimages/icon/1073878.png" },
    "Neophyte Belt": { "name": "Neophyte Belt", "imageUrl": "https://api-static.msu.io/itemimages/icon/1132324.png" },
    "Neophyte Cloak": { "name": "Neophyte Cloak", "imageUrl": "https://api-static.msu.io/itemimages/icon/1103691.png" },
    "Neophyte Earrings": { "name": "Neophyte Earrings", "imageUrl": "https://api-static.msu.io/itemimages/icon/1032339.png" },
    "Neophyte Eye Accessory": { "name": "Neophyte Eye Accessory", "imageUrl": "https://api-static.msu.io/itemimages/icon/1022334.png" },
    "Neophyte Mark": { "name": "Neophyte Mark", "imageUrl": "https://api-static.msu.io/itemimages/icon/1012825.png" },
    "Neophyte Pendant": { "name": "Neophyte Pendant", "imageUrl": "https://api-static.msu.io/itemimages/icon/1122446.png" },
    "Neophyte Ring": { "name": "Neophyte Ring", "imageUrl": "https://api-static.msu.io/itemimages/icon/1113334.png" },
    "Neophyte Shoulders": { "name": "Neophyte Shoulders", "imageUrl": "https://api-static.msu.io/itemimages/icon/1152223.png" },
    "New Veamoth Wings": { "name": "New Veamoth Wings", "imageUrl": "https://api-static.msu.io/itemimages/icon/1102308.png" },
    "New Weird Pink Bean Face Accessory": { "name": "New Weird Pink Bean Face Accessory", "imageUrl": "https://api-static.msu.io/itemimages/icon/1012755.png" },
    "New Weird Slime Face Accessory": { "name": "New Weird Slime Face Accessory", "imageUrl": "https://api-static.msu.io/itemimages/icon/1012756.png" },
    "Newspaper Cape": { "name": "Newspaper Cape", "imageUrl": "https://api-static.msu.io/itemimages/icon/1102076.png" },
    "Night Hat": { "name": "Night Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1000105.png" },
    "Night Magician A": { "name": "Night Magician A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050532.png" },
    "Night Magician B": { "name": "Night Magician B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051603.png" },
    "Night Magician Chat Ring": { "name": "Night Magician Chat Ring", "imageUrl": "https://api-static.msu.io/itemimages/icon/1115088.png" },
    "Hekaton's Rest": { "name": "Hekaton's Rest", "imageUrl": "https://api-static.msu.io/itemimages/icon/3010678.png" },
    Hellhound,
    "Hilla Snowfield Mount": { "name": "Hilla Snowfield Mount", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140083.png" },
    "Hilla's Style Maker": { "name": "Hilla's Style Maker", "imageUrl": "https://api-static.msu.io/itemimages/icon/3010404.png" },
    "Honey Bee Chat Ring": { "name": "Honey Bee Chat Ring", "imageUrl": "https://api-static.msu.io/itemimages/icon/1115004.png" },
    "Honey Bee Label Ring": { "name": "Honey Bee Label Ring", "imageUrl": "https://api-static.msu.io/itemimages/icon/1112191.png" },
    "Honeybee Antenna Hairband": { "name": "Honeybee Antenna Hairband", "imageUrl": "https://api-static.msu.io/itemimages/icon/1003392.png" },
    "Honeybee Damage Skin": { "name": "Honeybee Damage Skin", "imageUrl": "https://api-static.msu.io/itemimages/icon/3135093.png" },
    "Honeybee Suit": { "name": "Honeybee Suit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1052417.png" },
    "Honeybee Wings": { "name": "Honeybee Wings", "imageUrl": "https://api-static.msu.io/itemimages/icon/1102338.png" },
    "Horntail Necklace": { "name": "Horntail Necklace", "imageUrl": "https://api-static.msu.io/itemimages/icon/1122000.png" },
    "Hoya Hat": { "name": "Hoya Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1004558.png" },
    "Hoya Roar": { "name": "Hoya Roar", "imageUrl": "https://api-static.msu.io/itemimages/icon/1702599.png" },
    "Hoya Shorts": { "name": "Hoya Shorts", "imageUrl": "https://api-static.msu.io/itemimages/icon/1062232.png" },
    "Hoya T-shirt": { "name": "Hoya T-shirt", "imageUrl": "https://api-static.msu.io/itemimages/icon/1042351.png" },
    "Hwabi Throwing Stars": { "name": "Hwabi Throwing Stars", "imageUrl": "https://api-static.msu.io/itemimages/icon/3152007.png" },
    Icicles,
    "Ifia's Earrings": { "name": "Ifia's Earrings", "imageUrl": "https://api-static.msu.io/itemimages/icon/1032227.png" },
    "Ifia's Necklace": { "name": "Ifia's Necklace", "imageUrl": "https://api-static.msu.io/itemimages/icon/1122274.png" },
    "Ifia's Ring": { "name": "Ifia's Ring", "imageUrl": "https://api-static.msu.io/itemimages/icon/1113089.png" },
    "Ignis Gloves": { "name": "Ignis Gloves", "imageUrl": "https://api-static.msu.io/itemimages/icon/1082797.png" },
    "Ignis Hat": { "name": "Ignis Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1006350.png" },
    "Ignis Suit": { "name": "Ignis Suit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1054063.png" },
    "Ignis Wings": { "name": "Ignis Wings", "imageUrl": "https://api-static.msu.io/itemimages/icon/1103636.png" },
    "Ilbi Throwing Stars": { "name": "Ilbi Throwing Stars", "imageUrl": "https://api-static.msu.io/itemimages/icon/3152006.png" },
    "Inferno Wolf Mount": { "name": "Inferno Wolf Mount", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140283.png" },
    "Infinite Throwing Knives": { "name": "Infinite Throwing Knives", "imageUrl": "https://api-static.msu.io/itemimages/icon/3152012.png" },
    "Irena's Best Friend": { "name": "Irena's Best Friend", "imageUrl": "https://api-static.msu.io/itemimages/icon/3010870.png" },
    "Jadeite Charm": { "name": "Jadeite Charm", "imageUrl": "https://api-static.msu.io/itemimages/icon/1162046.png" },
    "Jailbird Cap": { "name": "Jailbird Cap", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005167.png" },
    "Jailbird Uniform": { "name": "Jailbird Uniform", "imageUrl": "https://api-static.msu.io/itemimages/icon/1053315.png" },
    "Jailbreak Spoon": { "name": "Jailbreak Spoon", "imageUrl": "https://api-static.msu.io/itemimages/icon/1702838.png" },
    "Jiggly Slime": { "name": "Jiggly Slime", "imageUrl": "https://api-static.msu.io/itemimages/icon/1703156.png" },
    Kaiserion,
    "Kiss Mark": { "name": "Kiss Mark", "imageUrl": "https://api-static.msu.io/itemimages/icon/1012009.png" },
    "Kitty Paint": { "name": "Kitty Paint", "imageUrl": "https://api-static.msu.io/itemimages/icon/1012063.png" },
    "Kritias Damage Skin": { "name": "Kritias Damage Skin", "imageUrl": "https://api-static.msu.io/itemimages/icon/3135001.png" },
    "Kumbi Throwing Stars": { "name": "Kumbi Throwing Stars", "imageUrl": "https://api-static.msu.io/itemimages/icon/3152003.png" },
    "Lady Rosalia": { "name": "Lady Rosalia", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051411.png" },
    "Lalala Ring": { "name": "Lalala Ring", "imageUrl": "https://api-static.msu.io/itemimages/icon/1112900.png" },
    "Large Fork": { "name": "Large Fork", "imageUrl": "https://api-static.msu.io/itemimages/icon/1703309.png" },
    "Noble Ifia's Ring": { "name": "Noble Ifia's Ring", "imageUrl": "https://api-static.msu.io/itemimages/icon/1113282.png" },
    "Lilin's Best Friend": { "name": "Lilin's Best Friend", "imageUrl": "https://api-static.msu.io/itemimages/icon/3015116.png" },
    "Little Darling Beret": { "name": "Little Darling Beret", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005151.png" },
    "Little Darling Outfit A": { "name": "Little Darling Outfit A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050488.png" },
    "Little Darling Outfit B": { "name": "Little Darling Outfit B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051555.png" },
    "Little Darling Shoes A": { "name": "Little Darling Shoes A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1070099.png" },
    "Little Darling Shoes B": { "name": "Little Darling Shoes B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1071116.png" },
    "Little Red Riding Dress": { "name": "Little Red Riding Dress", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051253.png" },
    "Lord Pirate Chair": { "name": "Lord Pirate Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3010114.png" },
    "Lord Pirate Prisoner": { "name": "Lord Pirate Prisoner", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140052.png" },
    "Lord Zakum Throne": { "name": "Lord Zakum Throne", "imageUrl": "https://api-static.msu.io/itemimages/icon/3010455.png" },
    "Lotus's Black Wing Shoes": { "name": "Lotus's Black Wing Shoes", "imageUrl": "https://api-static.msu.io/itemimages/icon/1072783.png" },
    "Hypnotized Look": { "name": "Hypnotized Look", "imageUrl": "https://api-static.msu.io/itemimages/icon/1790099.png" },
    "Lucky Clover": { "name": "Lucky Clover", "imageUrl": "https://api-static.msu.io/itemimages/icon/1703029.png" },
    "Lucky Clover Hat A": { "name": "Lucky Clover Hat A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1000113.png" },
    "Lucky Clover Hat B": { "name": "Lucky Clover Hat B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1001135.png" },
    "Lucky Clover Outfit A": { "name": "Lucky Clover Outfit A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050559.png" },
    "Lucky Clover Outfit B": { "name": "Lucky Clover Outfit B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051631.png" },
    "Ludibrium Chair": { "name": "Ludibrium Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3018790.png" },
    "M-Force Chair": { "name": "M-Force Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3015791.png" },
    "M-Forcer Boots": { "name": "M-Forcer Boots", "imageUrl": "https://api-static.msu.io/itemimages/icon/1072202.png" },
    "M-Forcer Gloves": { "name": "M-Forcer Gloves", "imageUrl": "https://api-static.msu.io/itemimages/icon/1082124.png" },
    "Mad Mage Cape": { "name": "Mad Mage Cape", "imageUrl": "https://api-static.msu.io/itemimages/icon/1103291.png" },
    "Hekaton's Fist": { "name": "Hekaton's Fist", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140066.png" },
    "Heart Kitty Outfit": { "name": "Heart Kitty Outfit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1053992.png" },
    "Military Pop Star": { "name": "Military Pop Star", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050190.png" },
    "Mimic Protocol Style Look": { "name": "Mimic Protocol Style Look", "imageUrl": "https://api-static.msu.io/itemimages/icon/1054144.png" },
    "Mobile Mansion Chat Ring": { "name": "Mobile Mansion Chat Ring", "imageUrl": "https://api-static.msu.io/itemimages/icon/1115055.png" },
    "Mobile Mansion Label Ring": { "name": "Mobile Mansion Label Ring", "imageUrl": "https://api-static.msu.io/itemimages/icon/1115144.png" },
    "Modest School Uniform A": { "name": "Modest School Uniform A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050327.png" },
    "Modest School Uniform B": { "name": "Modest School Uniform B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051397.png" },
    "Mokbi Throwing Stars": { "name": "Mokbi Throwing Stars", "imageUrl": "https://api-static.msu.io/itemimages/icon/3152002.png" },
    "Monkey Charm": { "name": "Monkey Charm", "imageUrl": "https://api-static.msu.io/itemimages/icon/1162041.png" },
    "Monster Park Damage Skin": { "name": "Monster Park Damage Skin", "imageUrl": "https://api-static.msu.io/itemimages/icon/3135156.png" },
    "Moon Bunny Costume": { "name": "Moon Bunny Costume", "imageUrl": "https://api-static.msu.io/itemimages/icon/1052077.png" },
    "Moon Bunny Gloves": { "name": "Moon Bunny Gloves", "imageUrl": "https://api-static.msu.io/itemimages/icon/1082169.png" },
    "Moon Bunny Headgear": { "name": "Moon Bunny Headgear", "imageUrl": "https://api-static.msu.io/itemimages/icon/1002552.png" },
    "Moon Bunny Paws": { "name": "Moon Bunny Paws", "imageUrl": "https://api-static.msu.io/itemimages/icon/1072274.png" },
    "Moonlight Fairy Maillot": { "name": "Moonlight Fairy Maillot", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051637.png" },
    "Moonlight Fairy Shoes": { "name": "Moonlight Fairy Shoes", "imageUrl": "https://api-static.msu.io/itemimages/icon/1073479.png" },
    "Moonlight Fairy Tunic": { "name": "Moonlight Fairy Tunic", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050565.png" },
    "Moonlight Fairy Wings": { "name": "Moonlight Fairy Wings", "imageUrl": "https://api-static.msu.io/itemimages/icon/1103296.png" },
    "Mu Lung Scarecrow Chair": { "name": "Mu Lung Scarecrow Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3015241.png" },
    "Mummy Hat": { "name": "Mummy Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1002525.png" },
    "Mummy Mask": { "name": "Mummy Mask", "imageUrl": "https://api-static.msu.io/itemimages/icon/1012044.png" },
    "Mummy Suit": { "name": "Mummy Suit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1052067.png" },
    "Mush Ado About Nothing Chair": { "name": "Mush Ado About Nothing Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3015613.png" },
    "Mad Mage Hood": { "name": "Mad Mage Hood", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005611.png" },
    "Mad Mage Makeup": { "name": "Mad Mage Makeup", "imageUrl": "https://api-static.msu.io/itemimages/icon/1012725.png" },
    "Mad Mage Shoes": { "name": "Mad Mage Shoes", "imageUrl": "https://api-static.msu.io/itemimages/icon/1073476.png" },
    "Mad Mage Staff": { "name": "Mad Mage Staff", "imageUrl": "https://api-static.msu.io/itemimages/icon/1703033.png" },
    "Mad Mage Suit": { "name": "Mad Mage Suit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1053629.png" },
    "Magic Crest": { "name": "Magic Crest", "imageUrl": "https://api-static.msu.io/itemimages/icon/1702953.png" },
    "Magic Lamp Chair": { "name": "Magic Lamp Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3018447.png" },
    "Magic Unicorn": { "name": "Magic Unicorn", "imageUrl": "https://api-static.msu.io/itemimages/icon/1006565.png" },
    "Magician Hat": { "name": "Magician Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1001128.png" },
    "Magnus Face": { "name": "Magnus Face", "imageUrl": "https://api-static.msu.io/itemimages/icon/1790225.png" },
    "Manji Mask": { "name": "Manji Mask", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005621.png" },
    "Manji Outfit": { "name": "Manji Outfit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050591.png" },
    "Maple Doctor's Scrubs A": { "name": "Maple Doctor's Scrubs A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050215.png" },
    "Maple Doctor's Scrubs B": { "name": "Maple Doctor's Scrubs B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051262.png" },
    "Maple Momentree Crown A": { "name": "Maple Momentree Crown A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1000120.png" },
    "Maple Momentree Crown B": { "name": "Maple Momentree Crown B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1001145.png" },
    "Maple Momentree Robe A": { "name": "Maple Momentree Robe A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050644.png" },
    "Maple Momentree Robe B": { "name": "Maple Momentree Robe B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051717.png" },
    "Maple Momentree Shoes A": { "name": "Maple Momentree Shoes A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1070146.png" },
    "Maple Momentree Shoes B": { "name": "Maple Momentree Shoes B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1071162.png" },
    "Maple Momentree Wings": { "name": "Maple Momentree Wings", "imageUrl": "https://api-static.msu.io/itemimages/icon/1103461.png" },
    "Marron Glace A": { "name": "Marron Glace A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050533.png" },
    "Marron Glace B": { "name": "Marron Glace B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051604.png" },
    "Mechanator Pendant": { "name": "Mechanator Pendant", "imageUrl": "https://api-static.msu.io/itemimages/icon/1122254.png" },
    "Memory Flow": { "name": "Memory Flow", "imageUrl": "https://api-static.msu.io/itemimages/icon/1073810.png" },
    "Meow Candy Chaser": { "name": "Meow Candy Chaser", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051747.png" },
    "Meow Candy Hunter": { "name": "Meow Candy Hunter", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050674.png" },
    "Mercury Jean Skirt": { "name": "Mercury Jean Skirt", "imageUrl": "https://api-static.msu.io/itemimages/icon/1061142.png" },
    "Mercury Leather Jacket A": { "name": "Mercury Leather Jacket A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1040138.png" },
    "Mercury Leather Jacket B": { "name": "Mercury Leather Jacket B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1041139.png" },
    "Mercury Lightning": { "name": "Mercury Lightning", "imageUrl": "https://api-static.msu.io/itemimages/icon/1072328.png" },
    "Mercury Sword": { "name": "Mercury Sword", "imageUrl": "https://api-static.msu.io/itemimages/icon/1702150.png" },
    "Mercury Washed Jeans": { "name": "Mercury Washed Jeans", "imageUrl": "https://api-static.msu.io/itemimages/icon/1060121.png" },
    "Metallic Blue Book <Epode>": { "name": "Metallic Blue Book <Epode>", "imageUrl": "https://api-static.msu.io/itemimages/icon/1352242.png" },
    "Mighty Banana Chat Ring": { "name": "Mighty Banana Chat Ring", "imageUrl": "https://api-static.msu.io/itemimages/icon/1115018.png" },
    "Mighty Banana Label Ring": { "name": "Mighty Banana Label Ring", "imageUrl": "https://api-static.msu.io/itemimages/icon/1115105.png" },
    "Mighty Bullets": { "name": "Mighty Bullets", "imageUrl": "https://api-static.msu.io/itemimages/icon/3153002.png" },
    "Hilla Face": { "name": "Hilla Face", "imageUrl": "https://api-static.msu.io/itemimages/icon/1790291.png" },
    "Mercury Cloak": { "name": "Mercury Cloak", "imageUrl": "https://api-static.msu.io/itemimages/icon/1102149.png" },
    "Mercury Gloves": { "name": "Mercury Gloves", "imageUrl": "https://api-static.msu.io/itemimages/icon/1082225.png" },
    "Black Heaven Amusement Park Ride Chair": { "name": "Black Heaven Amusement Park Ride Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3015350.png" },
    "Mushroom's Song": { "name": "Mushroom's Song", "imageUrl": "https://api-static.msu.io/itemimages/icon/1103360.png" },
    "Mystic Ruby Crown": { "name": "Mystic Ruby Crown", "imageUrl": "https://api-static.msu.io/itemimages/icon/1001156.png" },
    "Native Hog": { "name": "Native Hog", "imageUrl": "https://api-static.msu.io/itemimages/icon/3140026.png" },
    "Damien's Eyepatch": { "name": "Damien's Eyepatch", "imageUrl": "https://api-static.msu.io/itemimages/icon/1022244.png" },
    "Sporty Striped Band": { "name": "Sporty Striped Band", "imageUrl": "https://api-static.msu.io/itemimages/icon/1005422.png" },
    "Outsized Sailor Coat (Navy & White)": { "name": "Outsized Sailor Coat (Navy & White)", "imageUrl": "https://api-static.msu.io/itemimages/icon/1053387.png" },
    "Cheerful School Uniform B": { "name": "Cheerful School Uniform B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051400.png" },
    "Chief Chair": { "name": "Chief Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3010129.png" },
    "Classy School Uniform A": { "name": "Classy School Uniform A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050325.png" },
    "Commander Lotus Mask": { "name": "Commander Lotus Mask", "imageUrl": "https://api-static.msu.io/itemimages/icon/1004140.png" },
    "Confident Luxury School Uniform B": { "name": "Confident Luxury School Uniform B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051403.png" },
    "Friends of the Forest Camping Chair": { "name": "Friends of the Forest Camping Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3010946.png" },
    "Galactic Hero Suit": { "name": "Galactic Hero Suit", "imageUrl": "https://api-static.msu.io/itemimages/icon/1052182.png" },
    "Gelimer Chat Ring": { "name": "Gelimer Chat Ring", "imageUrl": "https://api-static.msu.io/itemimages/icon/1115431.png" },
    "Heart Kitty Fishing Rod": { "name": "Heart Kitty Fishing Rod", "imageUrl": "https://api-static.msu.io/itemimages/icon/1103589.png" },
    "Heroes Damien Label Ring": { "name": "Heroes Damien Label Ring", "imageUrl": "https://api-static.msu.io/itemimages/icon/1115108.png" },
    "Hilla & Magnus Chair": { "name": "Hilla & Magnus Chair", "imageUrl": "https://api-static.msu.io/itemimages/icon/3015118.png" },
    "Prim School Uniform A": { "name": "Prim School Uniform A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050324.png" },
    "Necromancer Magician Gloves": { "name": "Necromancer Magician Gloves", "imageUrl": "https://api-static.msu.io/itemimages/icon/1082594.png" },
    "Meow Candy Shoes": { "name": "Meow Candy Shoes", "imageUrl": "https://api-static.msu.io/itemimages/icon/1073706.png" },
    "Meow Candy Star Tail": { "name": "Meow Candy Star Tail", "imageUrl": "https://api-static.msu.io/itemimages/icon/1103534.png" },
    "Mihile's Best Friend": { "name": "Mihile's Best Friend", "imageUrl": "https://api-static.msu.io/itemimages/icon/3010873.png" },
    "Natural School Uniform A": { "name": "Natural School Uniform A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050326.png" },
    "Night Magician Label Ring": { "name": "Night Magician Label Ring", "imageUrl": "https://api-static.msu.io/itemimages/icon/1115177.png" },
    "Nostalgic Luxury School Uniform A": { "name": "Nostalgic Luxury School Uniform A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050332.png" },
    "Nostalgic Luxury School Uniform B": { "name": "Nostalgic Luxury School Uniform B", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051402.png" },
    "Pink Dude School Uniform": { "name": "Pink Dude School Uniform", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050328.png" },
    "Premium Floral Print School Uniform A": { "name": "Premium Floral Print School Uniform A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050334.png" },
    "Starlight Guide": { "name": "Starlight Guide", "imageUrl": "https://api-static.msu.io/itemimages/icon/1051796.png" },
    "Bold Luxury School Uniform A": { "name": "Bold Luxury School Uniform A", "imageUrl": "https://api-static.msu.io/itemimages/icon/1050331.png" },
    "Chicky Pile": { "name": "Chicky Pile", "imageUrl": "https://api-static.msu.io/itemimages/icon/1102574.png" },
    "Francis' Best Friend": { "name": "Francis' Best Friend", "imageUrl": "https://api-static.msu.io/itemimages/icon/3010875.png" },
    "Galactic Fragment": { "name": "Galactic Fragment", "imageUrl": "https://api-static.msu.io/itemimages/icon/1103651.png" },
    "Heart Kitty Hat": { "name": "Heart Kitty Hat", "imageUrl": "https://api-static.msu.io/itemimages/icon/1006252.png" },
    "Heart Kitty Plate": { "name": "Heart Kitty Plate", "imageUrl": "https://api-static.msu.io/itemimages/icon/1703360.png" },
    "Heroes Damien Chat Ring": { "name": "Heroes Damien Chat Ring", "imageUrl": "https://api-static.msu.io/itemimages/icon/1115019.png" },
    "Mad Mage Gloves": { "name": "Mad Mage Gloves", "imageUrl": "https://api-static.msu.io/itemimages/icon/1082750.png" }
  };
  var on_click = (_, search, item) => search(item());
  var root_2 = /* @__PURE__ */ from_html(`<img/>`);
  var root_4 = /* @__PURE__ */ from_html(`<img/>`);
  var root_5 = /* @__PURE__ */ from_html(`<div class="w-full h-full grid place-items-center"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2c-.5 0-1 .19-1.41.59l-8 8c-.79.78-.79 2.04 0 2.82l8 8c.78.79 2.04.79 2.82 0l8-8c.79-.78.79-2.04 0-2.82l-8-8C13 2.19 12.5 2 12 2m0 4.95c2.7.11 3.87 2.83 2.28 4.86c-.42.5-1.09.83-1.43 1.26c-.35.43-.35.93-.35 1.43H11c0-.85 0-1.56.35-2.06c.33-.5 1-.8 1.42-1.13c1.23-1.13.91-2.72-.77-2.85c-.82 0-1.5.67-1.5 1.51H9c0-1.67 1.35-3.02 3-3.02m-1 8.55h1.5V17H11z"></path></svg></div>`);
  var on_click_1 = (__1, key) => navigator.clipboard.writeText(key());
  var on_click_2 = (__2, saveToCollection, key) => saveToCollection(key());
  var root_1 = /* @__PURE__ */ from_html(`<div><div class="truncate"> </div> <button class="grid place-items-center aspect-square cursor-pointer relative"><!> <span class="absolute right-1 bottom-1 flex gap-1 text-xs"><svg class="hover:text-primary" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path fill="currentColor" d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12z"></path></svg> <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2L9.19 8.62L2 9.24l5.45 4.73L5.82 21z"></path></svg></span></button></div>`);
  var root = /* @__PURE__ */ from_html(`<main data-theme="dark"><button tabindex="0" class="gallery cursor-pointer shrink-0 text-xl">📚</button> <div class="dropdown-content shadow-sm"><div class="px-2 pb-2 grid grid-cols-4 auto-rows-max overflow-y-auto bg-base-100 rounded border border-gray-300 gap-1 relative" style="width: 350px;aspect-ratio: 1/1; font-size: 12px;"><div role="tablist" class="tabs tabs-border tabs-xs text-xs col-span-4"><div class="tab tab-active">图鉴大全</div></div> <label class="floating-label col-span-4 p-2 sticky top-2 bg-base-100"><div class="input input-xs"><input type="search" placeholder="keyword"/> <svg class="h-[1.5em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg></div> <span>keyword</span></label> <!></div></div></main> <!>`, 1);
  function App($$anchor, $$props) {
    push($$props, true);
    async function search({ name }) {
      const pathname = location.pathname;
      if (pathname !== "/marketplace/nft") return;
      const keywordInput = document.querySelector('input[name="keyword"]');
      if (!keywordInput) return;
      keywordInput.focus();
      await tick();
      keywordInput.value = name;
      await tick();
      keywordInput.previousSibling.click();
    }
    let itemData = proxy(JSON.parse(localStorage.getItem("$$itemData$$") || "{}"));
    let collectionData = /* @__PURE__ */ state(proxy(JSON.parse(localStorage.getItem("$$collection$$") || "[]")));
    let keyword = /* @__PURE__ */ state(void 0);
    function handleHover(e) {
      var _a2, _b, _c, _d, _e, _f, _g;
      const pathname = location.pathname;
      if (pathname !== "/marketplace/nft") return;
      const data = (_g = (_f = (_e = (_d = (_c = (_b = (_a2 = getReactProps(e.detail.target)) == null ? void 0 : _a2.children) == null ? void 0 : _b.props) == null ? void 0 : _c.children) == null ? void 0 : _d[0]) == null ? void 0 : _e[0]) == null ? void 0 : _f.props) == null ? void 0 : _g.itemData;
      if (!data || itemData[data.name]) return;
      itemData[data.name] = { name: data.name, imageUrl: data.imageUrl };
      localStorage.setItem("$$itemData$$", JSON.stringify(itemData));
    }
    function saveToCollection(name) {
      const pathname = location.pathname;
      if (pathname !== "/marketplace/nft") return;
      const collectionSet = new Set(get(collectionData));
      if (get(collectionData).find((i) => i === name)) {
        collectionSet.delete(name);
      } else {
        collectionSet.add(name);
      }
      set(collectionData, [...collectionSet], true);
      localStorage.setItem("$$collection$$", JSON.stringify(get(collectionData)));
    }
    var fragment = root();
    action($document.body, ($$node, $$action_arg) => hover == null ? void 0 : hover($$node, $$action_arg), () => ({ target: ".item-list article" }));
    event("HoverEnter", $document.body, handleHover);
    var main = first_child(fragment);
    var div = sibling(child(main), 2);
    var div_1 = child(div);
    var label = sibling(child(div_1), 2);
    var div_2 = child(label);
    var input = child(div_2);
    var node = sibling(label, 2);
    each(node, 17, () => map, index, ($$anchor2, $$item) => {
      var $$array = /* @__PURE__ */ user_derived(() => to_array(get($$item), 2));
      let key = () => get($$array)[0];
      let item = () => get($$array)[1];
      var div_3 = root_1();
      var div_4 = child(div_3);
      var text = child(div_4);
      var button = sibling(div_4, 2);
      button.__click = [on_click, search, item];
      var node_1 = child(button);
      {
        var consequent = ($$anchor3) => {
          var img = root_2();
          template_effect(() => {
            set_attribute(img, "src", itemData[key()].imageUrl || itemData[key()]);
            set_attribute(img, "alt", key());
          });
          append($$anchor3, img);
        };
        var alternate = ($$anchor3, $$elseif) => {
          {
            var consequent_1 = ($$anchor4) => {
              var img_1 = root_4();
              template_effect(() => {
                set_attribute(img_1, "src", galleryData[key()].imageUrl);
                set_attribute(img_1, "alt", key());
              });
              append($$anchor4, img_1);
            };
            var alternate_1 = ($$anchor4) => {
              var div_5 = root_5();
              append($$anchor4, div_5);
            };
            if_block(
              $$anchor3,
              ($$render) => {
                if (galleryData[key()]) $$render(consequent_1);
                else $$render(alternate_1, false);
              },
              $$elseif
            );
          }
        };
        if_block(node_1, ($$render) => {
          if (itemData[key()]) $$render(consequent);
          else $$render(alternate, false);
        });
      }
      var span = sibling(node_1, 2);
      var svg = child(span);
      svg.__click = [on_click_1, key];
      var svg_1 = sibling(svg, 2);
      svg_1.__click = [on_click_2, saveToCollection, key];
      template_effect(
        ($0, $1, $2) => {
          set_class(div_3, 1, `gallery-item !border rounded flex flex-col text-center ${$0 ?? ""} ${$1 ?? ""}`);
          set_attribute(div_3, "data-tip", key());
          set_text(text, key());
          set_class(svg_1, 0, `hover:text-primary ${$2 ?? ""}`);
        },
        [
          () => get(keyword) && !key().toLowerCase().includes(get(keyword).toLowerCase()) ? "hidden" : "",
          () => get(collectionData).includes(key()) ? "border-primary/50" : "",
          () => get(collectionData).includes(key()) ? "text-primary" : ""
        ]
      );
      append($$anchor2, div_3);
    });
    action(div_1, ($$node, $$action_arg) => hover == null ? void 0 : hover($$node, $$action_arg), () => ({ target: ".gallery-item" }));
    var node_2 = sibling(main, 2);
    Tooltip(node_2);
    template_effect(() => set_class(main, 1, `dropdown dropdown-hover dropdown-left flex items-center h-full ml-auto mr-0 bg-transparent ${false}`));
    bind_value(input, () => get(keyword), ($$value) => set(keyword, $$value));
    transition(3, div_1, () => fade);
    append($$anchor, fragment);
    pop();
  }
  delegate(["click"]);
  let app;
  waitUntil(() => {
    const target = document.querySelector(".item-count");
    const isMarketplace = location.pathname.startsWith("/marketplace/nft");
    if (target && isMarketplace) {
      if (!app) {
        app = mount(App, { target });
      }
    } else {
      app && unmount(App);
      app = null;
    }
  });

})();