// ==UserScript==
// @name          Stable-Diffusion 连续生成图片
// @namespace     https://greasyfork.org/zh-CN/users/1196880-ling2ling4
// @version       3.8.5
// @author        Ling2Ling4
// @description   SD-Webui的插件, 可以用于连续生成图片, 可以自定义连续生成图片的tag模版
// @license       AGPL-3.0-or-later
// @icon data:image/x-icon;base64,AAABAAEAAAAAAAEAIADtGAAAFgAAAIlQTkcNChoKAAAADUlIRFIAAAEAAAABAAgGAAAAXHKoZgAAAAlwSFlzAAAOxAAADsQBlSsOGwAAGJ9JREFUeJzt3XmUXFWdB/DvfVWdTnpNrwSCguPA4KijjNsZ56CTjYA6QTwmJIFsKjAODpJAJzFCFjAh6WZRnBkmgIQmK8k5cXBhTNIkuDEzinF01BE9sqgxW6eX6nQnna56v/mj6t73SFcn6U6996rqfj9/mF/felX1o7v99b2v3rs/gIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIcufYphurjm26sSrqPCg68agTIKLosAAQWUxFnQAF79DTcxp17KSSK3SsSka/EwBKx/3lYT3mKlmq47GTFv8urBwpGpwBEFmMBYDIYlwCFJlDT88pBwDHHVioxxTUEt8hFWY8PvpFACgZ97YP+h4/5Ysf9V4jeR8AVE1edizHKVOEOAMgshhnAAVKtk+P6fhoX8l8HSvIvZnworO9xhAzgKF0p18fa/RAZaz3EfNaE1adPIfXoDzDGQCRxVgAiCzGJUABcN30z6m9dfa1ekwpafYd8vaRvO4wlwDZ/N73al/UUeXEOzcDgOM4MsLXpZBwBkBkMRYAIotxCZCnjj41+z3eV9KSCSbk8j1ysAQYyn4AEKWa9MDYSU17c/welAOcARBZjAWAyGJcAkTs4IaZl+o47jirzQMis4N+7wCXAIMJntOhE3MX67hy4tJfBv7eNCTOAIgsxgJAZDEuAULU/cT0Wh2fiseXZcJ/8h0yKsx8Ql0CvFFKBwJsAICSZMlyPVZ+zcKDIedjLc4AiCzGGUAAXt0wf7SOK9TJz3mPeJfLAhgbYkpZRTgDyKbXFz+og/5Yn74GAo0TVh4PNSMLcAZAZDEWACKLcQlwnmTFCkfH7W/57SwAgBLf5/m4JPyszk2eLQGGckgHArUSAKo7LnlCj6kZM1JZnkPniDMAIouxABBZjEuAEWh/ctZEHYujWrxH5K+jyGekCmQJkM2vdKCUMo1MqiY1fTOadAoXZwBEFmMBILIYlwBn0fH0De8AgJQb8+3BJ9cOdXwhKeAlQFYKeEHHritNADD26iUvRZZQAeAMgMhinAFktLdOH+99FdfNNSCC+ZnQQZFxSsY8BgDxC66Y5RuujCidXJPM/27TA67jfEHHNZPuej2CnPIOZwBEFmMBILKYlUuAY5turAIASXpbUwmwyHfImNCTCpKCtyNvyjU79TZ86pn9ANCzq6VRj7lxWWmOFdzse5Vi+GPRrwMRfNXE8ZLVAFAzYWFXFElFqRh+qEQ0QiwARBYr6iWArL+lRMfHShO3mHGoFZmwIfSkAibALwAAylve1M955js6dhycc7++xN51f2Fe11XrMuF1559l3ukAAAi+pAeqOvv+RcdqxspTEeQUCs4AiCzGAkBksaJZAugW2h2ts6/XY6Jkre+Qy0JPKlh/0oGI3KPjhvJUKwCoGTsC2Sgj0dZ8lXlf4AHfQ+8P4v0i9IoOBNA7OGPs5MXPRJNOMDgDILIYCwCRxQp6CXD4yZnmLrZYLL0xhwiK4s620/QAgAD6TDwG+nse1vH4W7/VF0VSruua35/E3gdm6FgB92fCt4SeVPB+BAAKuEsPVE1e/P3o0jk/nAEQWawgZgBHW2+4XMcCpf+6QIn6RDQZBSapA4Far2PXid0LAOPmbjwSRVLDJdtXjgKARE3ZbWZQ4W7fIbWnP6fAPasD5cgSHVdNXPJyNOmcO84AiCzGAkBksbxbAhx6eo65M81xU8sBQEFu9R1SVEVLlOzUsYKYDSsa5j3zm2gyCkbnvodNL0SVHDA9EpUy3ZFLQ08qGGYZB4XHAcBJphuaAEDl1Ka8WsYV1f+ZiGh4WACILBbZEuDA+o+V6biktHKhjhWwxHdYsexPBwAQ4D+92GkCgAvmb/5hdBlFr3Pf/ZcCgOPG/P0U/XsU5t0ydQR6TCQwu0sfP9H7kI7HT1sVybUcnAEQWYwFgMhioUyvZPv0mI6P9pXMT7+x3Os75KIw8gjRb3WgxOtdVztvy9d1PJyNOWzTtXvde3Xs+HovCvB3kSQUEAEO6NgRLAeAys4ft+qxoO7o9OMMgMhiocwAjn/9jnfr+ET34Z+G8Z4hateBQnpH3br+qsfM2K2PDUSQ05CObZg1xXxRWjYdAOKNl39XD1VObNqiY8dx8mqWkmhr/hgACOBr04a3RZTOeXMHTnpxd3oyIGWjzb4K9dO+8uOgc+AMgMhiLABEFgtlCdD57KIrdZzsPLg/jPcMgJmvKRHz+a0qiZl79Otu2pwIO6mhHP7aDe/SccxxTI6iMFXHQ3QH/okOXFHmnveaKU0vBJXrcMn27eakcnft65/RsV6CZYwLM6czkZS3qbCbOGTiVO+xQceq2kYuAYgoHCwARBZjAcjOnP1WwFMAoOLOcj1Wd9PmP0aQ05COPTnzTTpOKXUfACiFuXpMhrfUe48OHCX7dNzdtu7bAOAgZhqOVE6+61cjTPm8qBkz/J+Pm41TjuxbuVnHpckx6eWL8pYxAMoDT851TZjqOZweOu7dACjiDnpKlFgAiCzGAkBkMRYAj+mflxLHTHPHLdj8v9GkM1jH+unVOk6OjptLjF3BHTpWwOhg3l19FABcuNfokURb89d07MSg+y2iYsLiQ4hA44SVx31frgSA3u88bJYIA/EBc/m5Ahb4jo1huMS7Rsrt887mp7oPeoe4SeQ7FgAii7EAEFnM1gLwUwBQSnkttOdtaYsuncFk+/RROj7aF/sHAEhCmU8ilKAuirzgmy4LYFqup1Jqto67n295AABOJL3egeOmNvWGlaBf+TULD/q+vFkHPXvXflnHbspJ31ug8JHsr+Kb7p9IX+uVShzwHh3oz0muUbC1ABARir0AqJg5GaWQatJx3SuXbwEAtWpV5B/K6q7GANDeOvuTJu4TrwEK8Naw8xo+qfDC9Am4MTFvN+euPS3mJGF15yVP6vi0z/RDUzlx6S99X34UALqeb5loRk4mHtVhKnHINKZx+/3nGQtfcRcAIjojFgAiixVPAXDS56Zild5NYE5Fg/lCOfh7HXdf5L6YCV8JKbtBjmyYeRUAHGv1trxSSj4QVT7BUBeaSInZJCVR+9rnddy9p2UJAFRPafp2uLl5Dn1t9p8BwMAf9vsb0Fw+xOFFpXgKABENGwsAkcUKrwAo78a2WHmDF1dlZvvOEFd1CmZ4LxH7OAB071n3r+bxVMl9Oqy+ZlFHjrJF+4ZZV3gpyFrzgFLX5eo9CtDbTaTkWwCQaGs2dx66CuYOvrGTFudsA5lE61xz7US/DPjalYtuY16Sq/cqFIVXAIgoZ1gAiCxWEAXAKasxcazK6yGi4qOyHX4u0k9UytxFh3hyvg4Te9at0XHlwJhHAEB95PazXu95ZMP0cemXLTEXvQjkZu8INfy7ziwhwAQdK8FLOu5uazbblLvK+SIA1Ey66/Wzvd6rG+aPBoAK9Ov24+gXry05gOpBT7JQQRQAIgoGCwCRxfKuADil3iXlserxAAA1qmyow3NprA5EKdN5JjHq5G0A0N22zkwfT/W+/A3zrM4TprU5gMzdhRL83nPFzb+H4Y06cMT9JAB0tbU8Yg5MxswnK6cOvXSt9wr96XbjgksCzLPg5V0BIKLwRFYAVNzbuSpW7Z3Yc8ZU+Y8KMaOhyCUA4PZ2bNIjqnvA9PsTCz87jlApAKC/x9zZmew+4JuBiff7nFddDfMXZwBEFmMBILJYKAVgYCBpdlEoqXnzKQBwymt9H+LnxVTfRHrbJwBIdf8p/WjypP/gopj2K8eJZDOO4RBfC239s3BPdvsPKZY/YgMAIMlk99kOzKVi+eYR0QiwABBZLPS5d+/udRcBwIADX5MG5W/S4ISVi5zyNqpNdf3JxO6p4tr3DcAJHSjAtDZ3yipbACBW99Zp5khRX/I9781hJAcA4poPVuD6mmtka6Fd4Hx9J6XVxPHYPUD4fSc5AyCyGAsAkcXy4fQ7ena1vEPHbsxt9h5R12Y7fiQkecrEqUTmbHJfZ65ePp9ktjqXDXpAqZS5O7F+3o4Dg5/ikX0rzBVaPany2804sCwTnv9ddDK4hXaq50jWx4uBEuzSccqBaUZzwbytP48mIw9nAEQWy4sZwFC6dq+bBADKQYs3qq4845Nc76PtVI/XpDZ1/Kh3jBTZdaIKz+kw5TpLgdx3NU60rakDAEH8Ht/wP/riLNdG+K6t8J3MSyV8HXRT+d9Bd1gUfqZDx0UTANQt2LonuoTOjDMAIouxABBZLK+XAJrruibPnn0tN+lYRMzWXW7P0YsB76RSejDvr3QdJmV2yFWumDvi6j+1dW8U2XQ932x6FjqA6WWY6uueDniX7gKDLqUuBuZkqlIwe0XUjUl6d43O2JH3v4CcARBZjAWAyGIFUQDUqlVmCTBw6ctmXBzfCqbITuzDt+NxvCrdYi9eVmtuU0w5ju+usa3h5eUzcGC/t11zSjWauCAWlsPgeFenxzO9J1VFg+9h3y/i93oL6jexIAoAEQWDBYDIYnk9WWtvnT0ZAETEdyEQ3h1ROsHw9TI8rbW5iZXK+mPypprKWwO4cJYB59Y8YzgObph5KQDElVrjG56Vy/eInvd9dipMG0HEqi70jnDO/DdTQZkLgVwliwFg7KTFu3OXY25xBkBkMRYAIovlxRLgcOusv9JxzIW5G1AUpkaTUVB8rc0rGzL/XuA9fJbp5TnqBwARfFUPSLxktY5rJizsOtOTuzbPNmf2BwbE30tP99gbcUPGfKXGpG9wjFf7+06OHurw4ROYJUBKKXMBV+3kJt4NSETRCX0GcGzTjRcDgCRT9+kxgZoXZU5BcspqTfyGk0kj72w8Eh0mEpgtv079/tdPAADiJ272PX6373k1KCJqlNexTbedAwCnNNRObv7NDp7WQYmK3w0AZZMWnXG/hlzjDIDIYiwARBYLZbp9dOdtl5s3THT+AgAEUhTNNfxUprNx3De9DKmz8Yi4fZ17ASDZ8drEqHPJNRVPtxF8Y99J/25m+bDS9C7lSB1vHwCAlDr1Tj3WcN1XXs7ypJziDIDIYiwARBYLpQDEY95p1mQxTP3jpWajh3j1xeZaXmdMZSbKh+nlOYmd/ZA8pxzTUSRWfaH53YqZS6nz4Wdx5r6TACDJkyUAoGobq0JMjDMAIpuxABBZjAXg7A4CgECZ7bBL6y/5uo5VvOIuHbuQOwBAAWPCTNAiJwFAFL6sB+InT63VsXNx4wd0rEQ1A4BA3hVmgn4y0AcASHV61/bkW99JFgAii7EAeExpFsg6HbtOycMAMG7uxt5sT4LXMgvHdj34KADEY+593sMyx3dsaJ2PC5z4go06jqvkPQBQO2/H77M/bYe56UZWrGgDgJ6rynzff6/zsQAX5yzZLG3ngMJoPccCQGQxFgAii9laAFIAIIL1esCNxVfpeNzcjUeyPels6qbe+YdMOF+Pde5uNiesHAe+zseYMpL3KGJtOpDMVloA0Dhv209H8mJq1Sp9112red0XH9qu4+6+gTvMsVBLM+HZP4PPNJt5Q9/JHl/fyQLbntrWAkBEYAEgspo1BUCU7NSxSsaXAUDjpzcFfrdVzdWL/8f35dU66N6zdmo6L8fseKyAd8ICAvzC90UTANTP27pLDzlOMPNo9cFFJ3xfml6GPc+teQIA3JKS5d7DqVtN1NtuLjFOJTJT/yLpO2lNASCiwVgAiCxWdAXAv++bU33hQR3HSqt26Lhy4p2/AQB8ehOiUj1l6S4AkBUr9uixng+Vmb0RXVHmYiIFjEdhMlfFiIi5lLqhPGXOzJsW2gtCzesNyq9Z1g4A7Rtn/kCPOeJ8XMcCydlFQ/mm6AoAEZ07FgAii4WyW0Lns4uu1HGy8+D+XL2u3vcN8LZ5dsb4r+UY8j/vR5lHzZ18VZMXfz9XeeXCgW+sMJsJlpdXLAQAJbLEd0jloCcNk9vX+V0ASHa89uHzfS1kuZdC30cBnPFeikgceWr2h3SsgAfSkbwvqnw0Vdv4fh3XT/vKj4N+P84AiCxWEAXA35E1VuXroFte7ztoWJOZ9wOAAN/TA91tzc967+f9pa2auCTwawWyGT9tVZ/vy9UA0LOr5XE94MawwntYbvEdG/TP1PcBuDxm8hlQ5lLqC27edjjgHM5Z+4ZZV+hYFNZ5j8i0KPLJNwVRAIgoGCwARBbLuwKglLdnhlPZCACIZf5NHxDYRrbX6UBc9VEddz/f/DgAOEm1Uo9VTm0a0d2C5+u0971NB4m96x7RseuqtQCggI8jl0SeTb+uuXMO9Qu2/Tqn73GeDj8+y7RadkpkBQAI4F8eFf4uyDmWdwWAiMLDAkBksQgLgHfWPlaevYU2YpH1EPG+L4LPAoAbk5v0UPeeZrOxx/ETvQ/p+LQz96E57ZOK6wEg0dZ8lR4QgbnjEAofwJn9yDwPqknHjQu2fi/74eE7sP5j5hqJktKKRTpWgO86CVURblaFiTMAIouxABBZLPRLgd0TffsBwPG3bS4ZHUYagRDAdH1wBMsBoPIHvU/pMd/edHmha0/LDB3LifarAWCg83VzR2L9nG1m37ygNuYYDtk+3Zy5P9obmwcASinftuu4aNCTClhJdcN7dTz2+kd+EvT7cQZAZDEWACKLhbIEEFlhru7peV53agmmS0s+UMDPdSzimi2u9SYgNJjrer+L7a2zpurYUd5W6lJ8eyYO2jAl62YpAeIMgMhiocwAspEXHzIddIdo0gCcS6OGwmJOtrmO2wQANROX/iy6dKJ3ZMPsdwOAUtLiG54cUTpB8e2VANPNeKC/x+yXMP7Wb0VyDQlnAEQWYwEgslhkS4Ch9Dy3pkHHplGDklt9h0R2fXCOZa4PUKb9dTLm3q3juglL/hh+SsE59uTMN+k45XgngBUwxwuLgjlxp3tP5qLvZFA4AyCyGAsAkcUKYtrVvbv5Mh1LTJmzqErkE9FkFAwBTO86B8q0FR84VboWAOo+cnsiiryGq2P99GoASI6Om090lOAO3yGFe+13dv9uolTM/Dc3hNB78nxxBkBkMRYAIosVxBJgKIndzX+rY3HMphd/E1E6wVE4mg7kXj1U5fT9m3l4wqpk+EkBsv4W84nMsdHHzSc1IqK3LK8f9KRCJ/jv9D/i2yxlW141lRkOzgCILFbQM4BsutrWfVLHCt4JQwBvjSCdAMlvdOQKvqDjmilLdgbxbvpmnY7W2debDJT4v7+XDXpSYXtFBwLv+1s/d+sOID/2SsgFzgCILMYCQGSxolsC+MlL681JqkRX4rO+R5ZngrqQUwqe4IeZwHQ+rp6y5L9G8lLHWmeZE6qS6aArgg+eX4J5qQMAIDBbjXX1dD2q48tu/4/+CHIKBWcARBZjASCyWFEvAYbSsWdtNQDEETNnd0XJ532HFNWlqgrYoWNXeWe0x05a/DsAOLLxpj/XY04qdb+OBTCfqBQJbyqvYPoplsTV/QAw9sYtnRHkFCnOAIgsxgJAZDErlwDZdOxZ+2YdxxAzG1ZAmZ6AxfK9OqWD1PGjjwNAquuP/hbaxbLhirZZB/Gk+qKOaz6z5fVo0skvnAEQWYwFgMhixTKtDUznngevBADHSXnbVgsmRZZQDrl9nd8FgGTHax+OOpcc2eeF6dbmDfO3BN5fr5BxBkBkMc4ARqD7+Qeu1bHANa2rlOAd0WQ0MgU8A/iVF4ppvVY3d9tzOi6Wu/WCxhkAkcVYAIgsxiXAeZLt22M67ql9fT4AiG/rLgAXhZ3TuSqQJcAhE0n6Ls76Sw9t0ENqwguRbIdWLDgDILIYCwCRxbgECMCBb6wo03FFWcWdvocWe6FUhJhSVnm2BOg1ka9VuIxJPajjxhk7joNyijMAIouxABBZjEuAEB1vW32BjlNSshIAoHCz75AYQhThEsA1keDx9D/JlXqoccGOQ4OfQkHgDIDIYpwBRCyx64ErdCyOu848oDAt6PcOeQbwTR0ox12i4/q5z/xfCO9NQ+AMgMhiLABEFuMSIE/17G4203LX63z8vly+R4BLgJcAAOJ10G1YsO2FHL8H5QBnAEQWYwEgshiXAAXAdV0FAD17H7zBG5U1vkPeMqLXPc8lgAJeM9kAy3Rc/+rlzwCAWrXKzfI0yiOcARBZjAWAyGIsAAXAcRy9v902PSbbV+7UcU9t+efMOOTuTFiT4zS6Mv+apimdia5/1nExt9AuZiwARBZjASCyGD8FKDJd378/PfXvj5k+eAr4nO+QUh0M8SmA6R0IgZnij0olVwNA9Wd2dOQ6Z4oOZwBEFuMMwAJdu1rMdQLKkdU6dk90jgOAZMdrh/VYyombz/PHzd34alg5UjQ4AyCyGAsAEZGNEjtvq0vsvK0u6jwoOpwBEFmMBYCIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiCiX/h8jcXQHlRZPCQAAAABJRU5ErkJggg==
// @match         http://localhost:*/
// @match         http://127.0.0.1:*/
// @run-at        document-end
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @compatible    chrome
// @compatible    edge
// @compatible    firefox
// @downloadURL https://update.greasyfork.org/scripts/480757/Stable-Diffusion%20%E8%BF%9E%E7%BB%AD%E7%94%9F%E6%88%90%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/480757/Stable-Diffusion%20%E8%BF%9E%E7%BB%AD%E7%94%9F%E6%88%90%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const main = {
    isTarget: true, // 是否是目标端口
    txt: {
      isAutoLoadTag: `是否在进入页面时自动加载上次使用的提示词和配置
默认: base
当前: `,
      isHiddenList: `是否在使用一条记录后隐藏列表
默认: base
当前: `,
      listMaxLen: `设置列表的最大长度, 默认: `,
      showMode: `设置列表按钮的显示方式, 是单击文本框后显示列表按钮, 还是双击显示, 或者一直显示
默认: base
可选: 单击, 双击, 一直显示`,
      listenPort: `设置监听端口, 可设置多个, 每个用 , 分隔, 默认: `,
      selectors: `选择器配置, 输入 default 重置为默认设置
----说明:
gRoot: gradio-app元素
startBtn: 开始按钮
skipBtn: 跳过按钮
settingsBar: 顶部快捷设置区域的元素 (含切换模型的功能的区域)
positiveEle: 正面提示词的文本框
negativeEle: 负面提示词的文本框
positiveBox: 正面提示词的文本框的祖先元素
negativeBox: 负面提示词的文本框的祖先元素
methodBox: 含所有采样方法的单选按钮的元素
methodsArr: 采样方法的单选按钮
methodsTxtArr: 采样方法名称的元素
stepsEle: 采样步数的控件
widthEle: 宽度的控件
heightEle: 高度的控件
countEle: 批次的控件
sizeEle: 批量的控件
cfgEle: 提示提系数的控件
seedEle: 种子的输入框
modEle: 模型的控件`,
      oldSelectors: `是否重置为旧的选择器配置, 当前插件版本为: versions, 旧的版本为: oldVersions
旧的选择器配置为:
oldSelectors`,
    },
    // 将布尔值转为设置中显示的文本
    boolTxt(val) {
      return val ? "是 (确定)" : "否 (取消)";
    },
    // 验证是否是监听的端口
    verification() {
      const port = window.location.port;
      // if (port === "8080") {
      //   return true;
      // }
      const oldPort = GM_getValue("SD_webui_listen_port") || "7860";
      if (port === oldPort || oldPort.includes(port)) {
        return true;
      } else {
        return false;
      }
    },
    // 通用的"是否"的设置方式
    setItem(txt, base, key) {
      let val = JSON.parse(localStorage.getItem(key));
      if (val === undefined || val === null) {
        val = base;
        localStorage.setItem(key, val);
      }
      txt = txt.replace("base", this.boolTxt(base)) + this.boolTxt(val);
      const newVal = confirm(txt);
      if (newVal !== val) {
        localStorage.setItem(key, newVal);
      }
    },
    // 使用一条记录后列表是否隐藏
    setIsHiddenList(base = true, key = "ll-history-list_isHiddenList") {
      this.setItem(this.txt.isHiddenList, base, key);
    },
    // 是否在进入页面时自动加载上次使用的提示词和配置
    setIsAutoLoadTag(base = true, key = "ll-history-list_isAutoLoadTag") {
      this.setItem(this.txt.isAutoLoadTag, base, key);
    },
    // 列表最大长度
    setListMaxLen(base = 200, key = "ll-history-list_listMaxLen") {
      const txt = this.txt.listMaxLen + base;
      let val = localStorage.getItem(key);
      const newVal = prompt(txt, val);
      if (newVal === null) {
        return;
      }
      if (!+val) {
        val = base;
        localStorage.setItem(key, val);
      }
      if (newVal !== val) {
        localStorage.setItem(key, newVal);
      }
    },
    // 设置列表按钮的显示方式
    setBtnShowMode(base = "单击", key = "ll-history-list_btnShowMode") {
      const txt = this.txt.showMode.replace("base", base);
      let val = localStorage.getItem(key);
      if (!val) {
        val = base;
        localStorage.setItem(key, val);
      }
      const newVal = prompt(txt, val);
      if (newVal === null) {
        return;
      }
      if (newVal !== val) {
        if (newVal === "双击") {
          localStorage.setItem(key, "双击");
        } else if (newVal === "显示" || newVal === "一直显示") {
          localStorage.setItem(key, "显示");
        } else {
          localStorage.setItem(key, base);
        }
      }
    },
    // 设置监听端口
    setListenPort(base = "7860", key = "SD_webui_listen_port") {
      const txt = this.txt.listenPort + base;
      let val = GM_getValue(key);
      if (!val) {
        val = base;
        localStorage.setItem(key, val);
      }
      let newVal = prompt(txt, val);
      if (newVal === null) {
        return;
      }
      if (newVal) {
        newVal = newVal.replaceAll("，", ",");
      }
      if (newVal !== val) {
        GM_setValue(key, newVal);
        history.go(0);
      }
    },
    // 设置选择器
    setSelectors(key = "SD_webui_selectors") {
      const txt = this.txt.selectors;
      const localSelectors = JSON.parse(localStorage.getItem(key));
      const curSelectors = JSON.stringify(localSelectors.value)
        .replaceAll(",", ", ")
        .replaceAll(":", ": ");
      let selectors = prompt(txt, curSelectors);
      if (newVal === null) {
        return;
      }
      if (selectors && selectors !== curSelectors) {
        if (selectors === "default" || selectors === "默认") {
          selectors = document.tools_dom.webui_dom.selectors;
        }
        try {
          selectors = JSON.parse(selectors);
        } catch (e) {
          selectors = document.tools_dom.webui_dom.selectors;
        }
        localStorage.setItem(
          key,
          JSON.stringify({
            value: selectors,
            versions: document.tools_dom.versions,
          })
        );
        history.go(0);
      }
    },
    // 使用旧的选择器
    useOldSelectors(
      key = "SD_webui_selectors_old",
      key2 = "SD_webui_selectors"
    ) {
      // 获取旧的值
      const oldSelectors = JSON.parse(localStorage.getItem(key));
      if (oldSelectors) {
        let txt = this.txt.oldSelectors
          .replace("versions", document.tools_dom.versions)
          .replace("oldVersions", oldSelectors.oldVersions)
          .replace(
            "oldSelectors",
            JSON.stringify(oldSelectors.value)
              .replaceAll("{", "{\n")
              .replaceAll("}", "\n}")
              .replaceAll("[", "[\n")
              .replaceAll("]", "\n]")
              .replaceAll(",", ",\n")
              .replaceAll(":", ": ")
          );
        const is = confirm(txt);
        if (is) {
          localStorage.setItem(
            key2,
            JSON.stringify({
              value: oldSelectors.value,
              versions: document.tools_dom.versions,
            })
          );
          history.go(0);
        }
      } else {
        alert("不存在旧的选择器配置");
      }
    },
    // 设置菜单
    registerMenu() {
      this.isTarget = this.verification();
      this.isTarget &&
        GM_registerMenuCommand("基础设置", () => {
          this.setIsHiddenList();
          this.setIsAutoLoadTag();
          this.setListMaxLen();
          this.setBtnShowMode();
          history.go(0);
        });
      GM_registerMenuCommand("监听端口", () => {
        this.setListenPort();
      });
      this.isTarget &&
        GM_registerMenuCommand("选择器配置", () => {
          this.setSelectors();
        });
      this.isTarget &&
        GM_registerMenuCommand("重置为旧的选择器配置", () => {
          this.useOldSelectors();
        });
    },
    init() {
      this.registerMenu();
    },
  };
  main.init();
  if (!main.isTarget) {
    return;
  }
  
  const selectors_selectors = {
    gRoot: "body gradio-app",
    startBtn: "#txt2img_generate",
    skipBtn: "#txt2img_skip",
    settingsBar: "#quicksettings",
    positiveEle: "#txt2img_prompt textarea",
    negativeEle: "#txt2img_neg_prompt textarea",
    positiveBox: "#txt2img_prompt",
    negativeBox: "#txt2img_neg_prompt",
    methodBox: "#txt2img_sampling",
    methodsArr: "#txt2img_sampling input",
    methodsTxtArr: "#txt2img_sampling label span",
    stepsEle: "#txt2img_steps > input",
    widthEle: "#txt2img_width > input",
    heightEle: "#txt2img_height > input",
    countEle: "#txt2img_batch_count > input",
    sizeEle: "#txt2img_batch_size > input",
    cfgEle: "#txt2img_cfg_scale > input",
    seedEle: "#txt2img_seed input",
    modEle: "#setting_sd_model_checkpoint input",
  };
  function getSlideBar(ele) {
    return ele.parentElement.parentElement.parentElement.nextElementSibling;
  }
  function emitEvent(ele, eventType) {
    try {
      if (ele.dispatchEvent) {
        var evt = new Event(eventType, { bubbles: !1, cancelable: !1 });
        ele.dispatchEvent(evt);
      } else ele.fireEvent && ele.fireEvent("on" + eventType);
    } catch (e) {}
  }
  function getControls(dom) {
    let methodEleValue;
    if (dom.methodSelect) methodEleValue = +dom.methodSelect.selectIndex || 0;
    else {
      const curChecked = dom.methodBox.querySelector("[type='radio']:checked");
      for (let i = 0; i < dom.methodsArr.length; i++)
        dom.methodsArr[i] === curChecked && (methodEleValue = i);
    }
    return {
      samplingSteps: dom.stepsEle.value,
      samplingMethod: methodEleValue,
      width: dom.widthEle.value,
      height: dom.heightEle.value,
      batchCount: dom.countEle.value,
      batchSize: dom.sizeEle.value,
      cfgScale: dom.cfgEle.value,
      seed: dom.seedEle.value,
    };
  }
  function saveControls(dom) {
    const controls = getControls(dom);
    localStorage.setItem("controls", JSON.stringify(controls));
  }
  function addCss(cssText, box = document.body, id = "") {
    const style = document.createElement("style");
    return (
      id && (style.id = id),
      box.appendChild(style),
      (style.innerHTML = cssText),
      style
    );
  }
  const listCss =
    "\n.ll-history-list {\n  transition: all 0.4s cubic-bezier(0.32, 0.1, 0.16, 1) 0s;\n  transform-origin: top;\n  scroll-behavior: smooth;\n  overflow-y: auto;\n}\n.ll-history-list .history-list {\n  word-break: break-all;\n  white-space: pre-wrap;\n}\n.ll-history-list .history-list .item-control {\n  word-break: initial;\n}\n.ll-history-list .history-list .item-control {\n  display: flex;\n  gap: 4px;\n  height: 25px;\n  line-height: 25px;\n  font-size: 17px;\n  border-bottom: 1px solid #ccc;\n  overflow: hidden;\n  cursor: default;\n}\n.ll-history-list .history-list .hItem {\n  font-size: 13px;\n  cursor: pointer;\n  padding: 6px 0;\n  overflow-y: auto\n}\n.ll-history-list .history-list .item-tt {\n  font-size: 13px;\n  line-height: 27px;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  overflow: hidden;\n}\n.ll-history-list .history-list .bottom_text {\n  padding: 8px 0;\n  text-align: center;\n  color: #aaa;\n  cursor: pointer;\n}\n";
  function createSwitchBtn({
    box,
    svg,
    text = ">",
    size = 25,
    lineHeight,
    top = 1,
    right = -28,
    titleText = "显示/隐藏历史记录",
    className = "",
    fontSize = 14,
    fontWeight = 400,
    zIndex = 900,
    color = "#65aaff",
    bg = "#fff",
    bd = "1px solid #b7cffe",
    hover = "#65aaff",
    hover_bg = "#f7fbff",
    hover_bd = "1px solid #b7cffe",
    click = "#65aaff",
    click_bg = "#f7fbff",
    click_bd = "1px solid #b7cffe",
    fontFamily = "initial",
    showMode = "单击",
    isChangeColor = !0,
    isPosition = !0,
    child,
  } = {}) {
    if (!box) return;
    let width = size,
      height = size;
    if ("string" == typeof size && size.includes("x")) {
      const sizeArr = size.split("x");
      (width = sizeArr[0]), (height = sizeArr[1]);
    }
    const btnEle = document.createElement("div");
    (btnEle.innerHTML = svg || text),
      child && btnEle.appendChild(child),
      (btnEle.title = titleText),
      (btnEle.className = className + " ll-history-btn");
    const positionCss = isPosition
      ? `\nposition: absolute;\nz-index: ${zIndex};\ntop: ${top}px;\nright: ${right}px;`
      : "";
    (btnEle.style.cssText =
      `\n${child ? "display: flex;" : ""}\nmin-width: 10px;\nwidth: ${
        "auto" === width ? "auto" : width + "px"
      };\nheight: ${
        "auto" === height ? "auto" : height + "px"
      };\nline-height: ${
        lineHeight || parseInt(height) - 3
      }px;\nfont-size: ${fontSize}px;\nfont-weight: ${fontWeight};\ntext-align: center;\ncolor: ${color};\nbackground: ${bg};\n${
        bd ? "border:" + bd + ";" : ""
      }\nborder-radius: 6px;\nbox-sizing: border-box;\ncursor: pointer;\ndisplay: ${
        "显示" === showMode ? "block" : "none"
      };\nfont-family: ${fontFamily};` + positionCss),
      (btnEle.btn_info = {
        isSvg: !!svg,
        showMode,
        isChangeColor,
        color,
        bg,
        bd,
        hover,
        hover_bg,
        hover_bd,
        click,
        click_bg,
        click_bd,
      });
    const btn_info = btnEle.btn_info;
    return (
      btnEle.addEventListener("mouseenter", () => {
        btn_info.isChangeColor &&
          ((btnEle.style.color = hover),
          (btnEle.style.fill = hover),
          (btnEle.style.background = hover_bg),
          bd && (btnEle.style.border = hover_bd),
          (btnEle.isHover = !0),
          btn_info.isSvg &&
            btnEle.children[0] &&
            (btnEle.children[0].style.fill = btn_info.hover));
      }),
      btnEle.addEventListener("mouseleave", () => {
        btn_info.isChangeColor &&
          (btnEle.isClicked ||
            ((btnEle.style.color = color),
            (btnEle.style.fill = color),
            (btnEle.style.background = bg),
            bd && (btnEle.style.border = bd),
            btn_info.isSvg &&
              btnEle.children[0] &&
              (btnEle.children[0].style.fill = btn_info.color)),
          (btnEle.isHover = !1));
      }),
      box.appendChild(btnEle),
      btnEle
    );
  }
  function createHistoryList({
    list_id = "SD_list_1",
    box,
    width = 350,
    maxHeight = 500,
    liMaxHeight = 220,
    top = 1,
    right = -382,
    fontSize = 12,
    maxLen = 100,
    title = "双击返回顶部",
    cssText = "",
    hoverColor = "#f7fbff",
    num_color = "#b5d6ff",
    tt_color = "#b5d6ff",
    tt_maxLen,
    saveName = "ll-history-list",
    outName = "列表数据",
    controlTitle = "这里是工具栏",
    listTitle = "双击一条记录即可使用",
    bottomTT = "点击返回顶部",
    className = "",
    initialText = "无历史记录",
    bottomText = "没有更多的数据了",
    dataSyncText = "正在同步其他页面的数据, 请稍后再试",
    syncEndText = "数据同步完成, 请重新操作",
    errorSyncText = "操作失败, 当前项的数据可能在其他页面中已删除",
    zIndex = 900,
    color = "#333",
    bg = "#fff",
    bd = "3px solid #dfedfe",
    pd = "6px 5px 6px 10px",
    fontFamily = "math",
    isCenter = !1,
    isDelete = !0,
    isDelRepeat = !0,
    isExit = !1,
    isOut = !0,
    isClickClose = !0,
    isDesc = !0,
    isAddUp = !0,
    isDataStrict = !0,
    isScrollStyle = !0,
    isDataSync = !1,
    controlCfg,
    controlArr = [],
    setValue,
    getValue,
  } = {}) {
    if (!box) return;
    "relative" !== box.style.position &&
      "absolute" !== box.style.position &&
      "fixed" !== box.style.position &&
      (box.style.position = "relative");
    const hList = document.createElement("div");
    (hList.id = list_id || ""),
      (hList.className =
        className + " ll-history-list ll-scroll-style-1 ll-scroll-1-size-2"),
      (hList.title = title),
      (hList.style.scrollBehavior = "smooth"),
      (hList.innerHTML =
        '<div class="list-control"></div><div class="move-control-box"></div><div class="history-list text-list"></div>');
    const control = hList.querySelector(".list-control"),
      moveControlBox = hList.querySelector(".move-control-box"),
      listEle = hList.querySelector(".text-list");
    (control.title = controlTitle), (listEle.title = listTitle);
    const topEle = document.createElement("div");
    (topEle.className = "to-top"),
      (topEle.innerHTML = "^"),
      (listEle.list_info = {
        className,
        saveName,
        outName,
        maxLen,
        maxHeight,
        liMaxHeight,
        num_color,
        tt_color,
        tt_maxLen,
        initialText,
        bottomText,
        dataSyncText,
        syncEndText,
        errorSyncText,
        isDelete,
        isDelRepeat,
        isExit,
        isOut,
        isClickClose,
        isDesc,
        isAddUp,
        isDataStrict,
        isDataSync,
        control,
        bottomTT,
        list_id,
        setValue,
        getValue,
      }),
      (control.eleList = { move_control: moveControlBox }),
      (control.info = {}),
      (control.style.cssText = "display: flex;\nflex-wrap: wrap;"),
      (moveControlBox.style.cssText =
        "display: flex;\nposition: absolute;\nright: 0;\ntop: 0;"),
      (hList.style.cssText = `width: ${width}px;\nmax-height: ${maxHeight}px;\nline-height: ${
        fontSize + 5
      }px;\nfont-size: ${fontSize}px;\ncolor: ${color};\nbackground: ${bg};\nposition: absolute;\nz-index: ${zIndex};\ntop: ${top}px;\nright: ${right}px;\nbox-sizing: border-box;\nborder: ${bd};\nborder-radius: 8px;\npadding: ${pd};\ntransform: scaleY(0);\nfont-family: ${fontFamily};`),
      (listEle.style.cssText = `\n  ${isCenter ? "text-align: center" : ""};`),
      "none" !== cssText &&
        (isScrollStyle
          ? addCss(
              cssText +
                listCss +
                "\n.ll-scroll-style-1::-webkit-scrollbar,\n.ll-scroll-style-1 ::-webkit-scrollbar {\n  width: 8px;\n}\n.ll-scroll-1-size-2::-webkit-scrollbar,\n.ll-scroll-style-1 .ll-scroll-1-size-2::-webkit-scrollbar {\n  width: 10px;\n}\n.ll-scroll-1-size-3::-webkit-scrollbar,\n.ll-scroll-style-1 .ll-scroll-1-size-3::-webkit-scrollbar {\n  width: 12px;\n}\n.ll-scroll-style-1::-webkit-scrollbar-thumb,\n.ll-scroll-style-1 ::-webkit-scrollbar-thumb {\n  border-radius: 10px;\n  -webkit-box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.05);\n  opacity: 0.2;\n  background: #daedff;\n}\n.ll-scroll-style-1::-webkit-scrollbar-track,\n.ll-scroll-style-1 ::-webkit-scrollbar-track {\n  -webkit-box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.08);\n  border-radius: 0;\n  background: #fff;\n  border-radius: 5px;\n}",
              box,
              "ll-scroll-style-1"
            )
          : addCss(cssText + listCss, box)),
      (control.cfg = {
        name: "cfg",
        height: 24,
        fontSize: 12,
        color: "#65aaff",
        bg: "#dfedfe",
        mg: "0 2px 4px 2px",
        bd: "1px solid #dfedfe",
        pd: "0 5px",
        radius: 6,
        hover: "#65aaff",
        hover_bg: "#cee4ff",
        hover_bd: "1px solid #dfedfe",
        move_height: 24,
        move_fontSize: 12,
        move_mg: "0 4px 0 0",
        move_pd: "0 5px",
        move_radius: 5,
        ...controlCfg,
      });
    const defaControls = {
      add: {
        name: "add",
        text: "添加",
        type: "top",
        title: "添加一项记录至列表末尾",
        class: "control-add",
        noneText: "请填写内容！！",
        endText: "添加成功",
      },
      search: {
        name: "search",
        text: "搜索",
        type: "top",
        searchType: "标题",
        title:
          "搜索所有记录的标题, 若要按描述搜索请先输入'描述=', 按内容搜索输入'内容=', 按日期搜索输入'日期='",
        class: "control-search",
      },
      clear: {
        name: "clear",
        text: "清空",
        type: "top",
        title: "清空列表所有记录",
        class: "control-clear",
        hover_bg: "#fff",
        warnText: "是否清空列表？",
        twoWarnText: "请再次确认是否清空列表？清空数据后将无法复原！",
      },
      import: {
        name: "import",
        text: "导入",
        type: "top",
        title: "导入含数据记录的json文件",
        class: "control-import",
        startTipText:
          "导入数据后当前列表数据将会被覆盖, 建议导入数据前先备份数据",
        submitText:
          "导入数据后当前列表数据将会被覆盖, 建议导入数据前先备份数据, 是否确认导入?",
        uploadingText: "当前已存在上传任务",
        timeoutText: "文件上传超时",
        endText: "导入成功",
        isUploading: !1,
      },
      out: {
        name: "out",
        text: "导出",
        type: "top",
        title: "将列表的所有记录导出为json文件",
        class: "control-out",
        startText: "开始下载",
        isTime: !0,
        isFormat: !1,
      },
      skip: {
        name: "skip",
        text: "跳转",
        type: "top",
        title: "快速跳转到对应名称的记录的位置",
        class: "control-skip",
      },
      fold: {
        name: "fold",
        text: "折叠",
        maxHeight: 45,
        noFoldText: "展开",
        type: "top",
        title: "将每条记录收起, 以节省空间",
        class: "control-fold",
        isFold: !1,
      },
      delete: {
        name: "delete",
        text: "删除",
        type: "move",
        title: "删除此条记录",
        class: "control-delete",
        bg: "#fff",
        hover: "#ff8b8b",
        hover_bg: "#fff",
        hover_bd: "1px solid #ffd4d4",
        warnText: "是否确认删除？",
        endText: "删除成功",
      },
      update: {
        name: "update",
        text: "修改",
        type: "move",
        title: "修改此条记录",
        class: "control-update",
        noneText: "请填写内容！！",
        submitText: "是否确认修改？",
        endText: "修改成功",
      },
      move: {
        name: "move",
        text: "移动",
        type: "move",
        title: "将当前项移动到下次点击的项的的上方",
        class: "control-move",
        tipText: "请选择目标位置的项",
        warnText: "是否将当前项移动到该项之前？",
        endText: "移动完成",
        isMoving: !1,
      },
      changePlace: {
        name: "changePlace",
        text: "换位",
        type: "move",
        title: "将当前项和点击的另一项进行位置交换",
        class: "control-changePlace",
        tipText: "请选择需要交换位置的项",
        warnText: "是否交换两项的位置？",
        endText: "换位成功",
        isChangePlaceing: !1,
      },
      desc: {
        name: "desc",
        text: "描述",
        type: "move",
        title: "当前记录的描述文本",
        class: "control-desc",
      },
      toSuki: {
        name: "toSuki",
        text: "收藏",
        type: "move",
        title: "将当前记录添加到收藏列表中",
        class: "control-toSuki",
        endText: "已添加至收藏",
      },
      copy: {
        name: "copy",
        text: "复制",
        type: "move",
        title: "复制到剪贴板",
        class: "control-copy",
        endText: "已复制到剪贴板",
      },
      toTop: {
        width: 20,
        height: 20,
        name: "toTop",
        text: "^",
        type: "other",
        title: "返回顶部",
        class: "control-toTop",
        bg: "#fff",
        hover_bg: "#fff",
        bd: "1px solid #dfedfe",
        color: "#65aaff",
        hover: "#65aaff",
        hover_bd: "1px solid #65aaff",
        fontSize: 14,
        pd: "3px 0 0 0",
        isCenter: !0,
        css: "position:absolute; bottom:4px; right:4px;",
      },
      toBottom: {
        name: "toBottom",
        text: "底部",
        type: "top",
        title: "滚动到列表底部",
        class: "control-toBottom",
      },
    };
    return (
      controlArr.forEach((item) => {
        control.info[item.name] = { ...defaControls[item.name], ...item };
      }),
      (control.top_eleList = {}),
      (control.move_eleList = {}),
      (control.other_eleList = {}),
      listEle.addEventListener("mouseover", (e) => {
        const item = e.target;
        item.classList.contains("hItem") &&
          (item.style.backgroundColor = hoverColor);
      }),
      listEle.addEventListener("mouseout", (e) => {
        const item = e.target;
        item.classList.contains("hItem") &&
          (item.style.backgroundColor = "#fff");
      }),
      (function addControlDom(control) {
        function createControl({ obj, box, type } = {}) {
          (type = type ? type + "_" : ""), (box = box || obj.box || null);
          const dom = document.createElement("div"),
            cfg = control.cfg;
          (dom.className = obj.class),
            (dom.title = obj.title),
            (dom.innerText = obj.text);
          const width = obj.width || cfg[type + "width"] || cfg.width;
          return (
            (dom.style.cssText = `\nheight: ${
              obj.height || cfg[type + "height"] || cfg.height
            }px;\nline-height: ${
              obj.height || cfg[type + "height"] || cfg.height
            }px;\nwidth: ${width ? width + "px" : "auto"};\nfont-size: ${
              obj.fontSize || cfg[type + "fontSize"] || cfg.fontSize
            }px;\ncolor: ${
              obj.color || cfg[type + "color"] || cfg.color
            };\nbackground: ${obj.bg || cfg[type + "bg"] || cfg.bg};\nmargin: ${
              ("move_" === type ? obj[type + "mg"] : obj.mg) || cfg.mg
            };\nborder: ${
              obj.bd || cfg[type + "bd"] || cfg.bd
            };\nborder-radius: ${
              obj.radius || cfg[type + "radius"] || cfg.radius
            }px;\nbox-sizing: border-box;\npadding: ${
              obj.pd || cfg[type + "pd"] || cfg.pd
            };\ncursor:pointer;\n${
              obj.isCenter ? "text-align: center;" : ""
            }\n${obj.css ? obj.css : ""}`),
            dom.addEventListener("mouseenter", () => {
              (dom.style.color = obj.hover || cfg.hover),
                (dom.style.background = obj.hover_bg || cfg.hover_bg),
                (dom.style.border = obj.hover_bd || cfg.hover_bd);
            }),
            dom.addEventListener("mouseleave", () => {
              (dom.style.color = obj.color || cfg.color),
                (dom.style.background = obj.bg || cfg.bg),
                (dom.style.border = obj.bd || cfg.bd);
            }),
            box ? box.appendChild(dom) : control.appendChild(dom),
            dom
          );
        }
        const info = control.info;
        if (!control.info) return;
        for (let key in info) {
          const item = info[key];
          "move" === item.type
            ? ((item.ele = createControl({
                obj: item,
                box: control.eleList.move_control,
                type: item.type,
              })),
              (item.ele.info = item))
            : (item.ele = createControl({ obj: item })),
            (control[item.type + "_eleList"][key] = item.ele);
        }
      })(control),
      box.appendChild(hList),
      {
        value: listEle,
        list_info: listEle.list_info,
        control,
        control_info: control.info,
      }
    );
  }
  const icons = {
    base: {
      color: "#666",
      width: "100%",
      height: "80%",
      marginTop: "10%",
      html: "",
    },
    lishi: {
      color: "#8a8a8a",
      width: "100%",
      height: "80%",
      marginTop: "10%",
      html: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1700314086069" style="svgStyleFlag" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4255" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M512.5 98.29c-227.84 0-412.54 184.7-412.54 412.54s184.7 412.54 412.54 412.54 412.54-184.7 412.54-412.54S740.34 98.29 512.5 98.29z m249.28 661.82c-32.4 32.4-70.1 57.82-112.08 75.58-43.42 18.37-89.59 27.68-137.21 27.68-47.62 0-93.78-9.31-137.2-27.68-41.97-17.75-79.68-43.18-112.08-75.58-32.4-32.4-57.82-70.1-75.58-112.08-18.37-43.42-27.68-89.59-27.68-137.21 0-47.62 9.31-93.78 27.68-137.21 17.75-41.97 43.18-79.68 75.58-112.08s70.1-57.82 112.08-75.58c43.42-18.37 89.59-27.68 137.21-27.68 47.62 0 93.78 9.31 137.21 27.68 41.97 17.75 79.68 43.18 112.08 75.58s57.82 70.1 75.58 112.08c18.37 43.42 27.68 89.59 27.68 137.21 0 47.62-9.31 93.78-27.68 137.21-17.77 41.97-43.19 79.68-75.59 112.08z" p-id="4256"></path><path d="M738.68 674.81L542 497.48V248.27c0-16.57-13.43-30-30-30s-30 13.43-30 30v262.55c0 8.5 3.6 16.59 9.91 22.28L698.5 719.37a29.906 29.906 0 0 0 20.08 7.72c8.2 0 16.37-3.34 22.29-9.91 11.1-12.3 10.12-31.27-2.19-42.37z" p-id="4257"></path></svg>',
    },
    shoucang: {
      color: "#fe9850",
      width: "100%",
      height: "80%",
      marginTop: "10%",
      html: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1700314090785" style="svgStyleFlag" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4405" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M949.888 457.258667c26.069333-29.824 13.866667-67.52-24.789333-76.309334L681.728 325.546667l-127.786667-214.677334c-20.266667-34.069333-59.925333-34.090667-80.213333 0l-127.786667 214.677334-243.370666 55.381333c-38.442667 8.746667-50.858667 46.506667-24.789334 76.309333l164.394667 188.053334-22.613333 248.917333c-3.584 39.466667 28.458667 62.805333 64.896 47.146667l237.781333-102.037334a21.333333 21.333333 0 0 0-16.810667-39.210666L267.626667 902.186667c-6.698667 2.88-6.229333 3.221333-5.568-4.096l24.277333-267.093334-176.426667-201.813333c-4.757333-5.461333-4.906667-5.034667 2.133334-6.634667l261.205333-59.434666 137.152-230.4c3.733333-6.293333 3.136-6.293333 6.869333 0l137.173334 230.4 261.205333 59.434666c7.125333 1.621333 6.954667 1.088 2.133333 6.613334l-176.426666 201.813333 24.256 267.093333a21.333333 21.333333 0 1 0 42.496-3.84l-22.613334-248.917333 164.394667-188.053333z" p-id="4406"></path></svg>',
    },
  };
  function getIconHTML({
    name = "",
    svg,
    color,
    width,
    height,
    marginTop,
    css,
  } = {}) {
    let icon;
    if (
      (svg
        ? ((icon = { ...icons.base }), (icon.html = svg))
        : (icon = icons[name]),
      icon)
    )
      return (
        css ||
          (css = `\n    fill:${
            color || icon.color || icons.base.fill
          };\n    width:${
            width || icon.width || icons.base.width
          };\n    height:${
            height || icon.height || icons.base.height
          };\n    margin-top:${
            marginTop || icon.marginTop || icons.base.marginTop
          };`),
        icon.html.replace("svgStyleFlag", css)
      );
  }
  let searchBox,
    searchEndTimerId,
    msgBox,
    msgDom,
    msgId,
    useOne,
    msgZIndex,
    msgTimerId,
    msgEndTimerId,
    message_msgBox,
    message_msgDom,
    message_msgId,
    message_useOne,
    message_msgZIndex,
    message_msgTimerId,
    message_msgEndTimerId;
  function createSearch({
    id = "history-search-box",
    box = document.body,
    title = "以'标题='开头表示按标题搜索, '内容='表示按内容搜索, '描述='表示按描述搜索, '日期='表示按日期搜索",
    width = 200,
    height = 30,
    color = "#333",
    bg = "#fff",
    fontSize = 13,
    bd = "1px solid #aaa",
    hover_bdColor = "#cee4ff",
    pd = "0 8px",
    radius = 5,
    transition = 0.5,
    btnText = "搜索",
    btn_class = "",
    btn_fontSize = 13,
    btn_color = "#65aaff",
    btn_bg = "#dfedfe",
    btn_bd = "1px solid #dfedfe",
    btn_pd = "0 10px",
    btn_radius = 6,
    btn_hover = "#65aaff",
    btn_hover_bg = "#cee4ff",
    btn_hover_bd = "1px solid #dfedfe",
    zIndex = 901,
    placeholder = "请输入搜索的内容",
    isBtn = !0,
    isAutoSearch = !0,
    interval = 500,
  } = {}) {
    const ele = document.createElement("div");
    (ele.id = id),
      (ele.isAutoSearch = isAutoSearch),
      (ele.interval = interval),
      (ele.transition = transition),
      (ele.style.cssText = `display: flex;\nopacity: 0;\nposition: absolute;\nleft: -2000px;\ntop: 0;\nz-index: ${zIndex};\ntransition: opacity ${transition}s`);
    const text_css = `width: ${width}px;\nheight: ${height}px;\nline-height: ${height}px;\ncolor: ${color};\nborder: ${bd};\npadding: ${pd};\nborder-radius: ${radius}px;\noutline: ${hover_bdColor};\nbox-sizing: border-box;`;
    ele.innerHTML = `<input class="search-text ll-scroll-style-1" style="${text_css}"></input>${
      isBtn ? "<div class='search-btn'></div>" : ""
    }`;
    const textEle = ele.querySelector(".search-text");
    (ele.title = title),
      (ele.textEle = textEle),
      (textEle.placeholder = placeholder),
      (textEle.style.fontSize = fontSize + "px"),
      (textEle.style.background = bg),
      (textEle.style.fontFamily = "math");
    const btnEle = ele.querySelector(".search-btn");
    return (
      btnEle &&
        ((btnEle.style.cssText = `height: ${height}px;\nline-height: ${height}px;\nfont-size: ${btn_fontSize}px;\ncolor: ${btn_color};\nbackground: ${btn_bg};\nborder: ${btn_bd};\npadding: ${btn_pd};\nborder-radius: ${btn_radius}px;\nbox-sizing: border-box;\nwhite-space: nowrap;\nfont-family: math;\ncursor:pointer;`),
        (btnEle.className += " " + btn_class),
        (btnEle.innerHTML = btnText),
        (btnEle.style.fontSize = btn_fontSize),
        (btnEle.style.color = btn_color),
        (btnEle.style.fontSize = fontSize + "px"),
        (ele.btnEle = btnEle),
        btnEle.addEventListener("mouseenter", () => {
          (btnEle.style.color = btn_hover),
            (btnEle.style.background = btn_hover_bg),
            (btnEle.style.border = btn_hover_bd);
        }),
        btnEle.addEventListener("mouseleave", () => {
          (btnEle.style.color = btn_color),
            (btnEle.style.background = btn_bg),
            (btnEle.style.border = btn_bd);
        })),
      box.appendChild(ele),
      (function bindSearchEvents(ele) {
        const inputEle = ele.textEle;
        let timerId;
        ele.btnEle.addEventListener("click", () => {
          searchEle();
        }),
          inputEle.addEventListener("keydown", (e) => {
            (13 !== e.keyCode && "enter" !== e.key.toLowerCase()) ||
              0 == +ele.style.opacity ||
              searchEle();
          }),
          inputEle.addEventListener("input", () => {
            ele.isAutoSearch &&
              (clearTimeout(timerId),
              (timerId = setTimeout(() => {
                searchEle();
              }, ele.interval)));
          });
      })(ele),
      (searchBox = ele),
      ele
    );
  }
  function showSearchBox(isShow = !0, originEle = null) {
    const ele = searchBox;
    if (isShow) {
      let left, top, scrollTop;
      if ((clearTimeout(searchEndTimerId), originEle)) {
        const rect = originEle.getBoundingClientRect();
        (left = rect.left),
          (top = rect.top),
          (scrollTop = document.documentElement.scrollTop);
      }
      const h = parseInt(ele.textEle.style.height);
      left && top
        ? ((ele.style.left = left + "px"),
          (ele.style.top = top + scrollTop - h - 12 + "px"))
        : ((ele.style.left = ""),
          (ele.style.right = "12px"),
          (ele.style.top = "12px")),
        (ele.style.opacity = 1);
    } else
      (ele.style.opacity = 0),
        clearTimeout(searchEndTimerId),
        (searchEndTimerId = setTimeout(() => {
          ele.style.left = "-2000px";
        }, 1e3 * ele.transition)),
        hidcenEle(ele.listEle, "");
  }
  function hidcenEle(listEle, text, searchType = "标题") {
    if (!listEle) return;
    "时间" === searchType && (searchType = "日期"),
      text && console.log("搜索" + searchType + ": " + text);
    const liArr = listEle.querySelectorAll(".item-box"),
      len = liArr.length;
    for (let i = 0; i < len; i++) {
      const item = liArr[i];
      text
        ? ("标题" === searchType &&
            item.querySelector(".item-tt").innerText.includes(text)) ||
          ("描述" === searchType &&
            item.querySelector(".item-tt").title.includes(text)) ||
          ("内容" === searchType &&
            item.querySelector(".hItem").innerText.includes(text)) ||
          ("日期" === searchType &&
            item.querySelector(".item-control").title.includes(text))
          ? (item.style.display = "block")
          : (item.style.display = "none")
        : (item.style.display = "block");
    }
  }
  function searchEle() {
    const textEle = searchBox.textEle,
      listEle = searchBox.listEle;
    if (!listEle) return;
    let text = textEle.value,
      searchType = text.slice(0, 3);
    ["标题=", "描述=", "内容=", "日期=", "时间="].includes(searchType)
      ? ((searchType = searchType.slice(0, 2)),
        (text = text.slice(3, text.length)))
      : (searchType = textEle.searchType ? textEle.searchType : "标题"),
      hidcenEle(listEle, text, searchType);
  }
  function formatDate({
    timestamp,
    isYear = !0,
    isExact = !1,
    delimiter = ".",
    midDelimiter = " ",
    delimiter2 = ":",
  } = {}) {
    if (!timestamp) return -1;
    const date = new Date(timestamp),
      year = isYear ? date.getFullYear() : "",
      month = (date.getMonth() + 1).toString().padStart(2, "0"),
      day = date.getDate().toString().padStart(2, "0");
    let leftTime;
    leftTime =
      3 === delimiter.length
        ? `${isYear ? year + delimiter[0] : ""}${month}${delimiter[1]}${day}${
            delimiter[2]
          }`
        : `${isYear ? year + delimiter : ""}${month}${delimiter}${day}`;
    let rigthTime = "";
    if (isExact) {
      const hour = date.getHours().toString().padStart(2, "0"),
        minute = date.getMinutes().toString().padStart(2, "0"),
        second = date.getSeconds().toString().padStart(2, "0");
      rigthTime =
        3 === delimiter2.length
          ? `${midDelimiter}${hour}${delimiter2[0]}${minute}${delimiter2[1]}${second}${delimiter2[2]}`
          : `${midDelimiter}${hour}${delimiter2}${minute}${delimiter2}${second}`;
    }
    return leftTime + rigthTime;
  }
  function message({
    ele,
    title = "",
    content = "",
    msg = "",
    color,
    fontSize,
    tt_color,
    tt_fontSize,
    bg,
    bd,
    pd,
    radius,
    time = "auto",
    disTime = 0,
    postion = "right-top",
    fn,
  } = {}) {
    useOne && (msgDom = null),
      ele ||
        (ele = msgDom) ||
        (msgId &&
          !useOne &&
          (ele = msgDom = document.querySelector("#" + msgId)),
        ele ||
          (ele = msgDom =
            (function createMsg({
              id = "ll-autoCloseMsg",
              box = document.body,
              isUseOne = !0,
              maxWidth = 224,
              color = "#666",
              fontSize = 14,
              tt_color = "#333",
              tt_fontSize = 16,
              bg = "#fff",
              bd = "2px solid #dfedfe",
              pd = "7px 12px",
              radius = 7,
              zIndex = 1100,
              transition = 0.8,
            } = {}) {
              const ele = document.createElement("div");
              (ele.id = id),
                (ele.className = id),
                (msgId = id),
                (ele.style.cssText = `max-width: ${maxWidth}px;\nbackground: ${bg};\nmargin-bottom: 10px;\nborder: ${bd};\npadding: ${pd};\nbox-sizing: border-box;\nborder-radius: ${radius}px;\nopacity: 0;\ntransition: opacity ${transition}s;\nletter-spacing: 1px;`),
                (ele.innerHTML =
                  '<div class="title" style="margin-bottom:5px;font-weight:bold;"></div><div class="msg"></div>'),
                (ele.transition = transition);
              const ttEle = ele.querySelector(".title");
              (ele.ttEle = ttEle),
                (ttEle.style.color = tt_color),
                (ttEle.style.fontSize = tt_fontSize + "px");
              const msgEle = ele.querySelector(".msg");
              return (
                (ele.msgEle = msgEle),
                (msgEle.style.color = color),
                (msgEle.style.fontSize = fontSize + "px"),
                (useOne = isUseOne),
                (ele.isUseOne = isUseOne),
                (msgDom = ele),
                msgBox ||
                  ((msgBox = document.createElement("div")),
                  (msgBox.style.cssText = `\ndisplay: flex;\nflex-direction: column;\nposition: fixed;\nleft: -2000px;\ntop: 0;\nz-index: ${
                    isUseOne ? msgZIndex : zIndex
                  };`),
                  box.appendChild(msgBox)),
                msgBox.appendChild(ele),
                ele
              );
            })())),
      (msg = content || msg);
    const msgEle = ele.msgEle;
    (msgEle.innerText = msg),
      bd && (ele.style.border = bd),
      pd && (ele.style.padding = pd),
      bg && (ele.style.background = bg),
      radius && (ele.style.borderRadius = radius + "px"),
      color && (msgEle.style.color = color),
      fontSize && (msgEle.style.fontSize = fontSize + "px"),
      (msgBox.style.left = "");
    const placeArr = postion.split(/-|_/);
    if (
      ((msgBox.style[placeArr[0]] = placeArr[0] ? "12px" : ""),
      (msgBox.style[placeArr[1]] = placeArr[1] ? "12px" : ""),
      title)
    ) {
      const ttEle = ele.ttEle;
      (ttEle.innerHTML = title),
        tt_color && (ttEle.style.color = tt_color),
        tt_fontSize && (ttEle.style.fontSize = tt_fontSize + "px");
    }
    "auto" === time
      ? (time = (function getShowTime(text) {
          return 410 * text.length + 1500;
        })(msg))
      : (time *= 1e3),
      (time += disTime),
      useOne || (clearTimeout(msgTimerId), clearTimeout(msgEndTimerId)),
      (ele.style.opacity = 1),
      (msgTimerId = setTimeout(() => {
        (ele.style.opacity = 0),
          (msgEndTimerId = setTimeout(() => {
            (msgBox.style.left = -ele.maxWidth - 100 + "px"),
              fn && fn(),
              useOne && ele.remove();
          }, 1e3 * ele.transition));
      }, time));
  }
  function message_message({
    ele,
    title = "",
    content = "",
    msg = "",
    color,
    fontSize,
    tt_color,
    tt_fontSize,
    bg,
    bd,
    pd,
    radius,
    time = "auto",
    disTime = 0,
    postion = "right-top",
    fn,
  } = {}) {
    message_useOne && (message_msgDom = null),
      ele ||
        (ele = message_msgDom) ||
        (message_msgId &&
          !message_useOne &&
          (ele = message_msgDom = document.querySelector("#" + message_msgId)),
        ele ||
          (ele = message_msgDom =
            (function message_createMsg({
              id = "ll-autoCloseMsg",
              box = document.body,
              isUseOne = !0,
              maxWidth = 224,
              color = "#666",
              fontSize = 14,
              tt_color = "#333",
              tt_fontSize = 16,
              bg = "#fff",
              bd = "2px solid #dfedfe",
              pd = "7px 12px",
              radius = 7,
              zIndex = 1100,
              transition = 0.8,
            } = {}) {
              const ele = document.createElement("div");
              (ele.id = id),
                (ele.className = id),
                (message_msgId = id),
                (ele.style.cssText = `max-width: ${maxWidth}px;\nbackground: ${bg};\nmargin-bottom: 10px;\nborder: ${bd};\npadding: ${pd};\nbox-sizing: border-box;\nborder-radius: ${radius}px;\nopacity: 0;\ntransition: opacity ${transition}s;\nletter-spacing: 1px;`),
                (ele.innerHTML =
                  '<div class="title" style="margin-bottom:5px;font-weight:bold;"></div><div class="msg"></div>'),
                (ele.transition = transition);
              const ttEle = ele.querySelector(".title");
              (ele.ttEle = ttEle),
                (ttEle.style.color = tt_color),
                (ttEle.style.fontSize = tt_fontSize + "px");
              const msgEle = ele.querySelector(".msg");
              return (
                (ele.msgEle = msgEle),
                (msgEle.style.color = color),
                (msgEle.style.fontSize = fontSize + "px"),
                (message_useOne = isUseOne),
                (ele.isUseOne = isUseOne),
                (message_msgDom = ele),
                message_msgBox ||
                  ((message_msgBox = document.createElement("div")),
                  (message_msgBox.style.cssText = `\ndisplay: flex;\nflex-direction: column;\nposition: fixed;\nleft: -2000px;\ntop: 0;\nz-index: ${
                    isUseOne ? message_msgZIndex : zIndex
                  };`),
                  box.appendChild(message_msgBox)),
                message_msgBox.appendChild(ele),
                ele
              );
            })())),
      (msg = content || msg);
    const msgEle = ele.msgEle;
    (msgEle.innerText = msg),
      bd && (ele.style.border = bd),
      pd && (ele.style.padding = pd),
      bg && (ele.style.background = bg),
      radius && (ele.style.borderRadius = radius + "px"),
      color && (msgEle.style.color = color),
      fontSize && (msgEle.style.fontSize = fontSize + "px"),
      (message_msgBox.style.left = "");
    const placeArr = postion.split(/-|_/);
    if (
      ((message_msgBox.style[placeArr[0]] = placeArr[0] ? "12px" : ""),
      (message_msgBox.style[placeArr[1]] = placeArr[1] ? "12px" : ""),
      title)
    ) {
      const ttEle = ele.ttEle;
      (ttEle.innerHTML = title),
        tt_color && (ttEle.style.color = tt_color),
        tt_fontSize && (ttEle.style.fontSize = tt_fontSize + "px");
    }
    "auto" === time
      ? (time = (function message_getShowTime(text) {
          return 410 * text.length + 1500;
        })(msg))
      : (time *= 1e3),
      (time += disTime),
      message_useOne ||
        (clearTimeout(message_msgTimerId), clearTimeout(message_msgEndTimerId)),
      (ele.style.opacity = 1),
      (message_msgTimerId = setTimeout(() => {
        (ele.style.opacity = 0),
          (message_msgEndTimerId = setTimeout(() => {
            (message_msgBox.style.left = -ele.maxWidth - 100 + "px"),
              fn && fn(),
              message_useOne && ele.remove();
          }, 1e3 * ele.transition));
      }, time));
  }
  function createEle({
    className = "",
    id = "",
    title = "",
    css,
    box = document.body,
    type = "div",
  } = {}) {
    const ele = document.createElement(type);
    return (
      id && (ele.id = id),
      className && (ele.className = className),
      title && (ele.title = title),
      css && (ele.style.cssText = css),
      box.appendChild(ele),
      ele
    );
  }
  const edit = {
      isEditing: !1,
      editText: {},
      eleList: {},
      callback: { confirmBefore: null, finished: null },
    },
    eleList = edit.eleList;
  function createEditEle({
    id,
    box,
    placeholder = {
      title: "请输入标题",
      desc: "请输入描述",
      value: "请输入内容",
    },
    zIndex = 2e3,
  } = {}) {
    return (
      addCss(
        `.ll-edit-wrap {\n  position: fixed;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  z-index: ${zIndex};\n  background: rgba(0, 0, 0, 0.12);\n}\n.ll-edit-wrap .edit-box {\n  position: relative;\n  width: 480px;\n  top: calc(50% - 250px);\n  margin: auto;\n  color: #333;\n  background: #fff;\n  font-size: 16px;\n  font-family: math;\n  border: 3px solid #dfedfe;\n  border-radius: 10px;\n  box-sizing: border-box;\n  padding: 20px;\n}\n.ll-edit-wrap .edit-box > div {\n  margin-bottom: 15px;\n}\n.ll-edit-wrap .edit-box .edit-item {\n  display: flex;\n}\n.ll-edit-wrap .edit-box textarea {\n  width: 100%;\n  line-height: 18px;\n  border-radius: 6px;\n  padding: 5px 7px;\n  outline-color: #cee4ff;\n  border: 1px solid #aaa;\n  box-sizing: border-box;\n  font-size: 13px;\n  font-family: math;\n  /* 保留空格 */\n  white-space: pre-wrap;\n  /* 允许词内换行 */\n  word-break: break-all;\n  letter-spacing: 1px;\n}\n.ll-edit-wrap .edit-box textarea::placeholder {\n  color: #bbb;\n}\n.ll-edit-wrap .edit-box .title {\n  width: 15%;\n  font-weight: bold;\n  font-size: 18px;\n}\n.ll-edit-wrap .edit-box .content-box .title {\n  width: 100%;\n  margin-bottom: 8px;\n}\n.ll-edit-wrap .edit-box .name-box textarea {\n  height: 30px;\n}\n.ll-edit-wrap .edit-box .desc-box textarea {\n  height: 100px;\n}\n.ll-edit-wrap .edit-box .content-box textarea {\n  width: 100%;\n  height: 200px;\n}\n.ll-edit-wrap .edit-box .btn-box {\n  justify-content: flex-end;\n  margin-bottom: 0;\n}\n.ll-edit-wrap .edit-box .btn-box button {\n  font-size: 16px;\n  color: #65aaff;\n  background: #dfedfe;\n  outline: none;\n  border: none;\n  border-radius: 6px;\n  padding: 8px 16px;\n  box-sizing: border-box;\n  cursor: pointer;\n}\n.ll-edit-wrap .edit-box .btn-box .cancel-btn {\n  color: #888;\n  background: #f4f4f4;\n  margin-right: 20px;\n}\n.ll-edit-wrap .edit-box .btn-box .cancel-btn:hover {\n  color: #666;\n  background: #eee;\n}\n.ll-edit-wrap .edit-box .btn-box .confirm-btn:hover {\n  background: #cee4ff;\n}`
      ),
      (eleList.wrap = createEle({ className: "ll-edit-wrap", box })),
      (eleList.wrap.id = id),
      (eleList.wrap.innerHTML =
        '<div class="edit-box">\n  <div class="edit-item name-box">\n    <div class="name title">标 题</div>\n    <textarea class="edit-name" placeholder="" title="拖动右下角可调节宽高"></textarea>\n  </div>\n  <div class="edit-item desc-box">\n    <div class="desc title">描 述</div>\n    <textarea class="edit-desc" placeholder="" title="拖动右下角可调节宽高"></textarea>\n  </div>\n  <div class="content content-box">\n    <div class="desc title">内 容</div>\n    <textarea class="edit-content" placeholder="" title="拖动右下角可调节宽高"></textarea>\n  </div>\n  <div class="edit-item btn-box">\n    <button class="cancel-btn">取 消</button>\n    <button class="confirm-btn">确 认</button>\n  </div>\n</div>'),
      (eleList.wrap.style.display = "none"),
      (eleList.box = eleList.wrap.children[0]),
      (eleList.box.className = eleList.box.className + " ll-scroll-style-1"),
      (eleList.title = eleList.box.querySelector(".edit-name")),
      (eleList.desc = eleList.box.querySelector(".edit-desc")),
      (eleList.value = eleList.box.querySelector(".edit-content")),
      (eleList.cancel = eleList.box.querySelector(".cancel-btn")),
      (eleList.confirm = eleList.box.querySelector(".confirm-btn")),
      (eleList.title.placeholder = placeholder.title),
      (eleList.desc.placeholder = placeholder.desc),
      (eleList.value.placeholder = placeholder.value),
      (function bindEvents() {
        function cancelEdit(e) {
          ("ll-edit-wrap" !== e.target.className &&
            "cancel-btn" !== e.target.className) ||
            (showEditArea(!1), clearEditData());
        }
        function confirmEdit() {
          const data = (function getEditData() {
            return {
              title: eleList.title.value,
              desc: eleList.desc.value,
              value: eleList.value.value,
            };
          })();
          if (edit.callback.confirmBefore) {
            let result;
            const func = edit.callback.confirmBefore;
            if (
              (Array.isArray(func)
                ? func.curFn
                  ? ((result = func[curFn](data)), (func.curFn = null))
                  : func.forEach((fn) => {
                      result = fn(data);
                    })
                : (result = func(data)),
              !1 === result)
            )
              return;
          }
          if (eleList.value.value) {
            if ((showEditArea(!1), clearEditData(), edit.callback.finished)) {
              const func = edit.callback.finished;
              Array.isArray(func)
                ? func.curFn
                  ? (func[curFn](data), (func.curFn = null))
                  : func.forEach((fn) => {
                      fn(data);
                    })
                : func(data);
            }
          } else alert(edit.msg.noneText || "请填写内容！！");
        }
        eleList.wrap.addEventListener("click", cancelEdit),
          eleList.cancel.addEventListener("click", cancelEdit),
          eleList.confirm.addEventListener("click", confirmEdit);
      })(),
      edit
    );
  }
  function showEditArea(isShow = !0) {
    (edit.isEditing = isShow),
      (eleList.wrap.style.display = isShow ? "block" : "none");
  }
  function clearEditData() {
    (eleList.title.value = ""),
      (eleList.desc.value = ""),
      (eleList.value.value = "");
  }
  function changeShow(controlObj, isShow = "") {
    for (let key in controlObj) {
      const curStyle = controlObj[key].style;
      curStyle.display =
        "" === isShow
          ? "none" === curStyle.display
            ? "block"
            : "none"
          : isShow
          ? "block"
          : "none";
    }
  }
  function showItemControlEvent(control, info) {
    const listEle = info.listEle,
      moveBox = control.eleList.move_control;
    changeShow(control.move_eleList, !1),
      listEle.addEventListener("click", (e) => {
        const item = e.target;
        if (item.classList.contains("hItem")) {
          if (
            (item === listEle.curClickEle
              ? changeShow(control.move_eleList)
              : changeShow(control.move_eleList, !0),
            (moveBox.style.top =
              item.offsetTop - control.cfg.move_height - 3 + "px"),
            (listEle.oldClickEle = listEle.curClickEle),
            (listEle.curClickEle = item),
            (listEle.curId = item.id),
            control.info.move &&
              control.info.move.isMoving &&
              item !== listEle.oldClickEle)
          ) {
            const move = control.info.move;
            (!move.warnText || confirm(move.warnText)) &&
              (!(function moveItem({ info, ele, toEle, id, toId } = {}) {
                const listEle = info.listEle;
                !ele && id
                  ? (ele = listEle.querySelector(`[id='${id}'`))
                  : ele || id || (ele = listEle.oldClickEle);
                !toEle && toId
                  ? (toEle = listEle.querySelector(`[id='${id}'`))
                  : toEle || toId || (toEle = listEle.curClickEle);
                !id && (id = +ele.id), !toId && (toId = +toEle.id);
                const list_info = listEle.list_info,
                  newDataList = updateDataList(info),
                  dataList = info.dataList,
                  index = dataList.map((item) => +item.id).indexOf(id);
                if (-1 === index)
                  return (
                    console.log("操作失败, 当前项的数据可能在其他页面中已删除"),
                    void message({
                      title: "移动",
                      msg: info.listEle.list_info.errorSyncText,
                    })
                  );
                const data = dataList.splice(index, 1)[0];
                let toIndex = dataList.map((item) => +item.id).indexOf(toId);
                list_info.isAddUp && (toIndex += 1),
                  dataList.splice(toIndex, 0, data),
                  newDataList
                    ? initHisListDom(info)
                    : (listEle.insertBefore(
                        ele.parentElement,
                        toEle.parentElement
                      ),
                      resetNum(listEle));
                (ele = toEle = null),
                  list_info.setValue
                    ? list_info.setValue(
                        list_info.saveName,
                        JSON.stringify(dataList)
                      )
                    : localStorage.setItem(
                        list_info.saveName,
                        JSON.stringify(dataList)
                      );
              })({ info }),
              message({ title: move.text, msg: move.endText }),
              changeShow(control.move_eleList, !1)),
              (move.isMoving = !1);
          }
          if (
            control.info.changePlace &&
            control.info.changePlace.isChangePlaceing &&
            item !== listEle.oldClickEle
          ) {
            const changeP = control.info.changePlace;
            (!changeP.warnText || confirm(changeP.warnText)) &&
              (!(function changePlace({ info, ele, toEle, id, toId } = {}) {
                const listEle = info.listEle;
                !ele && id
                  ? (ele = listEle.querySelector(`[id='${id}'`))
                  : ele || (ele = listEle.oldClickEle);
                !toEle && toId
                  ? (toEle = listEle.querySelector(`[id='${id}'`))
                  : toEle || (toEle = listEle.curClickEle);
                if (
                  (!id && (id = +ele.id),
                  !toId && (toId = +toEle.id),
                  ele && toEle)
                ) {
                  const eleData = getItemData({ info, ele }),
                    toEleData = getItemData({ info, ele: toEle });
                  if (!eleData || !toEleData)
                    return void console.log("数据获取失败");
                  toEleData.id = 1234;
                  const changeInfo = updateItem({
                    info,
                    ele,
                    data: toEleData,
                    isSave: !1,
                  });
                  updateItem({ info, ele: toEle, data: eleData, isSave: !1 }),
                    (info.dataList[changeInfo.index].id = toId),
                    (changeInfo.ele.id = toId),
                    resetNum(listEle);
                  const list_info = listEle.list_info;
                  list_info.setValue
                    ? list_info.setValue(
                        list_info.saveName,
                        JSON.stringify(info.dataList)
                      )
                    : localStorage.setItem(
                        list_info.saveName,
                        JSON.stringify(info.dataList)
                      );
                }
              })({ info }),
              message({ title: move.text, msg: move.endText }),
              changeShow(control.move_eleList, !1)),
              (changeP.isChangePlaceing = !1);
          }
        }
        e.stopPropagation();
      });
  }
  function controlEvents(control, info, searchEle, editInfo) {
    if (!control) return;
    const listEle = info.listEle,
      control_info = control.info;
    if (
      (showItemControlEvent(control, info),
      control_info.add &&
        control_info.add.ele.addEventListener("click", (e) => {
          showEditArea(),
            (editInfo.msg = { noneText: control_info.add.noneText }),
            (editInfo.callback.finished = (data) => {
              addItem({
                title: data.title,
                desc: data.desc,
                value: data.value,
                info,
              }),
                message({
                  title: control_info.add.text,
                  msg: control_info.add.endText,
                });
            }),
            e.stopPropagation();
        }),
      control_info.clear &&
        control_info.clear.ele.addEventListener("click", (e) => {
          if (confirm(control_info.clear.warnText)) {
            confirm(control_info.clear.twoWarnText) &&
              (!(function clearList(info) {
                (info.listEle.innerHTML = ""),
                  (info.dataList = []),
                  bottomText(info);
                const list_info = info.listEle.list_info;
                list_info.setValue
                  ? list_info.setValue(list_info.saveName, "[]")
                  : localStorage.removeItem(list_info.saveName);
              })(info),
              changeShow(control.move_eleList, !1));
          }
          e.stopPropagation();
        }),
      control_info.search)
    ) {
      const search = control_info.search;
      (search.eleList = {}),
        search.ele.addEventListener("click", (e) => {
          let isShow = 0 == +searchEle.style.opacity;
          listEle !== searchEle.listEle && (isShow = !0),
            isShow && message({ title: search.text, msg: search.title }),
            (searchEle.textEle.value = ""),
            (searchEle.listEle = listEle),
            (searchEle.textEle.searchType = search.searchType),
            showSearchBox(isShow, search.ele),
            e.stopPropagation();
        });
      const inputEle = searchEle.textEle;
      searchEle.btnEle.addEventListener("click", () => {
        changeShow(control.move_eleList, !1);
      }),
        inputEle.addEventListener("keydown", (e) => {
          13 === e.keyCode &&
            0 != +searchEle.style.opacity &&
            changeShow(control.move_eleList, !1);
        }),
        inputEle.addEventListener("input", () => {
          searchEle.isAutoSearch && changeShow(control.move_eleList, !1);
        });
    }
    if (control_info.import) {
      const uploadFile = control_info.import;
      uploadFile.ele.addEventListener("click", (e) => {
        if (uploadFile.isUploading)
          return (
            message({ title: uploadFile.text, msg: uploadFile.uploadingText }),
            void console.log(uploadFile.uploadingText)
          );
        message({ title: uploadFile.text, msg: uploadFile.startTipText }),
          (function fileUpload_fileUpload({
            uploadObj,
            startTt = "上传",
            startText = "开始上传",
            endTt = "上传",
            endText = "上传完成",
            errorTt = "文件上传",
            errorMsg = "上传失败",
            startFn,
            finishFn,
            errorFn,
            timeoutFn,
          } = {}) {
            let input = document.createElement("input");
            (input.type = "file"),
              input.click(),
              input.addEventListener("change", (e) => {
                startText &&
                  message_message({ title: startTt, msg: startText });
                const fileObj = e.target.files[0],
                  reader = new FileReader();
                reader.readAsText(fileObj);
                const data = { info: fileObj, data: {} };
                (startFn && null === startFn(data)) ||
                  (uploadObj.timer && clearTimeout(uploadObj.timer),
                  (uploadObj.timer = setTimeout(() => {
                    uploadObj &&
                      uploadObj.isUploading &&
                      (timeoutFn && timeoutFn(),
                      message_message({
                        title: errorTt,
                        msg: "'" + fileObj.name + "'" + errorMsg,
                      }),
                      console.log("文件上传超时"));
                  }, 12e4)),
                  (reader.onload = function (readRes) {
                    try {
                      data.data = readRes.target.result;
                      const msg = "'" + fileObj.name + "'" + endText;
                      endText && message_message({ title: endTt, msg }),
                        console.log("上传成功: ", data.data),
                        finishFn && finishFn(data);
                    } catch (e) {
                      errorFn && errorFn(data),
                        message_message({
                          title: errorTt,
                          msg: "'" + fileObj.name + "'" + errorMsg,
                        });
                    } finally {
                      clearTimeout(uploadObj.timer);
                    }
                  }),
                  (reader.onerror = (e) => {
                    (data.data = e),
                      errorFn && errorFn(data),
                      message_message({
                        title: errorTt,
                        msg: "'" + fileObj.name + "'" + errorMsg,
                      }),
                      console.log(e),
                      clearTimeout(uploadObj.timer);
                  }));
              }),
              input.remove();
          })({
            uploadObj: uploadFile,
            startTt: uploadFile.text,
            startText: "开始上传",
            endTt: uploadFile.text,
            endText: "上传完成",
            errorTt: uploadFile.text,
            errorMsg: "数据导入失败",
            startFn: () => {
              uploadFile.isUploading = !0;
            },
            finishFn: (data) => {
              uploadFile.isUploading = !1;
              if (!confirm(uploadFile.submitText)) return;
              info.dataList = JSON.parse(data.data || null) || [];
              const list_info = listEle.list_info;
              list_info.setValue
                ? list_info.setValue(
                    list_info.saveName,
                    JSON.stringify(info.dataList)
                  )
                : localStorage.setItem(
                    list_info.saveName,
                    JSON.stringify(info.dataList)
                  ),
                initHisListDom(info),
                message({ title: uploadFile.text, msg: uploadFile.endText }),
                console.log(uploadFile.endText);
            },
            errorFn: () => {
              uploadFile.isUploading = !1;
            },
            timeoutFn: () => {
              uploadFile.isUploading = !1;
            },
          }),
          e.stopPropagation();
      });
    }
    if (control_info.out) {
      const outFile = control_info.out;
      outFile.ele.addEventListener("click", (e) => {
        let outName =
          listEle.list_info.outName || listEle.list_info.saveName || "dataList";
        outFile.isTime &&
          (outName =
            formatDate({
              timestamp: new Date().getTime(),
              isExact: !0,
              midDelimiter: "-",
              delimiter2: ".",
            }) +
            " " +
            outName);
        updateDataList(info) && initHisListDom(info),
          (function saveJson({
            data = "",
            fileName = "outData",
            type = "json",
          } = {}) {
            "string" != typeof data &&
              "json" === type &&
              (data = JSON.stringify(data));
            const blob = new Blob(
                [data],
                "json" === type
                  ? { type: "application/json" }
                  : { type: "text/plain" }
              ),
              href = URL.createObjectURL(blob),
              alink = document.createElement("a");
            (alink.style.display = "none"),
              (fileName += "." + type),
              (alink.download = fileName),
              (alink.href = href),
              document.body.appendChild(alink),
              alink.click(),
              document.body.removeChild(alink),
              URL.revokeObjectURL(href);
          })({ data: info.dataList, fileName: outName }),
          message({ title: outFile.text, msg: outFile.startText }),
          e.stopPropagation();
      });
    }
    if ((control_info.skip, control_info.fold)) {
      function setLineH(
        isFold = null,
        listEle = info.listEle,
        fold = control.info.fold
      ) {
        fold.ele.innerText = fold.isFold ? fold.noFoldText : fold.text;
        const textArr = listEle.querySelectorAll(".hItem"),
          len = textArr.length;
        let newH = fold.isFold ? fold.maxHeight : fold.oldMaxH;
        null !== isFold &&
          ((newH = isFold ? fold.maxHeight : fold.oldMaxH),
          (fold.isFold = isFold)),
          (listEle.list_info.liMaxHeight = newH),
          (newH += "px"),
          (listEle.display = "none");
        for (let i = 0; i < len; i++) {
          textArr[i].style.maxHeight = newH;
        }
        listEle.display = "block";
      }
      const fold = control_info.fold,
        list_info = listEle.list_info;
      let isFold;
      (fold.oldMaxH = list_info.liMaxHeight),
        (isFold = list_info.getValue
          ? list_info.getValue(listEle.list_info.list_id + "_" + fold.name)
          : localStorage.getItem(listEle.list_info.list_id + "_" + fold.name)),
        (fold.isFold = null != isFold && JSON.parse(isFold)),
        setLineH(),
        fold.ele.addEventListener("click", (e) => {
          (fold.isFold = !fold.isFold),
            setLineH(),
            list_info.setValue
              ? list_info.setValue(
                  list_info.list_id + "_" + fold.name,
                  JSON.stringify(fold.isFold)
                )
              : localStorage.setItem(
                  list_info.list_id + "_" + fold.name,
                  JSON.stringify(fold.isFold)
                ),
            bottomText(info),
            changeShow(control.move_eleList, !1),
            e.stopPropagation();
        });
    }
    if (control_info.delete) {
      const del = control_info.delete;
      del.ele.addEventListener("click", (e) => {
        confirm(del.warnText) &&
          (!(function delItem({ info, id, ele } = {}) {
            const newDataList = updateDataList(info),
              listEle = info.listEle,
              dataList = info.dataList;
            if (!id && !ele && !(ele = listEle.curClickEle)) return;
            ele ? (id = ele.id) : (ele = listEle.querySelector(`[id='${id}'`));
            const len = dataList.length;
            for (let i = 0; i < len; i++)
              if (+dataList[i].id == +id) {
                const del = dataList.splice(i, 1);
                console.log("删除一项", del[0]);
                break;
              }
            newDataList
              ? initHisListDom(info)
              : (ele.parentElement.remove(),
                resetNum(listEle),
                bottomText(info));
            const list_info = listEle.list_info;
            list_info.setValue
              ? list_info.setValue(list_info.saveName, JSON.stringify(dataList))
              : localStorage.setItem(
                  list_info.saveName,
                  JSON.stringify(dataList)
                );
          })({ info }),
          message({ title: del.text, msg: del.endText }),
          changeShow(control.move_eleList, !1)),
          e.stopPropagation();
      });
    }
    if (control_info.update) {
      const update = control_info.update;
      update.ele.addEventListener("click", (e) => {
        editInfo.msg = { noneText: control_info.add.noneText };
        const itemData = getItemData({ info, ele: info.listEle.curClickEle });
        itemData
          ? (!(function inputEditData({
              title = "",
              desc = "",
              value = "",
              data = {},
            } = {}) {
              (eleList.title.value = data.title || title),
                (eleList.desc.value = data.desc || desc),
                (eleList.value.value = data.value || value);
            })(itemData),
            (editInfo.callback.finished = (data) => {
              (data.id = new Date().getTime()),
                updateItem({ info, data }),
                message({ title: update.text, msg: update.endText }),
                changeShow(control.move_eleList, !1);
            }),
            showEditArea(!0),
            e.stopPropagation())
          : console.log("未获取到当前修改项的数据");
      });
    }
    if (control_info.move) {
      const move = control_info.move;
      move.ele.addEventListener("click", (e) => {
        if (!move.isMoving)
          return (
            (move.isMoving = !0),
            void message({
              title: move.text,
              msg: move.tipText + "\n请在提示存在期间完成该操作",
              fn: () => {
                move.isMoving = !1;
              },
            })
          );
        message({ title: move.text, msg: "已取消" + move.text + "操作" }),
          (move.isMoving = !1),
          e.stopPropagation();
      });
    }
    if (control_info.changePlace) {
      const changeP = control_info.changePlace;
      changeP.ele.addEventListener("click", (e) => {
        if (!changeP.isChangePlaceing)
          return (
            (changeP.isChangePlaceing = !0),
            void message({
              title: changeP.text,
              msg: changeP.tipText + "\n请在提示存在期间完成该操作",
              fn: () => {
                changeP.isChangePlaceing = !1;
              },
            })
          );
        message({ title: changeP.text, msg: "已取消" + changeP.text + "操作" }),
          (changeP.isChangePlaceing = !1),
          e.stopPropagation();
      });
    }
    if ((control_info.desc, control_info.toSuki)) {
      const toSuki = control_info.toSuki;
      toSuki.ele.addEventListener("click", (e) => {
        !(function itemToSuki({ info, ele, id } = {}) {
          if (!id && !ele && !(ele = info.listEle.curClickEle)) return;
          let data = getItemData({ info, ele, id });
          if (!data)
            return (
              console.log(info.listEle.list_info.control.info.toSuki.errorText),
              void message({
                title: "收藏",
                msg: info.listEle.list_info.control.info.toSuki.errorText,
              })
            );
          if (info.callback && info.callback.toSuki) {
            let newData;
            const func = info.callback.toSuki;
            Array.isArray(func)
              ? func.curFn
                ? ((newData = func[curFn](data)), (func.curFn = null))
                : func.forEach((fn) => {
                    newData = fn(data);
                  })
              : (newData = func(data)),
              (data = newData || data);
          }
          addItem({ info: info.suki_info, data });
        })({ info }),
          message({ title: toSuki.text, msg: toSuki.endText }),
          e.stopPropagation();
      });
    }
    control_info.copy &&
      control_info.copy.ele.addEventListener("click", (e) => {
        !(function copyText(text) {
          if (window.clipboardData)
            window.clipboardData.clearData(),
              window.clipboardData.setData("text", text);
          else if (document.execCommand) {
            var ele = document.createElement("textarea");
            if (
              ((ele.textContent = text),
              document.body.appendChild(ele),
              document.selection)
            )
              (range = document.body.createTextRange()).moveToElementText(ele),
                range.select();
            else if (window.getSelection) {
              var range;
              (range = document.createRange()).selectNode(ele),
                window.getSelection().removeAllRanges(),
                window.getSelection().addRange(range);
            }
            document.execCommand("copy"),
              ele.remove ? ele.remove() : ele.removeNode(!0);
          }
        })(listEle.curClickEle.innerText),
          message({
            title: control_info.copy.text,
            msg: control_info.copy.endText,
          }),
          e.stopPropagation();
      }),
      control_info.toBottom &&
        control_info.toBottom.ele.addEventListener("click", (e) => {
          (info.listEle.parentElement.scrollTop =
            info.listEle.parentElement.scrollHeight),
            e.stopPropagation();
        });
  }
  function getValue({
    base = null,
    key,
    valType = "string",
    isReSet = !0,
    getVal,
    setVal,
  } = {}) {
    let val = getVal ? getVal(key) : localStorage.getItem(key);
    return (
      null !== base &&
        null == val &&
        ((val = base),
        isReSet &&
          (setVal ? setVal(key, val) : localStorage.setItem(key, val))),
      "string" === valType
        ? val
        : "boolean" === valType || "number" === valType
        ? JSON.parse(val)
        : "object" === valType
        ? JSON.parse(val || {})
        : "array" === valType
        ? JSON.parse(val || [])
        : val
    );
  }
  function setBtnColor(listEle, btnEle, isClicked = "") {
    if (!listEle && !btnEle) return;
    let transformText;
    const btn_info = btnEle.btn_info;
    btn_info.isChangeColor &&
      ("" === isClicked &&
        ((transformText = listEle.parentElement.style.transform),
        (isClicked = "scaleY(1)" === transformText),
        (btnEle.isClicked = isClicked)),
      isClicked
        ? isClicked &&
          ((btnEle.style.color = btn_info.click),
          (btnEle.style.background = btn_info.click_bg),
          (btnEle.style.borderColor = btn_info.click_bd),
          btn_info.isSvg &&
            btnEle.children[0] &&
            (btnEle.children[0].style.fill = btn_info.click))
        : btnEle.isHover
        ? ((btnEle.style.color = btn_info.hover),
          (btnEle.style.background = btn_info.hover_bg),
          btn_info.bd && (btnEle.style.border = btn_info.hover_bd),
          btn_info.isSvg &&
            btnEle.children[0] &&
            (btnEle.children[0].style.fill = btn_info.hover))
        : ((btnEle.style.color = btn_info.color),
          (btnEle.style.background = btn_info.bg),
          btn_info.bd && (btnEle.style.border = btn_info.bd),
          btn_info.isSvg &&
            btnEle.children[0] &&
            (btnEle.children[0].style.fill = btn_info.color)));
  }
  function getTitle({ text, isGetTt = !1, maxLen, addText = "..." } = {}) {
    if (!text) return "";
    let title = text,
      isZs = !1,
      isEnd_l = !1;
    if (isGetTt) {
      "\n" === text[0] && (text = text.slice(1, text.length));
      title = text.split(/(?<=[|\n\r])/)[0].trim();
    }
    return (
      "/" === title[0] &&
        "/" === title[1] &&
        "|" === title[title.length - 1] &&
        ((title = title.slice(2, title.length - 1).trim()), (isZs = !0)),
      "\n\r".includes(title[title.length - 1]) &&
        (title = title.slice(0, title.length - 1)),
      (title = title.replaceAll("\n", " ").replaceAll("\r", " ")),
      maxLen &&
        title.length >= maxLen &&
        (title = title.slice(0, maxLen) + addText),
      "|" === title[title.length - 1] &&
        ((title = title.slice(0, title.length - 1).trim()), (isEnd_l = !0)),
      title.length < 8 &&
        !isZs &&
        !isEnd_l &&
        (title = text
          .trim()
          .replaceAll("\n", " ")
          .replaceAll("\r", " ")
          .slice(0, 8)),
      title
    );
  }
  function getNum(isDesc, isAddUp, len, index) {
    return (isDesc && !isAddUp) || (!isDesc && isAddUp)
      ? len - index
      : index + 1;
  }
  function resetNum(listEle, liArr = []) {
    0 === liArr.length && (liArr = listEle.getElementsByClassName("item-box"));
    const len = liArr.length;
    for (let i = 0; i < len; i++)
      liArr[i].querySelector(".num").innerHTML = getNum(
        listEle.list_info.isDesc,
        !1,
        len,
        i
      );
  }
  function bottomText(info) {
    const listEle = info.listEle,
      dataList = info.dataList,
      list_info = listEle.list_info;
    let bt_box = listEle.querySelector(".bottom_text");
    if (bt_box) {
      let text = list_info.bottomText;
      if (!text) return;
      let isAdd = 50 * dataList.length > list_info.maxHeight - 5;
      isAdd ||
        (isAdd =
          listEle.offsetHeight + list_info.control.offsetHeight >=
          list_info.maxHeight - 5),
        isAdd
          ? (bt_box.innerText = text)
          : bt_box &&
            ((text = list_info.initialText),
            0 === dataList.length
              ? (bt_box.innerHTML = text)
              : bt_box.remove());
    } else if (0 === dataList.length) {
      const text = list_info.initialText;
      text &&
        (listEle.innerHTML = `<div class="bottom_text" title="${list_info.bottomTT}">${text}</div>`);
    } else {
      const text = list_info.bottomText;
      if (!text) return;
      let isAdd = 50 * dataList.length > list_info.maxHeight - 5;
      isAdd ||
        (isAdd =
          listEle.offsetHeight + list_info.control.offsetHeight >=
          list_info.maxHeight - 5),
        isAdd &&
          ((bt_box = document.createElement("div")),
          (bt_box.className = "bottom_text"),
          (bt_box.title = list_info.bottomTT),
          (bt_box.innerText = text),
          listEle.appendChild(bt_box));
    }
  }
  function hiddenBtnList(info, name = "") {
    "btn" === name
      ? (info.btnEle.style.display = "none")
      : ("list" === name ||
          ("显示" !== info.btnEle.btn_info.showMode &&
            (info.btnEle.style.display = "none")),
        (info.listEle.parentElement.style.transform = "scaleY(0)")),
      (info.btnEle.style.borderColor = "#ccc"),
      setBtnColor(info.listEle, info.btnEle),
      showSearchBox(!1);
  }
  function initHisListDom(info) {
    const listEle = info.listEle;
    let curContent,
      dataList = info.dataList;
    listEle.innerHTML = "";
    let curHtml = "";
    const list_info = listEle.list_info;
    dataList ||
      (console.log("本地读取数据"),
      list_info.getValue
        ? (info.dataList =
            JSON.parse(list_info.getValue(list_info.saveName) || null) || [])
        : (info.dataList =
            JSON.parse(localStorage.getItem(list_info.saveName) || null) ||
            []));
    const maxLen = list_info.maxLen;
    list_info.isDelete &&
      dataList.length > maxLen &&
      dataList.splice(0, dataList.length - maxLen);
    const isDesc = list_info.isDesc,
      isAddUp = list_info.isAddUp;
    let htmlItem;
    const len = dataList.length,
      liMaxHeight = list_info.liMaxHeight,
      num_color = list_info.num_color,
      tt_color = list_info.tt_color;
    dataList.forEach((item, i) => {
      (curContent = item.value.replaceAll("\n", "<br>")),
        (htmlItem = `<div class="item-box"><div class="item-control" title="${formatDate(
          {
            timestamp: item.id || new Date().getTime(),
            isExact: !0,
            delimiter2: "时分秒",
          }
        )}" style="color:${num_color}"><span class="num">${getNum(
          isDesc,
          isAddUp,
          len,
          i
        )}</span> <span title="${
          item.desc
        }" class="item-tt" style="color:${tt_color}">${
          item.title || ""
        }</span></div><div id="${
          item.id
        }" class="hItem" style="max-height:${liMaxHeight}px">${curContent}</div></div>`),
        isAddUp ? (curHtml = htmlItem + curHtml) : (curHtml += htmlItem);
    }),
      (listEle.innerHTML = curHtml),
      bottomText(info),
      (info.updateDate = new Date().getTime());
  }
  function addItem({
    info,
    title = "",
    desc = "",
    value,
    id,
    data,
    isUpdateDom = !0,
  } = {}) {
    if (!value && !data) return -1;
    updateDataList(info) && initHisListDom(info);
    const listEle = info.listEle,
      dataList = info.dataList;
    let deleteId,
      curItem,
      isOverLenDel = !1;
    if (
      (data
        ? ((value = data.value),
          (title = data.title || ""),
          (desc = data.desc || ""),
          (data.title = title),
          (data.desc = desc),
          (id = data.id || new Date().getTime()),
          (curItem = { ...data }),
          (curItem.id = id))
        : (curItem = { value, id: id || new Date().getTime(), desc }),
      !curItem.value)
    )
      return -1;
    console.log("添加一项", curItem),
      (curItem.title = getTitle({ text: title || curItem.value, isGetTt: !0 }));
    const list_info = listEle.list_info;
    if (list_info.isDelRepeat)
      for (let i = 0; i < dataList.length; i++) {
        const cur = dataList[i];
        if (
          cur.value === value &&
          (!list_info.isDataStrict ||
            (cur.title === curItem.title && cur.desc === desc))
        ) {
          (deleteId = cur.id), dataList.splice(i, 1);
          break;
        }
      }
    if (
      (dataList.push(curItem),
      list_info.isDelete &&
        dataList.length > list_info.maxLen &&
        (dataList.shift(), (isOverLenDel = !0)),
      list_info.setValue
        ? list_info.setValue(list_info.saveName, JSON.stringify(dataList))
        : localStorage.setItem(list_info.saveName, JSON.stringify(dataList)),
      isUpdateDom)
    ) {
      let liArr;
      (deleteId || isOverLenDel) &&
        (liArr = listEle.getElementsByClassName("item-box")),
        deleteId &&
          listEle.querySelector(`[id='${deleteId}'`).parentElement.remove(),
        isOverLenDel && liArr[liArr.length - 1].remove(),
        (function addLi(info, item) {
          if (!item.value) return;
          const listEle = info.listEle,
            dataList = info.dataList,
            list_info = listEle.list_info,
            content = item.value.replaceAll("\n", "<br>"),
            hItem = document.createElement("div");
          (hItem.className = "item-box"),
            (hItem.innerHTML = `<div class="item-control" title="${formatDate({
              timestamp: item.id || new Date().getTime(),
              isExact: !0,
              delimiter2: "时分秒",
            })}" style="color:${
              list_info.tt_color
            };"><span class="num">${getNum(
              list_info.isDesc,
              list_info.isAddUp,
              dataList.length,
              dataList.length - 1
            )}</span> <span title="${item.desc}" class="item-tt" style="color:${
              list_info.tt_color
            }">${item.title || ""}</span></div><div id="${
              item.id
            }" class="hItem" style="max-height:${
              list_info.liMaxHeight
            }px">${content}</div>`),
            list_info.isAddUp
              ? listEle.insertBefore(hItem, listEle.children[0])
              : listEle.querySelector(".bottom_text")
              ? listEle.insertBefore(
                  hItem,
                  listEle.children[listEle.children.length - 1]
                )
              : listEle.appendChild(hItem);
          resetNum(listEle), bottomText(info);
        })(info, curItem);
    }
    return { deleteId, isOverLenDel };
  }
  function getItemData({ info, id, ele } = {}) {
    if (
      (updateDataList(info) && initHisListDom(info),
      !id && !ele && !(ele = info.listEle.curClickEle))
    )
      return;
    ele && (id = +ele.id);
    const data = info.dataList.find((i) => +i.id == +id);
    return data
      ? { ...data }
      : (console.log("操作失败, 当前项的数据可能在其他页面中已删除"), null);
  }
  function updateItem({
    info,
    id,
    ele,
    newId,
    title = "",
    desc = "",
    value = "",
    data = {},
    isSave = !0,
  } = {}) {
    if (!id && !ele && !(ele = info.listEle.curClickEle)) return;
    data
      ? ((newId = +data.id),
        (title = data.title || ""),
        (desc = data.desc || ""),
        (value = data.value || ""))
      : (data = { id, title, desc, value }),
      ele ? (id = +ele.id) : (ele = info.listEle.querySelector(`[id='${id}'`));
    const newDataList = updateDataList(info);
    newDataList && initHisListDom(info);
    const dataList = info.dataList;
    let index;
    const len = dataList.length;
    for (let i = 0; i < len; i++)
      if (+dataList[i].id == +id) {
        (data.id = dataList[i].id),
          (dataList[i] = data),
          newId && (dataList[i].id = +newId),
          (index = i);
        break;
      }
    if (!newDataList) {
      const tt = ele.parentElement.querySelector(".item-tt");
      (tt.innerHTML = getTitle({ text: title })), (tt.title = desc);
      const content = value.replaceAll("\n", "<br>");
      (ele.innerHTML = content), newId && (ele.id = newId);
    }
    if (isSave) {
      const list_info = info.listEle.list_info;
      list_info.setValue
        ? list_info.setValue(list_info.saveName, JSON.stringify(dataList))
        : localStorage.setItem(list_info.saveName, JSON.stringify(dataList));
    }
    return { index, ele };
  }
  function updateDataList(info) {
    if (!info.listEle.list_info.isDataSync) return !1;
    let curGetValue,
      curSetValue,
      list_info = info.listEle.list_info;
    (curGetValue = list_info.getValue
      ? list_info.getValue
      : localStorage.getItem),
      (curSetValue = list_info.setValue
        ? list_info.setValue
        : localStorage.setItem);
    const time = new Date().getTime(),
      oldUpdateDate = info.updateDate || time,
      updateDate = getValue({
        key: list_info.list_id + "_updateDate",
        base: time,
        getVal: curGetValue,
        setVal: curSetValue,
      });
    if (((info.updateDate = updateDate), +updateDate != +oldUpdateDate)) {
      let dataList = getValue({
        key: list_info.saveName,
        base: "[]",
        valType: "array",
        getVal: curGetValue,
        setVal: curSetValue,
      });
      return (info.dataList = dataList), dataList;
    }
    return !1;
  }
  function bindHistoryEvents(info) {
    const textEle = info.textEle,
      btnEle = info.btnEle,
      listEle = info.listEle;
    let mode = btnEle.btn_info.showMode;
    if ("显示" !== mode) {
      let eventName = "click";
      "单击" === mode
        ? (eventName = "click")
        : "双击" === mode && (eventName = "dblclick"),
        textEle &&
          textEle.addEventListener(eventName, function historyBtn(e) {
            if (this !== e.target) return;
            !(function btnShow(isShow) {
              (btnEle.style.display = isShow ? "block" : "none"),
                (listEle.parentElement.style.transform = "scaleY(0)"),
                isShow || showSearchBox(!1),
                setBtnColor(listEle, btnEle);
            })("none" === btnEle.style.display),
              e && e.stopPropagation();
          });
    }
    btnEle.addEventListener("click", function historyList(e) {
      if (
        this !== e.target &&
        "svg" !== e.target.tagName.toLowerCase() &&
        "path" !== e.target.tagName.toLowerCase()
      )
        return;
      const isClicked = "scaleY(0)" === listEle.parentElement.style.transform;
      if (((btnEle.isClicked = isClicked), isClicked)) {
        updateDataList(info) && initHisListDom(info);
      }
      (listEle.parentElement.style.transform = isClicked
        ? "scaleY(1)"
        : "scaleY(0)"),
        setBtnColor(listEle, btnEle, isClicked),
        showSearchBox(!1),
        changeShow(listEle.list_info.control.move_eleList, !1),
        e && e.stopPropagation();
    }),
      listEle.list_info.isOut &&
        listEle.addEventListener("dblclick", function useHistoryText(e) {
          const item = e.target;
          if ("hItem" === item.className) {
            const clickText = item.innerText;
            if (
              (textEle &&
                ((textEle.value = clickText),
                listEle.list_info.isExit && emitEvent(textEle, "input")),
              info.callback && info.callback.clickItem)
            ) {
              const itemId = +item.id,
                data = info.dataList.find((i) => i.id === itemId),
                func = info.callback.clickItem;
              Array.isArray(func)
                ? func.curFn
                  ? (func[curFn](data), (func.curFn = null))
                  : func.forEach((fn) => {
                      fn(data);
                    })
                : func(data);
            }
            listEle.list_info.isClickClose &&
              ((listEle.parentElement.style.transform = "scaleY(0)"),
              setBtnColor(listEle, btnEle),
              showSearchBox(!1),
              changeShow(listEle.list_info.control.move_eleList, !1));
          } else listEle.parentElement.scrollTop = 0;
          e.stopPropagation();
        }),
      listEle.addEventListener("click", function toTop(e) {
        "bottom_text" === e.target.className &&
          (listEle.parentElement.scrollTop = 0);
      }),
      listEle.parentElement.addEventListener("dblclick", (e) => {
        (listEle.parentElement.scrollTop = 0), e.stopPropagation();
      });
  }
  function jsonSpecify(str, isWrap = !0) {
    return isWrap
      ? "{" === str[0] || "[" === str[0]
        ? str
            .slice(1, str.length - 1)
            .replaceAll("{", "{\n")
            .replaceAll("}", "\n}")
            .replaceAll("[", "[\n")
            .replaceAll("]", "\n]")
            .replaceAll(",", ",\n")
            .replaceAll(":", ": ")
        : str
            .replaceAll("{", "{\n")
            .replaceAll("}", "\n}")
            .replaceAll("[", "[\n")
            .replaceAll("]", "\n]")
            .replaceAll(",", ",\n")
            .replaceAll(":", ": ")
      : "{" === str[0] || "[" === str[0]
      ? str
          .slice(1, str.length - 1)
          .replaceAll(",", ", ")
          .replaceAll(":", ": ")
      : void 0;
  }
  function tagHistory(dom, tools_dom) {
    (tools_dom.tagHistory = { cfg: {} }), (tools_dom.ntagHistory = { cfg: {} });
    const tagHist = tools_dom.tagHistory,
      ntagHist = tools_dom.ntagHistory;
    (tagHist.info = { textEle: dom.positiveEle }),
      (ntagHist.info = { textEle: dom.negativeEle }),
      (tools_dom.suki_tagHistory = { cfg: {} }),
      (tools_dom.suki_ntagHistory = { cfg: {} });
    const suki_tagHist = tools_dom.suki_tagHistory,
      suki_ntagHist = tools_dom.suki_ntagHistory;
    (suki_tagHist.info = { textEle: dom.positiveEle }),
      (suki_ntagHist.info = { textEle: dom.negativeEle }),
      (tools_dom.defaTag = {}),
      (tools_dom.defaTag.tag =
        "(masterpiece), (best quality), flower for sky, light particles, bubble, [butterfly], an extremely delicate and beautiful, (extremely detailed cg), (loli), ((1girl)), ((solo)), (beautiful detailed eyes), (long hair), hair ribbon, off-shoulder_shirt, (miniskirt)"),
      (tools_dom.defaTag.ntag =
        "nsfw, (worst quality, low quality:1.4), (lip, nose, tooth, rouge, lipstick, eyeshadow:1.4), (blush:1.2), (jpeg artifacts:1.4), (depth of field, bokeh, blurry, film grain, chromatic aberration, lens flare:1.0), (1boy, abs, muscular, rib:1.0), greyscale, monochrome, dusty sunbeams, trembling, motion lines, motion blur, emphasis lines, text, title, logo, signature,");
    const defaControls = {
      samplingSteps: 50,
      samplingMethod: 1,
      width: 1024,
      height: 640,
      batchCount: 1,
      batchSize: 1,
      cfgScale: 7,
      seed: -1,
    };
    let curPositive, curNegative;
    (tagHist.info.dataList =
      JSON.parse(localStorage.getItem("positiveList") || null) || []),
      (ntagHist.info.dataList =
        JSON.parse(localStorage.getItem("negativeList") || null) || []),
      (suki_tagHist.info.dataList =
        JSON.parse(localStorage.getItem("suki_positiveList") || null) || []),
      (suki_ntagHist.info.dataList =
        JSON.parse(localStorage.getItem("suki_negativeList") || null) || []),
      (curPositive =
        0 === tagHist.info.dataList.length
          ? tools_dom.defaTag.tag
          : tagHist.info.dataList[tagHist.info.dataList.length - 1].value ||
            tagHist.info.dataList[tagHist.info.dataList.length - 1].tags),
      (curNegative =
        0 === ntagHist.info.dataList.length
          ? tools_dom.defaTag.ntag
          : ntagHist.info.dataList[ntagHist.info.dataList.length - 1].value);
    let controls =
      JSON.parse(localStorage.getItem("controls") || null) || defaControls;
    function restoreData(posiTags, negaTags, controls) {
      posiTags && (dom.positiveEle.value = posiTags),
        negaTags && (dom.negativeEle.value = negaTags),
        controls &&
          ((dom.stepsEle.value = controls.samplingSteps
            ? controls.samplingSteps
            : defaControls.samplingSteps),
          dom.methodSelect
            ? (dom.methodSelect.selectedIndex = controls.samplingMethod || 0)
            : ((dom.methodBox.querySelector("[type='radio']:checked").checked =
                !1),
              controls.samplingMethod || 0 === controls.samplingMethod
                ? (dom.methodsArr[controls.samplingMethod].checked = !0)
                : (dom.methodsArr[1].checked = !0)),
          (dom.widthEle.value = controls.width
            ? controls.width
            : defaControls.width),
          (dom.heightEle.value = controls.height
            ? controls.height
            : defaControls.height),
          (dom.countEle.value = controls.batchCount
            ? controls.batchCount
            : defaControls.batchCount),
          (dom.sizeEle.value = controls.batchSize
            ? controls.batchSize
            : defaControls.batchSize),
          (dom.cfgEle.value = controls.cfgScale
            ? controls.cfgScale
            : defaControls.cfgScale),
          (dom.seedEle.value = controls.seed
            ? controls.seed
            : defaControls.seed));
    }
    function emitEvents(isTag = !0) {
      const curChecked = dom.methodBox.querySelector("[type='radio']:checked"),
        inputArr = [
          dom.stepsEle,
          dom.widthEle,
          dom.heightEle,
          dom.countEle,
          dom.sizeEle,
          dom.cfgEle,
          dom.seedEle,
        ];
      isTag && (inputArr.push(dom.positiveEle), inputArr.push(dom.negativeEle));
      const changeArr = [curChecked];
      inputArr.forEach((item) => {
        item && emitEvent(item, "input");
      }),
        changeArr.forEach((item) => {
          item && emitEvent(item, "change");
        });
    }
    (dom.positiveBox.style.position = "relative"),
      (dom.negativeBox.style.position = "relative"),
      (function init() {
        tools_dom.cfg.isAutoLoadTag &&
          restoreData(curPositive, curNegative, controls),
          (function createHistory() {
            const listMaxLen = tools_dom.cfg.listMaxLen,
              isClickClose = tools_dom.cfg.isClickClose,
              btnShowMode = tools_dom.cfg.btnShowMode;
            (tagHist.info.suki_info = suki_tagHist.info),
              (ntagHist.info.suki_info = suki_ntagHist.info),
              (tagHist.info.callback = {}),
              (tagHist.info.callback.clickItem = function (data) {
                restoreData(!1, !1, data.controls), emitEvents(!1);
              }),
              (suki_tagHist.info.callback = {}),
              (suki_tagHist.info.callback.clickItem = function (data) {
                restoreData(!1, !1, data.controls), emitEvents(!1);
              }),
              (tagHist.info.btnEle = createSwitchBtn({
                box: dom.positiveBox,
                top: 9,
                right: -13,
                lineHeight: 23,
                zIndex: 700,
                fontSize: 17,
                color: "#8a8a8a",
                svg: getIconHTML({ name: "lishi" }),
                titleText: "Tags历史记录",
                showMode: btnShowMode,
              })),
              (ntagHist.info.btnEle = createSwitchBtn({
                box: dom.negativeBox,
                top: 9,
                right: -13,
                lineHeight: 23,
                zIndex: 700,
                fontSize: 17,
                color: "#8a8a8a",
                svg: getIconHTML({ name: "lishi" }),
                titleText: "负面Tags历史记录",
                showMode: btnShowMode,
              })),
              (suki_tagHist.info.btnEle = createSwitchBtn({
                box: dom.positiveBox,
                top: 40,
                right: -13,
                zIndex: 700,
                fontSize: 17,
                color: "#fe9850",
                svg: getIconHTML({ name: "shoucang" }),
                titleText: "负面Tags收藏",
                showMode: btnShowMode,
              })),
              (suki_ntagHist.info.btnEle = createSwitchBtn({
                box: dom.negativeBox,
                top: 40,
                right: -13,
                zIndex: 700,
                fontSize: 17,
                color: "#fe9850",
                svg: getIconHTML({ name: "shoucang" }),
                titleText: "Tags收藏",
                showMode: btnShowMode,
              }));
            const tagHistInfo = createHistoryList({
                list_id: "SD_list_tagHistory",
                box: dom.positiveBox,
                width: 345,
                top: 8,
                right: -362,
                zIndex: 700,
                maxLen: listMaxLen,
                isClickClose,
                initialText: "无Tags历史记录",
                saveName: "positiveList",
                outName: "正面Tags历史记录",
                isExit: !0,
                controlArr: [
                  { name: "add" },
                  {
                    name: "search",
                    searchType: "内容",
                    title:
                      "搜索所有记录的内容, 若要按标题搜索请先输入'标题=', 按描述搜索输入'描述=', 按日期搜索输入'日期='",
                  },
                  { name: "clear" },
                  { name: "out" },
                  { name: "import" },
                  { name: "fold" },
                  { name: "update" },
                  { name: "move", warnText: "" },
                  { name: "toSuki" },
                  { name: "copy" },
                  { name: "delete" },
                  { name: "toBottom" },
                ],
              }),
              ntagHistInfo = createHistoryList({
                list_id: "SD_list_ntagHistory",
                box: dom.negativeBox,
                width: 345,
                top: 8,
                right: -362,
                zIndex: 700,
                maxLen: listMaxLen,
                isClickClose,
                initialText: "无Tags历史记录",
                saveName: "negativeList",
                outName: "负面Tags历史记录",
                isExit: !0,
                controlArr: [
                  { name: "add" },
                  {
                    name: "search",
                    searchType: "内容",
                    title:
                      "搜索所有记录的内容, 若要按标题搜索请先输入'标题=', 按描述搜索输入'描述=', 按日期搜索输入'日期='",
                  },
                  { name: "clear" },
                  { name: "out" },
                  { name: "import" },
                  { name: "fold" },
                  { name: "update" },
                  { name: "move", warnText: "" },
                  { name: "toSuki" },
                  { name: "copy" },
                  { name: "delete" },
                  { name: "toBottom" },
                ],
              }),
              suki_tagHistInfo = createHistoryList({
                list_id: "SD_list_tagHistory_suki",
                box: dom.positiveBox,
                width: 345,
                top: 40,
                right: -362,
                zIndex: 700,
                cssText: "none",
                maxLen: listMaxLen,
                isClickClose,
                initialText: "暂无Tags收藏",
                saveName: "suki_positiveList",
                outName: "正面Tags收藏",
                isExit: !0,
                isDesc: !1,
                isAddUp: !1,
                isDelete: !1,
                controlArr: [
                  { name: "add" },
                  {
                    name: "search",
                    searchType: "内容",
                    title:
                      "搜索所有记录的内容, 若要按标题搜索请先输入'标题=', 按描述搜索输入'描述=', 按日期搜索输入'日期='",
                  },
                  {
                    name: "clear",
                    warnText: "是否清空所有收藏？",
                    twoWarnText: "请再次确认是否清空收藏？清空后将无法复原！",
                  },
                  { name: "out" },
                  { name: "import" },
                  { name: "fold" },
                  { name: "update" },
                  { name: "move", warnText: "" },
                  { name: "copy" },
                  { name: "delete" },
                  { name: "toBottom" },
                ],
              }),
              suki_ntagHistInfo = createHistoryList({
                list_id: "SD_list_ntagHistory_suki",
                box: dom.negativeBox,
                width: 345,
                top: 40,
                right: -362,
                zIndex: 700,
                cssText: "none",
                maxLen: listMaxLen,
                isClickClose,
                initialText: "暂无Tags收藏",
                saveName: "suki_negativeList",
                outName: "负面Tags收藏",
                isExit: !0,
                isDesc: !1,
                isAddUp: !1,
                isDelete: !1,
                controlArr: [
                  { name: "add" },
                  {
                    name: "search",
                    searchType: "内容",
                    title:
                      "搜索所有记录的内容, 若要按标题搜索请先输入'标题=', 按描述搜索输入'描述=', 按日期搜索输入'日期='",
                  },
                  {
                    name: "clear",
                    warnText: "是否清空所有收藏？",
                    twoWarnText: "请再次确认是否清空收藏？清空后将无法复原！",
                  },
                  { name: "out" },
                  { name: "import" },
                  { name: "fold" },
                  { name: "update" },
                  { name: "move", warnText: "" },
                  { name: "copy" },
                  { name: "delete" },
                  { name: "toBottom" },
                ],
              });
            (tagHist.info.listEle = tagHistInfo.value),
              (ntagHist.info.listEle = ntagHistInfo.value),
              (suki_tagHist.info.listEle = suki_tagHistInfo.value),
              (suki_ntagHist.info.listEle = suki_ntagHistInfo.value),
              initHisListDom(tagHist.info),
              initHisListDom(ntagHist.info),
              initHisListDom(suki_tagHist.info),
              initHisListDom(suki_ntagHist.info),
              controlEvents(
                tagHistInfo.control,
                tagHist.info,
                tools_dom.searchEle,
                tools_dom.edit
              ),
              controlEvents(
                ntagHistInfo.control,
                ntagHist.info,
                tools_dom.searchEle,
                tools_dom.edit
              ),
              bindHistoryEvents(tagHist.info),
              bindHistoryEvents(ntagHist.info),
              controlEvents(
                suki_tagHistInfo.control,
                suki_tagHist.info,
                tools_dom.searchEle,
                tools_dom.edit
              ),
              controlEvents(
                suki_ntagHistInfo.control,
                suki_ntagHist.info,
                tools_dom.searchEle,
                tools_dom.edit
              ),
              bindHistoryEvents(suki_tagHist.info),
              bindHistoryEvents(suki_ntagHist.info),
              tools_dom.historyListArr.push(tagHist.info),
              tools_dom.historyListArr.push(ntagHist.info),
              tools_dom.historyListArr.push(suki_tagHist.info),
              tools_dom.historyListArr.push(suki_ntagHist.info);
          })(),
          (function bindEvents() {
            dom.startBtn.addEventListener("click", function handleStarted() {
              const controls = getControls(dom),
                newControls = { ...controls };
              (newControls.samplingMethod =
                dom.methodMap[+controls.samplingMethod]),
                addItem({
                  data: {
                    value: dom.positiveEle.value,
                    controls,
                    desc: jsonSpecify(
                      JSON.stringify(newControls),
                      !1
                    ).replaceAll('"', "'"),
                  },
                  info: tagHist.info,
                }),
                addItem({
                  data: { value: dom.negativeEle.value },
                  info: ntagHist.info,
                }),
                saveControls(dom);
            });
          })(),
          emitEvents();
      })();
  }
  function formatStr(str) {
    return (str = str.trim())
      .replaceAll("\n", "")
      .replaceAll("  ", " ")
      .replaceAll("，", ",")
      .replaceAll("。", ".")
      .replaceAll("；", ";")
      .replaceAll("》", ">")
      .replaceAll("《", "<")
      .replaceAll("！", "!")
      .replaceAll("&/", "&|/");
  }
  function toEnChar(str) {
    return str
      .replaceAll("，", ",")
      .replaceAll(", ", ",")
      .replaceAll(",,", ",")
      .replaceAll(",", ", ")
      .replaceAll("（", "(")
      .replaceAll("）", ")")
      .replaceAll("【", "[")
      .replaceAll("】", "]");
  }
  function changeChar(str) {
    return str
      .replaceAll("]#", "$__a")
      .replaceAll("##", "$__9")
      .replaceAll("#|", "$__1")
      .replaceAll("#+", "$__2")
      .replaceAll("#<", "$__3")
      .replaceAll("#>", "$__4")
      .replaceAll("#,", "$__5")
      .replaceAll("#/", "$__6")
      .replaceAll("#;", "$__7")
      .replaceAll("#!", "$_10")
      .replaceAll("#-", "$_11")
      .replaceAll("#&", "$_12")
      .replaceAll("#$", "$_13")
      .replaceAll("#=", "$_14")
      .replaceAll("||", "$__8")
      .replaceAll("$__a", "]#");
  }
  function restoreChar(str) {
    return str
      .replaceAll("$__1", "|")
      .replaceAll("$__2", "+")
      .replaceAll("$__3", "<")
      .replaceAll("$__4", ">")
      .replaceAll("$__5", ",")
      .replaceAll("$__6", "/")
      .replaceAll("$__7", ";")
      .replaceAll("$__9", "#")
      .replaceAll("$_10", "!")
      .replaceAll("$_11", "-")
      .replaceAll("$_12", "&")
      .replaceAll("$_13", "$")
      .replaceAll("$_14", "=")
      .replaceAll("$__8", "||");
  }
  function clearNotes(str) {
    const arr = (str = str.replaceAll("//|", "#flag_zs|"))
      .replaceAll("||", "$__8")
      .split("|");
    for (let i = arr.length - 1; i >= 0; i--) {
      const item = arr[i];
      let index = 0;
      if (item.includes("//")) {
        for (let j = 0; j < item.length - 1; j++)
          if ("/" === item[j] && "/" === item[j + 1]) {
            index = j;
            break;
          }
        0 === index
          ? arr.splice(i, 1)
          : ((arr[i] = item.slice(0, index)), (arr[i] = "#flag_in" + arr[i]));
      }
    }
    let resultStr = arr
      .map(
        (item, i) => (
          item.includes("#flag_in") || i === arr.length - 1
            ? (item = item.replace("#flag_in", ""))
            : (item += "|"),
          item
        )
      )
      .join("");
    return (resultStr = resultStr.replaceAll("#flag_zs", "//")), resultStr;
  }
  function getRandomWeight(weightArr) {
    const num = (function getRandom(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    })(
      1,
      weightArr.reduce((a, b) => parseInt(a) + parseInt(b), 0)
    );
    let curSum = 0;
    for (let i = 0; i < weightArr.length; i++) {
      if (((curSum += parseInt(weightArr[i])), num <= curSum)) return i;
    }
    return 0;
  }
  function getListAndWeight(infoItems, weightArr = null) {
    const newWeightArr = [],
      newList = [];
    let flag = !1;
    for (let i = 0; i < infoItems.length; i++) {
      const item = infoItems[i];
      let num = weightArr && weightArr.length > 0 ? weightArr[i] : 1;
      if (
        item &&
        (item.includes("--") || item.includes("=>") || item.includes("=tmp>"))
      ) {
        let arr;
        (arr = item.split("=tmp>")),
          1 === arr.length &&
            ((arr = item.split("=>")),
            1 === arr.length && (arr = item.split("--")));
        let curNum = +arr[1];
        if ((!curNum && 0 !== curNum) || "" === arr[1]) {
          newWeightArr.push(num), newList.push(item);
          continue;
        }
        (flag = !0), newWeightArr.push(curNum), newList.push(arr[0]);
      } else newWeightArr.push(num), newList.push(item);
    }
    return flag
      ? { tagList: newList, weightArr: newWeightArr }
      : { tagList: newList, weightArr: new Array(newList.length).fill(1) };
  }
  function addTagInfo(infoStr, tagName = "") {
    const infoArr = (infoStr = infoStr
      .replaceAll("，", ",")
      .replaceAll("；", ";")
      .replaceAll("》", ">")
      .replaceAll("《", "<")).split("/");
    if (1 === infoArr.length) return infoStr;
    2 === infoArr.length && infoArr.unshift("");
    const isCover = ">" === infoArr[2][0];
    let type;
    isCover && (infoArr[2] = infoArr[2].slice(1, infoArr[2].length));
    const oneItem = infoArr[0],
      twoItem = infoArr[1];
    let weightArr,
      allNum,
      thrItem = infoArr[2];
    if (
      ((thrItem = thrItem
        .replace("All", "all")
        .replace("-", "all")
        .replace("allall", "all")),
      thrItem.includes("all"))
    ) {
      let weightLen,
        str = thrItem;
      (str = str.replace("all", "")),
        (allNum = "" === str ? 1 : +str),
        twoItem.includes(";")
          ? (weightLen = twoItem.split(";").length)
          : twoItem.includes(",") && (weightLen = twoItem.split(",").length),
        (weightArr = new Array(weightLen).fill(allNum));
    }
    if (
      (weightArr ||
        (weightArr = thrItem.includes(";")
          ? thrItem.split(";")
          : thrItem.includes(",")
          ? thrItem.split(",")
          : [1]),
      oneItem.includes(";"))
    ) {
      const arr = oneItem.split(";");
      (tagName = arr[0]), (type = arr[1]);
    } else if (oneItem.includes(",")) {
      const arr = oneItem.split(",");
      (tagName = arr[0]), (type = arr[1]);
    } else
      ">" === oneItem[0]
        ? (type = "pf")
        : "<" === oneItem[0]
        ? (type = "sf")
        : ">" === oneItem[oneItem.length - 1]
        ? ((tagName = oneItem.slice(0, oneItem.length - 1)), (type = "pf"))
        : "<" === oneItem[oneItem.length - 1]
        ? ((tagName = oneItem.slice(0, oneItem.length - 1)), (type = "sf"))
        : ((tagName = tagName || oneItem), (type = "pf"));
    function analysisWords(wordsStr) {
      let infoItems;
      if (
        ((infoItems = wordsStr.includes(";")
          ? wordsStr.split(";")
          : wordsStr.includes(",")
          ? wordsStr.split(",")
          : [wordsStr]),
        infoItems.forEach((item, i) => {
          infoItems[i] = infoItems[i].trim();
        }),
        wordsStr.includes("--"))
      ) {
        const result = getListAndWeight(infoItems, weightArr);
        (infoItems = result.tagList), (weightArr = result.weightArr);
      }
      return 1 === infoItems.length ? infoItems[0] : infoItems;
    }
    if ("perfix" === type || "pf" === type) {
      const infoItems = analysisWords(twoItem);
      if ("string" == typeof infoItems) return infoItems;
      const itemIndex = getRandomWeight(weightArr),
        addInfoStr = infoItems[itemIndex],
        lastChar = weightArr[itemIndex][weightArr[itemIndex].length - 1];
      if (addInfoStr.includes("$0"))
        return addInfoStr.replaceAll("$0", tagName);
      if (">" === lastChar || isCover) return addInfoStr;
      const space = tagName ? " " : "";
      return (addInfoStr ? `${addInfoStr}${space}` : "") + tagName;
    }
    if ("suffix" === type || "sf" === type) {
      const infoItems = analysisWords(twoItem);
      if ("string" == typeof infoItems) return infoItems;
      const itemIndex = getRandomWeight(weightArr),
        addInfoStr = infoItems[itemIndex];
      if (
        ">" === weightArr[itemIndex][weightArr[itemIndex].length - 1] ||
        isCover
      )
        return addInfoStr;
      const space = "," === addInfoStr[0] ? "" : " ";
      return tagName + (addInfoStr ? `${space}${addInfoStr}` : "");
    }
  }
  function changeDomValue(ele, value, info = "") {
    if ("method" === info.toLowerCase()) {
      "string" == typeof value
        ? ele.methodSelect
          ? (ele.methodSelect.value = value)
          : ((value = value.toLowerCase()),
            (value = ele.methodMap.indexOf(value)) < 0 && (value = 1))
        : ele.methodSelect && (ele.methodSelect.selectedIndex = value),
        ele.methodSelect ||
          ((ele.methodBox.querySelector("[type='radio']:checked").checked = !1),
          (value || 0 === value) &&
            (ele.methodsArr[value]
              ? (ele.methodsArr[value].checked = !0)
              : (ele.methodsArr[1].checked = !0)));
      emitEvent(
        ele.methodSelect ||
          ele.methodBox.querySelector("[type='radio']:checked"),
        "change"
      );
    } else (ele.value = value), emitEvent(ele, "input");
  }
  const configZnMap = {
      步数: "steps",
      迭代: "steps",
      迭代步数: "steps",
      采样步数: "steps",
      方法: "method",
      采样: "method",
      采样器: "method",
      采样方法: "method",
      宽: "width",
      宽度: "width",
      高: "height",
      高度: "height",
      次数: "count",
      批次: "count",
      队列: "count",
      生成批次: "count",
      数量: "size",
      数目: "size",
      批量: "size",
      并行: "size",
      单批数量: "size",
      每批数量: "size",
      系数: "cfg",
      服从度: "cfg",
      相关性: "cfg",
      提示词系数: "cfg",
      提示词服从度: "cfg",
      提示词相关性: "cfg",
      种子: "seed",
      随机种: "seed",
      随机种子: "seed",
      模块tag: "tags",
      模块tags: "tags",
      模块负面tag: "tags-",
      模块负面tags: "tags-",
      频率: "tmpF",
      解析频率: "tmpF",
      模版解析频率: "tmpF",
      间隔: "tmpTime",
      间隔时间: "tmpTime",
      模版间隔时间: "tmpTime",
      解析间隔时间: "tmpTime",
      生成间隔时间: "tmpTime",
      图片: "tmpNum",
      图片数量: "tmpNum",
      图片总数: "tmpNum",
      生成数量: "tmpNum",
      正面元素: "posiEle",
      正面tag: "posiEle",
      正面tag元素: "posiEle",
      负面元素: "negaEle",
      负面tag: "negaEle",
      负面tag元素: "negaEle",
      开始按钮: "startBtn",
      跳过按钮: "skipBtn",
      元素: "tmpEle",
      模板元素: "tmpEle",
      模板dom: "tmpEle",
      选择元素: "tmpEle",
      选择dom: "tmpEle",
      点击: "click",
      点击元素: "click",
      点击dom: "click",
    },
    configEnMap = {
      steps: "步数",
      method: "方法",
      width: "宽度",
      height: "高度",
      count: "批次",
      size: "数量",
      cfg: "系数",
      seed: "种子",
      tag: "模块tags",
      tags: "模块tags",
      "tag-": "模块负面tags",
      "tags-": "模块负面tags",
      if: "模块if",
      "if-": "模块if负面",
      ifTo: "单项if",
      "ifTo-": "单项if负面",
      iftag: "标签if",
      "iftag-": "标签if负面",
      iftagTo: "标签单项if",
      "iftagTo-": "标签单项if负面",
      ifset: "配置if",
      change: "修改tag",
      "change-": "修改负面tag",
      changeTo: "修改一项",
      "changeTo-": "修改负面一项",
      ifmod: "模型if",
      else: "否则",
      tmpF: "解析频率",
      tmpTime: "间隔时间",
      tmpNum: "图片总数",
      posiEle: "正面tag元素",
      negaEle: "负面tag元素",
      startBtn: "开始按钮",
      skipBtn: "跳过按钮",
      tmpEle: "模板元素",
      dom: "模版元素",
      click: "点击元素",
    };
  function enToZn(str) {
    return str.includes("if") || str.includes("change") || str.includes("else")
      ? str
          .replace("一项", "单项")
          .replace("条件", "if")
          .replace("模块if负面", "if-")
          .replace("模块if", "if")
          .replace("单项if负面", "ifTo-")
          .replace("单项if", "ifTo")
          .replace("标签if负面", "iftag-")
          .replace("标签if", "iftag")
          .replace("标签单项if负面", "iftagTo-")
          .replace("标签单项if", "iftagTo")
          .replace("设置if", "ifset")
          .replace("配置if", "ifset")
          .replace("设置", "ifset")
          .replace("配置", "ifset")
          .replace("模型if", "ifmod")
          .replace("模型", "ifmod")
          .replace("否则", "else")
          .replace("修改tag", "change")
          .replace("修改负面tag", "change-")
          .replace("修改单项", "changeTo")
          .replace("修改负面单项", "changeTo-")
          .replace("修改", "change")
      : str;
  }
  function getEle(dom, selectStr) {
    return dom.gRoot.querySelector(selectStr);
  }
  function retIf(ifStr, curList, flag = "if") {
    if (0 === curList.length) return { value: !1, index: 0, newList: [] };
    let curTagsStr;
    if (
      ((curTagsStr =
        "string" == typeof curList
          ? curList
          : curList.join(",").replaceAll(", ", ",")),
      flag.includes("To"))
    )
      return (function retIfItem(ifStr, curList) {
        let curTagsStr;
        curTagsStr =
          "string" == typeof curList
            ? curList
            : curList.join(",").replaceAll(", ", ",");
        const formatList = curTagsStr.split(",");
        let index,
          isIn = !1;
        for (let i = 0; i < formatList.length; i++) {
          if (retIf(ifStr, formatList[i]).value) {
            (isIn = !0), (index = i);
            break;
          }
        }
        return { value: isIn, index, newList: formatList };
      })(ifStr, curTagsStr);
    const ifArr = ifStr.split(/(?=\|\|)|(?=&&)/g);
    if ("ifset" === flag)
      return (function retIfset(ifArr, curList) {
        function retItem(str) {
          if (
            [">=", "<=", ">", "<", "==", "!="].some((item) =>
              ifArr[0].includes(item)
            )
          ) {
            const arr = str.split(/(>=|<=|>|<|==|!=)/g);
            if (arr.length <= 2) return !1;
            const operator = arr[1],
              name = arr[0];
            let cfgItem;
            for (let i = curList.length - 1; i >= 0; i--) {
              const item = curList[i];
              if (item[0] === name) {
                cfgItem = item;
                break;
              }
            }
            if (!cfgItem) return !1;
            let value1 = cfgItem[1],
              value2 = arr[2];
            return (
              "==" !== operator &&
                "!=" !== operator &&
                ((value1 = +value1), (value2 = +value2)),
              !!((value1 && value2) || "" === value1 || "" === value2) &&
                (">=" === operator
                  ? value1 >= value2
                  : "<=" === operator
                  ? value1 <= value2
                  : ">" === operator
                  ? value1 > value2
                  : "<" === operator
                  ? value1 < value2
                  : "==" === operator
                  ? value1 === value2
                  : "!=" === operator && value1 !== value2)
            );
          }
          if (ifArr[0].includes("!")) {
            const name = ifArr[0].replace("!", "");
            return !curList.some((item) => item[0] === name);
          }
          {
            const name = ifArr[0];
            return curList.some((item) => item[0] === name);
          }
        }
        let ifFlag = retItem(ifArr[0]);
        for (let i = 1; i < ifArr.length; i++) {
          let item = ifArr[i];
          item.includes("&&")
            ? ((item = item.replace("&&", "")),
              "!" === item[0]
                ? ((item = item.replace("!", "")),
                  (ifFlag = ifFlag && !retItem(item)))
                : (ifFlag = ifFlag && retItem(item)))
            : item.includes("||") &&
              ((item = item.replace("||", "")),
              "!" === item[0]
                ? ((item = item.replace("!", "")),
                  (ifFlag = ifFlag || !retItem(item)))
                : (ifFlag = ifFlag || retItem(item)));
        }
        return { value: ifFlag };
      })(ifArr, curList);
    let ifFlag;
    if (ifArr[0].includes("!")) {
      const tag = ifArr[0].replace("!", "");
      ifFlag = !curTagsStr.includes(tag);
    } else ifFlag = curTagsStr.includes(ifArr[0]);
    for (let i = 1; i < ifArr.length; i++) {
      let item = ifArr[i];
      item.includes("&&")
        ? ((item = item.replace("&&", "")),
          item.includes("!")
            ? ((item = item.replace("!", "")),
              (ifFlag = ifFlag && !curTagsStr.includes(item)))
            : (ifFlag = ifFlag && curTagsStr.includes(item)))
        : item.includes("||") &&
          ((item = item.replace("||", "")),
          item.includes("!")
            ? ((item = item.replace("!", "")),
              (ifFlag = ifFlag || !curTagsStr.includes(item)))
            : (ifFlag = ifFlag || curTagsStr.includes(item)));
    }
    return { value: ifFlag };
  }
  function retIfMod({
    name,
    value,
    posiTagList = [],
    negaTagList = [],
    dom,
    ifResult = { value: !1, ifName: "" },
  } = {}) {
    let configItem, ifStr, ifFlag;
    if ("else" === name)
      (ifFlag = !ifResult.value),
        (configItem = `${name} [${configEnMap[name]}] > ${ifResult.ifName} : `);
    else {
      ifStr = name.replaceAll("$__8", "||").replaceAll(", ", ",");
      const ifIndex = ifStr.indexOf(">");
      if (ifIndex < 0)
        return { name: "ERROR", value: "ERROR", msg: `${ifStr}的格式书写错误` };
      let curList;
      (name = ifStr.substring(0, ifIndex)),
        (ifStr = ifStr.substring(ifIndex + 1, ifStr.length)),
        (configItem = `${name}>${ifStr} [${configEnMap[name]}]: `),
        (curList =
          "ifset" === name
            ? posiTagList
            : "ifmod" === name && dom
            ? dom.modEle
              ? dom.modEle.value
              : []
            : name.includes("-")
            ? negaTagList
            : posiTagList),
        (ifFlag = retIf(ifStr, curList, name).value);
    }
    let skipNum,
      modValue = "true";
    return (
      "1" ===
        (value = (value = value.toLowerCase())
          .replace("终止", "false")
          .replace("0", "false")
          .replace("继续", "true")
          .replace("to", "To")
          .replace("强制跳过", "skipTo")
          .replace("跳过", "skip")
          .replace("pass", "skip")) && (value = "true"),
      "false" === value
        ? ((value = "终止"), (modValue = "false"))
        : "true" === value
        ? (value = ifFlag ? "继续" : "终止")
        : value.includes("skipTo")
        ? ((skipNum = value[value.length - 1]),
          "123456789".includes(skipNum) || (skipNum = 1),
          (modValue = "skipTo" + skipNum),
          (value = "跳过"))
        : value.includes("skip")
        ? ((skipNum = value[value.length - 1]),
          "123456789".includes(skipNum) || (skipNum = 1),
          (modValue = "skip" + skipNum),
          (value = ifFlag ? "继续" : "跳过"))
        : (value = ifFlag ? "继续" : "终止"),
      (configItem += modValue + "-"),
      (configItem += "跳过" === value ? `跳过${skipNum}项` : value),
      { name, value, configItem, modValue, ifFlag }
    );
  }
  function retIftag(infoArr, name, value, posiTagList, negaTagList) {
    let configItem,
      ifStr = name.replaceAll("$__8", "||").replaceAll(", ", ",");
    const ifInfoArr = ifStr.split(">");
    if (((name = ifInfoArr[0]), 1 === ifInfoArr.length))
      return { name: "ERROR", value: "ERROR", msg: `${name}的格式书写错误` };
    (ifStr = ifInfoArr[1]),
      (configItem = `${name}>${ifStr} [${configEnMap[name]}]: `);
    const ifFlag = retIf(ifStr, posiTagList, name).value;
    return (
      ifFlag
        ? "iftag" === name || "iftagTo" === name
          ? (value &&
              (infoArr[2] || (value = infoArr[1].replaceAll(";", ",")),
              posiTagList.push(value)),
            (configItem += `添加正面tag '${value}'`))
          : ("iftag-" !== name && "iftagTo-" !== name) ||
            (value &&
              (infoArr[2] || (value = infoArr[1].replaceAll(";", ",")),
              negaTagList.push(value)),
            (configItem += `添加负面tag '${value}'`))
        : (configItem += "未满足"),
      { name, value, configItem, ifFlag }
    );
  }
  function retChange(infoArr, name, value, posiTagList, negaTagList) {
    let configItem,
      newList,
      ifStr = name.replaceAll("$__8", "||").replaceAll(", ", ",");
    const ifInfoArr = ifStr.split(">");
    if (((name = ifInfoArr[0]), 1 === ifInfoArr.length))
      return { name: "ERROR", value: "ERROR", msg: `${name}的格式书写错误` };
    function changeTagList(curList) {
      let curTagsStr = curList.join(",").replaceAll(", ", ",");
      if (curTagsStr.includes(ifStr) || name.includes("changeTo"))
        if (name.includes("changeTo")) {
          const result = retIf(ifStr, curTagsStr, name);
          if (result.value) {
            let newTag;
            if (value)
              if (value.includes("$_0")) {
                const oldTag = result.newList[result.index];
                (newTag = value.replaceAll("$_0", oldTag)),
                  result.newList.splice(result.index, 1, newTag);
              } else result.newList.splice(result.index, 1, value);
            else result.newList.splice(result.index, 1);
            configItem +=
              "" === value
                ? `删除满足'${ifStr}'的一项`
                : `修改满足'${ifStr}'的一项为'${newTag || value}'`;
          }
          (configItem += result.value ? "" : "无修改项"),
            (newList = result.newList);
        } else
          name.includes("change") &&
            ((curTagsStr = curTagsStr.replace(ifStr, value)),
            (newList = curTagsStr.split(",")),
            (newList = newList.filter((s) => s && s.trim())),
            (configItem +=
              "" === value ? `删除'${ifStr}'` : `修改'${ifStr}'为'${value}'`));
      else configItem += "无修改项";
    }
    return (
      (ifStr = ifInfoArr[1]),
      (configItem = `${name}>${ifStr} [${configEnMap[name]}]: `),
      (value = infoArr[2] ? value : infoArr[1].replaceAll(";", ",")),
      ("-" !== infoArr[1] && "-" !== value) || (value = ""),
      name.includes("-")
        ? changeTagList(negaTagList)
        : changeTagList(posiTagList),
      { name, value, configItem, newList }
    );
  }
  function retIfModel(name, value, dom) {
    return retIfMod({ name, value, dom });
  }
  function retElse(value, ifFlag) {
    return retIfMod({ name: "else", value, ifResult: ifFlag });
  }
  function getTemplateResult(dom, str, isChangeValue = !0, oldTags = []) {
    if (!str) return { tags: "", negaTags: "", configs: "", msg: "ERROR" };
    const templateArr = str.split("+"),
      tagArr = templateArr[0].split(/!tag=|!Tag=/),
      posiTagInfo = tagArr[0],
      negaTagInfo = tagArr[1],
      posiTagArr = posiTagInfo ? posiTagInfo.split("|") : [],
      negaTagArr = negaTagInfo ? negaTagInfo.split("|") : [];
    let posiTagList = [],
      negaTagList = [],
      configList = [],
      cfgNameValueList = [];
    const runCfg = {};
    let ifFlagList = [];
    const tmpDom = {
      posiEle: null,
      negaEle: null,
      startBtn: null,
      skipBtn: null,
    };
    function getTags(tagArr, tagFlag = "tag") {
      for (let i = 0; i < tagArr.length; i++) {
        let item = tagArr[i].trim();
        if (item)
          if ("#" === item[0]) {
            item = item.replace("#", "");
            const infoArr = item.split("/");
            let value = addTagInfo(
                `/${infoArr[1]}/${infoArr[2] ? infoArr[2] : ""}`
              ),
              name = infoArr[0].replaceAll("$__8", "||");
            const oldName = name;
            let result;
            if (
              ((name = enToZn(name)),
              name.includes("if") && !name.includes("iftag"))
            )
              result = name.includes("ifmod")
                ? retIfModel(name, value, dom)
                : retIfMod({ name, value, posiTagList, negaTagList });
            else if (name.includes("else")) {
              const ifFlag = ifFlagList[ifFlagList.length - 1];
              ifFlagList.pop(), (result = retElse(value, ifFlag));
            } else
              name.includes("change")
                ? ((result = retChange(
                    infoArr,
                    name,
                    value,
                    posiTagList,
                    negaTagList
                  )),
                  result.newList &&
                    "ERROR" !== result.name &&
                    "ERROR" !== result.value &&
                    (result.name.includes("-")
                      ? (negaTagList = result.newList)
                      : (posiTagList = result.newList)))
                : name.includes("iftag") &&
                  (result = retIftag(
                    infoArr,
                    name,
                    value,
                    posiTagList,
                    negaTagList
                  ));
            if (
              (name.includes("if") &&
                ifFlagList.push({ value: result.ifFlag, ifName: result.name }),
              result)
            ) {
              if ("ERROR" === result.name && "ERROR" === result.value) {
                const showMsg = `ERROR: ${
                  "tag" === tagFlag ? "正面" : "负面"
                }Tag模块中第${i + 1}项配置${result.msg}`;
                return (
                  alert(showMsg),
                  console.log(showMsg),
                  { tags: "", negaTags: "", configs: "", msg: "ERROR" }
                );
              }
              (name = result.name), (value = result.value);
            }
            if (!configEnMap[name] && !name.includes(">")) {
              const showMsg = `ERROR: ${
                "tag" === tagFlag ? "正面" : "负面"
              }Tag模块中第${i + 1}项配置'${oldName}'的名称书写错误`;
              return (
                alert(showMsg),
                console.log(showMsg),
                { tags: "", negaTags: "", configs: "", msg: "ERROR" }
              );
            }
            if ("终止" === value) break;
            if ("跳过" === value) {
              i += +result.modValue[result.modValue.length - 1];
              continue;
            }
          } else {
            const curTag = addTagInfo(item);
            curTag &&
              ("tag" === tagFlag
                ? posiTagList.push(curTag)
                : negaTagList.push(curTag));
          }
      }
    }
    if ((getTags(posiTagArr), getTags(negaTagArr, "tag-"), templateArr[1])) {
      let commonStr, commonEndStr;
      const configsNum = 2 === templateArr.length ? 1 : templateArr.length - 2;
      let weightArr,
        curConfigs = templateArr[1];
      if (configsNum >= 2) {
        (templateArr[templateArr.length - 1] = templateArr[
          templateArr.length - 1
        ]
          .replaceAll("-0", "common")
          .replaceAll("公共", "common")
          .replaceAll("-1", "common-")),
          (weightArr = templateArr[templateArr.length - 1].split(","));
        const commonIndex = weightArr.indexOf("common");
        commonIndex >= 0 &&
          ((commonStr = templateArr.splice(commonIndex + 1, 1)),
          weightArr.splice(commonIndex, 1));
        const commonEndIndex = weightArr.indexOf("common-");
        if (
          (commonEndIndex >= 0 &&
            ((commonEndStr = templateArr.splice(commonEndIndex + 1, 1)),
            weightArr.splice(commonEndIndex, 1)),
          (templateArr[templateArr.length - 1] =
            templateArr[templateArr.length - 1].trim()),
          !"1234567890-c公".includes(templateArr[templateArr.length - 1][0]))
        )
          return (
            alert("ERROR: 请在最后书写每个配置模块的概率比值"),
            console.log("ERROR: 请在最后书写每个配置模块的概率比值"),
            { tags: "", negaTags: "", configs: "", msg: "ERROR" }
          );
        (curConfigs = templateArr[getRandomWeight(weightArr) + 1]),
          (commonStr || commonEndStr) &&
            (curConfigs = (
              (commonStr ? commonStr + "|" : "") +
              curConfigs +
              (commonEndStr ? "|" + commonEndStr : "")
            )
              .replaceAll("||", "|")
              .replaceAll("||", "|"));
      }
      const configArr = curConfigs.split("|");
      for (let i = 0; i < configArr.length; i++) {
        const item = configArr[i].trim();
        if (item) {
          const flag = toConfigItem(item, i);
          if (-1 === flag)
            return { tags: "", negaTags: "", configs: "", msg: "ERROR" };
          if ("终止" === flag) break;
          if (flag && flag.includes("skip")) {
            i += +flag[flag.length - 1];
          }
        }
      }
    }
    function toConfigItem(configStr, index) {
      if (!configStr) return;
      const infoArr = configStr.split("/");
      let value = addTagInfo(`/${infoArr[1]}/${infoArr[2] ? infoArr[2] : ""}`),
        name = infoArr[0].replaceAll("$__8", "||");
      const oldName = name;
      let configItem;
      name = name.toLowerCase();
      let isUseCfg = !0;
      ["tag", "tags", "模块tag", "模块tags"].includes(name)
        ? (value &&
            (infoArr[2] || (value = infoArr[1].replaceAll(";", ",")),
            posiTagList.push(value)),
          (isUseCfg = !1))
        : ["tag-", "tags-", "模块负面tag", "模块负面tags"].includes(name) &&
          (value &&
            (infoArr[2] || (value = infoArr[1].replaceAll(";", ",")),
            negaTagList.push(value)),
          (isUseCfg = !1));
      let result,
        if_name = oldName;
      if (
        ((if_name = enToZn(if_name)),
        if_name.includes("if") && !if_name.includes("iftag"))
      )
        result = if_name.includes("ifset")
          ? retIfMod({ name: if_name, value, posiTagList: cfgNameValueList })
          : if_name.includes("ifmod")
          ? retIfModel(if_name, value, dom)
          : retIfMod({ name: if_name, value, posiTagList, negaTagList });
      else if (if_name.includes("else")) {
        const ifFlag = ifFlagList[ifFlagList.length - 1];
        ifFlagList.pop(), (result = retElse(value, ifFlag));
      } else if (if_name.includes("change"))
        (result = retChange(infoArr, if_name, value, posiTagList, negaTagList)),
          result.newList &&
            "ERROR" !== result.name &&
            "ERROR" !== result.value &&
            (result.name.includes("-")
              ? (negaTagList = result.newList)
              : (posiTagList = result.newList));
      else if (if_name.includes("iftag"))
        result = retIftag(infoArr, if_name, value, posiTagList, negaTagList);
      else if (
        oldName.includes(">") &&
        [
          "tmpEle",
          "dom",
          "模板元素",
          "模板dom",
          "选择元素",
          "选择dom",
          "元素",
        ].includes(oldName.split(">")[0])
      )
        (result = (function changeTmpEle(infoArr, nameStr, value, dom) {
          console.log(nameStr, value);
          const flagIndex = nameStr.indexOf(">");
          if (-1 === flagIndex)
            return {
              name: "ERROR",
              value: "ERROR",
              msg: `${nameStr}的格式书写错误, 缺少 > 分隔字符`,
            };
          let name = nameStr.slice(0, flagIndex);
          const selector = restoreChar(
              nameStr.slice(flagIndex + 1, nameStr.length + 1)
            ),
            tmpEle = getEle(dom, selector);
          if (!tmpEle)
            return {
              name: "ERROR",
              value: "ERROR",
              msg: `的模版元素获取失败, 请检查选择器'${selector}'是否书写正确`,
            };
          let zn;
          "dom" !== name &&
            "tmpEle" !== name &&
            ((zn = name), (name = configZnMap[name]));
          const configItem = `${name} [${
            zn || configEnMap[name]
          }]: 设置选择器'${selector}'选中元素的值为${value}`;
          return (
            infoArr[2] || (value = infoArr[1]),
            changeDomValue(tmpEle, value || 0),
            { name, value, configItem }
          );
        })(infoArr, oldName, value, dom)),
          (isUseCfg = !1);
      else {
        ["tmpF", "tmpTime", "tmpNum", "Ele", "Btn"].includes(name) &&
          (name = oldName);
        let showValue = value;
        if (
          (value.includes(",") && (showValue = "'" + value + "'"),
          name[0] >= "a" && name[0] <= "z"
            ? (configItem = `${name} [${configEnMap[name]}]: ${showValue}`)
            : ((configItem = `${configZnMap[name]} [${name}]: ${showValue}`),
              (name = configZnMap[name])),
          ("tmpF" !== name && "tmpTime" !== name && "tmpNum" !== name) ||
            ((runCfg[name] =
              "tmpTime" === name && 0 == +value ? 0 : +value || 1),
            (isUseCfg = !1)),
          ["posiEle", "negaEle", "startBtn", "skipBtn"].includes(name) &&
            "null" !== value &&
            ((tmpDom[name] = getEle(dom, restoreChar(value))),
            (configItem = `${name} [${configEnMap[name]}]: 选择器为'${showValue}'`),
            (isUseCfg = !1)),
          "click" === name)
        ) {
          tmpDom[name] = [];
          const clickEle = getEle(dom, restoreChar(value));
          tmpDom[name].push(clickEle),
            clickEle.click(),
            (configItem = `${name} [${configEnMap[name]}]: 点击选择器'${showValue}'选中的元素`),
            (isUseCfg = !1);
        }
      }
      if (
        (if_name.includes("if") &&
          ifFlagList.push({ value: result.ifFlag, ifName: result.name }),
        result)
      ) {
        if ("ERROR" === result.name && "ERROR" === result.value)
          return (
            alert(`ERROR: 第${index + 1}项配置${result.msg}`),
            console.log(`ERROR: 第${index + 1}项配置${result.msg}`),
            -1
          );
        (if_name = result.name),
          (value = result.value),
          (configItem = result.configItem);
      }
      if (configEnMap[name])
        cfgNameValueList.push([name, value]), configList.push(configItem);
      else {
        if (!configEnMap[if_name])
          return (
            alert(`ERROR: 第${index + 1}项配置'${oldName}'的名称书写错误`),
            console.log(
              `ERROR: 第${index + 1}项配置'${oldName}'的名称书写错误`
            ),
            -1
          );
        cfgNameValueList.push([if_name, value]), configList.push(configItem);
      }
      return "终止" === value
        ? value
        : "跳过" === value
        ? result.modValue
        : void (
            isChangeValue &&
            isUseCfg &&
            value &&
            ("method" === name
              ? ((value = restoreChar(value)),
                changeDomValue(dom, value, "method"))
              : [
                  "steps",
                  "width",
                  "height",
                  "count",
                  "size",
                  "cfg",
                  "seed",
                ].includes(name) &&
                (("width" !== name && "height" !== name) ||
                  (value = 8 * parseInt(value / 8)),
                "cfg" === name && (value = parseInt(2 * value) / 2),
                changeDomValue(dom[name + "Ele"], value)))
          );
    }
    (posiTagList = posiTagList.filter((s) => s && s.trim())),
      (negaTagList = negaTagList.filter((s) => s && s.trim()));
    let posiTagStr = posiTagList.join(","),
      negaTagStr = negaTagList.join(",");
    0 === oldTags.length &&
      dom &&
      (oldTags = [dom.positiveEle.value, dom.negativeEle.value]),
      (posiTagStr = posiTagStr.replaceAll(
        "&",
        oldTags[0] ? oldTags[0] + "," : ""
      )),
      (negaTagStr = negaTagStr.replaceAll(
        "&",
        oldTags[1] ? oldTags[1] + "," : ""
      )),
      (posiTagStr = toEnChar(posiTagStr)),
      (negaTagStr = toEnChar(negaTagStr)),
      (posiTagStr = restoreChar(posiTagStr)),
      (negaTagStr = restoreChar(negaTagStr));
    let cfgStr = configList.join("\n");
    return (
      (cfgStr = restoreChar(cfgStr)),
      (cfgStr = cfgStr ? cfgStr + "\n" : ""),
      isChangeValue &&
        (posiTagStr &&
          changeDomValue(tmpDom.posiEle || dom.positiveEle, posiTagStr),
        negaTagStr &&
          changeDomValue(tmpDom.negaEle || dom.negativeEle, negaTagStr)),
      {
        tags: posiTagStr,
        negaTags: negaTagStr,
        configs: cfgStr,
        cfgList: cfgNameValueList,
        runCfg,
        tmpDom,
      }
    );
  }
  function getTmpStr(tmpObj) {
    return `Tags:\n${tmpObj.tags}${tmpObj.tags ? "\n" : ""}Negative Tags:\n${
      tmpObj.negaTags
    }${tmpObj.negaTags ? "\n" : ""}Configs:${tmpObj.configs ? "\n" : ""}${
      tmpObj.configs
    }`;
  }
  const templates = {
      random_tmp_1:
        "// 随机抽卡模板1 |\n// 随机模板1 |\n// 正面tag模块 |\n((masterpiece)),((best quality)),1girl,solo |\n// 负面Tag模块 |\n!tag=nsfw,(worst quality,low quality:1.4),(lip,nose,tooth,rouge,lipstick,eyeshadow:1.4),(blush:1.2),(jpeg artifacts:1.4),(depth of field,bokeh,blurry,film grain,chromatic aberration,lens flare:1.0),(1boy,abs,muscular,rib:1.0),greyscale,monochrome,dusty sunbeams,trembling,motion lines,motion blur,emphasis lines,text,title,logo,signature,pregnancy\n+\n// 配置模块 x3 |\nwidth/1024/|\nheight/640/+\nwidth/832/|\nheight/832/+\n// 初始公共配置模块 |\nsteps/50/|\nmethod/DDIM,DPM#+#+ 2M Karras/all|\ncfg/5,6,7,8/1,1,2,1|\nseed/-1/+\n1,1,-0",
      random_tmp_2:
        "// 随机抽卡模板2 |\n// 随机模板2 |\n// 正面tag模块 |\n((masterpiece)),((best quality)),1girl,solo |\n// 负面Tag模块 |\n!tag=lowres,bad anatomy,bad hands,((text)),(watermark),error,missing fingers,extra digit,fewer digits,cropped,worst quality,low quality,normal quality,((username)),blurry,(extra limbs)\n+\n// 配置模块 x8 |\nwidth/960/|\nheight/704/|\ncfg/5,6,7,8/1,2,2,1+\nwidth/1088/|\nheight/768/|\ncfg/5,6,7,8,9/1,2,2,1,1+\nwidth/1280/|\nheight/896/|\ncfg/5,6,7,8,9/1,1,2,1,1+\nwidth/1024/|\nheight/1024/|\ncfg/5,6,7,8/1,1,2,1+\nwidth/1280/|\nheight/640/|\ncfg/5,6,7,8/1,1,2,1+\nwidth/640/|\nheight/1024/|\ncfg/5,6,7,8/1,1,2,1|\ntags/[[full body]],full body,(full body),/2,1,1,16|\ntags-/(extra skirt),(two skirt)/+\nsteps/30,50/1,1|\nmethod/PLMS/|\nwidth/1280/|\nheight/896,640/1,1|\ncfg/4,5,6/1,2,1+\n// 初始公共配置模块 |\nsteps/50/|\nmethod/Euler,DPM#+#+ 2M Karras/all|\nseed/-1/+\n4,4,4,4,6,6,2,-0",
      adjust_posiTag_1:
        "// 分差选图模板1[正面tag] |\n&/masterpiece,(masterpiece),((masterpiece)),(((masterpiece))),/1,6,2,1,118|\n/best quality,(best quality),((best quality)),(((best quality))),/1,6,2,1,118|\n/ultra-detailed,(ultra-detailed),((ultra-detailed)),(((ultra-detailed))),/1,6,2,1,118|\n/[CG],CG,(CG),((CG)),/1,6,2,1,118|\n/[wallpaper],wallpaper,(wallpaper),((wallpaper)),/1,6,2,1,118|\n/[illustration],illustration,(illustration),((illustration)),/1,6,2,1,118|\n/[Creative],Creative,(Creative),((Creative)),/1,6,2,1,118|\n/[original],original,(original),((original)),/1,6,2,1,118|\n/[mimikaki],mimikaki,(mimikaki),((mimikaki)),/1,6,2,1,118|\n/[imitating],imitating,(imitating),((imitating)),/1,6,2,1,118|\n/[fine_art_parody],fine_art_parody,(fine_art_parody),((fine_art_parody)),/1,6,2,1,118|\n/[pixiv],pixiv,(pixiv),((pixiv)),/1,6,2,1,118|\n/[azur lane],azur lane,(azur lane),((azur lane)),/1,6,2,1,118|\n/[arknights],arknights,(arknights),((arknights)),/1,6,2,1,118|\n/[girls' frontline],girls' frontline,(girls' frontline),((girls' frontline)),/1,6,2,1,118|\n/[beautiful],beautiful,(beautiful),((beautiful)),/1,6,2,1,118|\n/[detailed],detailed,(detailed),((detailed)),/1,6,2,1,118|\n/[details],details,(details),((details)),/1,6,2,1,118|\n/[rendering],rendering,(rendering),((rendering)),/1,6,2,1,118|\n/[extremely],extremely,(extremely),((extremely)),/1,6,2,1,118|\n/[exquisite],exquisite,(exquisite),((exquisite)),/1,6,2,1,118|\n/[quality],quality,(quality),((quality)),/1,6,2,1,118|\n/[highres],highres,(highres),((highres)),/1,6,2,1,118|\n/[dream],dream,(dream),((dream)),/1,6,2,1,118|\n/[imagining],imagining,(imagining),((imagining)),/1,6,2,1,118|\n/[shadow],shadow,(shadow),((shadow)),/1,6,2,1,118|\n/[ray tracing],ray tracing,(ray tracing),((ray tracing)),/1,6,2,1,118|",
      add_creative_1:
        "// 创意叠加 |\n// 增加想象力,创造力的附加tags, 需在页面文本框中书写基础tags |\n&/\nillustration,polychrome,plentiful,peculiar,Creative,Abundant detail,Abundant detail,Full of imagination;\nillustration,glowing,sunlight,light particles,absurdres,fantasy,bang dream!,marvel,imagining/\n1,1|",
      night_flower_butterfly:
        "// 花与蝶 |\n// 正面Tag模块 |\n/(masterpiece),(best quality);((masterpiece)),((best quality));(((masterpiece))),(((best quality)))/3,2,1|\n/#2[black background,garden]#/|\n#changeTo>garden/$_0;$_0,giant plant/all|\ncolorful flower,light particles,[butterfly]|\nan extremely delicate and beautiful|\nillustration,polychrome,plentiful,peculiar,Creative,Abundant detail,Abundant detail,Full of imagination|\n\n((1girl)),((solo))|\nloli|\n// loli [可选配置, 取消下一行注释即可] |\n// #changeTo>loli/(loli:1.4);(loli:1.4),child/all|\n/(beautiful detailed eyes),/all|\n// 发色 [可选配置, 取消下一行注释即可] |\n// hair/white,black,blonde,brown,light pink,light blue,light purple,light green/all|\n// 发型 [可选配置, 取消下一行注释即可] |\n// /(wavy_hair),(curly_hair),(twin braids),(french braid),(side ponytail),(two side up hair),(twintails)--1,(low twintails)--1,(wavy twintails)--1,(curly twintails)--1,(wavy low twintails)--3,/all6|\n/long hair,(floating long hair),(very long hair)/all|\n/hair ribbon,hair ornament,headdress,/3,1,1,3|\n/(off-shoulder_shirt),(detached_sleeves),shirt/all|\n// 藏手 [可选配置, 取消下一行注释即可] |\n// (arms behind back)|\n/pleated_miniskirt,miniskirt,skirt/all|\n#changeTo>miniskirt/$_0,(plaid skirt);$_0/all|\n#if>garden/skip1/|\n/standing,sitting,/1,1,4|\n/medium breasts,/all|\ndetailed unity 8K CG wallpaper|\n// 负面Tag模块 |\n!tag=\n#ifmod>AbyssOrangeMix||Counterfeit/skip1/|\nnsfw,(worst quality,low quality:1.4),(lip,nose,tooth,rouge,lipstick,eyeshadow:1.4),(blush:1.2),(jpeg artifacts:1.4),(depth of field,bokeh,blurry,film grain,chromatic aberration,lens flare:1.0),(1boy,abs,muscular,rib:1.0),greyscale,monochrome,dusty sunbeams,trembling,motion lines,motion blur,emphasis lines,text,title,logo,signature,|\n#else/skip1/|\nlowres,bad anatomy,bad hands,text,error,missing fingers,extra digit,fewer digits,cropped,worst quality,low quality,normal quality,jpeg artifacts,signature,watermark,username,blurry,artist name,extra arms,extra fingers,thick hand,bad hand,extra hands,three hands,bad leg,extra legs,three legs,extra thighs,three thighs,extra feet,three feet|\n+\n// 配置模块 x3 |\nwidth/1024/|\nheight/640/+\nwidth/832/|\nheight/832/+\n// 初始公共配置模块 |\nsteps/50/|\nmethod/#[DDIM--2,DPM#+#+ 2M Karras--2]#/|\ncfg/5.5,6,7/1,2,2|\nifmod>AbyssOrangeMix/skip1/|\ncfg/7/|\nseed/-1/+\n// 将以下对应尺寸模块的概率值调高即可单出某个尺寸 |\n1000000,1,-0",
      mushrooms_loli_1:
        "// 采蘑菇的小女孩 |\n// 正面Tag模块 |\n/(masterpiece),(best quality);((masterpiece)),((best quality));(((masterpiece))),(((best quality)))/3,2,1|\n(#[giant ,]#mushrooms,flower)|\nFireflies,Carry a basket|\nillustration,glowing,sunlight,light particles,absurdres,fantasy,bang dream!,marvel,imagining|\n(loli:1.4),child|\n(1girl),(solo)|\n/eyes,/all|\nlong hair|\n// 发色 [可选配置, 取消下一行注释即可] |\n// hair/white,black,blonde,brown,light pink,light blue,light purple,light green/all|\n// 发型 [可选配置, 取消下一行注释即可] |\n// /wavy_hair,curly_hair,twin braids,french braid,side ponytail,two side up hair,twintails--1,low twintails--1,wavy twintails--1,curly twintails--1,wavy low twintails--3,/all6|\nhair ribbon|\n/shirt,(off-shoulder_shirt),detached_sleeves,--1/all2|\n/pleated_miniskirt,miniskirt,skirt/all|\n#changeTo>miniskirt/$_0,plaid skirt;$_0/all|\nhat\n// 负面Tag模块 |\n!tag=nsfw,(worst quality,low quality:1.4),(lip,nose,tooth,rouge,lipstick,eyeshadow:1.4),(blush:1.2),(jpeg artifacts:1.4),(depth of field,bokeh,blurry,film grain,chromatic aberration,lens flare:1.0),(1boy,abs,muscular,rib:1.0),greyscale,monochrome,dusty sunbeams,trembling,motion lines,motion blur,emphasis lines,text,title,logo,signature,pregnancy\n+\n// 配置模块 x5 |\nwidth/1024/|\nheight/640/+\nwidth/960/|\nheight/768/+\nwidth/832/|\nheight/832/+\nwidth/1024/|\nheight/1024/+\n// 初始公共配置模块 |\nsteps/50/|\nmethod/#[DPM#+#+ 2M Karras--2,DDIM--2]#/|\ncfg/5.5,6,7/1,2,2|\nifmod>AbyssOrangeMix/skip1/|\ncfg/7/|\nseed/-1/+\n// 将以下对应尺寸模块的概率值调高即可单出某个尺寸 |\n1,1000000,1,1,-0",
      cat_soup_1:
        "// 铁锅炖猫猫 |\n// 正面Tag模块 |\nmasterpiece,best quality|\nwhite background|\nextremely detailed|\n(circle shape,water floating,high saturation:1.3)|\n(chibi,thick outline:1.2)|\n(1 cute yukkuri shiteitte ne)|\neyes/closed,/2,1|\nhair/white,black,pink,blond,brown,purple,blue,green,orange,red,colorful--2,colored--2,--6/all4|\n/leaning forward,/2,1|\n(sitting inside a big pot,long hair,cat ear,detailed cute face)|\nLiquid body|\n/(Carrot soup),(Cabbage soup),(Vegetable soup),(Chocolate soup),(mushroom soup)/all|\n(smoked),(big spots),surrounded by shining bubbles,(Diffuse smoke,boiling water)|\n// 负面Tag模块 |\n!tag=lowres,bad anatomy,bad hands,text,error,missing fingers,extra digit,fewer digits,cropped,worst quality,low quality,normal quality,jpeg artifacts,signature,watermark,username,blurry,artist name,extra arms,extra fingers,thick hand,bad hand,extra hands,three hands,bad leg,extra legs,three legs,extra thighs,three thighs,extra feet,three feet\n+\n// 配置模块 x4 |\n// 推荐下面3个尺寸,自选,调高末尾对应的概率值即可,640尺寸出图更精致 |\nwidth/384/|\nheight/384/+\nwidth/448/|\nheight/448/+\nwidth/640/|\nheight/640/+\n// 末尾公共配置模块 |\nsteps/40/|\nmethod/DDIM/|\ncfg/8/|\ncount/1/|\nsize/2/|\nseed/-1/|\nchangeTo>purple||blue||green||red&&hair/light $_0,$_0/1,1+\n// 将以下对应尺寸模块的概率值调高即可单出某个尺寸 |\n1,1,1000000,-1",
      cat_plant_1:
        "// 猫猫盆栽 |\n// 正面Tag模块 |\nmasterpiece,best quality|\n(white background)|\nextremely detailed|\n(high saturation:1.3)|\n(chibi,thick outline:1.2)|\n(1 cute yukkuri shiteitte ne)|\nhair/white,black,pink,blond,brown,purple,blue,green,orange,red,colorful--2,colored--2,--6/all4|\n(long hair,cat ear,detailed cute face)|\n(inside a big flower pot)|\n//(potted plant:1.3,large plant,1 potted plant,flower:1.2)|\n(flower pot:1.2,1 flower pot,plant,flower:1.2)|\n// 负面Tag模块 |\n// 需要第一个负面tag的效果最佳,将第一个负面tag取消注释即可,但需使用EasyNegative.pt这个embeddings插件[Counterfeit模型的负面tag的训练集],若无该插件 |\n!tag=\n// EasyNegative,extra fingers,fewer fingers|\nlowres,bad anatomy,bad hands,((text)),(watermark),error,missing fingers,extra digit,fewer digits,cropped,worst quality,low quality,normal quality,((username)),blurry,(extra limbs)|\n+\n// 配置模块 x4 |\n// 推荐下面3个尺寸,自选,调高末尾对应的概率值即可,640尺寸出图更精致 |\nwidth/384/|\nheight/384/+\nwidth/448/|\nheight/448/+\nwidth/640/|\nheight/640/+\n// 末尾公共配置模块 |\nsteps/40/|\nmethod/DDIM/|\ncfg/8/|\ncount/1/|\nsize/2/|\nseed/-1/|\nchangeTo>purple||blue||green||red&&hair/light $_0,$_0/1,1+\n// 将以下对应尺寸模块的概率值调高即可单出某个尺寸 |\n1,1000000,1,-1",
      Q_meme_1:
        "// Q版表情包1 |\n// 正面Tag模块 |\n(masterpiece),(best quality)|\nwhite background|\nextremely detailed|\n(high saturation:1.3),(chibi,thick outline:1.3)|\n/loli,(loli),(loli:1.4),/-|\ngirl|\n/[beautiful detailed eyes],(beautiful detailed eyes)/-|\n/twintails,(low twintails),(two side up hair),side ponytail,/2,2,2,1,4|\n/long hair,floating hair/-|\n/(cute face),/-|\n/full body,/-|\n/dynamic face,/-|\ndynamic pose|\n// 负面Tag模块 |\n!tag=lowres,bad anatomy,bad hands,text,error,missing fingers,extra digit,fewer digits,cropped,worst quality,low quality,normal quality,jpeg artifacts,signature,watermark,username,blurry,artist name,extra arms,extra fingers,thick hand,bad hand,extra hands,three hands,bad leg,extra legs,three legs,extra thighs,three thighs,extra feet,three feet\n+\n// 配置模块 x4 |\n// 推荐下面3个尺寸,自选,调高末尾对应的概率值即可 |\nwidth/256/|\nheight/256/+\nwidth/384/|\nheight/384/+\nwidth/448/|\nheight/448/+\n// 末尾公共配置模块 |\nsteps/40/|\nmethod/DDIM/|\ncfg/8/|\ncount/1/|\nsize/4/|\nseed/-1/+\n// 将以下对应尺寸模块的概率值调高即可单出某个尺寸 |\n1,1000000,1,-1",
      expression_1:
        "// 表情绘-附加模版 |\n&\n(#all[\n// 轻笑 |light smile;\n// 微笑 |smile;\n// 大笑 |grin;\n// 眼泪 |tears;\n// 哭泣 |crying;\n// 睁眼哭 |crying with eyes open;\n// 水汪汪的眼睛 |aqua eyes;\n// 伤心 |sad;\n// 喝醉 |drunk;\n// 皱眉 |frown;\n// 生气 |angry;\n// 恼火 |annoyed;\n// 疯狂 |crazy;\n// 黑化 |dark persona;\n// 白眼 |rolling eyes;\n// 无表情的 |expressionless;\n// 努嘴 |pout;\n// 好奇 |\n// 疑惑 |\n// 口头问号 |spoken question mark;\n// 惊讶 |surprised;\n// 害怕 |scared;\n// 害羞 |sky;\n// 脸红 |blush;\n// 斜线脸红 |blush stickers;\n// 尴尬 |embarrassed;\n// 傲娇--傲慢,沾沾自喜,神气十足 |arrogant,smug,swagger;\n// 困的 |sleepy;\n// 叹气 |sigh;\n// 迷离,痴迷 |ahegao;\n// 搞怪,下流 |naughty face;\n// 忍耐 |endured face;\n// 嘴唇 |lips;\n// 张嘴 |open mouth;\n// 闭嘴 |closed mouth;\n// 波浪嘴 |wavy mouth;\n// 三角嘴 |triangle mouth;\n// 侧边嘴 |sideways mouth;\n// 咬嘴唇 |lip biting;\n// 咬牙 |clenched teeth;\n// 吐舌 |tongue out;\n// 眨眼 |wink;\n// 眨眼 |one eye closed;\n// 凝视 |staring;\n// 看着你 |looking at viewer;\n// 疯狂的眼睛 |crazy eyes;\n// 异色瞳 |heterochromia;\n// 竖瞳 |slit pupils;\n// 心瞳 |heart-shaped pupils;\n// 颜文字 |\n> <;\n^ ^;\n^^^;\n^o^;\no_o;\n0_0;\n3_3;\n=_=;\n:d;\n:p;\n#;p;\n:q;\n:t;\n:3;\n:<;\n:>;\no3o;\n@_@\n]#)",
      img_img_base:
        "// 图生图模式基础模版 |\n// 注: 仅正负面tag有效, 其余需要在页面自行设置 |\n// 正面tag |\n\n// 负面tag |\n!tag=nsfw,(worst quality,low quality:1.4),(lip,nose,tooth,rouge,lipstick,eyeshadow:1.4),(blush:1.2),(jpeg artifacts:1.4),(depth of field,bokeh,blurry,film grain,chromatic aberration,lens flare:1.0),(1boy,abs,muscular,rib:1.0),greyscale,monochrome,dusty sunbeams,trembling,motion lines,motion blur,emphasis lines,text,title,logo,signature,pregnancy\n+\n// 配置模块 |\n正面元素/#img2img_prompt textarea/|\n负面元素/#img2img_neg_prompt textarea/|\n开始按钮/#img2img_generate/|\n跳过按钮/#img2img_skip/|\n// 文生图 图生图 交替 |\n//正面元素/#[#img2img_prompt textarea;#txt2img_prompt textarea--1]#/|\n//负面元素/#[#img2img_neg_prompt textarea;#txt2img_neg_prompt textarea--1]#/|\n//开始按钮/#[#img2img_generate;#txt2img_generate--1]#/|\n//跳过按钮/#[#img2img_skip;#txt2img_skip--1]#/|",
      img_img_plus:
        "// 图生图模式进阶模版 |\n// 注: 使用该模版时, '查看状态'中的所有数据均按照一轮生成一张图片进行计算 |\n// 正面tag |\n\n// 负面tag |\n!tag=nsfw,(worst quality,low quality:1.4),(lip,nose,tooth,rouge,lipstick,eyeshadow:1.4),(blush:1.2),(jpeg artifacts:1.4),(depth of field,bokeh,blurry,film grain,chromatic aberration,lens flare:1.0),(1boy,abs,muscular,rib:1.0),greyscale,monochrome,dusty sunbeams,trembling,motion lines,motion blur,emphasis lines,text,title,logo,signature,pregnancy\n+\n// 配置模块 |\n// 方法 |\nclick/#txt2img_sampling input[value='DDIM']/|\n// 步数 |\n模板元素>#img2img_steps > input/50/|\n// 宽度 |\n模板元素>#img2img_width > input/640/|\n// 高度 |\n模板元素>#img2img_height > input/640/|\n// 提示词系数 |\n模板元素>#img2img_cfg_scale > input/7/|\n// 批次 |\n模板元素>#img2img_batch_count > input/1/|\n// 批量 |\n模板元素>#img2img_batch_size > input/1/|\n// 重绘幅度 |\n模板元素>#img2img_denoising_strength > input/#[0.65--10,0.75--10,0.85--10]#/|\n// 种子 |\n模板元素>#img2img_seed input/-1/|\n// 裁剪 |\n//click/#img2img_settings #resize_mode [value='Crop and resize']/|\n\n正面元素/#img2img_prompt textarea/|\n负面元素/#img2img_neg_prompt textarea/|\n开始按钮/#img2img_generate/|\n跳过按钮/#img2img_skip/|",
      my_tmp: "",
    },
    templateMap = {
      花与蝶: "night_flower_butterfly",
      采蘑菇的小女孩: "mushrooms_loli_1",
      铁锅炖猫猫: "cat_soup_1",
      猫猫盆栽: "cat_plant_1",
      图生图基础模版: "img_img_base",
      图生图进阶模版: "img_img_plus",
      Q版表情包1: "Q_meme_1",
      表情绘: "expression_1",
      创意叠加: "add_creative_1",
      随机抽卡1: "random_tmp_1",
      随机抽卡2: "random_tmp_2",
      分差选图: "adjust_posiTag_1",
      我的模板: "my_tmp",
    },
    tmp_tips =
      "请输入tag模板\n可使用以下内置模板[输入任意一条即可]:\n花与蝶\n采蘑菇的小女孩\n猫猫盆栽\n铁锅炖猫猫\nQ版表情包1\n表情绘\n创意叠加\n图生图基础模版\n图生图进阶模版\n随机抽卡1\n随机抽卡2\n分差选图\n注: 内置模板中存在较大的配置尺寸, 对显存要求较高, 低显存用户可自行修改模板中的图片尺寸; 拖动右下角可调节文本框宽高";
  function timeFormat(time, connectStr = "", type = "zn") {
    time = +time;
    const formatWordArr = {
        zn: ["天", "小时", "分", "秒"],
        en: ["day", "h", "min", "s"],
      }[type],
      day = Math.floor(time / 60 / 60 / 24),
      hour = Math.floor(time / 60 / 60) % 24,
      minute = Math.floor(time / 60) % 60,
      second = time % 60;
    return (
      (day ? day + formatWordArr[0] : "") +
      connectStr +
      (hour ? hour + formatWordArr[1] : "") +
      connectStr +
      (minute ? minute + formatWordArr[2] : "") +
      connectStr +
      (second ? second + formatWordArr[3] : "0" + formatWordArr[3])
    );
  }
  let id = 100;
  function getMaxLen(loopList) {
    const arr = loopList.map((item) => item.data.length);
    return Math.max(...arr);
  }
  let cfg = { num: 0, tmpList: {} };
  function resetCfg() {
    cfg = { num: 0, tmpList: {} };
  }
  function loopList(txt) {
    const info = (function getLoopList(str) {
      let isTmpLoopList = !1;
      ((str = str
        .replaceAll("#tmpall[", "#tmp0[")
        .replaceAll("#all[", "#0[")
        .replaceAll("#all1[", "#7[")
        .replaceAll("#all2[", "#8[")
        .replaceAll("#all3[", "#9[")).includes("#tmp[") ||
        str.includes("#tmp0[")) &&
        (isTmpLoopList = !0);
      const list = isTmpLoopList
          ? str.split(/(?=#tmp0?\[)|(?<=\]tmp#)/g)
          : str.split(/(?=#\d?\[)|(?<=\]#)/g),
        loopList = [];
      if (
        1 === list.length &&
        !["#1[", "#2[", "#3[", "#0[", "#7[", "#8[", "#9["].includes(
          list[0].slice(0, 3)
        ) &&
        "#[" !== list[0].slice(0, 2) &&
        "#tmp[" !== list[0].slice(0, 5) &&
        "#tmp0[" !== list[0].slice(0, 6)
      )
        return { newTxt: str, loopList, isTmpLoopList };
      let curLoopListNum = 0;
      for (let index = 0; index < list.length; index++) {
        let isCurTmp,
          listType,
          curLevel,
          item = list[index];
        if (
          (item.includes("#tmp[")
            ? ((isCurTmp = !0), (curLevel = 100))
            : item.includes("#tmp0[")
            ? ((isCurTmp = !0), (curLevel = 110))
            : item.includes("#[") || item.includes("#1[")
            ? (curLevel = 1)
            : item.includes("#2[")
            ? (curLevel = 2)
            : item.includes("#3[")
            ? (curLevel = 3)
            : item.includes("#0[")
            ? (curLevel = 10)
            : item.includes("#7[")
            ? (curLevel = 11)
            : item.includes("#8[")
            ? (curLevel = 12)
            : item.includes("#9[") && (curLevel = 13),
          (!isTmpLoopList && curLevel) || isCurTmp)
        ) {
          if (
            (curLoopListNum++,
            (!isTmpLoopList && !item.includes("]#")) ||
              (isCurTmp && !item.includes("]tmp#")))
          )
            return (
              (item = restoreChar(item)),
              `ERROR: 第${curLoopListNum}个${
                isCurTmp ? "模版" : ""
              }循环列表 ${item} 的格式书写错误, 缺少结束标志 ${
                isCurTmp ? "]tmp#" : "]#"
              } `
            );
          let curLoopList;
          (listType = isTmpLoopList ? "tmp" : curLevel >= 10 ? "all" : "order"),
            (item = isTmpLoopList
              ? item
                  .replace("#tmp0[", "")
                  .replace("#tmp[", "")
                  .replace("]tmp#", "")
              : item
                  .replace("#[", "")
                  .replace("#1[", "")
                  .replace("#2[", "")
                  .replace("#3[", "")
                  .replace("#0[", "")
                  .replace("#7[", "")
                  .replace("#8[", "")
                  .replace("#9[", "")
                  .replace("]#", "")),
            (curLoopList = item.includes("__tmp__")
              ? item.split("__tmp__")
              : item.includes(";")
              ? item.split(";")
              : item.split(","));
          let newLoopList = [];
          if (
            (id++,
            id >= 1e3 && (id = 100),
            "all" === listType || 110 === curLevel)
          )
            newLoopList = curLoopList;
          else if (!isTmpLoopList || isCurTmp) {
            const len = curLoopList.length;
            for (let i = 0; i < len; i++) {
              const curTags = curLoopList[i];
              if (
                curTags.includes("--") ||
                curTags.includes("=>") ||
                curTags.includes("=tmp>")
              ) {
                let infoArr;
                (infoArr = curTags.split("=tmp>")),
                  1 === infoArr.length &&
                    ((infoArr = curTags.split("=>")),
                    1 === infoArr.length && (infoArr = curTags.split("--")));
                const tags = infoArr[0];
                let num = +infoArr[1];
                num || 0 === num || (num = 1);
                for (let j = 0; j < num; j++) newLoopList.push(tags);
              } else newLoopList.push(curTags);
            }
          }
          loopList.push({
            level: curLevel,
            id,
            type: listType,
            data: newLoopList,
          }),
            (list[index] = "$list" + listType + curLevel + id + "$");
        }
      }
      return { newTxt: list.join(""), loopList, isTmpLoopList };
    })(txt);
    if ("string" == typeof info) return alert(info), console.log(info), -1;
    !(function incrTmpNum() {
      cfg.num++;
    })();
    const result = (function loopListToItems({
      num,
      loopList,
      txt,
      isTmpLoopList = !1,
    } = {}) {
      if (0 === loopList.length) return { newTxt: txt, desc: "" };
      num = num || cfg.num;
      const loopItemList = [];
      let desc = "";
      if (isTmpLoopList) {
        const tmpList = loopList.filter((item) => 100 === item.level),
          tmpAllList = loopList.filter((item) => 110 === item.level);
        getLevelItems({ loopList: tmpList, type: "tmp", level: 100 }),
          getLevelItems({ loopList: tmpAllList, type: "tmp", level: 110 });
      } else {
        const list1 = loopList.filter((item) => 1 === item.level),
          list2 = loopList.filter((item) => 2 === item.level),
          list3 = loopList.filter((item) => 3 === item.level),
          allList1 = loopList.filter((item) => 11 === item.level),
          allList2 = loopList.filter((item) => 12 === item.level),
          allList3 = loopList.filter((item) => 13 === item.level),
          allList = loopList.filter((item) => 10 === item.level);
        let max1 = getMaxLen(list1),
          max2 = getMaxLen(list2),
          max3 = getMaxLen(list3);
        const allMax1 = getMaxLen(allList1),
          allMax2 = getMaxLen(allList2),
          allMax3 = getMaxLen(allList3);
        (max1 = allMax1 > max1 ? allMax1 : max1),
          (max2 = allMax2 > max2 ? allMax2 : max2),
          (max3 = allMax3 > max3 ? allMax3 : max3),
          num--;
        let num2 = 0,
          num3 = 0;
        (num2 = Math.floor(num / max1)),
          (num3 = max2 ? Math.floor(num2 / max2) : num2),
          getLevelItems({
            loopList: list1,
            type: "order",
            level: 1,
            offset: num,
          }),
          getLevelItems({
            loopList: allList1,
            type: "all",
            level: 1,
            offset: num,
          }),
          max2 &&
            (getLevelItems({
              loopList: list2,
              type: "order",
              level: 2,
              offset: num2,
            }),
            getLevelItems({
              loopList: allList2,
              type: "all",
              level: 2,
              offset: num2,
            })),
          max3 &&
            (getLevelItems({
              loopList: list3,
              type: "order",
              level: 3,
              offset: num3,
            }),
            getLevelItems({
              loopList: allList3,
              type: "all",
              level: 3,
              offset: num3,
            })),
          getLevelItems({ loopList: allList, type: "all", level: 0 });
      }
      return (
        loopItemList.forEach((itemTag) => {
          itemTag.flag && (txt = txt.replace(itemTag.flag, itemTag.tag));
        }),
        { newTxt: txt, desc: restoreChar(desc) }
      );
      function getLevelItems({
        loopList,
        type = "order",
        level = 1,
        offset = 0,
      } = {}) {
        if (0 === loopList.length) return;
        let str = "";
        loopList.length > 0 &&
          (str =
            "all" === type
              ? 0 === level
                ? "随机循环列表: "
                : level + "级随机循环列表: "
              : "tmp" === type
              ? 110 === level
                ? "模版随机循环列表: "
                : "模版循环列表: "
              : level + "级循环列表: "),
          loopList.forEach((item, i) => {
            let tag, index;
            if (isTmpLoopList) {
              !cfg.tmpList["" + level + i] &&
                (cfg.tmpList["" + level + i] = { num: 0 });
              const curCfg = cfg.tmpList["" + level + i];
              curCfg.num++, (offset = curCfg.num - 1);
            }
            if ("all" === item.type || 110 === item.level) {
              const result = getListAndWeight(item.data),
                curIndex = getRandomWeight(result.weightArr);
              tag = result.tagList[curIndex];
            } else
              (index = offset % item.data.length), (tag = item.data[index]);
            if (isTmpLoopList) {
              const curCfg = cfg.tmpList["" + level + i];
              tag !== curCfg.tmp && (cfg.num = 1), (curCfg.tmp = tag);
            }
            loopItemList.push({
              level: item.level,
              type: item.type,
              flag:
                "all" === item.level
                  ? ""
                  : "$list" + item.type + item.level + item.id + "$",
              tag,
            }),
              (str += "'" + tag + "'"),
              i + 1 < loopList.length && (str += ", ");
          }),
          (desc = str + "\n" + desc);
      }
    })({
      loopList: info.loopList,
      txt: info.newTxt,
      isTmpLoopList: info.isTmpLoopList,
    });
    if (info.isTmpLoopList) {
      !(function decrTmpNum() {
        cfg.num--;
      })();
      const newResult = loopList(result.newTxt);
      (result.newTxt = newResult.newTxt), (result.desc += newResult.desc);
    }
    return result;
  }
  function fixValue(tools_dom, createSpeed, interval, imgNum) {
    return (
      (!createSpeed || createSpeed < 1 || createSpeed > 400) &&
        (createSpeed = +tools_dom.autoImg.eleList.createSpeed.placeholder),
      (!interval || interval < 0 || interval > 6e3) &&
        (interval = +tools_dom.autoImg.eleList.interval.placeholder),
      (!imgNum || imgNum < 1 || imgNum > 1e4) &&
        (imgNum = +tools_dom.autoImg.eleList.imgNum.placeholder),
      0 === interval && (interval = 0.1),
      { createSpeed, interval, imgNum }
    );
  }
  function autoImgStart({ dom, tools_dom }) {
    let dataOrigin;
    resetCfg();
    const autoImg = tools_dom.autoImg;
    for (let i = 0; i < autoImg.eleList.radios.length; i++) {
      const item = autoImg.eleList.radios[i];
      if (item.checked) {
        dataOrigin = item;
        break;
      }
    }
    let oldTags = [dom.positiveEle.value, dom.negativeEle.value],
      createSpeed = parseInt(autoImg.eleList.createSpeed.value),
      interval = +autoImg.eleList.interval.value,
      imgNum = parseInt(autoImg.eleList.imgNum.value);
    const fixedValue = fixValue(tools_dom, createSpeed, interval, imgNum);
    (createSpeed = fixedValue.createSpeed),
      (interval = fixedValue.interval),
      (imgNum = fixedValue.imgNum);
    let oneSize,
      startTimeStamp = new Date().valueOf(),
      totalTime = 0,
      curInterval = 0,
      curImgNum = 0,
      curCreateSpeed = 0,
      isStart = !("block" !== dom.skipBtn.style.display),
      oldStart = isStart,
      isGetTags = !0,
      printNum = 1,
      resultTags = "",
      curTimeS = 0,
      curStartTTime = 0,
      tmpStartBtn = dom.startBtn,
      tmpSkipBtn = dom.skipBtn;
    tools_dom.cfg.timerId = setInterval(() => {
      const curTimeStamp = new Date().valueOf();
      if ((curTimeStamp - startTimeStamp) / 1e3 - totalTime >= 1) {
        function end(txt) {
          (autoImg.cfg.isCreating = !1),
            (autoImg.startBtn.innerHTML = "开始生成"),
            (autoImg.eleList.runStatus.box.style.display = "none"),
            autoImg.startBtn.classList.remove("started"),
            txt && console.log(txt),
            txt && alert(txt),
            clearInterval(tools_dom.cfg.timerId);
        }
        if (
          ((totalTime = parseInt((curTimeStamp - startTimeStamp) / 1e3)),
          (curTimeS = parseInt(totalTime - curStartTTime)),
          (isStart = !("block" !== tmpSkipBtn.style.display)),
          curInterval >= interval || totalTime <= 1)
        ) {
          if (
            ((interval = +autoImg.eleList.interval.value),
            (interval = fixValue(tools_dom, 1, interval, 400).interval),
            0 === curCreateSpeed &&
              "radio-template" === dataOrigin.className &&
              isGetTags)
          ) {
            let tmpTxt = autoImg.info.textEle.value;
            (tmpTxt = formatStr(tmpTxt)),
              (tmpTxt = clearNotes(tmpTxt)),
              (tmpTxt = changeChar(tmpTxt));
            let loopListResult = loopList(tmpTxt);
            if (-1 === typeof loopListResult) return void end();
            if (
              ((tmpTxt = loopListResult.newTxt),
              (resultTags = getTemplateResult(dom, tmpTxt, !0, oldTags)),
              (resultTags.tmpDom = resultTags.tmpDom || {}),
              (tools_dom.tmpDom = resultTags.tmpDom),
              resultTags.tmpDom.startBtn &&
                (tmpStartBtn = resultTags.tmpDom.startBtn),
              resultTags.tmpDom.skipBtn &&
                (tmpSkipBtn = resultTags.tmpDom.skipBtn),
              resultTags.runCfg &&
                (resultTags.runCfg.tmpF &&
                  ((createSpeed = resultTags.runCfg.tmpF),
                  (autoImg.eleList.createSpeed.value = createSpeed)),
                (resultTags.runCfg.tmpTime ||
                  0 === resultTags.runCfg.tmpTime) &&
                  ((interval = resultTags.runCfg.tmpTime || 0.1),
                  (autoImg.eleList.interval.value = resultTags.runCfg.tmpTime)),
                resultTags.runCfg.tmpNum &&
                  ((imgNum = resultTags.runCfg.tmpNum),
                  (autoImg.eleList.imgNum.value = imgNum))),
              loopListResult.desc &&
                (resultTags.configs +=
                  "当前所有循环列表的选中项: \n" + loopListResult.desc),
              console.log("解析结果:\n" + getTmpStr(resultTags)),
              addItem({
                value: autoImg.info.textEle.value,
                info: autoImg.info,
              }),
              (isGetTags = !1),
              "ERROR" === resultTags.msg)
            )
              return void end();
          }
          oldStart ||
            isStart ||
            (emitEvent(tmpStartBtn, "click"),
            saveControls(dom),
            (curTimeS = 0)),
            (isStart = !("block" !== tmpSkipBtn.style.display)),
            !oldStart &&
              isStart &&
              ((curInterval = 0),
              (curStartTTime = totalTime),
              (curCreateSpeed = (curCreateSpeed + 1) % createSpeed),
              (isGetTags = !0));
        }
        if (
          (oldStart &&
            !isStart &&
            ((oneSize = +dom.countEle.value * +dom.sizeEle.value),
            (curImgNum += oneSize),
            (tmpStartBtn = dom.startBtn),
            (tmpSkipBtn = dom.skipBtn)),
          isStart || curInterval++,
          0 === printNum && curImgNum < imgNum && console.clear(),
          totalTime % 5 == 0 && curImgNum < imgNum)
        ) {
          printNum = (printNum + 1) % 250;
          const speed = curImgNum && parseInt(totalTime / curImgNum);
          isStart || (curTimeS = 0);
          const formatToTime = timeFormat(totalTime),
            formatCurTimeS = timeFormat(curTimeS),
            formatInterval = curInterval ? timeFormat(curInterval) : "0秒",
            formatSpeed = speed ? timeFormat(speed) : "0秒";
          let resultStr = `总时间: ${formatToTime}    当前用时: ${formatCurTimeS}    当前间隔时间: ${formatInterval}\n生成图片数: ${curImgNum}    生成速度: ${formatSpeed}/张`;
          console.log(resultStr),
            "radio-template" === dataOrigin.className &&
              (resultStr += "\n解析结果:\n" + getTmpStr(resultTags)),
            (autoImg.eleList.runStatus.content.innerText = resultStr);
        }
        if (curImgNum >= imgNum && oldStart && !isStart)
          return void end(
            "生成完毕, 共生成" +
              curImgNum +
              "张图片\n平均速度: " +
              timeFormat(parseInt(totalTime / curImgNum)) +
              "/张\n用时: " +
              timeFormat(totalTime)
          );
        if (curTimeS > 3600)
          return void end("当前绘图超时, 请尝试在命令行窗口按下回车键");
        if (totalTime >= 3600 * autoImg.cfg.maxTime)
          return void end(
            `已运行${maxTime}小时, 共生成${curImgNum}张图片\n平均速度: ${timeFormat(
              parseInt(totalTime / curImgNum)
            )}/张`
          );
      }
      oldStart = isStart;
    }, 200);
  }
  function tools(dom, curDom) {
    let tagDict, autoImg, toTags;
    curDom.tools_list = [
      { objName: "autoImg", name: "连续生成图片" },
      { objName: "toTags", name: "解析模版" },
    ];
    let suki_autoImg = (curDom.suki_autoImg = {});
    suki_autoImg.cfg = suki_autoImg.eleList = suki_autoImg.info = {};
    const toolsControls = { autoImg: {}, toTags: {} };
    function clickTools(e) {
      "addText" === e.target.className &&
        (!curDom.listEle.style.transition &&
          (curDom.listEle.style.transition = "all 0.3s 0.3S"),
        curDom.tools.classList.contains("opened") &&
          curDom.tools_list.forEach((item) => {
            item.title !== e.target && item.title.classList.remove("open");
          }),
        curDom.tools.classList.toggle("opened"),
        curDom.tools.classList.contains("opened") ||
          (hiddenBtnList(autoImg.info),
          hiddenBtnList(toTags.info),
          hiddenBtnList(suki_autoImg.info)));
    }
    function clickLi(e) {
      e.target.classList.contains("tools-li") &&
        (curDom.tools_list.forEach((item) => {
          item.title !== e.target && item.title.classList.remove("open");
        }),
        e.target.classList.toggle("open"),
        hiddenBtnList(autoImg.info),
        hiddenBtnList(toTags.info),
        hiddenBtnList(suki_autoImg.info));
    }
    function startAutoImg(e) {
      dom && saveControls(dom);
      const item = e.target;
      if (autoImg.cfg.isCreating)
        return (
          (autoImg.cfg.isCreating = !1),
          (item.innerHTML = "开始生成"),
          (autoImg.eleList.runStatus.box.style.display = "none"),
          item.classList.remove("started"),
          void clearInterval(curDom.cfg.timerId)
        );
      (autoImg.cfg.isCreating = !0),
        (item.innerHTML = "结束生成"),
        (autoImg.eleList.runStatus.box.style.display = "block"),
        (autoImg.eleList.runStatus.content.innerText =
          "总时间: 0秒    当前用时: 0秒    当前间隔时间: 0秒\n生成图片数: 0    生成速度: 0秒/张\n解析结果:"),
        item.classList.add("started"),
        autoImg.eleList.radios[1].checked &&
          addItem({ value: autoImg.info.textEle.value, info: autoImg.info }),
        (function saveAutoImgControls() {
          const control = toolsControls.autoImg;
          for (let i = 0; i < autoImg.eleList.radios.length; i++)
            if (autoImg.eleList.radios[i].checked) {
              control.dataOriginIndex = i;
              break;
            }
          (control.createSpeed = parseInt(autoImg.eleList.createSpeed.value)),
            (control.interval = +autoImg.eleList.interval.value),
            (control.imgNum = parseInt(autoImg.eleList.imgNum.value)),
            localStorage.setItem(
              "toolsControls",
              JSON.stringify(toolsControls)
            );
        })(),
        autoImgStart({ dom, tools_dom: curDom });
    }
    let toTags_tmpNum = 0;
    function startToTags() {
      const isUseResult = toTags.checkbox.checked;
      let tmpTxt = toTags.info.textEle.value;
      (tmpTxt = formatStr(tmpTxt)),
        (tmpTxt = clearNotes(tmpTxt)),
        (tmpTxt = changeChar(tmpTxt));
      let loopListResult = loopList(tmpTxt);
      if (-1 === typeof loopListResult) return;
      tmpTxt = loopListResult.newTxt;
      const result = getTemplateResult(dom, tmpTxt, isUseResult);
      loopListResult.desc &&
        (result.configs +=
          "当前所有循环列表的选中项: \n" + loopListResult.desc),
        (toTags.resultTags.value = getTmpStr(result)),
        toTags_tmpNum++,
        toTags.checkbox.addEventListener("change", () => {
          (toTags_tmpNum = 0), resetCfg();
        }),
        (function saveToTagsControls() {
          (toolsControls.toTags.checkbox = toTags.checkbox.checked),
            localStorage.setItem(
              "toolsControls",
              JSON.stringify(toolsControls)
            );
        })(),
        addItem({ value: toTags.info.textEle.value, info: toTags.info });
    }
    function createEles() {
      !(function createTools() {
        dom &&
          dom.settingsBar &&
          (dom.settingsBar.children[0].style.marginLeft = "20px"),
          (curDom.tools = createEle({ className: "tools" })),
          (curDom.addText = createEle({
            className: "addText",
            title: curDom.versions,
            box: curDom.tools,
          })),
          (curDom.tools.title = curDom.versions),
          (curDom.addText.innerHTML = "+"),
          (curDom.listEle = createEle({
            className: "toolsList",
            title: curDom.versions,
            box: curDom.tools,
          })),
          curDom.tools_list.forEach((item, i) => {
            const li = createEle({
              className: `${item.objName}-li tools-li`,
              box: curDom.listEle,
              title: "点击固定 或 取消固定",
            });
            (li.innerHTML = item.name),
              (curDom[item.objName] = {}),
              (curDom[item.objName].eleList = item),
              (curDom[item.objName].eleList.title = li);
            const liBox = createEle({
              className: `${item.objName}-box box`,
              box: curDom[item.objName].eleList.title,
            });
            (curDom[item.objName].eleList.box = liBox),
              (curDom[item.objName].cfg = {}),
              (curDom[item.objName].info = {});
          }),
          (tagDict = curDom.tagDict),
          (autoImg = curDom.autoImg),
          (toTags = curDom.toTags),
          (autoImg.cfg.maxTime = 120),
          (autoImg.cfg.tmpIndex = 0),
          (autoImg.cfg.isCreating = !1),
          autoImg.cfg.timerId,
          (toTags.cfg.tmpIndex = 0),
          setTimeout(() => {
            curDom.tools.style.opacity = "1";
          }, 200);
      })(),
        (function createTagDict() {
          tagDict && (tagDict.eleList.box.innerHTML = "敬请期待...");
        })(),
        (function createAutoImg() {
          (autoImg.eleList.box.innerHTML =
            '<div class="autoImg info" title="">\n  <div class="title">连续生成图片</div>\n  <div class="details" title="鼠标移动到蓝色字体上可查看名词介绍">可以自定义连续生成图片的相关设置, 可使用\n    <strong class="t-template" title="">tag模板<div class="tips">\n    <div class="bold mb8 tt1">Tag模板的说明文档 v3.8.5</div>\n    <div class="tt2 black">模板作用</div>\n    <div>&nbsp;&nbsp;&nbsp;模板主要用于解析成正面tags和负面tags, 但也可用于解析并应用基本设置, 如: 步数, 宽高等等, 一个模板可以有多种不同的解析结果</div>\n    <div class="tt2 mt8 black">模板格式:</div>\n    正面Tag模块<br>\n    !tag=负面Tag模块<br>\n    +配置模块1<br>\n    ...<br>\n    +配置模块n<br>\n    +概率1,...,概率n<br>\n    <div class="mt5">&nbsp;&nbsp;&nbsp;模板共有三种模块: 正面Tag模块、负面Tag模块、配置模块, 三种模块都是非必须的, 可单独存在, 但需注意书写顺序, 正面Tag模块书写在前, 配置模块最后. 其中负面Tag模块前需添加 !tag=, 配置模块可书写多个, 每个配置模块前需添加 + 字符, 当存在多个配置模块时, 需在最后书写每个配置模块的概率比值, 概率比值前需添加 + 字符. 模板中支持中英文字符</div>\n    <div class="tt2 mt8 black">模板语法:</div>\n    <div>&nbsp;&nbsp;&nbsp;三种模块中都使用 | 字符将模块分隔成多个子模块, 正面Tag模块和负面Tag模块的一个子模块将解析成一个tag或tags, 配置模块的一个子模块将解析成一个配置项[并应用] 或 执行某些操作</div>\n    <div>&nbsp;&nbsp;&nbsp;若Tag模块中以 & 开头, 则最终解析的tags将添加在页面原tags的末尾 [在连续生成图片时不会累加]</div>\n\n    <div class="tt2 mt5 ml-1 black">子模块格式:</div>\n    <div><span class="bold">格式1: </span>tag1,...,tagn</div>\n    <div class="bold">书写规范:</div>\n    <div>1.格式1仅适用于Tag模块</div>\n    <div>2.每个tag间使用 , 分隔, 若只有一个tag则直接书写即可</div>\n    <div class="mt5"><span class="bold">格式2: </span>名称/值1,...,值n/概率1,...,概率n</div>\n    <div class="bold">书写规范:</div>\n    <div>1.子模块分为三栏, 每栏之间使用 / 分隔</div>\n    <div>2.第一栏书写tag或配置项名称, 若为Tag模块, 则第一栏末尾添加 &gt; 或 &lt; 表示接下来为tag增添附加信息(前缀/后缀), 末尾不书写符号则默认表示添加前缀</div>\n    <div>3.第二栏书写tag的附加信息或配置项的值, 每一项用 , 或 ; 分隔, 使用$0表示第一栏的tag [当其中一项是多个tag时则每一项需使用 ; 字符分隔]</div>\n    <div>4.第三栏书写\'每个附加信息或配置项的值\'的概率比值, 每一项用 , 分隔, 项数与第二栏项数对应, 在Tag模块中, 若要用当前项的附加信息完全覆盖tag, 则在对应的概率值后添加 &gt;</div>\n    <div>5.第三栏也可书写all或-, 表示每一项的概率都相等, 也可书写allN或-N, N为每一项的概率值</div>\n    <div>6.第二栏的每一项后面可以添加--N, N为该项的概率值, 使用--方式添加的概率值将会覆盖第三栏中对应的概率值, 也可都用--书写概率值而第三栏留空</div>\n    <div>示例:</div>\n    <div>1. hair/red,blue,/1,1,1> 说明: 解析为 red hair或blue hair或 的概率值都为1/3 [第三种解析结果为空]</div>\n    <div>2. /red--1,blue--2/ 说明: 解析为red的概率为1/3, blue为2/3, 第一栏留空的这种写法的含义为: 为空白添加前缀, 即直接从第二栏得到解析结果, 这是常用写法</div>\n    <div>3. sky/$0;$0,cloud/all 说明: 解析为 sky或sky,cloud 的概率相等</div>\n\n    <div class="tt2 mt8 ml-1 black">注释格式:</div>\n    <div>// 一段注释文本 |</div>\n\n    <div class="tt2 mt8 ml-1 black">配置模块</div>\n    <div>&nbsp;&nbsp;&nbsp;配置模块中支持的配置项有[支持中英文]: <span class="bold">1) 普通配置项: </span>steps[步数], method[方法], width[宽度], height[高度], count[批次], size[数量], cfg[系数], seed[种子]; <span class="bold">2) 特殊配置项: </span>tags[模块tags], tags-[模块负面tags], if[模块if], if-[模块if负面], ifTo[单项if], ifTo-[单项if负面], ifset[配置if], ifmod[模型if], iftag[标签if], iftag-[标签if负面], iftagTo[标签单项if], iftagTo-[标签单项if负面], else[否则], change[修改tag], change-[修改负面tag], changeTo[修改一项], changeTo-[修改负面一项]</div>\n    <div>&nbsp;&nbsp;&nbsp;每个配置项都需要书写在一个子模块中, 普通配置项按照子模板的格式2 [名称/值1,...,值n/概率1,...概率n] 书写即可, 特殊配置项的基本格式与子模板的格式2相同, 细节以及效果上略有不同. 普通配置项和特殊配置项都可书写多个, 但普通配置项后面的解析结果将会覆盖前面</div>\n    <div>&nbsp;&nbsp;&nbsp;特殊配置项中, 所有含 To 的配置项[To系列的配置项]和对应的不含 To 的配置项仅有一点不同. 不含 To 的配置项的作用是 当tags满足if条件则执行某操作; 而含 To 的配置项的作用是 当tags中存在满足if条件的一个tag时, 则执行某操作 或 对满足条件的tag执行某操作. 以下是特殊配置项的详细说明</div>\n\n    <div class="tt2 mt5 ml-2">tags与tags-</div>\n    <div class="ml-1">&nbsp;&nbsp;&nbsp;tags/tags-的作用是在当前已解析的正面/负面tags后添加该配置子模块的解析结果</div>\n    <div class="ml-1 bold">书写规范:</div>\n    <div class="ml-1">1. 第一栏书写tags或tags-</div>\n    <div class="ml-1">2. 第二栏将按照第三栏的概率比值, 以正常方式解析成tag/tags</div>\n    <div class="ml-1">3. 若第三栏为空, 则第二栏的全部将作为解析结果</div>\n    <div class="ml-1 bold">示例:</div>\n    <div class="ml-1">1. tags/profile,(full body)/ 说明: 在正面tags末尾添加\'profile,(full body)\'的tags</div>\n    <div class="ml-1">2. tags/full body,(full body)/1,1 说明: 在正面tags末尾添加full body或(full body)的tag, 两者概率相同</div>\n\n    <div class="tt2 mt5 ml-2 black">if家族</div>\n    <div class="ml-1">&nbsp;&nbsp;&nbsp;if家族中除了else外的每个配置项都支持if条件, if条件支持 && || ! 逻辑运算符, 但&&和||的优先级相同, 运算按从左向右的顺序, if条件中的每部分只需书写tag即可, 含义为是否存在该tag, 如: tag1&&!tag2 [是否存在tag1且不存在tag2]</div>\n    <div class="tt2 mt5 ml-2">if/if-与ifTo/ifTo-</div>\n    <div class="ml-1">&nbsp;&nbsp;&nbsp;该组配置项的作用是 若当前已解析的正面/负面tags满足if条件, 则根据第二栏的解析值 继续/跳过/终止 后面模版的解析</div>\n    <div class="ml-1 bold">书写规范:</div>\n    <div class="ml-1">1. 第一栏书写if>xxx或if->xxx或ifTo>xxx或ifTo->xxx, 其中xxx为正面/负面tags需要满足的if条件[正面/负面tags是否满足if条件]; 若为ifTo/ifTo- [To系列], 则xxx为正面/负面tags中的一项需要满足的if条件[是否存在满足if条件的一项tag]</div>\n    <div class="ml-1">2. 第二栏中只能书写true或false或skipN或skipToN[其中N为跳过的子模块的数量], 留空则默认表示true</div>\n    <div class="ml-1">3. 第三栏写第二栏的概率比值, 并按概率比值解析第二栏; 若第二栏只有一项, 则解析结果就是第二项内容, 此时第三栏留空</div>\n    <div class="ml-1">4. 解析结果中: true表示满足if条件则允许继续解析后续配置子模块, 不满足则终止继续解析后续子模块; false表示无论是否满足if条件都将终止继续解析后续子模块; skipN表示满足if条件则跳过N个后续子模块; skipToN表示无论是否满足if条件都将跳过N个后续子模块 [强制跳过]</div>\n    <div class="ml-1 bold">示例:</div>\n    <div class="ml-1">1. if>sky/skip2/ 说明: 若正面tags中不包含sky, 则跳过后2项子模块的解析 [满足sky才可解析后两项子模块]</div>\n    <div class="ml-1">2. ifTo>blue&&hair/true,false/1,1 说明: 若当前已解析的正面tags中存在同时含blue和hair[蓝发]的tag, 则有50%概率终止继续解析后续子模块</div>\n\n    <div class="tt2 mt5 ml-2">ifset</div>\n    <div class="ml-1">&nbsp;&nbsp;&nbsp;该配置项的作用是 若当前已解析的配置项[普通配置项和特殊配置项]中满足if条件, 则在正面/负面tags后添加iftag的解析结果</div>\n    <div class="ml-1 bold">书写规范:</div>\n    <div class="ml-1">1. ifset的书写规范和if基本相同, 唯一的不同是ifset中if条件支持比较运算符 &gt; &lt; &gt;= &lt;= == !=, if条件中的每一项书写配置项的名称或一个比较运算式[左边写名称,右边写值], 在判断if条件是否成立时优先从最后解析的配置项开始匹配</div>\n    <div class="ml-1">2. 第一栏书写ifset>xxx, 其中xxx为配置项需要满足的if条件, 其余规则同if书写规范的2 3 4条</div>\n    <div class="ml-1 bold">示例:</div>\n    <div class="ml-1">1. ifset>width>=1024&&height>=1024&&cfg<7/skip1/ 说明: 若当前已解析的配置项中的宽高都大于等于1024 且 cfg小于7, 则继续解析后一项子模块[否则跳过后一项]</div>\n\n    <div class="tt2 mt5 ml-2">ifmod</div>\n    <div class="ml-1">&nbsp;&nbsp;&nbsp;该配置项的作用是 若当前模型满足if条件, 则根据第二栏的解析值 继续/跳过/终止 后面模版的解析</div>\n    <div class="ml-1 bold">书写规范:</div>\n    <div class="ml-1">1. ifmod的书写规范和if基本相同, 唯一的不同是ifmod中if条件是对于当前模型的名称成立的</div>\n    <div class="ml-1">2. 第一栏书写ifmod>xxx, 其中xxx为 模型名称/模型hash 需要满足的if条件, 其余规则同if书写规范的2 3 4条</div>\n    <div class="ml-1 bold">示例:</div>\n    <div class="ml-1">1. ifmod>Anything// 说明: 若当前模型为Anything系列的模型, 则继续解析, 否则终止后续所有子模块的解析</div>\n    <div class="ml-1">2. ifmod>f303d10812/skip1/ 说明: 若当前模型hash值不为f303d10812, 则跳过后一项子模块的解析</div>\n\n    <div class="tt2 mt5 ml-2">iftag/iftag-与iftagTo/iftagTo-</div>\n    <div class="ml-1">&nbsp;&nbsp;&nbsp;该组配置项的作用是 若当前已解析的正面tags满足if条件, 则在正面/负面tags后添加iftag的解析结果</div>\n    <div class="ml-1 bold">书写规范:</div>\n    <div class="ml-1">1. 第一栏书写iftag>xxx或iftag->xxx或iftagTo>xxx或iftagTo->xxx, 其中xxx为正面tags需要满足的if条件, To系列则为tags中一项tag需要满足的条件</div>\n    <div class="ml-1">2. 第二栏将按照第三栏的概率比值, 以正常方式解析成tag/tags</div>\n    <div class="ml-1">3. 若第三栏为空, 则第二栏的全部将作为解析结果</div>\n    <div class="ml-1 bold">示例:</div>\n    <div class="ml-1">1. iftagTo>!full body/long shoot,full body/ 说明: 若当前已解析的正面tags不存在full body, 则添加\'long shoot,full body\'至正面tags的末尾</div>\n\n    <div class="tt2 mt5 ml-2">else</div>\n    <div class="ml-1">&nbsp;&nbsp;&nbsp;该配置项的作用是与上方最近一个未被else匹配的if系的语句匹配, 当匹配的if的if条件不满足时, else的隐藏if条件将满足, 此时根据第二栏的解析值 继续/跳过/终止 后面模版的解析</div>\n    <div class="ml-1 bold">书写规范:</div>\n    <div class="ml-1">1. else的书写规范和if基本相同, 唯一的不同是else不需要书写if条件, else的if条件与匹配的if语句的if条件相反</div>\n    <div class="ml-1">2. 第一栏书写else, 其余规则同if书写规范的2 3 4条</div>\n    <div class="ml-1 bold">示例:</div>\n    <div class="ml-1">1. +if>sky/skip1/|tags/cloud/|else/skip1/|tags/night/| 说明: 若前面的if语句的if条件成立则正面tags中添加cloud, 若不成立, 则正面tags中添加night [这是一个含4个子模块的配置模块]</div>\n\n    <div class="tt2 mt5 ml-2 black">change家族</div>\n    <div class="ml-1">&nbsp;&nbsp;&nbsp;change家族中change/change-不支持if条件, 只可书写一个tag作为条件, changeTo/changeTo-支持if条件</div>\n    <div class="tt2 mt5 ml-2">change/change-与changeTo/changeTo-</div>\n    <div class="ml-1">&nbsp;&nbsp;&nbsp;change/change-的作用是修改当前已解析的正面/负面tags中匹配的部分为解析结果, To系列的作用是修改当前已解析的正面/负面tags中满足if条件的一项tag为解析结果</div>\n    <div class="ml-1 bold">书写规范:</div>\n    <div class="ml-1">1. 第一栏书写change>xxx或change->xxx或changeTo>xxx或changeTo->xxx, 其中xxx为需要修改的tag/tags 或 if条件</div>\n    <div class="ml-1">2. 第二栏将按照第三栏的概率比值, 以正常方式解析成tag/tags</div>\n    <div class="ml-1">3. 若第三栏为空, 则第二栏的全部将作为解析结果</div>\n    <div class="ml-1">4. 1) 解析结果为 - 字符, 则删除需要修改的部分. 2) 解析结果不为 - 字符, 则将需要修改的部分修改为解析结果</div>\n    <div class="ml-1">5. 若为changeTo/changeTo-, 则可在第二栏中使用$_0表示原tag</div>\n    <div class="ml-1 bold">示例:</div>\n    <div class="ml-1">1. change>blue hair/red hair,-/all 说明: 将当前已解析的正面tags中的blue hair修改为red hair或删除, 各50%概率</div>\n    <div class="ml-1">2. changeTo>long hair/red $_0/ 说明: 将当前已解析的正面tags中包含long hair的一项tag前添加red</div>\n    \n    <div class="tt2 mt5 ml-2 black">注:</div>\n    <div class="ml-1">&nbsp;&nbsp;&nbsp;在Tag模块中可使用除tags/tags-/ifset外的其他特殊子模块 [特殊配置项], 但需在子模块的最前面添加 # 字符</div>\n    <div class="ml-1 bold">示例:</div>\n    <div class="ml-1">1. #iftag>red eyes||red_eyes/white hair/ 说明: 若当前已解析的正面tags中存在red eyes或red_eyes, 则在正面tags中添加white hair</div>\n\n    <div class="tt2 mt8 ml-2 black">公共配置模块</div>\n    <div class="ml-1">&nbsp;&nbsp;&nbsp;公共配置模块包括 初始公共配置模块 和 末尾公共配置模块, 初始公共配置模块一定会被解析, 且优先被解析, 末尾公共配置模块除被if子模块强行终止外一定会被解析, 且最后被解析, 只需在最后配置模块的概率比值中, 将需要变为初始公共配置模块的配置模块的概率值修改为common或-0或公共, 即可将对应的普通配置模块变为初始公共配置模块, 末尾公共配置模块则需修改为common-或-1或公共-</div>\n\n    <div class="tt2 mt8 ml-1 black">转义字符</div>\n    <div>&nbsp;&nbsp;&nbsp;当需要使用的字符与模板结构字符 | + ! &lt; &gt; , ; / # - & $ = 有冲突时, 需要使用转义字符 # 进行转义, 如: 希望最终解析的tags中包含 DPM++, 则需在模板中书写为 DPM#+#+</div>\n\n    <div class="tt2 mt8 ml-1 black">循环列表</div>\n    <div>&nbsp;&nbsp;&nbsp;循环列表的作用是能够 依次/随机 获取某些值, 每次解析循环列表时将 依次/随机 获取到列表中的一项. 循环列表会优先被解析, 接着才会解析各模块和子模块</div>\n    <div>&nbsp;&nbsp;&nbsp;循环列表包括: 顺序循环列表, 随机循环列表, 模版循环列表, 模版随机循环列表. 其中模版列表中可以书写其他循环列表</div>\n    <div class="bold">书写格式:</div>\n    <div><span>顺序循环列表书写格式: </span>#等级[值1,值2,...]#</div>\n    <div><span>随机循环列表书写格式: </span>#all等级[值1,值2,...]#</div>\n    <div><span>模版循环列表书写格式: </span>#tmp[值1,值2,...]tmp#</div>\n    <div><span>模版随机循环列表书写格式: </span>#tmpall[值1,值2,...]tmp#</div>\n    <div class="bold">书写规范:</div>\n    <div>1. 循环列表以 #[ 或 #1[ 或 #2[ 或 #3[ 或 #all[ 或 #all1[ 或 #all2[ 或 #all3[ 或 #tmp[ 或 #tmpall[ 开头, 以 ]# 或 ]tmp# 结尾, 开头的数字表示循环列表的等级, 无数字则默认为1级</div>\n    <div>2. 循环列表中的每一项使用分割符 , 或 ; 或 __tmp__ 分隔</div>\n    <div>3. 每一项后面可添加 --N 或 =>N 或 =tmp>, 顺序列表中表示该项将被重复解析N次, 随机列表中表示该项的权重为N. 若模版列表中存在其他循环列表, 且其他循环列表中使用了 -- 或 =>, 则模版列表的项只能使用 =tmp> 表示 解析次数/权重</div>\n    <div>4. 除模版列表外, 低级的循环列表每次被解析时将根据每项的解析次数依次向后解析, 而高级的循环列表需要等待低一级的最长循环列表(不区分顺序或随机循环列表)完整解析一轮后才能向后解析出下一个值</div>\n    <div>5. 模版列表解析到下一个不同项时, 其他顺序循环列表和子顺序循环列表都将重新从第一项开始解析</div>\n    <div>5. 循环列表可书写在模版的任意位置</div>\n    <div>示例:</div>\n    <div>1. t,#[a,b--2]# 说明: 解析结果为t,a或t,b, 概率比值为1:2</div>\n    <div>2. #2[a,b]##[1,2]# 说明: 解析结果依次为 a,1 / a,2 / b,1 / b,2 ... </div>\n    <div>3. #tmp[a;b,#[1,2]#=tmp>2]tmp# 说明: 解析结果依次为 a / b,1 / b,2 / a ... </div>\n    \n    <div class="tt2 mt8 black">模板示例(也可参考默认模板):</div>\n    <div>\n    // 示例模板 |<br>\n    // 正面tag模块 |<br>\n    masterpiece/,($0),($0:1.2)/all|<br>\n    /garden,city/2,1|<br>\n    1girl,solo|<br>\n    hair/white,blue,/2,1,1>|<br>\n    /skirt,dress/1,1|<br>\n    #if>garden/skip/|<br>\n    /cloud,flower,/all|<br>\n    // 负面tag模块 |<br>\n    !tag=lowres,bad anatomy,bad hands,text,error|<br>\n    +<br>\n    // 配置模块 x3 |<br>\n    width/1024/|<br>\n    height/640/|<br>\n    ifmod>AbyssOrangeMix/skip1/|<br>\n    cfg/7/|<br>\n    #else/skip1/|<br>\n    cfg/5,6,7,8/1,1,2,1|+<br>\n    width/640/|<br>\n    height/1024/|<br>\n    cfg/6,7,8/all|<br>\n    tags/full body/|<br>\n    iftag->skirt/two skirt/|+<br>\n    // 初始公共配置模块 |<br>\n    steps/50/|<br>\n    采样器/#[DDIM--4,DPM#+#+ 2M Karras--4]#/|<br>\n    seed/-1/|+<br>\n    1,1,-0\n    </div>\n\n    <div class="tt2 mt8 ml-1 black">注:</div>\n    <div>&nbsp;&nbsp;&nbsp;可在\'解析模板\'模式中对书写的模板进行测试</div>\n    <div>&nbsp;&nbsp;&nbsp;若想使用当前配置, 则无需书写配置模块</div>\n    </div></strong>\n    进行连续自动生成, 若使用模板, 则开始生成图片前会先解析模板得到新的tags并修改配置, 然后使用新tags和配置生成图片</div>\n  <div class="item radio-box">\n    <div class="radio-title">请选择每次生成图片的tag的数据来源:</div>\n    <div class="item-radio">\n      <input class="radio-curTag" type="radio" name="autoImgTagData" id="autoImgTagData1" checked>\n      <label class="text" for="autoImgTagData1" title="使用页面中当前的正面标签">当前tag</label>\n    </div>\n    <div class="item-radio" title="鼠标移至简介中的\'tag模板\'可查看模板语法">\n      <input class="radio-template" type="radio" name="autoImgTagData" id="autoImgTagData2">\n      <label class="text textarea-left-text" for="autoImgTagData2">tag模板</label>\n      <textarea class="template" cols="40" rows="6" placeholder="请输入tag模板" title="拖动右下角可调节宽高"></textarea>\n    </div>\n  </div>\n  <div class="item item-text" title="1~400, 每生成n轮图片后解析一次模板, 图片生成进度条100%表示生成一轮图片, 选择\'当前tag\'时不生效">\n    <div class="text">解析模板的频率 每</div>\n    <input class="createSpeed" type="text" value="1" placeholder="1">\n    <div class="text2">轮一次</div>\n  </div>\n  <div class="item item-text" title="1~6000, 每次生成结束到下次生成开始的中间间隔时间">\n    <div class="text">每次生成的间隔时间</div>\n    <input class="interval" type="text" value="5" placeholder="5">\n    <div class="text2">秒</div>\n  </div>\n  <div class="item item-text" title="1~10000, 当设定的生成图片数不是\'批次x单批数量\'的倍数时最终生成图片数将略大于设定值, 每轮生成的图片数=批次x单批数量">\n    <div class="text">生成图片总数</div>\n    <input class="imgNum" type="text" value="100" placeholder="100">\n    <div class="text">张</div>\n  </div>\n  <div class="item start-btn-box" title="即使当前有正在进行的图片生成也可\'点击开始或点击结束\', 自动生成将会\'在原任务完成后开始\'或\'立即停止\'">\n    <div class="run-status" title="运行时的相关数据"><strong class="t-run-status simple">查看状态<div class="tips" title=""></div></strong></div>\n    <div class="start-btn">开始生成</div>\n  </div>\n</div>'),
            (autoImg.eleList.radios = document.querySelectorAll(
              ".autoImg input[type='radio']"
            )),
            (autoImg.info.textEle = document.querySelector(
              ".autoImg textarea.template"
            )),
            (autoImg.eleList.createSpeed = document.querySelector(
              ".autoImg .createSpeed"
            )),
            (autoImg.eleList.interval =
              document.querySelector(".autoImg .interval")),
            (autoImg.eleList.imgNum =
              document.querySelector(".autoImg .imgNum")),
            (autoImg.startBtn = document.querySelector(".autoImg .start-btn")),
            (autoImg.eleList.runStatus = {
              box: document.querySelector(".autoImg .run-status"),
              content: document.querySelector(".autoImg .run-status .tips"),
            }),
            (autoImg.eleList.runStatus.content.innerText =
              "总时间: 0秒    当前用时: 0秒    当前间隔时间: 0秒\n生成图片数: 0    生成速度: 0秒/张\n解析结果:"),
            (autoImg.info.textEle.placeholder = tmp_tips);
        })(),
        (function createToTags() {
          (toTags.eleList.box.innerHTML =
            '\n<div class="toTags info" title="">\n  <div class="title">解析模板</div>\n  <div class="details">可以将 <b>tag模板</b> 解析成Tags, 模板的书写规范请在\'连续生成图片\'栏的介绍中查看</div>\n  <div class="site">测试tag模板的网站[随便搭的]: <a href="https://sd-webui-tmp-to-tags-1310591936.cos-website.ap-nanjing.myqcloud.com/" target="_blank">SD-Webui-Tmp-to-Tags</a></div>\n  <div class="item item-text">\n    <div class="text textarea-left-text">Tag模板</div>\n    <textarea class="template" cols="40" rows="6" placeholder="请输入Tag模板" title="拖动右下角可调节宽高"></textarea>\n  </div>\n  <div class="text radio-box">\n    <span>解析结果</span>\n    <div class="item-radio">\n      <input class="radio-curTag" type="checkbox" name="autoImgTagData" id="isUseResult" title="是否直接应用解析结果">\n      <label class="text" for="isUseResult" title="是否直接应用解析结果">使用解析结果</label>\n      <div class="item start-btn-box">\n        <div class="start-btn">开始解析</div>\n      </div>\n    </div>\n  </div>\n  <textarea class="resultTags" cols="45" rows="7" title="拖动右下角可调节宽高"></textarea>\n</div>'),
            (toTags.info.textEle = document.querySelector(
              ".toTags textarea.template"
            )),
            (toTags.resultTags = document.querySelector(
              ".toTags textarea.resultTags"
            )),
            (toTags.checkbox = document.querySelector("#isUseResult")),
            (toTags.startBtn = document.querySelector(".toTags .start-btn")),
            (toTags.info.textEle.placeholder = tmp_tips);
        })(),
        (function restoreHistory() {
          const dataTmpList =
              JSON.parse(localStorage.getItem("tmpList") || null) || [],
            toTagsTmpList =
              JSON.parse(localStorage.getItem("toTagsTmpList") || null) || [];
          if (
            ((suki_autoImg.info.dataList =
              JSON.parse(localStorage.getItem("suki_tmpList") || null) || []),
            (autoImg.info.dataList = dataTmpList),
            (toTags.info.dataList = toTagsTmpList),
            0 !== dataTmpList.length)
          ) {
            const item = dataTmpList[dataTmpList.length - 1];
            autoImg.info.textEle.value = item.value || item;
          }
          let oldToolsControls = JSON.parse(
            localStorage.getItem("toolsControls")
          );
          if (oldToolsControls) {
            document.querySelector(
              ".tools .autoImg .radio-box input:checked"
            ).checked = !1;
            const index = oldToolsControls.autoImg.dataOriginIndex || 0,
              createSpeed = parseInt(oldToolsControls.autoImg.createSpeed),
              interval = +oldToolsControls.autoImg.interval,
              imgNum = parseInt(oldToolsControls.autoImg.imgNum),
              checkbox = oldToolsControls.toTags.checkbox;
            (autoImg.eleList.radios[index].checked = !0),
              createSpeed && (autoImg.eleList.createSpeed.value = createSpeed),
              (interval || 0 === interval) &&
                (autoImg.eleList.interval.value = interval),
              imgNum && (autoImg.eleList.imgNum.value = imgNum),
              checkbox && (toTags.checkbox.checked = checkbox);
          }
        })(),
        (function createHisBtnList() {
          const listMaxLen = curDom.cfg.listMaxLen,
            isClickClose = curDom.cfg.isClickClose,
            btnShowMode = curDom.cfg.btnShowMode,
            box1 = autoImg.info.textEle.parentElement,
            box2 = toTags.info.textEle.parentElement;
          (autoImg.info.suki_info = suki_autoImg.info),
            (toTags.info.suki_info = suki_autoImg.info),
            (suki_autoImg.info.textEle = autoImg.info.textEle),
            (autoImg.info.btnEle = createSwitchBtn({
              box: box1,
              right: -28,
              lineHeight: 23,
              fontSize: 17,
              color: "#8a8a8a",
              svg: getIconHTML({ name: "lishi" }),
              className: "autoImg-btn",
              titleText: "模板历史记录",
              showMode: btnShowMode,
            })),
            (toTags.info.btnEle = createSwitchBtn({
              box: box2,
              right: -29,
              lineHeight: 23,
              fontSize: 17,
              color: "#8a8a8a",
              svg: getIconHTML({ name: "lishi" }),
              className: "toTags-btn",
              titleText: "模板历史记录",
              showMode: btnShowMode,
            })),
            (suki_autoImg.info.btnEle = createSwitchBtn({
              box: box1,
              top: 31,
              right: -28,
              lineHeight: 23,
              fontSize: 17,
              color: "#fe9850",
              svg: getIconHTML({ name: "shoucang" }),
              className: "suki_toTags-btn",
              titleText: "模板收藏",
              showMode: btnShowMode,
            }));
          const autoImgListInfo = createHistoryList({
              list_id: "SD_list_autoImg",
              box: box1,
              width: 400,
              right: -433,
              saveName: "tmpList",
              outName: "模版历史记录",
              className: "autoImg-hList",
              maxLen: listMaxLen,
              isClickClose,
              controlArr: [
                { name: "add" },
                { name: "search" },
                { name: "clear" },
                { name: "out" },
                { name: "import" },
                { name: "fold" },
                { name: "update" },
                { name: "move", warnText: "" },
                { name: "toSuki" },
                { name: "copy" },
                { name: "delete" },
                { name: "toBottom" },
              ],
            }),
            toTagsListInfo = createHistoryList({
              list_id: "SD_list_toTags",
              box: box2,
              width: 400,
              right: -434,
              saveName: "toTagsTmpList",
              outName: "解析模版历史记录",
              className: "toTags-hList",
              maxLen: listMaxLen,
              isClickClose,
              controlArr: [
                { name: "add" },
                { name: "search" },
                { name: "clear" },
                { name: "out" },
                { name: "import" },
                { name: "fold" },
                { name: "update" },
                { name: "move", warnText: "" },
                { name: "toSuki" },
                { name: "copy" },
                { name: "delete" },
                { name: "toBottom" },
              ],
            }),
            suki_autoImgListInfo = createHistoryList({
              list_id: "SD_list_autoImg_suki",
              box: box1,
              top: 31,
              width: 400,
              right: -433,
              cssText: "none",
              saveName: "suki_tmpList",
              outName: "模版收藏",
              className: "suki_autoImg-hList",
              maxLen: listMaxLen,
              isClickClose,
              initialText: "暂无模版收藏",
              isDesc: !1,
              isAddUp: !1,
              isDelete: !1,
              controlArr: [
                { name: "add" },
                { name: "search" },
                {
                  name: "clear",
                  warnText: "是否清空所有模版收藏？",
                  twoWarnText: "请再次确认是否清空收藏？清空后将无法复原！",
                },
                { name: "out" },
                { name: "import" },
                { name: "fold", isFold: !0 },
                { name: "update" },
                { name: "move", warnText: "" },
                { name: "copy" },
                { name: "delete" },
                { name: "toBottom" },
              ],
            });
          (autoImg.info.listEle = autoImgListInfo.value),
            (suki_autoImg.info.listEle = suki_autoImgListInfo.value),
            (toTags.info.listEle = toTagsListInfo.value),
            (-1 !== autoImg.info.btnEle &&
              -1 !== autoImg.info.listEle &&
              -1 !== toTags.info.btnEle &&
              -1 !== toTags.info.listEle &&
              -1 !== toTags.info.suki_btnEle &&
              -1 !== toTags.info.suki_listEle) ||
              (alert("ERROR: 模版历史记录功能加载失败"),
              console.log("ERROR: 模版历史记录功能加载失败")),
            initHisListDom(autoImg.info),
            initHisListDom(suki_autoImg.info),
            initHisListDom(toTags.info),
            bindHistoryEvents(autoImg.info),
            bindHistoryEvents(toTags.info),
            controlEvents(
              autoImgListInfo.control,
              autoImg.info,
              curDom.searchEle,
              curDom.edit
            ),
            controlEvents(
              toTagsListInfo.control,
              toTags.info,
              curDom.searchEle,
              curDom.edit
            ),
            bindHistoryEvents(suki_autoImg.info),
            controlEvents(
              suki_autoImgListInfo.control,
              suki_autoImg.info,
              curDom.searchEle,
              curDom.edit
            ),
            curDom.historyListArr.push(autoImg.info),
            curDom.historyListArr.push(suki_autoImg.info),
            curDom.historyListArr.push(toTags.info);
        })();
    }
    const useDefaTp = (function debounce(fn, duration = 200) {
      let timer = null;
      return function (...args) {
        clearTimeout(timer),
          (timer = setTimeout(() => {
            fn(...args);
          }, duration));
      };
    })(function useDefaultTemplate(e) {
      const item = e.target,
        name = item.value.replaceAll("\n", "");
      templateMap[name] && (item.value = templates[templateMap[name]]);
    }, 800);
    return (
      (function init() {
        addCss(
          '\n/* @import url("//at.alicdn.com/t/c/font_4005802_z2ncicwjghn.css"); 改用svg了 */\n\n.tools {\n  /* width:25px;\n  height:25px; */\n  font-size:20px;\n  border:1px solid #ccc;\n  border-radius:6px;\n  text-align:center;\n  color:#333;\n  background:#fff;\n  position:absolute;\n  z-index:800;\n  top:3px;\n  left:3px;\n  opacity:0;\n  font-family:math;\n}\n.tools:hover {\n  border:1px solid #b7cffe;\n}\n.tools .addText {\n  cursor:pointer;\n  width:25px;\n  height:25px;\n  line-height:23px;\n  color:#333;\n  transition:all 0.3s;\n  font-family:initial;\n}\n.tools .toolsList {\n  position:absolute;\n  z-index:810;\n  top:-1px;\n  left:35px;\n  height:25px;\n  line-height:26px;\n  background:#fff;\n  border:1px solid #b7cffe;\n  border-radius:4px;\n  padding:0 15px;\n  display:flex;\n  gap:12px;\n  transform:scaleX(0);\n  transform-origin:left top;\n}\n.tools.opened .addText {\n  color:#6498ff;\n  transform:rotateZ(90deg);\n}\n.tools.opened .toolsList {\n  transform:scaleX(1);\n}\n.tools .toolsList .tools-li {\n  position:relative;\n  font-size:14px;\n  white-space:nowrap;\n  transition:all 0.3s;\n  /* cursor:default; */\n  cursor:pointer;\n  /* 文本不可选中 */\n  user-select:none;\n}\n.tools .toolsList .tools-li:hover,\n.tools .toolsList .tools-li.open {\n  color:#6ebbff;\n}\n\n/* 所有菜单项的内容区的公共样式 */\n.tools .toolsList .box {\n  position:absolute;\n  top:35px;\n  left:-50px;\n  width:442px;\n  color:#333;\n  background:#fff;\n  border:3px solid #dfedfe;\n  border-radius:8px;\n  box-sizing:border-box;\n  padding:10px;\n  cursor:default;\n  white-space:normal;\n  transform-origin:center top;\n  transition:all 0.3s 0.2s;\n  transform:scaleY(0);\n  user-select:text;\n}\n.tools .tools-li.open .box {\n  color:#333;\n  white-space:normal;\n  transform:scaleY(1);\n}\n.tools .toolsList .tools-li:hover .box {\n  color:#333;\n  white-space:normal;\n  transform:scaleY(1);\n}\n.tools .box .info {\n  width:100%;\n  letter-spacing:1px;\n  text-align:initial;\n}\n.tools .box .info .left {\n  width:100%;\n  display:flex;\n  flex-direction:row;\n}\n.tools .box .info .right {\n  width:100%;\n  display:flex;\n  flex-direction:row-reverse;\n}\n.tools .box input,\n.tools .box textarea {\n  border:1px solid #aaa;\n  border-radius:5px;\n  padding:4px;\n  outline-color:#cee4ff;\n  /* 保留空格 */\n  white-space:pre-wrap;\n  /* 允许词内换行 */\n  word-break:break-all;\n  letter-spacing:1px;\n  font-family:math;\n}\n.tools .box textarea {\n  font-size:13px;\n  box-sizing:border-box;\n  color:#333;\n}\n.tools .box input::placeholder,\n.tools .box textarea::placeholder {\n  color:#bbb;\n}\n.tools .box .info .title {\n  font-size:20px;\n  font-weight:bold;\n  margin:8px 30px;\n  letter-spacing:3px;\n}\n.tools .box .info .details {\n  font-size:14px;\n  color:#888;\n  /* margin-bottom:8px; */\n}\n.tools .box .info .item {\n  margin-bottom:8px;\n}\n.tools .box .info .radio-box {\n  display:flex;\n  gap:20px;\n}\n.tools .box .radio-box .item-radio,\n.tools .box .item-text {\n  display:flex;\n  line-height:30px;\n  margin-bottom:6px;\n}\n.tools .box .radio-box .item-radio input[type="radio"],\n.tools .box .radio-box .item-radio input[type="checkbox"] {\n  height:30px;\n  margin-top:0;\n}\n.tools .box .info .radio-box .text {\n  margin:0 5px;\n}\n.tools .box .radio-box label.text {\n  cursor:pointer;\n  line-height:32px;\n}\n.tools .box .radio-box label.text:hover {\n  color:#65aaff;\n}\n.tools .box .item-text {\n  /* height:30px; */\n  line-height:28px;\n  margin-bottom:3px;\n}\n.tools .box .item-text .text {\n  vertical-align:middle;\n}\n.tools .box .item-text input {\n  width:30px;\n  height:20px;\n  line-height:20px;\n  margin:3px 10px;\n  padding:0 3px;\n  text-align:center;\n}\n\n.tools .box .start-btn {\n  height:38px;\n  line-height:40px;\n  color:#65aaff;\n  background:#dfedfe;\n  padding:0 12px;\n  border-radius:6px;\n  box-sizing:border-box;\n  cursor:pointer;\n  /* 文本不可选中 */\n  user-select:none;\n}\n.tools .box .start-btn:hover {\n  background:#cee4ff;\n}\n.tools .box .start-btn.started {\n  color:#666;\n  background:#eee;\n}\n.tools .box .info .disabled {\n  cursor:not-allowed !important;\n}\n\n/* --------------------------------------------------------------------- */\n/* --------------------------------------------------------------------- */\n/* tips小窗说明的文本 */\n.tools .box .info strong {\n  cursor:pointer;\n  color:#65aaff;\n  position:relative;\n  padding-bottom:8px;\n  /* 文本不可选中 */\n  user-select:none;\n}\n.tools .box .info strong.simple {\n  font-weight:400;\n  color:#888;\n}\n.tools .box strong .tips {\n  display:none;\n  width:500px;\n  max-height:360px;\n  line-height:15px;\n  font-size:11px;\n  font-weight:400;\n  color:#888;\n  background:#fff;\n  border:2px solid #dfedfe;\n  border-radius:4px;\n  padding:5px 7px;\n  position:absolute;\n  z-index:950;\n  left:-50px;\n  transition:opacity 0.4s;\n  cursor:default;\n  /* 允许词内换行 */\n  word-break:break-all;\n  /* opacity:0; */\n  overflow-y:auto;\n  user-select:text;\n}\n.tools .box .info strong:hover .tips {\n  display:block;\n  /* opacity:1; */\n}\n.tools .box strong .tips div.tt1 {\n  color:#333;\n  font-size:14px;\n}\n.tools .box strong .tips div.tt2 {\n  color:#666;\n  font-size:12px;\n  font-weight:bold;\n}\n.tools .box strong .tips div.black,\n.tools .box strong .tips span.black {\n  color:#333;\n}\n.tools .box strong .tips div.bold,\n.tools .box strong .tips span.bold {\n  font-weight:bold;\n}\n.tools .box strong .tips div.mt5 {\n  margin-top:5px;\n}\n.tools .box strong .tips div.mb5 {\n  margin-bottom:5px;\n}\n.tools .box strong .tips div.mt8 {\n  margin-top:8px;\n}\n.tools .box strong .tips div.mb8 {\n  margin-bottom:8px;\n}\n.tools .box strong .tips div.ml-1 {\n  margin-left:10px;\n}\n.tools .box strong .tips div.ml-2 {\n  margin-left:20px;\n}\n.tools .box strong .tips div.ml-3 {\n  margin-left:30px;\n}\n\n/* --------------------------------------------------------------------- */\n/* --------------------------------------------------------------------- */\n/* 连续生成图片 区的内容区样式 */\n.tools .box .autoImg .radio-box {\n  display:block;\n  line-height:30px;\n}\n.info.autoImg .radio-box .textarea-left-text {\n  width:53px;\n  margin-left:14px;\n}\n.info.autoImg .radio-box textarea {\n  width:330px;\n  height:140px;\n}\n.autoImg .t-template .tips {\n  width:450px;\n}\n\n.autoImg .start-btn-box {\n  position:absolute;\n  right:10px;\n  bottom:2px;\n}\n.tools .box .autoImg .run-status {\n  display:none;\n  position:absolute;\n  top:-35px;\n  left:15px;\n}\n.tools .box .autoImg .t-run-status {\n  font-size:12px;\n  padding-right:15px;\n}\n.tools .box .autoImg .t-run-status:hover {\n  color:#65aaff;\n}\n.tools .box .autoImg .t-run-status .tips {\n  /* width:auto; */\n  width:480px;\n  max-height:330px;\n  top:-6px;\n  left:60px;\n  overflow-y:auto;\n  /* white-space:nowrap; */\n}\n\n/* --------------------------------------------------------------------- */\n/* --------------------------------------------------------------------- */\n/* 解析模板/数据集 区的内容区样式 */\n.tools .toolsList .toTags-box {\n  padding-bottom:0;\n}\n.tools .box .info .site {\n  font-size:14px;\n  color:#888;\n  margin-bottom:8px;\n}\n.tools .box .info .site a {\n  color:#afd3ff;\n  margin-bottom:8px;\n}\n.toTags .textarea-left-text {\n  width:56px;\n  margin-right:6px;\n}\n.toTags .item-text textarea {\n  width:354px;\n  height:125px;\n}\n.toTags textarea.resultTags {\n  width:100%;\n  height:137px;\n  margin-top:12px;\n  padding:4px 6px;\n}\n.toTags .radio-box {\n  justify-content:space-between;\n  height:35px;\n  line-height:35px;\n}\n.toTags .start-btn-box {\n  margin-left:10px;\n}\n\n/* --------------------------------------------------------------------- */\n/* --------------------------------------------------------------------- */\n/* 编辑窗口 */\n\n\n\n/* --------------------------------------------------------------------- */\n/* ---------------------------------------------------------------------\n滚动条样式\n\n-webkit-scrollbar 滚动条整体部分\n-webkit-scrollbar-button 滚动条两端的按钮\n-webkit-scrollbar-track 外层轨道\n-webkit-scrollbar-track-piece 内层轨道，滚动条中间部分（除去）\n-webkit-scrollbar-thumb 内嵌滑块\n-webkit-scrollbar-corner 边角\n-webkit-resizer 定义右下角拖动块的样式\n*/\n\n.tools ::-webkit-scrollbar,\n.ll-scroll-style-1::-webkit-scrollbar,\n.ll-scroll-style-1 ::-webkit-scrollbar {\n  width:8px;\n}\n.tools .ll-scroll-1-size-2::-webkit-scrollbar,\n.ll-scroll-1-size-2::-webkit-scrollbar,\n.ll-scroll-style-1 .ll-scroll-1-size-2::-webkit-scrollbar {\n  width:10px;\n}\n.tools .ll-scroll-1-size-3::-webkit-scrollbar,\n.ll-scroll-1-size-3::-webkit-scrollbar,\n.ll-scroll-style-1 .ll-scroll-1-size-3::-webkit-scrollbar {\n  width:12px;\n}\n.tools ::-webkit-scrollbar-thumb,\n.ll-scroll-style-1::-webkit-scrollbar-thumb,\n.ll-scroll-style-1 ::-webkit-scrollbar-thumb {\n  -webkit-box-shadow:inset 0 0 8px rgba(0, 0, 0, 0.05);\n  border-radius:10px;\n  opacity:0.2;\n  background:#daedff;\n}\n.tools ::-webkit-scrollbar-track,\n.ll-scroll-style-1::-webkit-scrollbar-track,\n.ll-scroll-style-1 ::-webkit-scrollbar-track {\n  -webkit-box-shadow:inset 0 0 8px rgba(0, 0, 0, 0.08);\n  border-radius:0;\n  background:#fff;\n  border-radius:5px;\n}\n',
          document.head
        ),
          createEles(),
          (function bindEvents() {
            curDom.tools.addEventListener("click", clickTools),
              curDom.listEle.addEventListener("click", clickLi),
              autoImg.startBtn.addEventListener("click", startAutoImg),
              toTags.startBtn.addEventListener("click", startToTags),
              autoImg.info.textEle.addEventListener("input", useDefaTp),
              toTags.info.textEle.addEventListener("input", useDefaTp),
              tools_dom.listEle.addEventListener("mouseover", (e) => {
                e.target.classList.contains("toolsList") && showSearchBox(!1);
              });
            const autoImg_li = autoImg.eleList.title,
              autoImg_search =
                autoImg.info.listEle.parentElement.querySelector(
                  ".control-search"
                ),
              suki_autoImg_search =
                suki_autoImg.info.listEle.parentElement.querySelector(
                  ".control-search"
                ),
              toTags_li = toTags.eleList.title,
              toTags_search = toTags_li.querySelector(".control-search");
            function liToOpen() {
              curDom.tools_list.forEach((item) => {
                item.title.classList.remove("open");
              }),
                autoImg_li.classList.add("open");
            }
            autoImg &&
              autoImg_search &&
              autoImg_search.addEventListener("click", liToOpen),
              autoImg &&
                suki_autoImg_search &&
                suki_autoImg_search.addEventListener("click", liToOpen),
              toTags_search &&
                toTags_li &&
                toTags_search.addEventListener("click", (e) => {
                  curDom.tools_list.forEach((item) => {
                    item.title.classList.remove("open");
                  }),
                    toTags_li.classList.add("open");
                });
          })();
      })(),
      curDom
    );
  }
  function getVal(base, key) {
    let val = JSON.parse(localStorage.getItem(key));
    return null == val && (val = base), localStorage.setItem(key, val), val;
  }
  function errorAlert() {
    const str =
      "插件加载失败, 请尝试刷新页面, 或者更换SD-Webui版本, 若仍旧无法加载请尝试更新插件";
    alert(str), console.log(str);
  }
  setTimeout(() => {
    let i = 0;
    const timerId = setInterval(() => {
      i++;
      const tools_dom = { versions: "v3.8.5", cfg: {}, historyListArr: [] };
      (window.tools_dom = tools_dom), (document.tools_dom = tools_dom);
      let dom = (function getDoms(method = "default") {
        const dom = {};
        try {
          dom.flag = !0;
          let selectors,
            gRoot,
            selectorsInfo = JSON.parse(
              localStorage.getItem("SD_webui_selectors")
            );
          if (
            (selectorsInfo
              ? ((selectors = selectorsInfo.value),
                "v3.8.5" !== selectorsInfo.versions &&
                  (localStorage.setItem(
                    "SD_webui_selectors_old",
                    JSON.stringify({
                      value: selectors,
                      versions: "v3.8.5",
                      oldVersions: selectorsInfo.versions,
                    })
                  ),
                  (selectors = selectors_selectors),
                  localStorage.setItem(
                    "SD_webui_selectors",
                    JSON.stringify({ value: selectors, versions: "v3.8.5" })
                  ),
                  history.go(0)))
              : ((selectors = selectors_selectors),
                localStorage.setItem(
                  "SD_webui_selectors",
                  JSON.stringify({ value: selectors, versions: "v3.8.5" })
                )),
            (dom.selectors = selectors),
            (dom.gRoot =
              document.querySelector(selectors.gRoot) || document.body),
            (gRoot = dom.gRoot),
            (dom.startBtn = gRoot.querySelector(selectors.startBtn)),
            (dom.skipBtn = gRoot.querySelector(selectors.skipBtn)),
            (dom.settingsBar = gRoot.querySelector(selectors.settingsBar)),
            (dom.positiveEle = gRoot.querySelector(selectors.positiveEle)),
            (dom.negativeEle = gRoot.querySelector(selectors.negativeEle)),
            (dom.positiveBox = gRoot.querySelector(selectors.positiveBox)),
            (dom.negativeBox = gRoot.querySelector(selectors.negativeBox)),
            (dom.methodBox = gRoot.querySelector(selectors.methodBox)),
            (dom.methodsArr = gRoot.querySelectorAll(selectors.methodsArr)),
            (dom.methodsTxtArr = gRoot.querySelectorAll(
              selectors.methodsTxtArr
            )),
            "title" === method)
          ) {
            const tt1 =
                gRoot.querySelectorAll(
                  "#txt2img_settings span.text-gray-500"
                ) ||
                gRoot.querySelectorAll("#txt2img_settings span") ||
                [],
              ttArr1 = Array.prototype.slice.call(tt1),
              tt2 =
                gRoot.querySelectorAll("#quicksettings span.text-gray-500") ||
                gRoot.querySelectorAll("#quicksettings span") ||
                [],
              ttArr = Array.prototype.slice.call(tt2).concat(ttArr1),
              stepsEleTT = ttArr.find(
                (i) =>
                  i.innerText.includes("步数") ||
                  "sampling steps" === i.innerText.toLowerCase()
              ),
              widthEleTT = ttArr.find(
                (i) =>
                  "宽度" === i.innerText ||
                  "width" === i.innerText.toLowerCase() ||
                  "宽度\nwidth" === i.innerText.toLowerCase()
              ),
              heightEleTT = ttArr.find(
                (i) =>
                  "高度" === i.innerText ||
                  "height" === i.innerText.toLowerCase() ||
                  "高度\nheight" === i.innerText.toLowerCase()
              ),
              countEleTT = ttArr.find(
                (i) =>
                  i.innerText.includes("批次") ||
                  "batch count" === i.innerText.toLowerCase()
              ),
              sizeEleTT = ttArr.find(
                (i) =>
                  i.innerText.includes("批数量") ||
                  "batch size" === i.innerText.toLowerCase()
              ),
              cfgEleTT = ttArr.find(
                (i) =>
                  i.innerText.includes("相关性") ||
                  i.innerText.toLowerCase().includes("cfg scale") ||
                  (i.innerText.includes("提示词") &&
                    i.innerText.includes("系数"))
              ),
              seedEleTT = ttArr.find(
                (i) =>
                  i.innerText.includes("种子") ||
                  i.innerText.toLowerCase().includes("seed")
              ),
              modEleTT = ttArr.find(
                (i) =>
                  i.innerText.includes("模型") ||
                  i.innerText.toLowerCase().includes("stable diffusion")
              );
            (dom.stepsEle = getSlideBar(stepsEleTT)),
              (dom.widthEle = getSlideBar(widthEleTT)),
              (dom.heightEle = getSlideBar(heightEleTT)),
              (dom.countEle = getSlideBar(countEleTT)),
              (dom.sizeEle = getSlideBar(sizeEleTT)),
              (dom.cfgEle = getSlideBar(cfgEleTT)),
              (dom.modEle = modEleTT.nextElementSibling),
              (dom.seedEle = seedEleTT.nextElementSibling),
              (dom.ttArr = ttArr),
              (dom.methodBox = gRoot.querySelector("#txt2img_sampling")),
              (dom.methodSelect = dom.methodBox.querySelector("select")),
              dom.methodSelect ||
                ((dom.methodsArr =
                  dom.methodBox && dom.methodBox.querySelectorAll("input")),
                (dom.methodsTxtArr =
                  dom.methodBox &&
                  dom.methodBox.querySelectorAll("span.ml-2")));
          } else
            (dom.stepsEle = gRoot.querySelector(selectors.stepsEle)),
              (dom.widthEle = gRoot.querySelector(selectors.widthEle)),
              (dom.heightEle = gRoot.querySelector(selectors.heightEle)),
              (dom.countEle = gRoot.querySelector(selectors.countEle)),
              (dom.sizeEle = gRoot.querySelector(selectors.sizeEle)),
              (dom.cfgEle = gRoot.querySelector(selectors.cfgEle)),
              (dom.seedEle = gRoot.querySelector(selectors.seedEle)),
              (dom.modEle = gRoot.querySelector(selectors.modEle));
          if (
            ((dom.flag =
              dom.flag &&
              dom.positiveEle &&
              dom.negativeEle &&
              dom.positiveBox &&
              dom.negativeBox &&
              dom.startBtn &&
              dom.skipBtn &&
              dom.stepsEle &&
              dom.widthEle &&
              dom.heightEle &&
              dom.countEle &&
              dom.sizeEle &&
              dom.cfgEle &&
              dom.seedEle),
            dom.methodSelect ||
              (dom.flag = dom.flag && dom.methodsArr && dom.methodsTxtArr),
            dom.flag && dom.methodBox && !dom.methodSelect)
          ) {
            dom.methodMap = [];
            for (let i = 0; i < dom.methodsTxtArr.length; i++) {
              const item = dom.methodsTxtArr[i];
              item && dom.methodMap.push(item.innerHTML.toLocaleLowerCase());
            }
          }
        } catch (e) {
          console.log(e), (dom.flag = !1);
        }
        return dom;
      })();
      if (((tools_dom.webui_dom = dom), dom.flag || 0 === dom))
        try {
          (tools_dom.cfg.isAutoLoadTag = (function getIsAutoLoadTag(
            base = !0,
            key = "ll-history-list_isAutoLoadTag"
          ) {
            return getVal(base, key);
          })()),
            (tools_dom.cfg.isClickClose = (function getIsHiddenList(
              base = !0,
              key = "ll-history-list_isHiddenList"
            ) {
              return getVal(base, key);
            })()),
            (tools_dom.cfg.listMaxLen = (function getListMaxLen(
              base = 200,
              key = "ll-history-list_listMaxLen"
            ) {
              let val = localStorage.getItem(key);
              return +val || (val = base), localStorage.setItem(key, val), val;
            })()),
            (tools_dom.cfg.btnShowMode = (function getBtnShowMode(
              base = "单击",
              key = "ll-history-list_btnShowMode"
            ) {
              let val = localStorage.getItem(key);
              return (
                "一直显示" === val && (val = "显示"),
                ["单击", "双击", "显示"].includes(val) || (val = base),
                localStorage.setItem(key, val),
                val
              );
            })()),
            (tools_dom.searchEle = createSearch()),
            (tools_dom.edit = createEditEle({
              placeholder: {
                title: "请输入标题",
                desc: "请输入描述, 鼠标对准标题时将显示描述信息",
                value: "请 输 入 内 容",
              },
            })),
            tagHistory(dom, tools_dom),
            tools(dom, tools_dom);
        } catch (e) {
          console.log(e), errorAlert();
        } finally {
          clearInterval(timerId);
        }
      i >= 40 && (errorAlert(), clearInterval(timerId));
    }, 500);
  }, 500);
})();
