// ==UserScript==
// @id             iitc-plugin-portal-flips@w3drt46523trc26
// @name           IITC plugin: Portal flips
// @category       Layer
// @version        0.1
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL
// @downloadURL
// @description    Show all portals flips on the map, motherfucker
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @include        https://*.ingress.com/mission/*
// @include        http://*.ingress.com/mission/*
// @match          https://*.ingress.com/mission/*
// @match          http://*.ingress.com/mission/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/412257/IITC%20plugin%3A%20Portal%20flips.user.js
// @updateURL https://update.greasyfork.org/scripts/412257/IITC%20plugin%3A%20Portal%20flips.meta.js
// ==/UserScript==


function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
plugin_info.buildName = 'w3drt46523trc26';
plugin_info.dateTimeVersion = '20160328.180000';
plugin_info.pluginId = 'portal_flips';
//END PLUGIN AUTHORS NOTE



// PLUGIN START ////////////////////////////////////////////////////////


window.plugin.portalFlips = function(self) {

	if(!self._methods)
		return;

	for(var methodName in self._methods)
		self[methodName] = self._methods[methodName];

	delete self._methods;

};


window.plugin.portalFlips._methods = {

	setup: function() {

		$('<style>').prop('type', 'text/css').html('.plugin-portal-flips-popup a {\n	color: inherit;\n	text-decoration: underline;\n	text-decoration-style: dashed;\n	-moz-text-decoration-style: dashed;\n	-webkit-text-decoration-style: dashed;\n}\n').appendTo('head');

		this.icons = {
			R: {
				R: L.Icon.Default.extend({options: {iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAMAAAD3TXL8AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAIrUExURQAAABt1yA9nty+PBRVvwSyKAyyMAx15gzCPByF0UjqaECuG2CqHATiZDhZwwhp1jS6NBCmIDyuJARVvwRZwwhNtwCiIDxp0xjKTCBlzxR13yiiC1SV/0R54yxdxxDSUCiuJATaWDCF7zj2eEyuJASuGxiOBSBRuwBRuwCuJAR56eBRvnxdxwyqHAS2NAyiC1EqqICuF1yFqATCMijSSWTqZLiiC1CN9zzaWDDaWDFGyJ////y+K3CaA0yuF2DON4ESlGkioHimD1T6eFDaQ4kusITiS5S2I2lS1KjqaEE2uI1i4LjWVCzGSByqFtkKiGD2Y6hx2yMfk/zuW6GTAvkqqIMLi/zGL3l+/NSF7zcX/q0Se8EChFsn/skym+UupcCeEgjCPJE+wJc3/tmjIXCiGTVCq/drv/2LDOPX8/dL/vjqU5iWAsDCLu5DxZszm/zGOjIvrYUmj9UqmpJHt6yOBSGrKQHraUC6NVDiXLD+a7Fq7MNfr/1OyR0Oez5T0iLj/mOj/3yJ+fCuKHyF8rCyMAoLD/4rH/1y9MjqXlUCeZZba/zuWxkCgNNLp/zeYDaHY/06uQtXr/7f/pI/ttNz/0lm2tOz/5HPUSa7/i5r6b57+dBx3pzmXXk6p2V28UVi2fVSwrkei0mnFw5nO/5/7+bPa/37a2HLQl6j/nWy4/37dcsLq/3a9/02o2EalOrj//W3I+Kj/ynbUm5/9xGPDV6T/fIHgdXPSZ26BLtkAAAA6dFJOUwAOFtDmXA0HGQNRKoLjWkZrRtl19VHBbvJ91Ttc87cp7J+kOfZNZNll5cDJ0XWqjYfiNnSHcfLne/kYu2SGAAAC0klEQVQ4y3WTZVcbQRSGB02h0AItWihW6u5dy27WspuEGMnGSCBIlEBwd3fXurvbz+uGwEF7P85znjNz730HgO3Kjb9z+1bRUbC/Cq8n2qbGx2puXDu15/xIPmlQmJ48ffbYymAFu7zCRMOoqUPR5Wh4Xm+vp+4WbYN4DnIrIAiaczR0azRWuwbNDoObpNwkdzq3iF7fbm9HNy+LTeRNC97S0gpLpWP5Y+f8vGu63ncvQiT31aOQt9nkdpsqf5Z8rq62V09r6pFM8VkP5HLe4u71er1LP766XK5au5GxtpsjQQzZwdOW5pVgS0vPYuO3T8OeaiPDWLFskE/IDbTFvRKg6bnFhklqxGM3UpSVKgBRPEQYShWrfb2KL+Nj3UbPe0ZHSTX6LJAB8YShQmEwWZZ6vje6Ou0Co5NKfZockOGEeLpCQRB0AIbhCQoJEYHR54AoWu7cJDjeAzfWsCxC6QTBx2SBq7gCokvlOI4b3sGvJjGWpXQIohdOgyROHiZqWyX8ogbDWKlINGg6yFXxIaK2keQvuKRYhmFSHSvVa8VVpKkhwgLZOlabK0NEhglGzMeeFucWo3KqLTwZhDc2HZkMMbJ6bWpo1nk4UUGQwb7mPyJBRUlHCdGS0BoSZvi1ANkidhMmw7WM+UQ4BEME1BvggnBfiKAjnVbhZGR4qQlKGv+9zrX8DZGXtQxlztxOzhkcJ9c3uC7PcvGsEUGQbSUkERwXWJty1M2+lqHU1i1hSa1WzgQXHI0TqBlhoyN2AndFRXBK5QfPG78ZlWrTd2U0No+0KZVtb+v8ZhbbrQCQpMKVqvLWskGzoD2/J9ixF0hSVV5VNojJwu3vVIxKrRSJH9Ee2/dLJCkcOVDVX4yek+z/QDFDNtGpOaAAEJfCtTXV+S/HHSAgfqitte5h6kEA4qLKH5VdOkQBIHmgtf84OLTSmi4eDkBy038UIDm7u5d/+N7c43XEk7UAAAAASUVORK5CYII='}}),
				E: L.Icon.Default.extend({options: {iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAMAAAD3TXL8AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAI0UExURQAAABdxxCZ9ACuJATORFB13ySqJARxwgyWCQRdxxDCPBi2MAy2MAy+PBRhyxBVvwSaA0hZwwxNuwB53ySF8ziKCMRVvwRdytSqKAC6OBBx2yB13yjydEjmZDzWWCzWVCxt1xx54yh57eyqHASKASBVvwRl0piGBFxp0xjSUChVvwS2NAy2NAyqKADycEhZwwkqqID+fFTaQ4jycEiiC1CaA0kioHjSSWi+MjCyHuSaA0jubEUGhFzaQ4v///z6fFD2X6VCwJkysITiS5dbs/0anHESkGimD1S+K3C2I2iWA0jOO4D6Y6yuF2EipHjWVCk2uIzqU50Gb7Vi5LmjGjlOzKCJ8zjCQBl6/NEWg8kWlG0ql9zaWLB95zNLp/06p+zGL3hx2yLf/liJ9r2LDOEOe8EqqICOAgFez5UOjGdzu/7v/njCRJj2eMzWUXHO8/6//jITlWkekpE6sdMf/r77k/x57eyeFTZbN/ymHhyuJUSqFuDiWlrT/krz/psz/tVKzSECczly6gkqqQJTyuvD7/9H/vFiv/8jk/53Q/5DK//P/7Oz3/7Xb/x14qiuLITmaL5LyZ1q7UJLyiKDd/0OhoePz/2Gz/4rn59D/y6vX/y+NVU+q3FOwsDyaYjKNv0Sf0W3LkziYLqj/y4LgqJ7+dG3Kysvm/5f3jXXVS3DL/V+67Pb//zOOwJDX/2fHPZ77+ziTxZr393vbUcP/3HHOzkGfZ3racJj2vnXO/2XA8kah08M5xREAAAA7dFJOUwBpFuRPG14EBw4Oe3DUWupR/YI46kbZRu/2p9M7XKTsePVk2cDLwskp/PMrr76NwCTih/LaKi90h3Ga6mrSxQAAAt5JREFUOMt1k2dXE1EURZ+AQpAugqCIXZe9t+kt01PNpJFCIAEiJEEJBOm9q2Ch2HvvXf+cEwIaAc/H2WvPzH33PAAWcyLvzOlTaSfB0qw7ely+13634cjBTf88X32WRfzO23d6p8wGbPPhJKEQsTvt/vsXLnabbbbAsbRFkCdIHruESz0qsVjM1RaobMGQTU4JV6OSPoIgLDYLNP8xTaHR+SxI07T71Y3ezq6mpsEmm6E8UyVbOKcUHHJ6PM7aj+emqtU0Eba6tepvKZKJcnuGg8HgzS+fZwcHO20dpNmiTwE5rJ2i3EMDo+Hw9Znv3z41jr3rIA1mrAyUIiYEcXsGYhTSM3OxL9A4Vh0hA+bAZrDRKIkI7Z8eH7Z/aP/aHRl7Qfp0OoLIBoW4EUFoO+J033z7vn+2y8aohDEQ5WArjlOUSkRqBEXRa6TWQfoYhiRKwEbEZKRovyh6vdfR/gYY1gZ8DoeBzAalnB+naJPXyyFR9FEfDMM6n1ZLOPaDVYIpTjiO52vRB1exBLFAWWBPpVFCaInnZbkWPRcnjA9mCOs+AA7xuOjGZXt4SCUPMQxjOmADfEA9txyXkXcb5VF0QiUVEIZpIzBhja9Ik+sVaZGNjU//iBMIws7rHKkZ8TUUKFQ0xobVaRKksdOgX5soQb6ID4+wMXR8njR2mR0lKYmlFigINzHHhn/GyeR5klxQ4hLHsXMTwq/XvRWTEa22bkPKYkUKXIggjETfXAg9f4JBOn3Wn1Zp9vK8IoxGb/Rfg/R18IbMv4Xb4hIFRXk58LheDzHWrKSOanJl2aW0PQ3V62EsNTO5vqsqvYqrqvVSvZ6xrvmn2Jpclq2sqrl0BYMS4ydLnKuqpqW+bokCQEaRwF6uabkKbc9YeoFyKnn1bQ3WsmVXK71IaGsOVWSnLyMgL7+tNXQlbTkA6Tur2m/tXkEBoPhya8t6sGJ2Ne9YGYDi5v8oIH1b8iy/ATiG4FV4uNePAAAAAElFTkSuQmCC'}})
			},
			E: {
				R: L.Icon.Default.extend({options: {iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAMAAAD3TXL8AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAIlUExURQAAABVvwTSJEBp1xzmOFTiNFBp0xyV9jDiMFCt7YiWA0iB6zDiMFBl0xh14yjmOFSR+0EebIiB6zTWJEiB6zDWP4TOIDzWJEUGVHTWJERp1xzSJEDOIHx55yzqOFi+J20ygKDOIHz2RGTSO0C6J2y+J2yyDV0ebIyZ9gzWJEUGVHR12qiZ9g0GVHRt0qD6SGkicJC6I2ht1x1uvNzmQlj+WakecQkmdJUGVHV+0O1quNUugJ0ij9U6iKkmdJVerM////1GmLT+Z7FSoL12xODiT5WG2PUSf8WO4P0CUG0ah8y+J2yWA0jqV5zaR40Kd70ul9yuG2EWaITmRl3LGTjKM323CSTSO4TyW6Vau/+j/5lyzh2G5jV6yOiF7zVCkLE+q/J7yemW5QS2FWTqOFlqw/y2FiyaAtGm+RU2m2tjt/3G7/2e8QzSLXzGL3SyFujmSxlOrsWvAZrXc/7/k/57R//n/+0mgdJjsdFKr34nH/9/v/1evtWG4vn3B/0af1JTrv2Cz/yqBhzuRNjWLMEWaQECYa4fbYzWPw6P3f4LR/8X/wef/3PH/7nnNVZHK/4LD/0OaoEmhp1CmS2nAlEOc0IHY3t//1/T9/a7/i3vS2On0/5vyxs7/uVasUdX/0jKJj4PYflu06IrhtXnQpGS5X+//7pjZ/8rr/2O88L//34LZreX/5Gi/xZXs8uL9/4bbgcHh/6jV/1CnrT6Xy6fe/1Kpfb4UJYMAAAA5dFJOUwAW6uwWet8HDQNdDlpSc9CnUfQt1CqE/B9nadlGfac7OcHyTeXyZOxE8+JIwPnJbJqNvod0h3Ha/i42mS8AAALMSURBVDjLdZP1V9tQGIYvNtwZbEMGg7n7SZo0adKkSZM0balSoEUquA234u4OA+ZuTP6/JRTOiuz58T7nPffc73svAIekJj95/Cj/LDhO7sOn6FL7QmPB/YtHzs/dU8C1publ3lcujTUpKJd7FbaYLL63jp5O+4CduJx/KJKVtMlSzoy9dDRV6fWuAYSLOUgoGFM5zTATM2+aqhAE0bv1hv3Lom6UmBiaoekyHF+VDYK4NQWxkolATeUQTcvmU9ukVkbv1mUDEH673KcugSTK8OLNZxoZ0aXnQ0CcwgKp1bKTTFMn0mIXRVFjN8eAHMwHw2qZDtz/q78P73aJBOEikkAixGCwhBryNS/39Hf/nKuuIQhEmwYuMZBsZjemZ3b9vSute134HkFokRTJlJAYPYHja9u7OP5HrKnu0toEjWQSSyBLxzTeUYthS47V9a0+myAIlEZMAzkkrR4rs5C1ELZT3Fs1XyNQlEAhQhK4a2RIlYokZze2p/w9v+3VczaKovSGBJBaCWEqCRKu3Wlf6Nzqa2khdIS2VFpFngpCnU7Z/Xi+2d/dtTevs2p1D6S5xbGQE5WB2vyLjXa81WrVIXy8POtQDFPIqIuKC8epVpu5nhDORMprSDdC+waWzIqZqufMGj4hUIIMjFRKyGaS4DjOJqSEBJaazqoDxlH4vobj6kU++6AH4RkkaVQqMcl8cHMGigoLOaxIBAsrjUbsi+NrtdXAEQe37Ieuq1QsS659/v6R53W6sNh/hYtgMSPrLMK/NfAGW+mFoI5GhaIoi75bX/TyVnNwBIDzLMmiba89XgN1JCKHlArnVLvHa+YCzw8KVarQ5jpPg6405tgvicxUKobrBscNxyPSyCvRoQpPY2n8ia8VnWkcqShsSIs+YUBy5UhdofdkRAolDo2+uHNKBICs4dHBm+BU8ipunS5AVsW1/5jIK8Fv+Qs6idbyKUtFRgAAAABJRU5ErkJggg=='}}),
				E: L.Icon.Default.extend({options: {iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAMAAAD3TXL8AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAIlUExURQAAADiNFRp0xiN+0B54yzSJEDmNFS6ETCV4jDaKEi+CDSN8xUmdJTqOFjOIEB54ykidJR96zDiMFCyH2SuG2Bt1xyB6zSF8zht1x0SYIBp0xxp0x0mdJRt1xyB6zCN9zyF6zTqOFiWA0i2GykWZISZ9hyyDWht1xzeLEy+ELSyDWiB5ri2CKyeB0y6I2j6SGkicJDWJEUGb7VisNkugST+WbTmQmh90c0ag8j6Z6zSO4GG2PkOd8Eij9VKnLv///2O3P0Gb7TWQ4l+zOy2H2jmT5kmdJVWqMVyxOTGM3iV/0jeR41ClLC+K3ECVHU6p++34/0ul906iKjyQGEugKDyW6GC2Xlatt1uzvWW5QVquNjiS5Fuw/1Su/2q+RkaaIm/DTKjV//X8/1esVSd/iSaAtSB6zFSoMFisM1mtNTGIXymD1TiONmS1/0KZo0GYb1mwh0yhSoXaYovfZ4Tbsi6Fj3HFTTWNZD6TPD6VbFWu45Lnbq7/i57R//z//5vvd8v/tV21i+Dz/47l73TIUIHC/2m/Z27CSkedRbHZ/6b6gnTL/4zhikmgd2O6xD6YzWjAl9b/xcHh/3/TW+r1/5Xs9tnt/zeOmDKLwDSNwnPK1NLu/8D4/122637SWoTb5XvPWVCnfrz/upfslXzT3XXKc27FnM//zpvyyeT/89b/xKT4gK3/q0+mfeH/1USd0uP/2EWe0+//79Dt/5/0nWS7kkyjrQ5psG0AAAA4dFJOUwDVfB0N5vQHBHkWQz8OUlrp1GtR4/yBFGdc7OEnxqfyNaspbqFkRPNeSMDCyfma/I2+hy9UdIcWFwjOEAAAAshJREFUOMt1k+VX21AYh28ZDBtDxwYMNmBuZ36SStImjVTTlqalpUYFbQst7lLcbczd3f+/3VCkyH75luc85z33FQC2UpFfeffO7Vtgb07fLBAvhucjOdeP7Pp/6JoK5RxPF5YmXKTpzMkdkFmAOkNOrtc6MuEZ89hztrV8pSzkNBrHZ62tFpvNNSanizZLqIwOo0wmm/Y+arXI5RJbp829YSUXSB0yIbU43m6RS+DXSeZkQVJIOIyIkFr8yeCcBIaUe7TpABy/auSk0jipbv9CCmFdNn0GyFY5EalUYJDAOp8nWZYlJ81FoAzlFAqFwAbwWKsvin9ysXa7q7Ec5CIyHoVMgXC9CyO+5aG+4WeNDXJSBE7JEBQmtLLmHY0t+Yb62/D+xgZSfhgSKcUj0zi+tj46iP9hV4fbSIYRSK4UcQ4Y8AEO5Ret7b9+RBmGqcdIVgTKeJl0vNbJcwj6s/qvpW2VwbB6TFJfDiqVRqqmhqJCK+u/YyMRz3AfRJjcnQcq6hBUUwMZyn0Pz1u+RWdm7NoGsgqOolSDEASh0Wj42XvtvuW2/qjWRGpvwL5lqxFCLBYTBOKNfY148D6TSSupOir0uphHVUIUhuqWKWyIMZvtTEqqMIakZmSb+MyYmTaR+vT4EhzjKR2MQOZYmqaZ+sMZ8aEWqhU6pU6HGqw9r1/QtJndVASJopRKpUBeddJuDNtSYCW1AhLeYH33XuumG7cVONfzGo26mRp98/GtXq/VpmTtLFySmm9WEwb8Q7fe3VCVl7CjycVisVrs9b4M6k2mRAWAE2qqmRh83hV0Y7sUKJXoVMTjcFPQTMefnyDVacS9HU3dWNWFPVeSWqJUBTqaptyi1L0HlF1HBPxdkY0m705arvKBv6dblLaPgPy6hx0twf0KlEoD4a4rByjw8gL3my6CA3PZf+lgADL95/5D0s4mvuUf4TnU+/CjUmsAAAAASUVORK5CYII='}})
			}
		};

		this.PORTAL_FLIPS_MAX_TIME = 1*60*60*1000; // in milliseconds
		this.PORTAL_FLIPS_MIN_OPACITY = 0.5;
		this.LC_KEY = 'plugin-portals-flips';
		this.MOD = {R: 'ADA', E: 'JARVIS'};

		this.stored = {};

		this.getCache();

		this.drawn = {
			R: new L.LayerGroup(),
			E: new L.LayerGroup()
		};
		window.addLayerGroup('Portals flipped by the Resistance',  this.drawn.R, true);
		window.addLayerGroup('Portals flipped by the Enlightened', this.drawn.E, true);

		map.on('layeradd',function(obj) {
			if(obj.layer === plugin.portalFlips.drawn.R || obj.layer === plugin.portalFlips.drawn.E) {
				obj.layer.eachLayer(function(marker) {
					if(marker._icon) window.setupTooltips($(marker._icon));
				});
			}
		});

		this.playerPopup = new L.Popup({offset: L.point([1,-34])});

		this.draw(this.stored);

		addHook('publicChatDataAvailable', this.handleData.bind(this));

	},

	getCache: function() {

		var data  = {},
			cache = localStorage[this.LC_KEY];

		if(cache && cache !== '')
		{
			try
			{
				data = JSON.parse(cache);
			}
			catch (e)
			{
				delete localStorage[this.LC_KEY];
			}
		}

		var total = Object.keys(data).length;

		data = this.removeOld(data);

		this.stored = data;

		if(total - Object.keys(data).length)
			this.setCache();

	},

	removeOld: function(data) {

		var keys = Object.keys(data),
			now = new Date().getTime();

		for(var i = 0, ln = keys.length; i < ln; i++)
			if(now - data[keys[i]].time > this.PORTAL_FLIPS_MAX_TIME)
				delete data[keys[i]];

		return data;

	},

	setCache: function() {

		localStorage[this.LC_KEY] = JSON.stringify(this.stored);

	},

	ago: function(time, now) {

		var s = (now-time) / 1000;
		var h = Math.floor(s / 3600);
		var m = Math.floor((s % 3600) / 60);
		var returnVal = m + 'm';
		if(h > 0)
			returnVal = h + 'h' + returnVal;
		return returnVal;

	},

	createMarker: function(flip) {

		var latLng = [flip.portal.latE6/1E6, flip.portal.lngE6/1E6],
			now = new Date().getTime();

		var classNames = {R: 'res', E: 'enl'};
//(now - flip.time < 86400000 /*one day*/) ? (this.ago(flip.time, now) + ' ago') : new Date(flip.time).toLocaleString()
		var tooltip = [
			'<span class="' + classNames[flip.player.team] + '">' + flip.player.nickname + '</span>',
			'<span class="' + classNames[flip.portal.team] + '">' + this.MOD[flip.portal.team] + '</span>',
			new Date(flip.time).toLocaleString()
		].join(', ');


		var popup = $('<div>')
			.addClass('plugin-portal-flips-popup');
		$('<span>')
			.addClass('nickname ' + classNames[flip.player.team])
			.css('font-weight', 'bold')
			.text(flip.player.nickname)
			.appendTo(popup);
		$('<div>')
			.html(('<a onclick="window.selectPortalByLatLng(%LL%);return false" title="' + flip.portal.address + '" href="/intel?ll=%LL%&amp;z=17&amp;pll=%LL%" class="help">' + flip.portal.name + '</a>').replace(/%LL%/g, latLng.join(',')))
			.appendTo(popup);

		var opacity = this.PORTAL_FLIPS_MIN_OPACITY + (1 - this.PORTAL_FLIPS_MIN_OPACITY) * (this.PORTAL_FLIPS_MAX_TIME - (now - flip.time)) / this.PORTAL_FLIPS_MAX_TIME;

		var marker = new L.Marker(L.latLng(latLng), {
			icon: new this.icons[flip.player.team][flip.portal.team](),
			zIndexOffset: 5000,
			opacity: opacity,
			desc: popup[0],
			title: tooltip,
		});

		this.drawn[flip.player.team].addLayer(marker);

		marker.addEventListener('spiderfiedclick', this.onClickListener.bind(this));

		if(tooltip)
			marker.on('mouseout', function(){$(this._icon).tooltip('close');});

		window.registerMarkerForOMS(marker);
		window.setupTooltips($(marker._icon));

		return marker;
	},


	onClickListener: function(event) {

		var marker = event.target;

		if(marker.options.desc)
		{
			this.playerPopup.setContent(marker.options.desc);
			this.playerPopup.setLatLng(marker.getLatLng());
			map.openPopup(this.playerPopup);
		}
	},


	clearData: function(raw) {

		var clean = [];

		for(var i = 0, ln = raw.length, markup, player, portal; i < ln; i++)
		{
			markup = raw[i][2].plext.markup;
			player = markup[0][1];
			portal = markup[2][1];

			clean.push({
				time: raw[i][1],
				player: {
					nickname: player.plain,
					team    : player.team.charAt(0)
				},
				portal: {
					name   : portal.name,
					team   : portal.team.charAt(0),
					latE6  : portal.latE6,
					lngE6  : portal.lngE6,
					address: portal.address
				}
			});
		}

		return clean;

	},


	processNewData: function(data) {

		if(!data || !data.length)
			return;

		var destroyed = [],
			now = new Date().getTime();

		for(var i = 0, ln = data.length; i < ln; i++)
		{
			if(now - data[i][1] > this.PORTAL_FLIPS_MAX_TIME)
				continue;

			if(data[i][2].plext.markup[1][1].plain === ' destroyed a Resonator on ')
				destroyed.push(data[i]);
		}

		destroyed = this.clearData(destroyed);

		var uniqueDestroyed = {},
			flips = {};

		for(var i = 0, ln = destroyed.length, key; i < ln; i++)
		{
			key = [
				destroyed[i].player.nickname,
				destroyed[i].portal.latE6,
				destroyed[i].portal.lngE6,
				destroyed[i].time
			].join('_');

			if((key in this.stored) || (key in flips))
				continue;

			if(!(key in uniqueDestroyed))
				uniqueDestroyed[key] = destroyed[i];
			else
				flips[key] = destroyed[i];
		}


		if(!Object.keys(flips).length)
			return;

		this.draw(flips);

		this.add(flips);
	},

	draw: function(flips)
	{

		if(!Object.keys(flips).length)
			return;

		for(var key in flips)
			this.createMarker(flips[key]);

	},


	add: function(flips) {

		$.extend(this.stored, flips);
		this.setCache();

	},


	handleData: function(data) {

		this.processNewData(data.result);

	}


};


window.plugin.portalFlips(window.plugin.portalFlips);


var setup = window.plugin.portalFlips.setup.bind(window.plugin.portalFlips);

// PLUGIN END //////////////////////////////////////////////////////////


setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);