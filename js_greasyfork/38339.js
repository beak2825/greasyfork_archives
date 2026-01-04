// ==UserScript==
// @name        Little Site Icons
// @namespace   http://greasyfork.org/users/2240-doodles
// @author      Doodles
// @version     1
// @description 16x16 site icons for use in other userscripts.
// ==/UserScript==

var LITTLE_SITE_ICONS = {
    // google.com
    google: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9h' +
            'AAAABHNCSVQICAgIfAhkiAAAAglJREFUOI2Nk99L02EUxj/vNkthRdToFxLNJqaJESYVXtSN3ZS1CqMM6qKL' +
            'QKJ/oPsF3eV1F1HRBrVcGV4FdRPeJUK0oeYaUmyzRbOxpvtuTxd+v7atIA+ci/e8z3nOe57zHmgwSQFJEUkz' +
            'ksq2z9ixtkZ8bSKSxvR/i0r6Z3LCQRRfxZS7claZ7u3KHPApd3lQxfE67rhDYmyCMSCo5RLfh89QSc6A2w1W' +
            'ebWCZwNaLtLU08fWxy+cus+NMRecniVJi+dOKtPfrUzPLhUij2TNz8lKzqkQfqjs0XZV8j8a2/FjiyPrQ1iZ' +
            'I61Kd+yUtZBahxSSpDC2wrImA1qZQMXo6HqTJSnhAfwAys9h3NA80FsnsLn1kw6vWTv/qkCwy829ay0AbZ46' +
            'sMBUGkZUY9uaDW4DtQgXkATwbG6nBEwsxOtHPLqJRMhLIuTl4mEPhbLY53M51/Mu4D1AevcdDi6e4NRUhM9L' +
            'X/6qns3D/UmLchX6O9cePmW0+j0/AQzErvO1mOVbpcjdQyMca+3FZVxMp6e5/SaFL32DPT6LJzdbHAK/85Gi' +
            'wPlSdYXg+Agfl1J4jJuyKghoMi5kCuzQcd4OhWjZCMAzY8yQQwAQB/YDvJx9zYPZGO9ycapA35YAVwOnudQ5' +
            '6FSOA13G/JmOsw/Rdcz+qRqXqU51yS8prNXlWrE9Ycf2NuJ/A6uf5JCErH2FAAAAAElFTkSuQmCC',
    googleold: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9h' +
            'AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAA' +
            'AAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4Onht' +
            'cG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDEx' +
            'IDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo' +
            'dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiBy' +
            'ZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBN' +
            'TT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9i' +
            'ZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9z' +
            'aG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDBCQTI1MUVFRjk1MTFFMzk2' +
            'QUVBQjIwRDczQkMyNTUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDBCQTI1MUZFRjk1MTFFMzk2QUVB' +
            'QjIwRDczQkMyNTUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0MEJB' +
            'MjUxQ0VGOTUxMUUzOTZBRUFCMjBENzNCQzI1NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0MEJBMjUx' +
            'REVGOTUxMUUzOTZBRUFCMjBENzNCQzI1NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6' +
            'eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhL34VoAAAGBSURBVHjanJPdK0NhHMe/55znrDXWkNISJW+5' +
            'mLzGvFyYUqO03LmwGxR3kn/BjUv3U8jdamE37pQbhilcUOYG26KYtmw8O+d4ziGGUzv2q6fnre/neX5vnGsx' +
            '5QbgY8OO/1mMjUm+QDE+NT6iJ+Y5wNMhanNPgwBHlYCtY4r9KwmH19IPCK+HnnaZILAbf4hiYSODi6iMkiLu' +
            't/jjMT2Au5ngMaVoa5lNwRMKZz3R9UMXoIqaq4WvffxZQTwhGwes7lEMOQi6agVYzRwGmgiWgq/GAZssYHPr' +
            'adhLeQTmLTi7kbQ4GAaodhmTEQxTJNMKRtsIbBbOOKC7TsDMoAmeThGBI4rKMh7LXjPKrVx+wLhTxBgT+nbf' +
            '4D+gWGPxmF1Ja4H19pvyA4ZbCEIRCTQn5Q9JBdvhLEzEgAuRexkjrQQVtu/vEpbR9hqB1UP2D4BjzaTkHhSz' +
            'tE30iuhrJEi8KIg+ychQYOc0i/NbSRcQLbCZtBpTXZhSFwWI79R2fhdgABnNfZYFhidHAAAAAElFTkSuQmCC',
    // google.com - alternate icon
    googleimage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2' +
            'AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAA' +
            'AAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4Onht' +
            'cG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDEx' +
            'IDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo' +
            'dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiBy' +
            'ZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBN' +
            'TT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9i' +
            'ZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9z' +
            'aG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzJDQTE1NTYwQUUyMTFFODk1' +
            'MjY5QUQ5M0QwREM5OEMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzJDQTE1NTcwQUUyMTFFODk1MjY5' +
            'QUQ5M0QwREM5OEMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3MkNB' +
            'MTU1NDBBRTIxMUU4OTUyNjlBRDkzRDBEQzk4QyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3MkNBMTU1' +
            'NTBBRTIxMUU4OTUyNjlBRDkzRDBEQzk4QyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6' +
            'eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsKZuQUAAAKwSURBVHjaJFJJaJNBGH0z/5bEP0nTLFbTaKxa' +
            'N6SoUJEKgra44EWpitSTeirqRcGLRy8ePYkgiidpK0rBIlJEEImouOBSN2zSBU1bSUv7J/82/4yTOAwD3/De' +
            '9773ZmDbNgvEl8nyhksjOD18Y/RHIALPWvxw7FBxNfh6iPb69tfBWgsJJgETRMGZG4U73wjMJo0vjl/c2poM' +
            'ucVS7dDGhPDRWIzDFrA5KFXAg+DNHIdpQqG+ow1//A1QPd/m7TzKRR0tz/88WVHBoRAlFzfgCQgPhH6eZiAB' +
            'oeDmMtYgUAIK+AKypIRKGS7FUatCSJRHiS+vZM/K549jYTxPJgvRZInW0ZKjTpWt1pbYyd2526/+vJ9d0kOi' +
            'r3M5ARl8cf/y3lqpbT+IIYeG7R8cr/YWvpBtFx9eO9HRsyO/5LCnY3Pbc2br8ujNF0P9764jk6iPL9FSkMmx' +
            'dFQVkjn32HGq3avD+zrS/Yd3gIg3E1877x1HPguhgACe3ojJB9MhrWUVP2UYD365V4aKv+dtIWguntmc74Jn' +
            'g1MEqnQLmQwaNOoqyQ3718TVnk3J7i0t7dlEc9wwQ5G+NXt+zc6MzX+DGoEgdR1JlixfIY9efu/asi4epYE1' +
            'vrgw4Vjl1KoDeiTBeHBq5OrAzGNo0okCmRxXEciRA2Ev/Jh8fyGGUUXl8FBjneldg8viuWJlpm2gH2EXTAUn' +
            'dd8M1BN2qXA+qzxZ0cxTJmmKoYm8nn97RYDkEys2RVrgytfksnfDNFRmVSLBT0OL1Wo2YTrnJBRKc7dEmO3S' +
            'sFW1QHS4Boj8HEymTI3oSr35iL3gCDcluKmQNHdULXNUaJFnXwtTi9MIZFYcDoUnbRikUqnEQtT6fltZ+kT9' +
            'KtfCeqqHtPcW5/523708RcugUciYBIPQKmdv/RNgAPEsTF6dpFAJAAAAAElFTkSuQmCC',
    // youtube.com
    youtube: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9h' +
            'AAAAB3RJTUUH3AMCCh4GdDTbkwAAAAlwSFlzAAALEgAACxIB0t1+/AAAAARnQU1BAACxjwv8YQUAAAGKSURB' +
            'VHjaxVI9L0RBFD0zb3bJ8uxnJSEKi1UQCc022yvVKomEQqFRKLZR0fEDKFFRaEQiq9CjEaEg2YTGixcRu+9j' +
            'xn1v33v7kSylSU7m455z59yZC/z3YGealkhzd5cpjNK+wIHYbwIJ3NNkEx6KDlaEzuSGlFjwgiKTyag/bnQN' +
            'oxAsp64Ee+OOUiWHgSOdyjhKwoOK92Lu9R0DhVmEZyF8HvF9kJbbHMN24CmE6tP9K8Yvz5FfLqMzHoG03FJI' +
            '1cm31YJv2Swkt7WO0vEdZEKP4vUAnpbbCtwiYjvaX0KVhlDcv0Ynz9MKssIarKbIdWVbAuMZOCkvIRdwIo33' +
            '8DUGRV/IWiVai4Ob01scrc1jrPaJOuNhgsadpBWWhEHpstaHacaTyaQXcGzHJxysbuLxcA+TMUFJuWcZlmma' +
            'UWkKhqBaqpQ362cOgi5Ni3HWk6ejEeqdWvemqgr6zwpnmOkMFgOn5IV37UqFijChbfcrd5D2E35vA9PdBFTB' +
            'E01fwfriRZc7+PfxA+CfvskCnEaGAAAAAElFTkSuQmCC',
    // allmovie.com
    allmovie: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9h' +
            'AAAABHNCSVQICAgIfAhkiAAAAXpJREFUOI2lkk9LAlEUxc/4tzGFFFEXMq6MCASpTdAiqDalLYqQqHWZ0LT1' +
            'S7Rt0VfoC0iEiIvCRRQJKo6bHEHThX/GhYnNmzbNc9C388KDw72/dzjv8oAFiws/1jUAqCVCVFv9gpsFT9py' +
            'b5alAiazCqKaAcDEu4YsAzIauuZYfVg7DVooaeII8zDY6SVDVWPuFVafpjUUTbCe195mh+mUGEunxNhs38jS' +
            'BJqqBoyQJncsm7H9y3/9xAm+XxZLE1R2LUGjQSaXjQwU5WCgKIeZXDZinBlZ5g40uWPeOztJ2G02CQDuHu4T' +
            'mtwprhZGcyxNsPb8823oexut5pXL6Xx3LTs/Gq1mEoCXxVIDk83+peuL2+s4IcTT7ffj3UE/Tghxn4vJIxZL' +
            'Dco73JauP8sl0cHzL1K+sCHlC1EHz78WK+UbFsvcQUmqRgGAE3x6axsAwsDcP5j+aat9rE3GdgCw+oU6y3jS' +
            'lkOzLH2CdBxY0rWq9Dysw2IXrj98oq7vSD1iyQAAAABJRU5ErkJggg==',
    // synonym.com
    synonym: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9h' +
            'AAAABHNCSVQICAgIfAhkiAAAAb9JREFUOI2Nkj1v01AYhZ/XsXFI66Qf0NBU4kMqSyUqZUFCbMzMSDDy15iY' +
            'oEJiYOEX0KpDKGmVLWmT1kCd2Gk+bL8MTkxcNYRXuoN973l8zj2WNx8bnYH3c4N/TKygqgAYIogk762C45nz' +
            'RALoZG06No/vLmGbOfabl/zqj1PIjQAFinmTaqWENwh5+/Q+W8U8h6ddDlpe5qx5XTi16g8jNpZtnmwWCUYh' +
            '7w9bfDm+4PfM1zMABQpWjmcPVqkU83R6Q8yccNYdYIjg2Cb3HJvLq/HNDkxDeLVb4eVOGUMEVYhUMSS5OIDn' +
            'D9d4963J14abAozklpXt9SVebN9JD4skUGPGbylv8bq6xaO1AvG0lenmTtlh2Z5bSjrrhVtUK6WsA0FYuW0t' +
            'FE9npWAhyF+AovSG4X8DvKsxyrUIDTdgFMYLxYMw5sQN0uckggh11+fY9RcC6uc+J26AyEwEAfxhyKejDv1R' +
            'NFfcH0d8/tEhGIVMu0kjGCLsNz0+1M4IJhBVJkkT8V6tzUHLy1Sb6S1SZa/WptbuUXZsolixcgamIZx2B9Qv' +
            'fEJVZv7kLECAKFaOznt87/Sy/gVyIhkxwB/n7q9jYDQOLAAAAABJRU5ErkJggg==',
    // boxofficemojo.com
    boxofficemojo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2' +
            'AAAAA3NCSVQICAjb4U/gAAACJklEQVQokX2SMUhbYRSFz588k5Aq+szSJmkIvCENLo15FJTi0kEzmikgRYfo' +
            'oKuBTCoOgmgGBxexUAQJSAsqCBXpEApSJFFojWmclBAbMC8Eo099Sf7bwde0tbXfeM5/uNz/XEZEeIA7izH2' +
            'u2icmpoKh8M2m83lcjXUyclJItrY2EgkEna7XRTFhiUAsFqtl5eXIyMjkiQRUTQa9fl8R0dHmqZxzg8PD2Ox' +
            'mCzLuVxuYmJCANDd3b2zszM6OppMJo1GIwDOeXt7u8fj0TRNUZRQKFRSFLPZDMAAYC+Vej04uLi4yAThUXMz' +
            'gEwm43a7m0ymZlF0Op3r6+t1zvVliOjb5ub3dJqIvsTjxeNj+smtoixJEv0JiOiN3782MEBE48BBPN7wqqqa' +
            'WFi4FzAAMIlibnW1cnLSBAgWS/n0dMnrTS4vM+A8lQLwIRJ529NzWyrpO8BgqACZrS0BECyWd8Ggd2jo/fBw' +
            'OZvdW1nJ7+5+nZ+3yfLH2Vk9QJzbOzo+z8w8kSTGWGF//3ko1Aacp9NmQMnnnwaDzwKBs+1tPcDrdUdnZ+Xs' +
            'zNHbyznnABgzArxWu/tig8kEorqq6sXxmxtXIFAulYgx4rwVUIvFC6DF4eBAS2vrRTZ7raptPp8+oVYomEXx' +
            'xdiYVixWr65era3N+P3urq7HsqwBUl/f+cHBSn//y0hE7+Fv6tfXRFTKZscbD6rVXz08xDTwaW7unsj+c97/' +
            '5Af8D3S/RIM3IgAAAABJRU5ErkJggg==',
    // wikipedia.org
    wikipedia: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9h' +
            'AAAABHNCSVQICAgIfAhkiAAAAZ9JREFUOI2lk6+LQkEQx79zXHhNRKxW/wyLgmI7RHnJoF0MJhW7BsE/wGKx' +
            'eAgW2zWDNssrImgR5PnuIYrJ/V7wvcVfHB43sDCzO9/PDrszAACSA6WUQ5JKqV+Xl+OQHACAeM6HB8IrJiK+' +
            '+ylKKUdEgq+KryEkv4V/Vd7Z2263g2maEBFEIhHM53PUajWICJLJJCzLQj6fh4ig1+thMplARJDL5eC6LkDP' +
            'EokEK5WKHzKbzbJUKpEkR6MRx+OxPovH49qH/7Kz2YwAeDweSZKr1YoAuN1umclktGA6nbLf7/u/cQH4kHA4' +
            'zHa7rZNN0yQALhYLvVcsFrX/ABgOhwSgY8uyCICbzYYkads2m82mFj8AvB/RJbZaLaZSKRYKBZJktVrl4XB4' +
            'DvAh3W6XALjf79npdLherwmAy+WSjUbjRvwUcDqdCIDRaFRXlU6nCYC2bT8A3r2OAnBpZcMwUC6XEYvFdLPU' +
            '63UYhoFQKHTT7iIC3A8RSbquy/P5fLPnOA7v85RSzpuIfGmaV0UgELgeGJBEMBjUt/tnvvZf4/wDmd5ikVi4' +
            'iZ4AAAAASUVORK5CYII=',
    // imdb.com
    imdb: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2' +
            'AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAA' +
            'AAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4Onht' +
            'cG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDEx' +
            'IDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo' +
            'dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiBy' +
            'ZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBN' +
            'TT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9i' +
            'ZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9z' +
            'aG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkVFOTQ4NUMwQUUyMTFFODhF' +
            'QTNCRUIzQTU0ODU0RjciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkVFOTQ4NUQwQUUyMTFFODhFQTNC' +
            'RUIzQTU0ODU0RjciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCRUU5' +
            'NDg1QTBBRTIxMUU4OEVBM0JFQjNBNTQ4NTRGNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCRUU5NDg1' +
            'QjBBRTIxMUU4OEVBM0JFQjNBNTQ4NTRGNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6' +
            'eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuzuOjYAAAJ9SURBVHjaDNHNah11GMfx5+X/MjPJnLz0xJIW' +
            'RZASKWIJhbRgycYr8DJ0EzfFC6hLF0q37sRFL6AQ2oUK7iwtFNo0VWhjNqExyTk9M/Of+b89zgU8fHk+P9z/' +
            '9TMDpykS2qm4s1R621lXFYV3hGUPc1aTIQXNFGTBOFGExzduXa6o7dhRVBaqPoDHlKM1KaNsuNAwsB+SyR8c' +
            'vkmEUFVoUtI4hDws+WZdvJcwFou+1X3vkWnsR1NJWu7UnHZulzGDzjZFQR0wvRWlZDCqi6ithy70Fnq78O/J' +
            'z65dmcDdvTVQ8ODHTUZaW4Xjl1ugoQZ1/96UASYAN6/XT/7YKgGOfv/k1ePLROhAoNIqiV7M4PVhDUgBWEdL' +
            'Jfxw/6ODA/fLz+8iQDMYtLWKYZXySRM9oJ4W+utvn1YmuzgAY3D6zrbqRLdUBXXx/U//vPh3nUaPLFBSBG6m' +
            'G+3bI9i4YgWgR8c6LbuM2JPMqgjTVfP8xYxQDEPZKcsJbm1ves671xmzEV/kmM9GABAjdQf6i9s1oR7nOAVw' +
            'WkpBqItACi9Nlgm94oiCfz2Zje/mQQgDV4zSUKKaCS+CU5l2v7Kb00liZNFedIaV7+6ef/6p2flyFYX2vjkD' +
            'BPz7z48ZrKRibHk6NchNY7RegXjxXs9Lv4LtkphuIMjRLfIa7T88zTkO6jzBuQuUg/FIQ/ivE6Pj1baXbEKL' +
            'OcwxgX367Hw8LAcv0Ju5z2X6cNF7hgIRQ8zZXxCp+SK5nhTZYVEbQtVw8ei3Psgc9XoZ37SpVeUgjkgCaepi' +
            's1ySc7rkkyBVYsFegk3Kc+QcGQuA2KMq8kiTRHEARwkUjwASQRtw/wswANi9X9Ya6D4BAAAAAElFTkSuQmCC',
    // imgur.com
    imgur: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9h' +
            'AAAABHNCSVQICAgIfAhkiAAAAvRJREFUOI19k09oXFUUxn/3vPfmXxIb1Kl1JkNbzaA0toVibVFK0NpEagQb' +
            'RNB0F1xJSiFoRIQ2uLF0o62IEHBlQNESabQo0jForVYsjqmxSoMS7ARSm2nHSea9l3ffvS4ytHbjtz3n952z' +
            '+D4F0HFqaMCIGlHQhUX4PymMhRkx9sjlvcfHVcepoQHVlnrfNFbA2Ft2DRZjLQawrM5cJTgiSCaBrQf7XSNq' +
            'RP0HrmgfrAZgbbKdgtfK7W6alLgYLNONK/g6INkAK2rEVdCFsaCgEoVMPXSQHXcWSYnHMpa6DQmMJsKCUhSl' +
            'la7SqyyGS7iiulwsggIrCl78i+65TfTNjvNZY56MlyHteLiui+t4VMTy091Psb01z8ngIq51RFCAKKrDc2xJ' +
            'Z9m9e4hPOwfoT+fIW0XOCuuMkDWKglUo27zYlOAoKi/MElyoMnpkkFLpHGe/KvNa4TEWowATa0yssbFGa01S' +
            'CfU4RJoeUnlpjtLYKL29D7Lv6f18MXmMO3Z1sG16jLVWsE0DE2siHdEiCRZWlnCaXwhlS6wstWs+n5/8kA1P' +
            '3MP93x3lXrwb4ELUIIhX8OOIdknyR3j9pkFbCvbsOcDBA/3kezq4b+p1NqgUNOHfwhoTnf1s8dpZjhq04VAJ' +
            'ryGqaSBKAIdC/i7OLPwOscHGmjjWzAZVftw6SMu0z8fF53kykyMw0S1hc2t+xOihQR559BX86gQLG2sc/vM0' +
            'iHB+18sE3y9y9NgJatUqpam3+frvi6Dcm8luT++Lr/uhCA6GFcLaJO9WS+zIFuF8g53dzwHrAAWdaXgrR14S' +
            'N3ohdd/M9PVsxxDT+/hWkmt6eHh+PVe+nGdn9zP8cO4j+nq2IZtbyL2zkbzThEVhYcZZ423+59Klq/0ah8OH' +
            'nmXikzJj702STEL55yXOni7zrV8h9+Z6lLFgV2HJJFChHnYC8+uFVm/TbMK1xQ9OfJO9LZVUjvZwEnB1fpn6' +
            'A4bsGwWIm/BqnX9RoR6+vPf4+L+pBU+QrTv8+QAAAABJRU5ErkJggg==',
    // thepiratebay.org
    thepiratebay: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9h' +
            'AAACOUlEQVR4nI2Tu0ozURSFv5mMYvCWMV4aQRQNKCQgqMFSUtkL2ghioY028wg2tj6AlwewULQSCQGxMIVg' +
            'EWUaG6sRUjhEYQgzsyz8M79oChcc2Gdz1j5rr802JIlv+HFtC8MwkthqBa7r4jgOQRBgmmZbYqv41tYWq6ur' +
            'SVKSdHp6KuBPZ2VlpUVTosCykpCOjg6iKMK2baIootFoABDHMZLo7OxM3v7Sms/nub+/Z319nZOTE6rVKpub' +
            'm5ydnbG/v//Lp+TbVjKdTpPNZmk2m+zu7tLV1UUYhuzs7FCr1RIl342RJB0eHiY99vf3/+q7t7dXqVRKgBYW' +
            'FtRsNiVJbe32fZ+xsTG6u7sByOVyBEFAFEUAfHx8/Pfg8fERx3EIw5BUKgVAsVhkfn6eTCYDwOLiIsViEdu2' +
            'ARgeHsayLKIowqhUKlpaWmJvb4+enh5GRkawbZv393fCMEQSkkin05imiWmazM3NcXFxwe3tLdb19TUAlUqF' +
            'OI4ZHx+nUChQKpWYmZlJxvv29sbT0xOu63J8fMzBwQH5fB7j6upKl5eX1Go1tre3eXh44OjoiHq9zuDgIFNT' +
            'U3ieRxAETE5OMjo6yuvrK57nfbUgSZ7nMT09TSaTYWJigqGhIfr6+sjlcsRxTLVaxXVdstkss7OznJ+fUyqV' +
            '2NjY+Bpjo9HQwMCAHMeR7/tqB9/3dXNzo7W1NQG6u7uT/hmkMAxVLpdVr9fbkr/j5eVFy8vLen5+liQZP9f5' +
            'L5CUrPQnh11zZW9Hui0AAAAASUVORK5CYII=',
    // wiktionary.org
    wiktionary: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9h' +
            'AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAA' +
            'AAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4Onht' +
            'cG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDEx' +
            'IDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo' +
            'dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiBy' +
            'ZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBN' +
            'TT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9i' +
            'ZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9z' +
            'aG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTE4MEI0NzJGMDYzMTFFM0JF' +
            'N0VFNkU5RjkzQTE4NEYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTE4MEI0NzNGMDYzMTFFM0JFN0VF' +
            'NkU5RjkzQTE4NEYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5MTgw' +
            'QjQ3MEYwNjMxMUUzQkU3RUU2RTlGOTNBMTg0RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5MTgwQjQ3' +
            'MUYwNjMxMUUzQkU3RUU2RTlGOTNBMTg0RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6' +
            'eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhGhXrYAAAFRSURBVHjapFPBqoJQED0vLKJN6zCkXeDCVRIt' +
            'Qoi26Te09yf8if4kbRFI6x5BbRMsgkqQVkKUi3neS0mGQfUOXJh7GM+cGe+AiIrJGSZnTu9jfvumiFvwLYY/' +
            'TA1AC9/hlzkgWZbJsqy3y7LcTqfD41SAIQgCul6vb4ncBQqPfprNJhaLBVarVcqFYYj1ep3ePc/LNvHoQFEU' +
            '2u/3VKlU6Hg8cs40TRJFMa0sSdJrB8vlErVaDZqmYTKZcM51XQiCgM1mw53FcZwxIOSN1jAMjMdj9Ho9VKtV' +
            'JNUwm81wOBwwGAwyuYU8AZY0nU7hOA76/T663S53Yts2dF1/PYNHqKrK+aQy+b5P9XqdEjd0Pp9fz+C5je12' +
            'i3a7jUajwTnmplwu5zt4fkhRFNFut0vv7O+cTqfchzT/dAEul0u6VKyF0acLUCqV7uEI/13nPwEGAK8BPJrH' +
            'ng35AAAAAElFTkSuQmCC',
    // wolframalpha.com
    wolframalpha: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9h' +
            'AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAA' +
            'AAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4Onht' +
            'cG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDEx' +
            'IDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo' +
            'dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiBy' +
            'ZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBN' +
            'TT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9i' +
            'ZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9z' +
            'aG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEVCNEEwN0FDNTYxMTFFNDkx' +
            'NkE5MTBBQTdDREI4REUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEVCNEEwN0JDNTYxMTFFNDkxNkE5' +
            'MTBBQTdDREI4REUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4RUI0' +
            'QTA3OEM1NjExMUU0OTE2QTkxMEFBN0NEQjhERSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4RUI0QTA3' +
            'OUM1NjExMUU0OTE2QTkxMEFBN0NEQjhERSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6' +
            'eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkTVP+UAAAG/SURBVHjajJM/SFVxFMd/P9+fe+8LGzTIhnAo' +
            'wsUldZFcI6Lp8SCQHKyWoMhBBKemsKYQnZoFsWhqqYYKdBFRiWoRg3KQ/rxaSn3vvse9fc7tXPh5ew888OH3' +
            '95x7zvd3rv0xeNqodcAx+AOx7lkYBg9em4ydWNtJnFKLYAzuOnsSaAZ6TRvryKy/wUOYAB/KMAQ/9VwyuQQn' +
            'U4e8bnZCFZ7BC3gE5zWjWEe5cxHOwDU3QBGmtN7vxtq+uF6joGiMOe6xZaxYP6gwF59b8NkNsAfLsMDF43Ht' +
            'QOWzh0bZJ8hbgiy4NedVvOcwyZcfJ+qubP0nVvXCOcN5vy1691m+gQAW83pegJItFE0c1pPLrYzzbobbqsHL' +
            'NEAFplW0o5iUewO+pCWMqoAfEU4U9tuWEIbGet4cy0+uBmWdByaXe2KajSttS/B9eRV50lfwO9tIp+AsSv9T' +
            'Poq0F2N1DnaZzzMdkNqhxw0gil6FD1waR+k1G5RI1xfHrzKyL7XfgcuwDl1pCWJNeAqzsK+XpIWvwwbchBH9' +
            '0Hul6GbQgG11TgNuJs1lzDu4p23uvlToZpC1VVjSQGK/4EGLn8/8FWAANkt83ZsOghcAAAAASUVORK5CYII=',
    // rottentomatoes.com
    rottentomatoes: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9h' +
            'AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAA' +
            'AAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4Onht' +
            'cG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDEx' +
            'IDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo' +
            'dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiBy' +
            'ZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBN' +
            'TT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9i' +
            'ZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9z' +
            'aG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6N0FFMjU2MzhGMjRGMTFFMzlF' +
            'NTU4QzEwQkE2OEUyNzEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6N0FFMjU2MzlGMjRGMTFFMzlFNTU4' +
            'QzEwQkE2OEUyNzEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3QUUy' +
            'NTYzNkYyNEYxMUUzOUU1NThDMTBCQTY4RTI3MSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3QUUyNTYz' +
            'N0YyNEYxMUUzOUU1NThDMTBCQTY4RTI3MSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6' +
            'eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PiiXmUsAAAI6SURBVHjaxFNLaFNBFD3z3kvSxKRNw9NaWtM2' +
            'mtgaBVsLbf1tquLGqoiuBIUqogsRXCmIC13pokTEhRv3guJCULpoQVCQQESsxaBVDA281sTUfF5e3u86UVvT' +
            'j6suvHNnMcycc+853GFEhNWEgNVGtYOVumjrlk+cud5POw533APj6x84Ng9m7PebQHv9/uMj/U/mZixP+tY7' +
            'sKOt2CSwxLORt0OKaaZrCZZJEHkea5VvfJgqeIqcUDkdhn9ARtAQevbcGZi+fKTrpZMx14oeSGBSbHNwdNjt' +
            '6Ru/mkLATzhfsECGiUhFwMMLSezKsp2xfZ0pVy3JvJaTnvrhfDRC3w5toWs3++js7X6iSIhMKUiDjwaJGkJk' +
            'ezuouC5El3yNV5Z5MNYcjPdEfb1itw9rOpsgZDWUpzNwP81hXHYjnDPhLdm/dE4Y+sRu5eu2RRLanY6NcDII' +
            'Li6mTYYRDsBwMOSanehNanBrNkQONvhbryC2/JX+JzTTLqNgNdoZDVp8CsSLgVelH9yHOgFcNwo2IccvvlhG' +
            'ZftSE1+Uy2O2YsFKqtAT32EkMqBJDVKWYEqEWQ5M2xY+mTpG1fzredyCB11OV/T52tZXPodYX/WY8Q6sMoEn' +
            '5vhhloPTegUftZJ2Xy3uVWw7voigOkiDdZ6Dd/1ND2RBXK+DkOc7yysrloFURcWkWsqMGvq5FPB4Abd0EltE' +
            'acMpb8PFrQ7XAWKsecbUWFItKW/0yth7olgJ+Fw7iey//8afAgwATDMcKK31xQYAAAAASUVORK5CYII=',
    // urbandictionary.com
    urbandictionary: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2' +
            'AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAA' +
            'AAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4Onht' +
            'cG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDEx' +
            'IDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo' +
            'dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiBy' +
            'ZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBN' +
            'TT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9i' +
            'ZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9z' +
            'aG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NUM0NzVDNTlDNTYzMTFFNDlE' +
            'NDRBOEI0MTQ5Mzk1RDQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NUM0NzVDNUFDNTYzMTFFNDlENDRB' +
            'OEI0MTQ5Mzk1RDQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1QzQ3' +
            'NUM1N0M1NjMxMUU0OUQ0NEE4QjQxNDkzOTVENCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1QzQ3NUM1' +
            'OEM1NjMxMUU0OUQ0NEE4QjQxNDkzOTVENCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6' +
            'eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvR9sEAAAAD+SURBVHjaYnmRpMRACmBiIBGQrIGFoAous488' +
            'du///2F8PUGeKBt+3uT+9ZCTiecvwgaR7MdMnH/fr5T4/ZhDtOAhUARiGKvsD36/18z8f/68ZkXxw5f9goxs' +
            '/1klfwLZ3y/xwg0TjH7+/xfjxw2iTNx/UTT8uMYDlIDwv+wTgjCAxjOy/P+wSgIo+/WYAM5Q4tD6AmEw8/4B' +
            'kn8/suAMVi7TT0CSTek7SDX/H6DBDP8Y+XxeA7ns6l/hyhghMQ0MO16XdwxM////YGLk+AcUeTNZjtP4E7fF' +
            'RyAb6GCI4MsWJUbkpAF0D8hgDEciC6L4AVM1piDt0xLJGgACDACVpFzkKG0u6QAAAABJRU5ErkJggg==',
    // merriam-webster.com
    merriamwebster: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9h' +
            'AAAABHNCSVQICAgIfAhkiAAAArhJREFUOI2Nk11IUwEUx/934rxr5tzSTaGcMz9olIrQx4RIegik8qUMonqL' +
            'HnopqBcXVhKBPfRgL2HQYwUKRUo9BH5gaoqb2pYVW3Mf0LY7tzt3d73brnpPT4WaUn84DwfO738OnHMYbFHk' +
            'fV+prq7xorzEn5Y5zgxGpRQYS/35ev072TH0qvjS9eTGemZjIn79clOYmXsgx/lCTVUl2Ip9ABGywRAygSAK' +
            'TKZUUaP1lvZgw/OtjZFyzj332u9ScnyCiJRtIzE8Qt7O+yTMzHRvgkW3+5bXfpdWU8s7wr9Djsfpx50uRXA6' +
            'LwMAww0NmNZDyz5NXY222Hb0r8m2Ez88CjkcXWKisxZVkcV6Web5/4YBwHCyBblYrLSw9Upb3u32Cw/ztFrL' +
            'N0WDZ2+n0HzIDF84gadvplCztwSD498w5PAiHE+jf8QFXSGLFx/m0GTIh4plM6pclDNrKs2oLCuGe5HDgp/D' +
            '2HwAaUmGUV+IVlstOF6ElJPxMyYgkZJwvMEC1lwBORLdr2LAEABwvIirZw6jb8gFFQMopGBqIYRJdxDrCkHK' +
            'rmKPToNZz0/UV5cBAEhhSKU2lgSywRBmPWHotCxW1xU0HzJDzMiory7HqSO1qKsohVajRktTNdbWFLDqfGSD' +
            'IRSUm3yQfN4bgcc95PgeIrcvTIIoUTK9QsMOD/kjcSJSaCkpkJTNkpTNES+IRKRQ4HEPpV1z7Uz4ZW8JZfIX' +
            'tVbrbt2xI/+3xtEx5IKh6PrnwSoAgORyXfd0dNKqkPr3ISUS5LXfU9KO6fObXFPT0088HZ2UnPy0I8yPjtEP' +
            '+z0l8XHi/m9u0zOlnc5rqXnXo7VloXhXzf4/z5QJBJFZ9EOt1y+xB2pvGmy2l9saAADf260rONF2TubiZ3OR' +
            'mIXyoLAm46LaYBhY6e9/bezqEjfW/wL9TM0prJUufwAAAABJRU5ErkJggg==',
    // thesaurus.com
    thesaurus: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2' +
            'AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAA' +
            'AAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4Onht' +
            'cG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDEx' +
            'IDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo' +
            'dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiBy' +
            'ZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBN' +
            'TT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9i' +
            'ZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9z' +
            'aG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUNDN0VGN0RGMDY1MTFFM0Ey' +
            'NzZDMUI2QkFFOThGNTMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUNDN0VGN0VGMDY1MTFFM0EyNzZD' +
            'MUI2QkFFOThGNTMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5Q0M3' +
            'RUY3QkYwNjUxMUUzQTI3NkMxQjZCQUU5OEY1MyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5Q0M3RUY3' +
            'Q0YwNjUxMUUzQTI3NkMxQjZCQUU5OEY1MyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6' +
            'eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pum+0bEAAAFkSURBVHjalFKrdsMwDNXJCVCZw2JoaNiyDQau' +
            'rPmEwX5CBjNWOrZfCNzgYMMCG2jospjFzJOcNF0H9tAJkGXde3NlpW+vRZYBhcDR+dXPCUWq5Kilhzl+SXqL' +
            'yQL9YyTwz/gOcPgA6uV6plyWywlRJmp98Pqd+2II6EHcwboDVHNXXi0A720ymhq9EbomGDd5A30JrgXdMIvZ' +
            'zzrMr0gBjk0RunU47cJwDCGMo+WcKvEYbD2cqvAl0ouYYTJZIhbEzQr24IZCqEpgG81xpe1dOmnNGNsANOwy' +
            'wgQ10UeWzs/xil4QI0A30dAZ/dHZTkQYGRByy93M3SxTigBymW0Qtcd7oXcANYFjk+XbyfdlSintCfgBrGGC' +
            'qRydYLYhepa9fag0roa/qU1OyKd4FGo/z3oBsML8g8rHeSPmTIy5mN4etABz9UAKreH9o/sMJ/cWUFrzQflK' +
            'PeVya7r+7FxccvcpwACkJsfX9f/EKwAAAABJRU5ErkJggg==',
    // onelook.com
    onelook: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2' +
            'AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAA' +
            'AAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4Onht' +
            'cG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDEx' +
            'IDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo' +
            'dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiBy' +
            'ZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBN' +
            'TT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9i' +
            'ZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9z' +
            'aG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjY0MkFDMUVDNTYwMTFFNDlD' +
            'QzRDNTc1NTc2MjE3OEEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjY0MkFDMUZDNTYwMTFFNDlDQzRD' +
            'NTc1NTc2MjE3OEEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyNjQy' +
            'QUMxQ0M1NjAxMUU0OUNDNEM1NzU1NzYyMTc4QSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyNjQyQUMx' +
            'REM1NjAxMUU0OUNDNEM1NzU1NzYyMTc4QSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6' +
            'eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnQU4QQAAABcSURBVHja1JFRCsAgDEObnDw3d6JYXO1AwZ8V' +
            'hSLvNVDNDgv1lrJNw3iacEmo0cC24Gjq8INWO4nDlfal9SY4XGlA40WpE0Z2SN6EQM5aG6n3LHnOz376Zj0C' +
            'DABIKSYZZLJmtQAAAABJRU5ErkJggg==',
    // itools.com
    itools: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9h' +
            'AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAA' +
            'AAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4Onht' +
            'cG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDEx' +
            'IDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo' +
            'dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiBy' +
            'ZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBN' +
            'TT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9i' +
            'ZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9z' +
            'aG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzA0NzVEMUNDNTYwMTFFNDk1' +
            'Nzc4NjFBMzA4NDRFQTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzA0NzVEMURDNTYwMTFFNDk1Nzc4' +
            'NjFBMzA4NDRFQTkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozMDQ3' +
            'NUQxQUM1NjAxMUU0OTU3Nzg2MUEzMDg0NEVBOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozMDQ3NUQx' +
            'QkM1NjAxMUU0OTU3Nzg2MUEzMDg0NEVBOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6' +
            'eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhnQ0EIAAAGdSURBVHjajFMrdsMwEBw7JYEqDFRgoAIL5SPY' +
            'MNA5QgMDe4XkCPYR7CPENMymZRUNU3dkO8/59XXfWz1pZ0a7Wknw3mPqRXXyaZp7Y4wHEJxzxojd828WJFGQ' +
            'WvjqAP9TwbdFP2csYMKZaqKwi9hyuZRJh+pLQ2s8ta4Dkp0M0GjbNmIs5pBl2yA+FVbEOhDo2c6JwF3XxMgh' +
            't9cAEc+VJWu01SgeszkskzLMq4OFtVOsE6xmvzDDBfvVokO+2Qikrq7UApcL8GG0YHaCcfzGWTY5n4HZfI59' +
            'vjFY6ZVA84mfYVculKtVA1xGFxWcJFAoawc2wrenTynfDgU6dM0R66yGc33En8xDQ4m9J03fRKX0tTy4UjJC' +
            'ejIVqUcf6LE8EjSN64OuxphWjYwX1shpqH3T2uBYHmFNF8qXch7ZT2LHspFjp4jTPEdZduFq/mu8YjaQ2ji1' +
            'JpLniWTbDNWrmyu77wE55FJDbWhiURwiguw8d/8rMznk9hq8+Eyplh+oJr9RhdizzxRPM3BXPk/ADu9/NB1i' +
            'xK6ZB/sVYADlzQZVT1AjpgAAAABJRU5ErkJggg==',
    // vocabulary.com
    vocabulary: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9h' +
            'AAAABHNCSVQICAgIfAhkiAAAAihJREFUOI19kk9LlFEUxn/nnHt1xnmnoPyHFg0YbbJIKKhVOxeCy5Z9A+kD' +
            'GNJC6hP0Fdq2CVxEm4JACArLjLK0aFFoJuL7jvmO770txhk1tQsH7p9znvOc57kC8PDNg7EihrshFpeLGJJA' +
            'QYiBIhaEWBAoKGJo7mORFrF4e/ZE7f7EpckZuffyzljZV58kPtFWUrFb9B8QihhCoBh3Gv3UVp6pABWf0F4R' +
            'EI4/g8YQp5ypG5Yo1PMM/gPSU+6jv2uQubVXNELzzinDzsSSFvBxIKbGlZ5rdFqJj+vzhFi0XhNn4g7wOgqk' +
            'dnKILpcwv/aaPOQo1mbmTOwA4xAj2XYKESodCV4dtep56jsZ3ze/0c7fHU9NjGY4Klbl1oXbXDw1QpanZI2U' +
            'waSGU8/yxiKCoKKYGCqGYhwYoZHnnKnW6KsM8OHXO7YadbpLPTRCzkr2o9n9Hze01d3EQOHF0jNOd/Vwtf8G' +
            'vaUBVIyvG18QEXSXrWJ7TPaP4J3n/eocq+kKN8+NUqsOIQif1hfIGikmeghEW91NDKce3+F5vvSUpLPKcO8I' +
            '639+k+9sU8+zI0GciaVA2zPvPMsbn1laW6S70stq+hPdVf6wxTF1Jm4euL6nCnR2dPJ44RE7YQfxgqlx5GeL' +
            'Nq/91YFpFQv7xfTOUyqVKJfLeOcxcW3aJo56npE20mCq0zo6ND7jzcZN3KyJpW1N1DVjX6E2/U8Vm91qbI5P' +
            'jEzO/AWti/DCP64YLQAAAABJRU5ErkJggg==',
    // dictionary.cambridge.org
    cambridge: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9h' +
            'AAAABHNCSVQICAgIfAhkiAAAAsRJREFUOI1tkklMU1EUhr/XAaQtIDyrLSAIBl1oUGmNUYxDjEZBE6MmTnGI' +
            'GuLOmJi40hjTBRYS49KdkbjQ6EajGGd0YVRwqgqlSoBW+ygIQp8MLe1xUcMgfrt7z/3P+XLvVQBObaqSeQmN' +
            'eL4dEsLIwCBOtZTE5m1AEuOd2/RHgihOC5IEs9ZDh9FB3YO7iglgXkLj6HboNLXChxz01ne41lQR3bMLA2AN' +
            'Bgj9eI3ZbkEbjjLW2g4zXQCYAPpVldC3b/xwZxNfZCQzNhuA6HCcPq2PxUCwrZ+hpRmQzKF4SSn9ugqAASA7' +
            'OoPZK0wYRs04Cn4xViAAdGs9qPk5AKR196JadNJMBmz7Uplxg4yBEIE6PzagzzCLpC0OW6CkOI/vWgQnKX57' +
            'dSzSThBI2LMmGhgLinC5dzCZoCIEXzWSTCTpNiq4dnum1N81vweaU4vai5dERKRDi4jvS0C64iL3z56Wj+5M' +
            'eVOWKc9rL0iviLz/7JcurUdERGovXpLxOwCICnSFwsx0zCFhgkJ7PsZYGoa4mZK8QmJArsNBeyiEPslEAbi2' +
            '94DsW7ZwiqLvV5ifqzYzlhih8O1LFlhzp9TrfX4O1ten/sFAsIXmtnpilbPQ29KxfOql4tAZIlVbMQKq38/j' +
            'q+exbM8i1mLF1tGJnuGeeMbR8nKcp4rQFzjJqUhHX2YD4MWNBhhOTVSP2RgsycO6wUzWxlJGy8snGliL3YTr' +
            'OpkzI8pIgYp9YToAa3du4dmdBgCS4XRys4cYm2th8GGAjOJJBtUnq5Un83cRr+nA+LWXSDgGQOOtBlZWrgdg' +
            'oMWAIaBgPveR24v3cPxktcK/1Ow/LE0upMmFiNcjwaFRuXn9nojXM75fc+SETAtO5t7dp3KlrEzE6xFdRIZE' +
            'RLweubxyhTxrbJoWnq7xl/uPXojP9xaA5csrWLfa/d+zfwDjDzMdjUqj2wAAAABJRU5ErkJggg==',
    // rhymezone.com
    rhymezone: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9h' +
            'AAAABHNCSVQICAgIfAhkiAAAAudJREFUOI2Nkk1oXGUUhp/z3Z9Jp0kzyWjjTUlQoeIEoXRMSBYqGEq0FopF' +
            'uhLcCroVqStRXKQ7obWKiLjoqigqlMY/IprWJo1tlThtqbFWYypKbEju/N17v/sdFxPFpc/+vLw87xFVFQBE' +
            'XrxYZrovhEzBB+eBc4BTSB2mBabV34+WIqKoCjsiRA9MVHjm+eM/r96azLOMMAytor5mGf+ggBMhTxPiS98S' +
            'z51BorvpGhwFPTZ9VDsk+j/Is1SvvPWGzpbR06MV9Tc//GDq1vYy/uAuvxXHDI1PUBoapjZzBpO0EeMBiiqo' +
            'Ee57bD+VZ58jXpyn/uUM3JwY0R8gXwKdBf1l9nNVVf2kEul3oEu96FIBrUXoWdDLx19XVdXa2yf0I1B/m+/R' +
            'PTnmCELj31gg6CqgwM4HRol6rpL9voyGYEIwAJ7peMkyfMDPnEPbTUNusRsWdQqArcfEfQN0vzSNhCFqc3oD' +
            'n2hqP06Vxvk5iveW8AEcGA+QLesCtFaW8V54hYEnn+K/JK0mV04cI/zqfexApRPwLwJop0GeJWhYAODHmdOs' +
            'LS4Q5DmthTn6r5+lZ1eFOM07AQYcIkbbYAqdI7/vLprXlgDwsgzz8muU9wwRBiHe8F5aSYLdWMN4YkBw6hyF' +
            'Plg/9zUrX3xKKW2QXr6AzVKG902x4+lDBBsrBKU7yRHyICQwHnJ1fES7BEIB8Tzqf/xEertJeWQPa9e+Z/t7' +
            'H3PPEwep/7bC6tFX4d13oAjJHQNsmgDRR6szq0n6uKBWFN8EARiDWotL2/wqhuE3TzK490EA/jx/jvUL37B+' +
            'cZFmHCP6yNju6+3mpcCjOxQs4Jstp8bzSJoNbjZjeo9Ms/vgIYql0tZwnbcQVRUmJx6qNTY/K3qmy6DWIAYw' +
            'qop4PjbPWZ2vsfnwqCtOHWBndcz4xW30lEpO9PDhgFOnLPvGq3+lycnbmb1fAKuK0pnViqBBAduIiW8s07PB' +
            'fBWOAPW/AVNQggrceJHrAAAAAElFTkSuQmCC',
    // etymonline.com
    etymonline: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2' +
            'AAAAA3NCSVQICAjb4U/gAAAABmJLR0QA/wD/AP+gvaeTAAACR0lEQVQokWWRW0iTYRjH/+++4w4espWy0iJX' +
            'rcJZhmVSmETRSSpCssNdFEJFFNpNUDcKUV0o7CYUhMolYllBFqh0wE4EtY2RjDYUUdS1Ucsd3Pa979eFbkN9' +
            'rp8f///ze0gzTAAAMCTiCBgtVv3q5ZMD3ylmRBRgyXD7kAVAQdRYabk4YNMX50vG7MP36wurdzh7ngnIWgSQ' +
            'ZpgYFF3xiuvezvYjjWN9/TwMEYQb3D3BkcnOmivaVIW50QBIwn+87Vpw2DfS1y/DxCPbgLy+2x2Wo9UrrWUM' +
            'ymKAAusqNo85fQKggiYQpAh5n74C6Ka6qhj8FNE0wM9DWm0sFFGBZeVrdzfURkNhllCQjJUc2plrappw+Fwt' +
            'vRx0mQSEI7ocPQGC37zvbj2quHBy2j0KQXS8+CjIUumJPQr+ZirxgGfItaZsQwLgIPk9TrB4UbkF4FwP3nTX' +
            'NXo/uDjkZCypoEK+4cZUt/1s07C9NwnciX8Fo0Mdr8c//+Rk0d32REq54gEQcPHpPy0l58/Yb5bWVoUmg6DK' +
            'zO+QmqSnbFe7LrfyyFtwNAAOctg9YbPWanVFJIrK+mOD97p+2B7mr1/Fy6IKpoKRVP+0YEGGiUUTs5gC0RCB' +
            'I5AGmx7zelmUDFJRbvRXgECjWfx5EAYAUCkj0AQ+eUb73x5ov1SwayNDckFCGjEf3A8I5qqt4+/dROQLtpvL' +
            'ztV8aX1OwM1bSu+qoNnbCrec3hsL/uNlkZdFAEyhNKk47r5kswpAFgBzDEVsSSx46AEC4D/xot+e2tJRPgAA' +
            'AABJRU5ErkJggg==',
    // howjsay.com
    howjsay: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2' +
            'AAAAA3NCSVQICAjb4U/gAAAAXUlEQVQokc2SSw4AIQhDW+L9r8xswCABI7vpzvoaPkpVxUQ88C5MbkBaqJGM' +
            'aADriQpdnIHQa3bcl3Q2lDR0O67xDL8MpD1EVVereOlupxa4K2ZUMZjBy14rVP/yA3a2Ihnr2sirAAAAAElF' +
            'TkSuQmCC',
    // moviemistakes.com
    moviemistakes: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2' +
            'AAAAA3NCSVQICAjb4U/gAAAB3ElEQVQokW2RzU4iURCFv3u76Qa6RwgQFphAXLgwcefCuPAdfBTfz62Jmhg3' +
            'JEZXGiUBZBiYbpq+9F/NonHQxLM8db9TdauUiCQJ9/dYFkXBYBD3erUwZDjcOoeH606nzqc0EIbEMXGMMYxG' +
            'OTCZYMzWXCwyvkgDqxVKoRRas1w6kE6naL11Vit+BkpVKs7bm0mSraPUT0AQbMtpGmjNywuWRZL8LV9EkQb5' +
            'BkQRSpEkm/19G1DqF9BuJ2WK4/hxvOuijdnGZ9m6368vFoQhyyXdrnZd8pzVitdXPZ0iIoBdxgP1uiyXXF9T' +
            'q7HZMBhUfZ/nZ56euL31oojLy/DgYE8HAXlOluG6TCa4LrZNtcpwKJ7HZILj4Lr4PrMZgN3tGs+LQfl+5eoK' +
            'rQEsi8dH9+IimM/36nUArZlOAWzPq3petfzQ+3sJiAiWVbm5MY6DSKGUVorx+HNL/1UCIutOJ7Us7u4qWtNq' +
            '/RFBa0Yj9Q0IQ0QQwbaTkxMnzymKapZxdiZpilIY42dZtAM+PrAsRGg25eiINC1PyfGx9n1E0FrN58UOGI9R' +
            'iqKg0VDNJo5DntNo/K7V2s0mRYFSzGbK/jJS3GolQK+XAOfnm4cHc3qaAf2+Wa9NUaggyP4ByKzpLXzFh4gA' +
            'AAAASUVORK5CYII=',
    // letterboxd.com
    letterboxd: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9h' +
            'AAAABHNCSVQICAgIfAhkiAAAAm5JREFUOI2Nk0loVEEQhr/qfu/NTNwXCAaJuCYhYNwggqIz8ZCDIIqCKCiI' +
            'nrx68uzZU/DgQRQRb4IIruBMFDUKGlTcIm5xCQ5qlCRmlve6y8NEjfGg363hr7//qq4WJrBh694sKgcQViBS' +
            'D4BqEaUX0cNXzxzrHq+X8Yfs5j35IAxz3jtUFVTHVIKIYIwlieNC99njHX8ZrNu0u98Y2+i9mxjqD4yxeO/e' +
            'Xj93ct4vg7Ubd+aNsbl/FU8wKdw4f7pD2ju3Z8MwKJSqCWUvBAJ1VkHBV2sBTaQgioureOewYUSYShPHSc7O' +
            'XdjS9bWiS9bOGmV/6ycWTKpy+X2ayZmEORu/MaW5xMjrgNHBb7Rt2EZzeyeV0WEGB95gg2C2tKzf8mHXwpGG' +
            'g9nnkAQgjsfF2RzqgBmpWkvl0kcWDeRpWNyMdxBEcOVEF09uXRgwn8u+fl/bAFRDcAYqltZsHQsyAUlscLFn' +
            '1qTVLG9vplICl0C1DKs6d1D+PlRvEpeA/tfs/kTBJTFmmsTFo/dmQuTAKqSVR4VhXpUSglCxoeXLSA+9PU9J' +
            'Z8AGkMrAnQsnsWGqaBvmNuauFaMlz97VId5ysW8qOy5Ox12PkFAYehnyrGsOPWdP4RSGBz9z9fQRnvRcIkil' +
            'r0nTyvXZwNrCaOwYcUJklCkB4MFXxt49BWKUuFLCO0cQpQijDIlzOQFoWrYmL8bkVP1/tS9iUO8Lffdvdvxa' +
            '5UVLV/eLmMZ/mYgYVP3bFw9v/17ln8xvXZU3xtaS6NioGZNJrdh7V3j9+O7fn+kn85rashh7QGCFqtbXbpWi' +
            'Qi/eHe7ve9A9Xv8DOfgKZfVre3kAAAAASUVORK5CYII=',
    // yifysubtitles.com
    yifysubtitles: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9h' +
            'AAAABHNCSVQICAgIfAhkiAAAAihJREFUOI2lks9L03EYx1+f775bYZGVBm5G6EHrYMMUp+hmkEqbC8NLYGeh' +
            'a0RUp/4AgyLo0iVCwoTwkthWrItbTg8l/VigUAiBMAXdnM753fZ9OjhpboKH3qcPPO/n9Tzvz+cD/ynlC8mD' +
            'wvlLoFd9OMjkC8k9QAN2Ar3qSXFNTxncMHPGJYDugHimfWoWyO0ZPAEJJdNGD4Busw0CdiAOmABapF/5RLct' +
            'ZdObbCfXwu4paQYsAF3v5HEmudaTTW9iZraeTnvVBaBiX4SCubFlIh3OJuJVACdr686L0JZcXnoFcMJR9/yT' +
            'TxnAa+AzYBQDAPSKhramc3fHImY6dax4QlWD82X0mm4A40AUyJRusCfr6fbrLccH7kTI53QAR+uV0Vm/ygFv' +
            'nI++hiubnNsAYZ8yDwIAHPEE5eZCaOIFmsVcGRkcdwflDEIXYv7LrmlZIBbxKpdeAthBWM9sJkHTqLx4+U/e' +
            'xBvtV37g1F47IB2Txmh3QPpKARhC3tjaQGkWalx+S3p91QrUA/NAgt3n02K32/tSv+btpRHwBKUzscNDFHwf' +
            'UEHXlHhWf0QHEdnntVU74gvD9R1lgM4p0Wb8ygm0Ar/dQamJeJUBWAEp3Fu++a3csmnMlUWY8SsTiAGLnvfS' +
            '+vPj5DOgA9hm989oAKmV5fvVdoe1DFBQFsiGr6qZxrGNbxtDI4ulhkwiHpsbrl0si1AiBZwFXIXp+aLaUSB5' +
            'SP/h+gtqEM47WprwzAAAAABJRU5ErkJggg==',
    // metacritic.com
    metacritic: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9h' +
            'AAAABHNCSVQICAgIfAhkiAAAAsFJREFUOI1tk19MUwcUxr9bNfyRIsksUGxRh13QrdD23tvbKtEnHxbf2RIW' +
            'XTQ8zBgTYY/bDNnAh70umVH7gIjRRBOjiY/GGJXouIXYEV2yLZaWlWwGSEq0AuW3BzYQ9Xs8Od/vJOecz9B7' +
            'RNoa1nJ5Tl7juJYlvVRGMsYM0z3ydq+xzujanar3XNVCSeOZCmUnPSovSVsbFrU/IqkOqbDpsmE96np3qhuf' +
            'JN/OnSGbGr9FVWMEKYB/e5iWjxwkLz/1JWCqDdz4pN6eTK6dc/0J5AkTt21CoRB9p7/jfz0aeYgkjnY6K5BR' +
            'Z3gNkE2QuWkhteHEbdrCYSQBMF0oMF8sApDP5ZDE2b4k5KLg2l3CTXSR/5ikncAybQLBZr48fJjhoSEAJCGJ' +
            '2ZkZALLZ5yvwCRvSZkqkzcGZhw6qj9Da2kpvTw9vaqC/n4qaGiQxNzsLwMVL17j5cwBc84lwY6mxGw7y7KJl' +
            '507u37vHVD7PhQvnVyGnv/2GKq+X5mCQ27duIYnBHzrgWQThxlKj16Mc/LRz1XDyxAkk0dtzarV2ZmCAXaEQ' +
            '2wIBPmy1GPx+LzyLItLm4OyIg/QBo48fAzBfLNIcDFJbV8fXvb0AjKfTbPX5cGyb2qZ27l6ywY09+W+Jn3Ag' +
            'mUTSGmS+SJPfj6++ge5jR6nZsoW4bRO3LeSNwkQM0mbKWDljkqe/LmjPobKkcY25riKxmF6XStrX0aFSqaTN' +
            'VVWSIf02tagfv6pU95FF6Z8NX3gkSS+WPtsdKyt1plKqjChqmvrzj9+VzT5XYbqgzdXVkiE9nVrS5wcq1H3s' +
            'pfT3psuG+csbzzSyv5PpKA+uWPh3xJF8SA00tUSpbmxHdSbn+h34K7zuld8Nk89zVeVXykxUKpcztLRgyNdY' +
            'VjJclmoNaXrjujCtA6yBrGEZzKlax7WMVDIyQu+N8790hM1k8ujEKwAAAABJRU5ErkJggg==',
    // episodecalendar.com
    episodecalendar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9T' +
            'AAAAA3NCSVQICAjb4U/gAAAAJFBMVEVHcEwAAAD////aAITcFIzrcbb/x+b4wN/bDIr85vPfLZbgNJg8aJ4s' +
            'AAAAAXRSTlMAQObYZgAAAE1JREFUGJWFj1EKwCAMQzVprbr733d2jDqksAeh8D5CU8ov9SATAKwBbQWvUFI9' +
            'IShCz1c4Wxi7SKeFwJjkNXbpQvU5+R+HiAX5mmTsDdtYAZGXfh1PAAAAAElFTkSuQmCC',
    // myanimelist.net
    myanimelist: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2' +
            'AAAAA3NCSVQICAjb4U/gAAAAeklEQVQokWOUdZ7NQApgIkn1qAYiAYuKnAAy/86jD1hF7jz6ANWQE2WALF3Q' +
            'cQCrSEHHAYSTIBy4EAMDw5RlFyCIj5uNgYFBkI8dYcD///9lnWejkcgALg5BLFh9JucyB8J4tCcFwrDUl4T6' +
            'AX+YwMHKXm8Ig5HmqRUA8JdDvIND/PoAAAAASUVORK5CYII=',
    // last.fm
    lastfm: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9h' +
            'AAAABHNCSVQICAgIfAhkiAAAAYVJREFUOI2lksErg3EYxz+/9xUlarKFHOS2cqFmZzlwWO2IdkGtkH/BzdlJ' +
            'WXGUg/vwvgfRjg4o5aCtVisM2UJJ2ft1eV/WuGy+9dTv+f2ez9Pz9P0ZQfICth+hjyYUgfIYLJkzeKpAbzNw' +
            'oBBUrFZhgCr0WK3CgdrqE88PAQaw/PCAml9jGiCrHg6nUkze35OQmCiV6J2Z4RPoX1lh6uWFhEQ8l8P7q4EN' +
            'xPb2KGYyZI2htLvL+P4+Bhjd2uJqeZmsMWDbdMdiKJjIBXlAXzrN6M4OWWPoAD6A6WqVfCbDYDJJeyTCnetS' +
            'nJ/nw/OwGyewOju/uwYPt47D0NwcpyMjFDY36R4eZrJWoysa/al1QQ7oGCRJ12trOgBdr68rNzAgSbrZ2FAW' +
            'dAjyJF2uruoI5IJw/cMR6Dyd1nu5LEl6LRR0Eo3qbHZWb/m8JMmTdOc437ALMi4/0zTaZfuWBtYGqwX7//oH' +
            'ge/1Mn/cNTL/khWC51bhEFSsOCyG4aFZOAwPcVj4AmQVq8I3yAO8AAAAAElFTkSuQmCC'
};
