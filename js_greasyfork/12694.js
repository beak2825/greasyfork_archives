// ==UserScript==
// @name        Oscar.QBao.Instance
// @namespace   Oscar.QBao.Instance
// @description Oscar's QBao Instance
// @include     http://bc.qbao.com/tuan/*
// @require https://greasyfork.org/scripts/12695-oscar-library/code/OscarLibrary.js?version=76928
// @require https://greasyfork.org/scripts/12696-oscar-container/code/OscarContainer.js?version=76930
// @require https://greasyfork.org/scripts/12697-oscar-booking/code/OscarBooking.js?version=76932
// @require https://greasyfork.org/scripts/12698-oscar-qbao/code/OscarQBao.js?version=79762
// @version     2015.10.12.06
// @author Oscar Koo
// @grant       none
// @noframes
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/12694/OscarQBaoInstance.user.js
// @updateURL https://update.greasyfork.org/scripts/12694/OscarQBaoInstance.meta.js
// ==/UserScript==

// "左上红色区域"点击可切换显示/隐藏.
// "服务器时间", 当服务器时间显示为红色时, 代表时间为服务器时间, 反之为本地时间, 通过点击右边的按钮切换.
// "启动时间", 把"启动时间"设置成秒杀开始的时间, 一般设置为秒杀前一分钟左右, 右边的框是轮询间隔, 单位为毫秒.
// "数量"即购买数量, 一般为"1".
// "备注"可不填.
// "地址", 一般在开始的时候会自动加载你所有的地址, 如果下拉框为空, 可能是因为你没登录, 在秒杀前必须选一个地址.
// "启动", 如果按钮为灰, 一般就是加载(地址)没完成, 登录以后再重试. 点击"启动"后, 程序会在"启动时间"触发轮询, 不断的根据"轮询间隔"提交请求, 直到成功抢到. 如果发生错误, 你想停止或者继续秒杀, 一般就是再点"启动"按钮即可.