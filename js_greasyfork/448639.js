// ==UserScript==
// @name         YouTube auto claim channel points from Truffle.TV
// @namespace    https://greasyfork.org/users/124677-pabli
// @version      0.1
// @description  YouTube auto claim channel points from Truffle.TV (formerly known as Mogul.TV)
// @author       Pabli
// @license      MIT
// @match        https://www.youtube.com/watch*
// @match        *.spore.build/*
// @match        https://ludwig.social/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAFeklEQVRIiXVWS4wVRRQ9t7r6896bAeaNEDDgYCQQxIgQP8wEEhOCmLgAP4SNgIJbE11AXKG4EljoxrhQwkcXGgyCiYoSEpwgEUcjGgYECWFCEDIwP4bpea+ruq+L6urPA2qSedVVt+7/nnup+7ckYAQxggR+zL6GH8OP4Wl4ml0NV8NVkJpdBanhKnYUZARHsxNBKHYUhIKjmCIIBaGY7H/EEESwiwHkXwQufaV3nJKyoU4pmM1F/sBuBdg+AgFgsowYZC8ygWAmTr+IAc6UILNh+4QtjcB9FqFkgX1JJfUyk4jpbgImBkRuKQOgghqcW0CccWQC2PzkIij9a9GRCSYGDFDJxa2kmaDCvmRsQS1rffohzQEnMGErv2MAzHBcWfXhxXAjSAU3goigJjhRypBxrgEZRsJKkrnOREUZxkHCEW1Vatyc7Dtz/MqFX8LxIZGgvdK5cHb3krkrp9dq4W3NiG0kUl+kDgIDkMY3VNaeASRwfccDeo/sPXFk5+iNC0WCHwn1Bxa83L117RNbkthRUdM+y7NIMAignr7EjxEkptbYM1Wm0CaFq5JDOzf39+6H48mgncoa6OgOVLPn8Y3vrN7jKKnChlBwFEgxKZBioUEKIvUKMYjZBlo4wnFxaPfr/b37ZbXuGu5EOgp1FIKIANdrk7X6qb8P7Pphs+vAEY4RnNWJ2dk6YAIoc1RlCvqO7Ok/cUBW62RrXavJWTMXzpq5UKvJLKSyWj959vPDf33WHrhZbuRZRBB5SnKaaY4r7gw3T3+5C8LLuDMzN8NX13+0cd2H3AyzvCEieP7Xf+4eDidcx8scSLZiRCoUALFh5wYY+P3Y2I2LbqUt467D4Wn1hx6Zt3ze3BUdHXN0OJyhgnRrg6MX/7h6LJCiAGjppgQVJgtI4L/+U9YHFKuGDkdqnV0vrN3heVTx6MXn32/v6NLhSKwbIDIlfG7wV2ER0eSsKX9ZSlCGIZ+8PWQOVGNixpxHX3nt4/kPP10jCsdUpPBcz6aVizf8e/n0p9+9ee3mOdetAhhrDOGuxQRRBJViGpQOy4iLEi7ca7HlxMaC7HFafahM6TRHblC7de2fT95bVuvsWrNmx6oVm9wmfvp5/8Gj746PDgiv5no1U/9Tg84yZKapJFoBiMAJHlzUYxVlxw1ktT4xNPD94e3NJjcUf3N0+/jIgKzWHRmA016zaMayxAa4aJ3MA8MpsKoGup5cNXXm/LHBAZNIRCSr9dHhq5cvnRQJj4xcldV6Bs9aTcyYNn/p7FWNKLFuZDbVSCwsfpCpZGLEKmnr8J9Zvw1Js5jv5Fe/+OqtAwffJr9arA9EzXVLttZrNZVEWa8gpH1UZJ3A9BAmAtC4g6fWbln07EYdDmcypFu5fuP89RvnpVvJQq3D4eWPbViz+I3xhs6yoJgQhTQtXMU60RAvbdtLiTjbuy8FO2bpVa3aOdhtW71HKcSJFgaw2cSXTZumwtjCfkxBDE+zH8NVqDmiSjj97b4Thz9ogWsU4XqSVdg0wwspFgqkkE4uGtTdlwRJCtd+zEFMvmYvhqfhag5YTA1ocnDy0pnjVy6cCsdviQRTKp0LZncvnbtyul8Lb2s0YseyzuaiDK6puy8x6gcJ/BhBDF/DSwcvuJpdjQBOm4AfQ0aQClJBNKEnOJmMHAXH8hURRGoBCwVokILMbU4bcF6e2SZW8YTmSEEqlhpSwVFwYpampAp5n/VLc0LEohDk1uqne0AB5bScU1DeBoqzHYPzuShv160zS8ti2zkyWCoNSlw6Rd5wSsaVaFGYTHNtqWV6JUYx4bPqkpTzKghP6YjK/iVrAbhlOM4GYcoHLAJgmj5bHZlKM2FhTiI7Tt9nWcwrnQGE/wGrQeWRANGdogAAAABJRU5ErkJggg==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448639/YouTube%20auto%20claim%20channel%20points%20from%20TruffleTV.user.js
// @updateURL https://update.greasyfork.org/scripts/448639/YouTube%20auto%20claim%20channel%20points%20from%20TruffleTV.meta.js
// ==/UserScript==

const button = '.claim.is-visible';
function click() {
  if (document.querySelector(button)) document.querySelector(button).click();
  setTimeout(click, Math.random() * 5000);
}
click()