// ==UserScript==
// @name         猫咪去广告
// @namespace    none
// @version      0.8
// @author       HY清风
// @description  去广告。
// @include      *cf.com*
// @include      *ff.com*
// @include      *rr.com*
// @include      *uu.com*
// @include      *aa.com*
// @include      *bb.com*
// @include      *cc.com*
// @include      *dd.com*
// @include      *ee.com*
// @include      *ff.com*
// @include      *gg.com*
// @include      *hh.com*
// @include      *ii.com*
// @include      *jj.com*
// @include      *kk.com*
// @include      *ll.com*
// @include      *mm.com*
// @include      *nn.com*
// @include      *oo.com*
// @include      *pp.com*
// @include      *qq.com*
// @include      *rr.com*
// @include      *ss.com*
// @include      *tt.com*
// @include      *vv.com*
// @include      *ww.com*
// @include      *xx.com*
// @include      *yy.com*
// @include      *zz.com*

// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/373595/%E7%8C%AB%E5%92%AA%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/373595/%E7%8C%AB%E5%92%AA%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
	$("#photo-header-auxdter").remove();
        $("list2").remove();
        $("photo-auxdver-foot").remove();
        $("div.photo-auxdver-foot").remove();
        //$("div.row").remove();
        $("div.close_discor").remove();
        $("div.content-group flickity-gallery").remove();
        $("div.row banner").remove();
        $("banner").remove();
        $("div.content-item content-img bg-default banner").remove(); 
        $("#left_couple").remove();
        $("#right_couple").remove();
        $("#photo--content-title-bottomx--foot").remove();
        $("#photo-header-title-content-text-dallor").remove();
  
})();
