// ==UserScript==
// @name         Call for Nano
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  自动发送Nanoなの☆エボリューション应援歌词
// @author       ADDD
// @include      /https?:\/\/live\.bilibili\.com\/?\??.*/
// @include      /https?:\/\/live\.bilibili\.com\/\d+\??.*/
// @include      /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min.js
// @require      https://cdn.staticfile.org/axios/0.27.2/axios.min.js
// @grant        none
// @license      MIT
// @icon         https://i0.hdslb.com/bfs/garb/d926ea632254c7dff67f7cbf59a0a9eaaf74bb1b.png
// @downloadURL https://update.greasyfork.org/scripts/447922/Call%20for%20Nano.user.js
// @updateURL https://update.greasyfork.org/scripts/447922/Call%20for%20Nano.meta.js
// ==/UserScript==

(function() {
    // 歌曲来源 https://shiinanoha.com/archives/10936 - 菜の花字幕组
    const AUDIO_SRC = "https://shiinanoha.com/wp-content/uploads/2022/07/Nano%E3%81%AA%E3%81%AE%E2%98%86%E3%82%A8%E3%83%9C%E3%83%AA%E3%83%A5%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3.mp3";

    // 打Call图片
    const IMAGE_SRC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKIAAACiCAMAAAD1LOYpAAAC/VBMVEUAAAAuJjIuJjIbCyEtJTEtJTItJTEwKDQoHywtJjIuJjIbGyUsJTEuJTIvJzMuJjEqIjAqHSpANjcyKTQuJjItJTEtJTEzKzYtJTEtJTEtJjItJTEsJDAoISouJjItJTEtJDAsJDArIy8yKjY3LzstJTE9NkEsJTAsJTEsJDA0KzMtJTEsJTEsJC8qHy4tJTEsIS4yKjYtJTFgWmM5MDUsJDArIzBSRz5KR13/5nL2pq////97gpfdY29UWmwuJjIvJzNJRlz///wwKDX/6HUxKTYxKjc2MD//6XozLDoyKzhIRVr//vf/6oFFQVVDP1M4MkH//fJHQ1n/6X40LTv/6HdCPVE/Okw7NUb9/f1FQldAPE81Lj3//vn/64Q9OEo5NET/7Iv/64c8Nkj6+vr//vT//O3//e//7ZDaYm41LDczKTT//Or/+uD/++RRSF42Ljr29vdXXXBsTWHp6OpnbH84MDx4fpN1e5BhZ3r/98n233Dt7O7Z2Nv/+dn/+NJcYnRBOkU8NEDx8fKCiZx9hJiWkpdyeIz643G3XGp3T2JFPkjk4+bd3eFlX2hJQky1srWfnKH/7pv/7pb/7ZONVGVOR1BPO0dqXUTNy87/8qz/76BudIlqZW1WSV5aU12ol1dRS1RiVkJIPjvT0tb/9cDWYW7GXmzq1GvYw2ZkTGCEdkz/++j/9Lr/87Wrqa+KkKGGgYdrcoaCfYR9eIBwa3LlzmqUVWZ+UWNeSl60olt8bklOQzw/MTz/++fFyNHIxsm7uLyeo7KSl6fonab/8KXTYW7QYG3NYG3JX2zKt2aHUmNFPEJYTEBHNEA6MDbAvsGwtcHfl6F7dn3w2W3BXWurWWmcVWVQUF9VT1hGQ1JYQExcUUDvoaqmo6iNipGLh427gIqkcnyjWGhXVmjRvGTBrl9tTlloSlabi1ORgVC9wMuin6T95XGEXGfGh5GveIJ4c3uTZ3HfymhRUmSMfk9zZUb/++amo6TRjpja1sDVkZrWy5n25IlxPUqOuBDOAAAAOHRSTlMA+PsF/PTo/BPx1Ql/7f3eIQz99ePDsPC6kM+JQg/aoGVdLfv4tP12bk/4mFQ1Gckn6af9+Ek6/rYOZ1IAABdCSURBVHja7FpZTFRXGL6zsg7LDIsssg2LQkvZlNvcmHtnhplxZmDYBpB9m7KvgfgAIgETQ6WK4BLUKG64Q9OouKbRB2vdoolLY9JoE6OJpn1oGtukTz3nXph7QIa5hgHmod/zJOeb//zf9y/nYv/DvhDER6z/IizGfa0Ac0R4B8f4Bfr4y+T9kf4hEZjjYX2Ap4jnJO/fv+vS8O0Dye7OmIMhIclfLu9/efF2z7bS0tL09MuJazDHQrxEPnT51U6zErD7Jhtgu9zXwbIxgR/dWUgolYBfTU1Tc9fkfSexg2WjQNRWSBDK9OymreMjdVUZGd1SXhjmUBCI1VsIZWnLwb2VZRm5uRvz8h7xV2GOBVeqBwSxua6yDPBLS0v7+r2HjxfmUIijdgOKNYBhXtrXEGcbRV9gDoUvPH6DFPdmbAQMIbqlwjjMoeDFOwwpHioDFBmMUiGYQ2G17BigWDvBUrzuIXKwZPQZIojS7N6q3BmKU4+FDlZgAqPbAcWWqty8aYoDv5JRmEMhKvIkofymqS4DUGTwkRJjDoWgyN2AYs0IlDSD+408t9n5Gr4mYiUL99rI7VDSk6xezkjJWc7onRQok/iuWbkmLd7/KZR0F6uXgVHSD0OQlGjIzBKJPINWSugCz10EkZ7dzOiFsR3SE2MRJirGcbwoi8fziVshkr4vC6GkK1m9vG0UIYkoLsFpZGqdeD5Bq7EVgN+gmVBmN+1h9XJWymfDFcoz4gwUxTo+LyRsBYQTEN0JXecgopdU1rwTXEpwCwybVEKe75fYcmNN5BMo6XFULx4WvaziZ+IIirQUX+LujS0v1vn/DvRSu7WKTcYPTq6WLkOjwFEo8nXLH0gv/x+IOXp591jiNp2owmqGGnrbGr44Zlkz0i3xcCHUSx2bjH+d4DFxWi3hG/BPYNR68PyW08kFrmNmWALvsBS7H/HdmTwVavF5oCinhIHLedmrhsxQLxO0XhjccIpiJhthMT4vMtV8z7XYsiE0egssgb1IfTka6ypgxTIfjHq+OM4NWya4R96CemlG9HJf6gNzLYifhVuDUceX+K7//LRyXh/uHhCaFLXKNTEwNIaj7MIjhwmol0q2vkzddAmGWeqRjy/A0UPi+RkWKfAKD/L7ylMskbiIRDK5XGfS+vtIwrgtTYDrzBmxuo/LgjDsSxeNAbeOIpOHSBIqwLwj4GLSPSZsbYS3wIprrAsNFLu4yGRybUV1QX6RQaFQ0LpLTOI2YQHXgck4Wcbq5XysH8gAnhZfCDlZGj7vK1exiMcXUpSQz+eLxK5RMXPa39Xr4lxFfL6TrqLASBNDkRXCzRhDXpphMs7SS0qgm7cvr3xBisYKDaVy4vHVao1er9eo1RRFkSQp5Pn4TS97BcFxITyh0ENXkTm/7ioknPxV4Du4DSZjc1XGRlQv6z2dinDryNRq1KaK/GJwb5bjDZkFm0o0kKfINzw+ODREJCRVpgLr6VIt4mavSdHfEcC85+pljVinsB5BrUaTZSU0ipxqnQreOwiwttiAL4Byp7UcJ6wnBEzGkVl6cQ9ysWo5igKdviIHXwCKYhO4dk2xAl8QBaJwjq6znYDJCFpGtr7ERoWKyq1esgkQtIWiCjWly7f6F6rLC4ozy124rRUi/J/SFLvKZtWXVbwiqzEy4hwAmyJ1hcFKddLrdA1tbZSPX0ywbXN1TtxlhsnYDCiyehEHyg34YlGk1WiL5vOr6rEDt4cv7RpUaZycRJ4BtsqUt+v+dtq8EUmfudkgL1Hgi4aiuERrnEcmpssEQGHP8PDFl/1yuX9Sgg3XAeMLnFSREav7VxVVgdsDhk3azE+Im/TbCZqj2UyYd766PCSXxC/c60SepJPxTgaiF4oswO2D/E/CaFTpb4F7g08p6aWlSmVhZzQ/wUav8z0Bk7ELKYFHKdKILxXKVdHbwCtA9oXa2trsb9JLlYVtIsHCex3ZRZriVlQvjWQOvlQoUY/B5O+qqxuZ6G0BJLeoxQIbE9Zh+vXlAqqXxqWLYo5GDXdd2XfASwpA5cj4v5SrDdfxfElLuraOTcaBE1Q+vkQophp64LhUB15SaORdJ+Ns9DqBfVvoN6xDqF5U1fgSIYvsg6th2LekMfjoYeslxS+yh5b0OFICjzZq8SWChjo8PS1Znin4XrZXtYxeEEm/fWxSTLuvnZOyiFLDzTC6dk2V2Vq5hcl+gBTTW5CudkqqoSVtKFFtsrPlkP3fEcBxRlhxnvCx3Ugwkq5FpsDuVLURMjRRWQr7UtRSY2awRWphnwC6pYE2t8mJY+0E9NIRRC+jaihpLQnu275QUa9BOJq2svE4mxKF2Wwk+jppvUwiFM83VsNLURvszNBAgeqnzP6xi6V4PTaIw+tLD62XXkTS1xuzcCNF2tUdFeX5wBWjO+EqbqIyY+asDzLb80EAI+l0tGV826hX6Mgs3K4o0eRoKdCelta2HKq02McN/3ibFMNiGUnXoJJuUFXb/ZozVWCyBeFIr2neg9iip8D2bCBKZr6R2MsawTMpRV+zvcNINZyk1bK3zHJUqi9mE86SwXZmxEKq9E2SnCkwrfYLo5rsgwW6qavOQnFA6sdhI+HZ1sm0jIikj5MkM3ccubvh1D57CUZHHesEgr4wzgp6KiWAyx5Uc6twbgn8SKpwGg82ANQ/sE8oTUAtgGLLHVYt71K4jKoBTq/pfqwJHVRnKF7dQKPeLpHUq38joKBHqiz39d5/HZdx3yO5c7pltFA8S5EG5qLvbWBwasfiL1q1+TYtaEQt5/29OH2ZNUj3Y2jLONVoEfSbDdO417Fo1xncCSn2IrEYTeSykvYWbX4C9ZI9wVJ89pi0dLXXvp0h+e21RVGsVo21w4RCyt/AI1dO+2SxfpgpgYjrpJJIV9txeppj/ZVFtTnqPwn6zZFVy8AJbt+AfaV6StAjFqKX46QOR3DuzSmG5M/XFuE5bb8TsIk4xNaWM9JQbhs8j2QCALSMLMUbpGpOI/agniF55bMbtGsdO47A4U8dfQAKunkvK+j7Ke7cvsziD5lpvezJ3ciO+9TcnVHrOSYpn3+GSbbu+LZ+xg/y9fu/g2rZWscK+n0styVjAq9/C52Mk7mWv/eWouZZmuygOZ5u5UbvKpPCTIK04pv0ye1M+UM9J4ETRWcXfQ+djF0sxWcN1Hxjy5Gf4HkcfHzHPRA9BHdbFdq2izAV/5lkBf3HaCLHzxl8KHqxU/oPTZGBlGIljaiGPvjFwtF78Jyhh+IqbtBFvwKH1ILyl5Fm8ZwQN46vldQlgnbG3DwLxZuUbu7R++5azrOKcy9Yeiyed+CA4iCjlj2s53RLuX5hHEON0RSVGWlsr9OoUaA3fOVny4G/WGfYMZdc/b0X+zpA7iJqQQQ9lZKEcUOwcJCgOR6yMPzj/GN1ERvAF0hWncOt4zn7u1OnAbkjSG1pSG4HFJt6EbW8Swni/LHlZoLGBB39s0fPjz7aL1UVzyjzHqLMhQs1Y0s/Pb/CRA6Ftu0SbdzjdWV5Fs+RhXOk6CbWg/pu3rZz94e/j6eeePjw4bE/d18mmW3yPuTaTtvqJM5N2/s886lu8ytIseUgslO4IYvg+BYLutqxsf1DQ0N9/X3Hdj3dfruTaN/5mjKxVghR/4a9YlvJWD+7dUNqS8sIUqGPJzpzi+F/xZx3bBtVHMc5x0kIkBTEakLKVFkFipinJOT3Tk931p0l+3Sy7POQYpGAFAckE2ongSKSNIOKlk3DCKCyJUbLEjNitGIICFBWadkUyt5CIIZ457N97+x3lxAb9fdHpEhx/PXv3uf9xvs977PbAWjkyocefmBi4sPX155H/Llmw2QmA6L16OwO1IKRLuN0RxOEcj/msb+zxOFBad0KE+gzLaCf2mO+h9pHeSFLaoMosZ5Va54eH+rv7ByeREgoVAZ3vnsz3Tviaj1eACxiJMo+Pa7ZhT6a/1DP2zzZRWKLGf4soO+e955zvAeATMr3vDE2NjY+3tEx3Emsf0CEQG4tvvS2/akF6vdoPmk5B+lsqq8PGSbKSfpI8ubVxdzNgkZVCC0l4e/zUw6Z57WcRtAReqY9+nSHaUOdhg2GoItdJMFeu9UsRjMftG354dPvd26fSWEAQHKc2uVfKoh8Ny9SCKU3GLTcS3ol1FHeXvOMLSAKElxJzpPGTYkP5iRORsDH7mLC8j2P8vb90FawzZ9sBy8AKF2CFaN7CyJfNoGWRgktdPVH7B6rn+Nqp3ohyPuAnHqtGDMlDuYkPvgrKKvvMiAt7WLO7Lusrv7TNso2Z/c7ZikH4KMcWSwnnjf+QUy83KDl7HOvIrQUkwirtnK/sAEJno/Auvb28zZ1mJaTmMmgvjNW8/y7vXaNPvT91BH7/txms537Hrrb0RxgW7LzgpVDkPB3ck+u+qNoufDV/XafF82AYgQBIDPePc/lJfYbEocGUN+d5J16ny9pqONPfviSKLTZJ8e2HNSAANnZfiwvspeEP5MWOvyRzlHLfPKcJQ25Hp2G0ivbo2+YCk2khwckRNbRZ6V5De7b3FZmm6fqufrZ8oO5a3vzEn0ps26heiWkQXvAvOadAGkGcAittZDOmLuOD0XKnciL2TaG/Tg78/0fIsTLksd3ichHCdDZ242N2wp/dIPWPbI05COxgkgtXUB6utOwgTBx8LWlKbaQmm1j2ZYtbW0z0M0qX8ha1qSRNbmleCMN9LGHzmdUFZCWh4C0W9bkJQ6Yu86vIPMv9vKlEqfanGwKdKepFHF9LhOzwh+x6+aVRDQWusU6kEJ11RiN9PQQiPydq/+DxC8h6XQurdwUzdFyjQ3oE2wh5JhlpzLKUygs8DBaF23v2UgjnZnESCjLvgTFWeJOxJR4vgH0AzlaLrA6TiRC00lEzWF7NB7YWL6VLyr2HALoSIL0c3QIHBoUkVbeUxBnPnD0IrNqfIdsrKqyIVda3U933+gTl9blnEfvgsbW0mzbW0RQwylSqH5jRzrE6nfLqT+cJG5nRfXHe18krhdzQJ9LVX8E6OaikP293lCAF3ze5SWpzyFWV0SQRYL07XmJkybSOust9dTPThJnEWO49a4zHue1vvQa+qjADnTNQbWAc/HdL3N2N+5TByoV1z4iUbqDRnpwG+voJZja7vCkt6SQn1EqrCae7DPG5846h6r+SI3JmUC37gfgy78w6FlqzxO9EKSafzeRKG1DenIrhBgNLl/6R7bET7GP4cTem0mcR+t6DFroZPHC23LTgXue5AUlaHXP6mxhey+6+xXG68nczCY6BE73g8Sz3Di1hb0UcZAvs+eJE1/8By7L0XIfRcvdqUUkQp9WB0gX6JFBejuvaaGTp5h46YoSpDMZjJnDkakvN7Oc2Bdide5IfOmdhY9zmdgNFi3ffdG3eLeaZg6UmO3zexbXUBI5GlhBGl1jIE1ltcOTEhZY56GJ9M5yjZ+kRKcRgJsxbMjRQlV/F37d1Lx7i+lCyvwKnaAdb8+dEunrS5DuH1DZ76olUlOf2pnZsrMPOw4U+gGRPYccrF1NlVa3Nu3VCDhYttJrT6O3HMW2maSvIFG6g+ZlQJXi7PdMinjmyx///CBfGHy/PY2Q81RKGFLGxZp7SbJIXf4BjnUkr3NU+rOfPS8JZ0lTfmUHHQIHQyjidECRELGYnpmdmpqdeiUrilIy5nJUAKOrjLrlDoqWLxCIEdY/rqcWIwcB+yog1PXYJO6QcJh3nrWM6KqaVEkhHQ5q7kcFsL6nNFn8CoD5Iq3+4OJi3L0kjY9BlrSTxy2kf+2SkBrjq2AyXBYtTRZ/QyGHc4WGw60sB9s9DIg86Y254DKY2ZpMKKKia0IVFAoY3iRLkaKF2PtId3B5bTHdaYZESesKZT9+ZnDrtohK1CFQ1HBF+oKqIkqyqsf9MYR+N6p8urQic2lsEgkvxfp/aWmOEJRFPDoqyyE5oeoKJCtynC5BwZAE+HqaFvMEDznsohErTC+CGB9XELbmXf0BMu6umfcUQuCrZO6KqMKyHun2KRghjNKrCC10bCHfC4D8Dt73FBOyBtDMT4pZHk9AogIfJsEnWB/cJ46YpdWZ9KSp6PTxmhYV6gUPlsBzwKnNXlD9VZbIS1ijgUbrymh5EiUchzDrTixKRC1LzCJQYHBVyYMOIPrFgiReZmRiF1N1CwGaJsGObcPxhQfdcEiN2dQxuBGEEomV4KLaaI2J2YeihJYLTFpMu815xibEFWYu91+cf+QHAeZjqupT9aBASexa+FJUbFNIcTyy/pabHvj9r78JLQV7DWmOH5A7ulBzFeLMiV7wITAMKXGhWCdEFs4zlm3pJXrkip/WX3rpK6+cfutvXz/xy1uXkBuRfdhx001yzYVeCdW+M0ySEAAqXAsIofjC583tBULImMKKrnh24s3L1o+MvnLpU7c99f77fc40dnPLysdpgduLUwReiyRwfgsSFBRc+N0C0RbbRHx7e3Ttc9+sXbnyome/nZh44OGHrrwNOa+jCFfeMGs9+LhjPFI+wgAKmuPX2oIlRqQI/SsSV+aabuNjYxs3jW/ctGnj2KYUOHsgzvjOnD1ba47zKvldSQbjel1AIj8XarpEx7YApKPF1mWm07D+QYT8zsGd2591fHWcVy78AYJu8lOUFy5RtQHdBSPtxdJyOCdxKIOQ4CzR01LDGmIE2UqRsUAk+hae5vgUgf4NTrYK9H6z078DJJeNn2vZhyXRKur9IkT4eCXT0iGZlqjABCk4xqmziM7JbW6xK+g5eAlrbowKyRHi0SQOVzCPY6uaMCKV5UV0+7dzIMm4UEOfju3OOnwBHxUcUEyugBZB8dmAxue1R/P1+VBeogwBF4lW9WJv7ySoBY50XEESIUg+W72RjRa7HP15oDFoLsGpnmRj5Xa4VxboJ4XjFUgUVXojhsuL7d+BThPoaUCCixcx04t7e2kKI0olN9j8Nokq3GQ00emlmBlCilsq18T04hJOFOhmQ4CvQKKUtOWzE8WjiIwpcXqrazIaY+NSU0tnHkJFE92aSEsUMbmw9jS9cXcORkB386JnD+YIVF2TbQFXJlGlgVZWFMNffx5oFcK8G9HscQTrbn7F5scqpRdlVxGgaVr6J2UUcHvQ3HLm6eVST1e1JAoSJTFM7loVgB7MS3wQY83NixypUhm2zKv+LxK74L1oAegHTYnDQ0gWXCUuZp+oehLVk+ijKy0yLrB2nI4tGXeg+TC3lD3czSlVk6hQMTqEPioFenqb1S1lZ92HsAdhGrBWLYky9RwlvKEIdKdpg6PIFc0urpk9CVPXFKyWxAQVqbByPQHaRstkFrt2LZOcw2jMwd541a6piQI1s7+CAG2jZVqWXMOr6vQ9A/t79GpJVHHAupdPhp1X2WgZyojuZCZqW9kSmz1Vu1HXjSIFhbJ4OQHaRktmWHJ1hhAinWSmncpJ1eIljJJ5NjHCI9EC0P15oHcorrT45TqHAaMljVULgf58Yy6OkIrTG3pKgI643zvT6hc5DRjt4dWrtnfneIlh6I6pKP3QmB1oCVyBjtWT+Me2Q7y+ai3GBNKMNQUhQdB0JRXq3rYjM1gAegdA0D24kH6J42IMVEmibvASzs/XCGE1IUlKKBRSkxH/1m0SyH73nXuZ88xvU6RKEoNGl1a2mqiCFtfVhCxLoiIiLLvHiKTL16/s700KVVqMWOS10raNIHTpwVg4EvDPEZtqT3O++ekJVWvbCaFAFyTKLzZ1z2M7UOr2drmwgYNV27x1X/mIWwRbql32HJJzO9pib0SoVm0gy+XtuYAkzg1kuN4CmpUzVm3b8WFFYgwsoLmB1LmjXG+nevzVYlpUfIxL3FJw7kzO/VupmqtXY6khhpqAqs1NCxnHc7G9GyShWnHaz2Rhbvd75hiYP8kT53etdTul3NaXqIb4XWpCouG0uS4ic0F+V1qMI01kd1tysMrvGqNzCHdrXbQrVyMpCqy65V/o+lXh+RDxAwAAAABJRU5ErkJggg==";

    // Nano用户Id
    const NANO_UID = 623441612;

    // Nano直播间Id
    const NANO_ROOM_ID = 22347054;

    // 弹幕间隔时间
    const INTERVAL = 1000;

    // 原曲歌词
    const ORIGIN_LYRICS = [
        { time:"00:00.00", content:""},
        { time:"00:02.32", content:"Nanoなの☆はい！"},
        { time:"00:14.54", content:"ぐるぐる迷路 地図片手に"},
        { time:"00:20.67", content:"指差し確認して 準備OK"},
        { time:"00:26.25", content:"朝まで解いた宿題持って"},
        { time:"00:30.76", content:"今日もいってきます(いってきまーす)"},
        { time:"00:36.69", content:"天気予報土砂降り雨でも"},
        { time:"00:42.31", content:"傘なんていらない！いっせーのでJump！"},
        { time:"00:47.52", content:"背伸びしても届かないなら"},
        { time:"00:53.47", content:"お空目指して 羽ばたこう"},
        { time:"00:59.02", content:"謎々だらけ この地球を"},
        { time:"01:04.61", content:"ぐるっと一回り"},
        { time:"01:10.15", content:"小っちゃくても大きいハートで"},
        { time:"01:12.70", content:"あなたの一番になりたいから"},
        { time:"01:15.57", content:"私のプログレス ずっと見ていて"},
        { time:"01:18.96", content:"やっぱり君なの Nanoなの☆yeah！"},
        { time:"01:32.64", content:"大きめブラシふんわりチーク"},
        { time:"01:38.83", content:"赤いマニキュア フリルのスカート"},
        { time:"01:44.36", content:"鏡の私とウインク練習"},
        { time:"01:48.92", content:"上手にできるかな？"},
        { time:"01:54.84", content:"あれもこれも 過ぎてく時間に"},
        { time:"02:00.47", content:"待って待って追いかけてjump！"},
        { time:"02:05.64", content:"あなたの瞳に小さくても"},
        { time:"02:11.59", content:"私可愛く映っていますか？"},
        { time:"02:17.16", content:"昨日の涙拭ったら"},
        { time:"02:22.75", content:"明日を迎えに行くの"},
        { time:"02:28.32", content:"小っちゃくても大きいハートで"},
        { time:"02:30.92", content:"あなたの一番でいられるなら"},
        { time:"02:33.75", content:"楽しいことは10億倍 やっぱり君なの"},
        { time:"03:01.46", content:"こんなに小さな声でも"},
        { time:"03:07.43", content:"見つけてくれてありがとう"},
        { time:"03:12.94", content:"これからもずっとずっと"},
        { time:"03:18.54", content:"そばにいてくれますか？"},
        { time:"03:26.54", content:"背伸びしても届かないなら"},
        { time:"03:32.52", content:"お空目指して 羽ばたこう"},
        { time:"03:38.11", content:"謎々だらけ この地球を"},
        { time:"03:43.71", content:"ぐるっと一回り"},
        { time:"03:49.27", content:"小っちゃくても大きいハートで"},
        { time:"03:51.94", content:"あなたの一番になりたいから"},
        { time:"03:54.66", content:"私のプログレス ずっと見ていて"},
        { time:"03:58.04", content:"やっぱり君なの Nanoなの☆yeah！"},
        { time:"04:12.14", content:"Nanoなの☆"},
    ];

    // 打call歌词
    const CHEER_LYRICS = [
        { mode: [], time: "00:00.00", content: "" },
        { mode: [1], time: "00:03.18", content: "嗨！" },
        { mode: [2], time: "00:03.58", content: "wu oi!wu oi!wu oi!wu oi!" }, // ウーオイ！ウーオイ！ウーオイ！ウーオイ！  // 过长
        { mode: [3], time: "00:06.36", content: "a～👏👏sha-ikuzo!" }, // あーーよっしゃいくぞー！
        { mode: [1, 2], time: "00:09.49", content: "tiger fire cyber fiber" }, // タイガー！ファイヤー！サイバー！ファイバー！ // 过长
        { mode: [3], time: "00:12.25", content: "diver viber jia-jia-!" }, // ダイバー！バイバー！ジャージャー！ // 过长
        { mode: [1, 2], time: "00:19.27", content: "nanoha-!" },
        { mode: [3], time: "00:23.13", content: "cho-zetu kawaii nanoha-!" }, // 问就是 「超絶可愛い なのはー！」 有b站屏蔽词 // 过长
        { mode: [1, 3], time: "00:30.41", content: "nanoha-!" },
        { mode: [2], time: "00:34.26", content: "cho-zetu kawaii nanoha-!" }, // 问就是 「超絶可愛い なのはー！」 有b站屏蔽词 // 过长
        { mode: [1, 3], time: "00:37.05", content: "na-noha! na-noha!" },
        { mode: [2], time: "00:39.85", content: "na-noha! na-noha!" }, // 频率过快
        { mode: [2, 3], time: "00:45.76", content: "yeah tiger faibo wiper" }, // タイガー！ファイボー！ワイパー！ // 过长
        { mode: [1], time: "00:49.48", content: "Ah-fufu-!" },
        { mode: [2], time: "00:52.43", content: "👏👏 fuwafuwa!" },
        { mode: [1], time: "00:55.58", content: "嗨 se-no!" },
        { mode: [3], time: "00:56.57", content: "嗨～嗨！嗨嗨嗨嗨" },
        { mode: [2], time: "01:00.64", content: "Ah-fufu-!" },
        { mode: [1, 3], time: "01:03.46", content: "👏👏 fuwafuwa!" },
        { mode: [1, 2, 3], time: "01:10.56", content: "喔～嗨！喔～嗨！喔～嗨！喔～嗨！" },
        { mode: [1], time: "01:21.33", content: "嗨！" },
        { mode: [2], time: "01:21.75", content: "wu oi!wu oi!wu oi!wu oi!" }, // ウーオイ！ウーオイ！ウーオイ！ウーオイ！ // 过长
        { mode: [3], time: "01:24.49", content: "a～👏👏sha-ikuzo!" },
        { mode: [2, 3], time: "01:27.64", content: "tora hi jinzou seni" }, // 问就是 「(se)ni 」是b站屏蔽词 // 虎（とら）、火（ひ）、人造（じんぞう）、繊维（せんい）
        { mode: [1], time: "01:30.42", content: "ama shindou kasse-n!" }, // 海女（あま）、振动（しんどう）、化繊飞除去（かせんとびじょきょ）
        { mode: [2, 3], time: "01:37.39", content: "nanoha-!" }, // なのはー！
        { mode: [1], time: "01:41.25", content: "cho-zetu kawaii nanoha-!" }, // 问就是 「超絶可愛い なのはー！」 有b站屏蔽词 // 过长
        { mode: [1, 3], time: "01:48.58", content: "nanoha-!" }, // なのはー！
        { mode: [2], time: "01:52.41", content: "cho-zetu kawaii nanoha-!" }, // 问就是 「超絶可愛い なのはー！」 有b站屏蔽词 // 过长
        { mode: [1, 2], time: "02:03.92", content: "yeah tiger faibo wiper" }, // 过长
        { mode: [3], time: "02:07.61", content: "Ah-fufu-!" },
        { mode: [1, 2], time: "02:10.56", content: "👏👏 fuwafuwa!" },
        { mode: [3], time: "02:13.71", content: "嗨 se-no!" },
        { mode: [1, 2], time: "02:14.75", content: "嗨～嗨！嗨嗨嗨嗨" },
        { mode: [3], time: "02:18.76", content: "Ah-fufu-!" },
        { mode: [1, 2], time: "02:21.74", content: "👏👏 fuwafuwa!" },
        { mode: [1, 2, 3], time: "02:28.71", content: "喔～嗨！喔～嗨！喔～嗨！喔～嗨！" },
        { mode: [2, 3], time: "02:39.87", content: "iitai kotoga arundayo" }, // 言いたいことがあるんだよ！ // 过长
        { mode: [1], time: "02:42.60", content: "yappari nanohawa kawaiiyo" }, // やっぱりなのははかわいいよ！ // 过长
        { mode: [3], time: "02:45.46", content: "suki suki daisuki yappa suki" }, // すきすき大好き！やっぱ好き！ // 过长
        { mode: [1], time: "02:48.22", content: "yatto mituketa ohimesama" }, // 问就是 「やっと見つけたお姫様！」 有b站屏蔽词 // 过长
        { mode: [2], time: "02:50.96", content: "orega umarete kitariyuu" }, // 俺が生まれてきた理由！ // 过长
        { mode: [3], time: "02:53.80", content: "sorewa nanohani deautame" }, // 问就是 「それはなのはに出会うため！」 有b站屏蔽词 // 过长
        { mode: [1, 2], time: "02:56.56", content: "oreto Isshoni jinsei ayumou" }, // 问就是 jin(se)i 是b站屏蔽词 俺と一緒に人生歩もう // 过长
        { mode: [3], time: "02:59.32", content: "sekaide itiban aishiteru-!" }, // 世界で一番愛してる！ // 过长
        { mode: [2, 3], time: "03:24.53", content: "👏👏👏👏" },
        { mode: [1], time: "03:27.31", content: "👏～👏～👏～👏～" },
        { mode: [3], time: "03:34.57", content: "嗨 se-no!" },
        { mode: [1], time: "03:35.63", content: "嗨～嗨！嗨嗨嗨嗨" },
        { mode: [2], time: "03:39.69", content: "Ah-fufu-!" },
        { mode: [1, 3], time: "03:42.72", content: "👏👏 fuwafuwa!" },
        { mode: [1, 3], time: "03:49.64", content: "喔～嗨！喔～嗨！喔～嗨！喔～嗨！" },
        { mode: [2], time: "03:50.64", content: "👏👏👏👏*4" },
        { mode: [3], time: "04:00.42", content: "嗨！" },
        { mode: [1], time: "04:00.80", content: "wu oi!wu oi!wu oi!wu oi!" }, // ウーオイ！ウーオイ！ウーオイ！ウーオイ！ // 过长
        { mode: [2], time: "04:03.60", content: "wu oi!wu oi!wu oi!wu oi!" }, // ウーオイ！ウーオイ！ウーオイ！ウーオイ！ // 过长
        { mode: [1, 3], time: "04:06.36", content: "wu oi!wu oi!wu oi!wu oi!" }, // ウーオイ！ウーオイ！ウーオイ！ウーオイ！ // 过长
        { mode: [1, 2, 3], time: "04:13.42", content: "foo-!" },
    ];

    // 布局设置
    const setup = () => {
        $(".player-section").append(
            `<style>
      #call-container {
        position: absolute;
        left: 10%;
        top: 10%;
        color: white;
        font-size: 1.2rem;
        font-family: "微软雅黑";
      }

      #call-img-container {
        position: absolute;
      }

      #action-container {
        position: absolute;
        width: 440px;
        background-color: #333;
        margin: auto;
        opacity: 0.9;
      }

      #lyric-content {
        width: 440px;
        height: 480px;
        overflow: hidden;
        position: relative;
        opacity: 0.9;
      }

      #action-bar {
        display: flex;
        flex-direction: row;
        margin: 14px;
        align-items: center;
      }

      #button-group {
        display: flex;
        height: 54px;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-around;
      }

      #button-group button {
        display: flex;
        color: black;
        font-size: 0.8rem;
      }

      #audio-container {
        display: flex;
      }

      #audio-container audio {
        display: flex;
        height: 30px;
      }

      #call-img {
        width: 50px;
        height: 50px;
        border-radius: 10px;
      }

      #lyric-content ul {
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        list-style: none;
      }

      .original {
        height: 30px;
        line-height: 30px;
        text-align: left;
        padding-left: 30px;
      }

      .original.active {
        color: #2ecc71;
        font-weight: bold;
        font-size: 20px;
      }

      .cheerful {
        height: 30px;
        line-height: 30px;
        text-align: right;
        padding-right: 30px;
      }

      .cheerful.active {
        color: #f35858;
        font-weight: bold;
        font-size: 20px;
      }
      </style>

      <div id="call-container">
        <div id="call-img-container">
          <img id="call-img" />
        </div>
        <div id="action-container">
          <div id="lyric-content"></div>
          <div id="action-bar">
            <div id="button-group">
              <button id="mode">模式1</button>
              <button id="call">点我打Call</button>
            </div>
            <div id="audio-container">
              <audio controls></audio>
            </div>
          </div>
        </div>
      </div>`);
    };

    // 初始化插件
    const initCheer = () => {
        const $ul = $("<ul></ul>");
        const parsedOriginLyrics = [];
        const parsedCheerLyrics = [];
        let isCalling = false;
        let mode = 0;
        const audio = $("#audio-container audio")[0];

        // 初始化音频
        const initAudio = (audioSrc) => {
            audio.src = audioSrc;
            audio.muted = true;

            let lastCheerLineNo = 0;
            let timer = null;
            // 当快进或者倒退时 找到该时点所属行
            const getLineNo = (currentTime, lyrics) => {
                const length = lyrics.length - 1;
                for (let i = 0; i < length; ++i) {
                    if (
                        currentTime >= parseFloat(lyrics[i].time) &&
                        currentTime < parseFloat(lyrics[i + 1].time)
                    ) {
                        return i;
                    }
                }
                return length;
            };
            // 节流
            const throttle = (func) => {
                timer = setTimeout(() => {
                    func;
                    timer = null;
                }, INTERVAL);
            };

            // 歌曲播放时渲染
            audio.addEventListener("timeupdate", () => {
                const MIN_SCROLL_LINE = 6; // 第6行起开始滚动歌词
                const LINE_HEIGHT = -30; // 每次滚动的距离

                if ($("li").eq(0).hasClass("active")) {
                    $("ul").css("top", "0");
                }
                // 获取原曲该时点播放行
                const originLineNo = getLineNo(audio.currentTime, parsedOriginLyrics);
                // 获取打call时该时点播放行
                const cheerLineNo = getLineNo(audio.currentTime, parsedCheerLyrics);
                // 输出模式判断
                // if (isCalling && timer === null && cheerLineNo !== lastCheerLineNo && parsedCheerLyrics[cheerLineNo].mode.includes(mode + 1)) {
                if (isCalling && timer === null && cheerLineNo !== lastCheerLineNo) {
                    // 播放其他行歌词
                    lastCheerLineNo = cheerLineNo;
                    // 发送弹幕
                    throttle(sendMessage(parsedCheerLyrics[cheerLineNo].content));
                }
                // 歌词高亮
                $("li.original")
                    .eq(originLineNo)
                    .addClass("active")
                    .siblings(".original")
                    .removeClass("active");
                $("li.cheerful")
                    .eq(cheerLineNo)
                    .addClass("active")
                    .siblings(".cheerful")
                    .removeClass("active");
                // 滚动播放
                if (originLineNo > MIN_SCROLL_LINE || cheerLineNo > MIN_SCROLL_LINE) {
                    $ul
                        .stop(true, true)
                        .animate({ top: (originLineNo + cheerLineNo - MIN_SCROLL_LINE) * LINE_HEIGHT });
                }
            });
        };

        // 初始化歌词内容
        const initLyricContent = (originalLyrics, cheerLyrics) => {
            const lyricContent = $("#lyric-content");

            // 时间处理
            const parseTimeFromLyric = (lyric) => {
                const splittedTime = lyric.time.split(":");
                const minute = splittedTime[0];
                const second = splittedTime[1];
                return (parseInt(minute) * 60 + parseFloat(second)).toFixed(4) - 0;
            };

            // 文本处理
            const parseContentFromLyric = (lyric) => {
                return lyric.content;
            };

            originalLyrics.forEach((lyric) => {
                parsedOriginLyrics.push({
                    time: parseTimeFromLyric(lyric),
                    content: parseContentFromLyric(lyric),
                });
            });

            cheerLyrics.forEach((lyric) => {
                parsedCheerLyrics.push({
                    mode: lyric.mode,
                    time: parseTimeFromLyric(lyric),
                    content: parseContentFromLyric(lyric),
                });
            });

            const originLength = parsedOriginLyrics.length;
            const cheerLength = parsedCheerLyrics.length;
            let i = 0, j = 0;
            while (i < originLength && j < cheerLength) {
                const $li = $("<li></li>");
                // 根据时间设置歌词
                if (parsedOriginLyrics[i].time <= parsedCheerLyrics[j].time) {
                    // 设置原曲歌词
                    $li.text(parsedOriginLyrics[i++].content).addClass("original");
                } else {
                    // 设置打call歌词
                    $li.text(parsedCheerLyrics[j++].content).addClass("cheerful");
                }
                $ul.append($li);
            }
            // 追加结尾处歌词
            while (i < originLength) {
                const $li = $("<li></li>");
                $li.text(parsedOriginLyrics[i++].content).addClass("original");
                $ul.append($li);
            }
            while (j < cheerLength) {
                const $li = $("<li></li>");
                $li.text(parsedCheerLyrics[j++].content).addClass("cheerful");
                $ul.append($li);
            }

            lyricContent.append($ul);
        };

        // 初始化操作入口
        const initEntrance = () => {
            const actor = $("#action-container");
            const callImg = $("#call-img");
            const modeButton = $("#mode");
            const callButton = $("#call");

            const imageSrc = IMAGE_SRC;
            callImg.attr("src", imageSrc);
            callImg.draggable();

            callImg.click(() => {
                actor.toggle(200);
            });
            callImg.hover(() => {
                callImg.css("cursor", "pointer");
            });

            actor.hide();
            actor.draggable();

            initAudio(AUDIO_SRC);
            initLyricContent(ORIGIN_LYRICS, CHEER_LYRICS);

            callButton.click(() => {
                isCalling = 1 - isCalling;
                callButton.text(isCalling ? "发送中..." : "弹幕打Call");
            });

            modeButton.click(() => {
                mode = (mode + 1) % 3;
                modeButton.text(`模式${mode + 1}`);
            });
        };

        initEntrance();
    };

    // 客户端请求
    const apiClient = axios.create({
        baseURL: "https://api.live.bilibili.com",
        withCredentials: true,
    });

    // 获取勋章数据
    let medalInfos = [];
    try {
        setTimeout(async () => {
            const res = await apiClient
            .get("/xlive/web-ucenter/user/MedalWall", {
                params: {
                    target_id: window.__NEPTUNE_IS_MY_WAIFU__.userLabInfo.data.uid
                }
            });
            medalInfos = res.data.data.list;
        }, 1000);
    } catch (e) {
        console.warn("查看是否加入粉丝团时出错", e);
    }

    // 是否加入粉丝团
    const filteredMedalInfo = medalInfos.filter((item) => {
        return NANO_UID === item.medal_info.target_id;
    });
    const isNanoFan = filteredMedalInfo.length > 0;

    // 获取房间id
    const getRoomId = () => {
        if (window.__NEPTUNE_IS_MY_WAIFU__) {
            return window.__NEPTUNE_IS_MY_WAIFU__.roomInfoRes.data.room_info.room_id;
        } else {
            const url = document.URL;
            const re = /\/\d+/.exec(url);
            return re[0].substr(1);
        }
    };

    const pattern = /(room|official)(_\d+){1,2}/;
    const data = new FormData();
    const roomId = getRoomId();
    // 获取CsrfToken
    const jct = document.cookie.match(/\bbili_jct=(.+?)(?:;|$)/)[1];

    data.set("bubble", "0");
    data.set("color", "16777215");
    data.set("mode", "1");
    data.set("fontsize", "25");
    data.set("rnd", parseInt(Date.now() / 1000));
    data.set("roomid", getRoomId());
    data.set("csrf", jct);
    data.set("csrf_token", jct);

    // 发送弹幕
    const sendMessage = (message) => {
        if (data.has("dm_type")) {
            data.delete("dm_type");
        }
        data.set("msg", message);
        if (message.includes("👏")) {
            if (roomId === NANO_ROOM_ID && isNanoFan) {
                // 如果在nano直播间且已加入粉丝团则发送表情包
                data.set("dm_type", "1");
                data.set("msg", "room_22347054_1816")
            } else {
                // 否则替换掉
                data.set("msg", message.replaceAll("👏", ""));
            }
        }
        apiClient
            .post("/msg/send", data)
            .then((res) => {
            if (res.data.code === 0) {
                switch (res.data.msg) {
                    case "":
                        console.log("发送成功 - " + message);
                        break;
                    case "f":
                        console.warn("发送失败 - 包含B站屏蔽词: " + message);
                        break;
                    case "k":
                        console.warn("发送失败 - 包含直播间屏蔽词: " + message);
                        break;
                    case "same restriction":
                        console.warn("发送失败 该弹幕已被限制 请选择其它弹幕");
                        break;
                    case "max limit exceeded":
                        console.warn("发送失败 弹幕池达到上限");
                        break;
                    default:
                        console.warn("发送失败 - " + res.data.message);
                        console.warn(res)
                        console.warn(res.data)
                }
            } else {
                console.warn("发送失败 - " + res.data.message);
            }
        })
            .catch(() => {
            console.warn("发送失败 - " + message);
        });
    };

    setTimeout(() => {
        setup();
        initCheer();
    }, 2000);
})();