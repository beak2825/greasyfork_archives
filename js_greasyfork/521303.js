// ==UserScript==
// @name         Safari Search Redirector
// @name:zh-CN   Safari 搜索引擎重定向器
// @name:zh-TW   Safari 搜尋引擎重定向器
// @namespace    https://github.com/hxueh
// @version      0.3
// @description  A Safari-focused userscript that redirects searches to other engines using keywords, providing search engine customization that Safari lacks
// @description:zh-cn 这是一个将 Safari 重定向到其他搜索引擎的脚本。主要是解决 Safari 自定义搜索引擎能力缺失的问题。
// @description:zh-tw 這是一個將 Safari 重定向到其他搜尋引擎的腳本。主要是解決 Safari 自定義搜尋引擎能力缺失的問題。
// @author       https://github.com/hxueh
// @match        *://www.google.com/*
// @match        *://www.ecosia.org/*
// @compatible   safari
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAACAKADAAQAAAABAAACAAAAAAAL+LWFAAA4kklEQVR4Ae3dCbQtV1kg4BsykjlkYpDkJRGiCUnQEIYAIQxGUEAEFVCIiC2tLGkEB9B2QNtlC7YtOLQNgkBsbQRBWmRUBpkNMxkAkeQlhCRA5oHMof/f9+5777w7naGq9q6qb6/1r3vuOVV7+GpX1T51alhakggQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQINCMwC7NZCMXAoMUOCRadUTE4REH7xT5WcYBEXtF3DUi0/4Ru0bcJSI/y3RzxE3/8Wpp6fr4e3vEnRHXRuRnV+4Q39z6+oqtf78af78WkfNIBAgQaEzAAKAxShn1UGC3qPN9I46N2LQ1jtrh9X7xuoZ0W1TikojNERdu/ZuvvxxxfsR1ERIBAgRmEjAAmInLxD0WOCjqfnzEyRHHbX39PfF374i+p8uiAedF5GDgU1vji/H3jgiJAAECqwoYAKzK4s2eC+we9c8d/akRD414SMQ9IsaUvhWNzcHAR7bGR+PvVRESAQIE/kPAAEBHGIJAHqo/LSJ39hmnRCz/Jh8vpRD4dsQXIpYHBP8SrzdHSAQIjFTAAGCkC34AzT462vCEiMdHPDxizwhpNoELYvJ/jvjHiH+KyBMSJQIERiJgADCSBT2AZua3/DMiHrs1vmMAbaqpCfmTwfsi3hXx9ojNERIBAgQIECgikIfx81v+WRE3RORhbNGNQZ5U+JKIYyIkAgQIECDQukBeU7+808/L2+zwyxvkYOBFEfeKkAgQIECAQKMCefLe6yLs9Mvv8NcadOVlhe+PeEZEDtQkAgQIECAwl8CBMddzIj4XsdZOx/t12lwTy+yVEfePkAgQIECAwFQCeY1+7jxujLCD77/BJ2M55kBu3wiJAAECBAhMCOwR/50ZcU6Enf4wDfLZBq+IuHeERIAAAQIjF8iH4zw/Iu9lb8c/DoNbYlm/MeKUCIkAAQIERiZwVLQ3vw26fG8cO/21Bncfjj6QV3W450ggSAQIEBiywJHRuPx9/7aItXYK3h+fTZ7o+aMREgECBAgMTCB/981v/Hk7WTt4Bmv1gY9G/8gjAhIBAgQI9FzgsKj/70fcFLHWRt/7bHbuA/nTwCMjJAIECBDomcABUd8/iMh7yO+8cfc/k2n7wDui/xwfIREgQIBA5QJ3ifrl5XyXR0y7kTcdq/X6QN5hMJ/3cGiERIAAAQIVCpwedfpMxHobc5/xmbcPXBV9K585kPeMkAgQIECgAoE8wS+/od0ZMe/G3Xzspu0DX4x+9oMREgECBAgUEtg9yv3VCCf42XlPu/Nucro3Rd+7e6G+r1gCBAiMVuCkaPknIprcoMuL56x94Orog/mcATcSCgSJAAECbQrcNTLPy/puj5h1Y216Zm31gQ9Gfzw2QiJAgACBFgROizy/FNHWRly+bBfpA3nJ6Usi8qcpiQABAgQaENgr8si7+DnJzw56kR10V/OeHX31Pg30e1kQIEBg1AJ5E5a8T3tXG2/lsG6iD9wYffb5o15zNZ4AAQJzCuRJVbkBde9+O+Qmdsil8nhz9OG7zbkOmI0AAQKjEzg8Wpy3YC210VYu+yb7wMXRl0+PkAgQmEFg1xmmNekwBB4bzXhvxInDaI5WEFg6IAzy9tS5PcurBXJwIREgQIDAVoE85J+3WXV5n2/fTX77ri2vPLLlJ4GtK70/BNYTcHON9XSG81l+Qzor4onDaVKnLbk2Srtoa2yOv3nP+owrd/qbV1FcH5GDrExXb/mztFv83W/r67ziIu+1kJeyHRyRO6sd/x4W/x+xNTbF35xWmk3ggpj8yRF5cqtEgMAaAgYAa8AM6O08y/8tEfcdUJvaaMptkem/RZwbcU7EeRG5I8nfl6+JKJXyfI0jI46OOCHiflvjqPhr/Q2ENVLeMyDvIPjXa3zubQKjF7ABGXYX+NFo3l9G7DvsZs7cuvyGnjv5j0V8POKzEXkDpFsj+pJymR4XcXLEgyMeEuHa+EDYKf1x/P+LEctHZXb62L8ECBAYnsCvRZPujKjtN9oS9cmHGb0nIk1Oj9gnYojp0GjUEyJ+L+JfI+6IKOFdW5nvCof9IyQCBAgMWiB/b/7ziNo2wl3X5yth8MqIPAqy/Pt7vBxVOjham+1Ph4siul4GNZWXR3yOiJAIECAwSIH8lvPuiJo2vF3VJb/tfjgib25kQx8Iq6ST4r3fiTg/oqvlUlM5l0S77x8hESBAYFAC94zWfDqipg1u23XZcad/r0EtzfYbkycV5mApB01tL6ea8r8+2vv4CIkAAQKDEDgxWvG1iJo2tG3W5YJo629E3DtCWlwgvxXnyXJXRrS53GrJO6/4+E8REgECBHotcHLU/oqIWjaubdUjn1nwxog8yc0dLAOhhbRn5JnnDLwtYug3jMoTZH8xQiJAgEAvBR4etc6b1LS1060h3/zd9sURecMcqTuB/Ing5RHXRdTQD9qqQx5JkggQINArgUdGbfP3zLY2jKXzzfMZ8kYueec8qZxAXkGR5wpcGFG6T7RV/kujbe6JEggSAQL1C/xQVDEPibe1QSyZb97LPY9sSHUJ7BbVyZ8H8qZJJftHW2X/abTLICAQJAIE6hX4sajarRFtbQhL5Zs3a3lwvexqtlUgd5JPifh8RKm+0la5r4k23SVCIkCAQHUCT4waDW3nn5ehnV6dtAptJJADgTwhc2iXnuYgwJGAjZa+zwkQ6FTgjChtSIf9c8fxyE4FFdaGQH5j/smIPFmzrW/mXef7B21AyZMAAQLzCJwaMw3lhL9Loy15cp9L+ebpCfXOs3dU7UURQ7lq4DfrpVYzAgTGInBKNHQIl/rl41n/W4QnEw67535HNO+siLzOvutv7k2X98JhLyqtI0CgZoETo3JDuDtbPp/g6Jqh1a1xgYdFjn1/5kAOYvJolUSAAIFOBfLe/hdHNP2tpsv8ror65wbUSVWBMMK0e7Q5fxbo87krd0T9nzTCZafJBAgUEsibr/T9euu8be+hhfwUW5fAd0Z13hvR5eCzybLy5yuXqNbVp9SGwCAF8oYr74pocgPWZV6XRd1/YJBLRqMWEcijQHlHwZsiuuyPTZWV/frICIkAAQKtCfxZ5NzURqvrfN4Zdb9HazIyHoLAcdGIvt474Lyo+0FDWAjaQIBAfQIvjip1vdNuorw8RJrf7vzWX1+fqrFGeW7ASyLy9/Um+l+XeXwg6rxHhESAAIHGBPL2qn28dOpTUe/7NKYgozEJPDoam4fWu9yBN1HWX4xpIWkrAQLtChwb2ffxWv+/inrnDWAkAvMKHBYzvi+iiR1zl3m4PHDeJW4+AgS2CeQZ//nbYpcbr0XLysu68pC/RKAJgTzx9fcjFu2XXc6fz+R4aBONlwcBAuMUyN/M3xTR5YZr0bK+GvV1SdQ4+2vbrX56FHBDxKJ9tKv5L426Oum17V4hfwIDFejbSX8fjeXg2v6BdsZKmnVS1CMHmV3txBctJ+9vkEcwJAIECEwtkCdA3R6x6Aaoq/n/Lup616lbZ0IC8wvkt+pPRnTVtxct52XzN9WcBAiMTSA3cN+IWHTD09X8+fusS/zG1kvLtjcfGvWPEV318UXKyat3nliWS+kECPRBIHekb49YZIPT1bx5hOK5fUBVx0EK7Bqt+uOIrvr7IuV8M+rpfIBBdkONItCcQJ49v8iGpqt585atT2iu2XIiMLfAr8ecXfX7RcrJO2E6Ujb3YjYjgWELHB/Ny7vmLbKR6WLeG6OOZwx7UWhdzwTySFQf7hz4X3rmqroECHQgsGeU0Ycn/F0f9XxkBx6KIDCrwDNjhtsiuhgEz1tG3iPjxFkbZnoCBIYt8PJo3rwbla7muyrq+KBhLwat67nA06L+eROertaJeco5N+rnipmedzTVJ9CUQH6jrv0+/1dGHfMabIlA7QI/EhWs/RLal9aOqH4ECLQvkIf+vxAxzzeJrubJ5xA8sH0KJRBoTCB/Dqj5nID8qeLkxlorIwIEeilQ+z3O86TER/RSVqXHLvDsAKj5yFqe85OPPpYIEBihQJ4MVPPvlbdE/X5ghMtFk4cj8AvRlK6OlM1Tzi8Ph1pLCBCYViDvD17z7UzzN9QnTdsY0xGoWOB3o27z7Jy7mCcvqT2mYjtVI0CgBYEc+XexgZm3jOe10GZZEighkDffeX3EvOtC2/O9P+qWdZQIEBiBwJHRxhz5t71hmTf/PxrBMtDEcQnsEc39QMS860Tb8+VJixIBAiMQ+NtoY9sblHnzzwes5D3WJQJDEzggGnROxLzrRpvzXRb12n9o4NpDgMCkwKnxb61nJuc5CftMVtd/BAYlcFS05vKINnfm8+ad5ypIBAgMVOAu0a5aT/zLbyD3HKi7ZhHYUeC0+KfGq2/yAVubdqyo1wQIDEfgp6Mp8347aHO+vCnJI4bDrCUENhR4QUzR5jo1b95v3LDmJiBAoHcC+0WNL42Yd8PQ5ny5MZQIjE3grGhwm+vVvHk/YmwLQnsJDF3gv0cD590gtDlfnpAoERijwL7R6HwwT5vr1zx5fzrqlD8XSgQIDEDg7tGGGi/7Oz/qlRtBicBYBY6Nhl8XMc+Ous15njrWBaLdBIYm8IpoUJsbi3nyzueS339o0NpDYA6BZ8U886xDbc7zpahT3i1UIkCgxwJ5Zn0+UKfNjcU8ef9Sj01VnUDTAm+IDOdZj9qc5xlNN1J+BAh0K/DnUVybG4l58v5g1MnNfrrtB0qrW+DAqN5FEfOsT23N8+Woj6MAdfcbtSOwpsCR8Uk+Ua+tDcQ8+V4d9TlizRr7gMB4BR4TTb8jYp71qq15nj3exaHlBPot8Jqoflsbhnnz/fF+k6o9gVYF8jkY865bbcx3YdQnn2MgESDQI4FNUde8wU4bG4V588z7/EsECKwtkLfCzp3uvOtYG/P9zNrV9QkBAjUKvDwq1cbGYN48b4j65H3QJQIE1hd4bHw873rWxnx5RYD7Aqy/zHxKoBqBPKHo+og2Ngbz5vn8anRUhED9Av83qjjvutbGfE+on0wNCRBIgRdHtLERmDfPs6M+zvrPJSMRmE7gkJjsmxHzrnNNz/eB6aptKgIESgrkCTuXRDS9AZg3v9ujLieVBFE2gZ4K5G/v8653bcz3gJ46qjaB0QicGS1tY+WfN8//PRp5DSXQrED+7l7T47vzZwmJAIGKBT4TdZt3Z930fHmP83wOgUSAwHwCp8dsTa+X8+aXR/OOnq8Z5iJAoG2B06KAeVfuNuZ7UdsNlj+BEQj8fbSxjfVznjzzqaISAQIVCvxV1GmelbqNeS6IuuxVoZEqEeibQH7rzodntbGezprn5VGP3fsGqL4Ehi5wUDSwpof+PG3o4NpHoEOB/xllzbqzbmv6H+6w3YoiQGAKgefFNG2t8LPme27UxY1DplhoJiEwpUBeFpjn1My6LrYx/dunrLPJCBDoSKCmk/+e3FGbFUNgTAIvjca2sUOfNc98YNGRY4LXVgI1CzwoKjfrStzW9OdEXXz7r7m3qFtfBQ6OitdyFOC3+oqo3gSGJvDqaFBbO/RZ8/X74NB6l/bUJJBn4c+6TrYx/UVRD3f3rKlnqMsoBfaMVl8T0cZKPmuen4567DLKpaDRBLoRqOlcgEd202SljFXAoeSNl/zjYpIDNp6skyleFqXkoEEiQKAdgSsi29e0k/XMuf7YzHOYgQCBRgX+JnKb9Zt6G9Pn8wdcH9zoopUZgVUFNsW7eVe+NtbjWfLMhxXtFiERIFBAIG+0c23ELCttW9P+SoH2K5LAWAX+Lhre1ro8S76PGesC0G4CpQWeEhWYZWVta9obox55hrJEgEA3Ag+NYtpan2fJ91XdNFcpBAjsLPC38cYsK2tb0/7JzhXzPwECrQt8PEpoa52eNt+rog75CHKJAIEOBfaOsm6ImHZFbXO67+6w3YoiQGCLwDPjT5vr9bR5P9YCIUCgW4EfiuKmXUHbnO4j3TZbaQQIbBW4a/y9OqLN9XuavP/cEiHQhoDLANdWrWXUXcslSWtL+YTAMAVuima9oYKm1bItqoBCFQh0I/CVKGaa0Xmb01wfddivm+YqhQCBVQROiffaXMenzfu7VqmbtwgsJOAIwOp8+Zv70at/1Om7eRJiDgIkAgTKCHwiiv1cmaInSn3cxH/+IdCAgAHA6oi1HHJ77erV8y4BAh0KvK7DstYqygBgLRnvE2hY4D2R37SH5tqa7qtRB/f9b3jByo7AHAL3iHnuiGhrXZ8m35uj/H3nqLtZCKwp4AjASpq8/O/hK9/u/J03RYm5YZAIECgrcFkU/7GyVVjKh5I9onAdFD8wAQOAlQs0d/57rXy783fe3HmJCiRAYC2BvDVw6fR9pSug/GEJGACsXJ4PW/lW5+98LUos/Y2j80YrkEDFAsvPBihZxbw9sUSgMQEDgJWUNaxkubG5c2XVvEOAQCGBfBrnxwuVvVzs/eOF8wCWNfxdWMAAYJIwH72Z1/2WTv9QugLKJ0BghcD/W/FOt2/k9umB3RaptCELGABMLt0aRtj55D+3/51cLv4jUINAXh1UOtVwhLK0gfIbEjAAmISsYeV6f1Tplslq+Y8AgQoEPht1yCsCSqYatlEl26/sBgUMACYxT538t8h/7y5SqkIJENhIIC/Lfe9GE7X8+UMi/11bLkP2IxEwAJhc0LlylU41HGYsbaB8ArUKlB6g7x8wx9WKo14E+ipwcFQ8R/gl44K+4qk3gZEIHB7tzCt0Sm4nzhyJtWa2LOAIwHbgk7a/LPbqg8VKVjABAtMIfD0m+tI0E7Y4zf1azFvWIxIwANi+sE/Y/rLYKzf/KUavYAJTC5ReT0+cuqYmJLCOgAHAdhwDgO0WXhEgsLZA6QFADduqtXV8QqCHAmdHnUv+rnddlO/s3h52HFUencDx0eKS24os+9DRqWtw4wKOAGwhTYfSZ9bmACQfOSoRIFC3wPlRvasLV9F5AIUXwBCKNwDYshSPiT/7FF6g/1q4fMUTIDCdQH4D/8R0k7Y2lZ8BWqMdT8YGAFuW9XdXsMg/X0EdVIEAgekESq+v3zVdNU1FYG0BA4AtNketTdTZJ+d0VpKCCBBYVOC8RTNYcP5NC85vdgJLBgBbOsGRhfvCrVH+lwvXQfEECEwvcO70k7YyZQ1fWlppmEy7EzAA2GJdemX6YlTjtu4Wu5IIEFhQIE8EzDsClkqbouBdShWu3GEIGABsWY6bCi/O0t8mCjdf8QR6J/CtqHHJW3fvFeXfvXdqKlyVgAHAlsWxqfBSyW8TEgEC/RIovd6WPnLZr6WltisEDACWlg4KlQNXyHT7xuZui1MaAQINCGxuII9Fsti0yMzmJWAAsLRU+gTA7IUX6YoECPROYHPhGjsCUHgB9L14A4A6fkcrvSHpez9WfwIlBC4uUegOZR62w2svCcwsYACwtHTwzGrNzpBn/1/WbJZyI0CgA4HNHZSxXhGHrPehzwhsJGAAUH4AcEksJM8A2Kin+pxAfQKbC1ep9JeXws1X/KICBgB1DAAWXY7mJ0Cge4Ero8ibui92W4kGANsovJhHwABgaan0YbQr5llw5iFAoAqBHASUSqW3XaXardyGBAwAyh8BKLkBaagbyYbAaAVKrr+OAIy22zXTcAOA8kcArmpmUcqFAIECAiXX3/2ivXsWaLMiByJgAFD+JkAlNyAD6caaQaCYQMkjANnovJGZRGAuAQOApaW8p3bJVHoDUrLtyibQd4HS668jAH3vQQXrbwCwtLRHQf8s+rrC5SueAIH5BUqvvwYA8y+70c9pAFD+N7RbRt8LARDor0Dp9bf0F5j+Ljk1XzIAKH8E4Fb9kACB3grknTxLJkcASur3vGwDgPJHAAwAer4Sqf6oBUofATAAGHX3W6zxBgCOACzWg8xNYNwCpQfwfgIYd/9bqPUGAI4ALNSBzExg5AKlBwCOAIy8Ay7SfAOApeLnQdy5yAI0LwECRQVKP8hrt6KtV3ivBQwAlpZKn8Sze697kMoTGLdA6W/gpbdf4176PW+9AcDSkkN4Pe/Eqk+goEDp3+BvL9h2RfdcwABgaan0WbylNyA978KqT6CoQOn11xGAoou/34UbAJQ/AlB6A9LvHqz2BMoKlF5/DQDKLv9el24A4AhArzuwyhMoLFB6AOAngMIdoM/FGwCUPwKwT587kLoTGLnA3oXb/63C5Su+xwIGAOUHAHfrcf9RdQJjFzikMMC1hctXfI8FDACWlm4ovPwOLly+4gkQmF/goPlnbWTO6xvJRSajFDAAWFoq/TxvRwBGuepp9EAESh4ByJuIlf4CM5DFOM5mGAAsLV1ReNE7AlB4ASiewAICJdff/PbvTqILLLyxz2oA4AjA2NcB7SewiEDJnwCuW6Ti5iVgAFB+AHB33ZAAgV4K7BW1PrBgzb9esGxFD0DAAKD8AODIAfQjTSAwRoFcd3cp2PDLC5at6AEIGACUPwdg/+hHJb9FDKAbawKBIgKlB+8GAEUW+3AKNQAofwQge9Om4XQpLSEwGoHSA4BvjEZaQ1sRMABYWvpaK7KzZVp6QzJbbU1NgEAKbCrMcFnh8hXfcwEDgKWli2IZ3lF4ORoAFF4Aiicwh0Dp9faSOepsFgLbBAwAlpbyaVqXbhMp8+I+ZYpVKgECCwjcd4F5m5h1cxOZyGO8AgYAW5b95sJd4ITC5SueAIHZBHLbedxsszQ+9ebGc5ThqAQMALYs7gsLL3UDgMILQPEEZhQ4KqYv+STPq6P8a2ass8kJTAgYAGzh2Dyh0v0/+TyAe3RfrBIJEJhT4H5zztfUbJubykg+4xUwANiy7EsfAchaOAow3vVQy/sncHzhKl9QuHzFD0DAAGDLQqxhZSr9jWIA3VkTCHQmUHp9/UJnLVXQYAUMALYs2nMrWMKnVFAHVSBAYDqBB043WWtTnddazjImMEKBvKb22wVj8wjNNZlAHwUOi0qX3FZk2Sf2EU6d6xJwBGD78vj89pdFXh0Zpd6rSMkKJUBgFoFTZ5m4hWnzxmVfaiFfWY5MwABg+wI/Z/vLYq8eVKxkBRMgMK3Ag6edsKXpvhL53tJS3rIdkYABwPaFXfoIQNbkIdur4xUBApUKlD4C8OlKXVSrZwIGANsXWA1HAEpvWLZreEWAwGoCe8SbD1jtgw7fMwDoEFtR4xDYPZqZh9VKntyTzyU4YBzcWkmglwKPilqX3EZk2af3Uk6lqxNwBGD7Ismdb+mfAXaLOuQGRiJAoE6BMwpXKwcAnylcB8UPRMAAYHJBfmTy3yL/fX+RUhVKgMA0AqXXz3+LSl47TUVNQ2AjAQOASSEDgEkP/xEgsF3g8Hh50vZ/i7w6u0ipCh2kgAHA5GKtYQCwKapU+jnjkyr+I0AgBb4vYpfCFB8sXL7iByRgADC5MC+NfzdPvlXkv8cXKVWhBAisJ/AD633Y0Wcf6qgcxRAYpcD/iVaXPsu3hiMRo1z4Gk1gDYG94v387b3ktuEbUX7pIxBr8Hi7jwKOAKxcajXsfPOGQEesrJp3CBAoJPC4KHf/QmUvF/sv8SIHIBKBRgQMAFYy1nCILUf5P7yyat4hQKCQwFMKlbtjsX7/31HDawItCVwc+ZY81Jdl1zAQaYlXtgR6JbBn1Lb04f/cJjg5uFfdRmX7KvAXUfHSA4B84tc9+wqo3gQGJPDEaEvp7cGFA/LUlEoE/ASw+oJ41+pvd/puLptndFqiwggQWE3gzNXe7Pi9d3dcnuIIjFYgT/a5NaL0qP9LUQdn/Y62G2p4BQIHRx1ujii9LXhyBRaqQGA0Astn3JZe8R82GnENJVCfwAuiSqW3Afll5MD6aNSo7wJ+Alh7CdbwM0DW7tlrV9EnBAi0LPCslvOfJvsPxETXTDOhaQgQaEYg7/ldeuSf5d8QsV8zTZILAQIzCDwwpq1hG/BzM9TZpAQINCSQT96qYQPwsw21RzYECEwv8OqYtPT672qg6ZeXKQk0KvC7kVvpDUCWnycD+rmm0UUrMwLrChwWn94UUXr9r+HOpOtC+bC/AnYq6y+7N67/cWef5g1A8lakEgEC3Qg8N4rJ+/+XTm8tXQHlExizwPnR+NLfArL8fx7zQtB2Ah0K5J3/Lo8ovd7fGXXYFCERIFBI4Lej3NIbguXy88REiQCBdgV+JrJfXudK/v1Au82UOwECGwkcHxOU3AjsWPbrNqqszwkQWEggfxY9L2LH9a7U6+cs1BIzEyDQiMA5kUupjcCO5d4W9TimkRbJhACB1QR+NN7ccZ0r9fqWqMfdVqug9wgQ6FbghVFcqQ3BzuW+ttumK43AaATy2/+5ETuvcyX+//vRqGsogcoFarkfeG6Ibo84tnIv1SPQR4GnRqVL7OxXK/PxfQRUZwJDFXhDNGy1FbXEe68fKrJ2ESgkkN/+Px9RYn3eucxLoh67FnJQLAECqwg8Ot7beUUt9X8eBch7A0gECDQj8PTIptT6vHO5v9NMk+RCgEBTArtERl+O2HllLfX/W5pqmHwIjFxgj2h/Let23vr3yJEvD80nUKXAr0atSu3wVyv39CqVVIpAvwR+Jaq72vpV4r139ItObQmMR+Ae0dS8PKfEhmG1Mj8ddcnfLiUCBOYTyHv+Xxux2vpV4j23/J5vOZqLQCcCeQJeiQ3DWmX+VCetVgiBYQq8Kpq11rrV9ftfiroY0A+zn2nVQATydrx5j+6uNw5rlXdp1GXfgdhqBoEuBU6MwvKE2rXWra7fzwcQSQQIVC7wnqhf1xuH9cr7w8q9VI9AbQL5TftDEeutV11+dnXUxUC+tl6iPgRWEfj+eK/LjcNGZeW3mAesUk9vESCwusDPxtsbrVddfv7S1avpXQIEahT4bFSqyw3ERmV9Luqze41Q6kSgMoG7R33yG/dG61RXn98cdblnZUaqQ4DAOgLPis+62kBMW84vr1NfHxEgsEXg7+LPtOtUF9P9mQVDgEC/BPaM6l4c0cUGYtoyboz6HN0vRrUl0KnAE6O0adenLqa7NeqzqVMBhREg0IjAf45cuthIzFLGh6NO7iPeyOKVycAEDon25FUzs6xPbU/72oEZaw6B0Qjkb+4XRLS9kZg1/18bzRLQUALTC7w1Jp11XWpz+tuiPp7pMf3yMyWB6gSeHTVqcyMxT965YXlQdVIqRKCcwHOi6HnWpTbneXU5DiUTINCEQB5u/2JEmxuKefLOh5u4rriJJSyPvgscEw24LmKe9aitefKW4kf1HVb9CRBYWvqJQGhrQ7FIvq+0cAiMXGCPaP/ZEYusR23M+8cjXy6aT2AwAnkU4LyINjYUi+b5zMEoawiB2QX+NGZZdB1qev68WifvRSARIDAQgR+MdjS9oWgiv5uiXt87EGPNIDCLwI/HxE2sQ03n8duzNMK0BAj0Q+CdUc2mNxZN5Hdh1OvgfhCqJYFGBE6IXPKbdhPrT5N5fC3qtE8jLZQJAQJVCXx31CZv7NHkBqOpvN4W9coHoEgEhi5wYDQwT4Jtat1pMp+fHDq+9hEYs0Ce3NPkBqPJvBx6HHPPHEfb83yct1e6Dn4q6mUQPo5+qJUjFbhbtPvKiCZ33E3ldWfU68yRLhfNHodAjSf95fqb697Dx7EItJLAuAV+Pprf1E676XzyJ4pHj3vxaP1ABV4Q7Wp6fWkqv9cP1FyzCBDYSWC3+L+2xwXvuCG7Kur3XTvV2b8E+izwpKj8HRE79vNaXuejhw/vM666EyAwm8ApMfntEbVshHaux1eibofN1iRTE6hS4IFRqxrP+F9e555bpZpKESDQqsAfRu7LG4Ea/34u6pfnLEgE+ipwbFT88oga16+s0ycj8sREiQCBkQnsHe3994haN05Zr49H7BchEeibwDFR4byuvtb16+ao20l9Q1VfAgSaE3hUZJVnANe6kcp6fTjCzUkCQeqNwHdETS+IqHm9ypMSJQIERi6QZwDXvKHKur07Ys+RLyfN74fAoVHN8yNqXqf+Kernmv9+9Ce1JNCqQN6G97KImjdYWbe3RhgEBIJUrUA+ROeciJrXpbwPyL2qFVQxAgQ6FzgjSqz9p4DcqL4vYt/OdRRIYGOBI2KSf4uoeeefdXvqxk0xBQECYxN4RTS49o1X1u9DEfuPbeFob9UCR0Xt8tLV2tef11atqHIECBQTyMPreeld7RuxrF9evnRIhESgtEA+ZKvms/2X1+c8KdHAuXRvUT6BigVOiLrdFLG80aj5b/7Weu+KLVVt+AKnRhOviKh5PVmuW64vBs3D75NaSGAhgV+IuZc3GrX/vTTqevJCrTUzgfkEnhKzfSui9nVkx/rlET6DgPmWt7kIjEJgl2hlrY8s3XFjtvz6+qjv40exZDSyFoEXR0X6cNLs8jqy4998DohBQC09ST0IVChwUNSp9rsE7rhRy+caPK9CR1UalkA+SOt/RezY9/r42pGAYfVLrSHQuMD9I8eaH2Ky2ob3T6POezQuIUMCS0t5g59/jlit3/XxPUcC9GoCBNYV+PH4tG8bt09EnY9ct1U+JDCbwPfG5BdG9G1d2Ki+jgTM1g9MTWB0AvmteqMNSW2ffzPq/JjRLSkNbkPgzMi0byf7zbI+GgS00WvkSWAgAnlI/SMRs2xUapj2tqjzL0XkSY0SgVkF7hozvC6ihr7cdh38HDBr7zA9gREJ3CPaelFE2xuiNvJ/Z9Q779EuEZhW4HtiwvMi2uiPteaZg4CDpwUyHQEC4xI4Lpp7dUStG7D16pU/CTxpXItLa+cQyKNFz4+4OWK9/jTUzxwJmKPTmIXAWAROj4beEtHXDeBZUXcPEwoEaYVA3lXyfRF97dtN1dsgYEXX8AYBAssCPx0vmtrYlMgnn9h2+nJj/B29QH7r/6mIqyJK9Mcay/xMWPg5IBAkAgRWCvxevFXjhmvaOuVd3PJogDuirVy2Y3rnmGjsP0VM22/GNJ0jAWNaE7SVwAwC+a3pbyL6vkG8PNrw9BnabdJhCOSVLb8e0ZcHX5VazxwJGEZ/1woCjQvsHjm+LaLUxqnJcvNKgWMbF5JhjQKPikqdG9Fk/xlyXgYBNfZidSJQgUB+k8qd5xA2gHnfgFdG5C1fpeEJ3Cea9MaIIfTVrtvg54DhrQ9aRKARgb0jlw9GdL1Raqu8PBnsRRF7Rkj9FzgwmvD7EWO9tK+p9cQgoP/rghYQaEUgN7KfimhqY1NDPl+M9jwt4i4RUv8EcmD6woi8B0QN/WkIdfBzQP/WAzUm0IlAnlE/xN9W845weT/4XTtRVMiiAnnk5jkRX4sYwk63tjY4ErBoDzU/gYEKHB7t+nxEbRutJupzTrTrRyIcEQiEClPeu//5EZdFNLG85bG246fD2H0CAkEiQGBS4KD492MRQ92A/nu0LXc0+0RI5QUOiyrkORu+8Xe7zvk5oHzfVwMCVQrk7XbfGzHUQUC265qIV0TkLWSl7gXuG0Wm/5Af1Vv7+mMQ0H2/VyKBXgjkN+Qx3GUtn43w1xGPjMgbJEntCeTv+z8W8Z6IvJtj7TvIMdQvfw64W4REgACBCYG8T8BbIsawIcw2fjUiLznbFCE1J5BPokzXb0SMpS/1qZ2OBDTX1+VEYFACu0drXh3Rpw3aonW9PdqbN0jKqwfyEklpdoH8aeUFEZ+MWHR5mL99w7wM2JGAQJAIEFgpkCfO3RExto1xDgY+HJHtzxPWpLUFcqefTunlEH//1hVHAtbu2z4hMHqBfPDOmO/Idmu0/90ReYOa+0WMPe0WAA+N+J2IsyPs9Pu30995QO9IQHRkaXEBJ1QtblhjDg+PSr01wuHCLZeu5QltGR+IyKcTDj3dJxr4qIgzIh4dcUCENCyBPDHw+yKuGlaztKZLAQOALrW7LevYKO7tEfk8dmm7wAXxMu+hkPHRiLz5UP6E0NeUN+d5QMSpW+PB8dfPIIEwgmQQMIKF3GYTDQDa1C2fd94wKC+fe1z5qlRbgxujZnl75RwI5C2J83VGbUcKcl09KiJ/1jg+4oSIPHM/I08ClcYpkIOAx0RcPc7ma/UiAgYAi+j1Y968re5vRfxGhOU9/TK7Mia9MOKiiM07/L04Xl8RkYdeb4poKu0bGeWtX/NWz0dEHLk1NsXfjKMj3BkxEKQVAgYBK0i8MY2AHcI0SsOY5gnRjLMiXDLX3PLMO+TlQCAHC/k3r8DI9/LGRZmujciT7vIbeu7gM+VOPO/dsGdEnqORkTv+fE8iMK+AQcC8ciOezwBgXAv/O6O5b4nIw8cSAQLDEvhsNCd/DsgBqURgQ4E8PCyNR+Dfo6kPiXjdeJqspQRGI3D/aGleApvn/kgENhQwANiQaHAT5ElvPxXx1AgnDg1u8Y6uQfkTy2sisl9LS0snB0I+H8QgQG8gQGBdgXvHp++P+LZg0MM+sDnqfHpEprzZ0XUR+vIWA3cMzF4hESCwrkCeB/L8iDxxzcaTQV/6wBujv+78LdcgYLL/GgREJ5EIENhY4JSY5PyIvuwA1HOcy+qb0UefvE53Pi0+u0E/3rYefzIsdh4orcPnIwIExiqQl6u9KGLMzxIwsKh3YJEnuN1ripXTkYDJZZiXCOalphIBAgQ2FLhfTPHxCDtDBjX0gSuiLz47YpbLlh0JmOy7jgREB5IIEJhOIK8QeU6EE6smN6Q17BDHVIf8rf/Q6brsiqkcCZjsu44ErOgi3iBAYD2BTfHhP0SMaaejreWXd56P8oiIRZMjAZPL8hMB6pyARXuV+QmMTCAfK/v5CDtHBm32geujj70kIm+V3FRyJGCyz+aRgLs1hSsfAgTGIbBbNDN/FvhGRJs7AXmPzzefo3BWRD4MqY1kEDDZpwwC2uhl8iQwAoE8o/hPIm6LsLNmsGgfeF/0o7yNbdvJzwGTfTV/DvBwsLZ7nfwJDFQgn0X/pog7IxbdCZh/fIZ5ZvoZEV0mg4DJfnZ24BsEdNkDlUVgYAJ52WCerW0gMLlxNahZ3eOL0VfOjMgrTUokPwdMLhc/B5TohcokMDCBB0Z73hVhx8dgtT6QO/6fjMhzSUonRwIm+6gjAaV7pPIJDETgYdGOvGvbajsB743P5ZzoC0+LKPWNP4peNRkETPZFg4BVu4k3CRCYR+CkmCnP7L41wo5/fAYfi+X+wxGz3MEvJu80GQRM9kuDgE67n8IIDF/g7tHEl0RcGWEgMGyDvJzvbRH5O3tfknMCJvukcwL60nPVk0CPBPaLur4w4ssRBgLDMsj79b8s4oiIPiZHAib7oyMBfezF6kygJwInRz1fGXFjhMFAfw3yUr68OdTeEX1PjgRM9sNPxQJ1x8C+92r1J1CxwMFRtxdEnBdhINAPg2/GsnpFxHERQ0uOBEz2wX+NBew+AUPr5dpDoEKB/Ab2ZxFfjzAYqMvgW7FM3hDx+IjdI4acDAIm+55BwJB7u7YRqExg16jPYyJeFZG/LRsMlDG4JezfEfGsiP0jxpQMAib7XA4CDhhTB9BWAgTKC+S3zcdGvDbiGxEGA+0a5DkZb454RsTYD/0aBEz2NYOAWCkkAgTKCOSNZPJug78ZkdeY3x5hQLC4wVfCMX96eWLEEE7mi2Y0lgwCJvuXQUBjXUtGBAgsIpAnEOYd5l4fcUmEwcB0BleF1T9E/HzEfSKk9QUMAib71ceDy88B6/eZXnxa8x26egGoklUJbIra5ImEGXk74uMjarv9bFSp83R5lPihrfEv8ffciDsjpOkFchCQ50PsM/0sg54yjwR8f8S1g27lwBtnADDwBTzy5uW3lFMjHhJx4tbYFH+H3O+vjvbltfk7xsXxv7S4gEHApKFBwKRH7/4b8oawdwtDhTsRyLPZ7xdxQsRJW//mYfDDI/qUbojKfiEi759wfkR+q8//N0dI7QkYBEzaGgRMevTqPwOAXi0ulW1RIE9+O2prbNrh75Hx+rCIPN+gqxPk8uTGvOLh6xGXReT5DZsjLtwh8nOpjIBBwKS7QcCkR2/+MwDozaJS0QoE7hp1yIFAxiERh0bkEYU9I5YHB/l/3sdgt4h89sFyykPzyymvr8/L7a6JyN9Qr4+4buv/eZe93LnnCY1SvQIGAZPLxiBg0sN/BAgQIDBgAc8OmLw6IM87OWjAy1vTCBAgQIDANgGDAIOAbZ3BCwIECBAYl4BBgEHAuHq81hIgQIDANgGDAIOAbZ3BCwIECBAYl4BBgEHAuHq81hIgQIDANgGDAIOAbZ3BCwIECBAYl4BBgEHAuHq81hIgQIDANgGDAIOAbZ3BCwIECBAYl4BBgEHAuHq81hIgQIDANgGDAIOAbZ3BCwIECBAYl4BBgEHAuHq81hIgQIDANgGDgMlBwEdDJp+bIREgQIAAgcELGAQYBAy+k2sgAQIECKwuYBBgELB6z/AuAQIECAxewCDAIGDwnVwDCRAgQGB1AYMAg4DVe4Z3CRAgQGDwAgYBBgGD7+QaSIAAAQKrCxgEGASs3jO8S4AAAQKDFzAIMAgYfCfXQAIECBBYXcAgwCBg9Z7hXQIECBAYvIBBgEHA4Du5BhIgQIDA6gIGAZODgI8EkzsGrt5XvEuAAAECAxMwCDAIGFiX1hwCBAgQmFbAIMAgYNq+YjoCBAgQGJiAQYBBwMC6tOYQIECAwLQCBgErBwH7TYtnOgIECBAg0GcBgwCDgD73X3UnQIAAgQUEDAIMAhboPmYlQIAAgT4LGAQYBPS5/6o7AQIECCwgYBBgELBA9zErAQIECPRZwCDAIKDP/VfdCRAgQGABAYMAg4AFuo9ZCRAgQKDPAgYBBgF97r/qToAAAQILCBgEGAQs0H3MSoAAAQJ9FjAImBwEfDgWppsF9blHqzsBAgQITC1gEGAQMHVnMSEBAgQIDEvAIMAgYFg9WmsIECBAYGoBgwCDgKk7iwkJECBAYFgCBgEGAcPq0VpDgAABAlMLGAQYBEzdWUxIgAABAsMSMAgwCBhWj9YaAgQIEJhawCDAIGDqzmJCAgQIEBiWgEGAQcCwerTWECBAgMDUAgYBBgFTdxYTEiBAgMCwBE6L5twQ8W3xHwbvGNbi1RoCBAgQILC2gCMBWwZANwbRo9Zm8gkBAgQIEBiewNgHATfHIn3c8BarFhEgQIAAgY0FxjoIuCVofnBjHlMQIECAAIHhCoxtEJA7/ycMd3FqGQECBAgQmF5gLIOAW4Pkh6ZnMSUBAgQIEBi+wNAHAbfHInzq8BejFhIgQIAAgdkFhjoIyJ3/02fnMAcBAgQIEBiPwNAGAbnz/4nxLD4tJUCAAAEC8wsMZRBwRxA8c34GcxIgQIAAgfEJ9H0QcGcssueMb7FpMQECBAgQWFygr4OA3Pn/3OLNlwMBAgQIEBivQN8GAbnzf+54F5eWEyBAgACB5gT6MgjInf/zmmu2nAgQIECAAIE+DAJeZDERIECAAAECzQvUPAj41eabK0cCBAgQIEBgWaDGQcB/Xa6cvwQIECBAgEB7AjUNAn6zvWbKmQABAgQIENhZoIZBwMt2rpT/CRAgQIAAgfYFSg4C/kf7zVMCAQIECBAgsJZAiUHAH61VGe8TIECAAAEC3Ql0OQh4eXfNUhIBAgQIECCwkUAXg4BXRSV22agiPidAgAABAgS6FWhzEPDqaMpdum2O0ggQIECAAIFpBdoYBPxlFG7nP+0SMB0BAgQIECgk0OQg4HXRBjv/QgtSsQQIECBAYFaBJgYBfxuF7jZrwaYnQIAAAQIEygosMgh4U1Tdzr/s8lM6AQIECBCYW2CeQcCbozQ7/7nJzUiAAAECBOoQmGUQ8PdR5d3rqLZaECBAgAABAosKTDMIeGcUsueiBZmfAAECBAgQqEtgvUHAu6Oqe9VVXbUhQIAAAQIEmhJYbRDwnsjczr8pYfkQIECAAIFKBXYcBHww6rhPpfVULQIECBAgQKBhgdMiv3+M2LvhfGVHgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAoUE/j+Q1xik09EOVwAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/521303/Safari%20Search%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/521303/Safari%20Search%20Redirector.meta.js
// ==/UserScript==

const STORAGE_KEY = "safari_search_redirector_default";
const searchEngines = {
  g: `https://www.google.com/search?q=%s`, // Google
  google: `https://www.google.com/search?q=%s`, // Google
  sp: `https://www.startpage.com/search?q=%s`, // Startpage
  startpage: `https://www.startpage.com/search?q=%s`, // Startpage
  ecosia: `https://www.ecosia.org/search?q=%s`, // Ecosia
  kagi: `https://kagi.com/search?q=%s`, // Kagi
  caixin: `https://search.caixin.com/newsearch/caixinsearch?keyword=%s`, // Caixin
  brave: `https://search.brave.com/search?q=%s`, // Brave Search
  gpt: `https://chatgpt.com/?temporary-chat=true&q=%s`, // ChatGPT
  chatgpt: `https://chatgpt.com/?temporary-chat=true&q=%s`, // ChatGPT
  claude: `https://claude.ai/new?q=%s`, // Claude
  dict: `https://www.collinsdictionary.com/us/dictionary/english/%s`, // Collins Dictionary
  ndb: `https://neodb.social/search?q=%s`, // NeoDB
  neodb: `https://neodb.social/search?q=%s`, // NeoDB
  podcast: `https://www.listennotes.com/search/?q=%s`, // Listen Notes
  pp: `https://www.perplexity.ai/search?q=%s`, // Perplexity
  perplexity: `https://www.perplexity.ai/search?q=%s`, // Perplexity
  reddit: `https://www.reddit.com/search?q=%s`, // Reddit
  so: `https://stackoverflow.com/search?q=%s`, // Stack Overflow
  twitter: `https://twitter.com/search?q=%s`, // Twitter
  x: `https://www.x.com/search?q=%s`, // X
  yt: `https://youtube.com/results?search_query=%s`, // YouTube
  youtube: `https://youtube.com/results?search_query=%s`, // YouTube
  taobao: `https://s.taobao.com/search?q=%s`, // Taobao
  jd: `https://search.jd.com/Search?keyword=%s`, // JD
  bili: `https://search.bilibili.com/video?keyword=%s`, // Bilibili
  xhs: `https://www.xiaohongshu.com/search_result?keyword=%s`, // Xiaohongshu
  weibo: `https://s.weibo.com/weibo/%s`, // Weibo
  youdao: `https://dict.youdao.com/search?q=%s`, // Youdao
  zhihu: `https://www.zhihu.com/search?type=content&q=%s`, // Zhihu
  douban: `https://www.douban.com/search/?q=%s`, // Douban
  hn: `https://hn.algolia.com/?q=%s`, // Hacker News
};

const defaultSearchEngineRefer = {
  "www.ecosia.org": "tts",
  "www.google.com": "client",
};

// Add CSS for the settings window
GM_addStyle(`
  .search-settings-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999999;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .search-settings-window {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 300px;
  }

  .search-settings-window h2 {
    margin: 0 0 20px 0;
    font-size: 18px;
    color: #333;
  }

  .search-settings-window select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 20px;
  }

  .search-settings-window .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .search-settings-window button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .search-settings-window .save-btn {
    background: #4CAF50;
    color: white;
  }

  .search-settings-window .cancel-btn {
    background: #f5f5f5;
    color: #333;
  }

  .search-settings-window button:hover {
    opacity: 0.9;
  }
`);

function getDefaultEngine() {
  return GM_getValue(STORAGE_KEY, "kagi");
}

function showSettingsWindow() {
  const overlay = document.createElement("div");
  overlay.className = "search-settings-overlay";

  const window = document.createElement("div");
  window.className = "search-settings-window";
  window.innerHTML = `
    <h2>Default Search Engine Settings</h2>
    <select id="default-engine">
      ${Object.entries(searchEngines)
        .map(
          ([key]) => `
          <option value="${key}" ${
            key === getDefaultEngine() ? "selected" : ""
          }>
            ${key}
          </option>
        `
        )
        .join("")}
    </select>
    <div class="buttons">
      <button class="cancel-btn">Cancel</button>
      <button class="save-btn">Save</button>
    </div>
  `;

  function closeSettings() {
    document.body.removeChild(overlay);
  }

  // Event Handlers
  window.querySelector(".save-btn").addEventListener("click", () => {
    const engine = window.querySelector("#default-engine").value;
    GM_setValue(STORAGE_KEY, engine);
    closeSettings();
  });

  window.querySelector(".cancel-btn").addEventListener("click", closeSettings);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeSettings();
  });

  overlay.appendChild(window);
  document.body.appendChild(overlay);
}

// Register settings menu command
GM_registerMenuCommand("⚙️ Default Search Engine Settings", showSettingsWindow);

(function () {
  "use strict";
  // Get the current hostname
  const hostname = window.location.hostname;

  // Get the URL parameters
  const urlParams = new URLSearchParams(window.location.search);

  // Get the search query from the URL
  let query = urlParams.get("q");
  // Exit if query is not exists or empty
  if (!query || query.trim().length === 0) return;
  // get Safari only search engine refer
  const referKey = defaultSearchEngineRefer[hostname];
  // Exit if the refer is not exists
  if (!referKey || referKey.trim().length === 0) return;
  const referValue = urlParams.get(referKey);
  if (!referValue || referValue.trim().length === 0) return;

  // Check if the query starts with a keyword in the searchEngines mapping
  const keyword = Object.keys(searchEngines).find((k) =>
    query.toLowerCase().startsWith(k + " ")
  );

  let searchEngineUrl;
  if (keyword) {
    // Get the search term after the keyword
    query = query.slice(keyword.length).trim();
    searchEngineUrl = searchEngines[keyword];
  } else {
    // Default search engine
    searchEngineUrl = searchEngines[getDefaultEngine()];
  }
  // Skip redirection if already on the target search engine
  const searchEngineHostname = new URL(searchEngineUrl).hostname;
  if (hostname === searchEngineHostname) {
    return;
  }

  // Clear the document content
  window.stop();
  document.documentElement.innerHTML = "<html></html>";
  // Redirect to the search engine
  window.location.href = searchEngineUrl.replace(
    "%s",
    encodeURIComponent(query)
  );
})();
