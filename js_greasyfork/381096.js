// ==UserScript==
// @name     qiandao.today 隐藏一周内未成功的签到模板
// @version  2
// @match    https://qiandao.today/tpls/public
// @require  https://unpkg.com/dayjs@1.8.11/dayjs.min.js
// @require  https://unpkg.com/dayjs@1.8.11/plugin/customParseFormat.js
// @grant    none
// @supportURL https://github.com/whtsky/userscripts/issues
// @namespace https://greasyfork.org/users/164794
// @description 隐藏一周内未成功的签到模板
// @downloadURL https://update.greasyfork.org/scripts/381096/qiandaotoday%20%E9%9A%90%E8%97%8F%E4%B8%80%E5%91%A8%E5%86%85%E6%9C%AA%E6%88%90%E5%8A%9F%E7%9A%84%E7%AD%BE%E5%88%B0%E6%A8%A1%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/381096/qiandaotoday%20%E9%9A%90%E8%97%8F%E4%B8%80%E5%91%A8%E5%86%85%E6%9C%AA%E6%88%90%E5%8A%9F%E7%9A%84%E7%AD%BE%E5%88%B0%E6%A8%A1%E6%9D%BF.meta.js
// ==/UserScript==

dayjs.extend(dayjs_plugin_customParseFormat)

const now = dayjs()

function tryParse(lastSuccess) {
  let d = dayjs(lastSuccess, 'YYYY-M-D H-m-s')
  if (d.isValid()) {
    return d
  }

  d = dayjs(lastSuccess, 'M-D H-m-s')
  if (d.isValid()) {
    if (d.isAfter(now)) {
      return d.subtract(1, 'year')
    }
    return d
  }
  throw lastSuccess
}

document.querySelectorAll('table tr').forEach(f => {
  const lastSuccessNode = f.querySelector('.last_success')
  if (!lastSuccessNode) {
    if (f.innerHTML.includes('从未')) {
      f.remove()
    }
    return
  }
  const lastSuccess = lastSuccessNode.textContent.trim()
  if (lastSuccess.includes('前')) {
    return
  }
  const t = tryParse(lastSuccess)
  if (now.diff(t, 'week') > 1) {
    f.remove()
    return
  }
})
