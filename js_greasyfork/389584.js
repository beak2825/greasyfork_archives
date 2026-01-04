// ==UserScript==
// @name         s1麻将脸r板显示脚本
// @namespace    Majfacesinreddit
// @version      0.3
// @description  在r板显示麻将脸
// @author       huayu3rd
// @match        https://www.reddit.com/r/s1bbs/**
// @downloadURL https://update.greasyfork.org/scripts/389584/s1%E9%BA%BB%E5%B0%86%E8%84%B8r%E6%9D%BF%E6%98%BE%E7%A4%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/389584/s1%E9%BA%BB%E5%B0%86%E8%84%B8r%E6%9D%BF%E6%98%BE%E7%A4%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

//参考了https://greasyfork.org/scripts/372459
(function() {
function replace(search,replacement){
	var xpathResult = document.evaluate(
		"//*/text()",
		document,
		null,
		XPathResult.ORDERED_NODE_ITERATOR_TYPE,
		null
	);
	var results = [];
	// We store the result in an array because if the DOM mutates
	// during iteration, the iteration becomes invalid.
	while(res = xpathResult.iterateNext()) {
		results.push(res);
	}
	results.forEach(function(res){
		res.textContent = res.textContent.replace(search,replacement);
	})
}
    //上面那一段我也不懂什么意思，作用应该就是让replace仅限于可见文本。代码来源：http://bit.ly/2PR7uDG

window.onload = function () {
	var face = new RegExp("{{f:","g")
	var carton = new RegExp("{{c:","g")
	var animal = new RegExp("{{a:","g")
	var device = new RegExp("{{d:","g")
	var goose = new RegExp("{{g:","g")
	var bundam = new RegExp("{{b:","g")
    var jiewei = new RegExp("}}","g")
	var faceurl = "<img src =\"http://majface.eu5.net/smiley/face/";
	var cartonurl = "<img src =\"http://majface.eu5.net/smiley/carton/";
	var animalurl = "<img src =\"http://majface.eu5.net/smiley/animal/";
	var deviceurl = "<img src =\"http://majface.eu5.net/smiley/device/";
	var gooseurl = "<img src =\"http://majface.eu5.net/smiley/goose/";
	var bundamurl = "<img src =\"http://majface.eu5.net/smiley/bundam/";
    var jieweiurl = "\">";
	document.body.innerHTML = document.body.innerHTML.replace(face, faceurl);
	document.body.innerHTML = document.body.innerHTML.replace(carton, cartonurl);
	document.body.innerHTML = document.body.innerHTML.replace(animal, animalurl);
	document.body.innerHTML = document.body.innerHTML.replace(device, deviceurl);
	document.body.innerHTML = document.body.innerHTML.replace(goose, gooseurl);
	document.body.innerHTML = document.body.innerHTML.replace(bundam, bundamurl);
    document.body.innerHTML = document.body.innerHTML.replace(jiewei, jieweiurl);
}
})();