// ==UserScript==
// @name          bgm角色排序辅助
// @namespace    chitanda
// @version      0.1
// @description  自动给角色关联页面的角色添加递增排序序号，方便调整中间某几个特定角色排序
// @author       chitanda
// @match        https://bgm.tv/subject/*/add_related/character
// @match        https://bangumi.tv/subject/*/add_related/character
// @match        https://chii.in/subject/*/add_related/character
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/407811/bgm%E8%A7%92%E8%89%B2%E6%8E%92%E5%BA%8F%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/407811/bgm%E8%A7%92%E8%89%B2%E6%8E%92%E5%BA%8F%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

$('#modifyOrder').on('click',function(){
	for(let i=1;i<4;i++){
		let charaRoles=$(`#crtRelateSubjects option[value="${i}"]:selected`);
		charaRoles.map(k=>{
			charaRoles.eq(k).parent('select').next('input').prop('value',k)
		})
	}
})


})();