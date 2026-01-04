// ==UserScript==
// @name         [DoL] reduce Bailey's payment
// @name:zh      [DoL] 找贝利打折
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  reduce Bailey's payment when you beat Bailey (with high english&math)
// @description:zh 凭借你的英语（和数学）技巧在打败贝利之后讨价还价租金
// @author       patika
// @match        https://eltirosto.github.io/Degrees-of-Lewdity-Chinese-Localization/
// @match        https://*.dolmods.net/
// @exclude      https://dolmods.net/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAGJUExURUdwTM5+RYZPI4BVKoRNH4lQIwAAAHU7H6xoMo1SInlRG4ZMIYNGIa5oNJdaLKtnNK5qNo5VHMJ3QKdkMZ1cMJ5dLqBfLaJgMqRfMJhYKYdQKNGvo6FhM6tkNJRVJ4tGF8B4QZ1cLaliM5FUJ5ZWKPbXxuPBs5NWJ4xSJKhiNJlZKPrp39Krmb2qpKBdLdGom927oo9SI7qHZJpaKbiWiruhmYlRIpVbNtqHTP/u4rVpOqhiMr9xP61jM7FnN7hrO7ttPptbK89+RumaVteFSL90PadbHN2PSKVYHLN1S6ZgMuO7n+3j3P/s34NOI/3p3ZRXKadjNOCPUOOTUsh6Qs59QPCiWsh3O7ZmKrh1Oo9NGMJ2Qp9YJrhqOrBkLtvSz694UpBSIOCUU7CFaNikhKdoOq9ySfHby6OZlHR4f6FvRp9TFpVTIP7o15t7ZqmHbY2YqODEruXEr7K3wC5ejfrNsODi5s+omPTazSJSgb29whxOfvLTxfzk1b+Ma8PEyfPj2+Hm63iNotY+v8UAAAA4dFJOUwD8PQYhfQEEtkkJKhexXbrGEu+WdaXC/rPoRln8+HUL++r0vIX1kPSx4p7s9q7OOP6Y1P1r/av8OyD8ogAAAOZJREFUGBk1wIWWglAUBdCjggzqdHd3N/chpWKP6HR3d3d/ubhcbtjczuIiW4kXeVypQ8oJVFR6YHOXBeelPLPaBUB0SAtLy6FwMBLZaGsAULMYWlldM/374XVlq90Drj4eiJrb5zLbPdrUO1ohMtkfvUjdxGMnB6ra6YLIZO0y9f94fUene0oXIDJZ0xN/Hw9EZ4bWAvj6FZah57d3otvjZh+AEd3I0O+PRbQTqxMA9Kks/fJlvVpzidoq2Jy9k0b6+/N+7LCJL0cO5x2fmX2a4Ad4AQVT01dDw6MoEHoGk0TJ7kbYsoQUMAKQPM6bAAAAAElFTkSuQmCC
// @grant        none
// @license      WTFPL - But I reserve the right to scold you if someone sells this for money without any modification.
// @downloadURL https://update.greasyfork.org/scripts/474867/%5BDoL%5D%20reduce%20Bailey%27s%20payment.user.js
// @updateURL https://update.greasyfork.org/scripts/474867/%5BDoL%5D%20reduce%20Bailey%27s%20payment.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hook_en =
`<<if $enemyhealth lte 0>>
	<<if $rentstage >= 6>>
		<<set $rentstage to 6>>
	<</if>>
	Before leaving, you attempt to discuss the rent.
	<br>
	<<if $english >= 1000 and $math >= 700 and $rentstage >= 3>>
		“Before we part ways, there's a small matter we should discuss: we both know how expensive it is to run the orphanage. Let's crunch some numbers, shall we? First, there's the cost of food..."
		<br>
		<<if $pain > 90>>
			You muster your strength and assume a serious demeanor as you begin the discussion.
		<<elseif $pain > 50>>
			You endure your pain and adopt a serious tone as you begin the discussion.
		<<else>>
			You assume a serious demeanor as you start the discussion.
		<</if>>
		<br><br>
		After a series of meticulous calculations, you clear your throat, "Therefore, in conclusion, your rent far exceeds the expenses you've mentioned."
		<br>
		"Of course, you can try to raise the rent further, but who knows what might happen. Let's not say I didn't warn you."
		<br>
		<<if $rentstage >= 5>>
			<<he>> is taken aback by your complex calculations and tone, agreeing to lower the rent as requested.
		<<else>>
			<<he>> is taken aback by your complex calculations and tone, ultimately agreeing to a slight reduction in the rent.
		<</if>>
		<<set $rentstage -= 1>>
	<<elseif $english >= 700 and $rentstage >= 4>>
		“This exorbitant rent is completely unreasonable!” you assert firmly, “You shouldn't push others too hard.”
		<br>
		<<if $rentstage >= 5>>
			<<he>> is moved by your actions and determination, ultimately agreeing to lower your rent.
		<<else>>
			<<he>> is moved by your actions and resolute attitude, ultimately agreeing to a slight reduction in your rent.
		<</if>>
		<<set $rentstage -= 1>>
	<<elseif $english >= 400 and $rentstage >= 5>>
		“The rent is a bit steep for me right now,” you try to convey your difficulties.
		<br>
		<<he>> hesitates for a moment, then agrees to lower the rent.
		<<set $rentstage -= 1>>
	<<elseif $english >= 200 and $rentstage >= 6>>
		“I hope we can negotiate the issue of the rent,” you protest.
		<br>
		<<he>> agrees and lowers your rent.
		<<set $rentstage -= 1>>
	<<else>>
		You argue your case regarding the rent, but fail to persuade <<him>>.
	<</if>>
	<br><br>
<</if>>

`
    const hook_zh =
          `<<if $enemyhealth lte 0>>
	<<if $rentstage >= 6>>
		<<set $rentstage to 6>>
	<</if>>
	你临走前尝试讨论租金。
	<br>
	<<if $english >= 1000 and $math >= 700 and $rentstage >= 3>>
		“在离开之前，我们需要谈一点小事：我们都知道孤儿院的养育费用如何，让我们来算算帐：首先是饮食...”
		<br>
		<<if $pain > 90>>
			你强打精神，摆出一副严谨的态度开始与对方讨论。
		<<elseif $pain > 50>>
			你忍住自身的疼痛，摆出一副严谨的态度开始与对方讨论。
		<<else>>
			你摆出一副严谨的态度开始与对方讨论。
		<</if>>
		<br><br>
		经过了一串严谨的分析，你清了清嗓子：“因此，综上所述，你的租金远远超过了你所说的开支。”
		<br>
		“当然，你也可以继续尝试增加租金，但说不准会发生什么。勿谓言之不预也。”
		<br>
		<<if $rentstage >= 5>>
			<<he>>被你的复杂计算和语气吓住了，同意了降低租金的请求。
		<<else>>
			<<he>>被你的复杂计算和语气吓住了，同意略微降低租金。
		<</if>>
		<<set $rentstage -= 1>>
	<<elseif $english >= 700 and $rentstage >= 4>>
		“这天价租金完全不合理！”你坚定地说，“你我都知道匹夫一怒的后果。”
		<br>
		<<if $rentstage >= 5>>
			<<he>>被你的行为和坚决所打动，最终同意了降低你的租金。
		<<else>>
			<<he>>被你的行为和坚决态度所打动，最终同意了略微降低你的租金。
		<</if>>
		<<set $rentstage -= 1>>
	<<elseif $english >= 400 and $rentstage >= 5>>
		“租金现在对我来说有点吃力。”你试图表达自己的困难。
		<br>
		<<he>>犹豫了一下，然后同意了降低租金。
		<<set $rentstage -= 1>>
	<<elseif $english >= 200 and $rentstage >= 6>>
		“我希望我们可以商量一下租金的问题。”你抗议道。
		<br>
		<<he>>同意了并降低你的租金。
		<<set $rentstage -= 1>>
	<<else>>
		你就租金问题据理力争，但是并没有打动对方。
	<</if>>
	<br><br>
<</if>>

`

    let datas = document.querySelector('tw-passagedata[name="Bailey Beating Finish"]')
    if(datas === null || datas.childNodes.length !== 1){
        console.error("not found target passage data, maybe:\n\tthe game already updated\n\tthere is a iframe warpped html so we can't access the inner context. (e.g.: https://dolmods.net/vanilla not working and got this error, but https://vanilla.dolmods.net/ works.)")
        return;
    }
    if(!window.StartConfig.version || (window.StartConfig.version!=="0.4.1.7" && !window.StartConfig.version.startsWith("0.4.1.7-"))){
        let warningStr = (window.StartConfig.version.indexOf("chs")>0) ?
            `warning: this patch mod is based on "0.4.1.7" and "0.4.1.7-chs-alpha1.4.0". but your version is: ${window.StartConfig.version}\npatch will try to work, but may got some error.` :
        `警告：这个补丁基于 "0.4.1.7" 和 "0.4.1.7-chs-alpha1.4.0"。但当前版本是：${window.StartConfig.version}。补丁不会关闭，但是可能会产生错误。`
        console.warn(warningStr)
        alert(warningStr)
    }

    let old_passage = datas.childNodes[0].data

    const endCombatIndex = old_passage.lastIndexOf("<<endcombat>>") + "<<endcombat>>".length;

    if (endCombatIndex !== -1) {
        datas.childNodes[0].data =
            old_passage.slice(0, endCombatIndex) +
            ((old_passage.match(/[一-龥]/g) || []).length > 10 ? hook_zh : hook_en) +
            old_passage.slice(endCombatIndex);
    } else {
        console.warn('not found endcombat in "Bailey Beating Finish" passage, do nothing.')
    }
})();