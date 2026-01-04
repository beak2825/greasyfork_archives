// ==UserScript==
// @name         hoyoverse 序列化序號輸入
// @name:ja      シリアル序列化入力機能
// @name:en      hoyoverse code helper
// @namespace    http://tampermonkey.net/
// @version      2024-02-06
// @description  自動整理、輪流輸入批量序號
// @description:ja  バッチシリアル順番入力
// @description:en  auto run bunch codes for genshin and hsr
// @author       Bee10301
// @match        https://hsr.hoyoverse.com/gift*
// @match        https://genshin.hoyoverse.com/*gift*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hoyoverse.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/486793/hoyoverse%20%E5%BA%8F%E5%88%97%E5%8C%96%E5%BA%8F%E8%99%9F%E8%BC%B8%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/486793/hoyoverse%20%E5%BA%8F%E5%88%97%E5%8C%96%E5%BA%8F%E8%99%9F%E8%BC%B8%E5%85%A5.meta.js
// ==/UserScript==

(async function () {
  "use strict";
  while (
    !document.querySelector(".web-cdkey-explain__title") &&
    !document.querySelector(".cdkey-desc__title")
  ) {
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  /*window.onload = () => {*/
  //get content
  let game = "";
  let explainTitle;
  if (document.querySelector(".web-cdkey-explain__title")) {
    explainTitle = document.querySelector(".web-cdkey-explain__title");
    game = "hsr";
  } else {
    explainTitle = document.querySelector(".cdkey-desc__title");
    game = "gs";
  }

  let explainPS = document.querySelector(".web-cdkey-explain .ps")
    ? document.querySelector(".web-cdkey-explain .ps")
    : document.querySelector(".cdkey-desc");

  let explainContent = document.querySelector(".web-cdkey-explain__content")
    ? document.querySelector(".web-cdkey-explain__content")
    : document.querySelector(".cdkey-desc__content");

  let cdkeyCodeInput = document.getElementById("web_cdkey_code")
    ? document.getElementById("web_cdkey_code")
    : document.getElementById("cdkey__code");

  let myBtn;
  let waiting_add = false;

  //create element
  let inputElement = document.createElement("input");
  //fail base64
  const xPicBase64 =
    "data:image/png;base64,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";
  const xPicBase64GS =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALAAAACwCAMAAACYaRRsAAADAFBMVEUAAAD//////4D/qqq/v7/MzMzV1arb27bfv7/jxsbmzLPR0bnV1b/YxMTbyLbdzLvfz7/hw8PVxrjXybzZzL/bzsLcxbneyLzfyr/WzMLYzrrZxr3byL/cyrndzLvezr3Xx7/Yybnay7zbzL3czb/dyLrXybzYy77ZzL/ax7vbyLzbyr7cy7/XzLvYyLzZyb7ayr/by7vbzL3cyL7Yyb/ZyrzZy73azL7byL/bybzcyr3Yy77ZzLvZybzayr3byr7by7vcyLzYyb3Zyr7ay7zay7zbyL3byb7cyrzZy73Zy77ayb7aybzbyr3by77by77ZybzZyb3ayr7ay77by7zbyb3byr7ZyrzZy7zay73ayb7byrzbyrzby73Zyb7Zybzayr3ayr3by77bybzZyb3Zyr3Zyr7ay7zayb3byr3byr7Zy7zZy73ayb3ayr7ayrzby73by77ZybzZyrzayr3ay77aybzbyb3byr3Zyr7Zy7zayb3ayr3ayr7byrzby73Zyb3Zyr7ayrzayr3ay73byb7byrzZyr3ay73ay77aybzayr3byr3by77Zyb3ayr3ayr3ayrzay73byb3byr7Zyrzayr3ay73ayb7ayrzbyr3byr3Zy77aybzayr3ayr3ayr7by7zZyb3Zyr3ayr7ayr3ayb3ayr3byr7Zyr3ay73ayb3ayrzayr3ayr3by73Zybzayr3ayr3ayr3ay7zayb3byr3Zyr7ayrzay73ayr3ayr7ayr3byr3Zy73ayr7ayr3ayr3ayr3ayb7byr3Zyr3ayr3ayrzayb3ayr3ayr3byrzZyr3ayr3ayr3ayrzayr3ay73byr3ayr3ayr3ayr3ay73ayr3ayr3byr3ayr3ayb3ayr3ayr3ayr7ayr3Zyb3ayr3ayr7ayr3ayr3ayr3ayrzZyr3ayr3ayr3ayr3ayr3ayr3ayr3ayr3ayr3ayr3ayr3ayr3ayb3ayr3ayr3ayr3ayr3ayr3ayr3ayr3ayr3ayr3ayr3ayr3ayr2qHBm3AAAA/3RSTlMAAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7rCNk1AAAXM0lEQVR42u1dd1xTSddGepcuiHREAVFAFAEFBAUFC2CDdVVsiBXLujassILSq/W1YVsV21rQFRWkGCAJvUuXLlKS0OGLu/vGzM3ccNPw+/3enX9PcnPyzJkz5zznzFw+vn/Hv+N/fggKi0kp6cxYsHqb75nY6/efvfnwMRNPJBKycClvXz66eTHkuM+6RZaTx48VFxEc8/9AXzEF9cnT7d02/uIfeePh6xR8QXlNQ3Prly+tLY21FUXZ6YlPb8UGHvBa6TjTQFNJ4sfrq2y21Ov4hecpmbkllZ+bv3Z19w0O08ZQfw+pvaW+qjQvKy3hP/47lluoC/1IbJX1ps/beOLS08y6YQyjMTvh2m/bXK0NVaV+jL5KZu6HLjzBFdW0UIYxjZ62uhLCh0cBnrPVRt2WRZT1rT1P3Eyt6xlmdfTmPQj0tjdSkxxNfUWnevjdSi2q7xpmY/Q2lWY8CN5sKTda2krqWCw/fIv4ZZiDQSp+cnqtrZ7MaOgrZbnvbmpBffcwR6O/pQQXf3i+Mq+NWVzb0uP0O9IwVwYlLWLTPD1pntruzD1300s6hrk0SBVZjw7ZjuWVtgJyuvbHEruGuTooqWeWGCiL8CRk0HHaf43YPszl0VX0wM9jCg80VpjhHZtUN4hNi6HBgYHBIYwqfyHe2muhKMBlfRUXnUmu6sRmmY01VZ/Kyj5V1TRgs5+e+tSzrtrCXNR2jLTm4sjsXmY/OkhqrS0vzM5MS074/XJsdERYWER07KU7L5NScYT8sprmzn6mKhMvrpuuxLW4iH/C3O1XC5g63s5P6X9cCfH12bBqsb2lmanJNOowMZ0+y85p+drtB89cfJhUxHSj6S5/fMptMpdAljBcG/Kyog/VAhrKiO/vRh7Z4jbXWEdJArkTiMppGM1ZsnF/0I3ErKLadjTDHmr6eGWHGVd2PnHz/S/L2wbQ9P2cdvvMjuVzjPXUlaRF+aEGJSylMEHXyMLF6+R/EitQly2p9v0pOy7sInJWvoloO0VXZfabS4d/mqOJKZEQGT/DdU9UAr68FUVpyscAW3lO9ZVdcBaH5nvJKTG73GbqqUhhDQjEFbVNF20JelaOEkCTiKFOHMZw8vahBPhq6yhNv3dwoTbLSZqQqo13+NP8ZqjX6MkOn8cRxnJOYblwNEjvAzysJsrxs/FQaY1pzkcfFkMjqO7cMGcONJafF54NSym6a/APfrHiIDMTMd0Q/EcJTOXu7PD5Chzgm0eBu3lvOx2OUhyxCUZuwemwh1NywxcpchPfwfbK94FLJnDufmTsjiUUN/VCMI50lOcevgPViVFeZgrccPBjjTz84osYIaHkRbDjKxSg+HYXxe1x1OJWZKVovj42hwIxOTZ8BRzfnuxoF21Zfj5uDfEJ84OzuiEYh7GK8VjrUAi+HVkh7C4IVEt2CEhthflje5bMTtraD8+Ib1fSyTkKfFwesjN/ed4G8RVhTixYhZjx0Q+dDAHv5/e+VjxgH4Wn7Xz+qRUZDHYTg2ZLY93yhfW2MMQ7g81ZN31MecLiieqvC3v1CakxBXdoJlZXL+18qR7x9b6m1Jg1U3iS3FLTcQ2HIw8/kRE/2fbUSwvj8p50MA3hz/tq3gav0uWRvtSURsl29+185KIpv+CAyVWMUVpxD5EdDzS/PeumxzN9qRorW+y8XY7wb10f9hpisWJ559hS0KAGW9JC3DR5qO83ksbCJ74cMa91cStG9hT8UpZBRMTk9OecW6UnzMfTwT/O+tDzRnBiKcRQW9mRdlUJ0/3pSPNvvrNWV5TXpKjAOAf/tC9gjtqV5Wc7Ul4qt/oBcuPpSNo9lef6UqkwTdfz+YhctzNpn/YIX9M7XYTIxDuTj5mJjwbxLKyz/l4LAqzWODuma0dQfukTRMpJwZ+aI803KkPMeF8qIgsZ/LhNk5kVyzuElA4htshQ67F8ozQkzAMyEQvo8xUXZuHLxKMfQf6utzjSadSKJ9RIyCGI2AUgRiYEmAiif8HuMRjzDNTcXKTAN4pDzi6MCFjFUNefP41D2z6EVLxzEDFT8h41aCFJzcDExGACW7Ebv4zW1Blm+spwxy634mYDYof2n4G27hScLiKCnrpzDjAHoWS50T8mxm/DLDaieQFV+52hVy+fcjeAq6G/Hw+uoq+PPVVQnqV7PAOwiCHS+y26DEAIyE7xOP0ou7qa+NDffQqLDkRYzmDZ2VelLY2Em7stFGBTLbvo91ZA4+6CEBMUm7CK7wAcN4kQOINxx5CxOfKypJmaP/U0l7w8Ys1SiCykYedzPfcr9Ve661ODoBwP/6Rfk4BgfIj8ehnUTwnK/pwFGkTNeSfIitM5kEL+TgeetGTB6QmrOhx5Uv5PZNWbHWQpBQl4ZWwDi8CYouigAczgZayDq0EXkbRGAfJAmwd0nq8Ld8pGCju+jkee1tBYwO70/aaQZcsvuwgRHTTHLVeCPE591xsgGRxouGQGmQeFDQTAbFL9rDBiLDSeim8ZXS7eGu85HrqWTuYA3CYJf2oS5GPGF+qBj31N3AUhpKTMAyrBUAPnZ4sJY0FqIvSkip47GCo+YwjdPlbcbgL2586HcyCEouMLMFQqC7SGhHaKy68h2k9Iaf6zZbDY7wIqvmCI3nHTHEqvTP2VCFoxzp3B2gU1vAmgBb9xhQXP49xvIhPUzszT9iN6NyFtpxN/VCO4GdJdC+jWIulwD6Qqyk4wWLv03FBgqvsbL0yFTtfc8FqG0gHuzEi1CTFtF3/GSlRVxDSUINcvD/hs0/01yoiPaGx/BcSVbYm7VKEzq7Y9h5GOzx6hNiFq4B7yrh5Jrba98FZHiRrd7wJW3FsQaIBcclHlwH+qCrKBG6bg/CddrNYmxCZ6RKQ0DDJMzGFzlOUqbnwoD/hs+93ZiN1u3nMwyc5YLYcS1U06iiOzxjeKGlD1bRlgIFWDZ49FCc75JZ1fAPMxlLxMAvzATziQSHtkhRoBzg8kkFnB+Bu+H+qR+pLzoxYzmZSpsXWAk83ZpUXfBymqf6AQAKzgrD56GmUTlEXBjvFf+DJUuboJ0YtVmFi9mk/iV/rPV4bb0U0Hv6xjNOAjWp9uVmPG6QYRMWOMgm9epIsq00h+YWwN/RdaHq5XFaJb+pufANv3pxBbZp5VzhYzxmj4Ri1WYcr0CentBZZdd+axSWLfnzrpOKhAno+WEHPeHCPGbOL7rQawKhVYVbUXpn9nXyVNL3wGnE7ashGYE4wYs4vvNzO1fQzsiz3P7b7HuvLWDwG8up/NHbk2gQFj9vGlDtOLDcA309x0aDJtl6QhIFc+bzJyfjsyxhzg+217PgpyFERvS5psxgYg16BkHJ2Epf4zAsYc4Ut1bJseA46gwNeVJnM+UAA4tSeb1LBwCMwx5gxfqp0uOg84tk/h3jSZ55kyelHtZRdM+Ts6xnLfKjtwfKNcMeFLjSdm+ZcApNX1wzTZL5eA/1IaOBtb/QYVY4ex/Doo+9sSVYyVFgHd3dnAvP8RSpP5/95IL8o/aIiRb0fDOMBa3y08GYJvtJsa5sKvvGcWyBVfoYmiE4AAH79FFWtJDwXjtMA94UkNSHwphBgXdeyFdaGlqSAMD2mi6ylAiIvzwM7nwDFuy3iNq0PG6+Tc6GUagizQLvYJ9CH6QMkrmuQRWAj/sIiF/gI4xqS2TobSJiHaRZ0VffnMb9FP/FB1Mk3yqoTe2vpezmXlsXCMGXvGWMWXmgXF1NDvZw0faZIPtfSCr7dmscbpQjHmGF8+vilni/qBtl2aJLMZ5FhNWXswBozZwJfKvJ7E0+dtHXk0SS59wjxYHjaNVd58JIzZwZdawDiYQs/Gk4tpkmJ6fPoLzxqx+mgZh7MEEpfxpfKke9/SE6+95TQJUOTtyfY3YL02YXsmg8xdfPn4tHYA+8NAJU1SRe8kKFknJrP+8LHzAjPgTaV9X/CR7OBLJXe8n7UCfo0mAbwHGYcluGTksKwD0qEt7x24iKXs4EslgL2eApXRWpoE4CPJH33ZUZhPakFoZiukj7vpviebfYTUiBhQuA5F4fQjbCk8xmDjtRwIxo13VslxW+FaLiAsqDBr6w2Ywl+TTlrJcFnh6kEgQTrGxqITHG+19TIRZhK9TSn+9jJs2jCw6Gpokgr6HbAbf1KfdX2VZvvcyUc5OUHOCLSRZUNhzW0v6M9SDFbRJKU9wBHIAEPW8Z3jc6cMdbMj4QPnsYGxts+f9J6yv4ImKaA3vf7iYCN28GV2MoU9jHX3J9FXZrtLaRICPfJDVdHGXMWXbYwnHQN2z84CmiQdqLO03pjJXXzZxdjgt1z6mKEtmyZ5C5xf6X1uw2V82cR4alg5vV5NmTTJswLAHSUtGMMpvhQKFzCecQ2I0z+n0iR3wKpF+nJRDvFtz89v5xxjm+f0FjFYkUiTXHwLPD5jnTxn+JKyrl7Fc4yxgPMHIOoreEYTBT0GsM/20RHgBF9ydpSnZwSkcsMaxlIeOLBKdpsm8o37TC8qPD5dlBN8C66smWq4NJTIGcb8qlvwQEzy5zmabGtEBb2oIspRhhN8r2wykRZTsg+DtP2zgLGI0eF8IOr73Z8mW3mimF7UcNtDhW18yUVXNpsp8qMdrMCO8di5IeVAf8yFvTSZ7Q6AJ+x4u0ebXXy78657TZf5awnAjwZhxljZ/Rawn5X+9jNNZuieBtBuJaFT2MW35Oa2mYr/EJScYay1B8iZh/P2zKfJxs0DmjuGSI8s2cX35vZZ3w/ZcYSxUXAJQH/iVn9HUXJmHHgcNsVJiE18d1go07lETjC2AKjA4f7XC783CIkaBpUA5Chhwzg28bVUAFw4+xgLL04cADuJZ30ngUW0970D7KXwmAmzPmNBRUz4coKxwLhNgBfuLw4yEqeb4JU3gK2j7jq0U+y/D1OZjYovAwGBjjHT7jGpWaeBQlH7Gx+t73UMfknz3wBxR9oBLXQqX8FqF0Z8mWFM7RNiEhSOW3MfaKKpu+KqSAeGgLIXHjxpchmVchUab7XrdilGfJlgTDjryISvmAwG78NFVCMdw8TEB18vkUIp94jPhOBLKUXBFx1jStbpGeJoGIvMvQtePpCxHuEGzK8BM0AtlJqitDOP97zziQHf/Fto+KJjTE7aro8SZAlqeOGA9oK+Z/MQjnbisUwKyIj9DO0lHyNuEV6IpEtIhde2ouL7N8ah2Yz8ccM1N5SKq4RtGNhFV3cOmRgrLLsG+Im+wgAo/yOk7ZXEEJ/hL62fLsuUoJS3PcPYi9Wf6auHQlJtewW42bY3u5AdbqKGB4vBLCfeURJixdI2IZVIfHNjVhvJjpAGStsHZDEQb42XzeCbhsU58EBgdbgdcqMZI7H8I3hDRfaBaZD+d0W3a41Ifj12xUSxEdNWmTmn05FWQbkH771U25AMrmriZhXGCbR60A44iiYoTSrndAFsFiXlxbpjOlolbfdbJojxYOu1GVAXMTsYnMWehAWQBTLxGA5o2e/PPQWxMJFpvsVIfHWxldJlZiMwJhNOQWnH8VteAhbcXxkD65BRXHoFnOwv8YsgZ67lVrym0Pf3YcQXhvHXO6uUIQYhZXOuFNg0uhJ3acLWv+6+AnDGCgMgDaMCxgHEnu/4nsOK738xpvMVZb5GkBBL3GQ/DvRD1ZHzoNV6iaUJJCAq7ni3VxcyE84Ref9o3JMXvYKlo4HSdn4pTf+s/86q35fAIjZZ93vNoPf76I3SRWccDFLSQ01x8yUgseWCyJy+vw82UPsfWDt6KWO+/37hX2bxOSl2nSZs99fzLwAbdxvjbFBiXZW18V/BtnLcLh3I55QWB7zE5+UTXp5mpV/j7yFmsu5sfEZ+3ocr+52g544V3B6D7eR9Wb66aBHH9FPliNNs11xhEZXCtKVbDhzc5mKsyHr9TUx1ioPXwf2eNrpysHmWd44uBwFuuO6KGusrebzuHAQ3Xeq5V/jPGk5RZ/egvqDqFH2UyEPKKhhBGHWn7zZEXSYCxqfxiNNs+NN28OxLiJNzw8IoOa6E2cGPYMjRV35+jgT6Nqroer0ZeUrjxHQxvlEagjqbEQY8THq9lVkdVUB7TwHylMa7bZNFRkdffpXFF0oRP18das0UL9EFT5EXSzRcWTZeYFQUFjP3TUVcE0F+t34ERzTpSBoiCuzFnZ6rNBp3rQrobo6vH0Icdg+cPsJakbULyAbNfuDzi93TR+Pe4Akr/lMIRpUDZdHOI52hFZCzjykA86++ypsbDHivsdLS2AJEUtL0wFVx5M5HpXXxCE9Bybn0kx6vT+crOEYgKfsB/FFdLL7F7Bge0YVIyj/vocdbjJUWReQik77GG65Yeir5lV1uIU+gkQnn3Cfz8EYBQUUqvgxcUvJOQ0zzKjhpzxvkJTSkvPNrp/HszLuAhks4w71uFHzATAls3kl69olMhq8Tr261UuKNP5bQWRbDUHKi5AQvwIrQGBnrEAamhlwWf2ShliAvzNdswwWGK2h6iGF28ti9v5wz49V7/VVvojYacX3piag7/sLYy0LKjXRmyQKpl5cRkRj3t1W8/tWcy0tPxOjn8MRaBm6REOnE4rl/OefIPMbaa+fbo1aK/FzUV95i320iw21g5MKLK1VYfZSicySRsWmjHRfkosG9pSfvfDatnoGJ7c67uk6f9R9RcYvNZ2Qcu4kXPWeOF+WO89VziSJCaNiSuC3GMqyHW2M0l8cSGHno7oqXIWuNuaCxkJ7L4bsljJNI5fK3mcuwEx6KaK+MhdjxcEf+vQO2mhze9CKmarHjcloD42W5lJK47bOU2bM6IR0oxsO9jZkXd9hx9D4CBbN14Sk1kB5pSl7cVgt5dt29qM6ySOhVnQMVCaGbrLRl2NNZUs3spxP3C2E3GpMLr24xH8e+HxJWXRxFhDV4DbZ9Srmw20GDHY2VrTaFJxY1QfUlXFpnIsORF1JdEpYLb0kbqn4Tuc1+mpYCC/m+gIz6FJsNAY9L4DdqU3LCVxpyeMszv6J9OMp130PtFRnxET5LjDC3NElNdPAKvJNW2gLXl3oJ6kIVzjkFOafgTNTr6kmf/rx4aM1ck0nqCpJMVgq/uJzqxGlzVu2JfJr/FfVZhNDFylzZjmYfe4d6ofvg15r81PiYo15LrCaNQ/HOQvI6Mxd6Hgi/m5xT0Yp6eTgFF2iryJ3sXHzWr89LmvuYNFZW455eDNi3cbmjhamRgZ6OpoYadWhoak/Un2JsPs91nc+pmAcfypncez/UWfWWK1d+/+OHDDz8HxYzu7ie3FJTmpuZ+vp2bJDf4V92em/euHGz9449B08ERsUlfMjILq5s6mTyWoHBuqTYLaZcfJ3ImHGzNsYQMFz031FTREx7/+rZk0ePnjxLSEzJyq/8OvK3KEW39jvpcDc5kJgw1z8Fwym0YeqbkDraWluam1ta29q7KH0YXsHQgw9foivH9fRL0vrws9w6Dt/MAjlI01z8p/8CeT4eDOnJLtQXcvRwV9/+ood+q415lY9L6S8PeFPaMsA1dTsqkyM2mCvxkPBQMl0T8LSUWxrXvo3eMmsCj2k7ZSuviMTChj5OlR1oLf1wae8CLd5Tz5LqZqt87+T3c6bvYNnTgPWWOrL8fKMxZI1XBz7LKmticwEOfKkgvgr3slLhG7UhqmK0YPOZ+OxWdvTtLHkRuXOpifqovo3sW7fdnPX+cUk5FU0svIeK0lKVn3ovZJuDlijf6A+pCQZWq/aG30+vxfpCofrMJ+cOrbGdqinzw961KK03b92Rc89T8QWf6lo6KP0w1Qd6Ols/VxYR0xMuHd/sbKTA90OHgIyqnqn9cu8joVcfv80qrKj79prF/r9e4jQ00Etub62vLiEmP4uLOrHT3XHGZDV5Yb4fPPiFxSTH6Vm5eB0MunTvxdvUzJzC0oqqmtra2urK8qJcfHpywsOr4b7bV8w1GC8tLizA9+/4d/yPj/8D9MBDVLNAnPgAAAAASUVORK5CYII=";

  function inputFilter(input_text) {
    const linesArray = input_text.split(/\s+/);
    // 保留包含序號的行
    const codesArray = linesArray.filter((line) => line.trim().length > 0);
    for (let i = 0; i < codesArray.length; i++) {
      const code = codesArray[i];
      if (code.match(/\s*https?:\/\/\S+\/gift\?code\=([^\s^\.]+)/)) {
        addCode(code.match(/\s*https?:\/\/\S+\/gift\?code\=([^\s^\.]+)/)[1]);
      } else {
        addCode(code);
      }
    }
  }

  function runCode() {
    if (document.querySelector(".closeBtn")) {
      document.querySelector(".closeBtn").click();
    } else if (document.querySelector(".cdkey-result__close")) {
      document.querySelector(".cdkey-result__close").click();
    }
    if (document.querySelector(".web-cdkey-form__submit")) {
      document.querySelector(".web-cdkey-form__submit").click();
    } else if (document.querySelector(".cdkey-form__submit")) {
      document.querySelector(".cdkey-form__submit").click();
    }
  }

  function insertCode(code) {
    cdkeyCodeInput.value = code;
    cdkeyCodeInput.dispatchEvent(new Event("input"));
    runCode();
  }

  async function doAll() {
    if (!waiting_add) {
      waiting_add = true;
      myBtn.textContent = "Running...";
      //get all code in p element
      let pElements = explainContent.querySelectorAll("p");
      for (let i = 0; i < pElements.length; i++) {
        const pElement = pElements[i];

        if (pElement.style.color === "black") {
          await (async () => {
            insertCode(pElement.textContent);
            while (
              !document.querySelector(".closeBtn") &&
              !document.querySelector(".cdkey-result__close")
            ) {
              await new Promise((resolve) => setTimeout(resolve, 200));
            }
            while (
              !document.querySelector(".resPic") &&
              !document.querySelector(".cdkey-result__icon")
            ) {
              await new Promise((resolve) => setTimeout(resolve, 200));
            }

            if (
              (document.querySelector(".resPic") &&
                document.querySelector(".resPic").src == xPicBase64) ||
              (document.querySelector(".cdkey-result__icon") &&
                document.querySelector(".cdkey-result__icon").src ==
                  xPicBase64GS)
            ) {
              pElement.style.color = "red";
              pElement.textContent += " ==> Failed !";
            } else if (
              document.querySelector(".resPic") ||
              document.querySelector(".cdkey-result__icon")
            ) {
              pElement.style.color = "green";
              pElement.textContent += " ==> OK !";
            } else {
              pElement.textContent += " ==> Error ?";
            }
            if (game == "hsr" && document.querySelector(".closeBtn")) {
              document.querySelector(".closeBtn").click();
            } else if (
              game == "gs" &&
              document.querySelector(".cdkey-result__close")
            ) {
              document.querySelector(".cdkey-result__close").click();
            }
            //wait 5 second
            for (let i = 5; i > 0; i--) {
              myBtn.textContent = "Waiting " + i + "s";
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          })();
        }
      }
      myBtn.textContent = "<<< Run Code";
      waiting_add = false;
    }
  }

  //add code line
  function addCode(code) {
    let pElement = document.createElement("p");
    pElement.style.whiteSpace = "pre-wrap";
    pElement.style.color = "black";
    pElement.textContent = code;
    explainContent.appendChild(pElement);
  }

  function addBtn() {
    let btn = document.createElement("button");
    btn.textContent = "<<< Run Code";
    if (game === "hsr") {
      btn.className = "web-cdkey-form__submit";
    } else if (game === "gs") {
      btn.className = "cdkey-form__submit";
    }
    btn.id = "runBtn";
    btn.style.margin = "0.3rem auto auto 0rem";
    btn.onclick = doAll;
    if (game == "hsr") {
      document.querySelector(".web-cdkey-explain").appendChild(btn);
    } else if (game == "gs") {
      explainPS.appendChild(btn);
    }
    myBtn = document.getElementById("runBtn");
  }

  function startDefine() {
    explainTitle.innerHTML = "Paste Here ↓";
    explainContent.innerHTML = "";
    if (game === "hsr") {
      explainPS.style.height = "200px";
    } else if (game === "gs") {
      explainContent.style.height = "200px";
    }
    inputElement.type = "text";
    inputElement.placeholder = "code / URL";
    if (game === "hsr") {
      inputElement.className = "web-cdkey-form__input";
    } else if (game === "gs") {
      inputElement.className = "cdkey-form__input";
    }
    inputElement.id = "userInput";
    inputElement.name = "userInput";
    inputElement.style.width = "100%";
    inputElement.onchange = () => {
      if (inputElement.value.length > 5) {
        inputFilter(inputElement.value);
        inputElement.value = "";
      }
    };

    if (explainContent.firstChild) {
      explainContent.insertBefore(inputElement, explainContent.firstChild);
    } else {
      explainContent.appendChild(inputElement);
    }
  }

  startDefine();
  addBtn();
  /*};*/
})();
