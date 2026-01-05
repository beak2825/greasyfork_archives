// ==UserScript==
// @name           WME Speedhelper Virginia Modification
// @description    Makes inputting speed data easier
// @namespace      Matthew Starbuck
// @grant          none
// @grant          GM_info
// @version        0.5.2
// @match          https://editor-beta.waze.com/*editor/*
// @match          https://www.waze.com/*editor/*
// @author         Broos Gert-Matt Starbuck 2016 Modification
// @license        MIT/BSD/X11
//@icon            data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/16931/WME%20Speedhelper%20Virginia%20Modification.user.js
// @updateURL https://update.greasyfork.org/scripts/16931/WME%20Speedhelper%20Virginia%20Modification.meta.js
// ==/UserScript==
/* Changelog

*/
var VERSION = '0.5.2';

// Add Google Varela Round font to make sure signs look the same everywhere (less hassle)
WebFontConfig = {google:{families:['Varela+Round::latin' ]}};
(function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
        '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
})();

/* Borden base64 */
var mssimg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAA3CAYAAACo29JGAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMTEvMTUvMTUXz/AGAAAFNUlEQVRoge1aTW/aSBh+QFiFisZWtJVYlAizzq7UG71FChVU+QE4p+ZofkF8SyLlkEi9h38AvYUT5gdUEEGl3vAt2t0QYmXVRVWkwAYVIlC8hyQOJMYzxg7dTfpIPtiaj+eZ1+87M++MR9d1HY8U3u9N4CHhc7vB83we53t76H3+jMteD5et1tiyXo6D1++Hf3ERL1ZX8eLdO1e5eNz4LbvVKk63ttD79An6YDA5GZ8P/qUl/PT+PQLxuFNazsR1q1U0JQn9et0xkbtgBAGhXM6RyInEDTQNJ8vLDyLqLhhBwPzHj/BFIrbr2g4op5ubOIpGpyIMAPr1Oo6iUZxubtqua8ty2uvXuFBV2524hWexGCK1GnV5KssNNA2NhYXvKgwALlQVjYUFDDSNqjzRcgNNQ+PVK+jdrisE3YAnEED04IDoh0RxjYUF2/7F8DyCoohAMolnsRgYExJ9TcOFqqJbLqOjKOgfH9vrQxAQPTy0LGMpzq6PPU8mwckygqkUPctrdIpFtDIZfCuXqeuQfHCsz51ublILY3geYUXBXKk0kTAACKZSmCuVEFYUMDxPVedCVS2jqKnlBpqGo2gUoAikQVFEKJeDl2WpCNHgst1GU5LQURRyYY8HvzQapv5narmT5WUqYTOShHCh4KowAPCyLMKFAmYkiVxY16/4mrVz90O3WqUKIDOShFA2S+7cAULZLJXAfr2ObrV67/u935ImOgZFEeFCwR5TB/iyskL8Rc2i54jlaKzG8DxCudxkLCdEKJcjBhkz642IO93aInb0MpNx3cdI8LIsXmYyxHJ3+Y/8ln8yjOV+7HkyiblSyQFNZ/jr7VvLedDj8+HXft94Nyx3ns8TN5qcLDtn6ACk/vXBAOf5vPF+K25vz7Iiw/MTTdDlchmSJCGZTEIURWQyGbQsUg9WCKZSRN8b0aFfox4K6b8DY5+vsqzbwdnZmZ5IJHQA9x6WZfVarWarvRt8lWVLnvVQyChrWO6y17MckUAyaWuUFUXB/v4+WJbF7u4uSqUSstksWJZFu93G9va2rfZoeQzrMLJfVlkq4GqRageiKKLVakGSJHAcZ3znOA4rKysoFou22qPlMayDOrVntm2xAsdxkE0CwI2/sRNOJ3Z4uJ63HAdVVVEul43fURTFB+9zKuK2t7exs7NjvKdSKWQoJmWnmJrlAGBtbQ2SJCFm038nxVTExWIxsCwLWZbBU25E3YCx/PrD47EsGD0+th1UHgJ9TUODMEC/Xa8ojXnOOxSuzeAkraeqKiRJgupCapDEY1jHrTi/37JS10bi5i5kWcaHDx9Mpwa7IPEY1mGI8y8uWlaiymeMwU3YdyP8k3gM6zB87jyfx9+rq5YVw4oycXbLDXSKRXwhDNDPe3vGOd/T2M8BgH9pybLxb+UyOhOuCZ2iUywSE7Z3+Y9Yrlut4uTNG8sGGJ5HRFWnmmq4bLehxWLElPt8pTJyWDliuUA8DkYQLBvoHx+jSZNPdBFNSSIKYwTh3insvbwlTWaroyhoptO2CE6KZjpNFanNeJum02lPdh46MdtMp/EPxWCPO/F5emcFvkgEs+vrVEQ6igItFnMtinaKxav2KBcNs+vrYw8hH/X53NM9WQX+32fixNsMvkgE0YMD4vw3LTCCQCUM+HEP5RaRWg2zGxsAYdfuOjwezG5s2BIG/Lj7dR++SATRw0PMVyoP5ouMIGC+UkH08HAiYYDDm7KBeNwQGUgk4PE5S6Z5fD4EEglDlNM7l65cJh3Go7sp+1/Fo77A/S/buzjoMiOSZwAAAABJRU5ErkJggg==';
var settingsimg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMS8yMS8xNd8NHYEAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAABV0lEQVQokY2RsUtCURTGf++JRYiEEDRkSxC0NAnNPcohaWiRAuk/sEFccqiGlhqixcUgWmoKoihuQwXREg0uRuDUohRC9JYnQXrvaXimpkvfdDnnnu/3nXstERF6ZLRGsAgE7N4WnYoYtBGk+UXWcXCcXRoiiNZ0O1oiIohhLzXLRTVEJPKN6zYACEYiDLgu9WiS+5M1bOuXYNnEk8tAvX0ZoOG61IF0egnb6opktKZcPPNdYxmOlEKdF8jEggAU1CNaG3/AND2yjkP+wXdOpOKMAgyME08lfNJDHsfJ4jUNthUYYnUzRzTkI2s1rx2pVqn6h1CUXG6FQdtqLQ28F49ZzhwAIaYXEkxRRl0/Uwe2Di+ZmxzuvJKYBtvxOW47+/5VcJ67mw2C3QTvrcRTJcyIvmJ//ZRXJkjuZFgMfPA5NkMsGm79V5+0lJQSpV5E9zelTfivfgDuvbmDzO8EmQAAAABJRU5ErkJggg==';
var clearimg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMTEvMjcvMTX6ZkJdAAAA40lEQVQokZXRrUqEcRDF4WcXEcUi+IHJaBSLiIaJBi1egQsm0WSVBZvYxGJ1wRswaDKIEzRpsXgBJj/QYjKs5b/w+m6QnTbM+c05zDS63a5BaqjaRMQKLjCFV6xl5kNV06yId3CDYTzhB7cRsd0HRMQSTvCYmeOZOY8ORnAcEQt1hyt8Z+ZyWdDBPo7wies6MIHniriF88xs4wWTdeAdMxHRxibOMrNVZnP4qAOrmMYBDjNzq7jdYwzrPaDR+0NE7JbMXyX3LEaxl5mnfUCBFnFZ3N6wkZl31bM2Bv1083/J3/oFq/FJ30Qt2lIAAAAASUVORK5CYII=';
var warningimg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAeCAYAAABe3VzdAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAATNSURBVFiFtZhrbBRVFMf/985ut93tZrsvKsaUiArERqJVDL6QrSyREENCTfCDaWzEJ03wA/GDImgoBgMpRkMwfgK+4QMkbAN9zUKxPqJFUzXGxn6oBmhJ2d1226WdnXuPH+hju52ZfclJJpk5595zfnfunHPvXEZEyJZwOMQBsEWG2yvU2RmV2Upu0rgouCuVThp2ViwecX5iGNNWpLMF0rt0CaVOnFwwemfjNv7Eteslz0LJgIIxSp04KXs9viZO1AiAiLHjqbHY8fqN9VwhKgmyJEACoHaostfja1aIPp3VM6JQr8fnVMdiRzeEQ0ophGbfYF7S1RkVHf5gtUJ0INumEH10Llgd6OqMilJiFA04rXACgMq0vg+Aa84wXxXcnmmtBQA0zotNnOIBe853y6g3sJoDL4MxUDoNkRyHnJqCmJgAGAMHXrng9ddebO9eVD5uK6BgjACgXIjDADhpGmw+L1Z++QVW//gdAi9sg5hMAgB3CHkYAHTOinqLRQGqHaq8VOXbzIB6ABBTk7hz1y4Enm9AZV0dag58CO6oAKQEA8KXqnybou1qUW+xYMBYuUMeuWe5zSbpcKa+bFkNAEACsHm9sPv9IHErP2ySWrevfZQnHGUFQxYM2Hf2PD04mtjBgPsy9TKZnLsnIZC5hDJgVdOff7/5U6S94GkuCHDI7RJtwWqvQrQn2ybGx2dhICcmICcnAT7vXiH64Fyw2vuP21VQ2ckbUDCGgVMReKe1fQB82XY9npgD1OMJyFQKjC9w7/No2t6/TkWQLqDs5A2odqgi6g2s4sDrRnY9kZi/j8UgtenFwQg7VF9gxYUCyk5egNpMUS4XohWAYtRGZACmR0dBJAC2aJGzVeiiFZgvVf8L4MXz3bKnyr+RAZuM7AwM+tjY3LM+OmrqiwGbe6p89WpHfmUnJ+BIpUtuWb+O2aVstXIzmyQAkB69YenTLunjJS9uxUilKydkTsD+0xF6+5ffX2VArVkbZrdDu3IFs3OmDQ1Z+mTAA6fOXtjefzqSc5otAW/aFNEWvMOjEO23dOJwYGpwECPHjmP8+x8Qb2uDUu6y6gIb0f4z1UvdV11Oy7JjCigYw7fnuuDVpncD8FtG4xzMZsdA00v49fHHoF0bBnM4LLsAWBKcmtr9xzdt0Ln5jtEUUO1QheoL3MsJO3NFIl0HsylYtud9rDj6GZy190PeTOXqBk54q9sXXB5tV03fouGOeraQVujiEAB7rkAilURNy37UvPsOAMAdCuG3R9aApMwu1tlS5tT1gwAazIo3M/rtBICeKv/6MimjueAAQE8msPKrrxFs2HoLWNdxueZu6PE4mD3n+KBx/vS6xI0eI5vp8OxSGq4Yhk7sDlw9eAipgQHo8Tj+fW8vtOsjecHNxHrNzGb105TzK58DrHBisq8P/WvWQnE6oQ0PQ3G78+1uGcsqi4/l7Z4IvMIJ0nXoiUShcNC5eSxDwHA4xJ8ci52RDM0ABgEk87mYoiSZ3Z5X25lrUDK88VQiFnlmY70hi9kUs4efe5b3jcWP7Kx76PN110Y8DADPSCiZsREw0vOs5JOMgQAoGfrOu5Ymjvx8WQ+HQ5ybHH0YZnHm4VFXc6OgLU0m4yhN2Cct2HC2e3Z3ZHh49B+asfvABkh0CAAAAABJRU5ErkJggg==';
var BGa = ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMS8wOS8xNWB5Zg4AAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAAB/ElEQVRYhe2YPWjbQBiGnwvJEPCQzaM2TR27FDxoz6ItSyEeuha6du6Q1aarA+pUuhlKdlEKXQrt0EWeLDK0WWICIYE45OtgnTifT6otJKShLxycDt17D9/96DspEaEL2q/acabUAHhuNf/2RT5V8VO7RGSm1BkwBPqAKnn1D3ABvPNF0tpAZkpNgFN2j6AAX4DTfwGVgmTh/wwc7Qhg6xF4WTZthSAzpU6Aj1hT0AtDemHIYRBw4HlrfZZpyn0cczudcjudumzPfZFXzgFFZKMkcJLAUwKiy2UQyMN8LtvqYT6XyyAQ0yMrE9eYLoiBDXE9Gm0NYOt6NHLBvNkGZGF2uomiyhBaN1Fkgzwl4BWCJDCpKxK2HJH5UQayNNdE3XKsmYEee8/YJWcY50Q/iop2WmU5PN/ryp7RONSVXhhubM06dOB59MLQbHrmAumbIE3J8t7PDs0VSPaQH1yHQdAYiMP7OAfB+oo2MS0l3i9MkNb1H8SWBvluNi7TrXKZSnJ4f8tBfJGvrJIYAO7juDEQh/dFDpLpSlcKcolaZHk/ZkFYA4nMl5uYnmWa2iC/dCUH8UXeskrpALgaDmsHcXi+3gDJ9EFX7uKYxXhcG8RiPOZufX381NMCdDQxki6litJS8tyZ60T3L1gWULtXTgdQu5fwAqj2fks0qb9wkQP7KV35ewAAAABJRU5ErkJggg==', '34|34|10|visible']; // Global (red circle)
var BGb = ['data:image/png;base64,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', '34|50|10|hidden']; // residential 
var BGc = ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAiCAYAAACnSgJKAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMS8wOS8xNWB5Zg4AAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAAD7ElEQVRYhe2Vyyu8exzHX88zmodmmBGiSSSXZiiK3HIpl1lYKEyxYGMhUaN+EeEnt2lKkjqSlcKKh/wDMqVYIlbjskFobAjjMpjnLE7kMqFzOGdxvFff7+fz9H59+3w+PR9BURT+K/k9v8iy3ON0Oru/40GCIGA0GnsrKyt73sBlWe53OBxNgYGBqNVqvvIBgiDg8XhwOBy/AFVlZWXXC/jW1tZvjUbD4ODgl0Ffq7m5OcjpdP4GugDEx4SiKEiS9G1g4I3/i54/ltrlcmG32zk5OaGjowNRFLHb7YiiSH5+PuXl5fT19XF+fo6fnx/t7e1MTk6yv7/P/f09NpsNWZZZXV0lNzcXq9X6wv9RIj40MjLC2toaFRUViKLI0tISR0dH1NXVMTk5yfT0NMvLy+Tk5GCxWHh4eECWZVJTU6mqqkKj0TA3N0dpaSlLS0sMDw/7rIRPeFNTExkZGczPz7O/v09YWBiHh4eMj48TFxdHcnIyHo+HjY0NSkpKMBgMCILA6uoqxcXFhIWFodPpqKmpwWaz4XA4fML9fAU3Nzcxm80cHx9jt9uprq4mPj6e1tZWjEYjm5ubBAQEUF9fz/r6Ov7+/mg0GhoaGnA6nRgMBi4uLlhYWGBqaoqsrKzPwyVJYnR0FEEQGBgYwO12U1paSlJSEgDh4eHExsbS1dWFJEl0dnaSnZ3N4OAgiqLQ3d1NUVERQ0NDpKen09bW9nl4Xl4eeXl5L2Jms/npbDAYmJ6eRlEUBEEA/pqT50pJSfEJ/BD+KJfLhaIoREREAHBwcEBAQAA3Nzfo9Xq0Wi1ut5vT01O0Wi0ej4e9vT2ur6+5vb3FZDIRGRn59+BjY2NIkkR7ezsAo6OjmEwmdnd3OTg4YGJigsbGRqKiojAajWxvbxMaGsrQ0BAxMTH09va+C/c57U9JUUSlUj3dBUFAFEWCgoKQZZmVlRVmZ2fR6XR4vV7u7u6wWq2UlJTQ399Pfn7+e/bvw71e74u/kqIo3N3doVKpsFgslJWVYbFYEEWR+/v7p++ur6+5vLx8FwwflF2r1TIzM4PL5cJkMiFJEmq1mtPTUwoLC0lMTMRgMLCzs0NISMjT8CmK8qnF9C68traWtLQ03G434eHhmM1mJEmioKAAjUaDXq/n7OyMq6sr/P39ubm5AaCvr4/g4OB/Bg8JCaGgoOBN/LmxXq9Hr9e/yEdHR38Ihg96/t36gf/Af+A/8P8J/HErfZde+4vPE7e3t98Kf+3/tNWMRqNtcXHR2tLSolOr1V8O9ng8XF5enmdmZv7xGBOeL31Zlnu2tra6vV7vl7ZAURREUSQhIaG3qqqqxyf839afzGFw15tV9cAAAAAASUVORK5CYII=','34|31|17|visible']; // US
var BGd = ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOnAAADpwBB5RT3QAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMTEvMDkvMTVgeWYOAAACVklEQVRYhe2YPUhbURTHf9ckEngOVRHBkCEU3tShQ5eSiqNDackWCgU7dLRDCw6dO3RwKdRRoZ1KNrE4ZFQbXBw6dAqIFIltkZjFB+Iz3A7vg5ub92I+3uvL0P90OMm775dzzr33nAgpJeOg9LAP1oV4BDzQ3L9MKSvDrCcGiUhdiPfAC2AeED2++hvYBd6ZUv6MDKQuxCawwuARlMA+sHIbUE8QN/xfgTsDAui6AZ73SlsoSF2IMvAFJQWZhUlmVheZKhqkjEbgc20rx2XN4mLjAPvsWv94y5TyZd8gQRBza0Wmy1dhPyhQrUqW8/VaXzBdIG469lWIQrVEZvZ0IAhPdjPPyfK27n5tSvnhNpAWSk3c3XsamoZ+1bZyHC/tqC4JFNQCntAgNlWIQrU0MgRAymhQqJZUlwA6wtQBgrNFAacmhk1HkDKzp8ytFVXXfbcMOkHcwyoNzu4YtDD70XT5iszCpOr62AWCc2ICMLO6GDlEyNr3gkDmPWOqaMQGoq2d9tIzAf6W9bdrFAUappTR0NPz2Aeh+xb9l3qogiSu/yC6PJCjBBkOfRBTym845z/g3A1xqW3l9PZg1wdx9cczLmtWbCDa2jduEDpAPnnGxcZBbCDa2j88wwcxpXyL09Jhn13TqmQjh2hVsnpaXnWBuPrsGefrNexmPjIIu5nXu7XvXlpgXBsjV09QdtDx0s5IkbGbeR0C4I0+XnSBuOF6psKcLG8PVTOtSjaoX93S+1UY93FCgQkdsLSr3FfAy2GUAUsDSnbkDABKdggPgUrub4k49RftnBxzBAP7OgAAAABJRU5ErkJggg==', '34|34|10|visible']; // Sweden (red/yellow circle)
var BGe = ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAiCAYAAACjv9J3AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMTEvMDkvMTVgeWYOAAADn0lEQVRIie2Xz0sqaxjHv+84is4V+6FilqBEigXRpshNV8cozv0LCuEeipYti2hRmzaB0b5V0T20qUUQBGHFrS4pBdEPKohQaiwsw8WV0sFx5j0rJU/SPZwO92z8wgvzPPPyfN7n+87A+xJKKf5vsYWHcDhs3tzc/BKNRnsURXkmhJCPFqeUUoZh9A6HY5Pn+T95nn8qgYZCocVEIuF3Op0MwzCGn+EAIQSUUgiC4N/Z2fmL5/k/SqDX19ef2trayNjY2Idh32pmZkZ9enr6qRAXoQzD/MuybDUAnJycwG63Ix6Pw+Fw4Pj4GF6vF2dnZ0in0zAajeA4DtlsFjabDVdXV6iuroZOp8PLywskSUJDQwMEQUBraytUKhUIIek3UABMYRsXFhYgCAIsFguGhoYwOjqK/f197O3tIRqNgud5EEKwsrICtVoNvV6P7u5uGAwGJBIJhMNhpFIpWK1WzM7OghACQghTBJWzo6qqCtvb29Dr9YhEIjAYDAiFQtBoNMjn82BZtjg2NjZgtVqRyWSQTCah0WigVquxvr4OjuPK2v26UxQ+Hr/fj66uLgCAKIpYXFzE4eEhGhsbYbFYwHEcampqMDAwgP7+fpjNZoiiiLW1NQwODqK2tha9vb3QarUldctCZVkGAPh8vjers9lsZVf9Wh6PB4QQuFyuknyhbkFl7f1Rfe+v/VOh36sKtAKtQCvQCrQC/UXQu7s7SJL0n0VEUcTDwwOenp4+Dh0fH0csFsP9/T0URUE8HsfFxQVub29xfn4OSimy2SyOjo6wurqKyclJHBwcIJfLvQtl33tJCMHU1BS8Xi98Ph9GRkbw+PgIs9mMdDqNYDAIo9EIURTR0tKC+fl5XF5eoq+vD8PDwz/WaSKRwPLyMlwuFwRBgNvtRiAQQEdHB3p6erC7u4tUKoW6ujokk0m0t7djYmICW1tb73b6Gqp8e8ZxOp2Ym5vD0tISOI6D3W6HwWCAyWSCyWSCTqeDKIpobm4Gy7LFk2JTU9MbxyilSjFBKQWlFIFAQAkGg/S1np+fKaWUJpNJqigKlWWZ5vN5msvlqCRJNJvNlswvxJlMpiQfDAZpIBCgBVZxT91u99+xWOz36elpttCxVquFJEnQaDSQJAkMw4BSWnLqk2UZsiyDZVmoVCrk83mo1WqIolicc3Nzk3e5XHuFuAj1eDyfI5HIl2g06iWEvAD48FURAAXwW319/T+dnZ2fi3b/ikvxV91+qmOLoEEOAAAAAElFTkSuQmCC','34|29|10|visible']; // Canada
var BGf = ['data:image/png;base64,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','34|37|10|hidden']; // France
var selectedItems;

var signConfig = {
    NL:         {'sgn': BGa, 'ann':'kmh', 'spd':[ [15,BGb], 30, 50, 60, 70, 80, 100, 120, 130 ]}, //------------------------ 1.The Netherlands
    BE:         {'sgn': BGa, 'ann':'kmh', 'spd':[ [20,BGb], 30, 50, 70, 90, 100, 120 ]}, //--------------------------------- 2.Belgium
    LU:         {'sgn': BGa, 'ann':'kmh', 'spd':[ 30, 50, 70, 90, 110, 130 ]}, //------------------------------------------- 3.Luxemburg
    FR:         {'sgn': BGa, 'ann':'kmh', 'spd':[ [20, BGf], 30, 50, 70, 90, 110, 130 ]}, //-------------------------------- 4.France
    AU:         {'sgn': BGa, 'ann':'kmh', 'spd':[ 30, 40, 50, 60, 70, 80, 100, 110, 120, 130 ]}, //------------------------- 5.Austria
    UK:         {'sgn': BGa, 'ann':'mph', 'spd':[ 20, 30, 40, 50, 60, 70]}, //---------------------------------------------- 6.United Kingdom
    HU:         {'sgn': BGa, 'ann':'kmh', 'spd':[ 30, 40, 50, 60, 70, 80, 90, 130]}, //------------------------------------- 7.Hungary
    MX:         {'sgn': BGa, 'ann':'kmh', 'spd':[ 10, 20, 30, 40, 45, 50, 60, 70, 80, 90, 100, 110]}, //-------------------- 8.Mexico
    SZ:         {'sgn': BGa, 'ann':'kph', 'spd':[ [20,BGb], 30, 40, 50, 60, 70, 80, 100, 120]}, //-------------------------- 9.Switzerland
    GM:         {'sgn': BGa, 'ann':'kph', 'spd':[ [7,BGb], 30, 50, 60, 70, 80, 100, 120, 130]}, //-------------------------- 10.Germany
    LG:         {'sgn': BGa, 'ann':'kmh', 'spd':[ [20,BGb], 30, 40, 50, 60, 70, 80, 90, 100]}, //--------------------------- 11.Latvia
    LH:         {'sgn': BGa, 'ann':'kmh', 'spd':[ 30, 40, 50, 60, 70, 80, 90, 110, 120, 130 ]}, //-------------------------- 12.Lithuania
    RS:         {'sgn': BGa, 'ann':'kmh', 'spd':[ 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130 ]}, //----------------- 13.Russia
    EZ:         {'sgn': BGa, 'ann':'kmh', 'spd':[ 20, 30, 40, 50, 70, 80, 90 ]}, //----------------------------------------- 14.Czech Republic
    SP:         {'sgn': BGa, 'ann':'kmh', 'spd':[ 20, 30, 40, 50, 60, 70, 80, 90, 100, 120 ]}, //--------------------------- 15.Spain
    PO:         {'sgn': BGa, 'ann':'kmh', 'spd':[ 30, 40, 50, 60, 70, 80, 90, 100, 120]}, //-------------------------------- 16.Portugal
    DA:         {'sgn': BGa, 'ann':'kmh', 'spd':[ 30, 40, 50, 60, 70, 80, 90, 110]}, //------------------------------------- 17.Danmark
    CO:         {'sgn': BGa, 'ann':'kmh', 'spd':[ 20, 30, 40, 50, 60, 70, 80, 90, 100, 120]}, //---------------------------- 18.Colombia
    LO:         {'sgn': BGa, 'ann':'kmh', 'spd':[ 30, 40, 50, 60, 70, 80, 90, 100, 110, 130]}, //--------------------------- 19.Slovakia
    BR:         {'sgn': BGa, 'ann':'kmh', 'spd':[ 30, 40, 50, 60, 70, 80, 90, 100, 110, 120 ]}, //-------------------------- 20.Brazil
    UY:         {'sgn': BGa, 'ann':'kmh', 'spd':[ 30, 45, 60, 75, 80, 90, 110]}, //----------------------------------------- 21.Uruguay
    US:         {'sgn': BGc, 'ann':'mph', 'spd':[ 5, 10, 15, 18, 20, 23, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70]}, //------- 22.United States    
    ES:         {'sgn': BGa, 'ann':'kmh', 'spd':[ 25, 40, 50, 60, 70, 80, 90]}, //------------------------------------------ 23.El Salvador
    BL:         {'sgn': BGa, 'ann':'kmh', 'spd':[ 20, 30, 50, 70, 80, 100]}, //--------------------------------------------- 24.Bolivia
    LS:         {'sgn': BGa, 'ann':'kmh', 'spd':[ 30, 40, 50, 60, 80, 100, 120]}, //---------------------------------------- 25.Liechtenstein
    EI:         {'sgn': BGa, 'ann':'kmh', 'spd':[ 30, 40, 50, 60, 80, 100, 120]}, //---------------------------------------- 26.Ireland
    PL:         {'sgn': BGa, 'ann':'kmh', 'spd':[ 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140]}, //----------------- 27.Poland
    AS:         {'sgn': BGa, 'ann':'kmh', 'spd':[ 25, 30, 40, 50, 60, 70, 80, 90, 100, 110, 130]}, //----------------------- 28.Australia
    NZ:         {'sgn': BGa, 'ann':'kmh', 'spd':[ 40, 50, 60, 70, 80, 100]}, //--------------------------------------------- 29.New Zealand
    SW:         {'sgn': BGd, 'ann':'kmh', 'spd':[ 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]}, //----------------------- 30.Sweden
    CA:         {'sgn': BGe, 'ann':'kmh', 'spd':[ 30, 50, 60, 70, 80, 90, 100, 110]}, //------------------------------------ 31.Canada
    SR:         {'sgn': BGa, 'ann':'kmh', 'spd':[ 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]}, //----------------------- 32.Serbia
    RO:         {'sgn': BGa, 'ann':'kmh', 'spd':[ 30, 50, 60, 70, 90, 100, 130]}, //---------------------------------------- 33.Romania
    IT:         {'sgn': BGa, 'ann':'kmh', 'spd':[ 30, 40, 50, 60, 70, 80, 90, 100, 110, 130]}, //--------------------------- 34.Italy
    GQ:         {'sgn': BGc, 'ann':'mph', 'spd':[ 5, 10, 15, 20, 25, 30, 35, 40, 45]}, //----------------------------------- 35. Guam
    SI:         {'sgn': BGa, 'ann':'kmh', 'spd':[ 30, 40, 50, 60, 70, 90, 100, 110, 130]}, //------------------------------- 36.Slovenia
    BO:         {'sgn': BGa, 'ann':'kmh', 'spd':[ 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]}, //----------------------- 37.Belarus
    BC:         {'sgn': BGa, 'ann':'kmh', 'spd':[ 40, 60, 70, 80, 100, 120]}, //-------------------------------------------- 38.Botswana
    SF:         {'sgn': BGa, 'ann':'kmh', 'spd':[ 40, 60, 70, 80, 100, 120]}, //-------------------------------------------- 39.South Africa
    MY:         {'sgn': BGa, 'ann':'kmh', 'spd':[ [30,BGb], 35, 50, 60, 70, 80, 90, 110]}, //------------------------------- 40.Malaysia
    BU:         {'sgn': BGa, 'ann':'kmh', 'spd':[ 20, 30, 40, 50, 60, 70, 80, 90, 120, 140]}, //---------------------------- 41.Bulgaria
    JE:         {'sgn': BGa, 'ann':'mph', 'spd':[ 15, 20, 30, 40]}, //------------------------------------------------------ 42.Jersey
    IC:         {'sgn': BGa, 'ann':'mph', 'spd':[ 30, 40, 50, 60, 70, 80, 90]}, //------------------------------------------ 43.Iceland
    AR:         {'sgn': BGa, 'ann':'mph', 'spd':[ 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130]}, //-------------- 44.Argentina
    RE:         {'sgn': BGa, 'ann':'kph', 'spd':[ 30, 50, 70, 90, 110]}, //------------------------------------------------- 45.Réunion
    TU:         {'sgn': BGa, 'ann':'kph', 'spd':[ 50, 90, 110, 120]}, //---------------------------------------------------- 46.Turkey
    CJ:         {'sgn': BGa, 'ann':'mph', 'spd':[ 25, 30, 50]}, //---------------------------------------------------------- 47.Cayman Island
    MU:         {'sgn': BGa, 'ann':'mph', 'spd':[ 10, 20, 60, 80, 100, 120]}, //-------------------------------------------- 48.Oman
};
// initialize WMESpeedhelperWJCCModification and do some checks
function WMESpeedhelperWJCCModification_bootstrap() {
    WMESpeedhelperWJCCModification_init();
}

function WMESpeedhelperWJCCModification_init() {
    //create the WMESpeedhelperWJCCModification object
    var WMESpeedhelperWJCCModification = {},
        editpanel =  $("#edit-panel"),
        mD = document.createElement("div"),
        mC = document.createElement("div"),
        mI = document.createElement("img"),
        mT = document.createElement("div"),
        cleardiv = document.createElement("div"),
        signsError = document.createElement("div");

    // Check initialisation
    if (typeof Waze == 'undefined' || typeof I18n == 'undefined') {
        setTimeout(WMESpeedhelperWJCCModification_init, 660);
        log('WMESpeedhelperWJCCModification: Waze object unavailable, map still loading');
        return;
    }
    if (editpanel === undefined) {
        setTimeout(WMESpeedhelperWJCCModification_init, 660);
        log('WMESpeedhelperWJCCModification: edit-panel info unavailable, map still loading');
        return;
    }

    // Show friendly message to users of unsupported countries (for now)
    WMESpeedhelperWJCCModification.showMessage = function() {
        // Check if the user hasn't allready asked to hide this message
        if (localStorage.msgHide != 1) {
            // Check if this message isn't allready on screen (bugcheck, can't reproduce myself)
            if (!$("#_cnt").length) {
                mD.id = '_cnt';
                mD.style.cssText = 'margin:5px 0 10px 0;border:1px solid red;padding:5px;border-radius:5px;position:relative';
                mC.style.cssText ='cursor:pointer;width:16px;height:16px;position:absolute;right:3px;top:3px;background-image:url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMTEvMjAvMTVnsXrkAAADTUlEQVQ4jW2TW0xbZQCAv3ODnpYWegEGo1wKwzBcxAs6dONSjGMm3kjmnBqjYqLREE2WLDFTIBmbmmxRpzHy4NPi4zRLfNBlZjjtnCEaOwYDJUDcVqC3UzpWTkt7fp80hvk9f/nePkkIwWb+gA5jMXLQjK50Zc2cuKVp4wlX2UevtAYubnal/waWoTI1N38keu7ck2uTl335ZFJCkpE8XlGob4ibgeZvMl7P8MtdO6/dFohDe/Sn0LdzJ457MuHfUYqLkYtsSIqMJASyIiNv30Gm6+G1zNbqvpf6gqF/AwaUXx+/MDdz6KArH4ujVVRAbgPVroMsQz6P6nJiGUnUGj/pR/tTyx2dtW+11t2UAa5Pz34w//GHLitpsG1wkODp0xQ11GOZJpgmzq5uqo8ew76zAxFPUDJxscwzFR4BkGfh/tj58/3Zq9OoFZU0PHsAd00NnWNj6IEApd3duA48g2nXKenpQSl1oceWsUeuPfdp+M9GZf/zA5+lz3x9lxRbAUli+dIlKnt7Ud1uCk1NJH0+VnMmq6EQfw0NUzCSULBQfT4HVf4iNRO50VlIGSi6jup0sj5zlTO7d9N48iRLa2vkCwWsyTArbx/GAaSBm/MLyLm85OjZs0c2zawQsoRmt5NeXCRyeRLh9rBkGBSEwF6i09h+L96GemyAx2bDK4ENkGRJkbM2fVy4PRhT08RmZvH09VE29C6ixEFuahL3hklLby9PhEKUt7VRZln4kHD669Bqtl6Q7W07jqWL9FQiEkHTdUoGBsgXF5EPh0m8M8Tc62/CSoLSqmqaR4ZxaRpenxfbgw8lCy2Nx5Uv3xuNXEll7shO/HI38Rjr09NImkriyCgOy0JZTZM4+x3C7SY+epTaLZWsdwXJPNV/6jF/9ReSEIKzmcKWpbHPF9OHDxUr6xksoAiQJAmnpuEWAqeq4G9uRr7nPpZeeDG10NqybV+5Ly4DPGJXlsv79u51v38iK22/EwmwACEEIpdD2tjApmncan8A49XX4qtNgeC+cl/8tpm+jxoBY+K3N7I/jj+dvxKuIhZV7KpKWV295dy1K6YEg1/NO2wj+/210f+98R9+hub0wo1BOZnslRVV16orf0hVeD55HH7d7P4N0V1gY9/zcaEAAAAASUVORK5CYII=\');'; 
                mD.appendChild(mC);
                mI.id = '_img';
                mI.style.cssText = 'float:left;margin-right:5px;';
                mI.src = mssimg;
                mT.id = '_text';
                mT.innerHTML = '<b><a href="https://greasyfork.org/en/scripts/13774-wme-speedhelper" target="_blank">WME Speedhelper-WJCC Modification '+VERSION+'</a></b><br>Country missing? Follow <a href="https://greasyfork.org/en/scripts/13774-wme-speedhelper" target="_blank">this</a> link Your country code: <b>'+Waze.model.countries.top.abbr+'</b>';
                mC.onclick = function() {
                    log("clicked");
                    localStorage.msgHide = 1;
                    $('#_cnt').hide('slow');
                };
                cleardiv.id = 'cleardiv';
                cleardiv.style.cssText ='clear:both;margin-bottom:5px;';

                mD.appendChild(mI);
                mD.appendChild(mT);
                mD.appendChild(cleardiv);
                $("div.controls.speed-limit").prepend(mD);
            }
        }
    };

    // The big one...
    WMESpeedhelperWJCCModification.makeSigns = function(reciever) {
        var ABBR =  signConfig[Waze.model.countries.top.abbr];

        // Country code not found? Show user friendly message with info to get his/her country added
        if (typeof ABBR == 'undefined') {
            WMESpeedhelperWJCCModification.showMessage();
            return;
        }

        /*************
        * EDIT PANEL *
        *************/
        // check if we're not adding to existing signs
        if (!$("#signsholder").length) {
            var signsholder = document.createElement("div");
            signsholder.id = 'signsholder';

            //Get the correct list of speedsigns to make
            ABBR.spd.forEach(function(speed) {

                var bgimage = ABBR.sgn[0];
                var allowedspeed = speed;
                var dims = ABBR.sgn[1].split('|');
                var hidden = '';

                //check per speedvalue if we need a special image
                try {
                    if(Array.isArray(speed)) {
                        allowedspeed = speed[0];
                        bgimage = speed[1][0];
                        dims = speed[1][1].split('|');
                        hidden = 'visibility:hidden;';
                    }
                } catch (e) {
                    //
                }

                // The sign background
                var addsign = document.createElement("div");
                addsign.id = 'sign'+allowedspeed;

                // Get width/height of sign background img
                addsign.style.cssText = 'cursor:pointer;float:left;width:'+dims[1]+'px;height:'+dims[0]+'px;background-image: url(\''+ bgimage + '\');';
                addsign.onclick =  function() {
                    if(!$("input[name=fwdMaxSpeed]").prop('disabled') && !$("input[name=revMaxSpeed]").prop('disabled')) {                    
                        $("input[name=fwdMaxSpeed]").val(allowedspeed).change();
                        $("input[name=revMaxSpeed]").val(allowedspeed).change();

                        // Check the verified boxes if the user allready has them.
                        if ($("#fwdMaxSpeedUnverifiedCheckbox")) $("#fwdMaxSpeedUnverifiedCheckbox").prop( "checked", true );
                        if ($("#revMaxSpeedUnverifiedCheckbox")) $("#revMaxSpeedUnverifiedCheckbox").prop( "checked", true );
                    }
                };

                // The speed value
                var speedvalue = document.createElement("div");
                speedvalue.id = 'spd_'+ allowedspeed;
                speedvalue.style.cssText = 'text-align:center;margin-top:'+dims[2]+'px;font-size:10px;font-family:\'Varela Round\',sans-serif;color:#000; font-weight:bold;visibility:'+dims[3];
                speedvalue.innerHTML = allowedspeed;
                addsign.appendChild(speedvalue);
                signsholder.appendChild(addsign);
            });

            // CSS Clear after the floats
            var cleardiv = document.createElement("div");
            cleardiv.style.cssText ='clear:both;margin-bottom:5px;';

            // Add everything to the stage
            signsholder.appendChild(cleardiv);
            $("div.controls.speed-limit").prepend(signsholder);

            // Lock warning (0.4.8)
            signsError.id = 'signsError';
            signsError.style.cssText = 'background:url(' + warningimg + ') no-repeat left center;border:1px solid #EBCCD1;background-color:#F2DEDE;color:#AC4947;font-weight:bold;font-size:80%;border-radius:5px;padding:10px 5px 10px 45px;margin:8px 0;';
            signsError.innerHTML = 'One or more segments in your selection are disabled or above your editor level.';

            if($("input[name=fwdMaxSpeed]").prop('disabled') || $("input[name=revMaxSpeed]").prop('disabled')) {
                $('#signsholder').append(signsError);
            }

            log('ready');

            /*****************
            * SETTINGS PANEL *
            *****************/
            var _gear = document.createElement("span");
            _gear.onclick = function() {
                $('#_spanel').toggle('fast');
            };
            _gear.style.cssText = 'cursor:pointer;float:right;background-image:url("'+settingsimg+'");width:12px;height:12px;';
            _gear.title = "Settings";

            var _spanel = document.createElement("div");
            _spanel.id = "_spanel";
            _spanel.style.cssText = "margin-top:5px;padding:5px;display:none;clear:both;border:1px solid #999;border-radius:5px;";
            $("div.controls.speed-limit").append(_spanel);
            $(_spanel).html('<p>Reserved for future updates</p>');

            // Clearfields 
            var _clear = document.createElement("span");
            _clear.title = "Clear values";
            _clear.onclick = function() {
                if(!$("input[name=fwdMaxSpeed]").prop('disabled') && !$("input[name=revMaxSpeed]").prop('disabled')) {
                    $("input[name=fwdMaxSpeed]").val('').change();
                    $("input[name=revMaxSpeed]").val('').change();
                }
            };
            _clear.style.cssText = 'cursor:pointer;float:right;background-image:url("'+ clearimg +'");width:12px;height:12px;';
            $("label:contains('Speed limit')").html('<span style="float:left">Speed limit</span>').append(_gear).append(_clear);
        }
    };

    function log(message) {
        if (typeof message === 'string') {
            console.log('WMESpeedhelperWJCCModification-WJCCModification: ' + message);
        } else {
            console.log('WMESpeedhelperWJCCModification-WJCCModification: ', message);
        }
    }

    // check for changes in the edit-panel
    var speedlimitsObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Mutation is a NodeList and doesn't support forEach like an array
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                var addedNode = mutation.addedNodes[i];

                // Only fire up if it's a node
                if (addedNode.nodeType === Node.ELEMENT_NODE) {
                    var speedlimitDiv = addedNode.querySelector('div.controls.speed-limit');

                    if (speedlimitDiv) {
                        WMESpeedhelperWJCCModification.makeSigns(speedlimitDiv);
                    }
                }
            }
        });
    });
    speedlimitsObserver.observe(document.getElementById('edit-panel'), { childList: true, subtree: true });

    // Catch permalinks
    WMESpeedhelperWJCCModification.makeSigns();
}

setTimeout(WMESpeedhelperWJCCModification_bootstrap, 3000);