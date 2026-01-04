// ==UserScript==
// @name         Kick nicknames hide
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  Hides nicknames on kick.com
// @author       SUSUSUSUYAYA
// @match        https://kick.com/*
// @grant        none
// @license      
// @downloadURL https://update.greasyfork.org/scripts/542642/Kick%20nicknames%20hide.user.js
// @updateURL https://update.greasyfork.org/scripts/542642/Kick%20nicknames%20hide.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideElement(selector) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `${selector} { display: none !important; }`;
        document.head.appendChild(style);
    }

    // Hide Element
	//Chat
    hideElement('div.group.relative.px-2.lg\\:px-3 > div.betterhover\\:group-hover\\:bg-shade-lower.w-full.min-w-0.shrink-0.break-words.rounded-lg.px-2.py-1:first-child > div.inline-flex.min-w-0.flex-nowrap.items-baseline.rounded.betterhover\\:hover\\:bg-\\[\\#474f54\\].cursor-pointer.transition-colors.duration-150.ease-out.active\\:bg-\\[\\#474f54AA\\]:nth-child(2) > button.inline.font-bold:last-child');
    hideElement('div.group.relative.px-2.lg\\:px-3 > div.betterhover\\:group-hover\\:bg-shade-lower.flex.w-full.min-w-0.shrink-0.flex-col.break-words.rounded-lg.px-2.py-\\[4px\\]:first-child > div.w-full.min-w-0.shrink-0.truncate.text-xs.font-medium.text-white\\/40:first-child > span.ml-1:last-child > button.inline.text-white\\/40.betterhover\\:hover\\:text-white\\/100.cursor-pointer:first-child');
    hideElement('div.group.relative.px-2.lg\\:px-3 > div.betterhover\\:group-hover\\:bg-shade-lower.flex.w-full.min-w-0.shrink-0.flex-col.break-words.rounded-lg.px-2.py-\\[4px\\]:first-child > div.w-full.min-w-0.shrink-0.break-words:last-child > div.inline-flex.min-w-0.flex-nowrap.items-baseline.rounded.betterhover\\:hover\\:bg-\\[\\#474f54\\].cursor-pointer.transition-colors.duration-150.ease-out.active\\:bg-\\[\\#474f54AA\\]:nth-child(2) > button.inline.font-bold');

	//Pinned
    hideElement('div#channel-chatroom > div.bg-surface-lower.relative.flex.flex-1.flex-col:last-child > div.bg-surface-lower.relative.shrink.grow.overflow-hidden:nth-child(2) > div.absolute.w-full.empty\\:hidden:first-child > div.relative.flex.h-fit.w-full.flex-col.gap-1\\.5.transition-\\[padding-left\\,padding-right\\].empty\\:hidden > div.z-absolute.w-full > div.bg-shade-lower.border-surface-tint.w-full.flex-col.gap-2.rounded.border-2.border-solid.pb-1\\.5.pl-\\[9px\\].pr-\\[3px\\].pt-\\[3px\\] > div.flex.items-center.justify-between:first-child > div.text-neutral.inline-flex.flex-wrap.items-center.gap-1.text-xs.font-semibold.leading-\\[1\\.125rem\\]:first-child > div.inline-flex.min-w-0.flex-nowrap.items-baseline.rounded.betterhover\\:hover\\:bg-\\[\\#474f54\\].cursor-pointer.transition-colors.duration-150.ease-out.active\\:bg-\\[\\#474f54AA\\]:last-child > button.inline.font-bold:last-child');
	hideElement('div#channel-chatroom > div.bg-surface-lower.relative.flex.flex-1.flex-col:last-child > div.bg-surface-lower.relative.shrink.grow.overflow-hidden:first-child > div.absolute.w-full.empty\:hidden:first-child > div.relative.flex.h-fit.w-full.flex-col.gap-1\.5.transition-\[padding-left\,padding-right\].empty\:hidden > div.z-absolute.w-full > div.bg-shade-lower.border-surface-tint.w-full.flex-col.gap-2.rounded.border-2.border-solid.pb-1\.5.pl-\[9px\].pr-\[3px\].pt-\[3px\] > div.flex.items-center.justify-between:first-child > div.text-neutral.inline-flex.flex-wrap.items-center.gap-1.text-xs.font-semibold.leading-\[1\.125rem\]:first-child > div.inline-flex.min-w-0.flex-nowrap.items-baseline.rounded.betterhover\:hover\:bg-\[\#474f54\].cursor-pointer.transition-colors.duration-150.ease-out.active\:bg-\[\#474f54AA\]:last-child > button.inline.font-bold');
	hideElement('div#channel-chatroom > div.bg-surface-lower.relative.flex.flex-1.flex-col:last-child > div.bg-surface-lower.relative.shrink.grow.overflow-hidden:first-child > div.absolute.w-full.empty\:hidden:first-child > div.relative.flex.h-fit.w-full.flex-col.gap-1\.5.transition-\[padding-left\,padding-right\].empty\:hidden > div.z-absolute.w-full > div.bg-shade-lower.border-surface-tint.w-full.flex-col.gap-2.rounded.border-2.border-solid.pb-1\.5.pl-\[9px\].pr-\[3px\].pt-\[3px\] > div.flex.items-center.justify-between:first-child > div.text-neutral.inline-flex.flex-wrap.items-center.gap-1.text-xs.font-semibold.leading-\[1\.125rem\]:first-child > div.inline-flex.min-w-0.flex-nowrap.items-baseline.rounded.betterhover\:hover\:bg-\[\#474f54\].cursor-pointer.transition-colors.duration-150.ease-out.active\:bg-\[\#474f54AA\]:last-child > button.inline.font-bold:last-child');

	//Point
	hideElement('div#chatroom-messages > div.no-scrollbar.relative > div.absolute.inset-x-0.top-0:nth-child(15) > div.px-\[1px\] > div.bg-shade-base.relative.box-border.flex.flex-row.gap-4.border-l-4.p-4 > div.flex.flex-col.gap-2:last-child > div.space-y-0\.5.text-white:first-child > button.inline.font-bold.text-white:first-child');
	hideElement('div#chatroom-messages > div.no-scrollbar.relative > div.absolute.inset-x-0.top-0:nth-child(16) > div.px-\[1px\] > div.bg-shade-base.relative.box-border.flex.flex-row.gap-4.border-l-4.p-4 > div.flex.flex-col.gap-2:last-child > div.space-y-0\.5.text-white:first-child > button.inline.font-bold.text-white:first-child');
	hideElement('div#chatroom-messages > div.no-scrollbar.relative > div.absolute.inset-x-0.top-0:nth-child(21) > div.px-\[1px\] > div.bg-shade-base.relative.box-border.flex.flex-row.gap-4.border-l-4.p-4 > div.flex.flex-col.gap-2:last-child > div.space-y-0\.5.text-white:first-child > button.inline.font-bold.text-white:first-child');

	//Hosting Chat
	hideElement('div#chatroom-messages > div.no-scrollbar.relative > div.absolute.inset-x-0.top-0:nth-child(16) > div.relative.px-2.lg\:px-3 > div.bg-shade-lower.w-full.min-w-0.shrink-0.break-words.rounded.px-2.py-\[4px\] > span.text-text-secondary:last-child > span.cursor-pointer.font-bold:first-child');
	hideElement('div#chatroom-messages > div.no-scrollbar.relative > div.absolute.inset-x-0.top-0:nth-child(18) > div.relative.px-2.lg\:px-3 > div.bg-shade-lower.w-full.min-w-0.shrink-0.break-words.rounded.px-2.py-\[4px\] > span.text-text-secondary:last-child > span.cursor-pointer.font-bold:first-child');
	hideElement('div#chatroom-messages > div.no-scrollbar.relative > div.absolute.inset-x-0.top-0:nth-child(19) > div.relative.px-2.lg\:px-3 > div.bg-shade-lower.w-full.min-w-0.shrink-0.break-words.rounded.px-2.py-\[4px\] > span.text-text-secondary:last-child > span.cursor-pointer.font-bold:first-child');
	hideElement('div#chatroom-messages > div.no-scrollbar.relative > div.absolute.inset-x-0.top-0:nth-child(20) > div.relative.px-2.lg\:px-3 > div.bg-shade-lower.w-full.min-w-0.shrink-0.break-words.rounded.px-2.py-\[4px\] > span.text-text-secondary:last-child > span.cursor-pointer.font-bold:first-child');
	hideElement('div#chatroom-messages > div.no-scrollbar.relative > div.absolute.inset-x-0.top-0:nth-child(21) > div.relative.px-2.lg\:px-3 > div.bg-shade-lower.w-full.min-w-0.shrink-0.break-words.rounded.px-2.py-\[4px\] > span.text-text-secondary:last-child > span.cursor-pointer.font-bold:first-child');
	hideElement('div#chatroom-messages > div.no-scrollbar.relative > div.absolute.inset-x-0.top-0:nth-child(23) > div.relative.px-2.lg\:px-3 > div.bg-shade-lower.w-full.min-w-0.shrink-0.break-words.rounded.px-2.py-\[4px\] > span.text-text-secondary:last-child > span.cursor-pointer.font-bold:first-child');
	hideElement('div#chatroom-messages > div.no-scrollbar.relative > div.absolute.inset-x-0.top-0:nth-child(25) > div.relative.px-2.lg\:px-3 > div.bg-shade-lower.w-full.min-w-0.shrink-0.break-words.rounded.px-2.py-\[4px\] > span.text-text-secondary:last-child > span.cursor-pointer.font-bold:first-child');
	hideElement('div#chatroom-messages > div.no-scrollbar.relative > div.absolute.inset-x-0.top-0:nth-child(26) > div.relative.px-2.lg\:px-3 > div.bg-shade-lower.w-full.min-w-0.shrink-0.break-words.rounded.px-2.py-\[4px\] > span.text-text-secondary:last-child > span.cursor-pointer.font-bold:first-child');
	hideElement('div#chatroom-messages > div.no-scrollbar.relative > div.absolute.inset-x-0.top-0:nth-child(27) > div.relative.px-2.lg\:px-3 > div.bg-shade-lower.w-full.min-w-0.shrink-0.break-words.rounded.px-2.py-\[4px\] > span.text-text-secondary:last-child > span.cursor-pointer.font-bold:first-child');
	

	//Hosting Pinned
	//hideElement('div#channel-chatroom > div.bg-surface-lower.relative.flex.flex-1.flex-col:last-child > div.bg-surface-lower.relative.shrink.grow.overflow-hidden:nth-child(2) > div.absolute.w-full.empty\:hidden:first-child > div.relative.flex.h-fit.w-full.flex-col.gap-1\.5.transition-\[padding-left\,padding-right\].empty\:hidden > div.z-absolute > div.z-absolute.bg-shade-higher.relative.overflow-hidden.rounded > div.grow.overflow-x-hidden:first-child > div.group.flex.overflow-hidden.p-2.\[gap\:var\(--gap\)\].flex-row > div.flex.shrink-0.justify-around.\[gap\:var\(--gap\)\].animate-marquee.flex-row:nth-child(2) > div.flex.flex-row.items-center.gap-2.pb-1.text-sm.text-white > span:last-child > strong:first-child');
	//hideElement('div#channel-chatroom > div.bg-surface-lower.relative.flex.flex-1.flex-col:last-child > div.bg-surface-lower.relative.shrink.grow.overflow-hidden:nth-child(2) > div.absolute.w-full.empty\:hidden:first-child > div.relative.flex.h-fit.w-full.flex-col.gap-1\.5.transition-\[padding-left\,padding-right\].empty\:hidden > div.z-absolute > div.z-absolute.bg-shade-higher.relative.overflow-hidden.rounded > div.grow.overflow-x-hidden:first-child > div.group.flex.overflow-hidden.p-2.\[gap\:var\(--gap\)\].flex-row > div.flex.shrink-0.justify-around.\[gap\:var\(--gap\)\].animate-marquee.flex-row:first-child > div.flex.flex-row.items-center.gap-2.pb-1.text-sm.text-white > span:last-child > strong:first-child');

	//Hosting Alert
	hideElement('div#channel-chatroom > div.bg-surface-lower.relative.flex.flex-1.flex-col:last-child > div.bg-surface-lower.relative.shrink.grow.overflow-hidden:first-child > div.absolute.w-full.empty\:hidden:first-child');
	hideElement('div#channel-chatroom > div.bg-surface-lower.relative.flex.flex-1.flex-col:last-child > div.bg-surface-lower.relative.shrink.grow.overflow-hidden:first-child > div.absolute.w-full.empty\:hidden:first-child > div.relative.flex.h-fit.w-full.flex-col.gap-1\.5.transition-\[padding-left\,padding-right\].empty\:hidden > div.z-absolute > div.z-absolute.bg-shade-higher.relative.overflow-hidden.rounded > div.grow.overflow-x-hidden:first-child > div.group.flex.overflow-hidden.p-2.\[gap\:var\(--gap\)\].flex-row');
	hideElement('div#channel-chatroom > div.bg-surface-lower.relative.flex.flex-1.flex-col:last-child > div.bg-surface-lower.relative.shrink.grow.overflow-hidden:nth-child(2) > div.absolute.w-full.empty\:hidden:first-child > div.relative.flex.h-fit.w-full.flex-col.gap-1\.5.transition-\[padding-left\,padding-right\].empty\:hidden > div.z-absolute > div.z-absolute.bg-shade-higher.relative.overflow-hidden.rounded > div.grow.overflow-x-hidden:first-child > div.group.flex.overflow-hidden.p-2.\[gap\:var\(--gap\)\].flex-row');
	hideElement('div#channel-chatroom > div.bg-surface-lower.relative.flex.flex-1.flex-col:last-child > div.bg-surface-lower.relative.shrink.grow.overflow-hidden:first-child > div.absolute.w-full.empty\:hidden:first-child > div.relative.flex.h-fit.w-full.flex-col.gap-1\.5.transition-\[padding-left\,padding-right\].empty\:hidden > div.z-absolute > div.z-absolute.bg-shade-higher.relative.overflow-hidden.rounded');

})();