// ==UserScript==
// @name         Sakugabooru Tag Translation
// @namespace    https://sakugabot.pw/
// @version      0.2.2
// @description  Translate tags on sakugabooru.com
// @author       ElnathMojo
// @include      /^https?://(www\.sakugabooru\.com|sakuga\.yshi\.org)/post(/|\?)?.*/
// @downloadURL https://update.greasyfork.org/scripts/373673/Sakugabooru%20Tag%20Translation.user.js
// @updateURL https://update.greasyfork.org/scripts/373673/Sakugabooru%20Tag%20Translation.meta.js
// ==/UserScript==

(function () {
    function setTranslation(tag, translation) {
        if (!translation) return
        let name = tag.querySelector('a:nth-child(2)')
        name.innerHTML = `${name.innerHTML}(${translation})`
    }

    function getTagName(tag) {
        return tag.querySelector('a:nth-child(2)').innerHTML.replaceAll(' ', '_')
    }

    var localStorage = window.localStorage, localPrefix = 'Sakugabot_'
    var tags = {}
    document.querySelectorAll('#tag-sidebar > li').forEach(
        tag => {
            tags[getTagName(tag)] = tag
            setTranslation(tag, localStorage[localPrefix + tag])
        })
    if (tags) {
        fetch('https://sakugabot.pw/api/tags/?name=' + Object.keys(tags).join())
        .then(r => r.json())
        .then(result => {
                for (var i = 0; i < result.results.length; i++) {
                    localStorage[localPrefix + result.results[i].name] = result.results[i].main_name
                    setTranslation(tags[result.results[i].name], result.results[i].main_name)
                }
        })
    }
})()