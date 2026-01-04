// ==UserScript==
// @name         协同放置（Synergism）自定义倍速
// @version      1.0-Demo
// @description  通过劫持performance.now方法进行加速。【测试版，不保证无BUG】
// @author       DreamNya
// @match        https://g8hh.github.io/Synergism/
// @match        https://synergism.g8hh.com/
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEcklEQVRYhb1XTYwURRT++lX17MzSM729NS7LQVmC0YQEEgT1oAfdmGiIYSPrwcSj6M1oAiYGD3oCE36ixsQTR2/8RLkYg2gIngRN5IAShYgQQbq2t5uJuztd9crLbDL09LDD7uq71ffe+76vKz2v33gYMIIgaAohpnyiZyHEFji3QRAFAGCZW/C8q7D255z5W2vtF61WKx6E11uqIAzDrVLKdz1glyCSg5BaZuOAE8aYD9M0/WlZBqIoConokAe8JoiWNNrHiHPAUWbemyRJOrCBMAy3+lIeF0QbliNcYuRqbsx02W30GAjDcNKX8qQgaqyGeJeJLDfmpTRNz/Q1EIbhNl/KM6stXjAxmabphUWMusQjX8pj3eKW+ZJlPmGZs+WIdXovLWKCqOFLeSwMw6jHgC/lYUE00U3igP2x1tOx1mPz7fZuy3yrQ96yzl00xpw1xpy1zl20zK1O7tZ8u7071nos1nraAfu7OQXRhC/l4cWzBwCNRmN7bWjoh+JTzLfb29I0/XHxHEVRmOf5ulardRkAF8opCIJHfN//q/uND8PwsWqlcqFQi7mFhcezLDsvAaDi+/vKrtE5J7rPHeLSnxMAbrVavyzFsRgdzV0EYBzAzrIiKeWmPmIDxz04dgIYJ9VoTAmiHpeO+box5tRKDRhjThnmP4u4IBKq0Zgi+P5kWeOCMe9nWTazUgNZls0YYz4oTfr+JHnA5iJumS0RHV+p+GIQ0XHLbIu4B2wmABM9HZ53o9/sXk4kSZLC826UpCZIENV6YOfaqyXexZkXIUFUo7JaOLf2PzAwVgaTtfZOERRC1AGUNiwzxjqcd4W19g7BuStlHaOjoy+slnpfLueukCPqGZMAQM7tATDQBrREyA5Xrz7RBfLy/HRZUki5RSl1cKXqSqmDQsotZTkvz097AOpNpW4KouGyIst8LNb6TQA371N7XVOpTwTRy314/4m1HhcA2tVa7UFBtB0AcmsPGmvfg3MbiWg9ed6mWq32VjA8vLlWrY7ISoUWFhZuAXAFThnV60+uqVZfXBME+4aHhz8TRD1DrsvA0bm5uRMeAERR9JAg+lUQVS2zc8zv6CT5tKnUWUH0RKHxZKz1dIkBrxlFJ4WUU0tdjWWet8yPJklyjQAgSZJr7NwBABBEnpTyUL1e35ob80rxQ2KZj5SIA4Azzh1ZShwA2LkDSZJcA+7eCaVS6jtJ9FRH6OtY6+fDMBwBMC2EWGuMOZ9l2TcAeuY6AARB8MCaWu3ve4kb5u+11s8AMEUDADDeVOqcINoIALm1b8/MzHw8yFMBQBiGI9VKJemXt8y/x1o/ja4XumctHxkZWS+FOC2IHgYA69w5Z+2Xhvm2lHJca/0RgPn7NWCZfzPWPjc7O/tHN176x6TRaIz6vv+5JOqZYPPtdpSm6ez9GDDMX+V5/mrZflH6McqybEZrvcMa87plvl1WM0hY5tga84bWesdKlptARdEepdTlplIxgKF71A41lYqVUpdVFO0FECxX9H+LfwHGrBkj33hKQAAAAABJRU5ErkJggg==
// @grant        none
// @license      MIT
// @run-at       document-start
// @namespace https://greasyfork.org/users/809466
// @downloadURL https://update.greasyfork.org/scripts/449373/%E5%8D%8F%E5%90%8C%E6%94%BE%E7%BD%AE%EF%BC%88Synergism%EF%BC%89%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/449373/%E5%8D%8F%E5%90%8C%E6%94%BE%E7%BD%AE%EF%BC%88Synergism%EF%BC%89%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==
const customSpeed = 10; //自定义倍速，可自行修改，默认10倍速，修改后刷新游戏生效

performance.realNow = performance.now;
performance.now = () => {
    return performance.realNow() * customSpeed
}