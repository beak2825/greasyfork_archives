// ==UserScript==
// @name WME Additional maps
// @namespace https://greasyfork.org/en/scripts/472998-wme-additional-maps
// @description Additional maps for WME, based on WME-JumpMaps
// @license MIT
// @include https://*.waze.com/*editor*
// @include https://www.google.*/maps*
// @include https://www.google.com.*/maps*
// @include https://maps.google.*
// @include http://maps.google.*
// @include http://wikimapia.org/*
// @include https://wikimapia.org/*
// @include http://www.openstreetmap.org/*
// @include https://www.openstreetmap.org/*
// @include https://www.mapillary.com/*
// @include https://map.hak.hr/*
// @include https://oss.uredjenazemlja.hr/*
// @include https://lookmap.eu.pythonanywhere.com/*
// @match https://*.waze.com/*map-editor/*
// @match https://*.waze.com/*editor*
// @match https://*.waze.com/*beta_editor/*
// @require https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.6.3/proj4.js
// @require     https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @icon data:image/png;base64,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
// @version 0.3001
// @author makunasis
// @downloadURL https://update.greasyfork.org/scripts/472998/WME%20Additional%20maps.user.js
// @updateURL https://update.greasyfork.org/scripts/472998/WME%20Additional%20maps.meta.js
// ==/UserScript==

/* global W, WazeWrap */

var wmeAM_version = "0.3001";
console.log("WME-AdditonalMaps (" + wmeAM_version + "): Start");

var wmeAM_IconWME='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAABOCAYAAACOqiAdAAAcmElEQVR4Ae1ceXBdV3n/3bdJetp3ybIsL7G8KLbjJY7txMEkMSSEQAMJTJsJbdNOSwn/AKUw7XSA6dDpdCAMdJIyZQbagQHKhDJ0mmlJSeIkjheME2+yLVmOZEuWrH17etLbb3+/c999lh3J1ntyyDI59tW599yzfb/zfd/5znfOfZZt23g7wo9/c74klIxtS8Fea8NeA1i87CWMi9mfYvZKMSwgxIiXzcvqY9xuwWr3wGor9gaOPnbHLZPK97sO1u8KuGcA7+ChM3vslH0f0biHDW8lON7FEExQk7ZlvQYbL1oe6/manetfepRpi6lzoWXfcuD+9cjpTYmE/Ths6zFyVt1CO5ZLPnJiPyz7xz6f9aM/395yIpc6FlrmLQPu6UOtH7VT+Bt2ZMdCO3OT8x22PPAMkztvffYm12uqu+nAPXXw9CcpOn9LXbTprehw9nVaJ6ga/u7zu1r+M/uy85e4acB979C5tTE7/jRs+575m3v73liW9YLf8n/+z3Y2t92MXiwauGfOnAkMjuNr1F9/SdACN6NTb1kdlhWjHvxWTRm+8ej69bHFtLMo4L57tGNlKhb9GS2abYvpxO+6rGXhaJ7P/6k/3b6mK9e2PbkWlC4jaK+/20ATvepzNBE/ZvRxjgDkBNy/HDz9V2z95+xAaY7tvu3FTN9Jg6Elh95kK6rWU4dO/xNS9hdyaOudW8RjfefzO1u+xA4ueBmVDXDW0wdP/4ArjT965yKQe8846/77k7tanlgoeAsWVXHaexU0wS3ajDQtEPsFAUdO+8p7TjznAogqyNA617tr0m4oqs5KwP75NeVuymMqmUQiFkV8JoSR7osY7e9HaGgE0ekZzISmEIvFkEomQDGCzxeAx+tFflEQwdJilFRUoryhHuX1DQgEC+HPL4TlWRAf3LjvlvXIjVYa1wUubafJ5Lips2d0KoTJwW5MDY+gr/MChnsHMTUaQjxuw+dJwudNwe+zeSUJBvV1iv8V2RYSCS/iST9iKT/fWygpL0JxeQka1qxC/epmFFTUwutblNOFA4UJTyBvy19sW905H8rzAuesCFIHZPPMVzib9FQqhVg4hNGL59Hb3kHA+hGbicBvTaOqKozmxhjqamdQXhJFfiCBYF4UAX+MRCTYjE3OI3C8onEL4Wk/xiYDuHQ5iM7LZZgIFyIcqUQplwRNa5ahYdPtyC8uIYf6suniVXllJNeUee6cb4Uxb81mGXWTQEvG4wiPDaOv7TQutZ1HeGQAJYVhlNcksG5lFE1NM2iqiaCiaAoFgQi5Lo48Xh6CZhkLgQs6cp1shWTKQpTX9IwXIwSve3AMg6P5aD03go7uSnSEw4jzfX3zWhSUllG0S64CZKEPYhhhwPzy8LwpzMlx6QX7iZux9kwm4uS0KQycb0fb/pcolsOoqgXuuD2GVU0J7Lg1jJqqEIowDSTCAHUeyJ1EiDH7a1Nv0WNpgmJJIUXZXBTjcMyHsakAjrZX4NkXlqKto4ycV4lV226nDlyKiqXL4fX7nfLZ/uXaNmD5N83lGJgTOE4ILxC0e7Jt59r8CSr34c6zRvGf3X+Iyj6B3Xcn8elHprFuGbnL4jp7gmBNThGkiCOLqoRygoyiF1q8FJng3hA86jw6LgE/HfBFcYzFffjZc034j1+sgOUvQGV9Fdbtvge1q9dRV+am9+RVoX13n9u6G78JuJs1i8olf+HIPpx6+TAmR8ZRUpLCl78cwwe3zsDHyYFs4nBXkvcUS1LGPom7BIx7qZsuULpXcJ8luArpmOKJPCrBygieO1qDp76/Hr2Xi9GwrBQ7PvUoSmqX5gwe+/SmWVa9vToYJ+TVSdk+yYQYPHcKrfsPY2ZiHKtWpvDVr8ZxV0sYviECNsr9lfgYq50gViTWAEaOcMEz4KSBzIBIYPTeBTaTV5zEdA/fk+MwEMTdm0bxxKfP4cF7uzBwKYz2V19GlLpPg5lTmAOTq4CTu5sjuCjPrUCbHOjD6X0vITw6gY8+lMTjjyVxe3MEBSHqsWmBRsBS5DIRIiAsEc9YAJgr/ey+k9hK1Axwuuele5Oue7c8i9tetuPDBzaP4qG9l7Fl4yV0HL+EnpOvGZuROXII9iYHmytF2eqVkN4juJKQ5Z1NpR4JhdB96hguX+zH7duT2LMrji1rIyiOzwAz1Gcpcpwt0WTlhntEuB4EjEBUOi9xkJ5lx81Od9/PjkWFyZ+uK+5HOSeQW6qncd/ufvisCfScPkvjehCa4XMJ12KTAU67UaxwURsriXgUE/29uHiilbZYHA/eD7Q0xVFDmwzitqQmAcaaLg33uGC53RBYaeJdYDJIKkH55rpUThdfK1YUCaDUa2H7raNoXjWG/u7LGL7YhXiUA5hb2JHGyJR2e0yLHJ/JrT6nlAzcSGgCfWePc+k0ht17LGzdEENRgh2d4JUQcLxkkAkcBUOoxIzPBjDF6XS9z4it0gXy7Hzpe1OA96YOFtYsq3xJL7y8qoNJ3H9fH1Kc0fs72jAzGUIyIb2afTDbnOliahHaLObk9AfZV3WlRDQ0jrG+y7jQeh419RaeeDyFUoHG1QFiBCxF3WZENA1UBqE0UoZjCGoGLNleLke6aM4Rm3JKFymy51VGkwCvhIWCaAB7N49g7ZpxXO66TInoR3RKE1MOgXvDBisWNcCZHfZFbBZrthrt6cLgGx3EaAq/97AH9Vw6ecK00+LUazavJO8zXCNCBaAuBoOHiE0TbrhH6S4g6byZ8uq2W14xnw2AKpN+Z3Qen2mmBPNt3HvnAPsyg7HLvQgNXs5phtWGurBirQ5w5liCnnIMiWjELKWkQ5Yts/CBO5LwR6iEkzJqxW2MxQHGqHXBSDdmxE/3It4FQMTPujLAsg5zz9dGJNPPs8VV9wY8t74UfFxdbFs/hppqAdeHgYt91Bi5iauLlXqnztxj4hz/TA71cyk1QG4bw4ZbbSytTcLDVYMDnMwOLtRFsAlpyAMiJk5ziU1nMln4R1yjHprndOw+ZDiM6cqjvOadeeAtn3WRMy12YUl1DI1LpmlXDlEHD9Ma4oSVS0hj5dGpIS4ftuZSh1tmvL8P4fFJ5Pvi2LjBg6CPoFEZI8XOSa/ZHF1DhEscSxquEHECzkVHNbr3yqt37nulp8XSQSqdNw2U8mXA4qtZeayUB4X5SaxomEJqZgqTwxMYGxig5IYhacnGMBZWwsw3nordzibVo5yCDN6RC12sIIqqag+VMGsLCzSCJ+C0YFdwiTLrSxErQBRmAzUbWL13n+kAMUArv9L0N11es7S5Z7oGQfWn8yifuSVwdO9hVeMMvN4ohgZHcO7AATQ0r0a+nKLVdIYWFMDj8xlnqSk3zx9W4xVmPiIoUnMKxgSZHMcQxbSqMoYVKywsrSZo47w0GQg8Kw2cocAh2gFRreqZY+Zyo9Fxbm8IKNPtNLBOqsBxumobgJRFCTaT2Y4xdfTezeTkNdwdSRK4YRQFqtEzbqH1wBhOvnoU5RXlaFhdh2Ubt6C0tg5lS5alC80fCTMOhA715RjY0ckBzlJjk1i/2eaa1KK4kgC6kmgskRBehjDWb2jRnzRRLqdl3jPdiK36onsHNEFiUpTPzcsEF94ry08eNTR52b4Gy7xgbNQFCyTqsbppCf7+a/nGITMykkLHBeDYyVG0ng7h0rlulFZXoWX3DizbvINYSxLmDsKM8785CTl3jhukcobBJJcxiWiCs6kHTUtJjpY0MjDt2cpXxKdF0uAgsh1AnCZ0r8tNd54NtxFMi2Vn51ZeYajcRoQJki09yjOFltGpHDC1Z9EWzK+n16SBrqcaOkjzsKIxyeWsDeXYdWcSj3w8gVd/G8dzz0VxmTZe67598OUVoOHWzcwxX7AMx7HW3IJNjpsen+BGio3KCqC8VMDxksgYQkRaOriUu7GbbiBhYiZdNxkNZnI5T5kMfK02BKgTOxHbFFjeAsa8fIV8zGNMD7AuD0Fkv7xJlWESl2NUeAiWW9iy2U+Pso22thj2H5xE//nzNwDOXsLtDquI42U6mM0fzUTJOD0ho2PGwKyp8qCijPUkRAAvSzMpb83FP4oVXHHLvDOJTFcf0pnMO0dUjA4zZZxn5TbZzCQjDlO6hzhy8ePNo4gFiUppGiwenmKaURlGB0oSWLlhTu5j8DZOkSwt9qBxqQcT1H3JRIwbRyOmmfn/WMUy1c0h5fkzzf1GwCViEYRD3GAhp1VXWijjwNocOfh5ycAUGMa7oTrYS+keFzjzLIQ0bMyXmdcJhJkkGNOVZPjK6Bt1Vfl9pF2ZyUEepomrJJJWELaviGDoncAUOqzXjjE/W2CSxDpJrqO/GPGEjSn6HMbGUjh5Ko5XD0YxOJTijlkZlqxbx7LXDcWapXMCTqIiIzI8OY2GRg+35DyIcp90Kk5wtJeXpCBpSMWAAMIaQbPNUkhCJhBEjGLl1QOJJhC2JdVbwLwBcxERNudnGXIWgUsRBVtXymu2DNkVphMOe4JXkhYQ9RjrM+mUgESEO2zTNkKTSQxOeOiosQgScKnPh+5eD8bHktyr5V5FVTnWb91gJgf1bb4gzDSMOQZxXJTbePT2DsTw1NPUH3SBh9k5amRKR4MhQp1XMPuiAodBpoRDmAAkxnwWfHqdEoiMtVnD/Szm1XItDazJ5ZZnLv4X9xBpw+BqWfemvAGZtfJB9adoy0mcU8gzwHMHG1WNDahursF6zrZlNXXIKyymzqsiE9wYFuo4hFh3pdrMKpDtC8q4GXL3HpzZ93/oGbBQU1uPOz68mxvGFAVynzaQ2VvG1IeKxQlKIzUJGsYCVWIq4pMEykORDBZIT1lceMQRCk8jRQ9HiqKWIvLOPwGhZ4Km0ZBEk1Dt5sf4GJXbiLHRjazPouhqo8bLen35xRh8bR+iQ30c8Dxse/QTBKsI/gDb5B6syui0wI2CMBO03C3JHjgR6cvLR+WylZzabdRWlKG5eSXuf2AvQlzgp6RLKKqSVtJBkAgOY3GVAUucwRd6lt5Rx1P0Xpw5egTT02HUN9bRCbkB3FlkuRQZkGCpDhZI8D7BQUhy8DQO0xOj6Dn1OgqDRVi+dS8togQtIoks61cZXhZViVTA+KkD0iIoKCpAcWUVQQ84ILMfWQQBpy9WcgsaHbmi41zQFxcXoYLglZUWcpYnp4ijpOQZBJwCl/6Gu6TfDNdIBEUY3+UXFeLk4VdxYv8+jI8Mo37FCixdvhK1XA7FuJ6MMZMYTCALRHG0J78AAxc6MdnVjq79v4Y/WIzSimqUr1jNrcg4uZhnU8h+AlmgyUOdinLThjNngGLp8fpzAY29tQWc+cxngwjLOpCIGW71xaPUdQX5CAYLCGSSi2d5egmPmQ05vAokWiKoSVZA8rXRWJzcjDYSB7xx8iSOH9iPERqiDV1d2H73faAMWZAE3d0+spq409TLG5ug5OfnI9TTif7W47hweD8ClICm9RtR19gEDzeD4hR32rrw0tq1OdMn6StMRsIc1AT8BYs5pGNxWoHdzu58WH3KNmjlEOKOVpIcUcV1XjV1nHSVdI+H3CZxFs8Z1U/QjA5AMyMGBL4x4kQoy6htVzQuQVFJKaao2yrqatFYV4WiPNaRDNC1b6YBAMShbCNBZZ9H8auvqUaothYgt+WVlKCubglK8wKIUi8mpBsJXEwHeYqKMHOpk+7BMPtkobh2Sbbkzspvt8sAbpfOyTZIxGLkrN62VgR4OmjlLauxdFkTLfBpI06Gn4iK5kaLBMi1I2M9KWXO2EMAxYtmAqOiioXCePAjH8WSmhqECVztkgY0sc7xiSnm8SDBchkdR2Wv8yGJ6BTWrm9BI9tdzpNKAYLX0LzGlPdTx6do50lUYyybHwyi/cIbPEIWMrNnecOybEnO5BdmPtpR7UZuMsnXv9FZkCR12tTIEHpbX8f5E6/hg3s/hBWrVqOktBxTE5OcztO6i2wlsIxYyvgVB4pjjHjyhfnvxEnpRO5PtGzYKKipkwgMz8kFCZq4U5wj4BJ8osoicASTZRL0wviDnCF37KBocsNohmtklo1xMDVB2bRULW++plv0nzuJYEkZz5Q00ZVELs0xkGPbfGWewG/HUxHRct15ODzGs2xtpzDa24MouWp6cgIjPRewYvkKPPDQQ2ZyiEVmyLuOeBAO6hlOAlRquicUZiGRAMuRLiY4z7LoHYa3SDhnSiJteJEdkipwymq9oDvWqW7yf4ADkaA6SFIMBaz2dP28yw8QUM7QLM4BM29QQZ/bKy/8GiO9l7CU7qOaVc2cTbnayCGwF0l97unT9548L8JPF+3t16un7+xJ9J0+zr2XKXaSOoOErGtuxp179nDl0GQ4IsEZVuaB4TABSHA86rvSGImrdOelrEqE9cLSkPFWYBrQ5bbQG2WVXmSksgJewTzz1owyQddkY0SYbixxNytHijcp6kGLM6nfT3GdmsSxwwfJeV5y2zKU1ukciUYs+6DPPIUZJwcGfu/Jv9cFbpj6Qdy2pJ7OvnI6/9iBW9auweZt2ykuFBHOrBp1t0Oy32g5OQCROHVT4GjSECcIQ6P7HMTMvSFFxLswcQQcuGSGKD39pIiXBkbQahClHmRgm3b1jiLuI1AapNePH8Pp1lZUNq0kaA0IllWwPdOQKs0uOFixTQZ9JEux+Or1atBaTrZTXV0dNt12Gz728YcRIXuNj43R4NTJSdUjUBy7zHCI2M+QRkIY5/kD8AYCaduPRrKZfUk680lkhYeDWxowJcwK4mQnOOpAohxgnR5ymUydyEyMuo+LeqKcxyWVZs9RbiT95Ic/pD60sfy27SipqacpQg9KjkFYqagBTl8WDx443c/u1s1XX/Nd99FCH8fBw4fptzprsn3s4U9yRKl1eFnsmOiiqWkQMPdc8OcXBpFHsPIDPi6sRxAJD6G4tASVleVm1EOcTaNc83q5YFdBwwkZgK70RgOioL9qqZimRx45anRsggetI2bwyikJ1aWVmJqeRpDt9VOn/ejffoBLPd3Ycv/HsIQ2npZmuQYOcb+wUnkD3KOk92l+Wcz+fGm+SvNpX62/5wHjShru7sL3vvtdTE5O4tFHHkGysBShqWmz1JFukQhxiHkyvIzLpxAudnbgV//1S7SfPcuN/QgKCwuxYdMm3EIdee+993KpVEzbbZIcIs4RNHOIEZMNeOTM0uJignERv3zmGbSdOcNlGXevKPslZWW4Y9ddePDBj+DF/a+g9dQpHDp0CC137sHqXR90jN5cRVTAECNh5dymR1IHSnjq+7gS5wtJimTvmZM8YdmJN44c5CmgJPbe/xF8+IEHUEPdocV0WEftozHk04oPTY3AMZ/+GB3k0O7OTi7FtOB2dJyM2FISetfuu/H4Hz9BHaYT5RJ5ct4cuCXpLvKy/jzWO3CpG//8nW+ji55agWn0KoGVjiugvdayYQP6+7hlSXswwDPAmx/+fVTQBMn5SGsaEL/fus39ZN379a9/3SRva6gZONIzyPNFWJrOd1XkdNBLVg/yUHI5lzcFGB/lgeg3OhmPYIY2WJgiUlRcaDjCT+X8P8/+Ei8//zx6KSoKPh2jT494nCBNM//w8BCq+M1C46pVzkKenAMRS8Nl4jRnUtHEEuFe6C+e+RkOc3tPa1Gtl414G3VKRxQ5eoSfAcRYKJ+TwKptu8xRVh89IHOFaycJt+1r01n28Od23vpNtw4jqu4D+/VNTnj/7T7PFQdLyqm3ilFI8PKov86+9Dyef3Efznd1omFpI3ZSVNasaTZEvfxr2k7czNEqoYSGpzjC6RAnCq4z9QHIANelz/3qf7Htrt38boHfL9g0aYTUNSKVRzdQkiZH98VuPP/cc5xsKLLUcwrSeaZeFhO3hqlCCghaKSeCxttu554pvcOqcxFB2MwufhVw+vD/qQOnT7Ar857KVAckkprSm3fvRfWqNWh/8VfooQi/ca4Drx85go0bN6KUinp4eJiiQ28J8yd5jqyAToAC6rfpqTAi5AxNKlLybW1tGOzrxXKuPrS6cOw9p5syNwRMsKgYYyMjOHnsGEblPeGSLE67sYAbyX5OPgGuTye5cSQuDFIqUjTG45QCr0BTVRwIMWVuAFonntzZ8qzTI+fvVcCZJH74z5be/AmSRoxTvrsRbHpDInUc/o4//CxWXaTI9l5E9+FD2P/KK4iz46XV1eww9w0oflrwF5YUISCnIesR0XF6UkSITX3X292DWtqICbrJZdC6HCTQ5F+L0QujWbKzo53cqp0s2bp0fHIgAuRG2XHJZBFdUmPUpXTj82OU8MQwN2CGUV5ZS73OmjJcTFqEZubZVOeAKjoVZr8TJtcE1pfOOOvFXMf1jdGayUsAOXymJNMs8rExR3gfT8b5qdEAjxi8hMvHjxgQlE/iWlFRQTEvwMx0BBNjo/SP8QMQEq8+BKirxDnMaUAjk7J+tsNlWIKTksRaXJvgWAMP3CdAZa9pgsnLp3eXK4QQRXSSZ1j0SVKKZco5qNs/81lyf6XhNAMgaTrfpMPYB/0zCxYSp8E1wbJe5Hdd96aLZaI3cxxf8aOIJ2lKXvWBiPGiqhhBugKYONCQZ0ZIIPh5VdBls3rn3Rg8fYwbJTPkNnId842TsCABmAMZMcavmQ1Zpeou4/pRBOu0pAxbFjBiK/j8nEnzqSMlxjPjo7hw9JCZPTV4YbqJInRr+elmUb3aL9Ds7y8oQl5xGb1NJQY0dd3UyQGcDZqaEXMAMFEi4gSgEWznA5EnTdlr/swJnL4kefrgmW+xgr9286sxDwmSV8yMhTrA+xRHRmabxFhNauaz6Fkto/ehvnk9us+coqOThJGb9LWgCFVnVcR4iTlhLN+wBQ0bt9IVz1UFxVacZHJQ5ORN8fDLGA9XCOpDZHwMo53naYyPwBeg45R1qp4EudEV8QjX08s2bkbd6hbOurNIVJ95zQ7uo0lnW1oGijkUmPtbc31Vo3ezatXjlaCfmOC3TB9iXduUSjgMOMJHZGmZ5NEDO32lK1wzmvcWjVz6/7fswMTQECZ0ApIipq1BcZOWSGZdyw4W8fuk1XfsRt3aFvZXu1Dp+rUSYV1eUiZAtDzTQMXpxR3r6kAHuc4mWOJaDab6JD2q01OFnLhWbNyG6pWrTXm+MkHqYr6gNw6oTh5m5Udw+Ma8+efScW7mm/HZZddv9mPojXYjXjJATXsCgnaP1o0bH/wE6ls2zwLfbX3uWGQluMo48oufYqi9lfqPA8I094SlTW7f8ehjqF13W87LK4KW+2eXbrcX+4mSlPnUxAQ6+YFGz9EDiFJH+bkbVb91F/c1l2PV+ls50o5ouG3eKBb40mPd/BqxhxPQ1MggPcgh+Lhrte7uvWhau4HupNz8babtOT5BurZPc86q12bS59bs7D9cm/5efKY4f+Vzu1r+8Ua0LQg4VcIP/b9N+frCjSp8V793fkbjiwuhYcHAsbL3fz5jFqLZKBfb/C4HR2VW+ffGLWnK5jdHRHQ2wCm/zV+E+SKn7et6i5Xx3RJEi2hifzU5LzhkI6pXVarZlnbV9znB8RTfuy/I5KBl+Cc3+pmM+SjLGThV+G7+GTT+PManr/fzGPMB5qZnK6puOROrYf3EBO2wv6cxxrP57/CgH95jX9XnxYAmKhfFcbNheqf/1CMH9kU5L+Zbe86mZSH3Nw04tzFnpfH+j4u6eGQdv/9ztllDdnUB5weU+fU1PySmD2PefdurS+X2RDcQf0AZP6FL7ofublRuNd241E0X1fmafIYeovd/sns+dLJI16eL+gqPI8eP8LL/kXgdT9NJq7frR+L/H37mMJQPecgYAAAAAElFTkSuQmCC';
//'

var wmeAM_countProbe=0;
var wmeAM_countProbe2=0;
var wmeAM_countProbeWM=0;
var wmeAM_countProbeLOC=0;
var wmeAM_debug=false;
var wmeAM_restoreSelected=false;
var wmeAM_around=false;
var wmeAM_hideWindow = false;
var wmeAM_leftOffset = wmeAM_defaultLeftOffset;
var wmeAM_topOffset = wmeAM_defaultTopOffset;

var wmeAM_defaultLeftOffset = '400px';
var wmeAM_defaultTopOffset = '100px';

/*
localStorage:
	WMEAdditonalMapsDebug = bool = "true" || "1" - enable debug
	WMEAdditonalMapsLink  = JSON = links
	WMEAdditonalMapsRestoreSelected = bool = restore selected objects after a jump = "true" || "1" - restore

localStorage.getItem(Name)
localStorage.setItem(Name,value)
localStorage.removeItem(Name)


localStorage.removeItem("WMEAdditonalMapsLink")
localStorage.getItem("WMEAdditonalMapsLink")
localStorage.setItem("WMEAdditonalMapsLink",)

localStorage.removeItem("WMEAdditonalMapsDebug")
localStorage.setItem("WMEAdditonalMapsDebug","1")
localStorage.getItem("WMEAdditonalMapsDebug")
*/

var wmeAM_Config={};
var wmeAM_Config0 = {
	"_map_WME":    {save:0, title:"Open in WME",                 name:"[WME]",   template:'https://www.waze.com/editor/?env=row&zoomLevel={{zoom}}&lat={{lat}}&lon={{lon}}'},
	"_map_WMEB":   {save:0, title:"Open in WME Beta",            name:"[WMEB]",  template:'https://beta.waze.com/editor/?env=row&zoomLevel={{zoom}}&lat={{lat}}&lon={{lon}}'},
	"_map_LI":     {save:0, title:"Open in LiveMap",             name:"[Live]",  template:'https://www.waze.com/livemap/?zoom={{zoom}}&lon={{lon}}&lat={{lat}}'},
	//-------------------------------------
	"_map_OSM":    {save:1, title:"Open in OSM",                 name:"[OSM]",   template:'http://www.openstreetmap.org/#map={{zoom}}/{{lat}}/{{lon}}'},
	"_map_Google": {save:1, title:"Open in Google Map",          name:"[G]",     template:'http://www.google.com/maps/?ll={{lat}}%2C{{lon}}&z={{zoom}}&t=m'},
	"_map_APPLE": {save:1, title:"Open in Apple Map",          name:"[Apple]",     template:'https://lookmap.eu.pythonanywhere.com/#c={{zoom}}/{{lat}}/{{lon}}'},
	"_map_BING":   {save:1, title:"Open in Bing Map",            name:"[Bing]",  template:'http://www.bing.com/maps/traffic?v=2&FORM=Trafi2&cp={{lat}}~{{lon}}&lvl={{zoom}}&dir=0&sty=h&form=LMLTEW'}, // sty: "h" - ariel, "r" - map
	"_map_HERE":   {save:1, title:"Open in KAMERE ",           name:"[Kamere]",  template:'https://www.google.com/maps/d/u/0/viewer?mid=1W8NNPa3GwVfPZnGRlu-ZNlTJUrJYbmDi&g_ep=CAISBjYuNzMuMhgAIN1iKhIsNDcwNzE3MDQsNDcwNjk1MDhCAkhS&g_st=ic&ll={{lat}}%2C{{lon}}&z={{zoom}}&t=m'},
	"_map_MRY":    {save:1, title:"Open in mapillary.com",       name:"[MRY]",   template:'https://www.mapillary.com/app/?lat={{lat}}&lng={{lon}}&z={{zoom}}'},
    "_map_HAK":    {save:1, title:"Open in HAK",                 name:"[HAK]",   template:'https://map.hak.hr/?lang=hr&s=mireo;roadmap;mid;I;6;2;0;;1&z={{zoom}}&c={{lat}},{{lon}}&cats='},
// # todo	"_map_KADUA":  {save:1, title:"Open in KADUA",             name:"[KADUA]", template:'https://oss.uredjenazemlja.hr/map?center={{lat}},{{lon}}&z=2'}
};


var wmeAM_ArrW2B  =[{w:7,b:-2},{w:6,b:-1},{w:5,b:0},{w:4,b:1},{w:3,b:2},{w:2,b:3},{w:1,b:4},{w:0,b:5}];
var wmeAM_ArrW2KDL=[{w:0,r:75000},{w:1,r:50000},{w:2,r:15000},{w:3,r:10000},{w:4,r:5000},{w:5,r:3000},{w:6,r:1000},{w:7,r:750},{w:8,r:500},{w:9,r:200}];

function cloneConfig(obj)
{
	if (null === obj || "object" != typeof obj) return obj;
	var copy = obj.constructor();
	for (var attr in obj)
	{
		if (obj.hasOwnProperty(attr))
		{
			copy[attr] = cloneConfig(obj[attr]);
		}
	}
	return copy;
}

function CreateID()
{
	return 'WME-AdditonalMaps-' + wmeAM_version.replace(/\./g,"-");
}

function WmeAM_Config2String()
{
	// exclude private
	var jsn={};
	for(var i in wmeAM_Config)
	{
		if(wmeAM_Config[i].save === 1)
		{
			jsn[i]=wmeAM_Config[i];
		}
	}
	return JSON.stringify(jsn);//,function(key, value) { if (key === "save" && value === 1) {return undefined; }  return value;});
}


function getElementsByClassName(classname, node)
{
	if(!node)
		node = document.getElementsByTagName("body")[0];
	var a = [];
	var re = new RegExp('\\b' + classname + '\\b');
	var els = node.getElementsByTagName("*");
	for (var i=0,j=els.length; i<j; i++)
		if (re.test(els[i].className)) a.push(els[i]);
	return a;
}

function wmer_generate_permalink() {
  	var wcp=document.getElementsByClassName('WazeControlPermalink');
  	for(var i=0; i < wcp.length; ++i)
  		for (var j=0; j < wcp[i].getElementsByTagName('a').length;++j)
  		{
  			var href=wcp[i].getElementsByTagName('a')[j].href;
			if (href.indexOf(".waze.com/") > 0 && href.indexOf("/editor") > 0)
			{
				// kill "/ru/", kill "layers"
				href=href.replace("/ru/","/").replace(/layers=([0-9]+)\&/,"") + "&marker=yes";
				return href;
			}
		}
	return "";
}

// Where am I?
function WmeAM_GetLocationType()
{
	if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_GetLocationType(), location.hostname=" + location.hostname + ", location.href=" + location.href);

	if (location.hostname === "www.waze.com" || location.hostname === "editor-beta.waze.com" || location.hostname === "beta.waze.com")
		return "waze";
	if (location.hostname === "maps.google.com" || location.hostname.startsWith("www.google."))
		return "google";
	if (location.hostname === "www.openstreetmap.org")
		return "osm";
	if (location.hostname === "www.mapillary.com")
		return "mry";
	return "";
}

function __getQueryString(link, name)
{
	if (link.indexOf( name + '=' ) <= 0)
		return -1;
	var pos = link.indexOf( name + '=' ) + name.length + 1;
	var len = link.substr(pos).indexOf('&');
	return (len == -1)?link.substr(pos):link.substr(pos,len);
}

// koordinate i zoom)
function WmeAM_GetLLZ()
{
	var lat=0;
	var lon=0;
	var zoom=0;
	var city='';
	var href=location.href;
	var locType=WmeAM_GetLocationType();
	switch(locType)
	{
		case "waze":
		{
			var urPos=new OpenLayers.LonLat(W.map.getCenter().lon,W.map.getCenter().lat);
			urPos.transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));
			zoom=W.map.getZoom();
			lat=urPos.lat;
			lon=urPos.lon;
			break;
		}
		case "NM":
		{
			zoom = parseInt(__getQueryString(href, 'z'));
			var ll = __getQueryString(href, 'll').split('%2C');
			lat=ll[1];
			lon=ll[0];
			break;
		}
		case "google":
		{
			var i2=href.indexOf("@");
			if (i2 >= 0)
			{
				// https://www.google.com/maps/@51.70131,39.14356,18z
				var l=href.substr(i2+1).split(",");
				lat=l[0];
				lon=l[1];
				var re = /([0-9]+)([zm]+).*/;
				if (l[2].indexOf("/data") > -1)
					re = /([0-9]+)([zm]+)\/.*/;
				var zoomAttr = l[2].replace(re, '$1.$2').split(".");
				if (zoomAttr[1] === "m")
				{
					var ArrM2Z=new Array(
					{z:1,m:51510000},{z:2,m:25755000},{z:3,m:12877500},{z:4,m:6438750},{z:5,m:3219375},{z:6,m:1609687},{z:7,m:804844},{z:8,m:402422},
						{z:9,m:201211},{z:10,m:100605},{z:11,m:50303},{z:12,m:25151},{z:13,m:12576},{z:14,m:6288},{z:15,m:3144},{z:16,m:1572},{z:17,m:786},
						{z:18,m:393},{z:19,m:196},{z:20,m:98},{z:21,m:49},{z:22,m:25},{z:23,m:12}
					);
					var z=parseInt(zoomAttr[0]);
					for(var i=0; i < ArrM2Z.length-1; ++i)
					{
						if(z <= ArrM2Z[i].m && z >= ArrM2Z[i+1].m)
						{
							zoom=ArrM2Z[i].z;
							break;
						}
					}
				}
				else
					zoom=zoomAttr[0];
			}
			else
			{
				// https://www.google.com/maps/?ll=51.70130999999983%2C39.143560000000086&z=18&t=m
				lat = __getQueryString(href, 'y');
				lon = __getQueryString(href, 'x');
				zoom = parseInt(__getQueryString(href, 'z'));
			}
			break;
		}
		case "re":
		{
            var match_re = href.match(/^https?:\/\/.*\.rosreestr\.ru\/#\/search\/(\d+\.\d+)\,(\d+\.\d+)\/(\d+).*$/);
            if (match_re.length > 3)
            {
                lat = match_re[1];
                lon = match_re[2];
                zoom = match_re[3];
            }
			break;
		}
		case "sc":
		{
			lat = __getQueryString(href, 'lat');
			lon = __getQueryString(href, 'lng');
			zoom = parseInt(__getQueryString(href, 'z'));
			break;
		}
        case "sco":
		{
            var pml = document.getElementById('permalink');
            var url = new URL(pml.value);
            var vals = url.pathname.split('/');
			lat = vals[2];
			lon = vals[3];
			zoom = parseInt(vals[4]);
			break;
		}
		case "wm":
		{
			lat = __getQueryString(href, 'lat');
			lon = __getQueryString(href, 'lon');
			zoom = parseInt(__getQueryString(href, 'z'));
			break;
		}
		case "bm":
		{
            var res = Array.from(href.matchAll(/http(s){0,1}\:\/\/balticmaps\.eu\/\S+\/c___(\d+(\.\d+){0,1})-(\d+(\.\d+){0,1})-(\d+)\/.*/g));
			lon=res[0][4];
			lat=res[0][2];
			zoom=res[0][6];
			break;
		}
		case "ncaby":
		{
			if (!(typeof esri === "undefined"))
			{
				zoom=map.getLevel();
				lon=map.extent.getCenter().x;
				lat=map.extent.getCenter().y;
			}
			break;
		}
		case "osm":
		{
			var xy=OSM.mapParams();
			lon=xy.lon;
			lat=xy.lat;
			zoom=xy.zoom;
			break;
		}

		case "mry":
		{
			lat = __getQueryString(href, 'lat');
			lon = __getQueryString(href, 'lng');
			zoom = parseInt(__getQueryString(href, 'z'));
			break;
		}

		case "wmflab":
		{
			break;
		}

		case "osv":
		{
			break;
		}
		case "amr":
		{
			break;
		}
		case 'kadua':
		{
			break;
		}
		case 'mapbys':
		{
			break;
		}
		case 'maplt':
		{
			break;
		}
        case 'reglt':
		{
			break;
		}
	}

	if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_GetLLZ(): locType="+locType+": return {lat="+lat+",lon="+lon+",zoom="+zoom+"}");

	return {lat:lat,lon:lon,zoom:zoom,city:city};
}

// CONVERT
function WmeAM_Convert_Other2WME(llz)
{
	if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_Convert_Other2WME("+JSON.stringify(llz)+")");

	var locType=WmeAM_GetLocationType();
	/*if (locType != "waze" && locType != "re" && locType != '2gis')
		llz.zoom = llz.zoom - 12;*/

	switch(locType)
	{
		case "waze":
		{
			break;
		}
		case "NM":
		{
			break;
		}
		case "YM":
		{
			break;
		}
		case "google":
		{
			break;
		}
		case "2gis":
		{
			break;
		}
		case "re":
		{
			break;
		}
		case "sc":
		{
			break;
		}
        case "sco":
		{
			break;
		}
		case "wm":
		{
			break;
		}
		case "bm":
		{
			var cbm = proj4(proj4('EPSG:3857'),proj4('EPSG:4326'),[parseFloat(llz.lat), parseFloat(llz.lon)]);
			llz.lon=cbm[0];
			llz.lat=cbm[1];
			break;
		}
		case "kdl":
		{
            var g = proj4(proj4('EPSG:3059'),proj4('EPSG:4326'),[parseFloat(llz.lon), parseFloat(llz.lat)]);
			llz.lon=g[0];
			llz.lat=g[1];

			for(let i=0; i < wmeAM_ArrW2KDL.length-1; ++i)
			{
				//if(wmeAM_debug) console.log(i+") z="+z+", ["+wmeAM_ArrW2KDL[i].r+", "+wmeAM_ArrW2KDL[i+1].r+"] = " + (z >= wmeAM_ArrW2KDL[i+1].r && z <= wmeAM_ArrW2KDL[i].r))
				if(llz.zoom >= wmeAM_ArrW2KDL[i+1].r && llz.zoom <= wmeAM_ArrW2KDL[i].r)
				{
					llz.zoom=wmeAM_ArrW2KDL[i].w;
					break;
				}
			}
			//zoom = zoom - 12; if (zoom < 0) zoom=0; //???
			break;
		}
		case 'mapbys':
		{
			break;
		}
		case "ncaby":
		{
            var ncaby = proj4(proj4('EPSG:900913'),proj4('EPSG:4326'),[parseFloat(llz.lon), parseFloat(llz.lat)]);
            llz.lon=ncaby[0];
            llz.lat=ncaby[1];
			break;
		}
		case "osm":
		{
			break;
		}
		case "mry":
		{
			break;
		}
		case "wmflab":
		{
			break;
		}
		case "osv":
		{
			// TODO !!!
			break;
		}
		case "amr":
		{
			break;
		}
		case 'vcua':
		{
			break;
		}
		case 'mrua':
		{
			break;
		}
		case 'kadua':
		{
            var cua = proj4(proj4('EPSG:31256'),proj4('EPSG:4326'));
			break;
		}
		case 'maplt':
		{
			break;
		}
        case 'reglt':
		{
            var reglt = proj4(proj4('EPSG:3346'),proj4('EPSG:4326'),[parseFloat(llz.lon), parseFloat(llz.lat)]);
			llz.lon=reglt[0];
			llz.lat=reglt[1];

			for(let i=0; i < wmeAM_ArrW2KDL.length-1; ++i)
			{
				//if(wmeAM_debug) console.log(i+") z="+z+", ["+wmeAM_ArrW2KDL[i].r+", "+wmeAM_ArrW2KDL[i+1].r+"] = " + (z >= wmeAM_ArrW2KDL[i+1].r && z <= wmeAM_ArrW2KDL[i].r))
				if(llz.zoom >= wmeAM_ArrW2KDL[i+1].r && llz.zoom <= wmeAM_ArrW2KDL[i].r)
				{
					llz.zoom=wmeAM_ArrW2KDL[i].w;
					break;
				}
			}
			//zoom = zoom - 12; if (zoom < 0) zoom=0; //???
			break;
			break;
		}
	}

	if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_Convert_Other2WME(): return {lat="+llz.lat+",lon="+llz.lon+",zoom="+llz.zoom+"}");
	return llz;
}

// Xd"
function WmeAM_Convert_WME2Other(id,llz)
{
	if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_Convert_WME2Other('"+id+"',"+JSON.stringify(llz)+")");

	if (this.id == '_map_WME' || this.id == '_map_WMEB')
;//		llz.zoom = llz.zoom - 12;

// W.Config.livemap.zoom_offset = 12
// W.Config.livemap.max_zoom = 17
	var origzoom=llz.zoom;
	llz.zoom = this.id=='_map_LI' ? llz.zoom - 1: llz.zoom;// : (llz.zoom > 6 ? 19 : llz.zoom + 12);
	if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_Convert_WME2Other: llz"+JSON.stringify(llz)+")");

	switch(id)
	{
		case "_map_NM":
		{
			break;
		}
		case "_map_YM":
		{
			break;
		}
		case "_map_Google":
		{
			if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_Convert_WME2Other(): location.href.indexOf('mapmaker')="+location.href.indexOf("mapmaker"));
			if(location.href.indexOf("mapmaker") > 0)
				llz.zoom=llz.zoom+1;
			break;
		}
		case "_map_SC":
		{
			break;
		}
		case "_map_SC2":
		{
			break;
		}
		case "_map_NAVITEL":
		{
			break;
		}
		case "_map_BING":
		{
			break;
		}
		case "_map_HERE":
		{
			break;
		}
		case "_map_LI":
		{
			break;
		}
		case "_map_WM":
		{
			break;
		}
		case "_map_OSM":
		{
			break;
		}
		case "_map_BP":
		{
			break;
		}
		case "_map_RE":
		{
			/*var urPos=new OpenLayers.LonLat(llz.lon,llz.lat);
			urPos.transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"));
			llz.lat=urPos.lat;
			llz.lon=urPos.lon;*/
			break;
		}
		case "_map_AM":
		{
			break;
		}
		case "_map_BM":
		{
			let urPos=new OpenLayers.LonLat(llz.lon,llz.lat);
			urPos.transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:3857"));
			llz.lat=urPos.lat;
			llz.lon=urPos.lon;
			break;
		}
		case "_map_KDL":
		{
            var g = proj4(proj4('EPSG:4326'),proj4('EPSG:3059'),[parseFloat(llz.lon), parseFloat(llz.lat)]);
			llz.lon=g[1];
			llz.lat=g[0];

			let zoom = llz.zoom-12;
			if (zoom > 7) zoom=7;

			for(let i=0; i < wmeAM_ArrW2KDL.length; ++i)
			{
				if(zoom == wmeAM_ArrW2KDL[i].w)
				{
					zoom=wmeAM_ArrW2KDL[i].r;
					break;
				}
			}
			llz.zoom= zoom;
			break;
		}
		case "_map_NCABY":
		{
			let urPos=new OpenLayers.LonLat(llz.lon,llz.lat);
			urPos.transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"));
			llz.lat=urPos.lat;
			llz.lon=urPos.lon;
			break;
		}
		case "_map_MRY":
		{
			llz.zoom--; // TEMP!!!
			break;
		}
		case "_map_WMFLAB":
		{
			function convertd2dms(degrees)
			{
				var mydegrees = parseInt(degrees);
				var remaining = degrees - (mydegrees * 1.0);
				var minutes = remaining * 60.0;
				var myminutes = parseInt(minutes);
				remaining = minutes - (myminutes * 1.0);
				var myseconds = remaining * 60.0;
					myseconds = Math.round (myseconds * 10.0) / 10.0;

				return {d:mydegrees,m:myminutes,s:myseconds};
			}
			var la=convertd2dms(llz.lat);
			llz.lat=la.d+'_'+la.m+'_'+la.s;
			var lo=convertd2dms(llz.lon);
			llz.lon=lo.d+'_'+lo.m+'_'+lo.s;
			llz.zoom = Math.pow(2, 12 - llz.zoom) * 100000; //??
			break;
		}
		case "_map_OSV":
		{
			if (llz.zoom > 18) llz.zoom=18;
			break;
		}
		case "_map_AMR":
		{
			//var ArrW2A=new Array({w:0,a:4},{w:1,a:5},{w:2,a:6},{w:3,a:7},{w:4,a:8},{w:5,a:9},{w:6,a:10});
			if (origzoom >= 7)
				llz.zoom=10;
			else
				llz.zoom=origzoom+4;
			break;
		}
		case '_map_VCUA':
		{
			break;
		}
		case '_map_MRUA':
		{
			break;
		}
		case '_map_KADUA':
		{
            let urPos=new OpenLayers.LonLat(llz.lon,llz.lat);
			urPos.transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:31256"));
			llz.lat=urPos.lat;
			llz.lon=urPos.lon;
			break;
		}
		case '_map_MAPBYS':
		{
			break;
		}
		case '_map_MAPLT':
		{
			break;
		}
        case '_map_REGLT':
        {
            var reglt = proj4(proj4('EPSG:4326'),proj4('EPSG:3346'),[parseFloat(llz.lon), parseFloat(llz.lat)]);
			llz.lon=reglt[1];
			llz.lat=reglt[0];

			let zoom = llz.zoom-12;
			if (zoom > 7) zoom=7;

			for(let i=0; i < wmeAM_ArrW2KDL.length; ++i)
			{
				if(zoom == wmeAM_ArrW2KDL[i].w)
				{
					zoom=wmeAM_ArrW2KDL[i].r;
					break;
				}
			}
			llz.zoom= zoom;
			break;
            break;
        }
        case '_map_KLIVE':
		{
			break;
		}
        case '_map_RBASE':
		{
			break;
		}
        case "_map_SPRO":
        {
            break;
        }
        case "_map_RRSTR":
        {
            break;
        }
	}
	if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_Convert_WME2Other(): return "+JSON.stringify(llz));
	return llz;
}


// R
function WmeAM_PostLoadOtherMaps()
{
	if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_PostLoadOtherMaps()");
	var waiting=false;
	var locType=WmeAM_GetLocationType();
	var llz=WmeAM_GetLLZ();
	if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_PostLoadOtherMaps(): locType="+locType+": {lat="+llz.lat+",lon="+llz.lon+",zoom="+llz.zoom+"}");

	switch(locType)
	{
		case "waze":
		{
			break;
		}
		case "NM":
		{
			break;
		}
		case "YM":
		{
			break;
		}
		case "google":
		{
			break;
		}
		case "2gis":
		{
			break;
		}
		case "re":
		{
			break;
		}
		case "sc":
		{
			break;
		}
        case "sco":
		{
			break;
		}
		case "wm":
		{
			break;
		}
		case "bm":
		{
			break;
		}
		case "kdl":
		{
			break;
		}
		case "ncaby":
		{
			if (map)
			{
				if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_PostLoadOtherMaps(): map.loaded="+map.loaded);
				if (map.loaded)
				{
					// http://map.nca.by/map.html?xy=6878238.761035528,3451752.4686308377&z=17
					var xy=__getQueryString(location.href, 'xy');
					if(xy != -1)
					{
						var axy=xy.split(",");
						llz.lon = parseFloat(axy[1]);
						llz.lat = parseFloat(axy[0]);
						llz.zoom = parseInt(__getQueryString(location.href, 'z'));
						if(llz.zoom > 19) llz.zoom=19;
						if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_PostLoadOtherMaps(): locType="+locType+": map.centerAndZoom({x:"+llz.lon+",y:"+llz.lat+"},"+llz.zoom+")");
						map.setZoom(llz.zoom).then(function() {
							map.centerAt({x:llz.lon,y:llz.lat});
							basemapGallery.select("google_satellite");
						});
						//basemapGallery.select("OpenStreetMap"); // google_satellite
						//map.centerAndZoom({x:llz.lon,y:llz.lat}, llz.zoom);
					}
				}
				else
					waiting=true;
			}
			break;
		}
		case "osm":
		{
			break;
		}
		case "mry":
		{
			break;
		}
		case "wmflab":
		{
			break;
		}
		case "osv":
		{
			break;
		}
		case "amr":
		{
			break;
		}
		case 'vcua':
		{
			break;
		}
		case 'mrua':
		{
			break;
		}
		case 'mapbys':
		{
			break;
		}
		case 'maplt':
		{
			break;
		}
        case 'reglt':
		{
			break;
		}
        case 'klive':
		{
			break;
		}
	}

	if (waiting)
	{
		setTimeout(WmeAM_PostLoadOtherMaps,2000);
	}
}



// SVE.
function WmeAM_clickJumpToMaps()
{
	if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_clickJumpToMaps("+this.id+")");

	var savedSelectedItems=[];
	if (wmeAM_restoreSelected && !(this.id === '_map_WME' || this.id.indexOf("_map_WME_") >= 0 || this.id === '_map_WMEB'))
	{
		if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_clickJumpToMaps("+this.id+"): save selected");
		for( var i=0; i < W.selectionManager.getSelectedFeatures().length; ++i)
			savedSelectedItems.push(W.selectionManager.getSelectedFeatures()[i].model);
	}

	var llz=WmeAM_GetLLZ();
	//if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_clickJumpToMaps("+this.id+"): llz={lat:"+llz.lat+",lon:"+llz.lon+",zoom:"+llz.zoom+"}");
	if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_clickJumpToMaps("+this.id+"): llz="+JSON.stringify(llz));

	if (this.id == '_map_WME' || this.id == '_map_WMEB' || this.id.indexOf("_map_WME_") >= 0)
		llz=WmeAM_Convert_Other2WME(llz);
	else
		llz=WmeAM_Convert_WME2Other(this.id,llz);

	if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_clickJumpToMaps("+this.id+"): wmeAM_Config["+this.id+"]="+JSON.stringify(wmeAM_Config[this.id]));

	var template=(typeof wmeAM_Config[this.id] !== "undefined")?wmeAM_Config[this.id].template:"";
	if (this.id.indexOf("_map_WME_") >= 0)
		template=wmeAM_Config["_map_WME"].template;
	var url=template.replace("{{city}}",llz.city).replace("{{lon}}",llz.lon).replace("{{lat}}",llz.lat).replace("{{zoom}}",llz.zoom) + ((this.id == '_map_WME' || this.id.indexOf("_map_WME_") >= 0 || this.id == '_map_WMEB')?"&marker=yes":"");

	if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_clickJumpToMaps("+this.id+"): " + url + ', _url'+this.id);

	if(wmeAM_restoreSelected && !(this.id == '_map_WME' || this.id.indexOf("_map_WME_") >= 0 || this.id == '_map_WMEB')) // restore selections
	{
		if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_clickJumpToMaps("+this.id+"): restore selected");
		setTimeout(function() {if (savedSelectedItems.length > 0){W.selectionManager.select(savedSelectedItems);savedSelectedItems.length=0;}},50);
	}

	if (this.id.indexOf("_map_WME_") >= 0) // DE...
	{
		if (this.getAttribute("AMfrom") === "mapbys") // EH...
		{
			window.open("http://map.nca.by/map.html?xy="+this.getAttribute("AMlink")+"&z=16",'_url_AM'+this.id);
		}
		url=url.split("&")[0]+"&AMlink="+this.getAttribute("AMlink");
	}

	window.open(url,'_url'+this.id);
}


// WME
function WmeAM_InsertWMEIcon()
{
	if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_InsertWMEIcon(): "+(document.getElementById('WME.AdditonalMaps_' + wmeAM_version)?"found":"none"));
	var nod=document.getElementById('WME.AdditonalMaps_' + wmeAM_version);
	if(nod)
	{
		// clear exist
		nod.innerHTML="";
	}
	else
	{
		// create new
		nod=document.createElement("div");
		nod.setAttribute('id', 'WME.AdditonalMaps_' + wmeAM_version);
		nod.setAttribute('unselectable', 'on');
        var leftPos = wmeAM_leftOffset;
        var topPos = wmeAM_topOffset;
        nod.setAttribute('style', 'position:absolute; top:' + topPos + '; left:' + leftPos + '; display:block; background-color:#eeeeee; visibility:' + (wmeAM_hideWindow ? "hidden":"visible") + ';cursor:pointer;');
	}

	nod.innerHTML="";

	function IsJsonString(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}

	var WMEAdditonalMapsLink=null;

	if ("undefined" === typeof localStorage.WMEAdditonalMapsLink || !IsJsonString(localStorage.getItem('WMEAdditonalMapsLink')))
	{
		localStorage.setItem('WMEAdditonalMapsLink', WmeAM_Config2String());
		WMEAdditonalMapsLink=localStorage.getItem("WMEAdditonalMapsLink");

		//if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): use WMEAdditonalMapsLink0!!! ");
	}
	else
	{
		WMEAdditonalMapsLink=localStorage.getItem("WMEAdditonalMapsLink");
		//if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): use custom WMEAdditonalMapsLink="+WMEAdditonalMapsLink);
	}

	var innerHTML="";
	if (WMEAdditonalMapsLink)
	{
		var aLinks = JSON.parse(WMEAdditonalMapsLink);
		// clear save
		for(var i in wmeAM_Config)
			wmeAM_Config[i].save = 0;

		// set save & create labels
		for (let i in aLinks)
		{
			if (["_map_WME","_map_WMEB","_map_LI"].indexOf(i) < 0)
			{
				//if(wmeAM_debug) console.log("process "+i +"  typeof wmeAM_Config[i]="+(typeof wmeAM_Config[i])+ " " + JSON.stringify(wmeAM_Config[i]));
				if (typeof wmeAM_Config[i] !== "undefined")
				{
					wmeAM_Config[i].save	 = 1;
					wmeAM_Config[i].title	= aLinks[i].title;
					wmeAM_Config[i].name	 = aLinks[i].name;
					wmeAM_Config[i].template = aLinks[i].template;

					innerHTML += "<a id='" + i + "' style='font-size: 10px' title='" + aLinks[i].title + "'>" + aLinks[i].name + "</a>&nbsp;";
				}
			}
		}
	}

	var main_site=location.hostname === "www.waze.com";
	nod.innerHTML = '<div>AdditonalMaps ' + wmeAM_version + '</div>'
                    + innerHTML
					+ "<a id='_map_LI' style='font-size: 10px' title='Open in LiveMap'>[Live]</a>&nbsp;"
					+ "<a id='_map_AB' tp="+(main_site?'A':'B')+" href='' style='font-size: 12px' title='Open in "+(main_site?"Beta":"Main")+" editor' target='" +CreateID()+ (main_site?"b":"a")+"' id='__map_BETAALPA'>["+ (main_site?"&#946;":"&#945;")+"]</a>&nbsp;"
					+ "<a href='https://greasyfork.org/en/scripts/472998-wme-additional-maps' title='WME-AdditonalMaps_" + wmeAM_version + "' style='font-size: 10px' target='_blank'>[?]</a>&nbsp;";

    document.getElementById('waze-map-container').parentElement.appendChild(nod);
    // document.getElementById("chat-overlay").parentElement.insertBefore(nod, document.getElementById("chat-overlay"));

    var drag     = new Object();
    drag.obj = nod; //document.getElementById('WME.AdditonalMaps_' + wmeAM_version);

    drag.obj.addEventListener('mousedown', function(e)
    {
        drag.top  = parseInt(drag.obj.offsetTop);
        drag.left = parseInt(drag.obj.offsetLeft);
        drag.oldx = drag.x;
        drag.oldy = drag.y;
        drag.drag = true;
    });

    window.addEventListener('mouseup', function()
    {
        drag.drag = false;
        localStorage.setItem("WMEAdditonalMapsTopOffset", drag.obj.style.top);
        localStorage.setItem("WMEAdditonalMapsLeftOffset", drag.obj.style.left);
    });

    window.addEventListener('mousemove', function(e)
                            {
        drag.x    = e.clientX;
        drag.y    = e.clientY;
        var diffw = drag.x - drag.oldx;
        var diffh = drag.y - drag.oldy;

        if (drag.drag)
        {
            drag.obj.style.left = drag.left + diffw + 'px';
            drag.obj.style.top  = drag.top  + diffh + 'px';
            e.preventDefault();
        }
    });


	if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_InsertWMEIcon(): innerHTML="+document.getElementById('WME.AdditonalMaps_' + wmeAM_version).innerHTML);

	{
		//if(wmeAM_debug) console.log("call JSON.parse");
		let aLinks = JSON.parse(WMEAdditonalMapsLink);
		//if(wmeAM_debug) console.log("call JSON.parse - done");
		for (let i in aLinks)
		{
			if (document.getElementById(i))
				document.getElementById(i).onclick	= WmeAM_clickJumpToMaps;
		}
		document.getElementById('_map_LI').onclick	= WmeAM_clickJumpToMaps;
		document.getElementById('_map_AB').onclick	= function(){
			var permalink="?"+wmer_generate_permalink().split("?")[1];
			if(wmeAM_debug) console.log("_map_AB.click(), permalink=",permalink);
			if(wmeAM_debug) console.log(this.getAttribute('tp'));
			var main_site=this.getAttribute('tp')==='A';
			this.href=(main_site?"https://beta.waze.com/editor":"https://www.waze.com/editor") + permalink;
			if(wmeAM_debug) console.log(this.href);
			//this.click();
			//return false;
		};
	}

	//WmeAM_UpdateJumpStyle();
}

// DAA
function WmeAM_InsertIcon()
{
	if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_InsertIcon()");
	var locType=WmeAM_GetLocationType();
	if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_InsertIcon(): locType="+locType);

	if(locType == "waze")
		return true;

	var result = false;

	var nod=document.createElement(locType === "mry" || locType === "osm" || locType === "re" || locType === "2gis" || locType === "YM"|| locType === "google"?"div":(locType === "NM"|| locType === "kadua"?"button":"span"));
	nod.setAttribute('id', 'WME.AdditonalMaps_' + wmeAM_version);
	window.nod=nod;

	var clsid=
	{
		"NM"	  : {t:0,c:"nk-app-bar-view__button_id_help"},
		"YM"	  : {t:2,c:"map-controls-view__zoom-control"},
		"google"  : {t:1,c:"mylocation"},
		"2gis"	  : {t:1,c:"root"},
		"sc"	  : {t:1,c:"map_right_menu"},
		"re"	  : {t:0,c:"zoom-buttons-container"},
        "sco"	  : {t:0,c:"map-layer-top"},
		"wm"	  : {t:1,c:"wm-Add"},
		"bm"	  : {t:1,c:"map_mb"},
		"kdl"	  : {t:1,c:"social_networks"},
		"ncaby"   : {t:1,c:"LocateButton"},
        "kadua"   : {t:1,c:"interfaceGuide"},
		"osm"	  : {t:0,c:"control-layers leaflet-control"},
		"mapbys"  : {t:1,c:"search_td"},
		"mry"     : {t:0,c:"comments"} //
	};

	if(typeof clsid[locType] === 'undefined')
	{
		WmeAM_PostLoadOtherMaps();
		return true;
	}

	var WazeControlAttribution = null;
	if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_InsertIcon(): clsid[locType]="+JSON.stringify(clsid[locType]));
	if(clsid[locType])
		WazeControlAttribution = clsid[locType].t == 1?document.getElementById(clsid[locType].c):(clsid[locType].t == 0 || clsid[locType].t == 2?document.getElementsByClassName(clsid[locType].c):document.getElementsByTagName(clsid[locType].c));
	if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_InsertIcon(): WazeControlAttribution="+(typeof WazeControlAttribution),WazeControlAttribution);

	var found00=false;
	if (WazeControlAttribution)
	{
		if (!clsid[locType].t)
		{
			if (WazeControlAttribution.length > 0)
			{
				found00=true;
			}
			else
			{
				if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_InsertIcon(): wait 1 ",locType,clsid[locType]);
				setTimeout(function() {WmeAM_InsertIcon();},500,this);
				return false;
			}
		}
		else
		{
			if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_InsertIcon(): found00=true;");
			found00=true;
		}

		if (!found00)
		{
			if(document.readyState != 'complete' && ++wmeAM_countProbe2 < 5)
			{
				if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_InsertIcon(): wait 2 ",locType,clsid[locType]);
				setTimeout(function() {WmeAM_InsertIcon();},500,this);
				return false;
			}
		}
	}
	else
	{
		if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_InsertIcon(): wait 3 ",clsid[locType]);
		setTimeout(function() {WmeAM_InsertIcon();},100,this);
		return false;
	}

	if (found00)
	{
		if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_InsertIcon(): found '", (clsid[locType].t?WazeControlAttribution:WazeControlAttribution[0]));
		if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_InsertIcon(): document.readyState=" + document.readyState);

		switch(locType)
		{
			case "NM":
			{
                nod.setAttribute('class', 'nk-button nk-button_size_xl nk-app-bar-view__button');
				nod.innerHTML = '<span class="nk-icon nk-icon_align_auto" style="cursor: pointer; width:32px; height:32px;"><img id="_map_WME" class="nk-icon nk-icon_align_auto" style="margin: -5.15em 0 -5em; vertical-align: middle; width:32px; height:32px;" alt="Open to WME" src="'+wmeAM_IconWME+'"></span>';
				WazeControlAttribution[0].parentElement.appendChild(nod);
				break;
			}
			case "YM":
			{
				nod.setAttribute('class', 'map-controls-view__control-group');
				nod.innerHTML = '<div class="map-controls-view__geolocation-control"><a id="_map_WME" class="map-geolocation-control" style="cursor: pointer;" title="Open to WME"><img src="'+wmeAM_IconWME+'" width="36px" height="36px"></a></div>';

				/*setTimeout(function() {WmeAM_InsertIcon();
					WazeControlAttribution[0].parentElement.parentElement.insertBefore(nod, WazeControlAttribution[0].parentElement);
					document.getElementById('_map_WME').onclick	 = WmeAM_clickJumpToMaps;
				},3000,this);
				}*/
                WazeControlAttribution[0].parentElement.parentElement.insertBefore(nod, WazeControlAttribution[0].parentElement);
				break;
			}
            case "sco":
			{
                nod.setAttribute('style', 'margin-top:64px;position:absolute; right:16px; z-index:1;');
				nod.innerHTML = "<div id='_map_WME' style='cursor: pointer;' title='Open to WME'><img width=32 height=32 src='"+wmeAM_IconWME+"'></div>";
				WazeControlAttribution[0].parentElement.insertBefore(nod, WazeControlAttribution[0]);
				break;
			}
			case "google":
			{
                nod.setAttribute('class', 'app-vertical-item');
				nod.innerHTML = "<div id='_map_WME' style='cursor: pointer;' title='Open to WME'><img width=29 height=29 src='"+wmeAM_IconWME+"'></div>";
				WazeControlAttribution.parentElement.insertBefore(nod, WazeControlAttribution);
				break;
			}
			case "2gis":
			{
				nod.setAttribute('style', 'margin-top:64px;position:absolute; right:16px; z-index:1;');
				nod.innerHTML = "<div id='_map_WME' style='border:5px solid #ffffff;border-radius:50%;width:30px;height:30px; float:right;' title='Open to WME'><img style='cursor: pointer;' width=30 height=30  src='"+wmeAM_IconWME+"'></div>";
                WazeControlAttribution.insertBefore(nod, WazeControlAttribution.firstChild);
				break;
			}
			case "re":
			{
                nod.setAttribute("class", "position toolButton-container");
				nod.innerHTML = "<div id='_map_WME' title='Open to WME'><img width=32 height=32  src='"+wmeAM_IconWME+"'></div>";
				WazeControlAttribution[0].appendChild(nod);
				break;
			}
			case "sc":
			{
				WazeControlAttribution.innerHTML=WazeControlAttribution.innerHTML+'<div id="_map_WME" class="btn-mc">Waze</div>';
				break;
			}
			case "wm":
			{
				WazeControlAttribution.innerHTML=WazeControlAttribution.innerHTML+'<div class="butt" id="_map_WME" title="Open in WME"><img style="cursor: pointer; padding-top: 0px;" width=39 height=39  src="'+wmeAM_IconWME+'"></div>';
				break;
			}
			case "bm":
			{
				nod.setAttribute('style', 'margin-top:64px; margin-right:5px; position:absolute; top:1px; right:16px; z-index:1;');
				nod.innerHTML = "<div id='_map_WME' style='cursor: pointer;' title='Open to WME'><img width=40 height=40 src='"+wmeAM_IconWME+"'></div>";
				WazeControlAttribution.parentElement.insertBefore(nod, WazeControlAttribution.nextSibling);
				break;
			}
			case "kdl":
			{
				WazeControlAttribution.innerHTML=WazeControlAttribution.innerHTML+'<a id="_map_WME" class="waze" title="Open in WME"></a>';
				document.styleSheets[0].insertRule("#social_networks a.waze { background:url("+wmeAM_IconWME+" );background-size: 100% 100%; right: 236px;}", 0);
				break;
			}
			case "ncaby":
			{
				WazeControlAttribution.innerHTML=WazeControlAttribution.innerHTML+
				  '<div style="display: block; top: 340px;" widgetid="WazeButton" id="WazeButton" role="presentation">'+
					'<a id="_map_WME" title="Open to WME"><img style="cursor: pointer; padding-left: 4px;" width=28 height=28  src="'+wmeAM_IconWME+'"></a></div>';
				break;
			}
			case "osm":
			{
				nod.setAttribute('class', "leaflet-control");
				nod.innerHTML = "<a id='_map_WME' title='Open to WME'><img style='cursor: pointer; padding-top: 0px;' width=39 height=39  src='"+wmeAM_IconWME+"'></a>";
				WazeControlAttribution[0].parentElement.insertBefore(nod, WazeControlAttribution[0]);
				break;
			}
            case "kadua":
			{
				nod.innerHTML = "<a id='_map_WME' class='icon' title='Open to WME'><img style='cursor: pointer; padding-top: 0px;' width=20 height=20  src='"+wmeAM_IconWME+"'></a>";
				WazeControlAttribution.parentElement.insertBefore(nod, WazeControlAttribution.nextSibling);
				break;
			}
			case "mry":
			{
				WazeControlAttribution[0].parentElement.parentElement.innerHTML=
					'<div _ngcontent-yrv-39="" id="WME.AdditonalMaps_' + wmeAM_version + '" class="IconContainer bg-icon m1 mt2 relative cursor-pointer pointer-events-auto" dropup-control="" for="">' +
						'<a id="_map_WME" title="Open to WME"><img style="cursor: pointer; padding-left: 4px;" width=28 height=28  src="'+wmeAM_IconWME+'"></a></div>' +
					WazeControlAttribution[0].parentElement.parentElement.innerHTML;
				break;
			}
		}

		if (document.getElementById('_map_WME'))
		{
			document.getElementById('_map_WME').onclick	 = WmeAM_clickJumpToMaps;
			result=true;
		}
		if (document.getElementById('_map_WMEB'))
		{
			document.getElementById('_map_WMEB').onclick	 = WmeAM_clickJumpToMaps;
			result=true;
		}
	}
	else
	{
		if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_InsertIcon(): ELSE typeof WazeControlAttribution="+(typeof WazeControlAttribution)+", clsid[locType].t="+clsid[locType].t +", WazeControlAttribution.length="+WazeControlAttribution.length+" ["+(WazeControlAttribution && (clsid[locType].t || WazeControlAttribution.length >= 1))+"]");
	}

	if (result)
		WmeAM_PostLoadOtherMaps();

	return result;
}

function WmeAM_onWazeTabReady()
{

    document.getElementById("wmeAM_cfg_resetConfig").onclick = function(){
        setTimeout(function() {
            if(confirm("Reset config for WME-AdditonalMaps?"))
            {
                let d=document.getElementById(CreateID());
                d.parentNode.removeChild(d);
                d=document.getElementById("pwmeAdditonalMaps");
                d.parentNode.removeChild(d);

                localStorage.removeItem("WMEAdditonalMapsLink");
                for(var i in wmeAM_Config)	{ delete wmeAM_Config[i]; }
                wmeAM_Config = cloneConfig(wmeAM_Config0);

                localStorage.removeItem("WMEAdditonalMapsDebug");
                wmeAM_debug=false;

                WmeAM_InsertWMEIcon();
                WmeAM_InitConfig();
            }
        },100,this);
        return false;
    };

    document.getElementById("wmeAM_cfg_debug").onclick = function(){wmeAM_debug=this.checked;localStorage.setItem("WMEAdditonalMapsDebug",wmeAM_debug?"1":"0");};
    document.getElementById("wmeAM_cfg_debug").checked = wmeAM_debug;

    document.getElementById("wmeAM_cfg_savedsel").onclick = function(){
        wmeAM_restoreSelected=this.checked;
        localStorage.setItem("WMEAdditonalMapsRestoreSelected",wmeAM_restoreSelected?"1":"0");
    };
    document.getElementById("wmeAM_cfg_savedsel").checked = wmeAM_restoreSelected;

    document.getElementById("wmeAM_cfg_window_hide").onclick = function(){
        wmeAM_hideWindow=this.checked;
        localStorage.setItem("WMEAdditonalMapsHideWindow",wmeAM_hideWindow?"1":"0");
        document.getElementById('WME.AdditonalMaps_' + wmeAM_version).style.visibility = wmeAM_hideWindow ? "hidden":"visible";
    };
    document.getElementById("wmeAM_cfg_window_hide").checked = wmeAM_hideWindow;

    document.getElementById("wmeAM_cfg_resetWPos").onclick = function(){
        localStorage.setItem("WMEAdditonalMapsTopOffset", wmeAM_defaultTopOffset);
        localStorage.setItem("WMEAdditonalMapsLeftOffset", wmeAM_defaultLeftOffset);

        document.getElementById('WME.AdditonalMaps_' + wmeAM_version).style.left = wmeAM_defaultLeftOffset;
        document.getElementById('WME.AdditonalMaps_' + wmeAM_version).style.top = wmeAM_defaultTopOffset;

        wmeAM_topOffset = wmeAM_defaultTopOffset;
        wmeAM_leftOffset = wmeAM_defaultLeftOffset;
    };

    var __wmeAM_cfg_editlab__=document.getElementsByClassName("__wmeAM_cfg_editlab__");
    for(let i=0; i < __wmeAM_cfg_editlab__.length; ++i)
    {
        __wmeAM_cfg_editlab__[i].onclick= function(){
            var id=this.getAttribute('data');
            var dstyle=document.getElementById("wmeAM_inp_"+id+"_all").style.display;
            document.getElementById("wmeAM_inp_"+id+"_all").style.display=(dstyle=="block")?"none":"block";
            //document.getElementById("wmeAM_inp_"+id+"_all").style.display="block";
            //wmeAM_cfg_'+id+'_val
        };
    }

    var aLinks = JSON.parse(localStorage.getItem('WMEAdditonalMapsLink'));
    for(let i in wmeAM_Config)
    {
        if (["_map_WME","_map_WMEB","_map_LI"].indexOf(i) >= 0)
            continue;

        document.getElementById("wmeAM_cfg_"+i).checked = typeof aLinks[i] != "undefined"?true:false;
        var name=wmeAM_Config[i].name;
        if (name.length > 0)
            document.getElementById("wmeAM_cfg_"+i+"_val").value = name;
        let title=wmeAM_Config[i].title;
        if (title.length > 0)
        {
            document.getElementById("wmeAM_cfg_"+i+"_tit").value = title;
            document.getElementById("wmeAM_cfg_"+i+"_chklab").innerHTML="&nbsp;"+title;
        }
        let template=wmeAM_Config[i].template;
        if (template.length > 0)
        {
            document.getElementById("wmeAM_cfg_"+i+"_templ").value = template;
        }

        // оD
        document.getElementById("wmeAM_cfg_"+i).onchange = function(){
            var id=this.getAttribute('data');
            //document.getElementById("wmeAM_inp_"+id+"_all").style.display=this.checked?"block":"none";
            localStorage.setItem('WMEAdditonalMapsLink', WmeAM_Config2String());
            WmeAM_InsertWMEIcon();
        };

        // DA
        document.getElementById("wmeAM_cfg_"+i+"_val").onchange = function(){
            var id=this.getAttribute('data');
            wmeAM_Config[id].name=this.value;
            localStorage.setItem('WMEAdditonalMapsLink', WmeAM_Config2String());
            WmeAM_InsertWMEIcon();
        };

        // BEBE
        document.getElementById("wmeAM_cfg_"+i+"_tit").onchange = function(){
            var id=this.getAttribute('data');
            wmeAM_Config[id].title=this.value;
            document.getElementById("wmeAM_cfg_"+id+"_chklab").innerHTML="&nbsp;"+this.value;
            localStorage.setItem('WMEAdditonalMapsLink', WmeAM_Config2String());
            WmeAM_InsertWMEIcon();
        };

        // BABA
        document.getElementById("wmeAM_cfg_"+i+"_templ").onchange = function(){
            var id=this.getAttribute('data');
            wmeAM_Config[id].template=this.value;
            localStorage.setItem('WMEAdditonalMapsLink', WmeAM_Config2String());
            WmeAM_InsertWMEIcon();
        };

        // BEBEEB
        document.getElementById("wmeAM_cfg_"+i).onclick = function(){
            var id=this.getAttribute('data');
            wmeAM_Config[id].save=this.checked?1:0;
            localStorage.setItem('WMEAdditonalMapsLink', WmeAM_Config2String());
            WmeAM_InsertWMEIcon();
        };
    }



    //WmeAM_InsertWMEIcon()

}

function WmeAM_InitConfig()
{
	if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_InitConfig(): "+document.getElementById(CreateID()));
	if(!document.getElementById(CreateID()))
	{
		var srsCtrl = document.createElement('section');
		srsCtrl.id = CreateID();


        var padding="padding:5px 9px";

        // -------------------------------
        var strFormCode = ''
        +'<div class="side-panel-section">'
        +'<h4>WME AdditonalMaps <sup>' + wmeAM_version + '</sup>&nbsp;<sub><a href="https://greasyfork.org/en/scripts/472998-wme-additional-maps" target="_blank"><span class="fa fa-external-link"></span></a></sub></h4>'
        +'<form class="attributes-form side-panel-section" action="javascript:return false;">'

        +'<div class="form-group">'
        +'<label class="control-label">Podešenja:</label>'
        +'<div class="controls">';
        for(var i in wmeAM_Config)
        {
            if (["_map_WME","_map_WMEB","_map_LI"].indexOf(i) >= 0)
            {
                continue;
            }
            var id=i;
            var title=wmeAM_Config[i].title;
            var template=wmeAM_Config[i].template;
            var save=wmeAM_Config[i].save;
            strFormCode += ''
                +'<div class="form-group">'
                +'<label class="control-label">'
                +'<input data="'+id+'" name="wmeAM_cfg_'+id+'" id="wmeAM_cfg_'+id+'" type="checkbox"><label id="wmeAM_cfg_'+id+'_chklab" for="wmeAM_cfg_'+id+'">&nbsp;'+title+'</label>'
                +'</label>' + '&nbsp;<a style="display: inline;" class="__wmeAM_cfg_editlab__" data="'+id+'"><i class="waze-icon-edit"></i></a>'
            //+'<div class="controls" id="wmeAM_inp_'+id+'_all" '+(save?'':'style="display: none;"')+'>'
                +'<div class="controls" id="wmeAM_inp_'+id+'_all" style="display: none;">'
                +'IME: <input data="'+id+'" type="text" class="form-control" autocomplete="off" id="wmeAM_cfg_'+id+'_val" name="wmeAM_cfg_'+id+'_val" value="'+wmeAM_Config[id].name+'" size="13"/></label><br>'
                +'X: <input data="'+id+'" type="text" class="form-control" autocomplete="off" id="wmeAM_cfg_'+id+'_tit" name="wmeAM_cfg_'+id+'_tit" value="'+title+'" size="13"/></label><br>'
                +'MAPA: <input data="'+id+'" type="text" class="form-control" autocomplete="off" id="wmeAM_cfg_'+id+'_templ" name="wmeAM_cfg_'+id+'_templ" value="'+template+'" size="13" title="Подстановочные знаки: {{city}}, {{lon}}, {{lat}}, {{zoom}}"/></label><br>'
                +'</div>'
                +'</div>'
                + '';
        }

        strFormCode += ''
            +'</div>'
            +'</div>';

        // -------------------------------
        strFormCode += ''
            +'<div class="form-group">'
            +'<label class="control-label">Other settings::</label>'
            +'<div class="controls">'
            +'<input name="wmeAM_cfg_savedsel" value="" id="wmeAM_cfg_savedsel" type="checkbox"><label for="wmeAM_cfg_savedsel" title="Восстанавливать выделенные объекты после прыжка">&nbsp;Restore selected</label>'
        //						+'<br>'
        //						+'<input name="wmeAM_cfg_around" value="" id="wmeAM_cfg_around" type="checkbox"><label for="wmeAM_cfg_around" title="">&nbsp;Show link around</label>'
        //wmeAM_around
            +'<br>'
            +'<input name="wmeAM_cfg_debug" value="" id="wmeAM_cfg_debug" type="checkbox"><label for="wmeAM_cfg_debug" title="Включить логирование">&nbsp;Debug script</label>'
            +'<br>'
            +'<button id="wmeAM_cfg_resetConfig"  class="btn btn-default" style="font-size:9px;'+padding+'" title="Reset config!"><i class="fa fa-recycle"></i>&nbsp;Reset config</button>'
            +'<br>'
            +'<button id="wmeAM_cfg_resetWPos"  class="btn btn-default" style="font-size:9px;'+padding+'" title="Reset window position!"><i class="fa fa-recycle"></i>&nbsp;Reset window position</button>'
            +'<input name="wmeAM_cfg_window_hide" value="" id="wmeAM_cfg_window_hide" type="checkbox"><label for="wmeAM_cfg_window_hide" title="Hide Window">&nbsp;Hide Window</label>'
            +'<br>'
            +'</div>'
            +'</div>'

            +'</form>'
            +'</div>'
            +'';

        srsCtrl.className = "tab-pane";
        srsCtrl.innerHTML = strFormCode;
        WazeWrap.Interface.Tab('AM', strFormCode, WmeAM_onWazeTabReady);
	}
	else
		if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_InitConfig(): not found '"+CreateID()+"'");
}

//
function WmeAM_FakeLoad()
{
	if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): start WmeAM_FakeLoad(): this"+ this);
	var loctype=WmeAM_GetLocationType();
	if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): start WmeAM_FakeLoad(): loctype="+loctype);

	if(window.document.getElementById('WME.AdditonalMaps_' + wmeAM_version)) // если ЭТО есть, значит другие проверки пройдены
	{
		if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_FakeLoad(): FOUND WME.AdditonalMaps_" + wmeAM_version + "!!!. Done");
		return;
	}

	if (loctype === "waze")
	{
		if (typeof Waze === "undefined")
		{
			if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_FakeLoad(): wait W. Wait 500ms");
			setTimeout(WmeAM_FakeLoad,500);
			return;
		}
		if (typeof W.selectionManager === "undefined")
		{
			if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_FakeLoad(): wait W.selectionManager. Wait 500ms");
			setTimeout(WmeAM_FakeLoad,500);
			return;
		}
		if (document.getElementsByClassName('olControlAttribution')[0] === null)
		{
			if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_FakeLoad(): wait waze olControlAttribution. Wait 500ms");
			setTimeout(WmeAM_FakeLoad,500);
		}
        if (!WazeWrap?.Ready) {
            if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_FakeLoad(): wait WazeWrap. Wait 500ms");
			setTimeout(WmeAM_FakeLoad,500);
            return;
        }
	}

	if (document.readyState != 'complete' && ++wmeAM_countProbe2 < 5)
	{
		if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_FakeLoad(): document.readyState != 'complete', wmeAM_countProbe="+wmeAM_countProbe2+". Wait 3000ms");
		setTimeout(WmeAM_FakeLoad,3000);
		return;
	}

	// DEDDD
	if (loctype === "waze")
	{
		// AAAAAAAAAA (EPSG:900913).
		if (__getQueryString(location.href, "AMlink") != -1)
		{
			var AMlink=__getQueryString(location.href, "AMlink").split(",");
			var urPos=new OpenLayers.LonLat(AMlink[1],AMlink[0]);
			urPos.transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));
	        var xy = OpenLayers.Layer.SphericalMercator.forwardMercator(parseFloat(urPos.lon), parseFloat(urPos.lat));
    	    W.map.setCenter(xy);
		}
		WmeAM_InsertWMEIcon();
		WmeAM_InitConfig();
		WmeAM_initBindKey();
	}
	else
	{
		// DEEEEEEE...
		if(document.getElementById('WME.AdditonalMaps_' + wmeAM_version) === null && !WmeAM_InsertIcon())
		{
			if(++wmeAM_countProbe < 8) // 8 попыток
			{
				let cls="";
				if(wmeAM_debug) console.log("WME-AdditonalMaps (" + wmeAM_version + "): not other found '"+cls+"'. wmeAM_countProbe="+wmeAM_countProbe+". Wait 5000ms");
				setTimeout(WmeAM_FakeLoad,5000);
				return;
			}
		}
		//WmeAM_PostLoadOtherMaps();
	}
    proj4.defs([
        [
            'EPSG:31256',
            '+proj=tmerc +lat_0=0 +lon_0=16.33333333333333 +k=1 +x_0=0 +y_0=-5000000 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs'],
        [
            'EPSG:4326',
            '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'],
        [
            'EPSG:3346',
            '+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9998 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs']
    ]);
}


function __GetLocalStorageItem(Name,Type,Def,Arr)
{
	//if (wme2GIS_debug) console.log("__GetLocalStorageItem(): Name="+Name+",Type="+Type+",Def="+Def+",Arr="+Arr);
	var tmp0=localStorage.getItem(Name);
	if (tmp0)
	{
		switch(Type)
		{
			case 'string':
				break;
			case 'bool':
				tmp0=(tmp0 === "true" || tmp0 === "1")?true:false;
				break;
			case 'int':
				tmp0=!isNaN(parseInt(tmp0))?parseInt(tmp0):0;
				break;
			case 'arr':
				if (tmp0.length > 0)
					if(!Arr[tmp0])
						tmp0=Def;
				break;
		}
	}
	else
		tmp0=Def;
	return tmp0;
}


// EA
function WmeAM_bootstrap()
{
	console.log("WME-AdditonalMaps (" + wmeAM_version + "): WmeAM_bootstrap()");

	wmeAM_Config = cloneConfig(wmeAM_Config0);

	wmeAM_debug				= __GetLocalStorageItem("WMEAdditonalMapsDebug",'bool',false);
	wmeAM_restoreSelected	= __GetLocalStorageItem("WMEAdditonalMapsRestoreSelected",'bool',false);
	wmeAM_around			= __GetLocalStorageItem("WMEAdditonalMapsAround",'bool',false);
    wmeAM_hideWindow		= __GetLocalStorageItem("WMEAdditonalMapsHideWindow",'bool',false);
    wmeAM_topOffset		    = __GetLocalStorageItem("WMEAdditonalMapsTopOffset",'string', wmeAM_defaultTopOffset);
    wmeAM_leftOffset		= __GetLocalStorageItem("WMEAdditonalMapsLeftOffset",'string', wmeAM_defaultLeftOffset);

	setTimeout(function() {WmeAM_FakeLoad();},(WmeAM_GetLocationType() === "YM")?3000:500,this);
}

function WmeAM_clickJumpToMapsArg()
{
	if ((typeof arguments[0]) === "object")
	{
		var o=document.getElementById(arguments[0].id);
		if (typeof o !== "undefined")
		{
			if (arguments[0].save)
				o.click();
		}
	}
}

function WmeAM_initBindKey()
{
	if(wmeAM_debug) console.log("WmeAM_initBindKey()");
	if(!W || !W.model || !I18n || !W.accelerators || !W.model.countries || !W.model.countries.top) {
		setTimeout(WmeAM_initBindKey, 500);
		return;
	}

    var Config =[];

	for(let i in wmeAM_Config)
	{
        Config.push({handler: 'WME-AdditonalMaps'+i,  title: wmeAM_Config[i].title,  func: WmeAM_clickJumpToMapsArg, key:-1, arg:{id:i,save:wmeAM_Config[i].save}});
	}

    for(let i=0; i < Config.length; ++i)
    {
        WMEKSRegisterKeyboardShortcut('WME-AdditonalMaps', 'WME-AdditonalMaps', Config[i].handler, Config[i].title, Config[i].func, Config[i].key, Config[i].arg);
    }

    WMEKSLoadKeyboardShortcuts('WME-AdditonalMaps');

    window.addEventListener("beforeunload", function() {
        WMEKSSaveKeyboardShortcuts('WME-AdditonalMaps');
    }, false);

}


WmeAM_bootstrap();
/*
a=$("#search_td").find("a")
for(i=0; i < a.length;++i){if(a[i].href.indexOf("maps.by/map/")>0)console.log(a[i].href)}
*/


// from: https://greasyfork.org/en/users/5920-rickzabel
/*
when adding shortcuts each shortcut will need a uniuque name
the command to add links is WMERegisterKeyboardShortcut(ScriptName, ShortcutsHeader, NewShortcut, ShortcutDescription, FunctionToCall, ShortcutKeysObj) {
    ScriptName: This is the name of your script used to track all of your shortcuts on load and save.
    ScriptName: replace 'WMEAwesome' with your scripts name such as 'SomeOtherScript'
    ShortcutsHeader: this is the header that will show up in the keyboard editor
    NewShortcut: This is the name of the shortcut and needs to be uniuque from all of the other shortcuts, from other scripts, and WME
    ShortcutDescription: This wil show up as the text next to your shortcut
    FunctionToCall: this is the name of your function that will be called when the keyboard shortcut is presses
    ShortcutKeysObj: the is the object representing the keys watched set this to '-1' to let the users specify their own shortcuts.
    ShortcutKeysObj: The alt, shift, and ctrl keys are A=alt, S=shift, C=ctrl. for short cut to use "alt shift ctrl and l" the object would be 'ASC+l'
*/
function WMEKSRegisterKeyboardShortcut(e,r,t,a,o,s,c){try{I18n.translations[I18n.locale].keyboard_shortcuts.groups[e].members.length}catch(n){W.accelerators.Groups[e]=[],W.accelerators.Groups[e].members=[],I18n.translations[I18n.locale].keyboard_shortcuts.groups[e]=[],I18n.translations[I18n.locale].keyboard_shortcuts.groups[e].description=r,I18n.translations[I18n.locale].keyboard_shortcuts.groups[e].members=[]}if(o&&"function"==typeof o){I18n.translations[I18n.locale].keyboard_shortcuts.groups[e].members[t]=a,W.accelerators.addAction(t,{group:e});var l="-1",i={};i[l]=t,W.accelerators._registerShortcuts(i),null!==s&&(i={},i[s]=t,W.accelerators._registerShortcuts(i)),W.accelerators.events.register(t,null,function(){o(c)})}else alert("The function "+o+" has not been declared")}function WMEKSLoadKeyboardShortcuts(e){if(localStorage[e+"KBS"])for(var r=JSON.parse(localStorage[e+"KBS"]),t=0;t<r.length;t++)W.accelerators._registerShortcuts(r[t])}function WMEKSSaveKeyboardShortcuts(e){var r=[];for(var t in W.accelerators.Actions){var a="";if(W.accelerators.Actions[t].group==e){W.accelerators.Actions[t].shortcut?(W.accelerators.Actions[t].shortcut.altKey===!0&&(a+="A"),W.accelerators.Actions[t].shortcut.shiftKey===!0&&(a+="S"),W.accelerators.Actions[t].shortcut.ctrlKey===!0&&(a+="C"),""!==a&&(a+="+"),W.accelerators.Actions[t].shortcut.keyCode&&(a+=W.accelerators.Actions[t].shortcut.keyCode)):a="-1";var o={};o[a]=W.accelerators.Actions[t].id,r[r.length]=o}}localStorage[e+"KBS"]=JSON.stringify(r)}
/* ********************************************************** */
