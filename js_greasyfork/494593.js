// ==UserScript==
// @name         torrentday-thumbnailer-in-background.js
// @namespace    SleazeScripts
// @match        https://torrentday.com/t*
// @match        https://www.torrentday.com/t*
// @icon         data:image/x-icon;base64,AAABAAMAMDAAAAEAIACoJQAANgAAACAgAAABACAAqBAAAN4lAAAQEAAAAQAgAGgEAACGNgAAKAAAADAAAABgAAAAAQAgAAAAAAAAJAAAAAAAAAAAAAAAAAAAAAAAAP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A8u/tGMKzpnK/sKJ3v7Cid7+wone/sKJ3xberb/z7+wr///8A////AP///wDv6+gmv7Cid7+wone/sKJ3v7Cid7+wone/sKJ3v7Cid7+wone/sKJ3v7Cid7+wonfAsaN1yLuuYdHGu0vf2NI6+Pf2Ff7+/gD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A8/HvGX1eQdxlPhv/ZD4b/WQ/G/9kPhv9ZT8c/Obh3Tj///8A////AP///wDj3dcwbEgl82Q/G/9lPxv/ZT4b/2U/G/9lPxv/ZT4b/2U/G/9kPxv9ZT4b/2U/G/9lPxv/ZT8c/WhCIPhsSCXzelk73o5zWr+7q5x+5N7aNf///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A/fz8B45zWL9lPhv9ZT8b/WU/G/9lPxv/ZT8b/8W2qWP///8A////AP///wDv7OkeeVk74mQ/G/9lPxv/ZD4b/WU+Gv1lPxv/ZT8b/2U+Gv1lPhv/ZD4a/WU/G/9lPxv9ZD8a/2Q+Gv1lPhr9ZT8b/WU/Gv9lQBv9ck8u6pmAaq/j3dcz////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AKKLeJ5lPxr/ZD8b/2U/G/9lPhv/ZT8b/66aiJT///8A////AP///wD7+voMi25UyGU/G/9lPxv/ZT8b/2U/G/9lPxr9ZT8b/2U/G/9lPxr9ZT8b/2U+Gv9lPxv/ZT8b/2Q/Gv1lPxv/ZT8b/2U/G/9lPxv/ZT8b/2U/G/1zUDDoxLera/7+/gP///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AMe6rmtlPhr9ZD8b/WQ/G/9lPxv/ZD4b/YpuVMn///8A////AP///wD///8AnoZwoGU+G/9lPxv/ZT4b/2U+G/9lPxv/ZT4b/2U/G/9kPhv9ZT4b/2U/G/9kPhv9ZT4b/2U/G/9lPxv9ZD4a/WU/G/9lPxv/ZD4a/WU/G/9lPhv/ZT8b/KmUgJP8+/sH////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////ANvSyj5rRSP1ZT8b/2U/G/9lPxv/ZT4b/3dVNeD9/f0G////AP///wD///8Ava6he2U/Gv9lPxv/ZD8b/2Q/Gv9lPxv/ZT4b/XFOLOpxTizqcU4s6nFOLOpxTizqcU4s6m9MK+5qRiT3ZD8b/WU/G/9kPxv/ZT8b/WU/G/9lPxr9ZT8a/WZCHfqzoZGF/Pz7A////wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AOnk3yl0UjPpZT4b/2Q/G/9lPhv/ZD8a/2hEIfjv7eom////AP///wD///8A2tHJRmhCH/hkPhr9ZT4b/2U+G/1kPhr9ZT4b/f7+/gX+/v4D/v7+A/7+/gP+/v4D/v7+A/r5+BPe1tBBtKOSh3hXOONlPxv9ZD4a/WQ/Gv1lPxv/ZT8b/2U/G/9xTy3qy7+0YP7+/gD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////APv6+gyCZEfSZD4a/2Q+G/9lPhv/ZD4a/2ZAHPzOw7hT////AP///wD///8A493WLm1KKPBkPhv9ZT4b/2U+G/9kPhv9ZD4b/ff29Rn///8A////AP///wD///8A////AP///wD///8A////APDt6h2ii3emZkAc/WQ+Gv1lPxv/ZD4a/WQ/Gv1lPxv/fV9B2ezn5Cb///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wCVfGOvZT8b/2U/G/9kPxv/ZT8b/2Q/G/26qpp8////AP///wD///8A9vTzF4FhRddlPxv9ZD8b/2U/G/9kPxv/ZT8b/9zVzkn///8A////AP///wD///8A////AP///wD///8A////AP///wD9/f0FqJOAmGU/G/1lPhr/ZT8b/WQ/G/9lPxv/Z0Ie+qmUgZb8/PwF////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wC4p5mEZT4b/2Q+Gv1lPxv/ZT8b/2U+G/2eh3Ks////AP///wD///8A/f39BZJ3XrVkPxr9ZT8b/2U+G/9kPxr9ZT8b/7SikXz///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A/Pv7CZN5Yb1lPxv/ZT8b/2Q+Gv1lPxv/ZD4a/XBOLe3k3tgz////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wDSx71QaEMg+GU+G/9lPxv/ZT4b/2Q+Gv1+XkDU/v7+Af///wD///8A////AKeSgJdkPhv9ZT8b/2U/Gv9kPhr9ZT8b/6mVgp7///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AOnk4CtrRyb2ZT4b/2Q+Gv1kPxr/ZT4b/2Q+Gv2smYaO/v7+Af///wD///8A////AP///wD///8A////AP///wD///8A////AP///wDf19A4bUkn8mQ/G/9lPxv/ZT8b/2U+G/9yTy7q9vX0Gf///wD///8A////AMi7sGpkPhr9ZT4b/2U/G/9lPxv/ZT8b/4JlSdf///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP7+/QGkjnuhZD4a/WU+Gv1lPxv/ZD8b/WQ+Gv1/X0PZ8u/sGP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD49vUVeVk74GQ/G/9lPhv9ZT8b/2U/G/9pRiP329PLQf///wD///8A////ANnQx0FoRCH2ZT8b/2Q/G/9kPhr9ZT8b/2tGI/P9/f0H////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wDi3Nc4ZT8b/WU/G/9lPxv/ZT8b/2U/G/9rRSP129LLSP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD+/v4DiW1RwmU/G/9lPhv/ZT4b/2U+G/9mPxz8xbeqZP///wD///8A////AOzo5CZ2VDXnZD4b/2U/G/9kPhv9ZT8b/2lEIfjw7esq////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD59/YMhGdM12U/G/9lPxr9ZT4b/2U/G/9lPxr9rpqHif///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8AqJSBm2U/G/9lPxv/ZD4b/WQ+G/9lPxv/sZ+Pkf///wD///8A////APv7+gyGaU7JZD4a/WQ+Gv1kPhv9ZD4b/WZAHP3FuKtj////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD+/v4AoIlzn2Q+Gv1kPxv9ZD8b/WU/Gv1kPxv9lX1lufz8+wf///8A////AP///wD///8A////AP///wD///8A////AP///wD///8AxrmtZ2ZAHPxlPxv/ZT8b/2U/G/9lPxv/hmlNx////wD///8A////AP///wCRdl21ZT8b/2U/G/9lPxv/ZT8b/2U/Gv24p5d+////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8AxbitcGU/G/9lPxv/ZT8b/2U/G/9lPxv/fV1A3PTx7xP///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A08i+SWhDIPhlPxv/ZT4b/2U/G/9lPxr9fFs92vv6+g7///8A////AP///wC6q5yBZT8b/2U/G/9lPxv/ZT8b/2Q/Gv+hi3iu////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A493YP2U/G/9lPxv/ZT8b/2U/G/9lPxv/bksq7fDs6Rn///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A8/HvH3JQMOpkPhv/ZT4b/2Q/G/9lPxv/b0wr8Ofj3zD///8A////AP///wDOw7hXZ0Ee+mU/G/9lPhv9ZD4b/WQ+G/1yTy7p////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A6uXhJmU/G/9kPxv9ZT8b/2Q+Gv1lPxv/aUUh9+3p5R////8A////AP///wD///8A////AP///wD///8A////AP///wD///8A/f38B39fQtVlPxv/ZT4b/2U+G/9lPxv/aEIg+M/DuFD///8A////AP///wDd1s86bUkn82U/G/9lPxv/ZT8b/2U/G/9vTCvu+Pf2Ff///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A6+fiJGU/G/9lPxr/ZD4a/WU/G/9lPxr/Zj8b/Ozo4yL///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AJZ+ZrVlPxv/ZT8b/2Q+Gv1kPxv9ZT8b/7ysnX3///8A////AP///wD19PIZeFc542U/G/9lPhv/ZT8b/2U/G/9qRiX339jTQf///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A6uXhJmU/G/9kPxv/ZT4b/2U/G/9kPxv/bksq7e/s6Bn///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////ALmpmn9kPhr9ZD8b/2Q/G/1lPhv/ZT8b/Zd+ZrH///8A////AP///wD9/f0FhmhNyWU+G/9kPxr9ZT4b/2Q+Gv1lPxv9wbKkaf///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A4drUQ2Q/Gv1lPxv/ZT8b/2Q+Gv1lPxv/c1Aw6fDt6hf///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AMu/s1VmQR36ZT4b/2Q+Gv1lPxv/ZT8b/4ZpTcj9/PwH////AP///wD///8AoIl1pmQ+Gv1lPxv/ZT8b/2Q+Gv1lPxv9taOTjP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8Avq+hd2Q+Gv1lPxv/ZT4a/2U+G/9kPxr/im5Uzfj39g7///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AOfi3TJsRyXzZT4b/2Q+Gv1kPxr/ZT4b/3ZUNefw7esh////AP///wD///8AwbOmcWY/G/1kPhr9ZT8b/2U/Gv1lPxv/j3RcxP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD7+vkHkHZdwWQ+Gv1kPxr/ZT4b/2Q+Gv1kPxr/oox2n/39/QP///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////APv6+Q90UjLlZT8b/2U+G/9lPxv/ZT8b/WtGI/XZ0Mg/////AP///wD///8A0ca7TGhDH/hlPxv/ZT8b/2U/G/9lPxv/dlU14v39/Af///8A////AP///wD///8A////AP///wD///8A////AP///wDXzsVLZ0Mf+mU+Gv1lPxv/ZD8b/WQ+Gv1kPxv9vq6gdP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wCGaU7JZT8b/2U/G/9lPxv/ZT8b/2U/HP3JvLBl////AP///wD///8A6+bjK3BNLe5kPhr9ZT8b/2U/Gv9lPxv/clAv6/Hu7SX///8A////AP///wD///8A////AP///wD///8A////AOTf2S92VTbjZT8b/2U/G/9lPxv/ZT8b/2U/G/9vTCvu5+HcMP///wD///8A////AP///wD///8A/v7+Af7+/gP+/v4D/v7+A/7+/gP+/v4D/v7+A/7+/gOok4GhZT4b/2Q+G/9kPhv9ZT4b/2Q+Gv2plYGZ/v7+A/7+/gP+/v4D+fj3FXVTNOdkPhr9ZT4b/2Q+Gv1lPxv/aEMg+tDFu1X+/v4D/v7+A/7+/gP+/v4D/v7+A/38/Ano4+AytqaWg29MK+5lPhr9ZD4b/2U/G/9lPxr9ZD4b/WU/G/+agWqt+vr5Cv///wD///8A////AP///wD+/v4AtaOSfnFOLOpxTizqcU4s6nFOLOpxTizqcU4s6nFOLOppRiP2ZT4b/2U+Gv1lPhr9ZD4a/WU+G/1oQyD4cU4s6nFOLOpxTizqb00s62ZAHPxlPxv/ZD4b/WQ/Gv1lPhv9ZT4b/WxIJfNxTizqcU4s6nFOLOpxTizqcU4s6m9NLOtsSCbzZT8b/WU+G/9kPhr9ZD4a/WU/G/9lPhr9ZT8b/3FOLevf2NI+////AP///wD///8A////AP///wD///8Av7CicWU/G/9lPxv/ZT8b/2U/G/9lPxv/ZD8b/2U/G/9kPhr9ZT8b/2Q/G/9lPxv/ZT8b/2U/G/9kPxv/ZT4b/2U+G/9kPxv/ZT8b/2U/G/9lPxv/ZT8b/2U/G/9lPxv/ZT8b/2U/G/9kPxv/ZT4b/2U/G/9lPxv/ZD8b/2U/G/9lPxv/ZT8b/2U/G/9lPxv/ZT8b/2Q/G/9lPxv/aEIg+LqpmXv9/f0D////AP///wD///8A////AP///wD///8A493YPGU/G/1lPhv/ZT8b/2U/G/9lPxv/ZT8b/2U/G/9lPxv/ZT4b/2U/G/9lPxv/ZT8b/2U/G/9lPxv/ZT4b/2U+G/9lPxv/ZT4b/2U+G/9lPxv/ZT4b/2Q+Gv1lPxv/ZT4b/2U/G/9lPxv/ZT4b/2Q/G/9kPxv9ZT8b/2Q/G/9kPxv/ZT8a/WU/G/9kPxv/ZT4a/2U/Gv1rRiP1tqWVfvv6+gn///8A////AP///wD///8A////AP///wD///8A8OzpGW9MK+tlPhv/ZD8a/2U/G/9lPxv/ZT4b/2U/G/9lPxv/ZT4b/2Q+Gv1lPhv/ZD4a/WU/G/1lPxv/ZT8b/2U+Gv9lPhv/ZT8b/2U/G/9lPxv/ZT8a/WU/G/9lPxv/ZT8b/WU/G/1lPxv/ZT8b/2U/G/9kPxv9ZT8b/2U/G/9lPxv/ZT8b/2U+G/9lPxr9a0Yk9YhrUMbZ0cpH/v7+AP///wD///8A////AP///wD///8A////AP///wD///8A9/b1D4ltU8tnQx/4aEMg+GhDIPhoQyD4Z0Mg+GdCH/hoQyD4Z0Mg+GdCIPhoQyD4aEMf+GhDIPhoQyD4aEIg+GhCIPhnQyD4aEMg+GdCIPhnQyD4aEMg+GhDIPhoQyD4aEMg+GhDIPhoQyD4aEIg+GdDIPhoQyD4Z0Mg+GdDIPhvTCvwclAw6oZoTMmqloSa1szETfz7+wr///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A/v7+AeDZ0jfSx7xK0se8StLHvErSx7xK0se8StLHvErSx7xK0se8StLHvErSx7xK0se8StLHvErSxrxK0se8StLHvErSx7xK0se8StLHvErSx7xK0se8StLHvErSx7xK0se8StLHvErSxrxK0se8StLHvErRx7xK0se8StLHvEro4+Av9PLxHf7+/gP///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///////wAA////////AAD///////8AAP///////wAA////////AAD///////8AAP///////wAA////////AAD///////8AAPwPgAA//wAA/A+AAAf/AAD8B4AAA/8AAP4HgAAA/wAA/gfAAAB/AAD+B8D/AH8AAP4HwP/APwAA/gfA/+AfAAD+A8D/8B8AAP8DwH/4DwAA/wPgf/gPAAD/A+B//A8AAP8D4H/8BwAA/wHgf/wHAAD/geB//gcAAP+B4D/+BwAA/4HwP/4HAAD/gfA//gcAAP+B8D/+BwAA/8DwP/4HAAD/wPAf/gcAAP/A+B/8BwAA/8D4H/wPAAD/wPgf+A8AAP/AeB/gDwAA4AAAAAAfAADgAAAAAD8AAOAAAAAAfwAA4AAAAAD/AADgAAAAA/8AAP///////wAA////////AAD///////8AAP///////wAA////////AAD///////8AAP///////wAA////////AAD///////8AACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A+fj3CtXMw03UysFP1MrBT9fNxEz9/f0D////AP7+/gHc1MxD1MrBT9TKwU/UysFP1MrBT9TKwU/UysFP1MrBT9jOxkXi29Uw9/X0FP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD5+PcOd1Y242U/G/9lPxv/ZkAc/efi3S7///8A////AI1yWLxlPxv/ZT8b/2U/G/9lPxv/ZT8b/2U/G/9lPxv/ZD4a/WdCHvpwTi3th2tQyrmpmnvu6+cd////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wCKblPCZT8b/2U/G/9lPxv/zcK2Wf///wD///8Aq5eElGU/G/9lPxv/ZT8b/2U/G/9lPxv/ZT8b/2U/G/9lPxv/ZT8b/2U/G/9lPxv/ZD4a/W9MK+rHua1k/v7+AP///wD///8A////AP///wD///8A////AP///wD///8A////AKyYhpFlPxv/ZT8b/2U/G/+tmYaK////AP///wDDtKdkZT8b/2U/G/9lPxv/ZT8b/2U/G/9lPxv/ZT8b/2U/G/9lPxv/ZT8b/2U/G/9lPxv/ZT8b/2ZAHP2sl4SN/f39A////wD///8A////AP///wD///8A////AP///wD///8AwrSmZ2U/G/9lPxv/ZT8b/5Z+ZrT///8A////AOHb1DhnQh76ZT8b/2U/G/9lPxv90se9S9PJv0vTyb9L08m/S8zAtV6hinWjbUkn8mU/G/1lPxv/ZT8b/2dCHvrCs6Zr////AP///wD///8A////AP///wD///8A////AP///wDf2NE6ZkAc/GU/G/9lPxv/dlU14/7+/gH///8A8O3qGm5LKfBlPxv/ZT8b/2U/G/339fQY////AP///wD///8A////AP///wDr5uIog2VIz2U/G/9lPxv/ZT8b/3BNLevn4t0r////AP///wD///8A////AP///wD///8A////APLv7BluSyrwZT8b/2U/G/9oQyH48vDtHP///wD9/PwGgGFD1WU/G/9lPxv/ZT8b/9PIvkv///8A////AP///wD///8A////AP///wDy7+0ZeFg64mU/G/9lPxv/ZT8b/5uDbKr+/v4B////AP///wD///8A////AP///wD///8A/v39A35fQdVlPxv/ZT8b/2ZAHP3Zz8dC////AP///wCXfmayZT8b/2U/G/9lPxv/wLKkcf///wD///8A////AP///wD///8A////AP///wDPxLpWZD8a/WU/G/9lPxv/bEkm8+rl4Sb///8A////AP///wD///8A////AP///wD///8AmoNsrWU/G/9lPxv/ZT8b/72tn3L///8A////ALKejYRlPxv/ZT8b/2U/G/+dhm+k////AP///wD///8A////AP///wD///8A////APz7+wZ9XkHbZT8b/2U/G/9lPxv/va6fcf///wD///8A////AP///wD///8A////AP///wC0opF+ZT8b/2U/G/9lPxv/oox3n////wD///8Az8S5V2U/G/9lPxv/ZT8b/4hsUc3///8A////AP///wD///8A////AP///wD///8A////ALCdjIplPxv/ZT8b/2U/G/+Rdl25/v7+AP///wD///8A////AP///wD///8A////ANTLwU1mQBz9ZT8b/2U/G/+DZUjP////AP///wDl39krZ0Mf+GU/G/9lPxv/a0Yj8/39/Qb///8A////AP///wD///8A////AP///wD///8A0Ma8VGU/G/9lPxv/ZT8b/3lYOuD6+PcK////AP///wD///8A////AP///wD///8A5+HcKWhDIfhlPxv/ZT8b/3JPLur5+PcP////APn49w9yUDDpZT8b/2U/G/9nQh/65uHcL////wD///8A////AP///wD///8A////AP///wDu6uclZT8b/2U/G/9lPxv/bEgl8/Ty7xH///8A////AP///wD///8A////AP///wD8+/sJdFIx52U/G/9lPxv/Z0Ie+uLb1TH///8A////AIRmS8tlPxv/ZT8b/2U/G/3QxbtS////AP///wD///8A////AP///wD///8A////APLv7BhlPxv/ZT8b/2U/G/9lPxv98e7rF////wD///8A////AP///wD///8A////AP///wCMcVbFZT8b/2U/G/9lPxv/zcG2XP///wD///8Ao4x4oWU/G/9lPxv/ZT8b/7OgkIX///8A////AP///wD///8A////AP///wD///8A8O3qH2U/G/9lPxv/ZT8b/2xIJfP08e8R////AP///wD///8A////AP///wD///8A////AKiSf5JlPxv/ZT8b/2U/G/+vm4mG////AP///wC7qpx1ZT8b/2U/G/9lPxv/nYVvq////wD///8A////AP///wD///8A////AP///wDa0stGZT8b/2U/G/9lPxv/eVg64/n39gr///8A////AP///wD///8A////AP///wD///8AxberZ2U/G/9lPxv/ZT8b/5N6Yrn///8A////ANnQyERmQBz9ZT8b/2U/G/97Wz3e////AP///wD///8A////AP///wD///8A////AKeSf5llPxv/ZT8b/2U/G/+Rd165/v7+Af///wD///8A////AP///wD///8A////AP///wDd1c46ZkAc/GU/G/9lPxv/elo73fz8/Af///8A7OfjI2pGI/ZlPxv/ZT8b/25LKvD49/YT////AP///wD///8A////AP///wDYz8dEaEQh+GU/G/9lPxv/ZT8b/7mpmXn///8A////AP///wDv7Ogc08i+StPIvkrTyL5K08i+Ssu+s11nQh/6ZT8b/2U/G/9qRiP2x7qtXtPIvkrQxbpTbUkm82U/G/9lPxv/ZkAc/b2tnnHTyb9L08m/S9PJv0vQxbtUpI97nGlFIvdlPxv/ZT8b/2U/G/9yTy7q7enmIv///wD///8A////ANDFuk9lPxv/ZT8b/2U/G/9lPxv/ZT8b/2U/G/9lPxv/ZT8b/2U/G/9lPxv/ZT8b/2U/G/9lPxv/ZT8b/2U/G/9lPxv/ZT8b/2U/G/9lPxv/ZT8b/2U/G/9lPxv/ZT8b/2U/G/9lPxv/ZkAc/L2un3H///8A////AP///wD///8A7+voIWdCHvplPxv/ZT8b/2U/G/9lPxv/ZT8b/2U/G/9lPxv/ZT8b/2U/G/9lPxv/ZT8b/2U/G/9lPxv/ZT8b/2U/G/9lPxv/ZT8b/2U/G/9lPxv/ZT8b/2U/G/9lPxv/ZT8b/W1KKPC6qZl3/f39A////wD///8A////AP///wD49/YKeFc54mdCHvpnQh76Z0Ie+mdCHvpnQh76Z0Ie+mdCHvpnQh76Z0Ie+mdCHvpnQh76Z0Ie+mdCHvpnQh76Z0Ie+mdCHvpnQh76Z0Ie+mdCHvpoQyD4bUko8oBhRNSsmIaR5+LdK////wD///8A////AP///wD///8A////AP7+/gDn4twp4NnSMeDZ0jHg2dIx4NnSMeDZ0jHg2dIx4NnSMeDZ0jHg2dIx4NnSMeDZ0jHg2dIx4NnSMeDZ0jHg2dIx4NnSMeDZ0jHg2dIx4NnSMeXf2Sv29fMV/v7+AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////////////////////////////////8OAB//DgAH/wcAAf+HD4H/hw/g/4cP8H+HD/h/hwf4f8OH+D/Dh/w/w4f8P8OH/D/Dg/w/wcP8P+HD+D/hw/h/4cPgfAAAAPwAAAH8AAAD////////////////////////////////8oAAAAEAAAACAAAAABACAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAA////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A/f39Aenk4Cbq5uEm/v7+APbz8RHp5OAm6eTgJunk4Cbq5eAl9fPxEf///wD///8A////AP///wD///8A////AP39/ANzUDDpZT8b/ezo5CHOwrZUZT8b/2U/G/9lPxv/ZT8b/WhDIPiCZEfPyr2xWv///wD///8A////AP///wD///8AjXFXvWU/G//QxbpP6OPeJmU/G/1kPhv9nINtpZyDbaWMcVfAZ0Ie+mU/G/20opF9////AP///wD///8A////AKmUgZBlPxv/tKKQfvr6+QdtSijwZD8b/fLv7Rn///8A////ANjOxkRpRiP3Z0Ie+uDY0TX///8A////AP///wDFt6phZT8b/5h/Z6z///8AhGdLzWU/G//WzcRF////AP///wD///8Aq5aDjWU/G/+eh3Cj////AP///wD///8A4tvVMmU/G/17Wz3b////AKCJc59lPxv/vKuccf///wD///8A////AN/Y0TdlPxv/dFIy5f38/AP///8A////APj39gxpRSL3aEMg+Pb08w+7q5xxZT8b/6GKdJ////8A////AP///wD39fMPZT8b/2ZAHPz5+PYK////AP///wD///8AgGBD1WU/G//e18841szDRWU/G/+GaU3K////AP///wD///8A8e7sGWU/G/9rRyT1+vn4B////wD///8A////AJuCa6dlPxv/wbOlZ/Dt6hlmQBz8bUkn8/38/AX///8A////ALmomHVlPxv/hGdLy////wDw7OkanINspJyDbKR/YEPVZT8b/39fQtWbgmunZkAc/GU/G/2WfGSunINtpY9zWrxmQBz9ZD4a/ce5rF7///8A+ff2CmtHJPVmQBv9ZkAb/WZAG/1mQBv9ZkAb/WZAG/1mQBv9ZkAb/WZAG/1nQh76fV0/2cS1qGT+/v4A////AP///wDx7usV8OzpGPDs6Rjw7OkY8OzpGPDs6Rjw7OkY8OzpGPDs6Rjw7OkY9vTzD////wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP//AAD//wAA//8AAMwPAADMBwAAzPMAAOTxAADk+QAA5nkAAOZ5AADmeQAAgAMAAIAHAAD//wAA//8AAP//AAA=
// @grant        none
// @version      2024-04-20.2
// @author       Sleaze <root@dev.null>
// @description  Adds a toggle button to torrentday.com torrent listing pages.  When enabled, adds thumbnail image previews to the torrent listing table. On hover over a thumbnail, the expanded images are shown in a box up top.
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494593/torrentday-thumbnailer-in-backgroundjs.user.js
// @updateURL https://update.greasyfork.org/scripts/494593/torrentday-thumbnailer-in-backgroundjs.meta.js
// ==/UserScript==

'use strict';

// LocalStorageLRU Source: https://github.com/sagemathinc/local-storage-lru
// n.b. Included inline because I couldn't figure out how to get the @require working.
//// @require      http://unpkg.com/lru-cache@9/dist/mjs/index.min.mjs

// -----------------------------------------------------------------------------------
// BEGIN LocalStorageLRU
// -----------------------------------------------------------------------------------
/**
 * LocalStorageLRU
 * Copyright 2022 SageMath, Inc.
 * Licensed under the Apache License, Version 2.0
 */
//const local_storage_fallback_1 = require("./local-storage-fallback");

// additionally, each one of them gets `typePrefixDelimiter` as a postfix,
// to further distinguish them from other (pure string) values.
const DEFAULT_TYPE_PREFIXES = {
    date: '\x00\x01date',
    bigint: '\x00\x02bigint',
    object: '\x00\x03object',
    int: '\x00\x04int',
    float: '\x00\x05float',
};
/**
 * Use an instance of this class to access localStorage – instead of using it directly.
 * You will no longer end up with random exceptions upon setting a key/value pair.
 * Instead, if there is a problem, it will remove a few entries and tries setting the value again.
 * Recently used entries won't be removed and you can also specify a function to filter potential candidates for deletion.
 *
 * **Important** do not use index accessors – use `get` and `set` instead.
 */
class LocalStorageLRU {
    /**
     * You can tweak several details of the behavior of this class, check out {@link Props} for more information.
     *
     * By default, no tweaking is required.
     */
    constructor(props) {
        this.maxSize = props?.maxSize ?? 64;
        this.isCandidate = props?.isCandidate;
        this.recentKey = props?.recentKey ?? '__recent';
        this.delimiter = props?.delimiter ?? '\0';
        this.serializer = props?.serializer ?? JSON.stringify;
        this.deserializer = props?.deserializer ?? JSON.parse;
        this.parseExistingJSON = props?.parseExistingJSON ?? false;
        this.typePrefixDelimiter = props?.typePrefixDelimiter ?? '\0';
        this.typePrefixes = this.preparePrefixes(props?.typePrefixes);
        this.checkPrefixes();
        this.ls = this.initLocalStorage(props);
    }
    initLocalStorage(props) {
        const { fallback = false, localStorage } = props ?? {};
        let lsProposed;
        try {
            lsProposed = localStorage ?? window?.localStorage;
        }
        catch { }
        if (lsProposed != null) {
            if (fallback && !LocalStorageLRU.testLocalStorage(lsProposed)) {
                return new local_storage_fallback_1.LocalStorageFallback(1000);
            }
            return lsProposed;
        }
        else {
            return new local_storage_fallback_1.LocalStorageFallback(1000);
        }
    }
    preparePrefixes(typePrefixes) {
        const delim = this.typePrefixDelimiter;
        return {
            date: `${typePrefixes?.date ?? DEFAULT_TYPE_PREFIXES.date}${delim}`,
            bigint: `${typePrefixes?.bigint ?? DEFAULT_TYPE_PREFIXES.bigint}${delim}`,
            object: `${typePrefixes?.object ?? DEFAULT_TYPE_PREFIXES.object}${delim}`,
            int: `${typePrefixes?.int ?? DEFAULT_TYPE_PREFIXES.int}${delim}`,
            float: `${typePrefixes?.float ?? DEFAULT_TYPE_PREFIXES.float}${delim}`,
        };
    }
    checkPrefixes() {
        // during init, we check that all values of typePrefixes are unique
        const prefixes = Object.values(this.typePrefixes);
        const uniqueValues = new Set(prefixes);
        if (prefixes.length !== uniqueValues.size) {
            throw new Error('all type prefixes must be distinct');
        }
    }
    /**
     * the number of recent keys tracked
     */
    getMaxSize() {
        return this.maxSize;
    }
    /**
     * specific types are serialized with a prefix, while plain strings are stored as they are.
     */
    serialize(val) {
        if (typeof val === 'string') {
            return val;
        }
        else if (Number.isInteger(val)) {
            return `${this.typePrefixes.int}${val}`;
        }
        else if (typeof val === 'number') {
            return `${this.typePrefixes.float}${val}`;
        }
        else if (val instanceof Date) {
            return `${this.typePrefixes.date}${val.valueOf()}`;
        }
        else if (typeof val === 'bigint') {
            return `${this.typePrefixes.bigint}${val.toString()}`;
        }
        else if (val === undefined) {
            return `${this.typePrefixes.object}${this.serializer(null)}`;
        }
        return `${this.typePrefixes.object}${this.serializer(val)}`;
    }
    /**
     * Each value in localStorage is a string. For specific prefixes,
     * this deserializes the value. As a fallback, it optionally tries
     * to use JSON.parse. If everything fails, the plain string value is returned.
     */
    deserialize(ser) {
        if (ser === null) {
            return null;
        }
        try {
            if (ser.startsWith(this.typePrefixes.object)) {
                const s = ser.slice(this.typePrefixes.object.length);
                try {
                    return this.deserializer(s);
                }
                catch {
                    return s;
                }
            }
            else if (ser.startsWith(this.typePrefixes.int)) {
                const s = ser.slice(this.typePrefixes.int.length);
                try {
                    return parseInt(s, 10);
                }
                catch {
                    return s;
                }
            }
            else if (ser.startsWith(this.typePrefixes.float)) {
                const s = ser.slice(this.typePrefixes.float.length);
                try {
                    return parseFloat(s);
                }
                catch {
                    return s;
                }
            }
            else if (ser.startsWith(this.typePrefixes.date)) {
                const tsStr = ser.slice(this.typePrefixes.date.length);
                try {
                    return new Date(parseInt(tsStr, 10));
                }
                catch {
                    return tsStr; // we return the string if we can't parse it
                }
            }
            else if (ser.startsWith(this.typePrefixes.bigint)) {
                const s = ser.slice(this.typePrefixes.bigint.length);
                try {
                    return BigInt(s);
                }
                catch {
                    return s;
                }
            }
        }
        catch { }
        // optionally, it tries to parse existing JSON values – they'll be stored with a prefix when saved again
        if (this.parseExistingJSON) {
            try {
                if (this.deserialize !== JSON.parse) {
                    return this.deserialize(ser);
                }
            }
            catch { }
            try {
                return JSON.parse(ser);
            }
            catch { }
        }
        // most likely a plain string
        return ser;
    }
    /**
     * Wrapper around localStorage, so we can safely touch it without raising an
     * exception if it is banned (like in some browser modes) or doesn't exist.
     */
    set(key, val) {
        if (key === this.recentKey) {
            throw new Error(`localStorage: Key "${this.recentKey}" is reserved.`);
        }
        if (key.indexOf(this.delimiter) !== -1) {
            throw new Error(`localStorage: Cannot use "${this.delimiter}" as a character in a key`);
        }
        const valSer = this.serialize(val);
        // we have to record the usage of the key first!
        // otherwise, setting it first and then updating the list of recent keys
        // could delete that very key upon updating the list of recently used keys.
        this.recordUsage(key);
        try {
            this.ls.setItem(key, valSer);
        }
        catch (e) {
            console.log('set error', e);
            if (!this.trim(key, valSer)) {
                console.warn(`localStorage: set error -- ${e}`);
            }
        }
    }
    get(key) {
        try {
            const v = this.ls.getItem(key);
            this.recordUsage(key);
            return this.deserialize(v);
        }
        catch (e) {
            console.warn(`localStorage: get error -- ${e}`);
            return null;
        }
    }
    has(key) {
        // we don't call this.get, because we don't want to record the usage
        return this.ls.getItem(key) != null;
    }
    /**
     * Keys of last recently used entries. The most recent one comes first!
     */
    getRecent() {
        try {
            return this.ls.getItem(this.recentKey)?.split(this.delimiter) ?? [];
        }
        catch {
            return [];
        }
    }
    getRecentKey() {
        return this.recentKey;
    }
    /**
     * avoid trimming more useful entries, we keep an array of recently modified keys
     */
    recordUsage(key) {
        try {
            let keys = this.getRecent();
            // first, only keep most recent entries, and leave one slot for the new one
            keys = keys.slice(0, this.maxSize - 1);
            // if the key already exists, remove it
            keys = keys.filter((el) => el !== key);
            // finally, insert the current key at the beginning
            keys.unshift(key);
            const nextRecentUsage = keys.join(this.delimiter);
            try {
                this.ls.setItem(this.recentKey, nextRecentUsage);
            }
            catch {
                this.trim(this.recentKey, nextRecentUsage);
            }
        }
        catch (e) {
            console.warn(`localStorage: unable to record usage of '${key}' -- ${e}`);
        }
    }
    /**
     * remove a key from the recently used list
     */
    deleteUsage(key) {
        try {
            let keys = this.getRecent();
            // we only keep those keys, which are different from the one we removed
            keys = keys.filter((el) => el !== key);
            this.ls.setItem(this.recentKey, keys.join(this.delimiter));
        }
        catch (e) {
            console.warn(`localStorage: unable to delete usage of '${key}' -- ${e}`);
        }
    }
    /**
     * Trim the local storage in case it is too big.
     * In case there is an error upon storing a value, we assume we hit the quota limit.
     * Try a couple of times to delete some entries and saving the key/value pair.
     */
    trim(key, val) {
        // we try up to 10 times to remove a couple of key/values
        for (let i = 0; i < 10; i++) {
            this.trimOldEntries();
            try {
                this.ls.setItem(key, val);
                // no error means we were able to set the value
                // console.info(`localStorage: trimming a few entries worked`);
                return true;
            }
            catch (e) { }
        }
        console.warn(`localStorage: trimming did not help`);
        return false;
    }
    // delete a few keys (not recently used and only of a specific type).
    trimOldEntries() {
        if (this.size() === 0)
            return;
        // delete a maximum of 10 entries
        let num = Math.min(this.size(), 10);
        const keys = this.keys();
        // only get recent once, more efficient
        const recent = this.getRecent();
        // attempt deleting those entries up to 20 times
        for (let i = 0; i < 20; i++) {
            const candidate = keys[Math.floor(Math.random() * keys.length)];
            if (candidate === this.recentKey)
                continue;
            if (recent.includes(candidate))
                continue;
            if (this.isCandidate != null && !this.isCandidate(candidate, recent))
                continue;
            // do not call this.delete, could cause a recursion
            try {
                this.ls.removeItem(candidate);
            }
            catch (e) {
                console.warn(`localStorage: trimming/delete does not work`);
                return;
            }
            num -= 1;
            if (num <= 0)
                return;
            if (this.size() === 0)
                return;
        }
    }
    /**
     * Return all keys in local storage, optionally sorted.
     *
     * @param {boolean} [sorted=false]
     * @return {string[]}
     */
    keys(sorted = false) {
        const keys = this.ls instanceof local_storage_fallback_1.LocalStorageFallback ? this.ls.keys() : Object.keys(this.ls);
        const filteredKeys = keys.filter((el) => el !== this.recentKey);
        if (sorted)
            filteredKeys.sort();
        return filteredKeys;
    }
    /**
     * Deletes key from local storage
     *
     * Throws an error only if you try to delete the reserved key to record recent entries.
     */
    delete(key) {
        if (key === this.recentKey) {
            throw new Error(`localStorage: Key "${this.recentKey}" is reserved.`);
        }
        try {
            this.deleteUsage(key);
            this.ls.removeItem(key);
        }
        catch (e) {
            console.warn(`localStorage: delete error -- ${e}`);
        }
    }
    /**
     * Returns true, if we can store something in local storage at all.
     */
    localStorageIsAvailable() {
        return LocalStorageLRU.testLocalStorage(this.ls);
    }
    /**
     * Returns true, if we can store something in local storage at all.
     * This is used for testing and during initialization.
     *
     * @static
     * @param {Storage} ls
     */
    static testLocalStorage(ls) {
        try {
            const TEST = '__test__';
            const timestamp = `${Date.now()}`;
            ls.setItem(TEST, timestamp);
            if (ls.getItem(TEST) !== timestamp) {
                throw new Error('localStorage: test failed');
            }
            ls.removeItem(TEST);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    /**
     * number of items stored in the local storage – not counting the "recent key" itself
     */
    size() {
        try {
            const v = this.ls.length;
            if (this.has(this.recentKey)) {
                return v - 1;
            }
            else {
                return v;
            }
        }
        catch (e) {
            return 0;
        }
    }
    /**
     * calls `localStorage.clear()` and returns true if it worked – otherwise false.
     */
    clear() {
        try {
            this.ls.clear();
            return true;
        }
        catch (e) {
            console.warn(`localStorage: clear error -- ${e}`);
            return false;
        }
    }
    getLocalStorage() {
        return this.ls;
    }
    /** Delete all keys with the given prefix */
    deletePrefix(prefix) {
        for (let i = 0; i < this.ls.length; i++) {
            const key = this.ls.key(i);
            if (key == null)
                continue;
            if (key.startsWith(prefix) && key !== this.recentKey) {
                this.delete(key);
            }
        }
    }
    /**
     * Usage:
     *
     * ```ts
     * const entries: [string, any][] = [];
     * for (const [k, v] of storage) {
     *    entries.push([k, v]);
     * }
     * entries; // equals: [[ 'key1', '1' ], [ 'key2', '2' ], ... ]
     * ```
     *
     * @returns iterator over key/value pairs
     */
    *[Symbol.iterator]() {
        for (const k of this.keys()) {
            if (k === this.recentKey)
                continue;
            if (k == null)
                continue;
            const v = this.get(k);
            if (v == null)
                continue;
            yield [k, v];
        }
    }
    /**
     *  Set data in nested objects and merge with existing values
     */
    setData(key, pathParam, value) {
        const path = typeof pathParam === 'string' ? [pathParam] : pathParam;
        const next = this.get(key) ?? {};
        if (typeof next !== 'object')
            throw new Error(`localStorage: setData: ${key} is not an object`);
        function setNested(val, pathNested) {
            if (pathNested.length === 1) {
                // if value is an object, we merge it with the existing value
                if (typeof value === 'object') {
                    val[pathNested[0]] = { ...val[pathNested[0]], ...value };
                }
                else {
                    val[pathNested[0]] = value;
                }
            }
            else {
                val[pathNested[0]] = val[pathNested[0]] ?? {};
                setNested(val[pathNested[0]], pathNested.slice(1));
            }
        }
        setNested(next, path);
        this.set(key, next);
    }
    /**
     *  Get data from a nested object
     */
    getData(key, pathParam) {
        const path = typeof pathParam === 'string' ? [pathParam] : pathParam;
        const next = this.get(key);
        if (next == null)
            return null;
        if (typeof next !== 'object')
            throw new Error(`localStorage: getData: ${key} is not an object`);
        function getNested(val, pathNested) {
            if (pathNested.length === 1) {
                return val[pathNested[0]];
            }
            else {
                return getNested(next[pathNested[0]], pathNested.slice(1));
            }
        }
        return getNested(next, path);
    }
    /**
     * Delete a value or nested object from within a nested object at the given path.
     * It returns the deleted object.
     */
    deleteData(key, pathParam) {
        const path = typeof pathParam === 'string' ? [pathParam] : pathParam;
        const next = this.get(key);
        if (next == null)
            return null;
        if (typeof next !== 'object')
            throw new Error(`localStorage: ${key} is not an object`);
        function deleteNested(val, pathNested) {
            if (pathNested.length === 1) {
                const del = val[pathNested[0]];
                delete val[pathNested[0]];
                return del;
            }
            else {
                deleteNested(val[pathNested[0]], pathNested.slice(1));
            }
        }
        const deleted = deleteNested(next, path);
        this.set(key, next);
        return deleted;
    }
}
//exports.LocalStorageLRU = LocalStorageLRU;

// -----------------------------------------------------------------------------------
// END LocalStorageLRU
// -----------------------------------------------------------------------------------


(function() {
    'use strict';

    // sleep time expects milliseconds
    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    function addCss(css) {
        var styleEl = document.createElement('style');

        // Set the CSS text of the <style> element
        styleEl.textContent = css;

        // Append the <style> element to the <head> of the document
        document.head.appendChild(styleEl);
    }

    addCss(`
.thumbnail {
  width: 75px;
  height: auto;
  margin: 0px;
  transition: transform 0.3s ease;
}

/*.thumbnail:hover {
  //transform: scale(1.2); /* Scale up on hover */
  width: 100%;
}*/

.full-image {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
}

#full-preview-container {
  position: fixed;
  top: 0;
  left: 0;
  border: 5px solid red;
  z-index: 99999;
}

#full-preview-container img {
  width: 100;
}

.full-preview-container-visible' {
  display: block;
}
.full-preview-container-hidden' {
  display: none;
}
`);

    addCss(`
/* ------------------------------------------------------------------------------------- */
/* Switch checkbox element                                                               */
/* From https://stackoverflow.com/questions/44565816/javascript-toggle-switch-using-data */
/* ------------------------------------------------------------------------------------- */
.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
    margin: 10px;
}

.switch input { display: none; }

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
}

input:checked + .slider { background-color: #2196F3; }

input:focus + .slider { box-shadow: 0 0 1px #2196F3; }

input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
}
`);

    addCss(`
/* ----------------------------------------------------------------------------- */
/* Snake border element                                                          */
/* From https://stackoverflow.com/questions/65291742/snake-like-border-animation */
/* ----------------------------------------------------------------------------- */
@keyframes snake-border-head {
    /**
     * The snake's "head" stretches across a side of its container.
     * The moment this head hits a corner, it instantly begins to
     * stretch across the next side. (This is why some keyframe
     * moments are repeated, to create these instantaneous jumps)
     */

    90% { left: 0; top: 0; width: 0; height: 40%; }
    90% { left: 0; top: 0; width: 0; height: 0; }
    100% { left: 0; top: 0; width: 40%; height: 0; } 0% { left: 0; top: 0; width: 40%; height: 0; }

    15% { left: 60%; top: 0; width: 40%; height: 0; }
    15% { left: 100%; top: 0; width: 0; height: 0; }
    25% { left: 100%; top: 0; width: 0; height: 40%; }

    40% { left: 100%; top: 60%; width: 0; height: 40%; }
    40% { left: 100%; top: 100%; width: 0; height: 0; }
    50% { left: 60%; top: 100%; width: 40%; height: 0; }

    65% { left: 0; top: 100%; width: 40%; height: 0; }
    65% { left: 0; top: 100%; width: 0; height: 0; }
    75% { left: 0; top: 60%; width: 0; height: 40%; }

}
@keyframes snake-border-tail {
    /**
     * The "tail" of the snake is at full length when the head is at 0
     * length, and vice versa. The tail always at a 90 degree angle
     * from the head.
     */

    90% { top: 0%; height: 40%; }
    100% { left: 0; top: 0; width: 0; height: 0; } 0% { left: 0; top: 0; width: 0; height: 0; }

    15% { width: 40%; }
    25% { left: 100%; top: 0; width: 0; height: 0; }

    40% { height: 40%; }
    50% { left: 100%; top: 100%; width: 0; height: 0; }

    65% { left: 0%; width: 40%; }
    75% { left: 0; top: 100%; width: 0; height: 0; }
}

.snake-border {
    position: relative;
    box-shadow: inset 0 0 0 1px #00a0ff;
}
.snake-border::before, .snake-border::after {
    content: '';
    display: block;
    position: absolute;
    outline: 3px solid #00a0ff;
    animation-duration: 6s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
}
.snake-border::before { animation-name: snake-border-head; }
.snake-border::after { animation-name: snake-border-tail; }
`);

    addCss(`
.image-preview-container { position: relative; }

.image-preview-container[aria-label]:focus:after,
.image-preview-container[aria-label]:hover:after {
    position: absolute;
    /*z-index: 99;
    */top: -2em;
    left: 0;
    display: block;
    overflow: hidden;
    width: 17em;
    height: 2em;
    border-radius: .2em;
    padding: 0 .7em;
    content: attr(aria-label);
    color: #fff;
    background: #000;
    font-size: 1em;
    line-height: 2em;
    text-align: left;
}
`);

    function findImagesInHtml(html) {
        const fakeHtmlEl = document.createElement('html');

        fakeHtmlEl.innerHTML = html;

        const images = fakeHtmlEl.querySelectorAll('img');
        const onloadImages = [];

        images.forEach(img => {
            if (img.onload === null) {
                return;
            }
            onloadImages.push(img);
        });

        return onloadImages;
    }

    function addPreview(tr, images) {
        var imagePreview;
        if (typeof images !== 'string') {
            imagePreview = createaElementFromHTML('<td class="image-preview"><div class="image-preview"></div></td>', 'tr');
            const container = imagePreview.firstChild;

            images.forEach(image => {
                const smallImage = image.cloneNode(true);
                smallImage.setAttribute('class', 'thumbnail');
                //smallImage.style = 'max-width: 75px';
                container.appendChild(smallImage);
            });
            tr.append(imagePreview);
        } else {
            // It's from the cache.
            imagePreview = domParser.parseFromString(images, 'text/html').body.firstChild;

            // Need to reconstruct images list.
            images = [];
            for (var i = 0; i < imagePreview.children.length; ++i) {
                const image = imagePreview.children.item(i).cloneNode(true);
                image.setAttribute('class', '');
                images.push(image);
            }
            window.images = images;

            tr.append(imagePreview);
        }
        imagePreview.addEventListener('mouseenter', () => showFullImage(images));
        imagePreview.addEventListener('mouseleave', () => hideFullImage());
        return imagePreview;
    }

    function showFullImage(images) {
        const fullImageContainer = document.getElementById('full-preview-container');
        images.forEach(image => {
            fullImageContainer.appendChild(image.cloneNode(true));
            console.log(`added ${image.src}`);
        });
        fullImageContainer.setAttribute('class', 'image-preview full-preview-container-visible');
    }

    function hideFullImage() {
        const fullImageContainer = document.getElementById('full-preview-container');
        fullImageContainer.innerHTML = '';
        fullImageContainer.setAttribute('class', 'image-preview full-preview-container-hidden');
    }

    function createaElementFromHTML(str, parentTag = 'div') {
        var div = document.createElement(parentTag);
        div.innerHTML = str.trim();

        // n.b. Change this to div.childNodes to support multiple top-level nodes.
        return div.firstChild;
    }

    // -----------------------------------------------------------------------------------
    // Miscellaneous setup
    // -----------------------------------------------------------------------------------

    const localStorage = new LocalStorageLRU({
        //recentKey: RECENTLY_KEY,
        maxSize: 8096,
        //isCandidate: candidate,
        fallback: false,
    });

    // Uncomment and reload page to reset the cache if you messed up during dev.
    //localStorage.clear();

    const xmlSerializer = new XMLSerializer();
    const domParser = new DOMParser();

    // -----------------------------------------------------------------------------------
    // Toggler setup
    // -----------------------------------------------------------------------------------

    // <unique-tabId>
    // Unique tab identifier, based on https://stackoverflow.com/questions/11896160/any-way-to-identify-browser-tab-in-javascript.
    // This is used to ensure the toggle button enablement is only applied to the current tab (even across page refreshes, the toggle state is persisted).
    const tabId = sessionStorage.tabId && sessionStorage.closedLastTab !== '2' ? sessionStorage.tabId : sessionStorage.tabId = `${Date.now()}.${Math.random()}`;
    sessionStorage.closedLastTab = '2';
    window.onbeforeunload = () => { console.log(`[image-preview] tabId beforeunload invoked at ${Date.now()}`); sessionStorage.closedLastTab = '1'; };
    window.onunload = () => { console.log(`[image-preview] tabId unload invoked at ${Date.now()}`); sessionStorage.closedLastTab = '1'; };
    window.tabId = tabId;
    // </unique-tabId>

    function enabled() {
        const result = sessionStorage.enabledOnTabId === tabId;
        return result;
    }

    console.log(`[image-preview] tabId=${tabId} enabled=${enabled()}`);

    const prependToEl = document.querySelector('form#torrents');

    const togglerButton = createaElementFromHTML(`
<div class="image-preview-container" aria-label="Toggle image previews on/off">
<div class="${(enabled() ? 'snake-border' : '')}">
    <label class="switch">
        <input type="checkbox" name="toggle" aria-describedby="image-preview-toggle" ${enabled() ? 'checked="checked"' : ''}>
        <div class="slider"></div>
    </label>
    <div style="display:none;" id="image-preview-toggle" role="tooltip">Toggle image previews on/off</div>
</div>
</div>
`);

    prependToEl.firstChild.prepend(togglerButton);

    const checkbox = document.querySelector('input[name=toggle]');
    const parentContainer = checkbox.parentNode.parentNode;

    checkbox.addEventListener('change', function() {
        if (this.checked) {
            console.log('Image preview checkbox is checked');
            sessionStorage.enabledOnTabId = tabId;
            parentContainer.setAttribute('class', parentContainer.getAttribute('class') + ' snake-border');
            document.querySelectorAll('.image-preview').forEach(el => {console.log(el); el.style = ''});
            doImagePreviews();
        } else {
            console.log('Image preview checkbox is deactivated');
            sessionStorage.enabledOnTabId = null; // Disable doActivity() on next run.

            parentContainer.setAttribute('class', parentContainer.getAttribute('class').replaceAll(/snake-border/g, ''));
            // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!                             !!!!!!!!!!!!!!!!!!
            //localStorage.clear(); // !!!!!!! CLEARS OUT BLOWS AWAY CACHE !!!!!!!!!!!!!!!!!!
            // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!                             !!!!!!!!!!!!!!!!!!

            document.querySelectorAll('.image-preview').forEach(el => {console.log('hiiiiiiiiiiiii' + el); el.style = 'display: none'});
        }
    });

    // -----------------------------------------------------------------------------------
    // Party time
    // -----------------------------------------------------------------------------------

    function doImagePreviews() {
        if (!enabled()) {
            console.log('image previews are currently disabled');
            return;
        }

        const fullImageContainer = createaElementFromHTML('<div id="full-preview-container" class="image-preview full-preview-container-hidden">LOLz</div>');
        document.querySelector('form#torrents').parentNode.append(fullImageContainer);

        const rows = document.querySelectorAll('#torrentTable tr');

        const thEl = createaElementFromHTML('<th class="image-preview"></th>', 'tr');
        rows[0].appendChild(thEl);

        async function rowHandler(tr, i) {
            if (i === 0) {
                return;
            }

            //if (i >= 10) { return; }

            if (!enabled()) {
                console.log(`[image-preview] [i=${i}] image previews are currently disabled`);
                return;
            }

            console.log(`[image-preview] starting handler for row=${i}`);

            const startedAt = Date.now();

            let delay = 150; // n.b. In milliseconds.

            var p = new Promise((resolve) => {
                const link = tr.querySelector('.b.hv').href;

                console.log(`[image-preview] link=${link} :: row=${i}`);

                const cached = localStorage.get(link);

                if (cached !== null) {
                    addPreview(tr, cached); // images);
                    console.log(`[image-preview] Found ${link} in cache ::row=${i}`);
                    resolve();
                    return
                }

                sleep(delay).then(() => {
                    fetch(link)
                        .then((response) => {
                        return response.text();
                    }).then((html) => {
                        const onloadImages = findImagesInHtml(html);

                        if (onloadImages.length == 0) {
                            console.log('INFO: no images for ' + link);
                            resolve();
                            return;
                        }

                        const imagePreview = addPreview(tr, onloadImages);
                        localStorage.set(link, xmlSerializer.serializeToString(imagePreview));

                        console.log(`[image-preview] [row=${i}] Injected`);
                        resolve();
                    }).catch(function(err) {
                        console.log(`[image-preview] ERROR: [row=${i}] Failed to fetch page {link}`, err);
                        resolve();
                    });
                });
            });

            await p;

            const finishedAt = Date.now();

            console.log(`[image-preview] row ${i} took ${finishedAt - startedAt} ms`);
        }

        //rows.forEach(rowHandler);
        // The async stuff ensures we don't hit the server too hard with concurrent requests.
        const asyncLoop = async (even) => {
            for (var i = 0; i < rows.length; ++i) {
                if (even && i % 2 == 0 || !even && i % 2 != 0) {
                    await rowHandler(rows[i], i);
                }
            }
        };
        asyncLoop(true);
        asyncLoop(false);
    }

    doImagePreviews();
})();