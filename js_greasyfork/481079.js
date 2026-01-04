// ==UserScript==
// @name WME JumpMaps
// @description The script adds in the WME links to third party mapping systems (Google/Open Street Maps/HERE etc.)
// @license MIT
// @match https://*.waze.com/*editor*
// @match https://www.kadastrs.lv/map/*
// @match https://kartes.lgia.gov.lv/*
// @match https://*.balticmaps.eu/*
// @match https://maps.google.com
// @match https://maps.apple.com
// @match https://wikimapia.org/*
// @match https://www.openstreetmap.org/*
// @match https://mapcam.info/speedcam/*
// @match https://www.mapillary.com/*
// @require https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.11.0/proj4.js
// @require https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @icon data:image/png;base64,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
// @version 5.5a
// @author skirda, alexletov, N190392
// @namespace https://greasyfork.org/en/scripts/481079-wme-jumpmaps
// @downloadURL https://update.greasyfork.org/scripts/481079/WME%20JumpMaps.user.js
// @updateURL https://update.greasyfork.org/scripts/481079/WME%20JumpMaps.meta.js
// ==/UserScript==

/* global W, WazeWrap */

var wmeJM_version = "5.5a";
console.log("WME-JumpMaps (" + wmeJM_version + "): Start");

var wmeJM_IconWME='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAABOCAYAAACOqiAdAAAcmElEQVR4Ae1ceXBdV3n/3bdJetp3ybIsL7G8KLbjJY7txMEkMSSEQAMJTJsJbdNOSwn/AKUw7XSA6dDpdCjMdJIyZQbagQHKhDJ0mmlJSeIkjheME2+yLVmOZEuWrH17etLbb3+/c999lh3J1ntyyDI59tW599yzfb/zfd/5znfOfZZt23g7wo9/c74klIxtS8Fea8NeA1i87CWMi9mfYvZKMSwgxIiXzcvqY9xuwWr3wGor9gaOPnbHLZPK97sO1u8KuGcA7+ChM3vslH0f0biHDW8lON7FEExQk7ZlvQYbL1oe6/manetfepRpi6lzoWXfcuD+9cjpTYmE/Ths6zFyVt1CO5ZLPnJiPyz7xz6f9aM/395yIpc6FlrmLQPu6UOtH7VT+Bt2ZMdCO3OT8x22PPjmkztvffYm12uqu+nAPXXw9CcpOn9LXbTprehw9nVaJ6ga/u7zu1r+M/uy85e4acB979C5tTE7/jRs+575m3v73liW9YLf8n/+z3Y2t92MXiwauGfOnAkMjuNr1F9/SdACN6NTb1kdlhWjHvxWTRm+8ej69bHFtLMo4L57tGNlKhb9GS2abYvpxO+6rGXhaJ7P/6k/3b6mK9e2PbkWlC4jaK+/20ATvepzNBE/ZvRxjgDkBNy/HDz9V2z95+xAaY7tvu3FTN9Jg6Elh95kK6rWU4dO/xNS9hdyaOudW8RjfefzO1u+xA4ueBmVDXDW0wdP/4ArjT965yKQe8846/77k7tanlgoeAsWVXHaexU0wS3ajDQtEPsFAUdO+8p7TjznAogqyNA617tr0m4oqs5KwP75NeVuymMqmUQiFkV8JoSR7osY7e9HaGgE0ekZzISmEIvFkEomQDGCzxeAx+tFflEQwdJilFRUoryhHuX1DQgEC+HPL4TlWRAf3LjvlvXIjVYa1wUubafJ5Lips2d0KoTJwW5MDY+gr/MChnsHMTUaQjxuw+dJwudNwe+zeSUJBvV1iv8V2RYSCS/iST9iKT/fWygpL0JxeQka1qxC/epmFFTUwutblNOFA4UJTyBvy19sW905H8rzAuesCFIHZPPMVzib9FQqhVg4hNGL59Hb3kHA+hGbicBvTaOqKozmxhjqamdQXhJFfiCBYF4UAX+MRCTYjE3OI3C8onEL4Wk/xiYDuHQ5iM7LZZgIFyIcqUQplwRNa5ahYdPtyC8uIYf6suniVXllJNeUee6cb4Uxb81mGXWTQEvG4wiPDaOv7TQutZ1HeGQAJYVhlNcksG5lFE1NM2iqiaCiaAoFgQi5Lo48Xh6CZhkLgQs6cp1shWTKQpTX9IwXIwSve3AMg6P5aD03go7uSnSEw4jzfX3zWhSUllG0S64CZKEPYhhhwPzy8LwpzMlx6QX7iZux9kwm4uS0KQycb0fb/pcolsOoqgXuuD2GVU0J7Lg1jJqqEIowDSTCAHUeyJ1EiDH7a1Nv0WNpgmJJIUXZXBTjcMyHsakAjrZX4NkXlqKto4ycV4lV226nDlyKiqXL4fX7nfLZ/uXaNmD5N83lGJgTOE4ILxC0e7Jt59r8CSr34c6zRvGf3X+Iyj6B3Xcn8elHprFuGbnL4jp7gmBNThGkiCOLqoRygoyiF1q8FJng3hA86jw6LgE/HfBFcYzFffjZc034j1+sgOUvQGV9Fdbtvge1q9dRV+am9+RVoX13n9u6G78JuJs1i8olf+HIPpx6+TAmR8ZRUpLCl78cwwe3zsDHyYFs4nBXkvcUS1LGPom7BIx7qZsuULpXcJ8luArpmOKJPCrBygieO1qDp76/Hr2Xi9GwrBQ7PvUoSmqX5gwe+/SmWVa9vToYJ+TVSdk+yYQYPHcKrfsPY2ZiHKtWpvDVr8ZxV0sYviECNsr9lfgYq50gViTWAEaOcMEz4KSBzIBIYPTeBTaTV5zEdA/fk+MwEMTdm0bxxKfP4cF7uzBwKYz2V19GlLpPg5lTmAOTq4CTu5sjuCjPrUCbHOjD6X0vITw6gY8+lMTjjyVxe3MEBSHqsWmBRsBS5DIRIiAsEc9YAJgr/ey+k9hK1Axwuuele5Oue7c8i9tetuPDBzaP4qG9l7Fl4yV0HL+EnpOvGZuROXII9iYHmytF2eqVkN4juJKQ5Z1NpR4JhdB96hguX+zH7duT2LMrji1rIyiOzwAz1Gcpcpwt0WTlhntEuB4EjEBUOi9xkJ5lx81Od9/PjkWFyZ+uK+5HOSeQW6qncd/ufvisCfScPkvjehCa4XMJ12KTAU67UaxwURsriXgUE/29uHiilbZYHA/eD7Q0xVFDmwzitqQmAcaaLg33uGC53RBYaeJdYDJIKkH55rpUThdfK1YUCaDUa2H7raNoXjWG/u7LGL7YhXiUA5hb2JHGyJR2e0yLHJ/JrT6nlAzcSGgCfWePc+k0ht17LGzdEENRgh2d4JUQcLxkkAkcBUOoxIzPBjDF6XS9z4it0gXy7Hzpe1OA96YOFtYsq3xJL7y8qoNJ3H9fH1Kc0fs72jAzGUIyIb2afTDbnOliahHaLObk9AfZV3WlRDQ0jrG+y7jQeh419RaeeDyFUoHG1QFiBCxF3WZENA1UBqE0UoZjCGoGLNleLke6aM4Rm3JKFymy51VGkwCvhIWCaAB7N49g7ZpxXO66TInoR3RKE1MOgXvDBisWNcCZHfZFbBZrthrt6cLgGx3EaAq/97AH9Vw6ecK00+LUazavJO8zXCNCBaAuBoOHiE0TbrhH6S4g6byZ8uq2W14xnw2AKpN+Z3Qen2mmBPNt3HvnAPsyg7HLvQgNXs5phtWGurBirQ5w5liCnnIMiWjELKWkQ5Yts/CBO5LwR6iEkzJqxW2MxQHGqHXBSDdmxE/3It4FQMTPujLAsg5zz9dGJNPPs8VV9wY8t74UfFxdbFs/hppqAdeHgYt91Bi5iauLlXqnztxj4hz/TA71cyk1QG4bw4ZbbSytTcLDVYMDnMwOLtRFsAlpyjMiJk5ziU1nMln4R1yjHprndOw+ZDiM6cqjvOadeeAtn3WRMy12YUl1DI1LpmlXDlEHD9Ma4oSVS0hj5dGpIS4ftuZSh1tmvL8P4fFJ5Pvi2LjBg6CPoFEZI8XOSa/ZHF1DhEscSxquEHECzkVHNbr3yqt37nulp8XSQSqdNw2U8mXA4qtZeayUB4X5SaxomEJqZgqTwxMYGxig5IYhacnGMBZWwsw3nordzibVo5yCDN6RC12sIIqqag+VMGsLCzSCJ+C0YFdwiTLrSxErQBRmAzUbWL13n+kjMUArv9L0N11es7S5Z7oGQfWn8yifuSVwdO9hVeMMvN4ohgZHcO7AATQ0r0a+nKLVdIYWFMDj8xlnqSk3zx9W4xVmPiIoUnMKxgSZHMcQxbSqMoYVKywsrSZo47w0GQg8Kw2cocAh2gFRreqZY+Zyo9Fxbm8IKNPtNLBOqsBxumobgJRFCTaT2Y4xdfTezeTkNdwdSRK4YRQFqtEzbqH1wBhOvnoU5RXlaFhdh2Ubt6C0tg5lS5alC80fCTMOhA715RjY0ckBzlJjk1i/2eaa1KK4kgC6kmgskRBehjDWb2jRnzRRLqdl3jPdiK36onsHNEFiUpTPzcsEF94ry08eNTR52b4Gy7xgbNQFCyTqsbppCf7+a/nGITMykkLHBeDYyVG0ng7h0rlulFZXoWX3DizbvINYSxLmDsKM8785CTl3jhukcobBJJcxiWiCs6kHTUtJjpY0MjDt2cpXxKdF0uAgsh1AnCZ0r8tNd54NtxFMi2Vn51ZeYajcRoQJki09yjOFltGpHDC1Z9EWzK+n16SBrqcaOkjzsKIxyeWsDeXYdWcSj3w8gVd/G8dzz0VxmTZe67598OUVoOHWzcwxX7AMx7HW3IJNjpsen+BGio3KCqC8VMDxksgYQkRaOriUu7GbbiBhYiZdNxkNZnI5T5kMfK02BKgTOxHbFFjeAsa8fIV8zGNMD7AuD0Fkv7xJlWESl2NUeAiWW9iy2U+Pso22thj2H5xE//nzNwDOXsLtDquI42U6mM0fzUTJOD0ho2PGwKyp8qCijPUkRAAvSzMpb83FP4oVXHHLvDOJTFcf0pnMO0dUjA4zZZxn5TbZzCQjDlO6hzhy8ePNo4gFiUppGiwenmKaURlGB0oSWLlhTu5j8DZOkSwt9qBxqQcT1H3JRIwbRyOmmfn/WMUy1c0h5fkzzf1GwCViEYRD3GAhp1VXWijjwNocOfh5ycAUGMa7oTrYS+keFzjzLIQ0bMyXmdcJhJkkGNOVZPjK6Bt1Vfl9pF2ZyUEepomrJJJWELaviGDoncAUOqzXjjE/W2CSxDpJrqO/GPGEjSn6HMbGUjh5Ko5XD0YxOJTijlkZlqxbx7LXDcWapXMCTqIiIzI8OY2GRg+35DyIcp90Kk5wtJeXpCBpSMWAJmIaQbPNUkhCJhBEjGLl1QOJJhC2JdVbwLwBcxERNudnGXIWgUsRBVtXymu2DNkVphMOe4JXkhYQ9RjrM+mUgESEO2zTNkKTSQxOeOiosQgScKnPh+5eD8bHktyr5V5FVTnWb91gJgf1bb4gzDSMOQZxXJTbePT2DsTw1NPUH3SBh9k5amRKR4MhQp1XMPuiAodBpoRDmAAkxnwWfHqdEoiMtVnD/Szm1XItDazJ5ZZnLv4X9xBpw+BqWfemvAGZtfJB9adoy0mcU8gzwHMHG1WNDahursF6zrZlNXXIKyymzqsiE9wYFuo4hFh3pdrMKpDtC8q4GXL3HpzZ93/oGbBQU1uPOz68mxvGFAVynzaQ2VvG1IeKxQlKIzUJGsYCVWIq4pMEykORDBZIT1lceMQRCk8jRQ9HiqKWIvLOPwGhZ4Km0ZBEk1Dt5sf4GJXbiLHRjazPouhqo8bLen35xRh8bR+iQ30c8Dxse/QTBKsI/gDb5B6syui0wI2CMBO03C3JHjgR6cvLR+WylZzabdRWlKG5eSXuf2AvQlzgp6RLKKqSVtJBkAgOY3GVAUucwRd6lt5Rx1P0Xpw5egTT02HUN9bRCbkB3FlkuRQZkGCpDhZI8D7BQUhy8DQO0xOj6Dn1OgqDRVi+dS8togQtIoks61cZXhZViVTA+KkD0iIoKCpAcWUVQQ84ILMfWQQBpy9WcgsaHbmi41zQFxcXoYLglZUWcpYnp4ijpOQZBJwCl/6Gu6TfDNdIBEUY3+UXFeLk4VdxYv8+jI8Mo37FCixdvhK1XA7FuJ6MMZMYTCALRHG0J78AAxc6MdnVjq79v4Y/WIzSimqUr1jNrcg4uZhnU8h+AlmgyUOdinLThjNngGLp8fpzAY29tQWc+cxngwjLOpCIGW71xaPUdQX5CAYLCGSSi2d5egmPmQ05vAokWiKoSVZA8rXRWJzcjDYSB7xx8iSOH9iPERqiDV1d2H73fajmWZAE3d0+spq409TLG5ug5OfnI9TTif7W47hweD8ClICm9RtR19gEDzeD4hR32rrw0tq1OdMn6StMRsIc1AT8BYs5pGNxWoHdzu58WH3KNmjlEOKOVpIcUcV1XjV1nHSVdI+H3CZxFs8Z1U/QjA5JmyMGBL4x4kQoy6htVzQuQVFJKaao2yrqatFYV4WiPNaRDNC1b6YBJMShbCNBZZ9H8auvqUaothYgt+WVlKCubglK8wKIUi8mpBsJXEwHeYqKMHOpk+7BMPtkobh2Sbbkzspvt8sAbpfOyTZIxGLkrN62VgR4OmjlLauxdFkTLfBpI06Gn4iK5kaLBMi1I2M9KWXO2EMAxYtmAqOiioXCePAjH8WSmhqECVztkgY0sc7xiSnm8SDBchkdR2Wv8yGJ6BTWrm9BI9tdzpNKAYLX0LzGlPdTx6do50lUYyybHwyi/cIbPEIWMrNnecOybEnO5BdmPtpR7UZuMsnXv9FZkCR12tTIEHpbX8f5E6/hg3s/hBWrVqOktBxTE5OcztO6i2wlsIxYyvgVB4pjjHjyhfnvxEnpRO5PtGzYKKipkwgMz8kFCZq4U5wj4BJ8osoicASTZRL0wviDnCF37KBocsNohmtklo1xMDVB2bRULW++plv0nzuJYEkZz5Q00ZVELs0xkGPbfGWewG/HUxHRct15ODzGs2xtpzDa24MouWp6cgIjPRewYvkKPPDQQ2ZyiEVmyLuOeBAO6hlOAlRquicUZiGRJMuRLiY4z7LoHYa3SDhnSiJteJEdkipwymq9oDvWqW7yf4ADkaA6SFIMBaz2dP28yw8QUM7QLM4BM29QQZ/bKy/8GiO9l7CU7qOaVc2cTbnayCGwF0l97unT9548L8JPF+3t16un7+xJ9J0+zr2XKXaSOoOErGtuxp179nDl0GQ4IsEZVuaB4TABSHA86rvSGImrdOelrEqE9cLSkPFWYBrQ5bbQG2WVXmSksgJewTzz1owyQddkY0SYbixxNytHijcp6kGLM6nfT3GdmsSxwwfJeV5y2zKU1ukciUYs+6DPPIUZJwcGfu/Jv9cFbpj6Qdy2pJ7OvnI6/9iBW9auweZt2ykuFBHOrBp1t0Oy32g5OQCROHVT4GjSECcIQ6P7HMTMvSFFxLswcQQcuGSGKD39pIiXBkbQahClHmRgm3b1jiLuI1AapNePH8Pp1lZUNq0kaA0IllWwPdOQKs0uOFixTQZ9JEux+Or1atBaTrZTXV0dNt12Gz728YcRIXuNj43R4NTJSdUjUBy7zHCI2M+QRkIY5/kD8AYCaduPRrKZfUk680lkhYeDWxowJcwK4mQnOOpAohxgnR5ymUydyEyMuo+LeqKcxyWVZs9RbiT95Ic/pD60sfy27SipqacpQg9KjkFYqagBTl8WDx443c/u1s1XX/Nd99FCH8fBw4fptzprsn3s4U9yRKl1eFnsmOiiqWkQMPdc8OcXBpFHsPIDPi6sRxAJD6G4tASVleVm1EOcTaNc83q5YFdBwwkZgK70RgOioL9qqZimRx45anRsggetI2bwyikJ1aWVmJqeRpDt9VOn/ejffoBLPd3Ycv/HsIQ2npZmuQYOcb+wUnkD3KOk92l+Wcz+fGm+SvNpX62/5wHjShru7sL3vvtdTE5O4tFHHkGysBShqWmz1JFukQhxiHkyvIzLpxAudnbgV//1S7SfPcuN/QgKCwuxYdMm3EIdee+993KpVEzbbZIcIs4RNHOIEZMNeOTM0uJignERv3zmGbSdOcNlGXevKPslZWW4Y9ddePDBj+DF/a+g9dQpHDp0CC137sHqXR90jN5cRVTAECNh5dymR1IHSnjq+7gS5wtJimTvmZM8YdmJN44c5CmgJPbe/xF8+IEHUEPdocV0WEftozHk04oPTY3jmZ/+GB3k0O7OTi7FtOB2dJyM2FISetfuu/H4Hz9BHaYT5RJ5ct4cuCXpLvKy/jzWO3CpG//8nW+ji55agWn0KoGVjiugvdayYQP6+7hlSXswwDPAmx/+fVTQBMn5SGsaEL/fus39ZN379a9/3SRva6gZONIzyPNFWJrOd1XkdNBLVg/yUHI5lzcFGB/lgeg3OhmPYIY2WJgiUlRcaDjCT+X8P8/+Ei8//zx6KSoKPh2jT494nCBNM//w8BCq+M1C46pVzkKenJMRS8Nl4jRnUtHEEuFe6C+e+RkOc3tPa1Gtl414G3VKRxQ5eoSfAcRYKJ+TwKptu8xRVh89IHOFaycJt+1r01n28Od23vpNtw4jqu4D+/VNTnj/7T7PFQdLyqm3ilFI8PKov86+9Dyef3Efznd1omFpI3ZSVNasaTZEvfxr2k7czNEqoYSGpzjC6RAnCq4z9QHIANelz/3qf7Htrt38boHfL9g0aYTUNSKVRzdQkiZH98VuPP/cc5xsKLLUcwrSeaZeFhO3hqlCCghaKSeCxttu554pvcOqcxFB2MwufhVw+vD/qQOnT7Ar857KVAckkprSm3fvRfWqNWh/8VfooQi/ca4Drx85go0bN6KUinp4eJiiQ28J8yd5jqyAToAC6rfpqTAi5AxNKlLybW1tGOzrxXKuPrS6cOw9p5syNwRMsKgYYyMjOHnsGEblPeGSLE67sYAbyX5OPgGuTye5cSQuDFIqUjTG45QCr0BTVRwIMWVuAFonntzZ8qzTI+fvVcCZJH74z5be/AmSRoxTvrsRbHpDInUc/o4//CxWXaTI9l5E9+FD2P/KK4iz46XV1eww9w0oflrwF5YUISCnIesR0XF6UkSITX3X292DWtqICbrJZdC6HCTQ5F+L0QujWbKzo53cqp0s2bp0fHIgAuRG2XHJZBFdUmPUpXTj82OU8MQwN2CGUV5ZS73OmjJcTFqEZubZVOeAKjoVZr8TJtcE1pfOOOvFXMf1jdGayUsAOXymJNMs8rExR3gfT8b5qdEAjxi8hMvHjxgQlE/iWlFRQTEvwMx0BBNjo/SP8QMQEq8+BKirxDnMaUAjk7J+tsNlWIKTksRaXJvgWjmP3CdAZa9pgsnLp3eXK4QQRXSSZ1j0SVKKZco5qNs/81lyf6XhNjMgaTrfpMPYB/0zCxYSp8E1wbJe5Hdd96aLZaI3cxxf8aOIJ2lKXvWBiPGiqhhBugKYONCQZ0ZIIPh5VdBls3rn3Rg8fYwbJTPkNnId842TsCABmJmZMcavmQ1Zpeou4/pRBOu0pAxbFjBiK/j8nEnzqSMlxjPjo7hw9JCZPTV4YbqJInRr+elmUb3aL9Ds7y8oQl5xGb1NJQY0dd3UyQGcDZqaEXMJMFEi4gSgEWznA5EnTdlr/swJnL4kefrgmW+xgr9286sxDwmSV8yMhTrA+xRHRmabxFhNauaz6Fkto/ehvnk9us+coqOThJGb9LWgCFVnVcR4iTlhLN+wBQ0bt9IVz1UFxVacZHJQ5ORN8fDLGA9XCOpDZHwMo53naYyPwBeg45R1qp4EudEV8QjX08s2bkbd6hbOurNIVJ95zQ7uo0lnW1oGijkUmPtbc31Vo3ezatXjlaCfmOC3TB9iXduUSjgMOMJHZGmZ5NEDO32lK1wzmvcWjVz6/7fswMTQECZ0ApIipq1BcZOWSGZdyw4W8fuk1XfsRt3aFvZXu1Dp+rUSYV1eUiZAtDzTQMXpxR3r6kAHuc4mWOJaDab6JD2q01OFnLhWbNyG6pWrTXm+MkHqYr6gNw6oTh5m5Udw+Ma8+efScW7mm/HZZddv9mPojXYjXjJATXsCgnaP1o0bH/wE6ls2zwLfbX3uWGQluMo48oufYqi9lfqPA8I094SlTW7f8ehjqF13W87LK4KW+2eXbrcX+4mSlPnUxAQ6+YFGz9EDiFJH+bkbVb91F/c1l2PV+ls50o5ouG3eKBb40mPd/BqxhxPQ1MggPcgh+Lhrte7uvWhau4HupNz8babtOT5BurZPc86q12bS59bs7D9cm/5efKY4f+Vzu1r+8Ua0LQg4VcIP/b9N+frCjSp8V793fkbjiwuhYcHAsbL3fz5jFqLZKBfb/C4HR2VW+ffGLWnK5jdHRHQ2wCm/zV+E+SKn7et6i5Xx3RJEi2hifzU5LzhkI6pXVarZlnbV9znB8RTfuy/I5KBl+Cc3+pmM+SjLGThV+G7+GTT+PManr/fzGPMB5qZnK6puOROrYf3EBO2wv6cxxrP57/CgH95jX9XnxYAmKhfFcbNheqf/1CMH9kU5L+Zbe86mZSH3Nw04tzFnpfH+j4u6eGQdv/9ztllDdnUB5weU+fU1PySmD2PefdurS+X2RDcQf0AZP6FL7ofublRuNd241E0X1fmafIYeovd/sns+dLJI16eL+gqPI8eP8LL/kXgdT9NJq7frR+L/H37mMJQPecgYAAAAAElFTkSuQmCC';
var wmeJM_countProbe=0;
var wmeJM_countProbe2=0;
var wmeJM_countProbeWM=0;
var wmeJM_countProbeLOC=0;
var wmeJM_debug=false;
var wmeJM_restoreSelected=false;
var wmeJM_around=false;
var wmeJM_hideWindow = false;
var wmeJM_leftOffset = wmeJM_defaultLeftOffset;
var wmeJM_topOffset = wmeJM_defaultTopOffset;
var wmeJM_defaultLeftOffset = '0px';
var wmeJM_defaultTopOffset = '30px';

var wmeJM_Config={};
var wmeJM_Config0 = {
    "_map_WME":    {save:0, title:"Open in WME",						name:"[WME]",	template:'https://www.waze.com/editor/?env=row&zoomLevel={{zoom}}&lat={{lat}}&lon={{lon}}'},
    "_map_LI":     {save:0, title:"Open in LiveMap",					name:"[Live]",	template:'https://www.waze.com/livemap/?zoom={{zoom}}&lon={{lon}}&lat={{lat}}'},
    //-------------------------------------
    "_map_OSM":    {save:1, title:"Open in OpenStreetMap",			    name:"OpenStreetMap",	template:'http://www.openstreetmap.org/#map={{zoom}}/{{lat}}/{{lon}}', icon:'https://i.imgur.com/nILagGi.png'},
    "_map_Google": {save:1, title:"Open in Google Maps",				name:"Google",	template:'http://www.google.com/maps/?ll={{lat}}%2C{{lon}}&z={{zoom}}&t=m', icon:'https://i.imgur.com/4OYmgan.png'},
    "_map_BING":   {save:1, title:"Open in Bing Maps",					name:"Bing",	template:'http://www.bing.com/maps/?v=2&cp={{lat}}~{{lon}}&lvl={{zoom}}&dir=0&sty=h&form=LMLTEW', icon:'https://i.imgur.com/0z4Ksmp.png'}, // sty: "h" - ariel, "r" - map
    "_map_HERE":   {save:1, title:"Open in HERE WeGo",					name:"Here",	template:'https://wego.here.com/?map={{lat}},{{lon}},{{zoom}},normal', icon:'https://wego.here.com/favicon.png'}, // "hybrid.day" - ariel, "normal.day" - map
    //  "_map_APPLE":   {save:1, title:"Open in Apple Maps",				name:"Apple",	template:'https://maps.apple.com/?ll={{lat}},{{lon}}&q=WME%20JumpMaps', icon:'https://i.imgur.com/w0U6EuC.png'},
    "_map_APPLE":   {save:1, title:"Open in Apple Maps",				name:"Apple",	template:'https://beta.maps.apple.com/?ll={{lat}},{{lon}}&spn=0.0038614715299516433%2C0.010368359444299813', icon:'https://imgur.com/fNyoDc9.png'},
    "_map_MRY":    {save:1, title:"Open in Mapillary",				    name:"Mapillary",	template:'https://www.mapillary.com/app/?lat={{lat}}&lng={{lon}}&z={{zoom}}', icon:'https://i.imgur.com/SpfT4kc.png'},
    "_map_WM":     {save:1, title:"Open in Wikimapia",				    name:"Wikimapia",	template:'http://wikimapia.org/#lang=ru&lat={{lat}}&lon={{lon}}&z={{zoom}}&m=b', icon:'https://i.imgur.com/pqP0dEk.png'},
    "_map_SC":     {save:1, title:"Open in MapCam.info",				name:"MapCam",	template:'http://mapcam.info/speedcam/?lng={{lon}}&lat={{lat}}&z={{zoom}}&t=OSM', icon:'https://i.imgur.com/L8Tm2WD.png'},
    "_map_WMFLAB": {save:1, title:"Open in GeoHack",    		        name:"GeoHack",	template:'https://tools.wmflabs.org/geohack/geohack.php?params={{lat}}_N_{{lon}}_E_scale:{{zoom}}'},
    "_map_OSV":    {save:1, title:"Open in KartaView",			        name:"KartaView",	template:'http://openstreetcam.org/map/@{{lat}},{{lon}},{{zoom}}z', icon:'https://i.imgur.com/ENo4OwP.png'},
    "_map_RBASE":  {save:1, title:"Open in RadarBase.info",				name:"RadarBase",	template:'https://radarbase.info/map/actual/{{lat}}/{{lon}}/{{zoom}}', icon:'https://radarbase.info/meta/apple-touch-icon.png'},
    "_map_SPRO":   {save:1, title:"Open in satellites.pro",				name:"SatPRO",	template:'https://satellites.pro/#{{lat}},{{lon}},{{zoom}}', icon:'https://i.imgur.com/M1sVNRv.png'},
    "_map_BM":     {save:1, title:"[LV] Open in Baltic Maps",			name:"BalticMaps",	template:'https://balticmaps.eu/lv/c___{{lon}}-{{lat}}-{{zoom}}/bl___cl', icon:'https://i.imgur.com/oMqclPL.png'},
    "_map_LGIA":   {save:1, title:"[LV] Open in LĢIA",					name:"LĢIA",	template:'https://kartes.lgia.gov.lv/karte/?x={{lat}}&y={{lon}}&zoom={{zoom}}', icon:'https://i.imgur.com/bxA0T5X.png'},
    "_map_KDL":    {save:1, title:"[LV] Open in kadastrs.lv",			name:"KDLV",	template:'https://www.kadastrs.lv/map/di?xy={{lat}},{{lon}}&z={{zoom}}', icon:'https://i.imgur.com/eCddG4q.png'},
    "_map_LVM":    {save:1, title:"[LV] Open in LVM GEO",               name:"LVM",	template:'https://lvmgeo.lvm.lv/?loc={{lat}};{{lon}};{{zoom}}', icon:'https://i.imgur.com/l0PQRW0.png'},
    "_map_CFY":    {save:1, title:"[LV] Open in Citify",                name:"Citify",	template:'https://citify.eu/lv/?lng={{lon}}&lat={{lat}}&z={{zoom}}', icon:'https://i.imgur.com/zIxSAPV.png'},
    "_map_DODLV":  {save:1, title:"[LV] Open in Dodies.lv",	 			name:"Dodies",	template:'https://vesture.dodies.lv/#m={{zoom}}/{{lat}}/{{lon}}&l=J'},
    "_map_MAPLT":  {save:1, title:"[LT] Open in Maps.lt",               name:"Maps.lt", template:'http://www.maps.lt/map/default.aspx?lang=lt#q={{lat}}%2C%20{{lon}}'},
    "_map_REGLT":  {save:1, title:"[LT] Open in Regia",                 name:"Regia", template:'https://www.regia.lt/map/?x={{lat}}&y={{lon}}&scale={{zoom}}'},
    "_map_KADUA":  {save:1, title:"[UA] Open in Kadastr UA",			name:"KADUA",	template:'http://map.land.gov.ua/?cc={{lon}},{{lat}}&z={{zoom}}&l=kadastr'},
    "_map_KLIVE":  {save:1, title:"[UA] Open in kadastr.live",			name:"KLIVE",	template:'https://kadastr.live/#{{zoom}}/{{lat}}/{{lon}}'},
    "_map_MRUA":   {save:1, title:"[UA] Open in atu.minregion.gov.ua",	name:"MRUA",	template:'http://atu.minregion.gov.ua/ua/karta#map={{zoom}}//{{lat}}//{{lon}}&&layer=10615838328233625-v:1%7Cop:1//8906587737484582-v:0%7Cop:1//8894715282779406-v:1%7Cop:1'},
    "_map_VCUA":   {save:1, title:"[UA] Open in maps.visicom.ua",		name:"VCUA",	template:'https://maps.visicom.ua/c/{{lon}},{{lat}},{{zoom}}?lang=uk'},
};


var wmeJM_ArrW2B=[{w:7,b:-2},{w:6,b:-1},{w:5,b:0},{w:4,b:1},{w:3,b:2},{w:2,b:3},{w:1,b:4},{w:0,b:5}];
var wmeJM_ArrW2KDL=[{w:0,r:75000},{w:1,r:50000},{w:2,r:15000},{w:3,r:10000},{w:4,r:5000},{w:5,r:3000},{w:6,r:1000},{w:7,r:750},{w:8,r:500},{w:9,r:200}];

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
    return 'WME-JumpMaps-' + wmeJM_version.replace(/\./g,"-");
}

function WmeJM_Config2String()
{
    // Exclude private
    var jsn={};
    for(var i in wmeJM_Config)
    {
        if(wmeJM_Config[i].save === 1)
        {
            jsn[i]=wmeJM_Config[i];
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

// On what site are we now?
function WmeJM_GetLocationType()
{
    if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_GetLocationType(), location.hostname=" + location.hostname + ", location.href=" + location.href);

    if (location.hostname === "www.waze.com" || location.hostname === "editor-beta.waze.com" || location.hostname === "beta.waze.com")
        return "waze";
    if (location.hostname === "apple.com")
        return "apple";
    if (location.hostname === "maps.google.com" || location.hostname.startsWith("www.google."))
        return "google";
    if (location.hostname === "mapcam.info")
        return "sc";
    if (location.hostname === "wikimapia.org")
        return "wm";
    if (location.hostname === "balticmaps.eu")
        return "balticmaps";
    if (location.hostname === "kartes.lgia.gov.lv")
        return "lgia";
    if (location.hostname === "www.kadastrs.lv")
        return "kdlv";
    if (location.hostname === "www.openstreetmap.org")
        return "osm";
    if (location.hostname === "www.mapillary.com")
        return "mry";
    if (location.hostname === "tools.wmflabs.org")
        return "wmflab";
    if (location.hostname === "openstreetcam.org")
        return "osv";
    if (location.hostname === "maps.visicom.ua")
        return "vcua";
    if (location.hostname === "atu.minregion.gov.ua")
        return "mrua";
    if (location.hostname === "map.land.gov.ua")
        return "kadua";
    if (location.hostname === "www.maps.lt" && location.pathname.indexOf("/map") >= 0)
        return "maplt";
    if (location.hostname === "www.regia.lt" && location.pathname.indexOf("/map") >= 0)
        return "reglt";
    if (location.hostname === "kadastr.live")
        return "klive";
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

// Only getting coordinates and zoom as it is (transformation then)
function WmeJM_GetLLZ()
{
    var lat=0;
    var lon=0;
    var zoom=0;
    var city='';
    var href=location.href;
    var locType=WmeJM_GetLocationType();
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
        case "sc":
            {
                lat = __getQueryString(href, 'lat');
                lon = __getQueryString(href, 'lng');
                zoom = parseInt(__getQueryString(href, 'z'));
                break;
            }
        case "wm":
            {
                lat = __getQueryString(href, 'lat');
                lon = __getQueryString(href, 'lon');
                zoom = parseInt(__getQueryString(href, 'z'));
                break;
            }
        case "balticmaps":
            {
                var res = Array.from(href.matchAll(/http(s){0,1}\:\/\/balticmaps\.eu\/\S+\/c___(\d+(\.\d+){0,1})-(\d+(\.\d+){0,1})-(\d+)\/.*/g));
                lon=res[0][4];
                lat=res[0][2];
                zoom=res[0][6];
                break;
            }
        case "lgia":
            {
                var resp = Array.from(href.matchAll(/https:\/\/kartes\.lgia\.gov\.lv\/karte\/\?x=([0-9]*\.[0-9]+)&y=([0-9]*\.[0-9]+)&zoom=([0-9]+)/g));
                lat=resp[0][1];
                lon=resp[0][2];
                zoom=resp[0][3];
                break;
            }
        case "kdlv":
            {
                var frmap=null;
                for(var ii=0; ii < frames.length; ++ii)
                    if(!(typeof (frames[ii].esri) === "undefined"))
                    {
                        frmap=frames[ii];
                        break;
                    }
                if(frmap)
                {
                    // BUGBUG!!!
                    frmap.document.getElementById("dijit_form_Button_15").click();
                    var urlKdl=frmap.document.getElementById("dijit_Dialog_0").getElementsByTagName("textarea")[0].value;
                    frmap.document.getElementsByClassName("dijitDialogCloseIcon")[0].click();
                    // https://www.kadastrs.lv/map/di?xy=507833.2477552314,311378.4889039769&z=5000

                    let ll = __getQueryString(urlKdl, 'xy').split(',');
                    lon=ll[0]; //???
                    lat=ll[1]; //???
                    zoom=parseInt(__getQueryString(urlKdl, 'z'));
                    //if(wmejm_debug) console.log("z="+z)
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
        case 'kadua':
            {
                let ll = __getQueryString(href, 'cc').split(',');
                lon=ll[1];
                lat=ll[0];
                zoom=parseInt(__getQueryString(href, 'z'));
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

    if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_GetLLZ(): locType="+locType+": return {lat="+lat+",lon="+lon+",zoom="+zoom+"}");

    return {lat:lat,lon:lon,zoom:zoom,city:city};
}

// Transformation from external to Waze coordinate system...
function WmeJM_Convert_Other2WME(llz)
{
    if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_Convert_Other2WME("+JSON.stringify(llz)+")");

    var locType=WmeJM_GetLocationType();
    /*if (locType != "waze" && locType != "re" && locType != '2gis')
		llz.zoom = llz.zoom - 12;*/

    switch(locType)
    {
        case "waze":
            {
                break;
            }
        case "apple":
            {
                break;
            }
        case "google":
            {
                break;
            }
        case "sc":
            {
                break;
            }
        case "wm":
            {
                break;
            }
        case "balticmaps":
            {
                break;
            }
        case "lgia":
            {
                var lgia = proj4(proj4("+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9996 +x_0=500000 +y_0=-6000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"),proj4('EPSG:4326'),[parseFloat(llz.lon), parseFloat(llz.lat)]);
                llz.lon=lgia[0];
                llz.lat=lgia[1];
                llz.zoom = parseInt(llz.zoom, 10) + 7;
                break;
            }
        case "kdlv":
            {
                var kdl = proj4(proj4("+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9996 +x_0=500000 +y_0=-6000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"),proj4('EPSG:4326'),[parseFloat(llz.lon), parseFloat(llz.lat)]);
                llz.lon=kdl[0];
                llz.lat=kdl[1];
                llz.zoom = 17

                break;
            }
        case "lvm":
            {
                break;
            }
        case "Dodies":
            {
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
                var cua = proj4(proj4('EPSG:900913'),proj4('EPSG:4326'),[parseFloat(llz.lat), parseFloat(llz.lon)]);
                llz.lon=cua[0];
                llz.lat=cua[1];
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

                for(let i=0; i < wmeJM_ArrW2KDL.length-1; ++i)
                {
                    //if(wmejm_debug) console.log(i+") z="+z+", ["+wmeJM_ArrW2KDL[i].r+", "+wmeJM_ArrW2KDL[i+1].r+"] = " + (z >= wmeJM_ArrW2KDL[i+1].r && z <= wmeJM_ArrW2KDL[i].r))
                    if(llz.zoom >= wmeJM_ArrW2KDL[i+1].r && llz.zoom <= wmeJM_ArrW2KDL[i].r)
                    {
                        llz.zoom=wmeJM_ArrW2KDL[i].w;
                        break;
                    }
                }
                //zoom = zoom - 12; if (zoom < 0) zoom=0; //???
                break;
                break;
            }
    }

    if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_Convert_Other2WME(): return {lat="+llz.lat+",lon="+llz.lon+",zoom="+llz.zoom+"}");
    return llz;
}

// Transformation from Waze to external coordinate system...
function WmeJM_Convert_WME2Other(id,llz)
{
    if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_Convert_WME2Other('"+id+"',"+JSON.stringify(llz)+")");

    if (this.id == '_map_WME' || this.id == '_map_WMEB')
        ;//		llz.zoom = llz.zoom - 12;

    // W.Config.livemap.zoom_offset = 12
    // W.Config.livemap.max_zoom = 17
    var origzoom=llz.zoom;
    llz.zoom = this.id=='_map_LI' ? llz.zoom - 1: llz.zoom;// : (llz.zoom > 6 ? 19 : llz.zoom + 12);
    if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_Convert_WME2Other: llz"+JSON.stringify(llz)+")");

    switch(id)
    {
        case "_map_Apple":
            {
                break;
            }
        case "_map_Google":
            {
                if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_Convert_WME2Other(): location.href.indexOf('mapmaker')="+location.href.indexOf("mapmaker"));
                if(location.href.indexOf("mapmaker") > 0)
                    llz.zoom=llz.zoom+1;
                break;
            }
        case "_map_SC":
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
        case "_map_AM":
            {
                break;
            }
        case "_map_DODLV":
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
        case "_map_LGIA":
            {
                // EPSG:4326 -> EPSG:3059 (LKS92)
                var lgia = proj4(proj4("+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees"),proj4("+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9996 +x_0=500000 +y_0=-6000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"),[parseFloat(llz.lon), parseFloat(llz.lat)]);
                llz.lon=lgia[0];
                llz.lat=lgia[1];
                llz.zoom=9;
                break;
            }
        case "_map_KDL":
            {
                // EPSG:4326 -> EPSG:3059 (LKS92)
                var kdl = proj4(proj4("EPSG:4326"),proj4("+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9996 +x_0=500000 +y_0=-6000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"),[parseFloat(llz.lon), parseFloat(llz.lat)]);
                llz.lon=kdl[1];
                llz.lat=kdl[0];

                let zoom = llz.zoom-12;
                if (zoom > 7) zoom=7;

                for(let i=0; i < wmeJM_ArrW2KDL.length; ++i)
                {
                    if(zoom == wmeJM_ArrW2KDL[i].w)
                    {
                        zoom=wmeJM_ArrW2KDL[i].r;
                        break;
                    }
                }
                llz.zoom= zoom;
                break;
            }
        case "_map_LVM":
            {
                // EPSG:4326 -> EPSG:3059 (LKS92)
                var lvm = proj4(proj4("+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees"),proj4("+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9996 +x_0=500000 +y_0=-6000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"),[parseFloat(llz.lon), parseFloat(llz.lat)]);
                llz.lat=lvm[0];
                llz.lon=lvm[1];
                llz.zoom=14;
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
                urPos.transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"));
                llz.lat=urPos.lat;
                llz.lon=urPos.lon;
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

                for(let i=0; i < wmeJM_ArrW2KDL.length; ++i)
                {
                    if(zoom == wmeJM_ArrW2KDL[i].w)
                    {
                        zoom=wmeJM_ArrW2KDL[i].r;
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
    }
    if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_Convert_WME2Other(): return "+JSON.stringify(llz));
    return llz;
}


// Additional forced processing after jumping to external site...
function WmeJM_PostLoadOtherMaps()
{
    if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_PostLoadOtherMaps()");
    var waiting=false;
    var locType=WmeJM_GetLocationType();
    var llz=WmeJM_GetLLZ();
    if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_PostLoadOtherMaps(): locType="+locType+": {lat="+llz.lat+",lon="+llz.lon+",zoom="+llz.zoom+"}");

    switch(locType)
    {
        case "waze":
            {
                break;
            }
        case "apple":
            {
                break;
            }
        case "google":
            {
                break;
            }
        case "sc":
            {
                break;
            }
        case "wm":
            {
                break;
            }
        case "balticmaps":
            {
                break;
            }
        case "lgia":
            {
                break;
            }
        case "dodies":
            {
                break;
            }
        case "kdlv":
            {
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
                /*var re = new RegExp("\\bmap=(.*?)//(.*?)//(.*?)$");
    	    var m = re.exec(document.location.hash);
    	    if (m.length==4)
    	    {
				Proj4js.defs["EPSG:4284"] = '+proj=longlat+ellps=kras+towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12+no_defs';
				//Proj4js.defs["EPSG:4326"] = '+proj=longlat+ellps=WGS84+datum=WGS84+no_defs+towgs84=0,0,0';
				Proj4js.defs["EPSG:900913"] = '+proj=merc+a=6378137+b=6378137+lat_ts=0.0+lon_0=0.0+x_0=0.0+y_0=0+k=1.0+units=m+nadgrids=@null+wktext+over+no_defs';

				var point1 = new Proj4js.Point(m[2],m[3]);
				//if(wmeJM_debug) console.log("RepositionKadastrUA:",m, point1);
				Proj4js.transform(new Proj4js.Proj("EPSG:4284"), new Proj4js.Proj("EPSG:900913"), point1);

				var new_response =  point1.x+ "," + point1.y + "," + point1.x + "," + point1.y;
				var new_bounds_res = new OpenLayers.Bounds.fromString(new_response);
				map.zoomToExtent(new_bounds_res);
				var x = new_bounds_res.centerLonLat.lat;
				var y = new_bounds_res.centerLonLat.lon;
				map.setCenter(new OpenLayers.LonLat(y,x),m[1]);
				map.setBaseLayer(tmsoverlay_orto);
			}*/
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
        setTimeout(WmeJM_PostLoadOtherMaps,2000);
    }
}



// Mouse click handler - jumping mechanism
function WmeJM_clickJumpToMaps()
{
    if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_clickJumpToMaps("+this.id+")");

    var savedSelectedItems=[];
    if (wmeJM_restoreSelected && !(this.id === '_map_WME' || this.id.indexOf("_map_WME_") >= 0 || this.id === '_map_WMEB'))
    {
        if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_clickJumpToMaps("+this.id+"): save selected");
        for( var i=0; i < W.selectionManager.getSelectedFeatures().length; ++i)
            savedSelectedItems.push(W.selectionManager.getSelectedFeatures()[i].model);
    }

    var llz=WmeJM_GetLLZ();
    //if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_clickJumpToMaps("+this.id+"): llz={lat:"+llz.lat+",lon:"+llz.lon+",zoom:"+llz.zoom+"}");
    if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_clickJumpToMaps("+this.id+"): llz="+JSON.stringify(llz));

    if (this.id == '_map_WME' || this.id == '_map_WMEB' || this.id.indexOf("_map_WME_") >= 0)
        llz=WmeJM_Convert_Other2WME(llz);
    else
        llz=WmeJM_Convert_WME2Other(this.id,llz);

    if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_clickJumpToMaps("+this.id+"): wmeJM_Config["+this.id+"]="+JSON.stringify(wmeJM_Config[this.id]));

    var template=(typeof wmeJM_Config[this.id] !== "undefined")?wmeJM_Config[this.id].template:"";
    if (this.id.indexOf("_map_WME_") >= 0)
        template=wmeJM_Config["_map_WME"].template;
    var url=template.replace("{{city}}",llz.city).replace("{{lon}}",llz.lon).replace("{{lat}}",llz.lat).replace("{{zoom}}",llz.zoom) + ((this.id == '_map_WME' || this.id.indexOf("_map_WME_") >= 0 || this.id == '_map_WMEB')?"&marker=yes":"");

    if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_clickJumpToMaps("+this.id+"): " + url + ', _url'+this.id);

    if(wmeJM_restoreSelected && !(this.id == '_map_WME' || this.id.indexOf("_map_WME_") >= 0 || this.id == '_map_WMEB')) // restore selections
    {
        if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_clickJumpToMaps("+this.id+"): restore selected");
        setTimeout(function() {if (savedSelectedItems.length > 0){W.selectionManager.select(savedSelectedItems);savedSelectedItems.length=0;}},50);
    }

    if (this.id.indexOf("_map_WME_") >= 0) // If it's something like that, jmlink - we kilay from the url of lats/longs/zooms...
    {
        if (this.getAttribute("jmfrom") === "mapbys") // If it's something like that, jmlink - we kilay from the url of lats/longs/zooms...
        {
            window.open("http://map.nca.by/map.html?xy="+this.getAttribute("jmlink")+"&z=16",'_url_jm'+this.id);
        }
        url=url.split("&")[0]+"&jmlink="+this.getAttribute("jmlink");
    }

    window.open(url,'_url'+this.id);
}


// Add JumpMaps floating menu to WazeMapEditor
function WmeJM_InsertWMEIcon()
{
    if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InsertWMEIcon(): "+(document.getElementById('WME.JumpMaps_' + wmeJM_version)?"found":"none"));
    var nod=document.getElementById('WME.JumpMaps_' + wmeJM_version);
    if(nod)
    {
        // clear exist
        nod.innerHTML="";
    }
    else
    {
        // Create new template
        nod=document.createElement("div");
        nod.setAttribute('id', 'WME.JumpMaps_' + wmeJM_version);
        nod.setAttribute('unselectable', 'on');
        var leftPos = wmeJM_leftOffset;
        var topPos = wmeJM_topOffset;
        nod.setAttribute('style', ' font-size: 12px; color: #fff; padding-left: 20px; position:absolute; top:' + topPos + '; left:' + leftPos + '; display:block; background-color:rgba(0,0,0,.7); visibility:' + (wmeJM_hideWindow ? "hidden":"visible") + ';cursor:pointer;');
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

    var WMEJumpMapsLink=null;

    if ("undefined" === typeof localStorage.WMEJumpMapsLink || !IsJsonString(localStorage.getItem('WMEJumpMapsLink')))
    {
        localStorage.setItem('WMEJumpMapsLink', WmeJM_Config2String());
        WMEJumpMapsLink=localStorage.getItem("WMEJumpMapsLink");

        //if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): use WMEJumpMapsLink0!!! ");
    }
    else
    {
        WMEJumpMapsLink=localStorage.getItem("WMEJumpMapsLink");
        //if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): use custom WMEJumpMapsLink="+WMEJumpMapsLink);
    }

    var innerHTML="";
    if (WMEJumpMapsLink)
    {
        var aLinks = JSON.parse(WMEJumpMapsLink);
        // clear save
        for(var i in wmeJM_Config)
            wmeJM_Config[i].save = 0;

        // set save & create labels
        for (let i in aLinks)
        {
            if (["_map_WME","_map_WMEB","_map_LI"].indexOf(i) < 0)
            {
                //if(wmeJM_debug) console.log("process "+i +"  typeof wmeJM_Config[i]="+(typeof wmeJM_Config[i])+ " " + JSON.stringify(wmeJM_Config[i]));
                if (typeof wmeJM_Config[i] !== "undefined")
                {
                    wmeJM_Config[i].save	 = 1;
                    wmeJM_Config[i].title	= aLinks[i].title;
                    wmeJM_Config[i].name	 = aLinks[i].name;
                    wmeJM_Config[i].template = aLinks[i].template;
                    wmeJM_Config[i].icon = aLinks[i].icon;

                    // Create icon HTML if icon exists
                    let iconHTML = wmeJM_Config[i].icon ? `<img src="${wmeJM_Config[i].icon}" style="width: 12px; height: 12px; vertical-align: middle; margin-right: 4px;">` : '';

                    // Append icon and name to innerHTML
                    innerHTML += `<a id="${i}" style="color: #fff; font-size: 11px" title="${aLinks[i].title}">${iconHTML}${aLinks[i].name}</a>&nbsp;<span style="opacity:0.4;">|</span>&nbsp;`;

                    //console.log("aLinks[i]:", aLinks[i]);  // Confirm each entry has an `icon` field

                }
            }
        }
    }

    var main_site=location.hostname === "www.waze.com";
    //nod.innerHTML = '<div>JumpMaps ' + wmeJM_version + '</div>'
    nod.innerHTML =
        (innerHTML || "")
        + "<a id='_map_LI' style='color: #fff; font-size: 10px' title='Open in LiveMap'>[Live]</a>&nbsp;"
        + "<a id='_map_AB' tp="+(main_site?'A':'B')+" href='' style='color: #fff; font-size: 10px' title='Open in "+(main_site?"Beta":"Main")+" editor' target='" +CreateID()+ (main_site?"b":"a")+"' id='__map_BETAALPA'>["+ (main_site?"&#946;":"&#945;")+"]</a>&nbsp;"
        + "<a href='https://greasyfork.org/en/scripts/481079-wme-jumpmaps' title='WME-JumpMaps_" + wmeJM_version + "' style='color: #fff; font-size: 10px' target='_blank'>[?]</a>&nbsp;";

    document.getElementById('waze-map-container').parentElement.appendChild(nod);
    // document.getElementById("chat-overlay").parentElement.insertBefore(nod, document.getElementById("chat-overlay"));

    //Comment for no drag
    //    var drag     = new Object();
    //    drag.obj = nod; //document.getElementById('WME.JumpMaps_' + wmeJM_version);
    //
    //    drag.obj.addEventListener('mousedown', function(e)
    //                              {
    //        drag.top  = parseInt(drag.obj.offsetTop);
    //        drag.left = parseInt(drag.obj.offsetLeft);
    //        drag.oldx = drag.x;
    //        drag.oldy = drag.y;
    //        drag.drag = true;
    //    });
    //
    //    window.addEventListener('mouseup', function()
    //                            {
    //        drag.drag = false;
    //        localStorage.setItem("WMEJumpMapsTopOffset", drag.obj.style.top);
    //        localStorage.setItem("WMEJumpMapsLeftOffset", drag.obj.style.left);
    //    });
    //
    //    window.addEventListener('mousemove', function(e)
    //                            {
    //        drag.x    = e.clientX;
    //        drag.y    = e.clientY;
    //        var diffw = drag.x - drag.oldx;
    //        var diffh = drag.y - drag.oldy;
    //
    //        if (drag.drag)
    //        {
    //            drag.obj.style.left = drag.left + diffw + 'px';
    //            drag.obj.style.top  = drag.top  + diffh + 'px';
    //            e.preventDefault();
    //        }
    //    });


    if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InsertWMEIcon(): innerHTML="+document.getElementById('WME.JumpMaps_' + wmeJM_version).innerHTML);

    {
        //if(wmeJM_debug) console.log("call JSON.parse");
        let aLinks = JSON.parse(WMEJumpMapsLink);
        //if(wmeJM_debug) console.log("call JSON.parse - done");
        for (let i in aLinks)
        {
            if (document.getElementById(i))
                document.getElementById(i).onclick	= WmeJM_clickJumpToMaps;
        }
        document.getElementById('_map_LI').onclick	= WmeJM_clickJumpToMaps;
        document.getElementById('_map_AB').onclick	= function(){
            var permalink="?"+wmer_generate_permalink().split("?")[1];
            if(wmeJM_debug) console.log("_map_AB.click(), permalink=",permalink);
            if(wmeJM_debug) console.log(this.getAttribute('tp'));
            var main_site=this.getAttribute('tp')==='A';
            this.href=(main_site?"https://beta.waze.com/editor":"https://www.waze.com/editor") + permalink;
            if(wmeJM_debug) console.log(this.href);
            //this.click();
            //return false;
        };
    }

    //WmeJM_UpdateJumpStyle();
}

// Insert button for for jumping to Waze
function WmeJM_InsertIcon()
{
    if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InsertIcon()");
    var locType=WmeJM_GetLocationType();
    if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InsertIcon(): locType="+locType);

    if(locType == "waze")
        return true;

    var result = false;

    var nod=document.createElement(locType === "mry" || locType === "osm" || locType === "google"?"div":(locType === "NM"|| locType === "kadua"?"button":"span"));
    nod.setAttribute('id', 'WME.JumpMaps_' + wmeJM_version);
    window.nod=nod;

    var clsid=
        {
            "google"  : {t:1,c:"mylocation"},
            "sc"	  : {t:1,c:"map_right_menu"},
            "wm"	  : {t:1,c:"wm-Add"},
            "balticmaps"	  : {t:1,c:"map_mb"},
            "lgia"	  : {t:1,c:"top-menu"},
            "kdlv"	  : {t:1,c:"social_networks"},
            "kadua"   : {t:1,c:"interfaceGuide"},
            "osm"	  : {t:0,c:"control-layers leaflet-control"},
            "mry"     : {t:0,c:"comments"} //
        };

    if(typeof clsid[locType] === 'undefined')
    {
        WmeJM_PostLoadOtherMaps();
        return true;
    }

    var WazeControlAttribution = null;
    if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InsertIcon(): clsid[locType]="+JSON.stringify(clsid[locType]));
    if(clsid[locType])
        WazeControlAttribution = clsid[locType].t == 1?document.getElementById(clsid[locType].c):(clsid[locType].t == 0 || clsid[locType].t == 2?document.getElementsByClassName(clsid[locType].c):document.getElementsByTagName(clsid[locType].c));
    if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InsertIcon(): WazeControlAttribution="+(typeof WazeControlAttribution),WazeControlAttribution);

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
                if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InsertIcon(): wait 1 ",locType,clsid[locType]);
                setTimeout(function() {WmeJM_InsertIcon();},500,this);
                return false;
            }
        }
        else
        {
            if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InsertIcon(): found00=true;");
            found00=true;
        }

        if (!found00)
        {
            if(document.readyState != 'complete' && ++wmeJM_countProbe2 < 5)
            {
                if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InsertIcon(): wait 2 ",locType,clsid[locType]);
                setTimeout(function() {WmeJM_InsertIcon();},500,this);
                return false;
            }
        }
    }
    else
    {
        if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InsertIcon(): wait 3 ",clsid[locType]);
        setTimeout(function() {WmeJM_InsertIcon();},100,this);
        return false;
    }

    if (found00)
    {
        if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InsertIcon(): found '", (clsid[locType].t?WazeControlAttribution:WazeControlAttribution[0]));
        if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InsertIcon(): document.readyState=" + document.readyState);

        switch(locType)
        {
            case "google":
                {
                    nod.setAttribute('class', 'app-vertical-item');
                    nod.innerHTML = "<div id='_map_WME' style='cursor: pointer;' title='Open to WME'><img width=29 height=29 src='"+wmeJM_IconWME+"'></div>";
                    WazeControlAttribution.parentElement.insertBefore(nod, WazeControlAttribution);
                    break;
                }
            case "sc":
                {
                    WazeControlAttribution.innerHTML=WazeControlAttribution.innerHTML+'<div id="_map_WME" class="btn-mc">Waze</div>';
                    break;
                }
            case "wm":
                {
                    WazeControlAttribution.innerHTML=WazeControlAttribution.innerHTML+'<div class="butt" id="_map_WME" title="Open in WME"><img style="cursor: pointer; padding-top: 0px;" width=39 height=39  src="'+wmeJM_IconWME+'"></div>';
                    break;
                }
            case "balticmaps":
                {
                    nod.setAttribute('style', 'margin-top:11px; margin-right:5px; position:absolute; top:0px; left:558px; z-index:1; border-radius:20px; box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 3px 3px -2px rgba(0, 0, 0, 0.12);');
                    nod.innerHTML = "<div id='_map_WME' style='cursor: pointer;' title='Open to WME'><img width=40 height=40 src='"+wmeJM_IconWME+"'></div>";
                    WazeControlAttribution.parentElement.insertBefore(nod, WazeControlAttribution.nextSibling);
                    break;
                }
            case "lgia":
                {
                    WazeControlAttribution.children[1].insertAdjacentHTML('afterbegin', '<a id="_map_WME" class="blue icon item waze" title="Open in WME"></a>');
                    document.styleSheets[0].insertRule("a.waze { background:url("+wmeJM_IconWME+" ) no-repeat !important; background-size: contain !important; right:10px;}", 0);
                    break;
                }
            case "kdlv":
                {
                    WazeControlAttribution.insertAdjacentHTML('afterbegin', '<a id="_map_WME" class="waze" target="_blank" title="Open in WME"></a>');
                    document.styleSheets[0].insertRule("#social_networks a.waze { background:url("+wmeJM_IconWME+" );background-size: 100% 100%; right: 356px}", 0);
                    break;
                }
            case "osm":
                {
                    nod.setAttribute('class', "leaflet-control");
                    nod.innerHTML = "<a id='_map_WME' title='Open to WME'><img style='cursor: pointer; padding-top: 0px;' width=39 height=39  src='"+wmeJM_IconWME+"'></a>";
                    WazeControlAttribution[0].parentElement.insertBefore(nod, WazeControlAttribution[0]);
                    break;
                }
            case "kadua":
                {
                    nod.innerHTML = "<a id='_map_WME' class='icon' title='Open to WME'><img style='cursor: pointer; padding-top: 0px;' width=20 height=20  src='"+wmeJM_IconWME+"'></a>";
                    WazeControlAttribution.parentElement.insertBefore(nod, WazeControlAttribution.nextSibling);
                    break;
                }
            case "mry":
                {
                    WazeControlAttribution[0].parentElement.parentElement.innerHTML=
                        '<div _ngcontent-yrv-39="" id="WME.JumpMaps_' + wmeJM_version + '" class="IconContainer bg-icon m1 mt2 relative cursor-pointer pointer-events-auto" dropup-control="" for="">' +
                        '<a id="_map_WME" title="Open to WME"><img style="cursor: pointer; padding-left: 4px;" width=28 height=28  src="'+wmeJM_IconWME+'"></a></div>' +
                        WazeControlAttribution[0].parentElement.parentElement.innerHTML;
                    break;
                }
        }

        if (document.getElementById('_map_WME'))
        {
            document.getElementById('_map_WME').onclick	 = WmeJM_clickJumpToMaps;
            result=true;
        }
        if (document.getElementById('_map_WMEB'))
        {
            document.getElementById('_map_WMEB').onclick	 = WmeJM_clickJumpToMaps;
            result=true;
        }
    }
    else
    {
        if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InsertIcon(): ELSE typeof WazeControlAttribution="+(typeof WazeControlAttribution)+", clsid[locType].t="+clsid[locType].t +", WazeControlAttribution.length="+WazeControlAttribution.length+" ["+(WazeControlAttribution && (clsid[locType].t || WazeControlAttribution.length >= 1))+"]");
    }

    if (result)
        WmeJM_PostLoadOtherMaps();

    return result;
}

function WmeJM_onWazeTabReady()
{

    document.getElementById("wmejm_cfg_resetConfig").onclick = function(){
        setTimeout(function() {
            if(confirm("Reset config for WME-JumpMaps?"))
            {
                let d=document.getElementById(CreateID());
                d.parentNode.removeChild(d);
                d=document.getElementById("pwmejumpmaps");
                d.parentNode.removeChild(d);

                localStorage.removeItem("WMEJumpMapsLink");
                for(var i in wmeJM_Config)	{ delete wmeJM_Config[i]; }
                wmeJM_Config = cloneConfig(wmeJM_Config0);

                localStorage.removeItem("WMEJumpMapsDebug");
                wmeJM_debug=false;

                WmeJM_InsertWMEIcon();
                WmeJM_InitConfig();
            }
        },100,this);
        return false;
    };

    document.getElementById("wmejm_cfg_debug").onclick = function(){wmeJM_debug=this.checked;localStorage.setItem("WMEJumpMapsDebug",wmeJM_debug?"1":"0");};
    document.getElementById("wmejm_cfg_debug").checked = wmeJM_debug;

    document.getElementById("wmejm_cfg_savedsel").onclick = function(){
        wmeJM_restoreSelected=this.checked;
        localStorage.setItem("WMEJumpMapsRestoreSelected",wmeJM_restoreSelected?"1":"0");
    };
    document.getElementById("wmejm_cfg_savedsel").checked = wmeJM_restoreSelected;

    document.getElementById("wmejm_cfg_window_hide").onclick = function(){
        wmeJM_hideWindow=this.checked;
        localStorage.setItem("WMEJumpMapsHideWindow",wmeJM_hideWindow?"1":"0");
        document.getElementById('WME.JumpMaps_' + wmeJM_version).style.visibility = wmeJM_hideWindow ? "hidden":"visible";
    };
    document.getElementById("wmejm_cfg_window_hide").checked = wmeJM_hideWindow;

    document.getElementById("wmejm_cfg_resetWPos").onclick = function(){
        localStorage.setItem("WMEJumpMapsTopOffset", wmeJM_defaultTopOffset);
        localStorage.setItem("WMEJumpMapsLeftOffset", wmeJM_defaultLeftOffset);

        document.getElementById('WME.JumpMaps_' + wmeJM_version).style.left = wmeJM_defaultLeftOffset;
        document.getElementById('WME.JumpMaps_' + wmeJM_version).style.top = wmeJM_defaultTopOffset;

        wmeJM_topOffset = wmeJM_defaultTopOffset;
        wmeJM_leftOffset = wmeJM_defaultLeftOffset;
    };

    var __wmejm_cfg_editlab__=document.getElementsByClassName("__wmejm_cfg_editlab__");
    for(let i=0; i < __wmejm_cfg_editlab__.length; ++i)
    {
        __wmejm_cfg_editlab__[i].onclick= function(){
            var id=this.getAttribute('data');
            var dstyle=document.getElementById("wmejm_inp_"+id+"_all").style.display;
            document.getElementById("wmejm_inp_"+id+"_all").style.display=(dstyle=="block")?"none":"block";
            //document.getElementById("wmejm_inp_"+id+"_all").style.display="block";
            //wmejm_cfg_'+id+'_val
        };
    }

    var aLinks = JSON.parse(localStorage.getItem('WMEJumpMapsLink'));
    for(let i in wmeJM_Config)
    {
        if (["_map_WME","_map_WMEB","_map_LI"].indexOf(i) >= 0)
            continue;

        document.getElementById("wmejm_cfg_"+i).checked = typeof aLinks[i] != "undefined"?true:false;
        var name=wmeJM_Config[i].name;
        if (name.length > 0)
        {
            document.getElementById("wmejm_cfg_"+i+"_val").value = name;
        }
        let title=wmeJM_Config[i].title;
        if (title.length > 0)
        {
            document.getElementById("wmejm_cfg_"+i+"_tit").value = title;
            document.getElementById("wmejm_cfg_"+i+"_chklab").innerHTML="&nbsp;"+title;
        }
        let template=wmeJM_Config[i].template;
        if (template.length > 0)
        {
            document.getElementById("wmejm_cfg_"+i+"_templ").value = template;
        }
        let icon=wmeJM_Config[i].icon;

        // Visibility handler
        document.getElementById("wmejm_cfg_"+i).onchange = function(){
            var id=this.getAttribute('data');
            //document.getElementById("wmejm_inp_"+id+"_all").style.display=this.checked?"block":"none";
            localStorage.setItem('WMEJumpMapsLink', WmeJM_Config2String());
            WmeJM_InsertWMEIcon();
        };

        // Name handler
        document.getElementById("wmejm_cfg_"+i+"_val").onchange = function(){
            var id=this.getAttribute('data');
            wmeJM_Config[id].name=this.value;
            localStorage.setItem('WMEJumpMapsLink', WmeJM_Config2String());
            WmeJM_InsertWMEIcon();
        };

        // Header handler
        document.getElementById("wmejm_cfg_"+i+"_tit").onchange = function(){
            var id=this.getAttribute('data');
            wmeJM_Config[id].title=this.value;
            document.getElementById("wmejm_cfg_"+id+"_chklab").innerHTML="&nbsp;"+this.value;
            localStorage.setItem('WMEJumpMapsLink', WmeJM_Config2String());
            WmeJM_InsertWMEIcon();
        };

        // Template handler
        document.getElementById("wmejm_cfg_"+i+"_templ").onchange = function(){
            var id=this.getAttribute('data');
            wmeJM_Config[id].template=this.value;
            localStorage.setItem('WMEJumpMapsLink', WmeJM_Config2String());
            WmeJM_InsertWMEIcon();
        };

        // Visibility handler on jumping bar
        document.getElementById("wmejm_cfg_"+i).onclick = function(){
            var id=this.getAttribute('data');
            wmeJM_Config[id].save=this.checked?1:0;
            localStorage.setItem('WMEJumpMapsLink', WmeJM_Config2String());
            WmeJM_InsertWMEIcon();
        };
    }
    //WmeJM_InsertWMEIcon()

}

function WmeJM_InitConfig()
{
    if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InitConfig(): "+document.getElementById(CreateID()));
    if(!document.getElementById(CreateID()))
    {
        var srsCtrl = document.createElement('section');
        srsCtrl.id = CreateID();


        var padding="padding:5px 9px";

        // -------------------------------
        var strFormCode = ''
        +'<div class="side-panel-section">'
        +'<h4>WME JumpMaps <sup>' + wmeJM_version + '</sup>&nbsp;<sub><a href="https://greasyfork.org/en/scripts/481079-wme-jumpmaps" target="_blank"><span class="fa fa-external-link"></span></a></sub></h4>'
        +'<form class="attributes-form side-panel-section" action="javascript:return false;">'

        +'<div class="form-group">'
        +'<label class="control-label">Map services:</label>'
        +'<div class="controls">';
        for(var i in wmeJM_Config)
        {
            if (["_map_WME","_map_WMEB","_map_LI"].indexOf(i) >= 0)
            {
                continue;
            }
            var id=i;
            var title=wmeJM_Config[i].title;
            var template=wmeJM_Config[i].template;
            var save=wmeJM_Config[i].save;
            strFormCode += ''
                +'<div class="form-group">'
                +'<label class="control-label">'
                +'<input data="'+id+'" name="wmejm_cfg_'+id+'" id="wmejm_cfg_'+id+'" type="checkbox"><label id="wmejm_cfg_'+id+'_chklab" for="wmejm_cfg_'+id+'">&nbsp;'+title+'</label>'
                +'</label>' + '&nbsp;<a style="display: inline;" class="__wmejm_cfg_editlab__" data="'+id+'"><i class="waze-icon-edit"></i></a>'
            //+'<div class="controls" id="wmejm_inp_'+id+'_all" '+(save?'':'style="display: none;"')+'>'
                +'<div class="controls" id="wmejm_inp_'+id+'_all" style="display: none;">'
                +'Name: <input data="'+id+'" type="text" class="form-control" autocomplete="off" id="wmejm_cfg_'+id+'_val" name="wmejm_cfg_'+id+'_val" value="'+wmeJM_Config[id].name+'" size="13"/></label><br>'
                +'Title: <input data="'+id+'" type="text" class="form-control" autocomplete="off" id="wmejm_cfg_'+id+'_tit" name="wmejm_cfg_'+id+'_tit" value="'+title+'" size="13"/></label><br>'
                +'Template: <input data="'+id+'" type="text" class="form-control" autocomplete="off" id="wmejm_cfg_'+id+'_templ" name="wmejm_cfg_'+id+'_templ" value="'+template+'" size="13" title="Подстановочные знаки: {{city}}, {{lon}}, {{lat}}, {{zoom}}"/></label><br>'
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
            +'<label class="control-label">Other settings:</label>'
            +'<div class="controls">'
            +'<input name="wmejm_cfg_savedsel" value="" id="wmejm_cfg_savedsel" type="checkbox"><label for="wmejm_cfg_savedsel" title="Восстанавливать выделенные объекты после прыжка">&nbsp;Restore selected</label>'
        //						+'<br>'
        //						+'<input name="wmejm_cfg_around" value="" id="wmejm_cfg_around" type="checkbox"><label for="wmejm_cfg_around" title="">&nbsp;Show link around</label>'
        //wmeJM_around
            +'<br>'
            +'<input name="wmejm_cfg_debug" value="" id="wmejm_cfg_debug" type="checkbox"><label for="wmejm_cfg_debug" title="Включить логирование">&nbsp;Debug script</label>'
            +'<br>'
            +'<button id="wmejm_cfg_resetConfig"  class="btn btn-default" style="font-size:9px;'+padding+'" title="Reset config!"><i class="fa fa-recycle"></i>&nbsp;Reset config</button>'
            +'<br>'
            +'<button id="wmejm_cfg_resetWPos"  class="btn btn-default" style="font-size:9px;'+padding+'" title="Reset window position!"><i class="fa fa-recycle"></i>&nbsp;Reset window position</button>'
            +'<input name="wmejm_cfg_window_hide" value="" id="wmejm_cfg_window_hide" type="checkbox"><label for="wmejm_cfg_window_hide" title="Hide Window">&nbsp;Hide Window</label>'
            +'<br>'
            +'</div>'
            +'</div>'

            +'</form>'
            +'</div>'
            +'';

        srsCtrl.className = "tab-pane";
        srsCtrl.innerHTML = strFormCode;
        WazeWrap.Interface.Tab('JumpMaps', strFormCode, WmeJM_onWazeTabReady);
    }
    else
        if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InitConfig(): not found '"+CreateID()+"'");
}

function WmeJM_FakeLoad()
{
    if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): start WmeJM_FakeLoad(): this"+ this);
    var loctype=WmeJM_GetLocationType();
    if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): start WmeJM_FakeLoad(): loctype="+loctype);

    if(window.document.getElementById('WME.JumpMaps_' + wmeJM_version)) // if THIS is there, then the other checks have passed
    {
        if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_FakeLoad(): FOUND WME.JumpMaps_" + wmeJM_version + "!!!. Done");
        return;
    }

    if (loctype === "waze")
    {
        if (typeof Waze === "undefined")
        {
            if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_FakeLoad(): wait W. Wait 500ms");
            setTimeout(WmeJM_FakeLoad,500);
            return;
        }
        if (typeof W.selectionManager === "undefined")
        {
            if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_FakeLoad(): wait W.selectionManager. Wait 500ms");
            setTimeout(WmeJM_FakeLoad,500);
            return;
        }
        if (document.getElementsByClassName('olControlAttribution')[0] === null)
        {
            if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_FakeLoad(): wait waze olControlAttribution. Wait 500ms");
            setTimeout(WmeJM_FakeLoad,500);
        }
        if (!WazeWrap?.Ready) {
            if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_FakeLoad(): wait WazeWrap. Wait 500ms");
            setTimeout(WmeJM_FakeLoad,500);
            return;
        }
    }

    if (document.readyState != 'complete' && ++wmeJM_countProbe2 < 5)
    {
        if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_FakeLoad(): document.readyState != 'complete', wmeJM_countProbe="+wmeJM_countProbe2+". Wait 3000ms");
        setTimeout(WmeJM_FakeLoad,3000);
        return;
    }

    // Further Initialization
    if (loctype === "waze")
    {
        // What if we jumped from external and if there is a "jmlink" component in the URL, then center the editor at the specified coordinates (EPSG:900913).
        if (__getQueryString(location.href, "jmlink") != -1)
        {
            var jmlink=__getQueryString(location.href, "jmlink").split(",");
            var urPos=new OpenLayers.LonLat(jmlink[1],jmlink[0]);
            urPos.transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));
            var xy = OpenLayers.Layer.SphericalMercator.forwardMercator(parseFloat(urPos.lon), parseFloat(urPos.lat));
            W.map.setCenter(xy);
        }
        WmeJM_InsertWMEIcon();
        WmeJM_InitConfig();
        WmeJM_initBindKey();
    }
    else
    {
        // Other services...
        if(document.getElementById('WME.JumpMaps_' + wmeJM_version) === null && !WmeJM_InsertIcon())
        {
            if(++wmeJM_countProbe < 8) //  8 attempts
            {
                let cls="";
                if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): not other found '"+cls+"'. wmeJM_countProbe="+wmeJM_countProbe+". Wait 5000ms");
                setTimeout(WmeJM_FakeLoad,5000);
                return;
            }
        }
        //WmeJM_PostLoadOtherMaps();
    }
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


// Script launcher
function WmeJM_bootstrap()
{
    console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_bootstrap()");

    wmeJM_Config = cloneConfig(wmeJM_Config0);

    wmeJM_debug				= __GetLocalStorageItem("WMEJumpMapsDebug",'bool',false);
    wmeJM_restoreSelected	= __GetLocalStorageItem("WMEJumpMapsRestoreSelected",'bool',false);
    wmeJM_around			= __GetLocalStorageItem("WMEJumpMapsAround",'bool',false);
    wmeJM_hideWindow		= __GetLocalStorageItem("WMEJumpMapsHideWindow",'bool',false);
    wmeJM_topOffset		    = __GetLocalStorageItem("WMEJumpMapsTopOffset",'string', wmeJM_defaultTopOffset);
    wmeJM_leftOffset		= __GetLocalStorageItem("WMEJumpMapsLeftOffset",'string', wmeJM_defaultLeftOffset);

    setTimeout(function() {WmeJM_FakeLoad();},(WmeJM_GetLocationType() === "YM")?3000:500,this);
}

function WmeJM_clickJumpToMapsArg()
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

function WmeJM_initBindKey()
{
    if(wmeJM_debug) console.log("WmeJM_initBindKey()");
    if(!W || !W.model || !I18n || !W.accelerators || !W.model.countries || !W.model.countries.top) {
        setTimeout(WmeJM_initBindKey, 500);
        return;
    }

    var Config =[];

    for(let i in wmeJM_Config)
    {
        Config.push({handler: 'WME-JumpMaps'+i,  title: wmeJM_Config[i].title,  func: WmeJM_clickJumpToMapsArg, key:-1, arg:{id:i,save:wmeJM_Config[i].save}});
    }

    for(let i=0; i < Config.length; ++i)
    {
        WMEKSRegisterKeyboardShortcut('WME-JumpMaps', 'WME-JumpMaps', Config[i].handler, Config[i].title, Config[i].func, Config[i].key, Config[i].arg);
    }

    WMEKSLoadKeyboardShortcuts('WME-JumpMaps');

    window.addEventListener("beforeunload", function() {
        WMEKSSaveKeyboardShortcuts('WME-JumpMaps');
    }, false);

}


WmeJM_bootstrap();
/*
a=$("#search_td").find("a")
for(i=0; i < a.length;++i){if(a[i].href.indexOf("maps.by/map/")>0)console.log(a[i].href)}
*/
/*
const faviconLink = document.querySelector('link[rel*="icon"]') || document.querySelector('link[rel="shortcut icon"]');
console.log(faviconLink ? faviconLink.href : 'No favicon found');
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