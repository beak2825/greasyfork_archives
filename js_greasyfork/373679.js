// ==UserScript==
// @name         Sakugabooru Tag Information
// @namespace    https://sakugabot.pw/
// @version      0.1
// @description  Add more infomation for sakugabooru wiki
// @author       ElnathMojo
// @include      /^https?://(www\.sakugabooru\.com|sakuga\.yshi\.org)/(wiki/show\?title=|artist\/create\?name=).*/
// @downloadURL https://update.greasyfork.org/scripts/373679/Sakugabooru%20Tag%20Information.user.js
// @updateURL https://update.greasyfork.org/scripts/373679/Sakugabooru%20Tag%20Information.meta.js
// ==/UserScript==

function isURL(str) {
    var pattern = /^https?:\/\/.+\..+$/
    return pattern.test(str)
}

(function () {
    var title = /(?<=\?(title|name)=)(.+)/.exec(window.location.href)[0]

    jQuery.ajax({
        url: `https://sakugabot.pw/api/tags/${title}/`,
        type: 'GET',
        dataType: 'json',
        success: function (result) {
            var infoTable = ""
            result.detail.forEach(
                function (element) {
                    let value = element.formatted_value ? element.formatted_value : element.value
                    let valueHtml = `<a>${value}</a>`
                    if (isURL(value)) {
                        valueHtml = ` <a href="${value}">${element.value}</a>`
                    }
                    infoTable += `
                                <tr>
                                  <th>${element.attribute.name}</th>
                                  <td>
                                    ${valueHtml}
                                  </td>
                                </tr>`
                }
            )
            infoTable = `
                        <div style="clear: both;">
                          <p><b>以下信息来自<a href="https://sakugabot.pw/">Sakugabot</a></b></p>
                          <table class="form" style="margin-bottom: 1em;width: 15em;">
                            <tbody>${infoTable}</tbody>
                            </table>
                          <p>最后编辑者：${result.last_edit_user}</p>
                        </div>`
            jQuery(infoTable).insertBefore('div.footer:eq(0)')
        }
    })
})()