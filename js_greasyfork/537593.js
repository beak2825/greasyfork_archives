// ==UserScript==
// @name         访问码验证助手
// @author       wangzijian0@vip.qq.com
// @description  115网盘访问码验证助手：内容查重、批量验证/接收/分享，智能存储(115分享/磁力/ED2K)、元素屏蔽、自动填写、数据导入导出等。
// @description:en 115 Access Code Helper: content deduplication, batch verify/receive/share, smart storage (115 share/magnet/ED2K), element blocking, autofill, import/export.
// @version      1.8.9.20250826
// @icon         data:image/gif;base64,R0lGODlhgAGAAZECAPr7/ERNVv///wAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5OTk5ODkxZS0wMWE2LTRlMTItYWM1Mi00YTIzMzI1MTViYjQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MkU2QTk5NkYxM0UzMTFFQzg5RkRCRTMwRTcyQUZCRjIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MkU2QTk5NkUxM0UzMTFFQzg5RkRCRTMwRTcyQUZCRjIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxOTQyMDFlMi00OGRjLTQ3OTgtOTFlNi05ZjkyNzhjNTJlZTUiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDplMjk3YTUwZC00MTM4LWVmNDYtYTY3Ni1kZTkzNDU1ZjNmOTkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQJEAACACwAAAAAgAGAAQAC/5SPqcvtD6OctNqLs968+w+G4kiW5omm6sq27gvH8kzX9o3n+s73/g8MCofEovGITCqXzKbzCY1Kp9Sq9YrNarfcrvcLDovH5LL5jE6r1+y2+w2Py+f0uv2Oz+v3/L7/DxgoOEhYaHiImKi4yNjo+AgZKTlJWWl5iZmpucnZ6fkJGhoRQFpqeoqaakql2up6Kmr1OtvKSnu7GmuLi7vLS6vr+/sqPFwbLGUMPKU8i5zc7Focnfv8RH0MjY1qDbWdOr3dff0Ny1xePb6Enu7NTqre9A5//h7PNB8Qjn2/Pr9PrZ+SfACjCUxCsB67g0gSalvI0EY+hzEm/otYwqK9Gf8aIWIc0REdjZDlPpIg+W0kSn4mRaxkKeNlwJYhZBrkaFMZzZo5jans+WsnCKDDfhK9JfTDUV5GlxJL2sEpUpxSn0LdUNUZ1ayqrnLgKm0rWHNeM4ztKvYsvbIY1HJLq5atWbftXtCtK1fC3VJN3ea9sLfohMBB/1YgzHQw4qmGFS/Wqvcx5MajJFutbDkbZQiZw0buDG4zZtBkR5PmK5rz6dKqV6NO7cA13gayX8NmUHut6dW3Y+emkFtfb9y/HcseTrw28OLIEwRfrry5c+a7T0ufHv3z8esHnht33Ti4eKIfx5u3Wf68epLp17uf2P69fJEY59svWf++/psR9/v/95nffwIu09+ABnrG0IEKhlbggg4K1+CDCsYnoYEUVijghRj6p+GGHuriYYisfSJiiRCGYqKIIKb4YSwstijKixuuKKOENNbo4I04Tujijjn26COPMQYpJIpEHqjjkRwCqeR/SX4DQJRSTklllVZeiWWWWm7JZZdWejfkO16OSWaZZp75JXWg5INmm26+2SaYRooJZ5123kmlnGvOg2effsapJol8/klooVvqKSidhi7KaJSIesJmo5IW+mgnkU6KKZ6VcnJppp6+uekmnX5KqpmhajJqqap2eWomqa4KK5atYvJqrLZOOesltd56a66W7MprrL4WAmywxmJ6FCXF/x7L7KLJTrJss9L6+awk0U6LbZ3VRnJttt6iuS0k3X5L7pjhPjJuuepqea4j6a4Lb5XtNvJuvPYCMC8j9d4Lb76L7Muvuv4qAnDA5A6cSMEGe4swIgovjG3DhzwMsbQSG0JxxcxeTOygrOKiMb4gUxsYIePyEjLKJO9lssdcqlwxzJqWPMjJI8d888ws1+zyoTkvLPOdhLWs6Ms/Gxy0nUPzXLTPt6R8tLY0C2Lz0xonLfXOVPfMbtT8Yg3n0ls33bXVOJut811Es2Ou1/eCDerUgVRNC9RoCy03IHTPYnfdK6vNNNtewm0v4YBqPTfXWRrer9tuip042Ys7Hi/jZ/9Crjfl4Gq+ruWGckyH52WKfjDnn5MXON9/q36236WCPgfpbd+NtOmUoj6262mzDrHsq6OX+it/+p4t8bsDnzvveNMesPHL97S28krbXjrzyOIeue7PS9889cNjn7n1cYtfuPe/yxS98Oe30jf31wOVvivfk1+5+X3CLofzZWtfO/2M4h8H/U3Of52z3/HQFzz5rU8V7VPf68D3BwHKyoDTkuD4oDeGo3xLg1fLGzmAskGiNDAuCslJCEHYQcS5A4XFE2EKAfcQEzLMha2jS0FCcsKejPAsN+xIDmVYQ7+U0CY/JOILbThEmRRRiUcUYgyN2EIW9s6DTuBgFHXYRBL/PpGJVwTiFFX4QSx2EYpfhGEUrBgxGpYRiVt8yRLdmEUeJhGOY+TiGp0YQAqGbI8DxGDyHMjHQF4wJ/FjnyAPeTg/Zs99iGzk/giZQEM6cpJGg18kGUjJTPYRkn9UoCY/mScI+sGCoPyaKPtAylKWz5KdlKQqPwlAOKTylQVk5SIBSUtKxvINs8xl9RQZPv75EpG7dEMvh1nHlxQSk8h0ZDG7kLFmztCWslScNPf4TC5E85oVPCUbtsnNZmVzC+AM57HGqYVymjNY6MyCOtfZK2+u4Z3wFJY81UDPeq6qnVjIpz4fSE1eWvOfqwSmQCVH0IJyMo8ITWjjAmrMgTpU/2D3TIM/Jzopfl7hohhtlEaNkBiXSBSjHxVASM/YC5CMdKIlPekKCcSThna0pSltI1pEKlOSVrQtNUUpY2IquI6mCaJR6elLJzOUlTqUpj896mWSmlOW7hQwRg0jUpWi1IQyFaZORRBUgyrUUBL1K1WtYlmLGtWlTtUCLrXqU7GaVq2u9TBnxUddsZJVgm71qmZtKlzBGlYp7fWtfeXqX9ERWHnNFTqGLSxf0QrYxA7Wq26lrAc4msnJauYgTdINd+Dio89KpLOirUFnT1RaGJw2taDdEWtjQtrXqja2snXBamtrW9ridgW33S1vdetbFPQ2uMIFLnEzYtzjqrRJyv8t7mn92tzqPPem0f3OdDdb3dZc17LZpc12Cdvd5HyXuuH1zXjJW17xnndE6VXAetHbXuy8dzbxNcB831LfBdyXvfk16X5t09/u/NezAfbvgAss3/1md8AWKS2D4SPaB1PkOhK+yGcrvJELY5g+Gt5wSiLs4Q93OMQzGTGJm+HgE5eYOypeMYVbjGIQwxhAJp7xXW9jYxqzOMeFqTGPwTucH7e1OUK+MWyKDF3kILmxSl4ykHvj5CfjOMrYJTKV4dvkK+N3x1rmb5C77GUog5m+Yh4zga1sZtRKJ82C+Qube5yXNw/ZK3I28k7qnOSr4JnJet6zlIXi5z/fOdBVpjP/obHc50NvWS6KZlCcGx3mpEA60oCeNIDZYulLl2XCD3hweCws3fV+OsOhPu+oPVLq8Z6aw6n+7qrxox0FG4bT5v3vq0Xc6u3eWhzWne+uYZLr6/7axZ1m8LD5E+zpHjvGsb7vsnXS6/c+W8falbWbQV1tZ8uYz/qdK629S+oX57nbYyU3qrONa3Fz273exnaxw71mOwu43OyGd61Zre7Hqhd5yYYzunnt40LvG4HNTve7zx3vcdfboPeGdb/n/GWFJ5jf/wZ2xYmN5nVPnOAPl7d93Z1xfZt7oRdHdsmZzWWNI4Bj3x44wFMu8oWT/OD4prnD8y3oeTMc3AhvuMFD0Z7zj9N74y8/ObQDjuiRU9zmP+d5zYHOXZevhLFPd/rNERztpGsA4r+VONaVHnW8ev0EXP+61B391ZinoOxml3nQ6Tp2E7C97Sv3ONxVTna7t33uVI07cv2+d71nHe12EfzX+c5WwwNV7XTXOeP7jne5Kx7BiL/74yUPeLNXnupvP8nkC7z5wS+68Jk//Od9LvCuR57uoS946lXQeqzH3uiabsHsQX96q4cd9rlvvO9/D/zgC3/4xC++8Y+P/OQrf/nMb77znw/96Et/+tRHQwEAACH5BAkQAAIALAAAAACAAYABAAL/lI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8fyTNf2jef6zvf+DwwKh8Si8YhMKpfMpvMJjUqn1Kr1is1qt9yu9wsOi8fksvmMTqvX7Lb7DY/L5/S6/Y7P6/f8vv8PGCg4SFhoeIiYqLjI2Oj4CBkpOUlZaXmJmam5ydnp+QkaKjpKWmp6ipqqusra6voKGys7S1tre4ubq7vL2+v7CxwsPExMEnCMnKy8zJxM1QwdrVw8I20N/Xyt7Uwds/0dkA1+3e09Tj51jl7uom4t7t7M/hIfDV8/Pd+CL5/Ov6xv3798UgYSDJjCILeCCo8hXNHQob+GD1VEDDdRYcWE/xHvDdyI4qLHfyBPiMxosKSJkwwpqjTWEeXHlxMusjRnU6PKnC5l8NRZ8mfKakJJ7izKjwbSpEeXxlPq9GnTqOegUq069eo3q1q3Zu26DidYbS/HevVpluzXtP3QspVW9i1conKxra2LjCvegxv3thXrN+/dvXoDYwxqeCFgw3ETS3TruLHjsxEmj5NsOSyEzJT7clYr4TNokKI1Pyj9bjDqx5VX20XsmhmF2H890+Z7+jbuh7p3N+it2Dbw2cBZC+9NvDhm3cmHq17dHPlz1NGZTy9d/fZy7TWLHybtPTttYt7Lm6VlPr1W9OrbL2XvPj5P+PLr94xlPz9Q/Pr74/+j71+A4AAoYIGpyWJggqa5omCDr/HnYISCIShhhQRWmOCFGBao4YYBduhhiKSESKJso5SI4oShpJjiiCyW6OKLIp4o44yi1GjjijhuGOOOEvboo4NABqngkEQaaOSRAiappH9MNqnfk/EAQGWVVl6JZZZabslll15+CWaW5UnpTphmnolmmmqKGR6NDa0JZ5xywjmmmwrNiWeeemJZ540R7QlooHS26eebgh6KqJd96mhooo4+SuWioFwEaaWJSvoJpZZuCiimnmjKaahzetoJqKKeqiapnJiKaqthqroJq67OyiWsmshKa65X2poJrrr+yismvv6aa7CHDEtsspz/jkUJsso++yizkzgLbbWCSisJtdZumye2kWjLbbiDdtXsn+Ke2ylY5TaKbrtyegsJuO7OuyW8j8hLb75W2usIvvrqy28j/v5Lb8CMDEywuwYvgnDC6C6sSMMOiwtxIhJPzG3FiFyMsbUaH2sumN90DMDIgWZGCL4mY7zynigPovI2JLes58uCxKzNzDKfbFnKIX9Jc8JB42lzIDhfo3POPE/mM7uK7swy1C73DPPPTysdNdZTM121010O/S/Y71J9s9VfS+2w2HEWDcjR1iSN9NKRdX3nq2gLfTfRZBttdq15h/332FyX7bXfWqcd+Np7t913vYkX/PiabP/htjRw/78td2JNx53u4Xh7vqy6dGPeOecTqw3px3agLnnkCrt+qeiEm14z7A/bfqjqdbCeKu4U+545VZuTvjXtnxsfOrmjWx58NJczj6rudPCeJvW3g76p9HNYfyb3v2NvqfZyeG83+PmSX/pVw0NfPPGIm5+67HzD3zr9r9sfu/Kzu98t8Bn73z7hLc95zYPG8wgYPfkxDn9oQt+2HFg7/c0PeaMCoMcs2D8JgmEs39PKAf0yEqd08CofJIxMojJCqpQQLyFcSgpR2LHJOYGD4aJh1ubWEg/WECwrrEsLkfJCEcZwcU+w4QN5OMTBRcGIF+xKD+Xyw6IE0YVJxOESkfg/J/9WUXMnFGIWdXhDLuaQhDvUYhgZ00UqfpGMZwxMFIUyRSBuEY1jVGEZwXg6IroBgiTro+HWM0AD+nGQetMg5TBIyESWTIGHZKAiH7kvRvqBj5D0o/jiQMlKPvEn60OgJj+ppUvCIZOgfB8g98e+UqpykYacJCJXSTBRvoGUsDyfJPtAy1rOS5Z7fKUuIddKXPryl/c75QT5R0xF8rINuUxmHIsyvcY505K3ZAPHpnk9Y45SmticY1SiWbhubnI+2+OmOE2pvnKG85x5DKY1zclOwLlzDdeMZ7WWyYV62vNZ+NyCPveZrH5q4Z8ABVY16QnPgrZLoFkgqEJpxVAsOPT/oa6K6BUmStEEzlMNGM2oqCxqhM58oKOwBKkARDrDbcBknR5lpTZHqtI0mkgEJF2lSVHaBJxyoKaqvGlM62iPEfC0lD4dDRR0uoGhgrKoC8rpT0Og1E8y9UBXNCpMWerRqc4FqA8CQVQ1qdWgcrU2V61bS9m00QwgVQlrVWtCHxrWrhbxqV59q0LjStaUWtUDX60kXmda1abu1K4F/StAZHpYmhIWoIb1DRPaioG+QrKxwckUlHJCk+5c9iaZdcBmbdLZ1nz2PqFlwGhjUtrfnHY/qVXAalnbWgS8diixde1sjVLbBNwWt7k9wG6Z0lvf/rYewZXtcKVS3JMe1x3J/zXAcpnb3OeqYzvSTacwqpsW8mDXpGTaLieH4d2D6iK8acUFeV/qi/NaNxjqFeB12+sU7cIXKfKdr1Dqa19yvje/390vfzEL3v/ql70Czu4sCmxgCiFYvKlYMHen5eDyniLCEjYFhdHbiguvFxYadi+EOkzfA4P4PSIeMTRLbOL+fjjFAFYwi1u84hejNsa83YyMjWNZ0ubmxt3FSmhu/J1JzdjGPLYTbUUr4x5fRrNJNvJMflzkQsHWs0BW8oCY/GIrQ1a4UWbUlFXbZSHrmMphzvGXTVtlJ9d4x02W8pGJ3GYvv5nNWUYxVeFcZxffmc4sBlFikZxnGsuVzHHmMP9d+ZxiPzt2AUAO8iu27Nw063mrgO6znSmNZ0tPWqyVTvSlOZ1pT2960GAu9KMPTehAG3qvpVb1qVmN5jIzCNWt1jR4xlxr7kD5zPrgLKLHg+Un35rXtlVOsNfMmyH/Ojbi+c91fNxpYO96zsnGdaydM21hH0fby3ZNs4n77CVnW9fRdjZsiK1bQpUb3Oemdq6lvW7kDtvd15bOuIE7b26n2jr3Nne+kf1uZh8b39sGeL35HW/otlvfAff2wP1dcIJ3GzoPZ3dxIa1cazNa2c2lB60PbvCNa7zjFvm4yNFt3JGTPCQmLzbKufzyla9UsCend80ZLnOOwPrmIXe5zXOBvpKWp1vlKY850Ou6c5/jnOcSPzrLkz50o/va6SYRetF/HnWsUx3pNFd6z7O+9K1D1eow13rZwy72su5531+/OtrT3gGMT73h8ob7zNdOd4UnfLp2DzrU3d72swe+74QvvOEPj/jEK37xjG+84x8P+chLfvKUr7zlL4/5zGu+7wUAACH5BAkQAAIALAAAAACAAYABAAL/lI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8fyTNf2jef6zvf+DwwKh8Si8YhMKpfMpvMJjUqn1Kr1is1qt9yu9wsOi8fksvmMTqvX7Lb7DY/L5/S6/Y7P6/f8vv8PGCg4SFhoeIiYqLjI2Oj4CBkpOUlZaXmJmam5ydnp+QkaKjpKWmp6ipqqusra6voKGys7S1tre4ubq7vL2+v7CxwsPExcbHyMnKy8zNzs/AwdLT1NXW19jZ2tvc3d7f0NHi4+Tl5ufo6err7O3u7+Dh8vP09fb3+Pn6+/Dx/g/w8woMCBAKkQPIgwIL2EDA8abAix4LyIFAM8rNhwIcaM/1M2cpTnkeHFkAQ1kizZ8SRKkCoHjmz5zyTMmCln0mRp09/LmTJt7oTZk2fNnEGBDvU5MafOo0JxEmVq1ClSKUqXSm0aparFcVq10uhalRpYpV/HTo1m9iyMtFihsY0a421LsXJPlq0bki5ej3f3YtTrt2LfwBEBE4Y4+LDIaYopJm7skDHkj3EnL5Zm+XLlzJExc+68+bNAw6Jvhi5t2i1qhTNWs/bs2urp1aRRPy5dO7ZmCLr/Su5deAJwx7+H735gHHHx5KB5M0+Y+3lq5NKbP6tu3QH2lWi3jxbu/XX38NO1ky/f7Dx6Buplq1ZPof1W2Ofjt49e3T785eH11//n751/5OEnnYD9AbidgQEOI1+Dh9HiYIR7QShhhWxRaGGGXWGoYYdqveJhiG2BKGKJJHFoYorByaJiiyvG4mKM0M0iY40u0Whjju6RqKONKPbo4o9AqijkkCYWaaSRpCTJpHigNAnlfKFE2eSSVCZp5ZVDZqllj1x2meOXYNYo5pgxlmlmi2immeKabJbo5pshxilnh3TWmeGdGwHAZ59+/glooIIOSmihhh6KaKDy6YlRoo4+Cmmkkip63yhaTYpppppiuqilVW0KaqiiAtqpKJeOimqqk5Y65aeqvgqroaw+6Wqstt7K56yfnIprr6/q6gmvvg4rKrCdCEtsspn/GssJsso+CymzmzgLbbWHSqsJtdZuKyi2mWjLbbh9eosJuOKGS+4l5p67bbqGrMtuvL4qRgm88t4bK72T2Itvv6jqKwm//g68KcCRCExwwpIaDAnCCj+cKMOPOAxxxYRK7AjFFm/8J8aNaMxxyB4zAnLIG4+8SMkmV4yyIiqv/HDLibwMc8IyI0JzzQPffEjOOvfL87u1/kx0rg/uO7SsERUNAEWqAkcIwk4XPfW/vUWddKFV/7x1sVcPIvXSVItttW5YK+Vo1zWrDSrUYGd9Mdlcy+212W+jHTHda+vd9teChA0R02wX7HcggDckON+E2/033IMObjLkyxYOyOEM/yUeeKpuN443opJz/PmqlP9heUKYI6756H6UjtDpl6fOuOGOd6t45LVPHnvls1OaOdGhL6x6F8RJ8HukxUN8/K/BMzF8BMmnfTvo0d+6eVYvOtf7qM/bPL2t1UPRPPaolz3+3Nkr+/0T4VN3fqjbE/y+9ssvsb557fd9/8rx1x3bT9k1sD+tdY9lA4RV+pxQPwAW8FEBxFcDF9c/qPyPPQuEXv5sd8FeHbAJCaRgBjlVQe59kHrzU0IHF/BA2o3QYinEXQSpcj32lY9/r/NdCMnnGv9xR3w1lN8KCfhDA5YwCSdUQAtJdcOdJZGGtJHgDmXYQya2bmxBVF7u1BdD+//N0H1LBFoX8ffCMPgMV4px3YTmMEYSEsaMeKFDGr13GDbWxY27Y1cZqRgYOnZOiWvEo1/0mBOF3dGGhAGkTQQZRz+eUQ5vzFciCZlHNNbxXIM0XyQZOUlxVVJnQStDI4XYR0j+UZJ79Ncm91ZIUgZShIGRo1wMORNEhtKSo8RkKb04S04ezZarhN8jablI2VWRacTMWyo5t8ViKlN0xxRmMpcJTQte0plRjKY1PbdLaprumtzEZjN1N8xuQrOTsJyiOM/Ju2mC85noFCc5VVnNdp7znbyMpzy7Sc84HPGeJ8vmOu3JT2vmEw77DCjy/Em6LxpUet9MaDgXCrOBvqH/oBD1ZUO9cMqKLnODzPulRsc5RCRk9KPE5Cj9PErSYprUhChNqSs/o8O3uBSkV0RgS2cKTNs4UaY4VWlIjzDSnkb0p0YIqlAxGEbw3fSoSM3hTtnCVEXqFIa5jKr+iFoEo1oViEnFYlW3ytCu2vSrYGUhVsvZkrLG7aKt+CQ/JRqsTFoVrseSa1Tp2iy7MhWv09LrUfmaLb8KFbDfEmxPCVsuw+IUsepS7EwZawm33hOylZCsPClbL8e6FLNIu6Vax4VQV1i2nZwNmGZTWtqD4UlNnlptm1rrWjjBNrZzmi1t7WTb2+Ypt7qtEKN6OyDeAtdBvx1ugoRr3EqZKrkW/youc5/j3OcmJ7rSHQ51q3vWzmL3tabdLndV690jaTe8te0uecsL3vN6KLPqXe9429vc98JXQuydb3zNa1/6yje/7ioEf++b3v82qL4C7u/ZCmzguyFYuQFecHDx6+ADQTjCx50whfOz3wtDN8Mani6HO2zdD4M4u8gc8YYtbOKVzizFBRIxi6fa4BeTWJsyrunHamyc6/5XQXNBLoh5rBId8xfIdvFxh4l8IiNrGMl5UfKFmcwXJ1MYyhsRcn6p7Jvl4hjLgpFyhLlcxMJuGTxk8bKDwZzFuo6ZeGEx84LRrBwt1xjOlKHVmp3XZmG4lh8erBOfUbjaPxsx0IJGwEWeC32AQyNaAIpGdKML/WhBR/rPk+Zzpflx6X1kWh+bzkenFw3qUIt61KQutalPjepUq3rVrG61q18N61jLeta0rnUiCgAAIfkECRAAAgAsAAAAAIABgAEAAv+Uj6nL7Q+jnLTai7PevPsPhuJIluaJpurKtu4Lx/JM1/aN5/rO9/4PDAqHxKLxiEwql8ym8wmNSqfUqvWKzWq33K73Cw6Lx+Sy+YxOq9fstvsNj8vn9Lr9js/r9/y+/w8YKDhIWGh4iJiouMjY6PgIGSk5SVlpeYmZqbnJ2en5CRoaEUBaanqKmmpKpdrqeipq9Trbykp7uxpri4u7y0ur6/v7KjxcGyxlDDylPIuc3OxaHJ37/ER9DI2Nag21nTq93X39DctcXj2+hJ7uzU6q3vQOf/4ezzQfEI59vz6/T62fknwAowlMQrAeu4NIEmpbyNBGPocxJv6LWMKivRn/GiFiHNERHY2Q5T6SIPltJEp+JkWsZCnjZcCWIWQa5GhTGc2aOY2p7PlrJwigw34SvSX0w1FeRpcSS9rBKVKcUp9C3VDVGdWsqq5y4CptK1hzXjOM7Sr2LL2yGNRyS6uWrVm37V7QrStXwt1STd3mvbC36ITAQf9WIMx0MOKphhUv1qr3MeTGoyRbrWw5G2UImcNG7gxuM2bQZEeT5iua8+nSqlejTu3ANd4Gsl/DZlB7renVt2PnppBbX2/cvx3LHk68NvDiyBMEX668uXPmu09Lnx798/HrB54bd904uHiiH8ebt1n+vHqS6de7n9j+vXyRGOfbL1n/vv6bEff7//eZ338CLtPfgAZ6xtCBCoZW4IIOCtfggwrGJ6GBFFYo4IUY+qfhhh7q4mGIrH0iYokQhmKiiCCm+GEsLLYoyosbriijhDTW6OCNOE7o4o459ugjjzEGKSSKRB6o45EcAqnkf0l+A0CUUk5JZZVWXollllpuyWWXVno35DtejklmmWae+SV1oOSDZptuvtkmmEaKCWeddt5JpZxrzoNnn37GqSaJfP5JaKFb6ikonYYuymiUiHrCZqOSFvpoJ5FOiimelXJyaaaevrnpJp1+SqqZoWoyaqmqdnlqJqmuCiuWrWLyaqy2TjnrJbXeemuuluzKa6y+FgJssMZiehQlxf8ey+yiyU6ybLPS+vmsJNFOi22d1UZybbbeorktJN1+S+6Y4T4ybrnqanmuI+muC2+V7Tbybrz2AjAvI/XeC2++i+zLr7r+KgJwwOQOnEjBBnuLMCIKL4xtw4c8DLG0EhtCccXMXkzsoKziojG+IFMbGCHj8hIyyiTvZbLHXKpcMcyaljzIySPHfPPMLNfs8qE5LyzznYS1rOjLPxsctJ1D81y0z7ekfLS2NAti89MaJy31zlT3zG7U/GIN59JbN9211TibrfNdRLNjrtf3gg3q1IFUTQvUaAstNyB0z2J33SurzTTbXsJtL+GAaj0311ka3q/bboqdONmLOx4v42f/Qq435eBqvq7lhnJMh+dlin4w55+TFzjff6t+tt+lgj4H6W3fjbTplKI+tutpsw6x7Kujl/orf/qeLfG7A58773jTHrDxy/e0tvJK214688jiHrnuz0vfPPXDY5+59XGLX7j3v8sUvfDnt9I399cDlb4r35Nfufl9wi6H82VrXzv9jOIfB/1Nzn+ds9/x0Bc8+a1PFe1T3+vA9wcBysqA05Lg+KAXO8VtjCgNRGD+NHiso3TwJaEDobFEeDUIuiFjjUJh63JSQsltECgjXEkMBVc8DqYQfhmUYQh1+ELkBdCEwXJh71TYBhb+D4hH5OEHfXhCJgINiWxQorOk2D8M/z4RhxHDYvecOEQoFtGLX6PiGqx4OhruUIth5GIFyfg2M6oBjbdTYxA9GIbEaMd9cRRj4xDnDsZUh31rREcNwVKQEfmGgAIj4h8B95DJtIZ/X3RjFumSyNkkh5Jl9GMBAUkOQU6Sj+XzZCNB6QQ9DpKBhSzHIbmSSduM0oFNtGQlMakQST7AglE0ZbkwF0oCrTIVr2xGMasSS93MUoF33MYxpZLMEy2TkM3ExjOdEk3ocLKPtuwkJKOgymmysprUuOZSsvkdWk7Rl9X7ZiCFKU5ithJK8zzLDUkZsnxuDozh26Y+/zk6OeaBlwDVJwDhQNCCmpMi/cSnQh96pYO+If+hEF0nGxuqzopqNKICxQNFN8pNGCaQmiAtKa46eoePmvSTF40gBVdqUZEmL6Mw1ahEV/jSmnpTptlzqE4NilI7qPSnOeSnSxlJVHKyp4fw3KUjkzq4oAognBPtRTrpCdUL8jSeb9miLhfZzaySiWNUxakoncpOsXLUqGD9ahKtukdXqvVwLW3rZRAK12FGY6503Spam2pWwNLmqXxda10He9bAunWThiysqaRa1rcmFrFhdewAD8vYu1Z1spnFqmWjylbKLvaMeeWqMT87O8wuILJVLO1fG4vaj4W2s5rBK2dXS9jYimy2uL3tHF1rV8/q9rJ+DW5tNytY2lpzuE7/U60CWEta32Knssx1FGSB2wXo/nY/RNAuQrDbWu4OwbsNAW909dNd8w5EvWlw0njZW17posG9QiDvEexrBvoGAb9F4C8Z9AsE/75XvmcA8A8EXF/4FnhJCSawERCcRwbvV8EPpnAZDOwDCAfYwv+V8IYd3F8OjwHDPdDwgUUsBhLzwMQZRnGExdvg5PoDxB2G8YRpHCAlcecGTVLmjivS4x/XoMfSFLJdgmzkmCA5yTAgMpOB3KQnN3nJUmaBk6vcgitjeQVa3nIKuuzlE4A5zBmhMpnLHOUzi5nILj4zm9tM5jfjWM1TlfNo6axcO8sSz6a1M5+1qWcG/bnPch50/1wDrUlDIwDRx1X0cxktaEf3FtKJljSluyrpSV+6yJnuzqb33GkDfBrUoR61j0Nd51Gj+tGqXvWiTe3qV7c61qn+NK1FDetbm5rTpc41rXd961pvOtjA1rWvY13sXx/b1ckOtl5l5Oyr+ijah542tQmdomtj20Tafi2Rum3cHYFbtN8et6bLbe7pHindrNYxu2Xt7nfjOs3yFja65T3mdOfb3CWqtwX67W9AYyjgAq8QwaX9oINXO+EK37aKG+7pEEHc2wafOLkrbvFzYzzj6h44x9s9o493fOMitzfJRQ7wkv/bwypfuHtavnIbw/zZ55l5weVjc4S/POc0Nw/Pe4Q+np87PFBCHznOi37xoyNd40pfutHf43SmQz3qT9851SOO3quvmbdaz7JUu26Cm4LdA2If+1e+bnaXoD3tQ1k728nu9refnetyP0nc6z4XuuOdJ3rfu1Lu7vfDAD7wOl8q4bfu3MMrfvGMb7zjHw/5yEt+8pSvvOUvj/nMa37znN9BAQAAIfkECRAAAgAsAAAAAIABgAEAAv+Uj6nL7Q+jnLTai7PevPsPhuJIluaJpurKtu4Lx/JM1/aN5/rO9/4PDAqHxKLxiEwql8ym8wmNSqfUqvWKzWq33K73Cw6Lx+Sy+YxOq9fstvsNj8vnrID9js/r93gq/w+YRzc4EWj453eo2EfY6LAIGZAYeehouUCpOJkJeOl5wGm4Gbr3+UnaOYWKaHq5yjf6atfqKiuoastI25irG9V7t+sIPIsLLMxLHCuLTEgsadzbPPi8/DpNVx2diz2nLfXd/RYORS7O9Wzukq58/sR+PAMv7e40zy1/z1zfpL8v4+8aPyYBV9EoiGogQYShDjLkpHDJQ4j5JkaKqMQiJYf/GhdhTNIREseQoj4eIampIspUJousLAnwJcuWQ2TOhGGTFc2aOUup7BlsJ0+gvnASLSrUx1Gk65YWSwrE6dMYUqFB/VFVZKGsKa8q5VppK9hAXrGOJSv2LKyyPdTefOBWJ1sdcddKqOtzLl28t+7yZap35F8KfwEHjlnYaoTEUw/XYKwYAmTHOCanHUzZhmW/iTNrZkwYtGfBfEN3Hv2z9GXVqKmK5ly4NeLYq/HKDgE5t8bbknX7Rsgb7u/h+oI/Io6cnfEGyZu3W67AuXRb0DFNv06qenTs3DdqR9A9vMfvoMSbf1v9vPq85Ne7D0pewPv38Q3Md19f/n31+ffz/6/vX4DsOSZggfBRZqCBoyVY4IIMBujgg/tFKOF8FFaIn2cY3nfhhud16KF4IIbY3YgkYmfiidOlqKJzLLaY3IucAEBjjTbeiGOOOu7IY48+/ghkjpshSEyQRh6JZJJKCvkakcAsCWWUUkI5JIFFTollllreWOVhz2wJZphUNmnlk2KeiaaPXQb2ZZpuvlnjmnq1CWedZ8o5F5127qklnmzpyWegUfpZFqCCHookoV4ZimijPyp6FaOOTqojpFBJSmmmcZLp5ZWafsolp2x6CmqplnaDaamq2tnRTqmuCmuardL0aqy2gjlrS7XeyuuUuZq0a6/CKvnrR8EOi2yQxf9idGyyzvK4bETNPkttqBa5Smq12j66G63Zbgtupd3q+m245m56rbdmnssuuhNhu2677Ear0LTy9krvQPbee2u+/OzLb6z+1tMsJPIaHGZV0xS8yMENJyzVwuXuiPC8D+MacTMMK+IwxxA7JXG8al58bsVbKqzxxOJ6bDHLJ2eMzMaHdDzzx0uF3IuRJpu7c5Yox6wyky7zTHKfMAsjsyE0K23zUTjnonPR4faM5c9IB40j1dtqLaXVuyQdyNJhN03U07ZEPfTUUld99NdYW1tzy3G/DHLKIvfIdbV5j1k30Gmz/ffWa+85sCV7L3m4s4nLOu7VgXc9uLaLo1n4MJH/D3o5tZPf2bjbj2P+ueaZv1l5MqEjPrriqTOert9zG3266rGz/q7dr/u8OrKbi1m6M7kfuTu+v/PeOS3BA3l8v8OTDZztTGM8u+7LQ1+768/TfTu4ycNevePZ+zq98tFz3rr313N/vtrjE1++599Dvr7w8VP/kNmAsP++3uGjz1A2b2vaEbE1Tw4AE1QA29W7MhQwUAeUW/288b9MNbBkxXPDAvk0QaK1bxwRpFQG1dc9OFyQcBoRYEH8dzdYfVB7FWzDCFlVQgS2kA0vrNMKBbdBC3ZwUjeU3AzXUEM49VB/OXThDh01RNEVkYZHbFQSn5VAMgSRdDF0YP8gmMJV/z1RdiH8glZgkz4WZtGHffvFeMA4NivKwoQ5sYZdFrM/gTWRV157xxnhOD/x5UyGZSzHHXuTR1tNEYBts2NX8Jg/Je5RjT1x44CEE0g5jpGIN9sGWtB4Pz4ukoJ9NGRYMPkHNqJClDJxpB5Mk0gozlGPTrMkepgTRxWuUpCFtMcfIZlKLkJNk60Exy2PE0lZTlKRvTTjIQGZy2QNUoK17McvYRlMLc5SkpX05TFxGUYcblKD1YzD9gIGThtFEYvJDKc5hdbFVnzznAEbJwFjyc57udOb8IwnL69ovTTac58rS6cp1slPTvrzFPUMqBgH6gmAGvSgD8xnJhe60HmKsP+gECUmPs2nz4ruU6IcjKZGLTpAjD70o/bkqA49SlJl/rAWKE3psEzahS8icpcuhR9Ct3PNk35ypmerqU0bytNXMjGn0NymT5OUQJlOlKgMWKZGk/rMoe4UmTQ9KrFWmgCldnSq2OypVa+6ROswFYhRFatRv6osrIKnrGrQKjDPilZuhRWnXNUpTIL6irgiVa3lGWtb2ZrVaVoVqn5Ng1uLWlW9Io+v9gEsGg7bVMEelbB1NWJh1zpMxWaNsfq57Bkga9bEahZvnAXtXz3b2MyO1l1Apeol6YnazsJ1tZuda2Bja8q+wJY21qzsQnA7hlO5xLEnIa4ZhEsE04LEuAr/FJUzgSsE5T7Wub/1rUSYK0XqXhe6QZDuZ7WbEewOxbqn5a0xybtc7oIBueO9qx/V60Xwphe9SPDuceVbX/FGV79hYO9+4fsVAMcUv8UVMA/s29zT9Na9nmSwXVlzXgc/l77fVXCEX5sf13Iow2JQEIf726APrzfEIvaCh0s8YAGh2MQkXrEWTuziLMA4xleYMY2rYOMbu9JCOq5xi3u8Y/oAGcc/HvJ7IWTkIG8oye09EZP/26IndxdGkZHyDqhcZSvnAMtaDnCUu3xgKoM5zDAa85XFbOYtoznNN+Aym9u85jeThkRy/kyZ6zznEOE5zx7ac2ro7GfX3DnQL3Az/6GbMuhD1yHOilaBoRvtaEZD+gSPnjSlJW1pElQ605rGNKdx4+lPf2DTogYBqUvtgVOjmgOqXrUGWu1qDMA61haYNa1RqaJbjzrUuq6ArXutYT0DewO/HjZinWzsDBQ72XTNNbMvsOxn9/XL0sY1sqtdG2FjG5R93ja3l+xtvHY73F0FNLnf6uxzH9vc6g7ttdvd7HfDG7PUnje9023vaeM737Ldd76jXW2AS1vgzyY4v3PMb3FnKOG+LjLDgy3kh2c74hJX+HoqPvGFY7zcPN44xynu8ciqOOTonhDJ193xk8d7wypfecpbrm+Tw/zeMp95rQls81fjPOey3jnPb5Ru4Z+DOuhC3zXRi94B/yL9425Z+tDN63RW+zzqJbcN1ZM+9au72+pa1/nRu25troMd2lkfO9BvavYWwDTtRkc72yNt27enYO1yJzZn6z4CuuO953Hfe6f77ncR6D3wYT8h4dV+98NLHfCKxzrjG2/3x0Ne2YmfvOUvj/nMa37znO+85z8P+tCLfvSkL73pT496NBQAACH5BAkQAAIALAAAAACAAYABAAL/lI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8fyTNf2jef6zvf+DwwKh8Si8YhMKpfMpvMJjUqn1Kr1is1qt9yu9wsOi8fksvmMTqvX7Lb7DY/L56yA/Y7P6/d4Kv8PmEc3OBFo+Od3qNhH2OiwCBmQGHnoaLlAqTiZCXjpecBpuBm69/lJ2jmFimh6uco3+mrX6iorqGrLSNuYqxvVe7frCDyLCyzMSxwri0xILGnc2zz4vPw6TVcdnYs9py313f0WDkUuzvVs7pKufP7EfjwDL+3uNM8tf89c36S/L+PvGj8mAVfRKIhqIEGEoQ4y5KRwyUOI+SZGiqjEIiWH/xoXYUzSERLHkKI+HiGpqSLKVCaLrCwJ8CXLlkNkzoRhkxXNmjlLqewZbCdPoL5wEi0q1MdRpOuWFksKxOnTGFKhQf1RVWShrCmvKuVaaSvYQF6xjiUr9iyssj3U3nzgVidbHXHXSqjrcy5dvLfu8mWqd+RfCn8BB45Z2GqExFMP12CsGAJkxzgmpx1M2YZlv4kza2ZMGLRnwXxDdx79s/Rl1aipiuZcuDXi2Kvxyg4BObfG25J1+0bIG+7v4fqCPyKOnJ3xBsmbt1uuwLl0W9AxTb9Oqnp07Nw3akfQPbzH76DEm39b/bz6vOTXuw9KXsD79/ENzHdfX/599fn38/+v71+A7DkmYIHwUWaggaMlWOCCDAbo4IP7RSjhfBRWiJ9nGN534YbndeiheCCG2N2IJGJn4onTpaiicyy2mNyLnABAY4023ohjjjruyGOPPv4IZI6bIUhMkEYeiWSSSgr5GpHALAlllFJCOSSBRU6JZZZa3ljlYc9sCWaYVDZp5ZNinommj10G9mWabr5Z45p6tQlnnWfKOReddu6pJZ5s6clnoFH6WRaggh6KJKFeGYpooz8qehWjjk6qI6RQSUpppnGS6eWVmn7KJadsegpqqZZ2g2mpqtrZ0U6prgprmq3S9GqstoI5a0u13srrlLmatGuvwir560fBDotskMX/YnRsss7yuGxEzT5LbagWuUpqtdo+uhut2W4LbqXd6vptuOZueq23Zp7LLroTYbtuu+xGq9C08vZK70D23ntrvvzsy2+s/tbTLCTyGhxmVdMUvMjBDScs1cLl7ojwvA/jGnEzDCviMMcQOyVxvGpefG7FWyqs8cTiemwxyydnjMzGh3Q888dLhdyLkSabu3OWKMesMpMu80xynzALI7MhNCtt81E456Jz0eH2jOXPSAeNI9Xbai2l1bskHcjSYTdN1NO2RD301FJXffTXWFtbc8txvwxyyiL3yHW1eY9ZN9Bps/331mvvObAley95uLOJyzru1YF3Pbi2i6NZ+DCR/w96ObWT39m4249j/rnmmb9ZeTKhIz664qkznq7fcxt9uuqxs/6u3a/7vDqym4tZujO5H7k7vr/z3jktwQN5fL/Dkw2c7UxjPLvuy0Nfu+vP0307uMnDXr3j2fs6vfLRc96699dzf77a4xNfvuffQ76+8PFT/5DZgLD/vt7ho88QGR0J+792ee0dGgFgAQXYNgJaxIALRGDffnFAXgVQbk7bBkMYOBGxAcUaAcHgQzTYEw76w4MXdODNLIgQEqbQhBUERwTFl0EWlg2FBVFhDWW4QRp2UH4xpOAMXdhACb6QaA8sxxAFdkTtJdAeSVzVBEu2xH40UVVPJOIJgdhDGP9+EIch9Mb+kHg3JbbPeF+EFcBs1TtqlNGJb5Nd99yXPjHmjIsBsd8fQLgKPPrDjnzQIyn8eA8+7gGQM6LjHp03Nh/KgpDwEKQeGEkJSKbDkXmQ5PbA+EYyzk+LZzNkcRB5P0+GwpLPMV8ioRhGwY2xFZc0YxuTlcZsrJGKr5TeKk3RSjamUnLFc8MZAwZMG8VyDL8MZjCHKYZiGjNgyAyDMpd5r2aC4ZnQFOU8ZLnLampTmL1sAzW3qb5M+rKW4DxmN9nwzXLy8pboJKc6+SXNL6Tznc+KpxfmSU9YnnMN+MznsOzZhX76k4f182I2B8rMfapBoAhFo0KzoBURMPT/nQBlQEQh2BXcuLOh0HooBi5qxIyCYKLqrKh1RKrAsEh0oxxdmTg7ANKUwkSjB20p8jx6gZgyEaUeIGk5TbodnkpRqBzwKTiBmgCdDlWlNJ2jTfn20qKOB4szHSlLn8pNdm5AqQsh6lavilUaIRU8U8UoU61a07BSDKcW4KpEyopWp6oVeGytgFszAtcPGHWbYy2PV/H61wzsVZt9tU9ed3pWvYI1rIXVT2CRcFfBLharjY1sfj4qqsueIrOarcVpOqtJ2oCWlZwdre8+a1pPnCq140Qtay3n2teeVrSyNR1ta6vG2OJWDqvd7Rl669syADe4xCwtcbWgoONSdULK/zWrf5rrXOZCF7HPnS51pWvdtwoou0utLncBC6Hvgte74j1Jg8oL2fOi1wjJXa9L1OveoYQ3vvIlL32jAqPI3LcpMNrvbFTkX9f0N8AvyK9+CZwCAyOYvy1acAsU7OAVQDjCCc4vhVUw4QubIMMaJgGHO7zSAYPYwxYeMYlFbOLFGLiUGl4xiy/s4niAOMb0mDGNqTPiG+PYxjo2SI577GMeA7khPx4ykYVsZO8gOcmW9S+TKbLkJyeWwlJWcoerfJH4Ylkd393yi8XrZRmvN8w1HjOZd2zmMwvEvWr+R5rbnB0twzkhcp7zkd9sZyujN8933jOfM0HfPwO6zoI+bP+XC91k5SKay6xd9Jdf62gx4zbSZZ40pdFs6UuvebeadnOmOx1n34I6yJwedahLbWooozrVeq4tq1X96VcbutGyzrKoa53oyzL6pNcxTaVd/WiLcsfX+Li1pIWDotpsOtaYRnavlU1qZnva2SuCNp2N/evjJBs2xV51t3uzbRUfW7a7Duqzud1scgeb19VG97TVPW7mDNvap5b2sqktHWKnG9LrNne7xZ1tfsdb2OEGd8BpPXB255vefQZ2wv29cHffG94HV7iLGA7rFGt7vhovMHw7/uCPg1zCIh95hbdr8pCjPOUkXznLT87xl5+gvTKfeclrHuKY43wENN85z2+a7vOeAj3oUnU50eNq36MzuKASj7bSVR5Vi0/86Riua7mpXoI0Xh3rP9cqxN/NdZt7Pan9DnvOmQ7wb5td7FH/+tTX3vW2k/3hcFfs2MlK97rD1Opl13vR5Y73ivt973f3q+AH/9XCGzbviMes4h17+MY7HvCGV7vkL4/5zGt+85zvvOc/D/rQi370pC+96U+P+tSrfvWs10IBAAAh+QQJEAACACwAAAAAgAGAAQAC/5SPqcvtD6OctNqLs968+w+G4kiW5omm6sq27gvH8kzX9o3n+s73/g8MCofEovGITCqXzKbzCY1Kp9Sq9YrNarfcrvcLDovH5LL5jE6r1+y2+w2Py+e8gP2Oz+v3eCr/D5hHNzgRaPjnd6jYR9josAgZkBh56Gi5QKk4mQl46XnAabgZuvf5Sdo5hYpoernKN/pq1+oqK6hqy0jbmKsb1Xu36wg8iwsszEscK4tMSCxp3Ns8+Lz8Ok1XHZ2LPact9d39Fg5FLs71bO6Srnz+xH48Ay/t7jTPLX/PXN+kvy/j7xo/JgFX0SiIaiBBhKEOMuSkcMlDiPkmRoqoxCIlh/8aF2FM0hESx5CiPh4hqakiylQmi6wsCfAly5ZDZM6EYZMVzZo5S6nsGWwnT6C+cBItKtTHUaTrlhZLCsTp0xhSoUH9UVVkoawpryrlWmkr2EBesY4lK/YsrLI91N584FYnWx1x10qo63MuXby37vJlqnfkXwp/AQeOWdhqhMRTD9dgrBgCZMc4JqcdTNmGZb+JM2tmTBi0Z8F8Q3ce/bP0ZdWoqYrmXLg14tir8coOATm3xtuSdftGyBvu7+H6gj8ijpyd8QbJm7dbrsC5dFvQMU2/Tqp6dOzcN2pH0D28x++gxJt/W/28+rzk17sPSl7A+/fxDcx3X1/+ffX59/P/r+9fgOw5JmCB8FFmoIGjJVjgggwG6OCD+0Uo4XwUVoifZxjed+GG53XooXgghtjdiCRiZ+KJ06WoonMstpjci5wAQGONNt6IY4467shjjz7+CGSOmyFITJBGHolkkkoK+RqRwCwJZZRSQjkkgUVOiWWWWt5Y5WHPbAlmmFQ2aeWTYp6Jpo9dBvZlmm6+WeOaerUJZ51nyjkXnXbuqSWebOnJZ6BR+lkWoIIeiiShXhmKaKM/KnoVo45OqiOkUElKaaZxkunllZp+yiWnbHoKaqmWdoNpqara2dFOqa4Ka5qt0vRqrLaCOWtLtd7K65S5mrRrr8Iq+etHwQ6LbJDF/2J0bLLO8rhsRM0+S22oFrlKarXaProbrdluC26l3er6bbjmbnqtt2aeyy66E2G7brvsRqvQtPL2Su9A9t57a7787MtvrP7W0ywk8hocZlXTFLzIwQ0nLNXC5e6I8LwP4xpxMwwr4jDHEDslcbxqXnxuxVsqrPHE4npsMcsnZ4zMxod0PPPHS4Xci5Emm7tzlijHrDKTLvNMcp8wCyOzITQrbfNROOeic9Hh9ozlz0gHjSPV22otpdW7JB3I0mE3TdTTtkQ99NRSV33011hbW3PLcb8Mcsoi98h1tXmPWTfQabP999Zr7zmwJXsvebizics67tWBdz24toujWfgwkf8Pejm1k9/ZuNuPY/655pm/WXkyoSM+uuKpM56u33MbfbrqsbP+rt2v+7w6spuLWbozuR+5O76/8945LcEDeXy/w5MNnO1MYzy77stDX7vrz9N9O7jJw16949n7Or3y0XPeuvfXc3++2uMTX77n30O+vvDxU/+Q2YCw/77e4aPPEBkdCfu/dnntHRoBYAEF2DYCWsSAC0Rg335xQF4FUG5O2wZDGDgRsQHFGgHB4EM02BMO+sODF3TgzSyIEBKm0IQVBEcExZdBFpYNhQVRYQ1luEEadlB+MaTgDF3YQAm+kGgPLMcQBXZE7SXQHklc1QRLtsR+NFFVTyTiCYHYQxj/fhCHIfTG/gIGRhv1jhpfDGMYx5iNMpoxYGj04vzWaMY2ymF7cGRj8VpBxzreS45xyKMeuRgQ+/3hj4Sk2B1N4cdCqq977kufIgnJRzgk8pGSO+Qp1EjJSrbPeJjMpOg2icdOelJ2jOTkG0cpOFAiUpSoHFYkvwCwVupPlWyIpSyf9Uov2PKWycplF3bJS1dacg3ADCYP6+fGnBnzjMNUQzGXaStfouNt0NRkKd3wzGo6sZlpyKY2TcVNNHjzm5+S5hbGSc5MmVML6EznpNaZhXa6s1HwxII853moel7hnvgMlD6NoBUR8FOR/9RPVyB4UBAMtJAFDShCwyJQas6z/6HjwSJMcCNRd1I0oQqEKEbv1k+4ITOiHGViSTuwUEiG8wIONeJJOZDSP27Uoy6l6QdiqseZXrSmO71pRtOpU7RYVKgfVWZIV3ZNlFb0oT31AE7rGFT0SPGlG3gqHKMqF54SVaE/JSdW7cLUrfoUpEel0VcH1NGmKpWsZT2rHkT41hFYdY1u7Ut+ioqZu5qPNXo1JW366te8AnaVpxksYf9qWE+cKrHYFBVjyVjYx1ouspL1HWUrm8bLYnaOjt3sODrr2TYsNrRlGC1pdZih04aVQ6pdrYVaq1XWwtakEJotbf1j29tOKLcLERBve1vb34KkQcIdrm+LiwQFIfckxP9drkua69yhBDe6QlAudWcDI6peNwPZvch28dpdsX63quHV7ngrUF7znrc26Y3remHaXvG+1wLxle98TVNftN4XvfkF637p21/9/hc2AT7QgPFb4MYcmMAJXjCAE2xgB/cGwgreL4XhQd0LKye6Gk5Hhjv8nOWCOMTIHXE8nGtieqA4xdThMIv/IeIXC2TFMk6Ii2ucnRvjmCI03nEmPuzjH+s4yC0tLpExHNojb9izSvZwkptM4spCOcqSnfKJN2tlFWM5yy1mMpdhjNkvg1nKYjbIk8ucYy+juSFnXrOQ1exm78A5zkWusoYR3OUtXxjPY7bzntlr5jk3GNA2FnT/gfk8Yz1TGNGBVjSEGV1oRw+awX1+bIchnWZJH5rQmQ7znTnNZkMHGNOh1vSoQc1jU/eX1Kn29J8pnWhXLxrVb1a1gBnQXVZH2M82PQ6MdF1hSy91wi0CdmTIrN7y/JrWwWZsnZmTXWOT9tm4jjazj81rtVZ72bD2L7J7DW1uL2bY39a2dcRNbHMbltrnLva1p01uX7u727dOLLu3g27hJFuv905Art/dZnX729r0dq+tDZ7uE0k74PZtt4oWvuDFqkPCa0VswitNcfJqNtxazrhTQYvvjnscvhvftshHrgGJUxnlGFD5lVmecpAP/OUwb7nMwbPymht7gPLGh8653XtzZZ/859fmOcd9TvQHW1zfQ0/6xeuy83g7/elxifq+py50wVI90lgHr1RNjnSuXr3rEB83zT8+drIX3K5b7/RYwa32mF994iSHe9xtPveca9zud1e6wHF+9or/ve9rN4zD8yx2vhMe4IWvdeIHv3imQ96gTd/75CMP9oaHPOxvvzzmN6/5mVde7or/fM9DD/jRAz3tps866l2Pccu/vvWg//rhY096z9Oe8pOnu+xtv/vMA1/0nEd76YOP/OQrf/nMb77znw/96Et/+tSvvvWvj/3sa3/73O9+HAoAADs=
// @match        *://115cdn.com/*
// @match        *://115.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @connect      115cdn.com
// @connect      webapi.115.com
// @connect      pmsg.115.com
// @connect      115.com
// @license      MIT
// @namespace    https://greasyfork.org/users/1453515

// @downloadURL https://update.greasyfork.org/scripts/537593/%E8%AE%BF%E9%97%AE%E7%A0%81%E9%AA%8C%E8%AF%81%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/537593/%E8%AE%BF%E9%97%AE%E7%A0%81%E9%AA%8C%E8%AF%81%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const __GM_ORIG__ = {
        get: typeof GM_getValue === 'function' ? GM_getValue : undefined,
        set: typeof GM_setValue === 'function' ? GM_setValue : undefined,
        del: typeof GM_deleteValue === 'function' ? GM_deleteValue : undefined,
        keys: typeof GM_listValues === 'function' ? GM_listValues : undefined
    };

    const __KV_MEM__ = new Map();

    const __IDB_CFG__ = {
        name: 'VisitCodeHelperDB',
        version: 1,
        store: 'kv'
    };

    let __idbDbPromise = null;

    function __openIDB__() {
        if (__idbDbPromise) return __idbDbPromise;
        __idbDbPromise = new Promise((resolve, reject) => {
            try {
                const req = indexedDB.open(__IDB_CFG__.name, __IDB_CFG__.version);
                req.onupgradeneeded = function (e) {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains(__IDB_CFG__.store)) {
                        db.createObjectStore(__IDB_CFG__.store, { keyPath: 'key' });
                    }
                };
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            } catch (err) {
                reject(err);
            }
        });
        return __idbDbPromise;
    }

    async function __idbGetAll__() {
        const db = await __openIDB__();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(__IDB_CFG__.store, 'readonly');
            const store = tx.objectStore(__IDB_CFG__.store);
            const req = store.openCursor();
            const out = [];
            req.onsuccess = e => {
                const cursor = e.target.result;
                if (cursor) {
                    out.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(out);
                }
            };
            req.onerror = () => reject(req.error);
        });
    }

    async function __idbSet__(key, value) {
        const db = await __openIDB__();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(__IDB_CFG__.store, 'readwrite');
            const store = tx.objectStore(__IDB_CFG__.store);
            const req = store.put({ key, value });
            req.onsuccess = () => resolve(true);
            req.onerror = () => reject(req.error);
        });
    }

    async function __idbDel__(key) {
        const db = await __openIDB__();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(__IDB_CFG__.store, 'readwrite');
            const store = tx.objectStore(__IDB_CFG__.store);
            const req = store.delete(key);
            req.onsuccess = () => resolve(true);
            req.onerror = () => reject(req.error);
        });
    }

    async function __idbBulkPut__(entries) {
        if (!entries.length) return;
        const db = await __openIDB__();
        await new Promise((resolve, reject) => {
            const tx = db.transaction(__IDB_CFG__.store, 'readwrite');
            const store = tx.objectStore(__IDB_CFG__.store);
            for (const [key, value] of entries) {
                store.put({ key, value });
            }
            tx.oncomplete = () => resolve(true);
            tx.onerror = () => reject(tx.error);
        });
    }

    (async function __initKV__() {
        try {
            const all = await __idbGetAll__();
            if (all && all.length) {
                for (const row of all) {
                    __KV_MEM__.set(row.key, row.value);
                }
            } else if (__GM_ORIG__.keys && __GM_ORIG__.get) {
                try {
                    const keys = __GM_ORIG__.keys();
                    for (const k of keys) {
                        try {
                            const v = __GM_ORIG__.get(k);
                            __KV_MEM__.set(k, v);
                        } catch (e) {}
                    }
                    __idbBulkPut__(Array.from(__KV_MEM__.entries())).catch(console.error);
                } catch (e) {
                    console.warn('GM storage migration skipped:', e);
                }
            }
        } catch (e) {
            console.warn('IndexedDB init failed, fallback to memory only:', e);
        }
    })();

    function GM_getValue(key, defaultValue) {
        if (__KV_MEM__.has(key)) return __KV_MEM__.get(key);
        if (__GM_ORIG__.get) {
            try {
                const v = __GM_ORIG__.get(key, defaultValue);
                __KV_MEM__.set(key, v);
                __idbSet__(key, v).catch(() => {});
                return v;
            } catch (_) {}
        }
        return defaultValue;
    }

    function GM_setValue(key, value) {
        __KV_MEM__.set(key, value);
        __idbSet__(key, value).catch(err => console.error('IDB set failed:', key, err));
    }

    function GM_deleteValue(key) {
        __KV_MEM__.delete(key);
        __idbDel__(key).catch(err => console.error('IDB delete failed:', key, err));
    }

    function GM_listValues() {
        return Array.from(__KV_MEM__.keys());
    }

    const cssContent = `

.gear-icon {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23666' d='M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5A3.5 3.5 0 0 1 15.5 12A3.5 3.5 0 0 1 12 15.5M19.43 12.97C19.47 12.65 19.5 12.33 19.5 12C19.5 11.67 19.47 11.34 19.43 11L21.54 9.37C21.73 9.22 21.78 8.95 21.66 8.73L19.66 5.27C19.54 5.05 19.27 4.96 19.05 5.05L16.56 6.05C16.04 5.66 15.5 5.32 14.87 5.07L14.5 2.42C14.46 2.18 14.25 2 14 2H10C9.75 2 9.54 2.18 9.5 2.42L9.13 5.07C8.5 5.32 7.96 5.66 7.44 6.05L4.95 5.05C4.73 4.96 4.46 5.05 4.34 5.27L2.34 8.73C2.21 8.95 2.27 9.22 2.46 9.37L4.57 11C4.53 11.34 4.5 11.67 4.5 12C4.5 12.33 4.53 12.65 4.57 12.97L2.46 14.63C2.27 14.78 2.21 15.05 2.34 15.27L4.34 18.73C4.46 18.95 4.73 19.03 4.95 18.95L7.44 17.94C7.96 18.34 8.5 18.68 9.13 18.93L9.5 21.58C9.54 21.82 9.75 22 10 22H14C14.25 22 14.46 21.82 14.5 21.58L14.87 18.93C15.5 18.67 16.04 18.34 16.56 17.94L19.05 18.95C19.27 19.03 19.54 18.95 19.66 18.73L21.66 15.27C21.78 15.05 21.73 14.78 21.54 14.63L19.43 12.97Z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: contain;
    width: 24px;
    height: 24px;
    display: inline-block;
}

.gear-icon.active {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%234285f4' d='M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5A3.5 3.5 0 0 1 15.5 12A3.5 3.5 0 0 1 12 15.5M19.43 12.97C19.47 12.65 19.5 12.33 19.5 12C19.5 11.67 19.47 11.34 19.43 11L21.54 9.37C21.73 9.22 21.78 8.95 21.66 8.73L19.66 5.27C19.54 5.05 19.27 4.96 19.05 5.05L16.56 6.05C16.04 5.66 15.5 5.32 14.87 5.07L14.5 2.42C14.46 2.18 14.25 2 14 2H10C9.75 2 9.54 2.18 9.5 2.42L9.13 5.07C8.5 5.32 7.96 5.66 7.44 6.05L4.95 5.05C4.73 4.96 4.46 5.05 4.34 5.27L2.34 8.73C2.21 8.95 2.27 9.22 2.46 9.37L4.57 11C4.53 11.34 4.5 11.67 4.5 12C4.5 12.33 4.53 12.65 4.57 12.97L2.46 14.63C2.27 14.78 2.21 15.05 2.34 15.27L4.34 18.73C4.46 18.95 4.73 19.03 4.95 18.95L7.44 17.94C7.96 18.34 8.5 18.68 9.13 18.93L9.5 21.58C9.54 21.82 9.75 22 10 22H14C14.25 22 14.46 21.82 14.5 21.58L14.87 18.93C15.5 18.67 16.04 18.34 16.56 17.94L19.05 18.95C19.27 19.03 19.54 18.95 19.66 18.73L21.66 15.27C21.78 15.05 21.73 14.78 21.54 14.63L19.43 12.97Z'/%3E%3C/svg%3E");
}

.refresh-icon {
    background-image: url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M23 4v6h-6M1 20v-6h6'/%3E%3Cpath d='M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: contain;
    width: 14px;
    height: 14px;
    display: inline-block;
    transition: all 0.2s ease;
}

.api-refresh-btn:hover .refresh-icon,
.refresh-btn:hover .refresh-icon {
    background-image: url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%234285f4' stroke-width='2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M23 4v6h-6M1 20v-6h6'/%3E%3Cpath d='M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15'/%3E%3C/svg%3E");
}

.internet-icon {
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M2 12h20'/%3E%3Cpath d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'/%3E%3C/svg%3E");
    mask-image: url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M2 12h20'/%3E%3Cpath d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'/%3E%3C/svg%3E");
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-size: contain;
    mask-size: contain;
    background-color: currentColor;
    width: 14px;
    height: 14px;
    display: inline-block;
    transition: all 0.2s ease;
}

.extract-btn:hover .internet-icon {
    background-color: #4caf50;
}

.success-icon {
    background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' fill='%234caf50'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: contain;
    width: 16px;
    height: 16px;
    display: inline-block;
}

.error-icon {
    background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='10' fill='%23f44336'/%3E%3Cpath d='M15 9L9 15M9 9l6 6' stroke='%23fff' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: contain;
    width: 16px;
    height: 16px;
    display: inline-block;
}

.processing-icon {
    background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' fill='currentColor'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: contain;
    width: 16px;
    height: 16px;
    display: inline-block;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.batch-share-file-icon {
    width: 16px;
    height: 16px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 6px;
    object-fit: contain;
    object-position: center;
}

.batch-share-success-icon {
    background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' fill='%234caf50'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: contain;
    width: 16px;
    height: 16px;
    display: inline-block;
}

.batch-share-error-icon {
    background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='10' fill='%23f44336'/%3E%3Cpath d='M15 9L9 15M9 9l6 6' stroke='%23fff' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: contain;
    width: 16px;
    height: 16px;
    display: inline-block;
}

.batch-share-processing-icon {
    background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='10' fill='%23ff9800'/%3E%3Cpath d='M12 6v6l4 2' stroke='%23fff' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: contain;
    width: 16px;
    height: 16px;
    display: inline-block;
    animation: spin 1s linear infinite;
}

.batch-share-status-icon {
    background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='10' fill='%23f44336'/%3E%3Cpath d='M15 9L9 15M9 9l6 6' stroke='%23fff' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: contain;
    width: 16px;
    height: 16px;
    display: inline-block;
    color: #f44336;
}

.batch-share-status-icon.warning {
    background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2L2 20h20L12 2z' fill='%23ff9800'/%3E%3Cpath d='M12 8v6M12 16h.01' stroke='%23fff' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
    color: #ff9800;
}`;

    const style = document.createElement('style');
    style.textContent = cssContent;
    style.id = 'svg-icons-styles';

    document.head.appendChild(style);


})();

const style = document.createElement('style');
style.textContent = `
:root {
  --color-white: white;
  --color-text: #333;
  --color-primary: #4285f4;
  --color-success: #4caf50;
  --color-error: #f44336;
  --color-warning: #ff9800;
  --bg-overlay-light: rgba(0,0,0,0.05);
  --bg-overlay-medium: rgba(0,0,0,0.1);
  --bg-overlay-dark: rgba(0,0,0,0.15);
  --bg-overlay-darker: rgba(0,0,0,0.2);
  --bg-primary: rgba(66, 133, 244, 0.9);
}
.btn,
.window {
  position: fixed;
  z-index: 9998;
  transition: all 0.3s ease;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-gap {
  display: flex;
  gap: 8px;
}

.clear-text-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background: #fff;
  color: #888;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  z-index: 1;
}

.clear-text-btn:hover {
  background: #f5f5f5;
  color: #555;
  border-color: #ccc;
}

.batch-share-copy-all-btn,
.batch-share-export-btn {
  display: none;
}

.batch-share-status-display {
  display: none;
  margin-top: 8px;
  padding: 6px 12px;
  background: var(--bg-primary);
  color: var(--color-white);
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  box-shadow: 0 2px 8px var(--bg-overlay-darker);
}

.progress-bar,
.progress-bar-dynamic,
#batch-receive-progress-bar,
#batch-share-progress-bar {
  --progress-width: 0%;
}

.search-clear-btn {
  display: none;
}

.extract-btn-progress {
  background: linear-gradient(90deg, var(--color-success) var(--progress-percent, 0%), var(--bg-overlay-light) var(--progress-percent, 0%)) !important;
  transition: background 0.3s ease, color 0.3s ease !important;
}

.extract-btn-progress.progress-high {
  color: var(--color-white) !important;
}

.extract-btn-progress.progress-low {
  color: var(--color-text) !important;
}

.status-display-text {
  color: var(--color-white);
}

.batch-receive-ready {
  text-align: center;
  margin-top: 60px;
}

.btn {
  left: 10px;
  bottom: 15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: move;
  user-select: none;
}

.btn:hover {
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}

.window {
  width: 680px;
  max-width: 90vw;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #ddd;
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
  padding: 20px;
  display: none;
  overflow: hidden;
  color: #333;
  cursor: move;
  left: 20px;
  top: 20px;
  z-index: 9999;
}

.window.maximized {
  width: 100% !important;
  height: 100vh !important;
  max-width: 100% !important;
  max-height: 100vh !important;
  top: 0 !important;
  left: 0 !important;
  border-radius: 0 !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
}

.window.maximized .modal-textarea,
.window.maximized #batch-receive-textarea {
  height: calc(100vh - 320px) !important;
  min-height: 200px !important;
  max-height: calc(100vh - 320px) !important;
}

.window.maximized .batch-results-container {
  height: calc(100vh - 320px) !important;
  min-height: 450px !important;
  max-height: calc(100vh - 320px) !important;
}

.window.maximized .storage-container {
  height: calc(100vh - 370px) !important;
  min-height: 396px !important;
  max-height: calc(100vh - 370px) !important;
}

.window.maximized #batch-share-file-list-container {
  height: calc(100vh - 420px) !important;
  min-height: 290px !important;
  max-height: calc(100vh - 420px) !important;
}

.window-header,
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.window-title,
.modal-title {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
  flex: 1;
}

.status-tag-container {
  margin-right: auto;
  padding: 0 10px;
}

.gear-icon {
  width: 30px;
  height: 30px;
  color: #555;
  transition: transform 0.3s ease;
}

.btn:hover .gear-icon {
  transform: rotate(30deg);
  color: #4285f4;
}

.form-group,
.modal-form-group {
  margin-bottom: 18px;
}

.label,
.modal-label,
.concurrent-label {
  display: block;
  color: #666;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 500;
  height: 16px;
  line-height: 16px;
}

.modal-label {
  text-align: left;
  margin-bottom: 5px;
}

.input,
.select,
.modal-input,
.concurrent-input {
  width: 100%;
  padding: 10px 12px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  color: #333;
  font-size: 14px;
  transition: all 0.3s;
  box-sizing: border-box;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.modal-input {
  padding: 8px 12px;
  margin: 0;
}

.input:focus,
.select:focus,
.modal-input:focus {
  outline: none;
  border-color: #bbb;
  background: #f9f9f9;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23555'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 14px;
}

.btn-primary,
.modal-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 15px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  background: #42a5f5;
}

.btn-primary:hover,
.modal-btn:hover {
  background-color: #3367d6;
}

.btn-primary.stop {
  background: #ff5252;
}

.storage-tab-content:not([data-tab-content="storage"]) .btn-primary,
.storage-tab-content:not([data-tab-content="storage"]) .batch-result-item-btn,
.storage-tab-content:not([data-tab-content="storage"]) .modal-btn {
  background-color: #4285f4 !important;
  color: white !important;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  height: 36px;
  width: auto;
  margin-bottom: 0;
  box-shadow: none;
}

.storage-tab-content:not([data-tab-content="storage"]) .btn-primary:hover,
.storage-tab-content:not([data-tab-content="storage"]) .batch-result-item-btn:hover,
.storage-tab-content:not([data-tab-content="storage"]) .modal-btn:hover {
  background-color: #3367d6 !important;
}

.btn-danger,
.storage-tab-content:not([data-tab-content="storage"]):not([data-tab-content="dedupe"]) .delete-btn,
.storage-tab-content:not([data-tab-content="storage"]) .stop-btn,
.storage-tab-content:not([data-tab-content="storage"]) .cancel-btn,
.storage-tab-content:not([data-tab-content="storage"]) .batch-share-cancel-btn {
  background-color: #f44336 !important;
  color: white !important;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  height: 36px;
}

.btn-danger:hover,
.storage-tab-content:not([data-tab-content="storage"]):not([data-tab-content="dedupe"]) .delete-btn:hover,
.storage-tab-content:not([data-tab-content="storage"]) .stop-btn:hover,
.storage-tab-content:not([data-tab-content="storage"]) .cancel-btn:hover,
.storage-tab-content:not([data-tab-content="storage"]) .batch-share-cancel-btn:hover {
  background-color: #d32f2f !important;
}

.btn-warning,
.storage-tab-content:not([data-tab-content="storage"]) .pause-resume-btn.pause {
  background-color: #ff9800 !important;
  color: white !important;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  height: 36px;
}

.btn-warning:hover,
.storage-tab-content:not([data-tab-content="storage"]) .pause-resume-btn.pause:hover {
  background-color: #f57c00 !important;
}

.btn-success,
.storage-tab-content:not([data-tab-content="storage"]) .pause-resume-btn:not(.pause),
.storage-tab-content:not([data-tab-content="storage"]) .batch-result-btn-exists,
.storage-tab-content:not([data-tab-content="storage"]) .batch-result-btn-imported {
  background-color: #4caf50 !important;
  color: white !important;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  height: 36px;
}

.btn-success:hover,
.storage-tab-content:not([data-tab-content="storage"]) .pause-resume-btn:not(.pause):hover,
.storage-tab-content:not([data-tab-content="storage"]) .batch-result-btn-exists:hover,
.storage-tab-content:not([data-tab-content="storage"]) .batch-result-btn-imported:hover {
  background-color: #388e3c !important;
}

.storage-tab-content:not([data-tab-content="storage"]) .batch-result-btn-no-password {
  background-color: #fbbc05 !important;
  color: white !important;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  height: 36px;
}

.storage-tab-content:not([data-tab-content="storage"]) .batch-result-btn-no-password:hover {
  background-color: #f4b400 !important;
}

.modal-btn {
  padding: 8px 16px;
  font-size: 14px;
  margin-bottom: 0;
}

.modal-btn-primary {
  background: #42a5f5;
}

.modal-btn-secondary {
  background: #f5f5f5;
  color: #333;
}

.status,
.batch-results-container,
.failed-items-container {
  font-size: 12px;
  line-height: 1.6;
  max-height: 360px;
  overflow-y: auto;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  border: 1px solid #eee;
  margin-top: 15px;
  color: #666;
  display: none;
}

.batch-results-container,
.failed-items-container {
  height: 360px;
  margin-top: 0;
  padding: 5px;
}

.status.active,
.failed-items-container.active {
  display: block;
}

.status.flex {
  display: flex !important;
}

.error {
  color: #ea4335;
  font-size: 12px;
  margin-top: 6px;
  padding-left: 5px;
}

.stats,
.share-info {
  color: #666;
  font-size: 12px;
  margin-bottom: 18px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 8px;
  border: 1px solid #eee;
}

.btn-group,
.modal-footer {
  display: flex;
  gap: 10px;
}

.btn-group {
  height: 35px;
  margin-bottom: 15px;
  justify-content: center;
  width: 100%;
}

.btn-group .btn-primary {
  flex: 1;
  max-width: none;
  padding: 12px;
  height: auto;
  line-height: normal;
  min-height: 40px;
}

.modal-footer {
  justify-content: flex-end;
  margin-top: 20px;
}

.pause-resume-btn {
  background-color: #4285f4 !important;
  color: white !important;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

.pause-resume-btn:hover {
  background-color: #3367d6 !important;
}

.pause-resume-btn.pause {
  background-color: #f44336 !important;
}

.pause-resume-btn.pause:hover {
  background-color: #d32f2f !important;
}

.stop-btn {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

.stop-btn:hover {
  background-color: #d32f2f;
}

.status::-webkit-scrollbar,
.batch-results-container::-webkit-scrollbar,
.failed-items-container::-webkit-scrollbar {
  width: 6px;
}

.status::-webkit-scrollbar-track,
.batch-results-container::-webkit-scrollbar-track,
.failed-items-container::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.05);
  border-radius: 3px;
}

.status::-webkit-scrollbar-thumb,
.batch-results-container::-webkit-scrollbar-thumb,
.failed-items-container::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.15);
  border-radius: 3px;
}

.status::-webkit-scrollbar-thumb:hover,
.batch-results-container::-webkit-scrollbar-thumb:hover,
.failed-items-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0,0,0,0.2);
}

.highlight {
  color: #4285f4;
  font-weight: 500;
}

.highlight-success {
  color: #34a853;
  font-weight: 500;
}

.highlight-warning {
  color: #fbbc05;
  font-weight: 500;
}

.disabled-input {
  opacity: 0.7;
  pointer-events: none;
  background: #f5f5f5 !important;
}

.chars-input.disabled-digits {
  background: #f5f5f5 !important;
}

.share-avatar {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ddd;
}

.form-row {
  display: flex;
  gap: 15px;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
  max-width: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: flex-start;
}

.concurrent-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: none;
  align-items: center;
  text-align: center;
  justify-content: flex-start;
}

.window.maximized .form-row .form-group {
  max-width: none;
  min-width: 200px;
}

.window.maximized .concurrent-group {
  max-width: none;
  min-width: 200px;
}

.window.maximized .btn-group .btn-primary {
  min-width: 200px;
}

.window.maximized .pause-resume-btn,
.window.maximized .stop-btn {
  min-width: 200px;
}

.settings-section {
  margin-bottom: 15px;
}

.settings-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
  padding: 6px 10px;
  background: #f8f9fa;
  border-left: 3px solid #4285f4;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-toggle-container {
  display: flex;
  align-items: center;
}

.status-info-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.status-info-column {
  flex: 1;
  min-width: 45%;
}

.status-info-item {
  margin-bottom: 5px;
  font-size: 13px;
}

.progress-container,
.compact-progress-bar {
  width: 100%;
  background: #f5f7fa;
  border-radius: 6px;
  margin-bottom: 8px;
  overflow: hidden;
  display: none;
  padding: 8px;
  border: 1px solid #e1e8ed;
  box-sizing: border-box;
}

.progress-container .progress-bar {
  height: 8px;
  background: #42a5f5;
  border-radius: 4px;
  overflow: hidden;
  border: none;
}

#batch-share-progress {
  display: none;
  margin-bottom: 12px;
}

#batch-share-progress.show {
  display: block;
}

#batch-receive-progress {
  display: none;
  margin-bottom: 12px;
}

#batch-receive-progress.show {
  display: block;
}

#batch-receive-result {
  margin-bottom: 12px;
}

.batch-result-item-title {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
  overflow: hidden;
}

.batch-result-item-actions {
  display: flex;
  gap: 4px;
  margin-left: auto;
  flex-shrink: 0;
}

.batch-result-item-title .storage-item-btn {
  width: auto;
  min-width: fit-content;
  padding: 4px 8px;
  white-space: nowrap;
}

.batch-result-item-status {
  margin-top: 4px;
}

.progress-bar,
.compact-progress-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 4px;
  transition: width 0.3s ease;
  position: relative;
  overflow: hidden;
}

.progress-bar::before,
.compact-progress-fill::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.status-tag,
.expired-tag,
.valid-tag,
.time-limited-tag,
.auto-renewal-tag,
.error-tag {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: normal;
  margin-left: 5px;
  color: white;
  text-align: center;
}

.error-tag,
.expired-tag {
  background: #f44336;
}

.status-tag {
  margin-bottom: 5px;
}

.status-stopped {
  background: #ea4335;
}

.valid-tag,
.auto-renewal-tag {
  background: #4caf50;
}

.time-limited-tag {
  background: #2196f3;
}

.storage-tab-content .file-size,
.batch-receive-file-size,
.batch-recognize-file-size {
  display: inline-block;
  padding: 2px 6px;
  background: #333333 !important;
  color: white !important;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 5px;
  font-family: normal;
  width: auto;
  min-width: fit-content;
  white-space: nowrap;
}

.storage-tab-content .ed2k-tag {
  display: inline-block;
  padding: 2px 6px;
  background: #9c27b0;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 5px;
  font-family: normal;
}

.storage-tab-content .magnet-tag {
  display: inline-block;
  padding: 2px 6px;
  background: #349871fa;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 5px;
  font-family: normal;
}

.correct-code {
  background-color: #e6f4ea;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #34a853;
  margin-top: 10px;
  font-weight: bold;
  color: #34a853;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.correct-code-text {
  flex: 1;
}

.correct-code-actions {
  display: flex;
  gap: 5px;
}

.correct-code-btn {
  padding: 2px 8px;
  background: rgba(0,0,0,0.05);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.correct-code-btn:hover {
  background: rgba(0,0,0,0.1);
}

.storage-container {
  max-height: 396px;
  overflow-y: auto;
  margin-top: 15px;
  background: #f5f5f5;
  border-radius: 8px;
  border: 1px solid #eee;
}

.storage-scroll-content {
  position: relative;
  width: 100%;
}

.storage-item {
  position: absolute;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 10px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #eee;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  height: 99px;
  min-height: 99px;
  max-height: 99px;
  overflow: hidden;
}

.dedupe-item-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 396px;
  overflow-y: auto;
}

.dedupe-item-list .storage-item {
  position: relative;
  width: 100%;
  height: auto;
  min-height: 0;
  max-height: none;
  overflow: visible;
  margin-bottom: 0;
}

.batch-result-item {
  position: relative;
  margin-bottom: 4px;
  padding: 8px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.storage-item:hover {
  background: #f8f9fa;
}

.storage-item.selected {
  background: #e3f2fd;
  border-color: #2196f3;
}

.storage-item-header,
.batch-result-item-title {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 5px;
  align-items: center;
}

.batch-result-item-title {
  font-weight: bold;
  color: #4285f4;
  word-break: break-word;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 2px;
}

.storage-item-title {
  font-weight: bold;
  color: #4285f4;
  word-break: break-word;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.storage-item-actions,
.batch-result-item-actions {
  display: flex;
  gap: 5px;
  flex-shrink: 0;
}

.batch-result-item-actions {
  margin-top: 4px;
}

.btn-small,
.storage-item-btn,
.batch-result-item-btn {
  padding: 4px 8px;
  background: rgba(0,0,0,0.05);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
  height: 24px;
  line-height: 16px;
  transition: all 0.2s ease;
}

.btn-small:hover,
.storage-item-btn:hover,
.batch-result-item-btn:hover {
  background: rgba(0,0,0,0.1);
}

.btn-small.active,
.storage-item-btn.active {
  background: rgba(66,165,245,0.2);
  color: #4285f4;
}

.storage-item-btn.ed2k-btn.active {
  background: rgba(156,39,176,0.2);
  color: #9c27b0;
}

.storage-item-btn.magnet-btn.active {
  background: rgba(52,152,113,0.2);
  color: #349871fa;
}

.storage-item-content {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
  font-size: 13px;
  word-break: break-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-height: 0;
}

.batch-result-item-details {
  font-size: 12px;
  color: #666;
  margin-bottom: 0;
}

.storage-item-note {
  font-size: 12px;
  color: #666;
  margin-top: 3px;
  display: flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  min-height: 0;
}

.note-display {
  display: inline-block;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  cursor: text;
}

.storage-item-title-input,
.storage-item-note-input {
  display: none;
  padding: 2px 4px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 12px;
  vertical-align: baseline;
}

.storage-item-title-input {
  width: 300px;
  font-weight: bold;
  color: #4285f4;
  font-size: 13px;
}

.storage-item-note-input {
  flex: 1;
  min-width: 0;
}

.storage-item-password-input {
  display: none;
  width: 40px;
  padding: 2px 4px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 12px;
  vertical-align: baseline;
}

.storage-item-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
}

.storage-item-password {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 3px;
}

.storage-item-sharer {
  font-size: 12px;
  color: #666;
  margin-right: 10px;
}

.password-display {
  font-size: 12px;
  color: #666;
  margin-right: 10px;
}

.password-value {
  font-size: 12px;
  color: #666;
}

.title-value {
  font-size: 13px;
  color: #4285f4;
  font-weight: bold;
}

.fill-error {
  color: #f44336;
  font-size: 12px;
  margin-top: 5px;
  display: none;
}

.storage-item-share-title {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.storage-item-expire-time {
  font-size: 12px;
  color: #666;
  margin-left: 5px;
}

.storage-item-input-hidden {
  display: none !important;
}

.storage-item-input-visible {
  display: inline-block !important;
}

.btn-hidden {
  display: none !important;
}

.btn-visible {
  display: inline-block !important;
}

.batch-recognize-btn-visible {
  display: inline-block !important;
}

.batch-recognize-btn-hidden {
  display: none !important;
}

.batch-recognize-container-visible {
  display: block !important;
}

.batch-recognize-container-hidden {
  display: none !important;
}

.batch-recognize-flex-visible {
  display: flex !important;
}

.batch-recognize-flex-hidden {
  display: none !important;
}

.batch-recognize-result-maximized {
  height: calc(100vh - 360px) !important;
  min-height: 200px !important;
}

.batch-recognize-result-dynamic {
  height: 360px !important;
  min-height: 200px !important;
}

.batch-receive-btn-visible {
  display: inline-block !important;
}

.batch-receive-btn-hidden {
  display: none !important;
}

.batch-receive-container-visible {
  display: block !important;
}

.batch-receive-container-hidden {
  display: none !important;
}

.batch-receive-flex-visible {
  display: flex !important;
}

.batch-receive-flex-hidden {
  display: none !important;
}

.batch-receive-result-maximized {
  height: calc(100vh - 360px) !important;
  min-height: 200px !important;
}

.batch-receive-result-dynamic {
  height: 360px !important;
  min-height: 200px !important;
}

.text-color-gray {
  color: #666 !important;
  font-size: 12px;
}

.text-color-primary {
  color: #4285f4 !important;
  font-size: 12px;
}

.text-color-custom {
  color: var(--text-color, #4285f4) !important;
  font-size: 12px;
}

.input-width-small {
  width: 80px !important;
}

.input-width-medium {
  width: 300px !important;
}

.input-width-large {
  width: 100% !important;
  max-width: 600px !important;
}

.storage-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 15px;
}

.storage-tab {
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  position: relative;
  display: inline-block;
}

.storage-tab.active {
  border-bottom: 2px solid #4285f5;
  color: #4285f4;
  font-weight: bold;
}

.storage-tab-content {
  display: none;
}

.storage-tab-content.active {
  display: block;
}

.storage-import-export {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.btn-secondary,
.storage-import-export-btn {
  padding: 8px 12px;
  background: rgba(0,0,0,0.05);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  text-align: center;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  position: relative;
  min-width: fit-content;
}

.storage-import-export-btn[data-text="导出结果"] {
  flex: none;
  width: auto;
  min-width: fit-content;
  padding: 8px 12px;
}

.btn-secondary:hover,
.storage-import-export-btn:hover {
  background: rgba(0,0,0,0.1);
  transform: translateY(-1px);
}

.storage-batch-actions {
  display: none;
  gap: 10px;
  margin-top: 15px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.storage-batch-actions.show {
  display: flex;
}

.storage-batch-actions button {
  padding: 8px 12px;
  background: rgba(0,0,0,0.05);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  text-align: center;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  position: relative;
  min-width: fit-content;
}

.storage-batch-actions button:hover {
  background: rgba(0,0,0,0.1);
  transform: translateY(-1px);
}

.storage-batch-actions button.delete-btn {
  background: #f44336;
  color: white;
}

.storage-batch-actions button.delete-btn:hover {
  background: #d32f2f;
}

.storage-batch-actions .selected-count {
  font-weight: bold;
  color: #333;
  margin-right: auto;
}

.storage-empty {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 14px;
}

.storage-search {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  align-items: center;
}

.storage-search-input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
}

.close-icon {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23666' d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: contain;
  width: 16px;
  height: 16px;
  display: inline-block;
  transition: all 0.2s ease;
}

.search-input-container {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

.search-clear-btn {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.search-clear-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.search-clear-btn:hover .close-icon {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23333' d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E");
}

.storage-search-select {
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  background: white;
}

.element-block-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}

.hidden-tabs-section .element-block-grid {
  grid-template-columns: 1fr 1fr 1fr;
}

.element-block-item {
  display: flex;
  flex-direction: column;
  padding: 4px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #eee;
}

.element-block-item-header {
  display: flex;
  align-items: center;
  margin-bottom: 1px;
}

.element-block-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  margin-right: 10px;
}

.element-block-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.element-block-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.element-block-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .element-block-slider {
  background-color: #42a5f5;
}

input:checked + .element-block-slider:before {
  transform: translateX(26px);
}

.element-block-name {
  flex: 1;
  font-size: 13px;
  color: #333;
  font-weight: bold;
}

.element-block-selector {
  font-size: 11px;
  color: #666;
  word-break: break-all;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 5px 20px rgba(0,0,0,0.2);
  box-sizing: border-box;
}

.modal-textarea {
  width: 100%;
  height: 150px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  resize: vertical;
}

.batch-result-item.success {
  border-left: 4px solid #4caf50;
}

.batch-result-item.error {
  border-left: 4px solid #f44336;
}

.batch-result-item.warning {
  border-left: 4px solid #ff9800;
}

.failed-item {
  padding: 5px;
  margin-bottom: 5px;
  border-bottom: 1px solid #eee;
  font-size: 12px;
  word-break: break-all;
}

.compact-layout {
  font-size: 12px;
  line-height: 1.4;
}

.compact-layout .batch-result-item-title {
  margin-bottom: 1px;
  font-size: 12px;
}

.compact-layout .batch-result-item-details {
  font-size: 11px;
  margin-bottom: 1px;
}

.compact-layout .batch-result-item-actions {
  margin-top: 1px;
}

.compact-layout .batch-result-item {
  margin-bottom: 2px;
  padding: 6px;
}

.compact-layout .batch-result-item-btn {
  padding: 1px 4px;
  font-size: 11px;
}

.compact-progress {
  display: flex;
  align-items: center;
  margin-top: 5px;
  font-size: 11px;
}

.api-refresh-btn,
.delete-expired-btn,
.delete-invalid-btn {
  position: relative;
}

.api-refresh-badge,
.expired-count-badge,
.invalid-count-badge,
.error-count-badge,
.import-badge,
.extract-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  color: white;
  border-radius: 12px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  white-space: nowrap;
}

.api-refresh-badge {
  background-color: #4285f4;
}

.expired-count-badge,
.invalid-count-badge,
.error-count-badge {
  background-color: #f44336;
}

.import-badge {
  background-color: #4caf50;
  display: none;
}

.import-badge.show {
  display: flex;
}

.extract-badge {
  background-color: #ff9800;
  display: none;
}

.extract-badge.show {
  display: flex;
}

.extract-btn-progress {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.extract-btn-progress::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #45a049);
  transition: width 0.3s ease;
  z-index: 0;
}

.extract-btn-progress > * {
  position: relative;
  z-index: 1;
}

.expired-count-badge.large-count,
.invalid-count-badge.large-count,
.error-count-badge.large-count {
  right: -12px;
  padding: 0 6px;
}

.fetch-btn {
  background-color: rgba(66,133,244,0.1);
  color: #4285f4;
}

.fetch-btn:hover {
  background-color: rgba(66,133,244,0.2);
}

.fetch-btn:active {
  background-color: rgba(66,133,244,0.3);
}

.filter-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  align-items: center;
}

.filter-group,
.action-group {
  display: flex;
  gap: 8px;
}

.sort-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
  align-items: center;
  justify-content: center;
  height: 36px;
  min-height: 36px;
  max-height: 36px;
}

.batch-actions-container {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  min-height: 32px;
  max-height: 32px;
  overflow: visible;
  flex-shrink: 0;
  position: relative;
}

.batch-actions-container.has-selection {
  padding: 4px 8px;
  background: #f5f5f5;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.chip-muted {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #333;
  font-size: inherit;
  font-family: inherit;
}

.chip-muted .storage-search-select {
  border: none;
  background: transparent;
  padding-left: 2px;
}

.chip-muted .storage-search-select:focus {
  outline: 1px solid #bbb;
  border-radius: 3px;
  background: #fff;
}

.chip-muted label,
.chip-muted .storage-search-select {
  font-size: inherit;
  font-family: inherit;
  color: inherit;
}

.dedupe-controls {
  font-size: 13px;
  color: #333;
  font-family: inherit;
}

.dedupe-controls #dedupe-scan-btn {
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  padding: 0;
  border-radius: 50%;
  margin-bottom: 0;
  box-shadow: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 24px;
}
.dedupe-controls #dedupe-scan-btn[disabled] {
  opacity: 0.6;
  cursor: default;
}
.dedupe-controls #dedupe-scan-btn svg {
  width: 18px;
  height: 18px;
  display: block;
}
@keyframes dedupe-scan-rotate {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.dedupe-controls #dedupe-scan-btn.scanning svg .sweep {
  animation: dedupe-scan-rotate 0.8s linear infinite;
  transform-origin: 50% 50%;
}

.dedupe-pagination,
.dedupe-pagination .dedupe-stats {
  font-size: 13px;
  color: #333;
  font-family: inherit;
}

.dedupe-group-title {
  font-size: 13px;
  color: #333;
  font-family: inherit;
}

.chip-muted .batch-actions-container.has-selection {
  padding: 0;
  background: transparent;
  border: none;
}

.batch-actions-container .selected-count {
  font-size: 12px;
  color: #333;
  font-weight: bold;
}

.batch-actions-container .selected-help-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #d0d0d0;
  background: #fff;
  cursor: pointer;
  padding: 0;
  color: #bdbdbd;
}
.batch-actions-container .selected-help-btn:hover {
  background: #f4f4f4;
  color: #8a8a8a;
}
.batch-actions-container .multi-select-hint {
  position: absolute;
  right: 8px;
  top: calc(100% + 6px);
  background: #fffef7;
  border: 1px solid #f0e6c8;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  border-radius: 6px;
  padding: 8px 10px;
  color: #5c4b00;
  font-size: 12px;
  line-height: 1.5;
  z-index: 1000;
  display: none;
  min-width: 360px;
  max-width: 560px;
  white-space: normal;
  pointer-events: auto;
}

.batch-actions-container .batch-result-item-btn,
.batch-actions-container .storage-item-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  height: 24px;
  width: auto;
}

.batch-actions-container .copy-btn {
  background-color: #4285f4;
  color: white;
}

.batch-actions-container .copy-btn:hover {
  background-color: #3367d6;
}

.batch-actions-container .delete-btn {
  background-color: #f44336;
  color: white;
}

.batch-actions-container .delete-btn:hover {
  background-color: #d32f2f;
}

.batch-actions-container .cancel-btn {
  background-color: #ff9800;
  color: white;
}

.batch-actions-container .cancel-btn:hover {
  background-color: #f57c00;
}

.btn-icon {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.2s ease;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  position: relative;
}

.btn-icon:hover {
  opacity: 1;
  background-color: rgba(0,0,0,0.05);
}

.ed2k-btn {
  background-color: rgba(156,39,176,0.1);
  color: #9c27b0;
}

.ed2k-btn:hover {
  background-color: rgba(156,39,176,0.2);
}

.ed2k-btn:active {
  background-color: rgba(156,39,176,0.3);
}

.magnet-btn {
  background-color: rgba(52,152,113,0.1);
  color: #349871fa;
}

.magnet-btn:hover {
  background-color: rgba(52,152,113,0.2);
}

.magnet-btn:active {
  background-color: rgba(52,152,113,0.3);
}

.storage-item-ed2k-input,
.storage-item-magnet-input {
  display: none;
  width: 100%;
  max-width: 600px;
  padding: 2px 5px;
  margin-left: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  box-sizing: border-box;
}

.window-close,
.window-maximize {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.2s ease;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  position: relative;
}

.window-close:hover,
.window-maximize:hover {
  opacity: 1;
  background-color: rgba(0,0,0,0.05);
}

.window-close::before,
.window-maximize::before {
  content: "";
  display: block;
  width: 16px;
  height: 16px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  position: absolute;
  transition: transform 0.3s cubic-bezier(.4,2,.6,1);
}

.window-close::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='6' x2='6' y2='18'%3E%3C/line%3E%3Cline x1='6' y1='6' x2='18' y2='18'%3E%3C/line%3E%3C/svg%3E");
}

.window-maximize::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='4' y='4' width='16' height='16' rx='2' ry='2'%3E%3C/rect%3E%3C/svg%3E");
}

.window.maximized .window-maximize::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3'%3E%3C/path%3E%3C/svg%3E");
}

.window-close:hover::before,
.window-maximize:hover::before {
  transform: rotate(90deg);
}

.window-title {
  margin: 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
}

.pro-tag {
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 50%, #c9c9c9 100%);
  color: #5d5d5d;
  border: 1px solid #c9c9c9;
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.2);
  font-size: 9px;
  font-weight: bold;
  padding: 1px 6px;
  border-radius: 3px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pro-tag.golden {
  background: linear-gradient(135deg, #fff4c1 0%, #ffd56b 50%, #ffb84c 100%);
  color: #8b4513;
  border: 1px solid #daa520;
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.3), 0 1px 3px rgba(0,0,0,0.2);
}

.pro-tag:hover {
  background: linear-gradient(135deg, #e8e8e8 0%, #d8d8d8 50%, #c1c1c1 100%);
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.3);
}

.pro-tag.golden:hover {
  background: linear-gradient(135deg, #ffe89a 0%, #ffc94c 50%, #ffa629 100%);
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.3);
}

.pro-tag-input {
  display: none;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 50%, #c9c9c9 100%);
  color: #5d5d5d;
  border: 1px solid #c9c9c9;
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.2);
  font-size: 9px;
  font-weight: bold;
  padding: 1px 6px;
  border-radius: 3px;
  text-transform: uppercase;
  width: 120px;
  min-width: 80px;
  max-width: 200px;
  box-sizing: border-box;
}

.pro-tag-input:focus {
  outline: none;
  border-color: #4285f4;
  box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
}

.open-tab-icon {
  display: inline-block;
  width: 14px;
  height: 14px;
  position: absolute;
  right: 0;
  top: 2px;
  cursor: pointer;
  background-color: transparent;
  vertical-align: middle;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'/%3E%3Cpath d='M15 3h6v6'/%3E%3Cpath d='M10 14L21 3'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.copy-btn.copied {
  background: #e6f4ea !important;
  color: #34a853 !important;
}

.delete-error-btn,
.delete-expired-btn,
.delete-invalid-btn {
  display: none;
  position: relative;
}

.storage-item-title-input,
.storage-item-ed2k-input {
  display: none;
}

.share-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.share-avatar {
  flex-shrink: 0;
}

.share-text {
  flex: 1;
}

.share-row {
  display: block;
}
.share-left {
  flex: 1;
  min-width: 0;
}
.share-right {
  margin-left: 10px;
  white-space: nowrap;
}

.share-info { position: relative; }
.share-status {
  position: absolute;
  top: 4px;
  right: 8px;
  white-space: nowrap;
  background: rgba(255, 251, 230, 0.96);
  border: 1px solid #ffe58f;
  padding: 2px 8px;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
  z-index: 2;
  pointer-events: none;
}

.share-status.verified-password {
  background: rgba(237, 255, 237, 0.96);
  border: 1px solid #b7eb8f;
}
.share-status .verified-password-text {
  color: #389e0d;
  font-weight: 600;
}

.network-status {
  margin-bottom: 12px;
}

.network-warning {
  color: red;
  margin-top: 5px;
}

.progress-bar-dynamic {
  width: var(--progress-width, 0%);
}

.status-info-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.status-info-column {
  flex: 1;
  min-width: 45%;
}

.batch-complete-message {
  color: #fbbc05;
  margin-top: 10px;
  border-top: 1px solid rgba(0,0,0,0.08);
  padding-top: 10px;
}

.modal-content-wide {
  width: 700px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-content-extra-wide {
  width: 800px;
}

.modal-scrollable {
  overflow-y: auto;
  flex: 1;
  padding: 15px;
}

.modal-form-row {
  display: flex;
  gap: 10px;
}

.modal-form-column {
  flex: 1;
}

.progress-container-margin {
  margin-top: 15px;
  margin-bottom: 4px;
  display: none;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  align-items: center;
}

.progress-info {
  font-size: 13px;
  color: #3b82f6;
  font-weight: 500;
}

.progress-bar-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  align-items: center;
}

.progress-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
}

.results-container-margin {
  margin-top: 15px;
  display: none;
}

.summary-container-margin {
  margin-top: 20px;
  display: none;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.summary-spacer {
  flex: 1;
}

.export-results-btn {
  background-color: #2196F3;
  color: white;
}

.summary-content {
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.batch-result-btn-success {
  background-color: #4caf50;
  color: white;
}

.batch-result-btn-error {
  background-color: #f44336;
  color: white;
}

.batch-result-btn-warning {
  background-color: #ff9800;
  color: white;
}

.batch-result-btn-network {
  background-color: #2196F3;
  color: white;
}

.batch-result-btn-skipped {
  background-color: #ff9800;
  color: white;
}

.batch-result-btn-verified {
  background-color: #4caf50;
  color: white;
}

.batch-result-btn-unverified {
  background-color: #ff9800;
  color: white;
}

.no-recognition-message {
  padding: 10px;
  text-align: center;
  color: #666;
}

.import-content {
  padding: 20px;
}

.import-info {
  padding: 15px;
  margin-bottom: 15px;
  background: #f5f5f5;
  border-radius: 4px;
}

.import-info-header {
  margin-bottom: 10px;
}

.import-info-list {
  margin: 0;
  padding-left: 20px;
}

.import-warning {
  margin-top: 10px;
  color: #ff5722;
}

.import-progress-container {
  margin-top: 10px;
  margin-bottom: 4px;
  background: #f5f7fa;
  border-radius: 6px;
  padding: 8px;
  border: 1px solid #e1e8ed;
}

.import-remaining-time {
  margin-top: 5px;
  font-size: 12px;
  color: #666;
}

.import-failed-items {
  display: none;
  margin-top: 10px;
}

.import-complete-btn {
  display: none;
}

.batch-result-btn-exists {
  background-color: #ff9800;
  color: white;
}

.batch-result-btn-no-password {
  background-color: #f44336;
  color: white;
}

.batch-result-btn-imported {
  background-color: #4caf50;
  color: white;
}

.element-block-item-header-relative {
  position: relative;
}

.status-text {
  color: var(--status-color, #4285f4);
}

.batch-recognize-input-container {
  margin-bottom: 12px;
  position: relative;
}

.batch-recognize-textarea,
#batch-receive-textarea {
  height: 350px;
  width: 100%;
}

#batch-receive-input-container #batch-receive-textarea {
  padding-right: 40px;
}

#batch-recognize-input-container #batch-recognize-textarea {
  padding-right: 40px;
}

.batch-recognize-controls {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 12px;
}

.batch-recognize-controls-main {
  flex: 1;
}

.batch-recognize-controls-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.batch-recognize-setting-item,
.batch-receive-setting-item,
.batch-share-switch-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.batch-recognize-setting-item .label,
.batch-receive-setting-item .label,
.batch-share-switch-group .label {
  font-size: 12px;
  color: #666;
  text-align: center;
  margin: 0;
  display: block;
}

.batch-size-select,
.verify-method-select {
  width: 140px;
}

.batch-recognize-start-btn,
.batch-receive-start-btn {
  width: 100px;
  min-width: 100px;
  margin-top: 22px;
  margin-left: auto;
}

.batch-recognize-progress {
  margin-bottom: 12px;
  background: #f5f7fa;
  border-radius: 6px;
  padding: 8px;
  border: 1px solid #e1e8ed;
}

.batch-recognize-ready-message {
  text-align: center;
  color: #666;
  padding: 20px;
  font-size: 14px;
}

.batch-recognize-file-size {
  font-size: 12px;
  color: #666;
  margin-right: 8px;
  flex-shrink: 0;
}

.batch-recognize-file-name,
.batch-receive-file-name {
  font-weight: 500;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}

.batch-size-input {
  width: 80px;
  text-align: center;
}

.verify-method-select {
  text-align: center;
}

.batch-recognize-back-btn {
  display: none;
}

.batch-recognize-progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.batch-recognize-progress-btn {
  display: none;
  margin: 0;
  width: 100px;
  min-width: 100px;
}

.batch-recognize-progress-bar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.batch-recognize-export-btn {
  display: none;
}

.batch-result-item-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.batch-result-item-title > div {
  display: flex;
  align-items: center;
  min-width: 0;
}

.batch-result-item-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.batch-result-item-actions .storage-item-btn {
  width: auto;
  min-width: fit-content;
}

.batch-result-item-details {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.batch-result-link {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #2196f3;
  cursor: pointer;
  transition: color 0.2s ease;
}

.batch-result-link:hover {
  color: #4caf50;
}

.batch-result-status {
  font-size: 12px;
  flex-shrink: 0;
  margin-left: 8px;
  padding: 2px 6px;
  border-radius: 3px;
}

.batch-result-status.success {
  background: #e8f5e8;
  color: #2e7d32;
}

.batch-result-status.warning {
  background: #fff3e0;
  color: #ef6c00;
}

.batch-result-status.error {
  background: #ffebee;
  color: #c62828;
}



.batch-recognize-file-name,
.batch-receive-file-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.batch-recognize-progress-status {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  margin-right: 16px;
  background: #f8f9fa;
  border-radius: 6px;
  padding: 4px 10px;
  border: 1px solid #e9ecef;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.batch-recognize-progress-status .status-label {
  color: #6c757d;
  font-weight: 500;
}

.batch-recognize-progress-status .status-separator {
  color: #dee2e6;
  margin: 0 6px;
  font-weight: bold;
}

.batch-recognize-progress-status .status-progress {
  color: #007bff;
  font-weight: 500;
}

.batch-recognize-progress-status .status-success {
  color: #28a745;
  font-weight: 500;
}

.batch-recognize-progress-status .status-failed {
  color: #dc3545;
  font-weight: 500;
}

.batch-recognize-progress-status .status-skipped {
  color: #ffc107;
  font-weight: 500;
}

.batch-recognize-file-size,
.batch-receive-file-size {
  background: #e3f2fd;
  color: #1976d2;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
  margin-right: 8px;
}

.batch-recognize-ready {
  text-align: center;
  color: #666;
  margin-top: 60px;
}

.batch-recognize-status-display {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  padding: 4px 10px;
  border: 1px solid #e9ecef;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.batch-recognize-status-display .status-label {
  color: #6c757d;
  font-weight: 500;
}

.batch-recognize-status-display .status-separator {
  color: #dee2e6;
  margin: 0 6px;
  font-weight: bold;
}

.batch-recognize-status-display .status-success {
  color: #28a745;
  font-weight: 500;
}

.batch-recognize-status-display .status-warning {
  color: #ffc107;
  font-weight: 500;
}

.batch-recognize-status-display .status-error {
  color: #dc3545;
  font-weight: 500;
}

.batch-mode-switch {
  display: flex;
  gap: 2px;
  margin-bottom: 16px;
  background: #f5f5f5;
  border-radius: 6px;
  padding: 2px;
}

.mode-switch-btn {
  flex: 1;
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: #666;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.mode-switch-btn.active {
  background: #fff;
  color: #333;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.mode-switch-btn:hover:not(.active) {
  background: rgba(255, 255, 255, 0.5);
  color: #333;
}

.batch-mode-content {
  display: none;
}

.batch-mode-content.active {
  display: block;
}

.batch-recognize-status {
  margin-top: 12px;
}

.batch-recognize-status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.batch-recognize-export-btn {
  display: none;
  width: 80px;
  text-align: center;
  flex: none;
}

.batch-result-link {
  color: #4285f4;
  cursor: pointer;
  margin-left: 8px;
}

.batch-result-link:hover {
  color: #4caf50;
}

.batch-result-link.copied {
  color: #4caf50;
}



.batch-receive-file-name {
  margin-right: 8px;
}

.batch-receive-ready-message {
  text-align: center;
  color: #666;
  margin-top: 60px;
}

.batch-share-flex-row {
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  flex-wrap: nowrap;
  width: 100%;
}

.batch-share-flex-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 70px;
  flex: 1;
}

.batch-share-label {
  margin-bottom: 1px;
  cursor: pointer;
  text-align: center;
}

.batch-share-input {
  width: 100%;
  min-width: 60px;
  text-align: center;
}

.batch-share-checkbox {
  width: 100%;
  height: 100%;
  opacity: 0.01;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  pointer-events: auto;
}

.batch-share-btn {
  width: auto;
  white-space: nowrap;
}

.batch-share-cancel-btn {
  display: none;
}

.batch-share-file-list {
  margin: 8px 0;
  display: none;
}

.batch-share-file-count {
  color: #666;
  font-size: 12px;
}

.batch-share-file-list-container {
  max-height: 290px;
  overflow-y: auto;
  transition: max-height 0.3s ease;
}



#batch-receive-input-container {
  margin-bottom: 12px;
  position: relative;
}

.batch-receive-controls {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 12px;
}

.batch-receive-controls-main {
  flex: 1;
}

.batch-receive-controls-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.batch-receive-cid-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

#batch-receive-cid {
  width: 120px;
  text-align: center;
}

#batch-receive-cid-select {
  width: auto;
}

#batch-receive-progress {
  display: none;
  margin-bottom: 8px;
}

#batch-receive-progress-bar {
  width: 0%;
}

#batch-receive-status {
  display: none;
}

.batch-receive-status-header {
  display: flex;
  align-items: center;
}

#batch-receive-export-btn {
  display: none;
  margin-left: auto;
}

#batch-receive-back-btn {
  display: none;
}

.batch-result-item-btn {
  flex-shrink: 0;
  white-space: nowrap;
}

.batch-share-file-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #eee;
  background: #fff;
}

.batch-share-file-item:last-child {
  border-bottom: none;
}

.batch-share-file-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  flex-shrink: 0;
  white-space: nowrap;
  object-fit: contain;
  object-position: center;
}

.batch-share-file-info {
  flex: 1;
  min-width: 0;
}

.batch-share-file-name {
  font-weight: bold;
  color: #4285f4;
  word-break: break-word;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.batch-share-actions-container {
  display: flex;
  gap: 4px;
  margin-left: auto;
}

.batch-share-action-btn {
  width: auto;
  min-width: fit-content;
}

.batch-share-status-success {
  margin-left: auto;
  font-size: 12px;
}

.batch-share-status-text {
  --status-color: #4285f4;
  color: var(--status-color);
}

.batch-share-details-container {
  display: flex;
  align-items: center;
}

.batch-share-export-btn {
  margin-left: auto;
}

.batch-share-copy-all-btn {
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.batch-share-copy-all-btn:hover {
  background: #45a049;
}

.batch-share-copy-all-btn.copied {
  background: #2196f3;
}

.batch-share-progress-actions {
  z-index: 10;
}

.batch-share-btn-disabled {
  opacity: 0.5 !important;
  cursor: not-allowed !important;
}

.batch-share-btn-enabled {
  opacity: 1 !important;
  cursor: text !important;
}

.batch-share-progress-hidden {
  display: none !important;
}

.batch-share-progress-visible {
  display: block !important;
}

.batch-share-btn-hidden {
  display: none !important;
}

.batch-share-btn-visible {
  display: inline-block !important;
}

.batch-share-flex-row-maximized {
  width: 100% !important;
}

.batch-share-file-list-maximized {
  max-height: calc(100vh - 400px) !important;
  height: calc(100vh - 400px) !important;
}

.batch-share-file-list-normal {
  max-height: 290px !important;
  height: auto !important;
}

.batch-share-file-status {
  margin-left: 8px;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 500;
}

.batch-share-file-status.pending {
  background: #f5f5f5;
  color: #666;
}

.batch-share-file-status.processing {
  background: #e3f2fd;
  color: #1976d2;
}

.batch-share-file-status.success {
  background: #e8f5e8;
  color: #2e7d32;
}

.batch-share-file-status.error {
  background: #ffebee;
  color: #c62828;
}

.batch-share-file-status.skipped {
  background: #fff3e0;
  color: #ef6c00;
}

.batch-share-result-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #eee;
  background: #fff;
}

.batch-share-result-item:last-child {
  border-bottom: none;
}

.batch-share-result-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  flex-shrink: 0;
}

.batch-share-result-info {
  flex: 1;
  min-width: 0;
}

.batch-share-result-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.batch-share-result-details {
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
}

.batch-share-result-link {
  font-size: 12px;
  color: #4285f4;
  word-break: break-all;
  cursor: pointer;
}

.batch-share-result-link:hover {
  color: #4caf50;
}

.batch-share-result-actions {
  margin-left: 8px;
  display: flex;
  gap: 4px;
}

.batch-share-result-btn {
  padding: 2px 6px;
  background: rgba(0,0,0,0.05);
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 11px;
  white-space: nowrap;
}

.batch-share-result-btn:hover {
  background: rgba(0,0,0,0.1);
}

.batch-share-result-btn.copy-btn {
  background-color: rgba(66,133,244,0.1);
  color: #4285f4;
}

.batch-share-result-btn.copy-btn:hover {
  background-color: rgba(66,133,244,0.2);
}

.batch-share-result-btn.open-btn {
  background-color: rgba(76,175,80,0.1);
  color: #4caf50;
}

.batch-share-result-btn.open-btn:hover {
  background-color: rgba(76,175,80,0.2);
}

.batch-share-switches-container {
  display: flex;
  gap: 16px;
  align-items: center;
}

.batch-share-buttons-container {
  display: flex;
  gap: 4px;
  align-items: center;
  margin-top: 12px;
}

.batch-share-file-list-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 4px;
  gap: 8px;
}

.storage-item-title,
.batch-share-file-list-title {
  font-weight: bold;
  color: #4285f4;
}

.batch-share-status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 10px;
  line-height: 10px;
}

.network-disconnect-warning {
  color: #F44336;
  margin-top: 5px;
}

.virtual-scroll-item {
  position: absolute;
  width: 100%;
  height: 99px;
  box-sizing: border-box;
}

.batch-share-error-icon {
  color: #f44336;
  width: 16px;
  height: 16px;
  display: inline-block;
}

.batch-share-error-msg {
  color: #f44336;
  font-size: 11px;
}

.batch-share-file-type {
  display: inline-block;
  padding: 2px 6px;
  background: #333333;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 8px;
  font-family: normal;
  white-space: nowrap;
}

.batch-share-processing-icon {
  color: #ff9800;
  width: 16px;
  height: 16px;
  display: inline-block;
}



.element-block-switch-clickable {
  cursor: pointer;
}

.element-block-switch input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
  z-index: 1;
}

.element-block-switch .element-block-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
  z-index: 0;
}

.network-reconnect-message {
  color: #4CAF50;
  margin-top: 5px;
}

.batch-input-textarea {
  height: 200px;
}

.batch-share-layout-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.batch-share-status-preparing {
  color: #ffa726;
  font-size: 12px;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z' fill='%23ffa726'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: left center;
  background-size: 12px;
  padding-left: 16px;
  display: inline-block;
  font-weight: bold;
  text-align: center;
}

`;

document.head.appendChild(style);
(function() {
    'use strict';

    window.addEventListener('online', () => {
        if (statusDiv) {
            statusDiv.innerHTML += '<div class="network-reconnect-message">网络连接已恢复</div>';
        }
    });

    document.addEventListener('keydown', (e) => {
        const dedupeTabContent = document.querySelector('.storage-tab-content[data-tab-content="dedupe"]');
        if (!dedupeTabContent || !dedupeTabContent.classList.contains('active')) return;

        if (e.ctrlKey && e.key === 'a') {
            e.preventDefault();
            dedupeSelectedItems.clear();
            for (const key of dedupeCurrentPageItems) {
                dedupeSelectedItems.add(key);
            }
            dedupeLastListRef = null;
            dedupeLastIndex = -1;
            updateDedupeItemSelection();
        } else if (e.key === 'Escape') {
            dedupeSelectedItems.clear();
            dedupeLastListRef = null;
            dedupeLastIndex = -1;
            updateDedupeItemSelection();
        }
    });

    window.addEventListener('offline', () => {
        if (statusDiv) {
            statusDiv.innerHTML += '<div class="network-disconnect-warning">网络连接已断开，验证可能失败</div>';
        }

        if (isRunning && !isPaused) {
            togglePauseResume();
        }
    });

    function shouldInjectButton() {
        const html115 = document.querySelector('html.layout-frame.bd-core.layout-allscreen');
        if (html115 && html115.querySelector('head meta[charset="UTF-8"]')) {
            return true;
        }

        const html115cdn = document.querySelector('html.layout-frame');
        if (html115cdn && html115cdn.querySelector('head meta[charset="UTF-8"]')) {
            return true;
        }

        const html115cdnAlt = document.querySelector('html');
        if (html115cdnAlt && html115cdnAlt.querySelector('head meta[charset="UTF-8"]') &&
            html115cdnAlt.querySelector('head meta[name="viewport"][content*="viewport-fit=cover"]')) {
            return true;
        }

        return false;
    }

    if (!shouldInjectButton()) {
        return;
    }

    const DEFAULT_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let allChars = DEFAULT_CHARS;
    let shareInfo = {
        shareCode: '',
        userId: '',
        face: '',
        isAccessible: false,
        shareTitle: '',
        expireTime: -1,
        fileSize: 0,
        autoRenewal: '0'
    };

    let selectedItems = new Set();
    let lastSelectedIndex = -1;
    let isMultiSelectMode = false;
    let dedupeSelectedItems = new Set();
    let dedupeLastListRef = null;
    let dedupeLastIndex = -1;
    let dedupeCurrentPageItems = [];
    const dedupeKeyMap = new Map();

    const elementBlockItems = [
        { selector: '.ceiling-feature#js_common_act-enter', name: '顶部活动广告', enabled: true, category: '通用' },
        { selector: '.ceiling-link-temp', name: '顶部净网2025', enabled: true, category: '通用' },
        { selector: '.feature-float#js_common_mini-dialog', name: '右下角浮动广告', enabled: true, category: '通用' },
        { selector: '.sharing-banner#js_common_sharing_banner2', name: '分享页横幅广告', enabled: true, category: '分享页' },
        { selector: '.sharing-banner#js_common_sharing_banner', name: '横幅广告', enabled: true, category: '分享页' },
        { selector: '.promptbar-caution', name: '底部警告提示栏', enabled: true, category: '分享页' },
        { selector: 'li:has(.ibc-notice)', name: '我聊', enabled: false, category: '导航' },
        { selector: 'li:has(.ibc-service)', name: '帮助', enabled: true, category: '导航' },
        { selector: 'li:has(.ibc-app)', name: '客户端下载', enabled: true, category: '导航' },
        { selector: '.ceiling-vip-door', name: '购买VIP', enabled: true, category: '导航' }
    ];

    function initElementBlockSettings() {
        const savedSettings = GM_getValue('elementBlockSettings');
        if (savedSettings) {
            try {
                const parsedSettings = JSON.parse(savedSettings);
                parsedSettings.forEach(savedItem => {
                    const item = elementBlockItems.find(i => i.selector === savedItem.selector);
                    if (item) item.enabled = savedItem.enabled;
                });
            } catch (e) {
                console.error('解析元素屏蔽设置失败:', e);
            }
        }
    }

    function saveElementBlockSettings() {
        GM_setValue('elementBlockSettings', JSON.stringify(elementBlockItems));
    }

    function executeElementBlock() {
        elementBlockItems.forEach(item => {
            if (item.enabled) {
                document.querySelectorAll(item.selector).forEach(el => el.remove());
            }
        });
    }

    function formatFileSize(bytes) {
        if (bytes === 0 || bytes === undefined) return '0B';
        const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
        const digitGroups = Math.floor(Math.log10(bytes) / Math.log10(1024));
        const size = bytes / Math.pow(1024, digitGroups);
        if (digitGroups >= 4) {
            return size.toFixed(2) + units[digitGroups];
        } else if (digitGroups >= 2) {
            return size.toFixed(2) + units[digitGroups];
        } else {
            return Math.round(size) + units[digitGroups];
        }
    }

    const floatingBtn = document.createElement('div');
    floatingBtn.className = 'btn';
    floatingBtn.innerHTML = `<div class="gear-icon"></div>`;
    document.body.appendChild(floatingBtn);

    const badge = document.createElement('span');
    badge.className = 'floating-badge';
    badge.style.cssText = 'position:absolute;top:-6px;right:-6px;min-width:18px;height:18px;background:#4285f4;color:#fff;border-radius:9px;font-size:12px;line-height:18px;text-align:center;display:none;z-index:10001;padding:0 4px;pointer-events:none;box-shadow:0 1px 4px rgba(0,0,0,0.15);font-weight:bold;';
    floatingBtn.style.position = 'fixed';
    floatingBtn.appendChild(badge);

    function updateFloatingBadgeAndGear() {
        let count = 0;
        try {
            const iframe = document.querySelector('iframe');
            const iframeWindow = iframe?.contentWindow || unsafeWindow;
            const selectDOM = iframeWindow?.document?.querySelectorAll('div.list-contents > ul li.selected');
            count = selectDOM ? selectDOM.length : 0;
        } catch(e) { count = 0; }
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'block';
            floatingBtn.querySelector('.gear-icon').classList.add('active');
        } else {
            badge.style.display = 'none';
            floatingBtn.querySelector('.gear-icon').classList.remove('active');
        }
    }
    setInterval(updateFloatingBadgeAndGear, 500);

    floatingBtn.addEventListener('click', (e) => {
        if (e.defaultPrevented || e.target !== floatingBtn) return;
        let count = 0;
        try {
            const iframe = document.querySelector('iframe');
            const iframeWindow = iframe?.contentWindow || unsafeWindow;
            const selectDOM = iframeWindow?.document?.querySelectorAll('div.list-contents > ul li.selected');
            count = selectDOM ? selectDOM.length : 0;
        } catch(e) { count = 0; }
        if (count > 0) {
            openWindowAndActivate('batchshare');
        } else {
            openWindowAndActivate('storage');
        }
    });

    const windowElement = document.createElement('div');
    windowElement.className = 'window';
    windowElement.style.position = 'fixed';
    windowElement.style.left = '0px';
    windowElement.style.top = '0px';
    windowElement.style.transform = 'none';
    windowElement.innerHTML = `
<div class="window-header">
<h3 class="window-title">访问码验证助手<span class="pro-tag" title="双击编辑">GreasyFork：wangzijian0@vip.qq.com</span><input type="text" class="pro-tag-input" value="GreasyFork：wangzijian0@vip.qq.com" maxlength="50"></h3>
<div class="status-tag-container"></div>
<button class="window-maximize"></button>
<button class="window-close" title="关闭"></button>
</div>
<div class="storage-tabs">
        <div class="storage-tab active" data-tab="storage">存储管理</div>
        <div class="storage-tab" data-tab="dedupe">内容查重</div>
        <div class="storage-tab" data-tab="batchreceive">批量接收</div>
        <div class="storage-tab" data-tab="batchrecognize">批量识别</div>
        <div class="storage-tab" data-tab="batchshare">批量分享</div>
        <div class="storage-tab" data-tab="verify">验证访问码</div>
        <div class="storage-tab" data-tab="elementblock">元素屏蔽</div>
        <div class="storage-tab" data-tab="settings">附加功能</div>
</div>
<div class="storage-tab-content active" data-tab-content="storage">
<div class="storage-search">
<select class="storage-search-select" id="search-type">
<option value="all">全部</option>
<option value="title">标题</option>
<option value="ed2k">ED2K</option>
<option value="magnet">磁力链</option>
<option value="shareCode">分享码</option>
<option value="password">访问码</option>
<option value="note">备注</option>
</select>
<div class="search-input-container">
<input type="text" class="storage-search-input" id="search-input" placeholder="搜索...">
<button class="search-clear-btn" id="search-clear-btn">
<div class="close-icon"></div>
</button>
</div>
</div>
<div class="filter-buttons">
<div class="filter-group">
<button class="storage-item-btn active" data-filter="all">全部</button>
<button class="storage-item-btn" data-filter="valid">有效</button>
<button class="storage-item-btn" data-filter="longterm">长期</button>
<button class="storage-item-btn" data-filter="renewal">续期</button>
<button class="storage-item-btn" data-filter="timelimited">限时</button>
<button class="storage-item-btn" data-filter="error">错误</button>
<button class="storage-item-btn" data-filter="expired">已过期</button>
<button class="storage-item-btn" data-filter="cancelled">已取消</button>
<button class="storage-item-btn ed2k-btn" data-filter="ed2k">ED2K</button>
<button class="storage-item-btn magnet-btn" data-filter="magnet">磁力链</button>
</div>
<div class="action-group">
<button class="storage-item-btn delete-error-btn" id="delete-error-btn">删除错误</button>
<button class="storage-item-btn delete-expired-btn" id="delete-expired-btn">删除过期</button>
<button class="storage-item-btn delete-invalid-btn" id="delete-invalid-btn">删除无效</button>
<button class="storage-item-btn api-refresh-btn fetch-btn" id="api-refresh-btn" title="API刷新">
<div class="refresh-icon"></div>
<span class="api-refresh-badge">0</span>
</button>
<button class="storage-item-btn refresh-btn" title="刷新所有时间和信息">
<div class="refresh-icon"></div>
</button>
</div>
</div>
<div class="sort-buttons">
<button class="storage-item-btn" data-sort="time-desc">最近添加</button>
<button class="storage-item-btn" data-sort="time-asc">最早添加</button>
<button class="storage-item-btn" data-sort="name-asc">名称A-Z</button>
<button class="storage-item-btn" data-sort="name-desc">名称Z-A</button>
<button class="storage-item-btn" data-sort="size-desc">大小降序</button>
<button class="storage-item-btn" data-sort="size-asc">大小升序</button>
  <div class="batch-actions-container">
  <span class="selected-count">已选 0 项</span>
  <button class="selected-help-btn" title="多选与快捷键说明" aria-label="选择帮助" style="display: inline-flex;">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="white"/>
      <line x1="12" y1="7" x2="12" y2="13" stroke="currentColor" stroke-width="2"/>
      <circle cx="12" cy="17" r="1.6" fill="currentColor"/>
    </svg>
  </button>
  <div class="multi-select-hint">
    <div style="font-weight:600;margin-bottom:6px;">多选与快捷键</div>
    <ul style="margin:0;padding-left:18px;">
      <li>Ctrl+左键：添加/取消单项选择</li>
      <li>Shift+左键：选择范围（与上次选中形成区间）</li>
      <li>Ctrl+A：全选</li>
      <li>点击空白处或取消按钮清空选择</li>
    </ul>
  </div>
  <button class="storage-item-btn copy-btn">复制</button>
  <button class="storage-item-btn delete-btn">删除</button>
  <button class="storage-item-btn cancel-btn">取消</button>
  </div>
</div>
<div class="storage-container" id="storage-container">
<div class="storage-scroll-content" id="storage-scroll-content"></div>
<div class="storage-empty" id="storage-empty">暂无存储数据</div>
</div>

<div class="storage-import-export">
<button class="storage-import-export-btn" id="export-btn">导出数据</button>
<button class="storage-import-export-btn" id="import-btn">导入数据<span class="import-badge">0</span></button>
<button class="storage-import-export-btn extract-btn" id="extract-btn"><div class="internet-icon"></div>导入分享<span class="extract-badge">0</span></button>
<button class="storage-import-export-btn" id="clear-btn">清空数据</button>
</div>
</div>
<div class="storage-tab-content" data-tab-content="verify">
<div class="share-details">正在获取分享信息...</div>
<div class="settings-content">
<div class="form-row">
<div class="form-group">
<label class="label">自定义字符集</label>
<input type="text" class="input chars-input" value="${DEFAULT_CHARS}">
<div class="error chars-error"></div>
</div>
<div class="form-group">
<label class="label">验证策略</label>
<select class="input batch-share-input strategy-select">
<option value="random">随机模式</option>
<option value="sequential">顺序模式</option>
<option value="random-digits">随机数字模式</option>
<option value="sequential-digits">顺序数字模式</option>
</select>
</div>
<div class="concurrent-group">
<label class="concurrent-label">并发数量</label>
<input type="number" min="1" max="10000" value="10" class="input concurrent-input">
</div>
</div>
<div class="btn-group">
<button class="btn-primary pause-resume-btn">开始验证</button>
<button class="btn-primary stop-btn stop">停止验证</button>
</div>
<div class="stats stats-info"></div>
<div class="status status-div"></div>
</div>
</div>
<div class="storage-tab-content" data-tab-content="elementblock">
<div class="element-block-container" id="element-block-container"></div>
</div>
<div class="storage-tab-content" data-tab-content="settings">
  <div class="settings-block-container" id="settings-block-container"></div>
</div>
<div class="storage-tab-content" data-tab-content="batchreceive">
  <div class="batch-receive-container" id="batch-receive-container"></div>
</div>
<div class="storage-tab-content" data-tab-content="batchrecognize">
  <div class="batch-recognize-container" id="batch-recognize-container"></div>
</div>
<div class="storage-tab-content" data-tab-content="batchshare">
  <div class="batch-share-container" id="batch-share-container"></div>
</div>
<div class="storage-tab-content" data-tab-content="dedupe">
  <div class="dedupe-container" id="dedupe-container"></div>
</div>
`;

    document.body.appendChild(windowElement);

    function openWindowAndActivate(tabName) {
        try { windowElement.style.display = 'block'; } catch (e) {}
        document.querySelectorAll('.storage-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.storage-tab-content').forEach(tab => tab.classList.remove('active'));
        const tabEl = document.querySelector(`.storage-tab[data-tab="${tabName}"]`);
        const contentEl = document.querySelector(`.storage-tab-content[data-tab-content="${tabName}"]`);
        if (tabEl && contentEl) {
            tabEl.classList.add('active');
            contentEl.classList.add('active');
            if (tabName === 'batchshare' && typeof renderBatchSharePage === 'function') {
                renderBatchSharePage();
            }
        }
    }

    const charsInput = windowElement.querySelector('.chars-input');
    const charsError = windowElement.querySelector('.chars-error');
    const strategySelect = windowElement.querySelector('.strategy-select');
    const concurrentInput = windowElement.querySelector('.concurrent-input');
    const pauseResumeBtn = windowElement.querySelector('.pause-resume-btn');
    const stopBtn = windowElement.querySelector('.stop-btn');
    const statusDiv = windowElement.querySelector('.status-div');
    const statsInfo = windowElement.querySelector('.stats-info');
    const shareDetails = windowElement.querySelector('.share-details');
    const storageContainer = windowElement.querySelector('#storage-container');
    const storageScrollContent = windowElement.querySelector('#storage-scroll-content');
    const storageEmpty = windowElement.querySelector('#storage-empty');
    const exportBtn = windowElement.querySelector('#export-btn');
    const importBtn = windowElement.querySelector('#import-btn');
    const extractBtn = windowElement.querySelector('#extract-btn');
    const clearBtn = windowElement.querySelector('#clear-btn');
    const tabContents = windowElement.querySelectorAll('.storage-tab-content');
    const tabs = windowElement.querySelectorAll('.storage-tab');
    const statusTagContainer = windowElement.querySelector('.status-tag-container');
    const elementBlockContainer = windowElement.querySelector('#element-block-container');
    const searchInput = windowElement.querySelector('#search-input');
    const searchType = windowElement.querySelector('#search-type');
    const apiRefreshBtn = windowElement.querySelector('#api-refresh-btn');
    const apiRefreshBadge = windowElement.querySelector('.api-refresh-badge');
    const refreshBtn = windowElement.querySelector('.refresh-btn');
    const filterButtons = windowElement.querySelectorAll('.filter-buttons button[data-filter]');
    let apiRefreshRunning = false;
    let apiRefreshCancelled = false;
    const deleteExpiredBtn = windowElement.querySelector('#delete-expired-btn');
    const deleteInvalidBtn = windowElement.querySelector('#delete-invalid-btn');
    const sortButtons = windowElement.querySelectorAll('.sort-buttons .storage-item-btn');
    const settingsBlockContainer = windowElement.querySelector('#settings-block-container');
    const batchReceiveContainer = windowElement.querySelector('#batch-receive-container');
    const batchShareContainer = windowElement.querySelector('#batch-share-container');
    const batchRecognizeContainer = windowElement.querySelector('#batch-recognize-container');
    const dedupeContainer = windowElement.querySelector('#dedupe-container');

    let currentSearchTerm = '';
    let currentSearchType = 'all';
    let currentFilterType = 'all';
    let currentSortType = 'time-desc';
    let filteredItems = [];
    let allItems = [];
    let itemHeight = 99;
    let visibleItemCount = 10;
    let dedupeMode = (function(){ try { return GM_getValue('dedupeMode', 'size+title'); } catch(_) { return 'size+title'; } })();
    let dedupeGroups = [];
    let dedupePage = 1;
    const DEDUPE_PAGE_SIZE = 1;

    function getDedupeKey(item) {
        const size = Number(item.fileSize || 0);
        if (!size || size <= 0) return null;
        if (dedupeMode === 'size') return `size:${size}`;
        const title = (item.shareTitle || '').trim().toLowerCase();
        if (!title) return null;
        return `size:${size}|title:${title}`;
    }

    function rebuildDedupeGroups() {
        try {
            const items = getAllStorageItems();
            const map = new Map();
            for (const item of items) {
                const key = getDedupeKey(item);
                if (!key) continue;
                if (!map.has(key)) {
                    map.set(key, {
                        key,
                        size: Number(item.fileSize || 0),
                        title: item.shareTitle || '',
                        items: []
                    });
                }
                map.get(key).items.push(item);
            }
            dedupeGroups = Array.from(map.values()).filter(g => g.items.length >= 2);
            dedupeGroups.sort((a, b) => {
                const byCount = b.items.length - a.items.length;
                if (byCount !== 0) return byCount;
                const bySize = (b.size || 0) - (a.size || 0);
                if (bySize !== 0) return bySize;
                return (a.title || '').localeCompare(b.title || '');
            });
        } catch (e) {
            console.error('重建查重分组失败:', e);
            dedupeGroups = [];
        }
    }

    function bindDedupeItemActions(itemElement, item) {
        const copyBtn = itemElement.querySelector('.copy-btn');
        const deleteBtn = itemElement.querySelector('.delete-btn');
        const openBtn = itemElement.querySelector('.open-btn');

        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const enableMagnetTitleCopy = GM_getValue('enableMagnetTitleCopy', false);
                if (item.magnet) {
                    let magnetToCopy;
                    if (enableMagnetTitleCopy && (item.shareTitle || item.note)) {
                        const title = item.shareTitle || item.note;
                        magnetToCopy = `${title}\n${item.magnet}`;
                    } else {
                        magnetToCopy = item.magnet;
                        if (!item.magnet.includes('?name=') && (item.shareTitle || item.note)) {
                            const title = item.shareTitle || item.note;
                            magnetToCopy = `${item.magnet}?name=${title}`;
                        }
                    }
                    navigator.clipboard.writeText(magnetToCopy).then(() => handleCopyButtonStatus(copyBtn)).catch(() => {});
                } else if (item.ed2k) {
                    const text = `${item.shareTitle || '无标题'}\n${item.ed2k}`;
                    navigator.clipboard.writeText(text).then(() => handleCopyButtonStatus(copyBtn)).catch(() => {});
                } else {
                    const title = item.shareTitle || '无标题';
                    const link = `https://115cdn.com/s/${item.shareCode}${item.password ? `?password=${item.password}` : ''}`;
                    const enableShareTitleCopy = GM_getValue('enableShareTitleCopy', false);
                    let text;
                    if (enableShareTitleCopy && title) {
                        text = `${title}\n${link}`;
                    } else {
                        text = `${link}#\n${title}`;
                    }
                    navigator.clipboard.writeText(text).then(() => handleCopyButtonStatus(copyBtn)).catch(() => {});
                }
            });
        }

        if (openBtn) {
            openBtn.addEventListener('click', () => {
                if (item.magnet) {
                    navigator.clipboard.writeText(item.magnet).then(() => handleCopyButtonStatus(openBtn)).catch(() => {});
                } else if (item.ed2k) {
                    navigator.clipboard.writeText(item.ed2k).then(() => handleCopyButtonStatus(openBtn)).catch(() => {});
                } else {
                    window.open(`https://115cdn.com/s/${item.shareCode}${item.password ? `?password=${item.password}` : ''}`, '_blank');
                }
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                const enableDeleteConfirm = GM_getValue('enableDeleteConfirm', true);
                if (!enableDeleteConfirm || confirm('确定要删除该条目吗？')) {
                    GM_deleteValue(generateStorageKey(item.shareCode, item.ed2k, item.magnet));
                    rebuildDedupeGroups();
                    renderDedupePage();
                }
            });
        }
    }

    function renderDedupePage() {
        if (!dedupeContainer) return;
        if (!Array.isArray(dedupeGroups) || dedupeGroups.length === 0) {
            rebuildDedupeGroups();
        }

        dedupeContainer.innerHTML = '';

        const sizeDisplayMode = (function(){
            try { return GM_getValue('dedupeSizeDisplay', 'auto'); } catch(_) { return 'auto'; }
        })();
        const sizeToText = (bytes) => {
            const v = Number(bytes || 0);
            if (sizeDisplayMode === 'bytes') return `${v.toLocaleString()} B`;
            return formatFileSize(v);
        };

        const sortOrder = (function(){
            try { return GM_getValue('dedupeSortOrder', 'desc'); } catch(_) { return 'desc'; }
        })();

        const controls = document.createElement('div');
        controls.className = 'dedupe-controls';
        controls.style.display = 'flex';
        controls.style.alignItems = 'center';
        controls.style.gap = '8px';
        controls.style.margin = '8px 0';
        controls.innerHTML = `
            <div class="chip-muted" style="display:flex;align-items:center;gap:8px;width:100%;">
              <label>模式：</label>
              <select id="dedupe-mode-select" class="storage-search-select">
                  <option value="size">大小模式</option>
                  <option value="size+title">大小标题</option>
              </select>
              <label style="margin-left:8px;">单位：</label>
              <select id="dedupe-size-display" class="storage-search-select">
                  <option value="auto">自动</option>
                  <option value="bytes">字节(B)</option>
              </select>
              <label style="margin-left:8px;">排序：</label>
              <select id="dedupe-sort-order" class="storage-search-select">
                <option value="asc">升序</option>
                <option value="desc">降序</option>
              </select>
              <button id="dedupe-scan-btn" class="storage-item-btn" style="margin-left:8px;" title="查重" aria-label="查重">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                  <!-- Rotating arc segment (under the lens outline) -->
                  <g class="sweep" opacity="0.6">
                    <!-- Use dash to render a single arc and rotate the group -->
                    <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" pathLength="100" stroke-dasharray="14 86" />
                  </g>
                  <!-- Lens outline -->
                  <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" fill="none" />
                  <!-- Handle -->
                  <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </button>
              <div class="batch-actions-container" style="margin-left:auto;">
                <span class="selected-count">已选 0 项</span>
                <button class="selected-help-btn" title="多选与快捷键说明" aria-label="选择帮助">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="white"/>
                    <line x1="12" y1="7" x2="12" y2="13" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="17" r="1.6" fill="currentColor"/>
                  </svg>
                </button>
                <div class="multi-select-hint">
                  <div style="font-weight:600;margin-bottom:6px;">多选与快捷键</div>
                  <ul style="margin:0;padding-left:18px;">
                    <li>Ctrl+左键：添加/取消单项选择</li>
                    <li>Shift+左键：选择范围（与上次选中形成区间）</li>
                    <li>Ctrl+A：全选</li>
                    <li>点击空白处或取消按钮清空选择</li>
                  </ul>
                </div>
                <button class="storage-item-btn delete-btn">删除</button>
              </div>
            </div>
        `;
        dedupeContainer.appendChild(controls);

        const modeSelect = controls.querySelector('#dedupe-mode-select');
        if (dedupeMode !== 'size' && dedupeMode !== 'size+title') dedupeMode = 'size';
        modeSelect.value = dedupeMode;
        modeSelect.addEventListener('change', () => {
            dedupeMode = modeSelect.value;
            try { GM_setValue('dedupeMode', dedupeMode); } catch (_) {}
            dedupePage = 1;
            rebuildDedupeGroups();
            renderDedupePage();
        });

        const sizeSelect = controls.querySelector('#dedupe-size-display');
        if (sizeSelect) {
            sizeSelect.value = sizeDisplayMode;
            sizeSelect.addEventListener('change', () => {
                try { GM_setValue('dedupeSizeDisplay', sizeSelect.value); } catch(_) {}
                renderDedupePage();
            });
        }

        const sortSelect = controls.querySelector('#dedupe-sort-order');
        if (sortSelect) {
            sortSelect.value = sortOrder;
            sortSelect.addEventListener('change', () => {
                try { GM_setValue('dedupeSortOrder', sortSelect.value); } catch(_) {}
                dedupePage = 1;
                renderDedupePage();
            });
        }

        const scanBtn = controls.querySelector('#dedupe-scan-btn');
        if (scanBtn && !scanBtn._bound) {
            scanBtn.addEventListener('click', () => {
                scanBtn.disabled = true;
                scanBtn.style.pointerEvents = 'none';
                scanBtn.setAttribute('aria-busy', 'true');
                scanBtn.classList.add('scanning');
                setTimeout(() => {
                    rebuildDedupeGroups();
                    dedupePage = 1;
                    renderDedupePage();
                }, 800);
            });
            scanBtn._bound = true;
        }
        const statsText = (() => {
            let totalDupItems = 0;
            for (const g of dedupeGroups) totalDupItems += g.items.length;
            return `查重结果：${dedupeGroups.length} 组，共 ${totalDupItems} 项（每组≥2）`;
        })();
        const dedupeBatchContainer = controls.querySelector('.batch-actions-container');
        if (dedupeBatchContainer && !dedupeBatchContainer._bound) {
            const deleteBtn = dedupeBatchContainer.querySelector('.delete-btn');
            if (deleteBtn) deleteBtn.addEventListener('click', (e) => { e.stopPropagation(); batchDeleteSelectedDedupe(); });
            dedupeBatchContainer._bound = true;
        }
        try { updateBatchActions(); } catch (_) {}

        const sortedGroups = (() => {
            const arr = dedupeGroups.slice();
            arr.sort((a, b) => {
                let cmp = 0;
                if (a.size !== b.size) cmp = a.size - b.size;
                else if (dedupeMode === 'size+title') cmp = (a.title || '').localeCompare(b.title || '');
                return sortOrder === 'asc' ? cmp : -cmp;
            });
            return arr;
        })();

        const totalPages = Math.max(1, Math.ceil(sortedGroups.length / DEDUPE_PAGE_SIZE));
        if (dedupePage < 1) dedupePage = 1;
        if (dedupePage > totalPages) dedupePage = totalPages;
        const pagerTop = document.createElement('div');
        pagerTop.className = 'dedupe-pagination';
        pagerTop.style.display = 'flex';
        pagerTop.style.alignItems = 'center';
        pagerTop.style.gap = '8px';
        pagerTop.style.margin = '10px 0';
        pagerTop.style.justifyContent = 'space-between';
        pagerTop.style.width = '100%';
        pagerTop.innerHTML = `
            <div class="pager-left">
              <button class="storage-item-btn dedupe-prev" ${dedupePage <= 1 ? 'disabled' : ''}>上页</button>
              <span>第 </span>
              <input type="number" id="dedupe-page-input" class="storage-search-select" min="1" max="${totalPages}" value="${dedupePage}" style="width:64px;margin:0 4px;" />
              <span>/ ${totalPages} 页</span>
              <button class="storage-item-btn dedupe-next" ${dedupePage >= totalPages ? 'disabled' : ''}>下页</button>
              <span class="dedupe-stats chip-muted" style="margin-left:8px;"></span>
            </div>
        `;
        const prevBtnTop = pagerTop.querySelector('.dedupe-prev');
        const nextBtnTop = pagerTop.querySelector('.dedupe-next');
        const statsEl = pagerTop.querySelector('.dedupe-stats');
        if (statsEl) statsEl.textContent = statsText;
        const pageInput = pagerTop.querySelector('#dedupe-page-input');
        if (pageInput) {
            const applyPage = () => {
                const raw = parseInt(pageInput.value, 10);
                if (!Number.isFinite(raw)) { pageInput.value = String(dedupePage); return; }
                const clamped = Math.min(Math.max(raw, 1), totalPages);
                if (clamped !== dedupePage) {
                    dedupePage = clamped;
                    renderDedupePage();
                } else {
                    pageInput.value = String(dedupePage);
                }
            };
            let pageInputTimer = null;
            pageInput.addEventListener('input', () => {
                if (pageInputTimer) clearTimeout(pageInputTimer);
                pageInputTimer = setTimeout(() => {
                    pageInputTimer = null;
                    const raw = parseInt(pageInput.value, 10);
                    if (!Number.isFinite(raw)) return;
                    const clamped = Math.min(Math.max(raw, 1), totalPages);
                    if (clamped !== dedupePage) {
                        dedupePage = clamped;
                        renderDedupePage();
                    }
                }, 450);
            });
            pageInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') applyPage(); });
            pageInput.addEventListener('blur', applyPage);
        }
        prevBtnTop.addEventListener('click', () => { if (dedupePage > 1) { dedupePage--; renderDedupePage(); } });
        nextBtnTop.addEventListener('click', () => { if (dedupePage < totalPages) { dedupePage++; renderDedupePage(); } });
        dedupeContainer.appendChild(pagerTop);

        const groupsWrap = document.createElement('div');
        groupsWrap.className = 'dedupe-groups';
        dedupeContainer.appendChild(groupsWrap);

        const start = (dedupePage - 1) * DEDUPE_PAGE_SIZE;
        const end = Math.min(sortedGroups.length, start + DEDUPE_PAGE_SIZE);
        const currentGroups = sortedGroups.slice(start, end);
        dedupeCurrentPageItems = [];

        const getDedupeListMaxHeight = (el) => {
            const vh = window.innerHeight || document.documentElement.clientHeight || 800;
            if (el && el.getBoundingClientRect) {
                const rect = el.getBoundingClientRect();
                let h = Math.floor(vh - rect.top - 40);
                if (!Number.isFinite(h)) h = 396;
                return Math.max(280, h);
            }
            return Math.max(396, Math.floor(vh * 0.8));
        };
        if (dedupeContainer._dedupeResizeHandler) {
            window.removeEventListener('resize', dedupeContainer._dedupeResizeHandler);
        }
        if (dedupeContainer._resizeObserver) {
            try { dedupeContainer._resizeObserver.disconnect(); } catch(_) {}
            dedupeContainer._resizeObserver = null;
        }
        dedupeContainer._dedupeResizeHandler = () => {
            document.querySelectorAll('.dedupe-item-list').forEach(el => {
                const h = `${getDedupeListMaxHeight(el)}px`;
                el.style.maxHeight = h;
                if (typeof el._onResize === 'function') {
                    try { el._onResize(); } catch(_) {}
                }
            });
        };
        window.addEventListener('resize', dedupeContainer._dedupeResizeHandler);
        if (window.ResizeObserver && windowElement) {
            dedupeContainer._resizeObserver = new ResizeObserver(() => {
                dedupeContainer._dedupeResizeHandler();
            });
            try { dedupeContainer._resizeObserver.observe(windowElement); } catch(_) {}
        }
        try { dedupeContainer._dedupeResizeHandler(); } catch (_) {}

        if (currentGroups.length === 0) {
            const empty = document.createElement('div');
            empty.style.padding = '12px';
            empty.style.color = '#888';
            empty.textContent = '未找到查重分组，请点击“查重”。';
            groupsWrap.appendChild(empty);
        } else {
            for (const group of currentGroups) {
                try {
                    for (const it of group.items) {
                        const key = it.shareCode + (it.ed2k || '') + (it.magnet || '');
                        dedupeCurrentPageItems.push(key);
                        dedupeKeyMap.set(key, { shareCode: it.shareCode, ed2k: it.ed2k, magnet: it.magnet });
                    }
                } catch (_) {}
                const groupEl = document.createElement('div');
                groupEl.className = 'dedupe-group';
                groupEl.style.border = '1px solid #eee';
                groupEl.style.borderRadius = '6px';
                groupEl.style.margin = '8px 0';
                groupEl.style.padding = '8px';

                const sizeChipText = sizeToText(group.size);
                const titleChipText = (group.title || '无标题');
                const countChipText = `查重 ${group.items.length} 项`;

                const header = document.createElement('div');
                header.className = 'dedupe-group-header';
                header.style.display = 'flex';
                header.style.justifyContent = 'space-between';
                header.style.alignItems = 'center';
                header.style.marginBottom = '6px';
                header.innerHTML = `
                    <div class="dedupe-group-title" style="display:flex;align-items:center;gap:6px;flex-wrap:nowrap;width:100%;min-width:0;">
                      <span class="chip-muted dedupe-group-count">${countChipText}</span>
                      <span class="chip-muted dedupe-group-size">${sizeChipText}</span>
                      ${dedupeMode === 'size+title' ? `<span class="chip-muted dedupe-group-title-text" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;min-width:0;" title="${titleChipText}">${titleChipText}</span>` : ''}
                    </div>
                `;
                groupEl.appendChild(header);

                const list = document.createElement('div');
                list.className = 'dedupe-item-list';
                list.style.position = 'relative';
                list.style.overflowY = 'auto';
                list.style.maxHeight = `${getDedupeListMaxHeight(list)}px`;

                const scrollContent = document.createElement('div');
                scrollContent.style.position = 'relative';
                scrollContent.style.width = '100%';
                scrollContent.style.height = `${group.items.length * itemHeight}px`;
                list.appendChild(scrollContent);

                let gRenderStartIndex = 0;
                let gRenderEndIndex = 0;
                let gVisibleItemCount = Math.ceil((list.clientHeight || 396) / itemHeight) + 2;
                let gItemPool = [];
                const gCachedElements = new Map();
                let gLastScrollTop = -1;
                let gScrollThrottle = null;

                list._onResize = () => {
                    const newVisible = Math.ceil((list.clientHeight || 396) / itemHeight) + 2;
                    if (newVisible !== gVisibleItemCount) {
                        gVisibleItemCount = newVisible;
                        try { gRenderVisibleItems(); } catch(_) {}
                    }
                };

                function gRenderVisibleItems() {
                    const needCount = gRenderEndIndex - gRenderStartIndex;

                    while (gItemPool.length < needCount) {
                        const div = document.createElement('div');
                        div.className = 'virtual-scroll-item';
                        div.style.height = `${itemHeight}px`;
                        div.style.position = 'absolute';
                        gItemPool.push(div);
                    }

                    while (gItemPool.length > needCount + 5) {
                        const removed = gItemPool.pop();
                        if (removed && removed._itemKey) {
                            gCachedElements.delete(removed._itemKey);
                        }
                    }

                    const fragment = document.createDocumentFragment();
                    for (let i = 0; i < needCount; i++) {
                        const idx = gRenderStartIndex + i;
                        const item = group.items[idx];
                        const div = gItemPool[i];
                        if (!item) {
                            div.style.display = 'none';
                            continue;
                        }
                        div.style.display = '';
                        div.style.top = `${idx * itemHeight}px`;

                        const itemKey = item.shareCode + (item.ed2k || '') + (item.magnet || '');
                        if (!div._itemKey || div._itemKey !== itemKey) {
                            let el;
                            if (gCachedElements.has(itemKey)) {
                                el = gCachedElements.get(itemKey).cloneNode(true);
                                const cloned = el;
                                const copyBtn = cloned.querySelector('.copy-btn');
                                const openBtn = cloned.querySelector('.open-btn');
                                const deleteBtn = cloned.querySelector('.delete-btn');
                                if (copyBtn) {
                                    copyBtn.addEventListener('click', () => {
                                        const enableMagnetTitleCopy = GM_getValue('enableMagnetTitleCopy', false);
                                        if (item.magnet) {
                                            let magnetToCopy;
                                            if (enableMagnetTitleCopy && (item.shareTitle || item.note)) {
                                                const title = item.shareTitle || item.note;
                                                magnetToCopy = `${title}\n${item.magnet}`;
                                            } else {
                                                magnetToCopy = item.magnet;
                                                if (!item.magnet.includes('?name=') && (item.shareTitle || item.note)) {
                                                    const title = item.shareTitle || item.note;
                                                    magnetToCopy = `${item.magnet}?name=${title}`;
                                                }
                                            }
                                            navigator.clipboard.writeText(magnetToCopy).then(() => handleCopyButtonStatus(copyBtn)).catch(() => {});
                                        } else if (item.ed2k) {
                                            const text = `${item.shareTitle || '无标题'}\n${item.ed2k}`;
                                            navigator.clipboard.writeText(text).then(() => handleCopyButtonStatus(copyBtn)).catch(() => {});
                                        } else {
                                            const title = item.shareTitle || '无标题';
                                            const link = `https://115cdn.com/s/${item.shareCode}${item.password ? `?password=${item.password}` : ''}`;
                                            const enableShareTitleCopy = GM_getValue('enableShareTitleCopy', false);
                                            let text;
                                            if (enableShareTitleCopy && title) {
                                                text = `${title}\n${link}`;
                                            } else {
                                                text = `${link}#\n${title}`;
                                            }
                                            navigator.clipboard.writeText(text).then(() => handleCopyButtonStatus(copyBtn)).catch(() => {});
                                        }
                                    });
                                }
                                if (openBtn) {
                                    openBtn.addEventListener('click', () => {
                                        if (item.magnet) {
                                            navigator.clipboard.writeText(item.magnet).then(() => handleCopyButtonStatus(openBtn)).catch(() => {});
                                        } else if (item.ed2k) {
                                            navigator.clipboard.writeText(item.ed2k).then(() => handleCopyButtonStatus(openBtn)).catch(() => {});
                                        } else {
                                            window.open(`https://115cdn.com/s/${item.shareCode}${item.password ? `?password=${item.password}` : ''}`, '_blank');
                                        }
                                    });
                                }
                                if (deleteBtn) {
                                    deleteBtn.addEventListener('click', () => {
                                        const enableDeleteConfirm = GM_getValue('enableDeleteConfirm', true);
                                        if (!enableDeleteConfirm || confirm('确定要删除该条目吗？')) {
                                            GM_deleteValue(generateStorageKey(item.shareCode, item.ed2k, item.magnet));
                                            rebuildDedupeGroups();
                                            renderDedupePage();
                                        }
                                    });
                                }
                            } else {
                                el = createStorageItemElement(item, { bindActions: true, renderContext: 'dedupe' });
                                const template = el.cloneNode(true);
                                gCachedElements.set(itemKey, template);
                            }
                            try {
                                const sizeSpan = el.querySelector('.file-size');
                                if (sizeSpan && (item.fileSize || item.fileSize === 0)) {
                                    sizeSpan.textContent = sizeToText(item.fileSize || 0);
                                }
                            } catch (_) {}
                            try { el.dataset.key = itemKey; } catch(_) {}
                            if (dedupeSelectedItems.has(itemKey)) {
                                el.classList.add('selected');
                            } else {
                                el.classList.remove('selected');
                            }
                            el.addEventListener('click', (e) => {
                                if (e.target.closest('.storage-item-btn')) return;
                                const listRef = list;
                                if (e.shiftKey && dedupeLastListRef === listRef && dedupeLastIndex >= 0) {
                                    const start = Math.min(dedupeLastIndex, idx);
                                    const end = Math.max(dedupeLastIndex, idx);
                                    for (let k = start; k <= end; k++) {
                                        const it = group.items[k];
                                        if (!it) continue;
                                        const key = it.shareCode + (it.ed2k || '') + (it.magnet || '');
                                        dedupeSelectedItems.add(key);
                                    }
                                } else if (e.ctrlKey || e.metaKey) {
                                    if (dedupeSelectedItems.has(itemKey)) dedupeSelectedItems.delete(itemKey);
                                    else dedupeSelectedItems.add(itemKey);
                                    dedupeLastListRef = listRef;
                                    dedupeLastIndex = idx;
                                } else {
                                    dedupeSelectedItems.clear();
                                    dedupeSelectedItems.add(itemKey);
                                    dedupeLastListRef = listRef;
                                    dedupeLastIndex = idx;
                                }
                                updateDedupeItemSelection();
                            });
                            div.innerHTML = '';
                            div.appendChild(el);
                            div._itemKey = itemKey;
                        }
                        fragment.appendChild(div);
                    }
                    scrollContent.innerHTML = '';
                    scrollContent.appendChild(fragment);
                }

                function gUpdateOnResize() {
                    gVisibleItemCount = Math.ceil((list.clientHeight || 396) / itemHeight) + 2;
                    const bufferSize = Math.max(10, Math.ceil(gVisibleItemCount * 0.5));
                    const currentTop = list.scrollTop;
                    gRenderStartIndex = Math.max(0, Math.floor(currentTop / itemHeight) - bufferSize);
                    gRenderEndIndex = Math.min(group.items.length, gRenderStartIndex + gVisibleItemCount + bufferSize * 2);
                    scrollContent.style.height = `${group.items.length * itemHeight}px`;
                    gRenderVisibleItems();
                }

                function gHandleScroll() {
                    const currentTop = list.scrollTop;
                    if (Math.abs(currentTop - gLastScrollTop) < 10) return;
                    gLastScrollTop = currentTop;
                    const bufferSize = Math.max(10, Math.ceil(gVisibleItemCount * 0.5));
                    const newStart = Math.max(0, Math.floor(currentTop / itemHeight) - bufferSize);
                    const newEnd = Math.min(group.items.length, newStart + gVisibleItemCount + bufferSize * 2);
                    if (newStart !== gRenderStartIndex || newEnd !== gRenderEndIndex) {
                        gRenderStartIndex = newStart;
                        gRenderEndIndex = newEnd;
                        gRenderVisibleItems();
                    }
                }

                gUpdateOnResize();

                list.addEventListener('scroll', () => {
                    if (gScrollThrottle) return;
                    gScrollThrottle = requestAnimationFrame(() => {
                        gHandleScroll();
                        gScrollThrottle = null;
                    });
                });

                const resizeObserver = new ResizeObserver(() => gUpdateOnResize());
                resizeObserver.observe(list);
                groupEl.appendChild(list);


                groupsWrap.appendChild(groupEl);
            }
        }

        
    }

    function getLocalQuota() {
        if (typeof window.get115QuotaLocal === 'function') {
            return window.get115QuotaLocal();
        }
        try {
            const c = GM_getValue('vip_quota_cache_v1', null);
            return c && c.data ? c.data : null;
        } catch (_) { return null; }
    }
    function setLocalQuota(data) {
        if (typeof window.set115QuotaLocal === 'function') {
            window.set115QuotaLocal(data);
            return;
        }
        try { GM_setValue('vip_quota_cache_v1', { t: Date.now(), data }); } catch (_) {}
    }
    function decrementQuotaLocal() {
        const q = getLocalQuota();
        if (!q) return;
        const next = {
            surplus: Math.max(0, Number(q.surplus || 0) - 1),
            count: Number(q.count || 0),
        };
        next.used = Math.max(0, next.count - next.surplus);
        setLocalQuota(next);
        updateQuotaWidget();
    }

    const storageTabContentEl = windowElement.querySelector('.storage-tab-content[data-tab-content="storage"]');
    let quotaWidgetEl = null;
    let quotaTextEl = null;
    let quotaRefreshBtn = null;
    function ensureQuotaWidget() {
        if (!storageTabContentEl) return;
        if (!quotaWidgetEl) {
            storageTabContentEl.style.position = storageTabContentEl.style.position || 'relative';
            quotaWidgetEl = document.createElement('div');
            quotaWidgetEl.id = 'offline-quota-widget';
            quotaWidgetEl.style.position = 'absolute';
            quotaWidgetEl.style.right = '12px';
            quotaWidgetEl.style.bottom = '12px';
            quotaWidgetEl.style.zIndex = '5';
            quotaWidgetEl.style.display = 'inline-flex';
            quotaWidgetEl.style.alignItems = 'center';
            quotaWidgetEl.style.gap = '8px';
            quotaWidgetEl.style.padding = '6px 10px';
            quotaWidgetEl.style.background = 'rgba(255,255,255,0.9)';
            quotaWidgetEl.style.backdropFilter = 'blur(2px)';
            quotaWidgetEl.style.border = '1px solid #e6e6e6';
            quotaWidgetEl.style.borderRadius = '8px';
            quotaWidgetEl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            quotaWidgetEl.style.fontSize = '12px';

            quotaTextEl = document.createElement('span');
            quotaTextEl.className = 'quota-text';
            quotaTextEl.textContent = '离线额度：--/--';

            quotaRefreshBtn = document.createElement('button');
            quotaRefreshBtn.type = 'button';
            quotaRefreshBtn.className = 'storage-item-btn quota-refresh-btn';
            quotaRefreshBtn.textContent = '刷新';
            quotaRefreshBtn.style.minWidth = '48px';
            quotaRefreshBtn.addEventListener('click', async () => {
                const btn = quotaRefreshBtn;
                const oldText = btn.textContent;
                btn.disabled = true;
                btn.textContent = '刷新中...';
                try {
                    let data = null;
                    if (typeof window.refresh115Quota === 'function') {
                        data = await window.refresh115Quota();
                    } else {
                        data = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                url: 'https://115.com/web/lixian/?ct=lixian&ac=get_quota_package_info',
                                method: 'GET',
                                headers: { 'Accept': 'application/json, text/plain, */*', 'Referer': 'https://115.com/web/lixian/' },
                                onload: (resp) => {
                                    try {
                                        const json = JSON.parse(resp.responseText || 'null');
                                        resolve({
                                            surplus: Number(json?.surplus ?? json?.package?.["1"]?.surplus ?? 0),
                                            count: Number(json?.count ?? json?.package?.["1"]?.count ?? 0),
                                            used: Number(json?.used ?? json?.package?.["1"]?.used ?? 0),
                                        });
                                    } catch (e) { reject(e); }
                                },
                                onerror: (e) => reject(e)
                            });
                        });
                    }
                    if (data) setLocalQuota(data);
                } catch (e) {
                    console.error('刷新离线额度失败', e);
                } finally {
                    btn.disabled = false;
                    btn.textContent = oldText;
                    updateQuotaWidget();
                }
            });

            quotaWidgetEl.appendChild(quotaTextEl);
            quotaWidgetEl.appendChild(quotaRefreshBtn);
            storageTabContentEl.appendChild(quotaWidgetEl);
        }
        updateQuotaWidget();
    }
    function updateQuotaWidget() {
        if (!quotaTextEl) return;
        const q = getLocalQuota();
        if (q && typeof q.surplus !== 'undefined' && typeof q.count !== 'undefined') {
            quotaTextEl.textContent = `离线额度：${q.surplus}/${q.count}`;
        } else {
            quotaTextEl.textContent = '离线额度：--/--';
        }
    }
    function updateQuotaWidgetVisibility() {
        const enabled = GM_getValue('enableOfflineQuotaWidget', true);
        if (!quotaWidgetEl) {
            if (enabled) ensureQuotaWidget();
            return;
        }
        quotaWidgetEl.style.display = enabled ? 'inline-flex' : 'none';
    }
    ensureQuotaWidget();
    updateQuotaWidgetVisibility();
    let scrollTop = 0;
    let renderStartIndex = 0;
    let renderEndIndex = 0;
    let lastRenderTime = 0;
    let requestAnimationFrameId = null;
    let debounceTimer = null;

    let itemPool = [];
    let cachedElements = new Map();
    let lastScrollTop = 0;
    let scrollThrottleTimer = null;
    let isScrolling = false;
    let scrollSpeed = 0;
    let lastScrollTime = 0;

    let renderCount = 0;
    let performanceLastRenderTime = 0;
    let totalRenderTime = 0;

    function processShareTitle(data) {
        const enableHarmonizeTitle = GM_getValue('enableHarmonizeTitle', true);
        if (!enableHarmonizeTitle) {
            return data.data?.shareinfo?.share_title || '';
        }
        
        const shareTitle = data.data?.shareinfo?.share_title || '';
        if (shareTitle.includes('***')) {
            if (data.data?.list && data.data.list.length > 0) {
                return data.data.list[0].n || shareTitle;
            }
        }
        return shareTitle;
    }

    function setupVirtualScroll() {
        const containerHeight = storageContainer.clientHeight;
        visibleItemCount = Math.ceil(containerHeight / itemHeight) + 2;
        updateScrollContentHeight();
        storageContainer.addEventListener('scroll', () => {
            if (scrollThrottleTimer) return;
            scrollThrottleTimer = requestAnimationFrame(() => {
                handleScroll();
                scrollThrottleTimer = null;
            });
        });
        handleScroll();
        scheduleCacheCleanup();
    }

    function updateScrollContentHeight() {
        const totalHeight = filteredItems.length * itemHeight;
        storageScrollContent.style.height = `${totalHeight}px`;
    }

    function handleScroll() {
        const currentScrollTop = storageContainer.scrollTop;
        const currentTime = performance.now();
        if (lastScrollTime > 0) {
            const timeDiff = currentTime - lastScrollTime;
            const scrollDiff = Math.abs(currentScrollTop - lastScrollTop);
            scrollSpeed = scrollDiff / timeDiff;
        }
        lastScrollTime = currentTime;
        if (Math.abs(currentScrollTop - lastScrollTop) < 10) return;
        lastScrollTop = currentScrollTop;
        scrollTop = currentScrollTop;
        let bufferSize;
        if (scrollSpeed > 2) {
            bufferSize = Math.max(20, Math.ceil(visibleItemCount * 0.8));
        } else if (scrollSpeed > 0.5) {
            bufferSize = Math.max(15, Math.ceil(visibleItemCount * 0.6));
        } else {
            bufferSize = Math.max(10, Math.ceil(visibleItemCount * 0.4));
        }
        const newRenderStartIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferSize);
        const newRenderEndIndex = Math.min(filteredItems.length, newRenderStartIndex + visibleItemCount + bufferSize * 2);
        if (newRenderStartIndex !== renderStartIndex || newRenderEndIndex !== renderEndIndex) {
            renderStartIndex = newRenderStartIndex;
            renderEndIndex = newRenderEndIndex;
            renderVisibleItems();
        }
        if (selectedItems.size > 0 && !isScrolling) {
            isScrolling = true;
            requestAnimationFrame(() => {
                updateStorageItemSelection();
                isScrolling = false;
            });
        }
    }

    function handleCopyButtonStatus(button, text) {
        if (button._copyTimer) clearTimeout(button._copyTimer);
        const originalText = button.textContent;
        button.textContent = '已复制';
        button.classList.add('copied');
        button._copyTimer = setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
            button._copyTimer = null;
        }, 2000);
    }

    function renderVisibleItems() {
        const startTime = performance.now();
        const needCount = renderEndIndex - renderStartIndex;

        while (itemPool.length < needCount) {
            const div = document.createElement('div');
            div.className = 'virtual-scroll-item';
            div.style.height = `${itemHeight}px`;
            div.style.position = 'absolute';
            itemPool.push(div);
        }

        while (itemPool.length > needCount + 5) {
            const removedDiv = itemPool.pop();
            if (removedDiv._item) {
                cachedElements.delete(removedDiv._item.shareCode + (removedDiv._item.ed2k || ''));
            }
        }

        const fragment = document.createDocumentFragment();

        for (let i = 0; i < needCount; i++) {
            const idx = renderStartIndex + i;
            const item = filteredItems[idx];
            const div = itemPool[i];

            if (!item) {
                div.style.display = 'none';
                continue;
            }

            div.style.display = '';
            div.style.top = `${idx * itemHeight}px`;

            const itemKey = item.shareCode + (item.ed2k || '');
            if (!div._item || div._item !== item) {
                let el;
                if (cachedElements.has(itemKey)) {
                    el = cachedElements.get(itemKey).cloneNode(true);
                    rebindEventListeners(el, item, idx);
                } else {
                    el = createStorageItemElement({...item, index: idx});
                    const template = el.cloneNode(true);
                    cachedElements.set(itemKey, template);
                }
                div.innerHTML = '';
                div.appendChild(el);
                div._item = item;
            }
            const storageItem = div.querySelector('.storage-item');
            if (storageItem) {
                storageItem.classList.toggle('selected', selectedItems.has(idx));
            }

            fragment.appendChild(div);
        }

        storageScrollContent.innerHTML = '';
        storageScrollContent.appendChild(fragment);
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        renderCount++;
        totalRenderTime += renderTime;
        performanceLastRenderTime = renderTime;
        if (renderCount % 100 === 0) {
            const bufferSize = Math.max(10, Math.ceil(visibleItemCount * 0.4));
            console.log(`虚拟滚动性能统计: 平均渲染时间 ${(totalRenderTime / renderCount).toFixed(2)}ms, 最近渲染时间 ${renderTime.toFixed(2)}ms, 缓存命中率 ${((cachedElements.size / Math.max(1, renderCount)) * 100).toFixed(1)}%, 缓冲区域 ${bufferSize}项, 滚动速度 ${scrollSpeed.toFixed(2)}px/ms`);
        }
    }

    function rebindEventListeners(element, item, index) {
        element.dataset.index = index;
        const copyBtn = element.querySelector('.copy-btn');
        const deleteBtn = element.querySelector('.delete-btn');
        const offlineBtn = element.querySelector('.offline-btn');
        const fetchBtn = element.querySelector('.fetch-btn');
        const receiveBtn = element.querySelector('.receive-btn');
        const openBtn = element.querySelector('.open-btn');
        const noteLabel = element.querySelector('.note-label');

        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                if (item.ed2k) {
                    const text = `${item.shareTitle || '无标题'}\n${item.ed2k}`;
                    navigator.clipboard.writeText(text).then(() => {
                            handleCopyButtonStatus(copyBtn);
                        }).catch(err => {
                            console.error('复制失败:', err);
                        });
                } else {
                    const title = item.shareTitle || '无标题';
                    const link = `https://115cdn.com/s/${item.shareCode}${item.password ? `?password=${item.password}` : ''}`;
                    const text = `${link}#\n${title}`;
                    navigator.clipboard.writeText(text).then(() => {
                        handleCopyButtonStatus(copyBtn);
                    });
                }
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                const enableDeleteConfirm = GM_getValue('enableDeleteConfirm', true);
                if (enableDeleteConfirm) {
                    if (!confirm('确定要删除该条目吗？')) return;
                }
                GM_deleteValue(generateStorageKey(item.shareCode, item.ed2k, item.magnet));
                renderStorage(false);
            });
        }
        
        if (offlineBtn) {
            offlineBtn.addEventListener('click', () => {
                const url = item.magnet || item.ed2k;
                const encodedUrl = encodeURIComponent(url);
                const apiUrl = `https://115.com/web/lixian/?ct=lixian&ac=add_task_url&url=${encodedUrl}`;

                setupButtonWithStatus(offlineBtn, () => {
                    return new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: apiUrl,
                            onload: function(response) {
                                try {
                                    const data = JSON.parse(response.responseText);
                                    if (data.state === true) {
                                        decrementQuotaLocal();
                                        if (renderContext === 'dedupe') {
                                            rebuildDedupeGroups();
                                            renderDedupePage();
                                        }
                                        resolve();
                                    } else {
                                        const errorMsg = data.error_msg || data.error || data.errtype || '离线失败';
                                        reject(new Error(errorMsg));
                                    }
                                } catch (e) {
                                    reject(new Error('解析响应失败'));
                                }
                            },
                            onerror: function(error) {
                                reject(new Error(`请求失败: ${error.statusText || '网络错误'}`));
                            }
                        });
                    });
                }, '离线成功', '离线失败');
            });
        }
        
        if (receiveBtn) {
            receiveBtn.addEventListener('click', () => {
                setupButtonWithStatus(receiveBtn, async () => {
                    const { user_id } = unsafeWindow || {};
                    const formData = new URLSearchParams();
                    formData.append("user_id", user_id);
                    formData.append("share_code", item.shareCode);
                    formData.append("receive_code", item.password);
                    formData.append("cid", "100115");

                    return new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: 'https://webapi.115.com/share/receive',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            data: formData.toString(),
                            onload: r => {
                                try {
                                    const data = JSON.parse(r.responseText);
                                    if (data.state === true) {
                                        if (renderContext === 'dedupe') {
                                            rebuildDedupeGroups();
                                            renderDedupePage();
                                        }
                                        resolve();
                                    } else {
                                        reject(new Error(data.error_msg || data.error || '接收失败'));
                                    }
                                } catch(e) {
                                    reject(e);
                                }
                            },
                            onerror: e => reject(e)
                        });
                    });
                }, '接收成功', '接收失败');
            });
        }
        
        if (openBtn) {
            openBtn.addEventListener('click', () => {
                if (item.ed2k) {
                    const text = item.ed2k;
                    navigator.clipboard.writeText(text).then(() => {
                        handleCopyButtonStatus(openBtn);
                    });
                } else {
                    window.open(`https://115cdn.com/s/${item.shareCode}${item.password ? `?password=${item.password}` : ''}`, '_blank');
                }
            });
        }
        
        if (fetchBtn) {
            fetchBtn.addEventListener('click', () => {
                setupButtonWithStatus(fetchBtn, () => {
                    return new Promise((resolve, reject) => {
                        if (item.ed2k) {
                            reject(new Error('ED2K链接无需更新'));
                            return;
                        }

                        checkPasswordCorrect(item.shareCode, item.password, (isCorrect, responseData) => {
                            if (isCorrect) {
                                delete item.error;
                                if (responseData?.shareTitle) item.shareTitle = responseData.shareTitle;
                                if (responseData?.expireTime !== undefined) item.expireTime = responseData.expireTime;
                                if (responseData?.fileSize !== undefined) item.fileSize = responseData.fileSize;
                                if (responseData?.autoRenewal !== undefined) item.autoRenewal = String(responseData.autoRenewal);
                                updateItemData(item.note, item.shareTitle, item.password);
                                resolve();
                            } else {
                                const rawMsg = responseData?.error || '验证失败';
                                const errno = responseData?.errno;
                                const shareInfo = responseData?.rawResponse?.data?.shareinfo || {};
                                const shareState = shareInfo?.share_state;
                                const isCancelledErrno = errno === 4100010;
                                const isCancelledMsg = typeof rawMsg === 'string' && rawMsg.includes('取消');

                                if (errno === 4100008) {
                                    item.error = '访问码错误';
                                    updateItemData(item.note, item.shareTitle, item.password, item.error);
                                    reject(new Error('访问码错误'));
                                    return;
                                }

                                if (shareState === -1 || isCancelledErrno || isCancelledMsg) {
                                    item.shareTitle = '';
                                    item.expireTime = -1;
                                    item.fileSize = 0;
                                    item.autoRenewal = '0';
                                    delete item.error;
                                    updateItemData(item.note, '', item.password);
                                    reject(new Error('分享已取消'));
                                    return;
                                }

                                if (rawMsg === '分享已过期' || rawMsg.includes('过期')) {
                                    const expireTime = shareInfo?.expire_time || -1;
                                    const fileSize = parseInt(shareInfo?.file_size || '0');
                                    const autoRenewal = String(shareInfo?.auto_renewal || '0');
                                    const newTitle = processShareTitle(responseData?.rawResponse || {});
                                    item.expireTime = expireTime;
                                    item.fileSize = fileSize;
                                    item.autoRenewal = autoRenewal;
                                    if (newTitle) item.shareTitle = newTitle;
                                    item.error = shareInfo?.forbid_reason || '分享已过期';
                                    updateItemData(item.note, item.shareTitle, item.password, item.error);
                                    reject(new Error('分享已过期'));
                                    return;
                                }

                                item.error = '访问码错误';
                                updateItemData(item.note, item.shareTitle, item.password, item.error);
                                reject(new Error('访问码错误'));
                            }
                        });
                    });
                }, '更新成功', '更新失败');
            });
        }

        element.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.closest('button') || e.target.closest('input')) {
                return;
            }

            const currentIndex = parseInt(element.dataset.index);
            if (e.ctrlKey) {
                if (selectedItems.has(currentIndex)) {
                    selectedItems.delete(currentIndex);
                } else {
                    selectedItems.add(currentIndex);
                }
                lastSelectedIndex = currentIndex;
            } else if (e.shiftKey && lastSelectedIndex !== -1) {
                const start = Math.min(lastSelectedIndex, currentIndex);
                const end = Math.max(lastSelectedIndex, currentIndex);

                for (let i = start; i <= end; i++) {
                    selectedItems.add(i);
                }
            } else {
                selectedItems.clear();
                selectedItems.add(currentIndex);
                lastSelectedIndex = currentIndex;
            }

            updateStorageItemSelection();
            updateBatchActions();
        });
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function clearVirtualScrollCache() {
        cachedElements.clear();
        itemPool.forEach(div => {
            if (div._item) {
                div._item = null;
            }
        });
        itemPool.length = 0;

        if (window.gc) {
            window.gc();
        }
    }

    function getMemoryUsage() {
        if (performance.memory) {
            const memory = performance.memory;
            return {
                used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
                limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
            };
        }
        return null;
    }

    function scheduleCacheCleanup() {
        setInterval(() => {
            const memory = getMemoryUsage();
            if (memory && memory.used > memory.limit * 0.8) {
                console.log('内存使用率过高，清理虚拟滚动缓存');
                clearVirtualScrollCache();
            }
            if (cachedElements.size > 1000) {
                const keys = Array.from(cachedElements.keys());
                const toDelete = keys.slice(0, 500);
                toDelete.forEach(key => cachedElements.delete(key));
                console.log(`清理了 ${toDelete.length} 个缓存元素`);
            }
            const currentTime = performance.now();
            if (currentTime - lastScrollTime > 1000) {
                scrollSpeed = 0;
            }
        }, 30000);
    }

    function testVirtualScrollPerformance() {
        console.log('=== 虚拟滚动性能测试 ===');
        console.log(`当前渲染范围: ${renderStartIndex} - ${renderEndIndex} (共${renderEndIndex - renderStartIndex}项)`);
        console.log(`可见项数量: ${visibleItemCount}`);
        console.log(`缓冲区域大小: ${Math.max(10, Math.ceil(visibleItemCount * 0.4))}项`);
        console.log(`缓存元素数量: ${cachedElements.size}`);
        console.log(`元素池大小: ${itemPool.length}`);
        console.log(`滚动速度: ${scrollSpeed.toFixed(2)}px/ms`);
        const memory = getMemoryUsage();
        if (memory) {
            console.log(`内存使用: ${memory.used}MB / ${memory.total}MB (${(memory.used / memory.total * 100).toFixed(1)}%)`);
        }
        console.log(`渲染统计: 总渲染次数 ${renderCount}, 平均渲染时间 ${(totalRenderTime / Math.max(1, renderCount)).toFixed(2)}ms`);
        console.log('========================');
    }

    const debouncedSearch = debounce((searchTerm) => {
        currentSearchTerm = searchTerm;
        clearVirtualScrollCache();
        renderStorage(false);
    }, 300);

    function setupEditableField(displayElement, inputElement, onSave) {
        displayElement.addEventListener('dblclick', () => {
            displayElement.classList.add('storage-item-input-hidden');
            inputElement.classList.remove('storage-item-input-hidden');
            inputElement.classList.add('storage-item-input-visible');
            inputElement.focus();
            inputElement.select();
        });

        const handleClickOutside = (e) => {
            if (!inputElement.contains(e.target) && !displayElement.contains(e.target)) {
                const newValue = inputElement.value.trim();
                if (onSave) {
                    onSave(newValue);
                }
                displayElement.classList.remove('storage-item-input-hidden');
                inputElement.classList.add('storage-item-input-hidden');
                inputElement.classList.remove('storage-item-input-visible');
                document.removeEventListener('click', handleClickOutside);
            }
        };

        inputElement.addEventListener('focus', () => {
            setTimeout(() => {
                document.addEventListener('click', handleClickOutside);
            }, 0);
        });

        inputElement.addEventListener('blur', () => {
            const newValue = inputElement.value.trim();
            if (onSave) {
                onSave(newValue);
            }
            displayElement.classList.remove('storage-item-input-hidden');
            inputElement.classList.add('storage-item-input-hidden');
            inputElement.classList.remove('storage-item-input-visible');
            document.removeEventListener('click', handleClickOutside);
        });

        inputElement.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') inputElement.blur();
        });
    }

    function setupButtonWithStatus(button, action, successText = '成功', errorText = '失败') {
        const originalText = button.textContent;
        button.textContent = '处理中...';
        button.disabled = true;

        return action().then(() => {
            button.textContent = successText;
            button.style.backgroundColor = 'rgba(76,175,80,0.2)';
            button.style.color = '#4caf50';
        }).catch((error) => {
            const errorMessage = error.message || errorText;
            button.textContent = errorMessage.length > 8 ? errorMessage.substring(0, 8) + '...' : errorMessage;
            button.style.backgroundColor = 'rgba(244,67,54,0.2)';
            button.style.color = '#f44336';
            console.error('操作失败:', error);
            if (errorMessage.length > 8) {
                button.title = errorMessage;
            }
        }).finally(() => {
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '';
                button.style.color = '';
                button.disabled = false;
                button.title = '';
            }, 2000);
        });
    }

    function createStorageItemElement(item, options = {}) {
        const bindActions = !(options && options.bindActions === false);
        const renderContext = (options && options.renderContext) ? options.renderContext : 'storage';
        const now = Math.floor(Date.now() / 1000);
        const isExpired = item.expireTime !== -1 && item.expireTime <= now;
        const isLongTerm = item.expireTime === -1;
        const isTimeLimited = item.expireTime !== -1 && !isExpired;
        const isCancelled = item.expireTime === -1 && item.fileSize === 0 && item.shareTitle === '';
        const isEd2k = item.ed2k && item.ed2k !== '';
        const isMagnet = item.magnet && item.magnet !== '';
        const hasError = item.error;

        let expireDisplay = '';
        if (hasError) {
            const isExpiredError = item.error === "分享已过期" || item.error === "链接已过期";
            const isCancelledError = item.error === "分享已取消";
            
            if (isExpiredError) {
                expireDisplay = '<span class="expired-tag">已过期</span>';
            } else if (isCancelledError) {
                expireDisplay = '<span class="expired-tag">已取消分享</span>';
            } else {
                if (isLongTerm) {
                    expireDisplay = '<span class="valid-tag">长期</span><span class="error-tag">访问码错误</span>';
                } else if (item.autoRenewal === '1') {
                    expireDisplay = '<span class="auto-renewal-tag">自动续期</span><span class="error-tag">访问码错误</span>';
                } else if (isExpired) {
                    expireDisplay = '<span class="expired-tag">已过期</span><span class="error-tag">访问码错误</span>';
                } else if (isTimeLimited) {
                    expireDisplay = '<span class="time-limited-tag">限时</span><span class="error-tag">访问码错误</span>';
                } else {
                    expireDisplay = '<span class="error-tag">访问码错误</span>';
                }
            }
        } else if (isCancelled) {
            expireDisplay = '<span class="expired-tag">已取消分享</span>';
        } else if (isLongTerm) {
            expireDisplay = '<span class="valid-tag">长期</span>' + (item.autoRenewal === '1' ? '<span class="auto-renewal-tag">自动续期</span>' : '');
        } else if (item.autoRenewal === '1') {
            expireDisplay = '<span class="auto-renewal-tag">自动续期</span>';
        } else if (isExpired) {
            expireDisplay = '<span class="expired-tag">已过期</span>';
        } else if (isTimeLimited) {
            const remainingSeconds = item.expireTime - now;
            expireDisplay = `<span class="time-limited-tag">${formatTime(remainingSeconds)}</span>`;
        }

        const fileSizeDisplay = item.fileSize ? `<span class="file-size">${formatFileSize(item.fileSize)}</span>` : '';
        const ed2kTag = isEd2k ? '<span class="ed2k-tag">ED2K</span>' : '';
        const magnetTag = isMagnet ? '<span class="magnet-tag">磁力链</span>' : '';

        const itemElement = document.createElement('div');
        itemElement.className = 'storage-item';
        itemElement.dataset.index = item.index || 0;

        if (item.ed2k) {
            const ed2kMatch = item.ed2k.match(/ed2k:\/\/\|file\|([^|]+)\|(\d+)\|([0-9A-F]{32})(?:\|h=([^|]+))?(\||\/)?/i);
            const ed2kTitle = ed2kMatch ? decodeURIComponent(ed2kMatch[1]) : 'ED2K文件';
            const ed2kHash = ed2kMatch ? ed2kMatch[3] : '';

            itemElement.innerHTML = `
<div class="storage-item-header">
<div class="storage-item-title" title="${ed2kTitle}">${fileSizeDisplay}${ed2kTag}<span class="title-value">${ed2kTitle}</span><input type="text" class="storage-item-title-input storage-item-input-hidden" value="${ed2kTitle}"></div>
</div>
<div class="storage-item-content">
<div class="storage-item-info">
<span class="ed2k-display">${item.ed2k || ''}</span>
<input type="text" class="storage-item-ed2k-input storage-item-input-hidden" value="${item.ed2k || ''}">
</div>
<div class="storage-item-actions">
<button class="storage-item-btn copy-btn">复制</button>
<button class="storage-item-btn offline-btn">离线</button>
<button class="storage-item-btn delete-btn">删除</button>
</div>
</div>
<div class="storage-item-note">
<span class="note-label" title="双击获取为标题">备注:</span>
<span class="note-display">${item.note || '无备注'}</span>
<input type="text" class="storage-item-note-input storage-item-input-hidden" placeholder="添加或修改备注" value="${item.note || ''}">
<span class="note-copy-status"></span>
</div>
`;

            const ed2kDisplay = itemElement.querySelector('.ed2k-display');
            const ed2kInput = itemElement.querySelector('.storage-item-ed2k-input');

            setupEditableField(ed2kDisplay, ed2kInput, (newEd2k) => {
                const newEd2kMatch = newEd2k.match(/ed2k:\/\/\|file\|([^|]+)\|(\d+)\|([0-9A-F]{32})(?:\|h=([^|]+))?(\||\/)?/i);
                if (newEd2kMatch) {
                    const newHash = newEd2kMatch[3];
                    const oldHash = item.shareCode;

                    if (newHash !== oldHash) {
                        GM_deleteValue(generateStorageKey(oldHash, item.ed2k));
                        if (renderContext === 'dedupe') {
                            saveToStorage(newHash, item.password, item.note, item.shareTitle, item.expireTime, item.fileSize, item.autoRenewal, newEd2k, '', '', false, true);
                            rebuildDedupeGroups();
                            renderDedupePage();
                        } else {
                            saveToStorage(newHash, item.password, item.note, item.shareTitle, item.expireTime, item.fileSize, item.autoRenewal, newEd2k);
                        }
                    } else {
                        if (renderContext === 'dedupe') {
                            saveToStorage(item.shareCode, item.password, item.note, item.shareTitle, item.expireTime, item.fileSize, item.autoRenewal, newEd2k, '', '', false, true);
                            rebuildDedupeGroups();
                            renderDedupePage();
                        } else {
                            saveToStorage(item.shareCode, item.password, item.note, item.shareTitle, item.expireTime, item.fileSize, item.autoRenewal, newEd2k);
                        }
                    }
                    ed2kDisplay.textContent = newEd2k;
                } else {
                    ed2kInput.value = item.ed2k;
                    alert('ED2K链接格式不正确，请检查后重试');
                }
            });

            const titleDisplay = itemElement.querySelector('.title-value');
            const titleInput = itemElement.querySelector('.storage-item-title-input');

            setupEditableField(titleDisplay, titleInput, (newTitle) => {
                titleDisplay.textContent = newTitle || '无标题';
                titleDisplay.title = newTitle || '无标题';
                updateItemData(item.note, newTitle);
            });

        } else if (item.magnet) {
            const magnetMatch = item.magnet.match(/magnet:\?xt=urn:btih:([a-fA-F0-9]{40})/i);
            const magnetHash = magnetMatch ? magnetMatch[1] : '';

            let magnetName = '磁力链文件';
            const nameMatch = item.magnet.match(/[?&]name=([^&]+)/i);
            if (nameMatch) {
                try {
                    magnetName = decodeURIComponent(nameMatch[1]);
                } catch (e) {
                    magnetName = nameMatch[1];
                }
            } else {
                const dnMatch = item.magnet.match(/[?&]dn=([^&]+)/i);
                if (dnMatch) {
                    try {
                        magnetName = decodeURIComponent(dnMatch[1]);
                    } catch (e) {
                        magnetName = dnMatch[1];
                    }
                }
            }

            const displayName = item.shareTitle || item.note || magnetName;

            const linkType = 'magnet';
            const linkDisplay = 'magnet-display';
            const linkInput = 'storage-item-magnet-input';
            const linkValue = item.magnet || '';

            itemElement.innerHTML = `
<div class="storage-item-header">
<div class="storage-item-title" title="${displayName}">${magnetTag}<span class="title-value">${displayName}</span><input type="text" class="storage-item-title-input storage-item-input-hidden" value="${displayName}"></div>
</div>
<div class="storage-item-content">
<div class="storage-item-info">
<span class="${linkDisplay}">${linkValue}</span>
<input type="text" class="${linkInput} storage-item-input-hidden" value="${linkValue}">
</div>
<div class="storage-item-actions">
<button class="storage-item-btn copy-btn">复制</button>
<button class="storage-item-btn offline-btn">离线</button>
<button class="storage-item-btn delete-btn">删除</button>
</div>
</div>
<div class="storage-item-note">
<span class="note-label" title="双击获取为标题">备注:</span>
<span class="note-display">${item.note || '无备注'}</span>
<input type="text" class="storage-item-note-input storage-item-input-hidden" placeholder="添加或修改备注" value="${item.note || ''}">
<span class="note-copy-status"></span>
</div>
`;

            const magnetDisplay = itemElement.querySelector('.magnet-display');
            const magnetInput = itemElement.querySelector('.storage-item-magnet-input');

            setupEditableField(magnetDisplay, magnetInput, (newMagnet) => {
                const newMagnetMatch = newMagnet.match(/magnet:\?xt=urn:btih:([a-fA-F0-9]{40})/i);
                if (newMagnetMatch) {
                    const newHash = newMagnetMatch[1];
                    const oldHash = item.shareCode;

                    let newName = '';
                    const nameMatch = newMagnet.match(/[?&]name=([^&]+)/i);
                    if (nameMatch) {
                        try {
                            newName = decodeURIComponent(nameMatch[1]);
                        } catch (e) {
                            newName = nameMatch[1];
                        }
                    } else {
                        const dnMatch = newMagnet.match(/[?&]dn=([^&]+)/i);
                        if (dnMatch) {
                            try {
                                newName = decodeURIComponent(dnMatch[1]);
                            } catch (e) {
                                newName = dnMatch[1];
                            }
                        }
                    }

                    if (newHash !== oldHash) {
                        GM_deleteValue(generateStorageKey(oldHash, item.ed2k, item.magnet));
                        if (renderContext === 'dedupe') {
                            saveToStorage(newHash, item.password, item.note, item.shareTitle, item.expireTime, item.fileSize, item.autoRenewal, item.ed2k, newMagnet, '', false, true);
                            rebuildDedupeGroups();
                            renderDedupePage();
                        } else {
                            saveToStorage(newHash, item.password, item.note, item.shareTitle, item.expireTime, item.fileSize, item.autoRenewal, item.ed2k, newMagnet);
                        }
                    } else {
                        if (renderContext === 'dedupe') {
                            saveToStorage(item.shareCode, item.password, item.note, item.shareTitle, item.expireTime, item.fileSize, item.autoRenewal, item.ed2k, newMagnet, '', false, true);
                            rebuildDedupeGroups();
                            renderDedupePage();
                        } else {
                            saveToStorage(item.shareCode, item.password, item.note, item.shareTitle, item.expireTime, item.fileSize, item.autoRenewal, item.ed2k, newMagnet);
                        }
                    }
                    magnetDisplay.textContent = newMagnet;
                } else {
                    magnetInput.value = item.magnet;
                    alert('磁力链格式不正确，请检查后重试');
                }
            });

            const titleDisplay = itemElement.querySelector('.title-value');
            const titleInput = itemElement.querySelector('.storage-item-title-input');

            setupEditableField(titleDisplay, titleInput, (newTitle) => {
                titleDisplay.textContent = newTitle || '无标题';
                titleDisplay.title = newTitle || '无标题';
                updateItemData(item.note, newTitle);
            });

            const noteDisplay = itemElement.querySelector('.note-display');
            const noteInput = itemElement.querySelector('.storage-item-note-input');

            setupEditableField(noteDisplay, noteInput, (newNote) => {
                noteDisplay.textContent = newNote || '无备注';
                updateItemData(newNote, item.shareTitle);
            });

} else {
    itemElement.innerHTML = `
<div class="storage-item-header">
<div class="storage-item-title" title="${item.shareTitle || '无标题'}">${fileSizeDisplay}<span class="title-value">${item.shareTitle || '无标题'}</span><input type="text" class="storage-item-title-input storage-item-input-hidden" value="${item.shareTitle || '无标题'}"></div>
</div>
<div class="storage-item-password">
<div class="storage-item-info">
<span class="storage-item-sharer">分享码: ${item.shareCode}</span>
<span class="storage-item-sharer password-display">访问码: <span class="password-value">${item.password}</span><input type="text" class="storage-item-password-input storage-item-input-hidden" value="${item.password}" maxlength="4"></span>
${expireDisplay}
</div>
<div class="storage-item-actions">
<button class="storage-item-btn copy-btn">复制</button>
${(!isEd2k && !isMagnet) ? '<button class="storage-item-btn fetch-btn">更新</button>' : ''}
<button class="storage-item-btn receive-btn">接收</button>
<button class="storage-item-btn open-btn">打开</button>
<button class="storage-item-btn delete-btn">删除</button>
</div>
</div>
<div class="storage-item-note">
<span class="note-label" title="双击获取为标题">备注:</span>
<span class="note-display">${item.note || '无备注'}</span><input type="text" class="storage-item-note-input storage-item-input-hidden" placeholder="添加或修改备注" value="${item.note || ''}">
<span class="note-copy-status"></span>
</div>
`;
}

    const copyBtn = itemElement.querySelector('.copy-btn');
    const offlineBtn = itemElement.querySelector('.offline-btn');
    const fetchBtn = itemElement.querySelector('.fetch-btn');
    const receiveBtn = itemElement.querySelector('.receive-btn');
    const openBtn = itemElement.querySelector('.open-btn');
    const deleteBtn = itemElement.querySelector('.delete-btn');
    const noteLabel = itemElement.querySelector('.note-label');
    const noteDisplay = itemElement.querySelector('.note-display');
    const noteInput = itemElement.querySelector('.storage-item-note-input');
    const passwordDisplay = itemElement.querySelector('.password-value');
    const passwordInput = itemElement.querySelector('.storage-item-password-input');
    const copyStatus = itemElement.querySelector('.note-copy-status');
    const titleDisplay = itemElement.querySelector('.title-value');
    const titleInput = itemElement.querySelector('.storage-item-title-input');

        if (offlineBtn) {
            offlineBtn.addEventListener('click', () => {
                const url = item.magnet || item.ed2k;
                const encodedUrl = encodeURIComponent(url);
                const apiUrl = `https://115.com/web/lixian/?ct=lixian&ac=add_task_url&url=${encodedUrl}`;

                setupButtonWithStatus(offlineBtn, () => {
                    return new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: apiUrl,
                            onload: function(response) {
                                try {
                                    const data = JSON.parse(response.responseText);
                                    if (data.state === true) {
                                        decrementQuotaLocal();
                                        resolve();
                                    } else {
                                        const errorMsg = data.error_msg || data.error || data.errtype || '离线失败';
                                        reject(new Error(errorMsg));
                                    }
                                } catch (e) {
                                    reject(new Error('解析响应失败'));
                                }
                            },
                            onerror: function(error) {
                                reject(new Error(`请求失败: ${error.statusText || '网络错误'}`));
                            }
                        });
                    });
                }, '离线成功', '离线失败');
            });
        }

        if (receiveBtn) {
            receiveBtn.addEventListener('click', () => {
                setupButtonWithStatus(receiveBtn, async () => {
                    const { user_id } = unsafeWindow || {};
                    const formData = new URLSearchParams();
                    formData.append("user_id", user_id);
                    formData.append("share_code", item.shareCode);
                    formData.append("receive_code", item.password);
                    formData.append("cid", "100115");

                    return new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: 'https://webapi.115.com/share/receive',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            data: formData.toString(),
                            onload: r => {
                                try {
                                    const data = JSON.parse(r.responseText);
                                    if (data.state === true) {
                                        resolve();
                                    } else {
                                        reject(new Error(data.error_msg || data.error || '接收失败'));
                                    }
                                } catch(e) {
                                    reject(e);
                                }
                            },
                            onerror: e => reject(e)
                        });
                    });
                }, '接收成功', '接收失败');
            });
        }

    if (bindActions) { copyBtn.addEventListener('click', () => {
        const enableMagnetTitleCopy = GM_getValue('enableMagnetTitleCopy', false);

        if (item.magnet) {
            let magnetToCopy;
            if (enableMagnetTitleCopy && (item.shareTitle || item.note)) {
                const title = item.shareTitle || item.note;
                magnetToCopy = `${title}\n${item.magnet}`;
            } else {
                magnetToCopy = item.magnet;
                if (!item.magnet.includes('?name=') && (item.shareTitle || item.note)) {
                    const title = item.shareTitle || item.note;
                    magnetToCopy = `${item.magnet}?name=${title}`;
                }
            }

            navigator.clipboard.writeText(magnetToCopy).then(() => {
                handleCopyButtonStatus(copyBtn);
            });
        } else if (item.ed2k) {
            const text = `${item.shareTitle || '无标题'}\n${item.ed2k}`;
            navigator.clipboard.writeText(text).then(() => {
                handleCopyButtonStatus(copyBtn);
            });
        } else {
            const title = item.shareTitle || '无标题';
            const link = `https://115cdn.com/s/${item.shareCode}${item.password ? `?password=${item.password}` : ''}`;
            const enableShareTitleCopy = GM_getValue('enableShareTitleCopy', false);
            let text;
            if (enableShareTitleCopy && title) {
                text = `${title}\n${link}`;
            } else {
                text = `${link}#\n${title}`;
            }
            navigator.clipboard.writeText(text).then(() => {
                handleCopyButtonStatus(copyBtn);
            });
        }
    }); }

        if (bindActions && fetchBtn) {
            fetchBtn.addEventListener('click', () => {
                setupButtonWithStatus(fetchBtn, () => {
                    return new Promise((resolve, reject) => {
                        checkPasswordCorrect(item.shareCode, item.password, (isCorrect, responseData) => {
                            if (isCorrect) {
                                delete item.error;
                                if (responseData?.shareTitle) item.shareTitle = responseData.shareTitle;
                                if (responseData?.expireTime !== undefined) item.expireTime = responseData.expireTime;
                                if (responseData?.fileSize !== undefined) item.fileSize = responseData.fileSize;
                                if (responseData?.autoRenewal !== undefined) item.autoRenewal = String(responseData.autoRenewal);
                                updateItemData(item.note, item.shareTitle, item.password);
                                resolve();
                            } else {
                                const rawMsg = responseData?.error || '验证失败';
                                const errno = responseData?.errno;
                                const shareInfo = responseData?.rawResponse?.data?.shareinfo || {};
                                const shareState = shareInfo?.share_state;
                                const isCancelledErrno = errno === 4100010;
                                const isCancelledMsg = typeof rawMsg === 'string' && rawMsg.includes('取消');

                                if (errno === 4100008) {
                                    item.error = '访问码错误';
                                    updateItemData(item.note, item.shareTitle, item.password, item.error);
                                    reject(new Error('访问码错误'));
                                    return;
                                }

                                if (shareState === -1 || isCancelledErrno || isCancelledMsg) {
                                    delete item.error;
                                    item.shareTitle = '';
                                    item.expireTime = -1;
                                    item.fileSize = 0;
                                    item.autoRenewal = '0';
                                    updateItemData(item.note, '', item.password);
                                    reject(new Error('分享已取消'));
                                    return;
                                }

                                if (rawMsg === '分享已过期' || rawMsg.includes('过期')) {
                                    const expireTime = shareInfo?.expire_time || -1;
                                    const fileSize = parseInt(shareInfo?.file_size || '0');
                                    const autoRenewal = String(shareInfo?.auto_renewal || '0');
                                    const newTitle = processShareTitle(responseData?.rawResponse || {});
                                    item.expireTime = expireTime;
                                    item.fileSize = fileSize;
                                    item.autoRenewal = autoRenewal;
                                    if (newTitle) item.shareTitle = newTitle;
                                    item.error = shareInfo?.forbid_reason || '分享已过期';
                                    updateItemData(item.note, item.shareTitle, item.password, item.error);
                                    reject(new Error('分享已过期'));
                                    return;
                                }

                                item.error = '访问码错误';
                                updateItemData(item.note, item.shareTitle, item.password, item.error);
                                reject(new Error('访问码错误'));
                            }
                        });
                    });
                }, '获取成功', '获取失败');
            });
        }

    if (bindActions && openBtn) {
        openBtn.addEventListener('click', () => {
            if (item.magnet) {
                navigator.clipboard.writeText(item.magnet).then(() => {
                    handleCopyButtonStatus(openBtn);
                });
            } else if (item.ed2k) {
                navigator.clipboard.writeText(item.ed2k).then(() => {
                    handleCopyButtonStatus(openBtn);
                });
            } else {
                window.open(`https://115cdn.com/s/${item.shareCode}?password=${item.password}`, '_blank');
            }
        });
    }

    noteLabel.addEventListener('dblclick', () => {
        if (!item.ed2k && !isCancelled) {
            copyStatus.textContent = '处理中...';
            copyStatus.style.display = 'inline';

            checkPasswordCorrect(item.shareCode, item.password, (isCorrect, responseData) => {
                if (isCorrect && responseData) {
                    const newNote = `${responseData.shareTitle || '无标题'}`;
                    noteDisplay.textContent = newNote;
                    noteInput.value = newNote;
                    updateItemData(newNote);
                    copyStatus.textContent = '已完成';
                    setTimeout(() => {
                        copyStatus.style.display = 'none';
                    }, 2000);
                } else {
                    copyStatus.style.display = 'none';
                }
            });
        }
    });

        function updateItemData(newNote = item.note, newTitle = item.shareTitle, newPassword = item.password, newError = item.error) {
            const params = [
                item.shareCode,
                newPassword,
                newNote || '',
                newTitle || '',
                item.expireTime,
                item.fileSize,
                item.autoRenewal,
                item.ed2k,
                item.magnet,
                newError
            ];
            if (renderContext === 'dedupe') {
                saveToStorage(...params, true, true);
                rebuildDedupeGroups();
                renderDedupePage();
            } else {
                updateStorageItem(...params);
            }
        }

        setupEditableField(noteDisplay, noteInput, (newNote) => {
            noteDisplay.textContent = newNote || '无备注';
            updateItemData(newNote);
        });

        if (passwordDisplay && passwordInput) {
            setupEditableField(passwordDisplay, passwordInput, (newPassword) => {
                if (newPassword.length === 4 && /^[0-9a-zA-Z]+$/.test(newPassword)) {
                    passwordDisplay.textContent = newPassword;
                    updateItemData(item.note, item.shareTitle, newPassword);
                } else {
                    passwordDisplay.textContent = item.password;
                    passwordInput.value = item.password;
                }
            });

            passwordInput.addEventListener('input', (e) => {
                passwordInput.value = passwordInput.value.replace(/[^0-9a-zA-Z]/g, '');
                if (passwordInput.value.length > 4) passwordInput.value = passwordInput.value.slice(0, 4);
            });
        }

        if (titleDisplay && titleInput) {
            setupEditableField(titleDisplay, titleInput, (newTitle) => {
                titleDisplay.textContent = newTitle || '无标题';
                titleDisplay.title = newTitle || '无标题';
                updateItemData(item.note, newTitle);
            });
        }

    if (bindActions) { deleteBtn.addEventListener('click', () => {
        const enableDeleteConfirm = GM_getValue('enableDeleteConfirm', true);
        if (enableDeleteConfirm) {
            if (!confirm('确定要删除该条目吗？')) return;
        }
        GM_deleteValue(generateStorageKey(item.shareCode, item.ed2k, item.magnet));
        if (renderContext === 'dedupe') {
            rebuildDedupeGroups();
            renderDedupePage();
        } else {
            renderStorage(false);
        }
    }); }

    if (bindActions) { itemElement.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.closest('button') || e.target.closest('input')) {
            return;
        }

        const currentIndex = parseInt(itemElement.dataset.index);
        if (e.ctrlKey) {
            if (selectedItems.has(currentIndex)) {
                selectedItems.delete(currentIndex);
            } else {
                selectedItems.add(currentIndex);
            }
            lastSelectedIndex = currentIndex;
        } else if (e.shiftKey && lastSelectedIndex !== -1) {

            const start = Math.min(lastSelectedIndex, currentIndex);
            const end = Math.max(lastSelectedIndex, currentIndex);

            for (let i = start; i <= end; i++) {
                selectedItems.add(i);
            }
        } else {
            selectedItems.clear();
            selectedItems.add(currentIndex);
            lastSelectedIndex = currentIndex;
        }

        updateStorageItemSelection();
        updateBatchActions();
    }); }

    const allInputs = itemElement.querySelectorAll('input[type="text"], input[type="password"], input[type="number"]');
    allInputs.forEach(input => {
        input.addEventListener('blur', (e) => {
            setTimeout(() => {
                if (input.style.display !== 'none' && input.style.display !== '') {
                    const displayElement = input.previousElementSibling;
                    if (displayElement && displayElement.classList.contains('storage-item-title')) {
                        displayElement.style.display = 'inline';
                        input.style.display = 'none';
                    }
                }
            }, 10);
        });
    });

    return itemElement;
}

    function updateStorageItemSelection() {
        const virtualScrollItems = document.querySelectorAll('.virtual-scroll-item');
        virtualScrollItems.forEach((virtualItem) => {
            const storageItem = virtualItem.querySelector('.storage-item');
            if (storageItem) {
                const index = parseInt(storageItem.dataset.index);
                if (selectedItems.has(index)) {
                    storageItem.classList.add('selected');
                } else {
                    storageItem.classList.remove('selected');
                }
            }
        });
    }

    function updateDedupeItemSelection() {
        const dedupeContent = document.querySelector('.storage-tab-content[data-tab-content="dedupe"]');
        if (!dedupeContent) return;
        const items = dedupeContent.querySelectorAll('.virtual-scroll-item .storage-item');
        items.forEach((el) => {
            const key = el?.dataset?.key;
            if (!key) return;
            if (dedupeSelectedItems.has(key)) el.classList.add('selected');
            else el.classList.remove('selected');
        });
        try { updateBatchActions(); } catch (_) {}
    }

    function updateBatchActions() {
        const activeContent = document.querySelector('.storage-tab-content.active');
        if (!activeContent) return;
        const container = activeContent.querySelector('.batch-actions-container');
        const countSpan = container?.querySelector('.selected-count');
        const batchCopyBtn = container?.querySelector('.copy-btn');
        const batchDeleteBtn = container?.querySelector('.delete-btn');
        const batchCancelBtn = container?.querySelector('.cancel-btn');
        const helpBtn = container?.querySelector('.selected-help-btn');
        const hintBox = container?.querySelector('.multi-select-hint');

        const isDedupe = activeContent.getAttribute('data-tab-content') === 'dedupe';
        const count = isDedupe ? dedupeSelectedItems.size : selectedItems.size;

        if (count > 0) {
            if (container) container.classList.add('has-selection');
            if (countSpan) {
                countSpan.textContent = `已选 ${count} 项`;
                countSpan.style.display = 'inline-block';
            }
            if (helpBtn) helpBtn.style.display = 'none';
            if (hintBox) hintBox.style.display = 'none';
            if (batchCopyBtn) batchCopyBtn.style.display = 'inline-block';
            if (batchDeleteBtn) batchDeleteBtn.style.display = 'inline-block';
            if (batchCancelBtn) batchCancelBtn.style.display = 'inline-block';
        } else {
            if (container) container.classList.remove('has-selection');
            if (countSpan) {
                countSpan.textContent = '已选 0 项';
                countSpan.style.display = 'none';
            }
            if (helpBtn) helpBtn.style.display = 'inline-flex';
            if (batchCopyBtn) batchCopyBtn.style.display = 'none';
            if (batchDeleteBtn) batchDeleteBtn.style.display = 'none';
            if (batchCancelBtn) batchCancelBtn.style.display = 'none';
            if (hintBox && helpBtn && container) {
                if (!helpBtn._bound) {
                    helpBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        hintBox.style.display = hintBox.style.display === 'none' || hintBox.style.display === '' ? 'block' : 'none';
                    });
                    hintBox.addEventListener('click', (e) => {
                        e.stopPropagation();
                    });
                    document.addEventListener('click', (e) => {
                        if (!hintBox.contains(e.target) && e.target !== helpBtn && !helpBtn.contains(e.target)) {
                            hintBox.style.display = 'none';
                        }
                    });
                    document.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape') {
                            hintBox.style.display = 'none';
                        }
                    });
                    helpBtn._bound = true;
                }
            }
        }
    }

    function extractFileNameFromEd2k(ed2k) {
        if (!ed2k) return '';
        const match = ed2k.match(/ed2k:\/\/\|file\|([^|]+)\|/);
        return match ? decodeURIComponent(match[1]) : '';
    }

    function batchCopySelected() {
        const items = filteredItems;
        const selectedItemsList = Array.from(selectedItems).map(index => items[index]).filter(Boolean);

        if (selectedItemsList.length === 0) return;

        const enableMagnetTitleCopy = GM_getValue('enableMagnetTitleCopy', false);

        const copyText = selectedItemsList.map(item => {
            if (item.magnet) {
                if (enableMagnetTitleCopy && (item.shareTitle || item.note)) {
                    const title = item.shareTitle || item.note;
                    return `${title}\n${item.magnet}`;
                } else {
                    let magnetToCopy = item.magnet;
                    if (!item.magnet.includes('?name=') && (item.shareTitle || item.note)) {
                        const title = item.shareTitle || item.note;
                        magnetToCopy = `${item.magnet}?name=${title}`;
                    }
                    return magnetToCopy;
                }
            } else if (item.ed2k) {
                return item.ed2k;
            } else {
                const shareUrl = `https://115cdn.com/s/${item.shareCode}`;
                const password = item.password || '';
                const title = item.shareTitle || item.note || '';
                const fullUrl = `${shareUrl}${password ? `?password=${password}` : ''}`;
                const enableShareTitleCopy = GM_getValue('enableShareTitleCopy', false);
                if (enableShareTitleCopy && title) {
                    return `${title}\n${fullUrl}`;
                } else {
                    return title ? `${fullUrl}#\n${title}` : fullUrl;
                }
            }
        }).join('\n\n');

        navigator.clipboard.writeText(copyText).then(() => {

            const batchCopyBtn = document.querySelector('.batch-actions-container .copy-btn');
            if (batchCopyBtn) {
                const originalText = batchCopyBtn.textContent;
                const originalBackground = batchCopyBtn.style.backgroundColor;

                batchCopyBtn.textContent = '已复制';
                batchCopyBtn.style.backgroundColor = '#4caf50';
                batchCopyBtn.style.color = 'white';

                setTimeout(() => {
                    batchCopyBtn.textContent = originalText;
                    batchCopyBtn.style.backgroundColor = originalBackground;
                    batchCopyBtn.style.color = 'white';
                }, 2000);
            }
        }).catch(err => {
            console.error('复制失败:', err);

            const batchCopyBtn = document.querySelector('.batch-actions-container .copy-btn');
            if (batchCopyBtn) {
                const originalText = batchCopyBtn.textContent;
                const originalBackground = batchCopyBtn.style.backgroundColor;

                batchCopyBtn.textContent = '复制失败';
                batchCopyBtn.style.backgroundColor = '#f44336';
                batchCopyBtn.style.color = 'white';

                setTimeout(() => {
                    batchCopyBtn.textContent = originalText;
                    batchCopyBtn.style.backgroundColor = originalBackground;
                    batchCopyBtn.style.color = 'white';
                }, 2000);
            }
        });
    }

    function batchCancelSelected() {
        selectedItems.clear();
        lastSelectedIndex = -1;
        updateStorageItemSelection();
        updateBatchActions();
    }

    function batchDeleteSelected() {
        const items = filteredItems;
        const selectedItemsList = Array.from(selectedItems).map(index => items[index]).filter(Boolean);

        if (selectedItemsList.length === 0) return;

        const enableDeleteConfirm = GM_getValue('enableDeleteConfirm', true);
        if (enableDeleteConfirm) {
            if (!confirm(`确定要删除选中的 ${selectedItemsList.length} 个项目吗？`)) return;
        }

        selectedItemsList.forEach(item => {
            GM_deleteValue(generateStorageKey(item.shareCode, item.ed2k, item.magnet));
        });

        selectedItems.clear();
        lastSelectedIndex = -1;
        renderStorage(false);
    }

    function batchCancelSelectedDedupe() {
        dedupeSelectedItems.clear();
        dedupeLastListRef = null;
        dedupeLastIndex = -1;
        updateDedupeItemSelection();
        updateBatchActions();
    }

    function batchDeleteSelectedDedupe() {
        const list = Array.from(dedupeSelectedItems);
        if (list.length === 0) return;

        const enableDeleteConfirm = GM_getValue('enableDeleteConfirm', true);
        if (enableDeleteConfirm) {
            if (!confirm(`确定要删除选中的 ${list.length} 个项目吗？`)) return;
        }

        for (const key of list) {
            const info = dedupeKeyMap.get(key);
            if (!info) continue;
            try {
                GM_deleteValue(generateStorageKey(info.shareCode, info.ed2k, info.magnet));
            } catch (_) {}
        }

        dedupeSelectedItems.clear();
        dedupeLastListRef = null;
        dedupeLastIndex = -1;
        rebuildDedupeGroups();
        renderDedupePage();
    }

    function batchCopySelectedDedupe() {
        const list = Array.from(dedupeSelectedItems).map(k => dedupeKeyMap.get(k)).filter(Boolean);
        if (list.length === 0) return;
        const enableMagnetTitleCopy = GM_getValue('enableMagnetTitleCopy', false);
        const enableShareTitleCopy = GM_getValue('enableShareTitleCopy', false);
        const text = list.map(info => {
            if (info.magnet) {
                return info.magnet;
            } else if (info.ed2k) {
                return info.ed2k;
            } else {
                const shareUrl = `https://115cdn.com/s/${info.shareCode}`;
                return shareUrl;
            }
        }).join('\n\n');
        navigator.clipboard.writeText(text).then(() => {
            const activeContent = document.querySelector('.storage-tab-content.active');
            const btn = activeContent?.querySelector('.batch-actions-container .copy-btn');
            if (!btn) return;
            const originalText = btn.textContent;
            const originalBg = btn.style.backgroundColor;
            btn.textContent = '已复制';
            btn.style.backgroundColor = '#4caf50';
            btn.style.color = 'white';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = originalBg;
                btn.style.color = 'white';
            }, 2000);
        }).catch(() => {});
    }

    function getShareCode() {
        const url = window.location.href;
        const match = url.match(/115cdn\.com\/s\/([a-z0-9]+)/);
        return match ? match[1] : '';
    }

    function getPasswordFromUrl() {
        const url = window.location.href;
        const passwordMatch = url.match(/[?&]password=([^&#]*)/);
        return passwordMatch ? decodeURIComponent(passwordMatch[1]) : '';
    }

    function checkCurrentUrlPassword() {
        const shareCode = getShareCode();
        const password = getPasswordFromUrl();
        if (shareCode && password) {
            try { autoFillPassword(password); } catch (e) {}
            checkPasswordCorrect(shareCode, password, (isCorrect, data) => {
                if (isCorrect) {
                    saveToStorage(shareCode, password, '', data?.shareTitle, data?.expireTime, data?.fileSize, data?.autoRenewal, '');
                    try { applySuccessUI(password); } catch (e) {}
                    try { __verifiedOK = true; __verificationCompleted = true; ensureErrorObserver(); suppressAccessCodeErrors(document); } catch (e) {}
                    try { setTimeout(() => { try { fetchShareInfo(); } catch (e) {} }, 600); } catch (e) {}
                }
            });
        }
    }

    async function getUserNameByUserId(userId) {
        if (!userId || userId === '未知') {
            return '未知';
        }

        try {
            console.log(`正在获取用户ID ${userId} 的名称...`);
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://pmsg.115.com/api/1.0/web/1.0/friend/find?find_str=${userId}`,
                    onload: r => {
                        try {
                            console.log(`API响应状态: ${r.status}, 响应内容:`, r.responseText);
                            const data = JSON.parse(r.responseText);
                            resolve(data);
                        } catch(e) {
                            console.error('解析API响应失败:', e);
                            reject(e);
                        }
                    },
                    onerror: e => {
                        console.error('API请求失败:', e);
                        reject(e);
                    }
                });
            });

            console.log('API响应数据:', response);

            if (response.state && response.data && response.data.length > 0) {
                const userName = response.data[0].friend_name || '未知';
                console.log(`获取到用户名称: ${userName}`);
                return userName;
            } else {
                console.log('API返回数据为空或格式不正确');
                return '未知';
            }
        } catch (error) {
            console.error('获取用户名称失败:', error);
            return '未知';
        }
    }

    async function fetchShareInfo() {
        shareInfo.shareCode = getShareCode();
        if (__lastShareCode !== shareInfo.shareCode) {
            __lastShareCode = shareInfo.shareCode;
            __verificationCompleted = false;
            __verifiedOK = false;
            __autoConfirm = { key: null, inProgress: false, done: false };
            __verifiedPassword = null;
        }
        if (!shareInfo.shareCode) {
            shareDetails.innerHTML = '当前URL不是有效的115分享链接';
            return;
        }

        const apiUrl = `https://115cdn.com/webapi/share/snap?share_code=${shareInfo.shareCode}`;
        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            onload: async function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    const showOwner = GM_getValue('enableShareOwnerInfo', false);
                    const shareState = data?.data?.shareinfo?.state;

                    if (data.state === false) {
                        const errorMsg = data.error || '未知错误';
                        const userId = showOwner ? (data.data?.userinfo?.user_id || '未知') : '';
                        const face = showOwner ? (data.data?.userinfo?.face || '') : '';
                        const userName = showOwner ? await getUserNameByUserId(userId) : '';
                        shareDetails.innerHTML = `
<div class="share-row">
<div class="share-left">
<div class="share-info">
${showOwner && face ? `<img src="${face}" class="share-avatar">` : ''}
<div class="share-text">
${showOwner ? `用户ID：<span class="highlight">${userId}</span><br>` : ''}
${showOwner ? `用户名：<span class="highlight">${userName}</span><br>` : ''}
分享链接：<a class="highlight share-link" href="https://115cdn.com/s/${shareInfo.shareCode}" target="_blank" rel="noopener noreferrer">https://115cdn.com/s/${shareInfo.shareCode}</a><br>
</div>
<div class="share-status"><span class="highlight-warning">${errorMsg}</span></div>
`;
                        ensurePasswordChecks();
                        return;
                    }

                    if (shareState === -1) {
                        const errorMsg = '分享已取消';
                        const userId = showOwner ? (data.data?.userinfo?.user_id || '未知') : '';
                        const face = showOwner ? (data.data?.userinfo?.face || '') : '';
                        const userName = showOwner ? await getUserNameByUserId(userId) : '';
                        shareDetails.innerHTML = `
<div class="share-row">
  <div class="share-left">
    <div class="share-info">
      ${showOwner && face ? `<img src="${face}" class="share-avatar">` : ''}
      <div class="share-text">
        ${showOwner ? `用户ID：<span class="highlight">${userId}</span><br>` : ''}
        ${showOwner ? `用户名：<span class="highlight">${userName}</span><br>` : ''}
        分享链接：<a class="highlight share-link" href="https://115cdn.com/s/${shareInfo.shareCode}" target="_blank" rel="noopener noreferrer">https://115cdn.com/s/${shareInfo.shareCode}</a><br>
      </div>
      <div class="share-status"><span class="highlight-warning">${errorMsg}</span></div>
    </div>
  </div>
</div>
`;
                        ensurePasswordChecks();
                        return;
                    }

                    if (showOwner) {
                        shareInfo.userId = data.data?.userinfo?.user_id || '未知';
                        shareInfo.face = data.data?.userinfo?.face || '';
                    }
                    shareInfo.isAccessible = true;
                    shareInfo.shareTitle = processShareTitle(data);
                    shareInfo.expireTime = data.data?.shareinfo?.expire_time || -1;
                    shareInfo.fileSize = parseInt(data.data?.shareinfo?.file_size || '0');
                    shareInfo.autoRenewal = String(data.data?.shareinfo?.auto_renewal || '0');

                    const receiveCodeElement = document.querySelector('em[rel="receive_code"]');
                    const receiveCode = receiveCodeElement ? receiveCodeElement.textContent.trim() : '未找到';
                    const userName = showOwner ? await getUserNameByUserId(shareInfo.userId) : '';

                    const formRow = document.querySelector('.form-row');
                    const btnGroup = document.querySelector('.btn-group');
                    const stats = document.querySelector('.stats');
                    try { if (formRow) formRow.style.display = 'none'; } catch (e) {}
                    try { if (btnGroup) btnGroup.style.display = 'none'; } catch (e) {}
                    try { if (stats) stats.style.display = 'none'; } catch (e) {}

                    if (receiveCodeElement) {
                        shareDetails.innerHTML = `
<div class="share-row">
  <div class="share-left">
    <div class="share-info">
      ${showOwner && shareInfo.face ? `<img src="${shareInfo.face}" class="share-avatar">` : ''}
      <div class="share-text">
        ${showOwner ? `用户ID：<span class="highlight">${shareInfo.userId}</span><br>` : ''}
        ${showOwner ? `用户名：<span class="highlight">${userName}</span><br>` : ''}
        分享链接：
        ${(() => { const base=`https://115cdn.com/s/${shareInfo.shareCode}`; const pwd=(receiveCode && receiveCode !== '未找到') ? `?password=${encodeURIComponent(receiveCode)}` : ''; const url=base + pwd; return `<a class="highlight share-link" href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`; })()}<br>
        访问密码: <span class="highlight-success">${receiveCode}</span><br>
        文件大小: <span class="highlight">${formatFileSize(shareInfo.fileSize)}</span><br>
        ${shareInfo.autoRenewal === '1' ? '<span class="auto-renewal-tag">自动续期</span>' : ''}
      </div>
    </div>
  </div>
  <div class="share-right">
    <span class="highlight-success">无需访问码</span>
  </div>
</div>
`;
                    } else {
                        shareDetails.innerHTML = `
<div class="share-row">
  <div class="share-left">
    <div class="share-info">
      ${showOwner && shareInfo.face ? `<img src="${shareInfo.face}" class="share-avatar">` : ''}
      <div class="share-text">
        ${showOwner ? `用户ID：<span class=\"highlight\">${shareInfo.userId}</span><br>` : ''}
        ${showOwner ? `用户名：<span class=\"highlight\">${userName}</span><br>` : ''}
        分享链接：
        ${(() => { const base=`https://115cdn.com/s/${shareInfo.shareCode}`; const pwd=(typeof __verifiedOK !== 'undefined' && __verifiedOK && __verifiedPassword) ? `?password=${encodeURIComponent(__verifiedPassword)}` : ''; const url=base + pwd; return `<a class=\"highlight share-link\" href=\"${url}\" target=\"_blank\" rel=\"noopener noreferrer\">${url}</a>`; })()}<br>
      </div>
      <div class="share-status"><span class="highlight-warning">请输入访问码</span></div>
    </div>
  </div>
</div>
`;
                        try { checkStoredPassword(); } catch (e) {}
                        try { setupManualPasswordDetection(); } catch (e) {}
                    }

                    saveToStorage(shareInfo.shareCode, receiveCode, '自动保存的访问码', shareInfo.shareTitle, shareInfo.expireTime, shareInfo.fileSize, shareInfo.autoRenewal, '');
                    if (!__verificationCompleted) { try { autoFillPassword(receiveCode); } catch (e) {} }

                    ensurePasswordChecks({ onlyIfNotCompleted: true });
                } catch (e) {
                    shareDetails.innerHTML = '解析分享信息失败: ' + e.message;
                }
            },
            onerror: function(error) {
                shareDetails.innerHTML = '获取分享信息失败: ' + (error.error || '网络错误');
            }
        });
    }

    function ensurePasswordChecks(opts = {}) {
        const onlyIfNotCompleted = !!(opts && opts.onlyIfNotCompleted);
        if (onlyIfNotCompleted) {
            if (!__verificationCompleted) { try { checkCurrentUrlPassword(); } catch (e) {} }
            if (!__verificationCompleted) { try { checkStoredPassword(); } catch (e) {} }
        } else {
            try { checkCurrentUrlPassword(); } catch (e) {}
            try { checkStoredPassword(); } catch (e) {}
        }
        try { setupManualPasswordDetection(); } catch (e) {}
    }

    function setupManualPasswordDetection() {
        const formDecode = document.querySelector('.form-decode');
        if (!formDecode) return;
        const input = formDecode.querySelector('.text');
        const confirmBtn = formDecode.querySelector('.button.btn-large');
        if (!input || !confirmBtn) return;
        if (__verificationCompleted || __verifiedOK) return;
        if (confirmBtn.dataset.vpaBound === '1') return;
        confirmBtn.dataset.vpaBound = '1';

        try {
            const err = formDecode.querySelector('.error-txt');
            const hideErr = () => { if (err) { err.style.display = 'none'; err.textContent = ''; } };
            hideErr();
            input.addEventListener('input', () => {
                if (input.value && input.value.trim()) hideErr();
            });
        } catch (e) {}

        confirmBtn.addEventListener('click', function() {
            const password = input.value.trim();
            const shareCode = getShareCode();
            if (!password || !shareCode) return;

            checkPasswordCorrect(shareCode, password, (isCorrect, responseData) => {
                if (isCorrect) {
                    const storageKey = generateStorageKey(shareCode, responseData?.ed2k, responseData?.magnet);
                    const storedData = GM_getValue(storageKey);
                    let note = '';
                    if (storedData) {
                        try {
                            const data = JSON.parse(storedData);
                            note = data.note || '';
                        } catch (e) {
                            console.error('解析存储数据失败:', e);
                        }
                    }
                                            saveToStorage(shareCode, password, note, responseData?.shareTitle, responseData?.expireTime, responseData?.fileSize, String(responseData?.autoRenewal || '0'), responseData?.ed2k);
                    renderStorage(false);

                    try { applySuccessUI(password); } catch (e) {}

                    try { setTimeout(() => { try { fetchShareInfo(); } catch (e) {} }, 600); } catch (e) {}

                    try {
                        __verifiedOK = true;
                        __verificationCompleted = true;
                        ensureErrorObserver();
                        suppressAccessCodeErrors(document);
                        const err = formDecode.querySelector('.error-txt');
                        if (err) { err.style.display = 'none'; err.textContent = ''; }
                        const err2 = formDecode.querySelector('[data="error"]');
                        if (err2) { err2.style.display = 'none'; err2.textContent = ''; }
                        confirmBtn.classList.remove('btn-gray');
                        confirmBtn.classList.remove('disabled');
                        confirmBtn.classList.remove('z-dis');
                        confirmBtn.removeAttribute('disabled');
                        confirmBtn.setAttribute('aria-disabled', 'false');
                    } catch (e) {}
                }
            });
        });
    }

    let __autoConfirm = { key: null, inProgress: false, done: false };
    let __verifiedOK = false;
    let __verificationCompleted = false;
    let __errorObserverStarted = false;
    let __lastShareCode = null;
    let __verifiedPassword = null;

    function suppressAccessCodeErrors(root = document) {
        try {
            const candidates = [];
            const q = (sel) => { try { candidates.push(...root.querySelectorAll(sel)); } catch (e) {} };
            q('.form-decode .error-txt');
            q('.error-txt');
            q('[data="error"]');
            if (__verifiedOK) {
                try {
                    const warns = root.querySelectorAll?.('.share-status');
                    warns && warns.forEach(w => {
                        try { if (w.classList && w.classList.contains('verified-password')) return; } catch (e) {}
                        try {
                            const t = (w.textContent || '').trim();
                            if (t.includes('请输入访问码') || t.includes('请输入链接访问码')) {
                                w.remove();
                            }
                        } catch (e) {
                            try {
                                if (!(w.classList && w.classList.contains('verified-password'))) {
                                    w.style.display = 'none';
                                }
                            } catch (e2) {}
                        }
                    });
                } catch (e) {}
            }
            try {
                const all = root.querySelectorAll('*');
                for (const el of all) {
                    if (!el) continue;
                    if (el.children && el.children.length) continue;
                    const txt = (el.textContent || '').trim();
                    if (txt === '请输入访问码' || txt === '请输入链接访问码') {
                        candidates.push(el);
                    }
                }
            } catch (e) {}
            let n = 0;
            for (const el of new Set(candidates)) {
                try {
                    const container = el.closest ? el.closest('.share-status') : null;
                    if (container && container.classList && container.classList.contains('verified-password')) {
                        continue;
                    }
                    el.style.display = 'none'; n++;
                } catch (e) {}
            }
            return n;
        } catch (e) { return 0; }
    }

    function ensureErrorObserver() {
        if (__errorObserverStarted) return;
        __errorObserverStarted = true;
        try {
            const obs = new MutationObserver(() => {
                if (!__verifiedOK) return;
                suppressAccessCodeErrors(document);
                ensureShareStatusKeepAlive();
            });
            const target = document.documentElement || document.body;
            if (target) obs.observe(target, { childList: true, subtree: true });
            suppressAccessCodeErrors(document);
            ensureShareStatusKeepAlive();
        } catch (e) {}
    }

    function applySuccessUI(password) {
        try {
            __verifiedPassword = password;
            try {
                const sd = document.querySelector('.status.status-div, .status-div');
                if (sd) {
                    sd.innerHTML = '';
                    sd.classList.remove('active');
                    sd.style.display = 'none';
                }
            } catch (e) {}

            let warn = document.querySelector('.share-info .share-status') || document.querySelector('.share-status');
            if (warn) {
                let inner = null;
                try { inner = warn.querySelector('.highlight-warning'); } catch (e) { inner = null; }
                if (inner) {
                    try { inner.classList.remove('highlight-warning'); } catch (e) {}
                    try { inner.classList.add('verified-password-text'); } catch (e) {}
                    inner.textContent = `访问密码：${password}`;
                } else {
                    const span = document.createElement('span');
                    span.className = 'verified-password-text';
                    span.textContent = `访问密码：${password}`;
                    try { warn.innerHTML = ''; } catch (e) { warn.textContent = ''; }
                    warn.appendChild(span);
                }
                try { warn.classList.add('verified-password'); } catch (e) {}
                try { warn.style.display = ''; } catch (e) {}
                try {
                    const textBlock = document.querySelector('.share-info .share-text');
                    if (textBlock) {
                        let link = textBlock.querySelector('a.share-link');
                        if (link) {
                            const base = (link.getAttribute('href') || link.textContent || '').split('?')[0];
                            const url = `${base}?password=${encodeURIComponent(password)}`;
                            link.setAttribute('href', url);
                            link.textContent = url;
                        } else {
                            const spans = textBlock.querySelectorAll('span.highlight');
                            for (const s of spans) {
                                const t = (s.textContent || '').trim();
                                if (t.startsWith('https://115cdn.com/s/')) {
                                    const base = t.split('?')[0];
                                    s.textContent = `${base}?password=${encodeURIComponent(password)}`;
                                    break;
                                }
                            }
                        }
                    }
                } catch (e) {}
                return;
            }
            const info = document.querySelector('.share-info');
            if (info) {
                const div = document.createElement('div');
                div.className = 'share-status verified-password';
                const span = document.createElement('span');
                span.className = 'verified-password-text';
                span.textContent = `访问密码：${password}`;
                div.appendChild(span);
                info.appendChild(div);
            }
            try {
                const textBlock = document.querySelector('.share-info .share-text');
                if (textBlock) {
                    let link = textBlock.querySelector('a.share-link');
                    if (link) {
                        const base = (link.getAttribute('href') || link.textContent || '').split('?')[0];
                        const url = `${base}?password=${encodeURIComponent(password)}`;
                        link.setAttribute('href', url);
                        link.textContent = url;
                    } else {
                        const spans = textBlock.querySelectorAll('span.highlight');
                        for (const s of spans) {
                            const t = (s.textContent || '').trim();
                            if (t.startsWith('https://115cdn.com/s/')) {
                                const base = t.split('?')[0];
                                s.textContent = `${base}?password=${encodeURIComponent(password)}`;
                                break;
                            }
                        }
                    }
                }
            } catch (e) {}
        } catch (e) {}
    }

    function ensureShareStatusKeepAlive() {
        try {
            if (!__verifiedOK || !__verifiedPassword) return;
            let container = document.querySelector('.share-info .share-status.verified-password') || document.querySelector('.share-status.verified-password');
            const expected = `访问密码：${__verifiedPassword}`;
            if (container) {
                let span = null;
                try { span = container.querySelector('.verified-password-text'); } catch (e) { span = null; }
                if (!span) {
                    span = document.createElement('span');
                    span.className = 'verified-password-text';
                    span.textContent = expected;
                    try { container.innerHTML = ''; } catch (e) { container.textContent = ''; }
                    container.appendChild(span);
                } else {
                    if (span.textContent !== expected) span.textContent = expected;
                }
                try { container.classList.add('verified-password'); } catch (e) {}
                try { container.style.display = ''; } catch (e) {}
                return;
            }
            applySuccessUI(__verifiedPassword);
        } catch (e) {}
    }

    function setShareStatusTransient(text) {
        try {
            if (__verifiedOK) return;
            let container = document.querySelector('.share-info .share-status:not(.verified-password)') || document.querySelector('.share-status:not(.verified-password)');
            if (!container) {
                const info = document.querySelector('.share-info');
                if (info) {
                    container = document.createElement('div');
                    container.className = 'share-status transient-status';
                    info.appendChild(container);
                }
            } else {
                try { container.classList.remove('verified-password'); } catch (e) {}
                try { container.classList.add('transient-status'); } catch (e) {}
            }
            if (!container) return;
            const span = container.querySelector('.verified-password-text, .transient-text') || document.createElement('span');
            span.className = 'transient-text';
            span.textContent = text;
            if (!span.parentNode) {
                try { container.innerHTML = ''; } catch (e) { container.textContent = ''; }
                container.appendChild(span);
            }
            try { container.style.display = ''; } catch (e) {}
        } catch (e) {}
    }

    function clearTransientShareStatus() {
        try {
            const container = document.querySelector('.share-info .share-status.transient-status') || document.querySelector('.share-status.transient-status');
            if (container && !container.classList.contains('verified-password')) {
                try { container.innerHTML = ''; } catch (e) { container.textContent = ''; }
                try { container.style.display = 'none'; } catch (e) {}
                try { container.classList.remove('transient-status'); } catch (e) {}
            }
        } catch (e) {}
    }

    function autoFillPassword(password) {
        const enableAutoConfirm = GM_getValue('enableAutoConfirm', true);
        if (!enableAutoConfirm) return;
        if (__verificationCompleted) return;

        let sc = '';
        try { sc = getShareCode ? (getShareCode() || '') : ''; } catch (e) { sc = ''; }
        const key = `${sc}|${password || ''}`;
        if (__autoConfirm.key === key && (__autoConfirm.inProgress || __autoConfirm.done)) {
            try { console.debug('[自动确认] 跳过重复执行', __autoConfirm); } catch (e) {}
            return;
        }
        __autoConfirm.key = key;
        __autoConfirm.inProgress = true;
        __autoConfirm.done = false;


        const tryOnceInRoot = (root) => {
            const input = root.querySelector?.('.form-decode .text');
            let confirmBtn = root.querySelector?.('.form-decode [btn="confirm"]');
            if (!confirmBtn) confirmBtn = root.querySelector?.('.form-decode .button.btn-large');
            if (input && confirmBtn) {
                try { console.debug('[自动确认] 已找到输入框和确认按钮', { root, input, confirmBtn }); } catch (e) {}
                input.focus();
                try {
                    const win = input.ownerDocument?.defaultView || window;
                    const proto = Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype, 'value');
                    if (proto && proto.set) proto.set.call(input, password);
                    else input.value = password;
                    if (input._valueTracker) input._valueTracker.setValue('');
                } catch (e) { input.value = password; }
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.dispatchEvent(new Event('blur', { bubbles: true }));

                try {
                    const err = (root.querySelector?.('.form-decode .error-txt') || root.querySelector?.('.error-txt'));
                    if (err) { err.style.display = 'none'; err.textContent = ''; }
                    const err2 = (root.querySelector?.('.form-decode [data="error"]') || root.querySelector?.('[data="error"]'));
                    if (err2) { err2.style.display = 'none'; err2.textContent = ''; }
                } catch (e) {}
                try { confirmBtn.classList.remove('btn-gray'); } catch (e) {}
                try { confirmBtn.classList.remove('disabled'); } catch (e) {}
                try { confirmBtn.classList.remove('z-dis'); } catch (e) {}
                try { confirmBtn.removeAttribute('disabled'); } catch (e) {}
                try { confirmBtn.setAttribute('aria-disabled', 'false'); } catch (e) {}

                const isUnclickable = (btn) => {
                    try {
                        const cs = window.getComputedStyle(btn);
                        const disabledAttr = btn.hasAttribute('disabled') || btn.getAttribute('aria-disabled') === 'true' || btn.disabled === true;
                        const disabledClass = btn.classList.contains('disabled') || btn.classList.contains('z-dis') || btn.classList.contains('btn-gray');
                        const styleBlocked = cs && (cs.pointerEvents === 'none' || cs.display === 'none' || cs.visibility === 'hidden');
                        return disabledAttr || disabledClass || styleBlocked;
                    } catch (e) { return false; }
                };

                const doClickPrimary = (btn) => {
                    try { btn.click(); } catch (e) {}
                    try { console.debug('[自动确认] 执行 click() 一次', btn); } catch (e) {}
                };

                const doClickFallback = (btn) => {
                    try { btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); } catch (e) {}
                    try { btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); } catch (e) {}
                    try { btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true })); } catch (e) {}
                    try { btn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true })); } catch (e) {}
                    try { btn.click(); } catch (e) {}
                    try { console.debug('[自动确认] 已触发回退点击事件', btn); } catch (e) {}
                };

                setTimeout(() => {
                    if (__verificationCompleted) { __autoConfirm.done = true; return; }
                    try {
                        const formEl = confirmBtn.closest('form') || input.closest('form');
                        if (formEl) formEl.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                    } catch (e) {}
                    if (isUnclickable(confirmBtn)) {
                        doClickFallback(confirmBtn);
                    } else {
                        doClickPrimary(confirmBtn);
                    }
                    __autoConfirm.done = true;
                    try {
                        const stillForm = !!(root.querySelector?.('.form-decode'));
                        if (stillForm) {
                            setTimeout(() => { if (!__verificationCompleted) { try { doClickPrimary(confirmBtn); } catch (e) {} } }, 400);
                            setTimeout(() => { if (!__verificationCompleted) { try { doClickFallback(confirmBtn); } catch (e) {} } }, 800);
                        }
                    } catch (e) {}
                }, 150);
                return true;
            }
            return false;
        };

        let tries = 0;
        const maxTries = 80;
        const timer = setInterval(() => {
            tries++;
            try { console.debug('[自动确认] 尝试次数', tries); } catch (e) {}
            let ok = false;
            try {
                const tryDocAndShadows = (doc) => {
                    if (tryOnceInRoot(doc)) return true;
                    const all = doc.querySelectorAll('*');
                    for (const el of all) {
                        const sr = el.shadowRoot;
                        if (sr && tryOnceInRoot(sr)) return true;
                    }
                    return false;
                };

                ok = tryDocAndShadows(document);
                if (!ok) {
                    const iframes = document.querySelectorAll('iframe');
                    for (const f of iframes) {
                        try {
                            const doc = f.contentDocument || f.contentWindow?.document;
                            if (doc && tryDocAndShadows(doc)) { ok = true; break; }
                        } catch (e) {}
                    }
                }
            } catch (e) {}

            if (ok || tries >= maxTries) {
                clearInterval(timer);
                try { console.debug('[自动确认] 完成', { ok, tries }); } catch (e) {}
                __autoConfirm.inProgress = false;
                if (!ok) {
                    __autoConfirm.done = true;
                }
            }
        }, 100);
    }

    function checkStoredPassword() {
        const enableAutoConfirm = GM_getValue('enableAutoConfirm', true);
        if (!enableAutoConfirm) {
            return;
        }

        const shareCode = getShareCode();
        if (!shareCode) return;
        const storageKey = generateStorageKey(shareCode, shareInfo.ed2k, shareInfo.magnet);
        const storedData = GM_getValue(storageKey);
        if (storedData) {
            try {
                const data = JSON.parse(storedData);
                autoFillPassword(data.password);
            } catch (e) {
                console.error('解析存储数据失败:', e);
            }
        }
    }

    function setupDrag(element, handle) {
        let isDragging = false;
        let startX, startY;
        let translateX = 0, translateY = 0;
        let moved = false;

        const style = window.getComputedStyle(element);
        const matrix = new DOMMatrix(style.transform);
        translateX = matrix.m41;
        translateY = matrix.m42;

        const onMouseDown = (e) => {
            if (e.button !== 0) return;
            const tag = e.target.tagName;
            if (["INPUT","TEXTAREA","BUTTON","SELECT"].includes(tag)) return;
            isDragging = true;
            moved = false;
            startX = e.clientX;
            startY = e.clientY;
            element.style.cursor = 'grabbing';
            element.style.transition = 'none';
            e.preventDefault();
            document.body.style.userSelect = 'none';
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
                moved = true;
            }

            translateX += dx;
            translateY += dy;
            element.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
            startX = e.clientX;
            startY = e.clientY;

            const rect = element.getBoundingClientRect();
            if (rect.left < 0) {
                translateX -= rect.left;
                element.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
            }
            if (rect.top < 0) {
                translateY -= rect.top;
                element.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
            }
            if (rect.right > window.innerWidth) {
                translateX -= (rect.right - window.innerWidth);
                element.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
            }
            if (rect.bottom > window.innerHeight) {
                translateY -= (rect.bottom - window.innerHeight);
                element.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
            }
        };

        const onMouseUp = () => {
            if (!isDragging) return;
            isDragging = false;
            element.style.cursor = 'move';
            element.style.transition = 'all 0.3s ease';
            document.body.style.userSelect = '';

            if (!moved && element === floatingBtn) {
                floatingBtn.click();
            }
        };

        handle.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        return {
            setPosition: (x, y) => {
                translateX = x;
                translateY = y;
                element.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
            }
        };
    }

    function setupMaximizeButton() {
        const maximizeBtn = windowElement.querySelector('.window-maximize');
        const windowHeader = windowElement.querySelector('.window-header');
        let isMaximized = false;
        let originalPosition = { x: 0, y: 0 };
        let originalSize = { width: 600, height: '' };
        let originalTabContentHeight = {};

        tabContents.forEach(tabContent => {
            const tabName = tabContent.getAttribute('data-tab-content');
            originalTabContentHeight[tabName] = tabContent.style.height;
        });

        maximizeBtn.title = '最大化';

        function toggleMaximize() {
            isMaximized = !isMaximized;
            const storageTabContent = windowElement.querySelector('.storage-tab-content[data-tab-content="storage"]');
            const storageContainer = windowElement.querySelector('#storage-container');
            if (isMaximized) {
                const style = window.getComputedStyle(windowElement);
                const matrix = new DOMMatrix(style.transform);
                originalPosition = { x: matrix.m41, y: matrix.m42 };
                originalSize = {
                    width: parseInt(style.width),
                    height: windowElement.style.height
                };
                const activeTab = document.querySelector('.storage-tab-content.active');
                if (activeTab) {
                    const tabName = activeTab.getAttribute('data-tab-content');
                    originalTabContentHeight[tabName] = activeTab.style.height;
                }
                windowElement.classList.add('maximized');
                windowDrag.setPosition(0, 0);
                maximizeBtn.title = '还原';
                if (storageTabContent && storageContainer) {
                    const topHeight = storageTabContent.offsetTop + storageContainer.offsetTop;
                    storageContainer.style.maxHeight = `calc(100vh - ${topHeight + 40}px)`;
                }
                const batchShareFlex = document.querySelector('#batch-share-flex-row');
                if (batchShareFlex) batchShareFlex.style.width = '100%';

                const batchReceiveResult = document.querySelector('#batch-receive-result');
                if (batchReceiveResult && batchReceiveResult.style.display !== 'none') {
                    batchReceiveResult.style.height = 'calc(100vh - 360px)';
                    batchReceiveResult.style.minHeight = '200px';
                }
            } else {
                windowElement.classList.remove('maximized');
                windowElement.style.width = `${originalSize.width}px`;
                windowElement.style.height = originalSize.height;
                windowDrag.setPosition(originalPosition.x, originalPosition.y);
                maximizeBtn.title = '最大化';
                if (storageContainer) {
                    storageContainer.style.maxHeight = '';
                }
                const batchShareFlex = document.querySelector('#batch-share-flex-row');
                if (batchShareFlex) batchShareFlex.style.width = '';

                const batchReceiveResult = document.querySelector('#batch-receive-result');
                if (batchReceiveResult && batchReceiveResult.style.display !== 'none') {

                    batchReceiveResult.style.height = '';
                    batchReceiveResult.style.minHeight = '';
                }
            }
        }

        maximizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMaximize();
        });

        windowHeader.addEventListener('dblclick', (e) => {
            if (e.target.closest('button')) return;
            toggleMaximize();
        });

        maximizeBtn.addEventListener('mouseover', () => {
            maximizeBtn.title = isMaximized ? '还原' : '最大化';
        });
    }

    if (performance.navigation.type === 1) {
        localStorage.removeItem('batchRecognizeResults');
    }

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab');
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const activeTabContent = document.querySelector(`.storage-tab-content[data-tab-content="${tabName}"]`);
        activeTabContent.classList.add('active');

        if (tabName === 'settings') renderSettingsPage();
        if (tabName === 'batchreceive') renderBatchReceivePage();
        if (tabName === 'batchrecognize') {

            const results = JSON.parse(localStorage.getItem('batchRecognizeResults') || '[]');
            if (results.length > 0) {

                const batchRecognizeContainer = document.getElementById('batch-recognize-container');
                if (!batchRecognizeContainer.querySelector('#batch-recognize-input-container')) {
                    renderBatchRecognizePage();
                } else {

                    const inputContainer = batchRecognizeContainer.querySelector('#batch-recognize-input-container');
                    if (inputContainer.style.display !== 'none') {

                        const controlsContainer = batchRecognizeContainer.querySelector('.batch-recognize-controls');
                        const settingsGroup = controlsContainer.querySelector('.batch-recognize-settings-group');
                        const progressWrap = batchRecognizeContainer.querySelector('#batch-recognize-progress');
                        const exportBtn = batchRecognizeContainer.querySelector('#batch-recognize-export-btn');
                        const startBtn = batchRecognizeContainer.querySelector('#batch-recognize-start-btn');
                        const backBtn = batchRecognizeContainer.querySelector('#batch-recognize-back-btn');
                        const resultDiv = batchRecognizeContainer.querySelector('#batch-recognize-result');
                        const progressText = batchRecognizeContainer.querySelector('#progress-text');

                        inputContainer.style.display = 'none';
                        if (settingsGroup) {
                            settingsGroup.style.display = 'none';
                        }
                        controlsContainer.style.display = 'flex';
                        resultDiv.style.display = 'block';
                        progressWrap.style.display = 'block';
                        exportBtn.style.display = 'inline-block';
                        startBtn.style.display = 'none';
                        backBtn.style.display = 'inline-block';

                        const successCount = results.filter(r => r.success).length;
                        const failedCount = results.filter(r => !r.success && !r.skipped).length;
                        const skippedCount = results.filter(r => r.skipped).length;
                        const totalItems = results.length;

                        const statusHtml = `<span class="batch-recognize-status-display">
                            <span class="status-label">总数: ${totalItems}项</span>
                            <span class="status-separator">|</span>
                            <span class="status-success">成功: ${successCount}项</span>
                            <span class="status-separator">|</span>
                            <span class="status-warning">跳过: ${skippedCount}项</span>
                            <span class="status-separator">|</span>
                            <span class="status-error">失败: ${failedCount}项</span>
                        </span>`;

                        progressText.innerHTML = statusHtml;

                        const showResult = () => {
                            resultDiv.style.display = 'block';
                            const windowElement = document.querySelector('.window');
                            const isMaximized = windowElement && windowElement.classList.contains('maximized');
                            if (isMaximized) {
                                resultDiv.style.height = 'calc(100vh - 360px)';
                                resultDiv.style.minHeight = '200px';
                            } else {

                                resultDiv.style.height = '';
                            }

                            const reversedResults = [...results].reverse();
                            resultDiv.innerHTML = reversedResults.map((r, index) => {
                                const originalIndex = results.length - 1 - index;
                                const shareLink = r.shareLink || (r.ed2k ? r.ed2k : `https://115cdn.com/s/${r.shareCode}?password=${r.password}`);
                                const title = r.title || r.shareTitle || '无标题';

                                const fileSizeTag = r.fileSize && r.fileSize > 0 ?
                                    `<span class="batch-recognize-file-size">${formatFileSize(r.fileSize)}</span>` : '';

                                let statusClass = 'error';
                                let statusText = r.msg || '识别失败';

                                if (r.success) {
                                    statusClass = 'success';
                                    statusText = r.msg || '识别成功';
                                } else if (r.skipped) {
                                    statusClass = 'warning';
                                    statusText = r.msg || '已跳过';
                                }

                                return `<div class="batch-result-item compact-layout ${statusClass}" data-index="${originalIndex}">
                                    <div class="batch-result-item-title">
                                        <div>
                                            ${fileSizeTag}
                                            <span class="batch-recognize-file-name" title="${title}">${title}</span>
                                        </div>
                                        <div class="batch-result-item-actions">
                                            <button class="storage-item-btn copy-btn">复制</button>
                                            ${r.success ? '<button class="storage-item-btn open-btn">打开</button>' : ''}
                                        </div>
                                    </div>
                                    <div class="batch-result-item-details">
                                        <span class="batch-result-link" title="点击打开链接" data-link="${shareLink}">${shareLink}</span>
                                        <span class="batch-result-status ${statusClass}">${statusText}</span>
                                    </div>
                                </div>`;
                            }).join('');

                            reversedResults.forEach((r, displayIndex) => {
                                const originalIndex = results.length - 1 - displayIndex;
                                const item = resultDiv.querySelector(`[data-index="${originalIndex}"]`);
                                const copyBtn = item.querySelector('.copy-btn');
                                const linkSpan = item.querySelector('.batch-result-link');
                                const shareLink = r.shareLink || (r.ed2k ? r.ed2k : `https://115cdn.com/s/${r.shareCode}?password=${r.password}`);
                                const title = r.title || r.shareTitle || '无标题';

                                copyBtn.addEventListener('click', () => {
                                    if (copyBtn._copyTimer) clearTimeout(copyBtn._copyTimer);
                                    const text = r.ed2k ? r.ed2k : `${shareLink}#\n${title}`;
                                    navigator.clipboard.writeText(text).then(() => {
                                        copyBtn.textContent = '已复制';
                                        copyBtn.classList.add('copied');
                                        copyBtn._copyTimer = setTimeout(() => {
                                            copyBtn.textContent = '复制';
                                            copyBtn.classList.remove('copied');
                                            copyBtn._copyTimer = null;
                                        }, 1000);
                                    }).catch(() => alert('复制失败'));
                                });

                                linkSpan.addEventListener('click', () => {
                                    if (r.ed2k) {
                                        navigator.clipboard.writeText(r.ed2k).then(() => {
                                            alert('ED2K链接已复制到剪贴板');
                                        }).catch(() => alert('复制失败'));
                                    } else {
                                        window.open(shareLink, '_blank');
                                    }
                                });

                                const openBtn = item.querySelector('.open-btn');
                                if (openBtn) {
                                    openBtn.addEventListener('click', () => {
                                        if (r.ed2k) {
                                            navigator.clipboard.writeText(r.ed2k).then(() => {
                                                alert('ED2K链接已复制到剪贴板');
                                            }).catch(() => alert('复制失败'));
                                        } else {
                                            window.open(shareLink, '_blank');
                                        }
                                    });
                                }
                            });
                        };

                        showResult();
                    }
                }
            } else {
                renderBatchRecognizePage();
            }
        }
        if (tabName === 'batchshare') renderBatchSharePage();
        if (tabName === 'dedupe') renderDedupePage();
    });
});

    const btnDrag = setupDrag(floatingBtn, floatingBtn);
    const windowDrag = setupDrag(windowElement, windowElement);
    btnDrag.setPosition(0, 0);
    windowDrag.setPosition(0, 0);

    floatingBtn.addEventListener('click', (e) => {
        if (e.defaultPrevented || e.target !== floatingBtn) return;
        let count = 0;
        try {
            const iframe = document.querySelector('iframe');
            const iframeWindow = iframe?.contentWindow || unsafeWindow;
            const selectDOM = iframeWindow?.document?.querySelectorAll('div.list-contents > ul li.selected');
            count = selectDOM ? selectDOM.length : 0;
        } catch(e) { count = 0; }
        if (count > 0) {
            openWindowAndActivate('batchshare');
        } else {
            openWindowAndActivate('storage');
        }
    });

    windowElement.querySelector('.window-close').addEventListener('click', () => {
        windowElement.style.display = 'none';
    });

    let isRunning = false;
    let isPaused = false;
    let currentAttempt = 0;
    let totalAttempts = 0;
    let startTime = 0;
    let pauseStartTime = 0;
    let totalPausedTime = 0;
    let currentPassword = '';
    let triedPasswords = new Set();
    let currentIndex = 0;
    let activeRequests = 0;
    let maxConcurrent = 10;
    let correctPassword = null;
    let currentStatus = 'stopped';

    function setupProTagEdit() {
        const proTag = windowElement.querySelector('.pro-tag');
        const proTagInput = windowElement.querySelector('.pro-tag-input');

        if (!proTag || !proTagInput) return;

        const savedContent = localStorage.getItem('proTagCustomContent');
        if (savedContent) {
            proTag.textContent = savedContent;
            proTagInput.value = savedContent;
        }

        function updateProTagStyle() {
            const currentText = proTag.textContent.trim();
            const defaultText = 'GreasyFork：wangzijian0@vip.qq.com';

            if (currentText.toLowerCase() === defaultText.toLowerCase()) {
                proTag.classList.add('golden');
            } else {
                proTag.classList.remove('golden');
            }
        }

        updateProTagStyle();

        proTag.addEventListener('dblclick', () => {
            proTag.style.display = 'none';
            proTagInput.style.display = 'inline-block';
            proTagInput.focus();
            proTagInput.select();
        });

        const handleClickOutside = (e) => {
            if (!proTagInput.contains(e.target) && !proTag.contains(e.target)) {
                const newValue = proTagInput.value.trim();
                if (newValue) {
                    proTag.textContent = newValue;
                    localStorage.setItem('proTagCustomContent', newValue);
                } else {
                    const defaultValue = 'GreasyFork：wangzijian0@vip.qq.com';
                    proTag.textContent = defaultValue;
                    proTagInput.value = defaultValue;
                    localStorage.removeItem('proTagCustomContent');
                }
                updateProTagStyle();
                proTag.style.display = 'inline';
                proTagInput.style.display = 'none';
                document.removeEventListener('click', handleClickOutside);
            }
        };

        proTagInput.addEventListener('focus', () => {
            setTimeout(() => {
                document.addEventListener('click', handleClickOutside);
            }, 0);
        });

        proTagInput.addEventListener('blur', () => {
            const newValue = proTagInput.value.trim();
            if (newValue) {
                proTag.textContent = newValue;
                localStorage.setItem('proTagCustomContent', newValue);
            } else {
                const defaultValue = 'GreasyFork：wangzijian0@vip.qq.com';
                proTag.textContent = defaultValue;
                proTagInput.value = defaultValue;
                localStorage.removeItem('proTagCustomContent');
            }
            updateProTagStyle();
            proTag.style.display = 'inline';
            proTagInput.style.display = 'none';
            document.removeEventListener('click', handleClickOutside);
        });

        proTagInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                proTagInput.blur();
            }
        });

        proTagInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const savedContent = localStorage.getItem('proTagCustomContent') || 'GreasyFork：wangzijian0@vip.qq.com';
                proTag.textContent = savedContent;
                proTagInput.value = savedContent;
                updateProTagStyle();
                proTag.style.display = 'inline';
                proTagInput.style.display = 'none';
                document.removeEventListener('click', handleClickOutside);
            }
        });
    }

    function updateStatusTag() {
        try {
            statusTagContainer.innerHTML = '';
            statusTagContainer.style.display = 'none';
        } catch (e) {}
    }

    function updateStatsInfo() {
        const strategy = strategySelect.value;
        const chars = strategy.includes('digits') ? '0123456789' : allChars;
        totalAttempts = Math.pow(chars.length, 4);
        statsInfo.innerHTML = `
访问码组合: <span class="highlight">${totalAttempts.toLocaleString()}</span> 种 (字符集: ${chars.length}个)<br>
<div class="status-info-item">${strategy.includes('digits') ? '0123456789' : allChars}</div>
`;
    }

    function validateCharsInput(input) {
        charsError.textContent = '';
        if (input === '') {
            allChars = DEFAULT_CHARS;
            updateStatsInfo();
            return true;
        }

        const isDigitsMode = strategySelect.value.includes('digits');
        if (isDigitsMode) {
            const nonDigits = input.match(/[^0-9]/g);
            if (nonDigits) {
                charsError.textContent = `数字模式只允许数字，已移除字符: ${nonDigits.join(',')}`;
                const filtered = input.replace(/[^0-9]/g, '');
                charsInput.value = filtered;
                allChars = filtered || '0123456789';
                updateStatsInfo();
                return false;
            }
        }

        const uniqueChars = [...new Set(input.split(''))];
        if (uniqueChars.length !== input.length) {
            charsError.textContent = '已自动移除重复字符';
            const uniqueStr = uniqueChars.join('');
            charsInput.value = uniqueStr;
            allChars = uniqueStr;
            updateStatsInfo();
            return true;
        }

        if (!isDigitsMode) {
            const invalidChars = input.match(/[^0-9a-zA-Z]/g);
            if (invalidChars) {
                charsError.textContent = `已移除非法字符: ${invalidChars.join(',')} `;
                const filtered = input.replace(/[^0-9a-zA-Z]/g, '');
                charsInput.value = filtered;
                allChars = filtered || DEFAULT_CHARS;
                updateStatsInfo();
                return false;
            }
        }

        allChars = input;
        updateStatsInfo();
        return true;
    }

    function generateRandomPassword() {
        let password = '';
        const strategy = strategySelect.value;
        const chars = strategy.includes('digits') ? '0123456789' : allChars;
        for (let i = 0; i < 4; i++) password += chars[Math.floor(Math.random() * chars.length)];
        return password;
    }

    function generateSequentialPassword(index) {
        let password = '';
        let temp = index;
        const strategy = strategySelect.value;
        const chars = strategy.includes('digits') ? '0123456789' : allChars;
        for (let i = 0; i < 4; i++) {
            password = chars[temp % chars.length] + password;
            temp = Math.floor(temp / chars.length);
        }
        return password;
    }

    function checkPasswordCorrect(shareCode, password, callback, retryCount = 0) {
        if (!shareCode) {
            callback(false, { error: "缺少分享码" });
            return;
        }

        const apiUrl = `https://115cdn.com/webapi/share/snap?share_code=${shareCode}&offset=0&limit=20&receive_code=${password}`;
        activeRequests++;

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            timeout: 10000,
            onload: function(response) {
                activeRequests--;
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.state === true) {

                        const shareState = data.data?.shareinfo?.share_state;
                        const forbidReason = data.data?.shareinfo?.forbid_reason;

                        if (forbidReason) {
                            const errorMsg = forbidReason;
                            callback(false, {
                                error: errorMsg,
                                errno: data.errno,
                                errtype: data.errtype,
                                data: data.data,
                                rawResponse: data
                            });
                            return;
                        }

                        const userId = data.data?.user_id || '';
                        const shareTitle = processShareTitle(data);
                        const expireTime = data.data?.shareinfo?.expire_time || -1;
                        const fileSize = parseInt(data.data?.shareinfo?.file_size || '0');
                        const autoRenewal = String(data.data?.shareinfo?.auto_renewal || '0');
                        callback(true, {
                            userId,
                            shareTitle,
                            expireTime,
                            fileSize,
                            autoRenewal,
                            rawResponse: data
                        });
                    } else {
                        if (data.error === "网络错误" && retryCount < 3) {
                            setTimeout(() => {
                                checkPasswordCorrect(shareCode, password, callback, retryCount + 1);
                            }, 1000 * (retryCount + 1));
                        } else {
                            const errorMsg = data.error || "未知错误";
                            let finalError = errorMsg;
                            const errnoVal = data.errno;

                            if (data.data && data.data.shareinfo) {
                                const shareState = data.data.shareinfo.share_state;
                                const forbidReason = data.data.shareinfo.forbid_reason;
                                
                                if (forbidReason) {
                                    finalError = forbidReason;
                                } else if (shareState === -1) {
                                    finalError = "分享已取消";
                                }
                            }

                            if (finalError === errorMsg && (errnoVal === 4100010 || (typeof errorMsg === 'string' && errorMsg.includes('取消')))) {
                                finalError = '分享已取消';
                            }

                            callback(false, {
                                error: finalError,
                                errno: data.errno,
                                errtype: data.errtype,
                                data: data.data,
                                rawResponse: data
                            });
                        }
                    }
                } catch (e) {
                    if (retryCount < 3) {
                        setTimeout(() => {
                            checkPasswordCorrect(shareCode, password, callback, retryCount + 1);
                        }, 1000 * (retryCount + 1));
                    } else {
                        callback(false, {
                            error: "解析响应失败: " + e.message,
                            rawResponse: response.responseText
                        });
                    }
                }
            },
            onerror: function(error) {
                activeRequests--;
                if (retryCount < 3) {
                    setTimeout(() => {
                        checkPasswordCorrect(shareCode, password, callback, retryCount + 1);
                    }, 1000 * (retryCount + 1));
                } else {
                    callback(false, {
                        error: "请求失败: " + (error.statusText || "网络错误"),
                        status: error.status
                    });
                }
            },
            ontimeout: function() {
                activeRequests--;
                if (retryCount < 3) {
                    setTimeout(() => {
                        checkPasswordCorrect(shareCode, password, callback, retryCount + 1);
                    }, 1000 * (retryCount + 1));
                } else {
                    callback(false, {
                        error: "请求超时",
                        status: 408
                    });
                }
            }
        });
    }

function formatTime(seconds, format = 'default') {
    if (format === 'HHMMSS') {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        const parts = [];
        if (days > 0) parts.push(`${days}天`);
        if (hours > 0 || days > 0) parts.push(`${hours}小时`);
        if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}分`);
        parts.push(`${secs}秒`);
        return parts.join(' ');
    }
}

    function stopBruteForce() {
        isRunning = false;
        isPaused = false;
        currentStatus = 'stopped';
        pauseResumeBtn.textContent = '开始验证';
        pauseResumeBtn.classList.remove('pause');
        pauseResumeBtn.classList.remove('stop');
        pauseResumeBtn.style.backgroundColor = '#4285f4';
        const isDigitsMode = strategySelect.value.includes('digits');
        charsInput.disabled = isRunning || isDigitsMode;
        charsInput.classList.add('disabled-digits');
        if (isDigitsMode) charsInput.classList.add('disabled-digits');
        else {
            charsInput.classList.remove('disabled-input');
            charsInput.classList.remove('disabled-digits');
        }

        statusDiv.style.display = 'none';
        try { clearTransientShareStatus(); } catch (e) {}
        try {
            if (!correctPassword) {
                let container = document.querySelector('.share-info .share-status') || document.querySelector('.share-status');
                if (!container) {
                    const info = document.querySelector('.share-info');
                    if (info) {
                        container = document.createElement('div');
                        container.className = 'share-status';
                        info.appendChild(container);
                    }
                }
                if (container && !container.classList.contains('verified-password')) {
                    try { container.classList.remove('transient-status'); } catch (e) {}
                    try { container.style.display = ''; } catch (e) {}
                    try { container.innerHTML = '<span class="highlight-warning">请输入访问码</span>'; } catch (e) { container.textContent = '请输入访问码'; }
                }
            }
        } catch (e) {}
        updateStatusTag();
    }

    function togglePauseResume() {
        if (!isRunning) {
            checkStoredPasswordBeforeStart();
            return;
        }

        if (isPaused) {
            isPaused = false;
            currentStatus = 'running';
            charsInput.disabled = true;
            charsInput.classList.add('disabled-input');
            totalPausedTime += Date.now() - pauseStartTime;
            pauseResumeBtn.textContent = '暂停验证';
            pauseResumeBtn.classList.add('pause');
            statusDiv.classList.add('active');
            statusDiv.style.display = 'block';
            setShareStatusTransient('验证中...');
            tryNextBatch();
        } else {
            isPaused = true;
            currentStatus = 'paused';
            const isDigitsMode = strategySelect.value.includes('digits');
            charsInput.disabled = isDigitsMode;
            if (isDigitsMode) charsInput.classList.add('disabled-digits');
            else {
                charsInput.classList.remove('disabled-input');
                charsInput.classList.remove('disabled-digits');
            }
            pauseStartTime = Date.now();
            pauseResumeBtn.textContent = '继续验证';
            pauseResumeBtn.classList.remove('pause');
            setShareStatusTransient('暂停中...');
        }
        updateStatusTag();
    }

    function checkStoredPasswordBeforeStart() {
        setShareStatusTransient('验证中...');
        if (!shareInfo.shareCode) {
            startBruteForce();
            return;
        }

        const storageKey = generateStorageKey(shareInfo.shareCode, shareInfo.ed2k, shareInfo.magnet);
        const storedData = GM_getValue(storageKey);
        if (storedData) {
            try {
                const data = JSON.parse(storedData);
                statusDiv.innerHTML = '正在验证存储中的访问码...';
                statusDiv.classList.add('active');
                statusDiv.style.display = 'block';
                checkPasswordCorrect(shareInfo.shareCode, data.password, (isCorrect, responseData) => {
                    if (isCorrect) {
                        correctPassword = data.password;
                        try {
                            statusDiv.innerHTML = '';
                            statusDiv.classList.remove('active');
                            statusDiv.style.display = 'none';
                        } catch (e) {}
                        try {
                            __verifiedOK = true;
                            __verificationCompleted = true;
                            applySuccessUI(correctPassword);
                            ensureErrorObserver();
                            suppressAccessCodeErrors(document);
                        } catch (e) {}
                        try { clearTransientShareStatus(); } catch (e) {}
                        updateStatusTag();
                        try { autoFillPassword(correctPassword); } catch (e) {}
                    } else {
                        statusDiv.innerHTML = '<div class="highlight-warning">存储中的访问码已失效，开始验证...</div>';
                        startBruteForce();
                    }
                });
            } catch (e) {
                console.error('解析存储数据失败:', e);
                startBruteForce();
            }
        } else {
            startBruteForce();
        }
    }

    function updateStatus() {
        const elapsedTime = (isPaused ? pauseStartTime : Date.now()) - startTime - totalPausedTime;
        const attemptsPerSecond = currentAttempt / (elapsedTime / 1000 || 1);
        const remainingTime = (totalAttempts - currentAttempt) / (attemptsPerSecond || 1);
        const remainingCombinations = totalAttempts - triedPasswords.size;
        const strategy = strategySelect.value;
        const chars = strategy.includes('digits') ? '0123456789' : allChars;
        const progressPercent = (triedPasswords.size / totalAttempts) * 100;

        const strategyNames = {
            'random': '随机模式',
            'sequential': '顺序模式',
            'random-digits': '随机数字模式',
            'sequential-digits': '顺序数字模式'
        };

        let statusHTML = `
<div class="network-status">
<span class="highlight"><strong>后台标签/最小化/退出浏览器</strong></span> 都有可能导致无法完整进行验证访问码
${navigator.onLine ? '' : '<div class="network-warning">警告: 当前网络连接不稳定</div>'}
</div>
<div class="progress-container">
<div class="progress-bar progress-bar-dynamic"></div>
</div>
<div class="status-info-grid">
<div class="status-info-column">
<div class="status-info-item"><strong>当前策略:</strong> <span class="highlight">${strategyNames[strategy]}</span></div>
<div class="status-info-item"><strong>当前验证:</strong> <span class="highlight">${currentPassword}</span></div>
<div class="status-info-item"><strong>已验证数:</strong> ${currentAttempt} 次 (${triedPasswords.size}个)</div>
<div class="status-info-item"><strong>并发数量:</strong> <span class="highlight">${activeRequests}</span> / ${maxConcurrent}</div>
<div class="status-info-item"><strong>剩余组合:</strong> <span class="highlight">${remainingCombinations.toLocaleString()}</span></div>
</div>
<div class="status-info-column">
<div class="status-info-item"><strong>当前进度:</strong> <span class="highlight">${progressPercent.toFixed(6)}%</span></div>
<div class="status-info-item"><strong>本机速度:</strong> ${attemptsPerSecond.toFixed(2)} 次/秒</div>
<div class="status-info-item"><strong>剩余时间:</strong> ${remainingTime > 0 ? formatTime(remainingTime) : '计算中...'}</div>
<div class="status-info-item"><strong>已用时间:</strong> ${formatTime(elapsedTime / 1000)}</div>
</div>
</div>
`;

    if (correctPassword) {
        statusHTML += `
<div class="correct-code">
<div class="correct-code-text">正确访问码: <strong>${correctPassword}</strong></div>
<div class="correct-code-actions">
<button class="batch-result-item-btn copy-btn">复制</button>
<button class="correct-code-btn fill-correct-btn">填入并确认</button>
</div>
</div>
<div class="fill-error" id="fill-error"></div>
`;
}
    statusDiv.innerHTML = statusHTML;

    const progressBar = statusDiv.querySelector('.progress-bar-dynamic');
    if (progressBar) {
        progressBar.style.setProperty('--progress-width', `${progressPercent}%`);
    }

    statusDiv.scrollTop = statusDiv.scrollHeight;
}

    function tryNextBatch() {
        if (!isRunning || isPaused || correctPassword) return;
        if (triedPasswords.size >= totalAttempts) {
            statusDiv.innerHTML += '<div class="batch-complete-message">所有组合已验证完毕，未找到正确访问码</div>';
            stopBruteForce();
            return;
        }

        const availableSlots = Math.min(maxConcurrent - activeRequests, maxConcurrent);
        if (availableSlots <= 0) {
            setTimeout(tryNextBatch, 100);
            return;
        }

        const batch = [];
        for (let i = 0; i < availableSlots; i++) {
            let password;
            const strategy = strategySelect.value;
            if (strategy === 'sequential' || strategy === 'sequential-digits') {
                password = generateSequentialPassword(currentIndex);
                currentIndex++;
            } else {
                do {
                    password = generateRandomPassword();
                } while (triedPasswords.has(password) && triedPasswords.size < totalAttempts);
                if (triedPasswords.size >= totalAttempts) break;
            }
            if (!password) continue;
            triedPasswords.add(password);
            batch.push(password);
        }

        if (batch.length === 0) {
            statusDiv.innerHTML += '<div class="batch-complete-message">所有组合已验证完毕，未找到正确访问码</div>';
            stopBruteForce();
            return;
        }

        let completed = 0;
        for (const password of batch) {
            currentPassword = password;
            currentAttempt++;
            updateStatus();
            checkPasswordCorrect(shareInfo.shareCode, password, (isCorrect, responseData) => {
                completed++;
                if (isCorrect) {
                    correctPassword = password;
                    saveToStorage(shareInfo.shareCode, password, '验证成功的访问码', responseData.shareTitle, responseData.expireTime, responseData.fileSize, String(responseData.autoRenewal || '0'), '');
                    updateStatus();
                    updateStatusTag();
                    try { autoFillPassword(correctPassword); } catch (e) {}
                    stopBruteForce();
                    return;
                }
                if (completed === batch.length && !correctPassword) setTimeout(tryNextBatch, 0);
            });
        }
        updateStatus();
    }

    function startBruteForce() {
        if (!validateCharsInput(charsInput.value)) return;
        setShareStatusTransient('验证中...');
        const isDigitsMode = strategySelect.value.includes('digits');
        if (isDigitsMode) allChars = '0123456789';
        else allChars = charsInput.value || DEFAULT_CHARS;

        maxConcurrent = parseInt(concurrentInput.value) || 10;
        if (maxConcurrent < 1) maxConcurrent = 1;
        if (maxConcurrent > 10000) maxConcurrent = 10000;
        concurrentInput.value = maxConcurrent;
        correctPassword = null;
        charsInput.disabled = true;
        charsInput.classList.add('disabled-input');
        statusDiv.classList.add('active');
        statusDiv.style.display = 'block';
        isRunning = true;
        isPaused = false;
        currentStatus = 'running';
        pauseResumeBtn.textContent = '暂停验证';
        pauseResumeBtn.classList.add('pause');
        startTime = Date.now();
        totalPausedTime = 0;
        currentAttempt = 0;
        currentIndex = 0;
        triedPasswords.clear();
        activeRequests = 0;
        const strategy = strategySelect.value;
        const chars = strategy.includes('digits') ? '0123456789' : allChars;
        totalAttempts = Math.pow(chars.length, 4);
        updateStatusTag();
        tryNextBatch();
    }

    const FILTER_NAMES = {
        'all': '全部',
        'valid': '有效',
        'longterm': '长期',
        'renewal': '续期',
        'timelimited': '限时',
        'error': '错误',
        'expired': '已过期',
        'cancelled': '已取消',
        'ed2k': 'ED2K',
        'magnet': '磁力链'
    };

    function processLinkInfo(shareCode, shareTitle, note, ed2k, magnet) {
        if (magnet) {
            try {
                const magnetMatch = magnet.match(/magnet:\?xt=urn:btih:([a-fA-F0-9]{40})(?:\?name=([^&]+))?/i);
                if (magnetMatch) {
                    const magnetHash = magnetMatch[1];
                    const magnetName = magnetMatch[2] ? decodeURIComponent(magnetMatch[2]) : '';

                    shareCode = magnetHash;

                    if (!shareTitle && magnetName) {
                        shareTitle = magnetName;
                    }

                    if (!note && magnetName) {
                        note = magnetName;
                    }
                }
            } catch (e) {
                console.error('处理磁力链出错:', e);
            }
        } else if (ed2k) {
            try {
                const ed2kParts = ed2k.match(/ed2k:\/\/\|file\|([^|]+)\|(\d+)\|([0-9A-F]{32})(?:\|h=([^|]+))?(\||\/)?/i);
                if (ed2kParts) {
                    const safeFilename = ed2kParts[1].replace(/"/g, '\\"');
                    const ed2kHash = ed2kParts[3];

                    ed2k = `ed2k://|file|${safeFilename}|${ed2kParts[2]}|${ed2kHash}`;

                    if (ed2kParts[4]) {
                        ed2k += `|h=${ed2kParts[4]}|/`;
                    } else {
                        ed2k += '|/';
                    }

                    shareCode = ed2kHash;
                }
            } catch (e) {
                console.error('处理ED2K链接出错:', e);
            }
        }

        return { shareCode, shareTitle, note, ed2k };
    }

    function generateStorageKey(shareCode, ed2k, magnet) {
        if (magnet) {
            const magnetMatch = magnet.match(/magnet:\?xt=urn:btih:([a-fA-F0-9]{40})/i);
            if (magnetMatch) {
                return `share_magnet_${magnetMatch[1]}`;
            }
        }

        if (ed2k) {
            const ed2kMatch = ed2k.match(/ed2k:\/\/\|file\|[^|]+\|\d+\|([0-9A-F]{32})\|/i);
            if (ed2kMatch) {
                return `share_ed2k_${ed2kMatch[1]}`;
            }
        }

        if (typeof shareCode === 'string') {
            if (shareCode.startsWith('ed2k_')) {
                shareCode = shareCode.slice(5);
            } else if (shareCode.startsWith('magnet_')) {
                shareCode = shareCode.slice(7);
            }
        }

        if (magnet) {
            return `share_magnet_${shareCode}`;
        } else if (ed2k) {
            return `share_ed2k_${shareCode}`;
        } else {
            return `share_115_${shareCode}`;
        }
    }

    function saveToStorage(shareCode, password, note = '', shareTitle = '', expireTime = -1, fileSize = 0, autoRenewal = '0', ed2k = '', magnet = '', error = '', isUpdate = false, skipRender = false) {
        let processedShareCode = shareCode;
        let processedShareTitle = shareTitle;
        let processedNote = note;
        let processedEd2k = ed2k;
        
        if (ed2k || magnet) {
            const linkInfo = processLinkInfo(shareCode, shareTitle, note, ed2k, magnet);
            processedShareCode = linkInfo.shareCode;
            processedShareTitle = linkInfo.shareTitle;
            processedNote = linkInfo.note;
            processedEd2k = linkInfo.ed2k;
        }

        const storageKey = generateStorageKey(processedShareCode, processedEd2k, magnet);
        const existingData = GM_getValue(storageKey);
        let existingNote = processedNote;
        let existingTimestamp = Date.now();

        if (existingData) {
            try {
                const data = JSON.parse(existingData);
                if (!processedNote && data.note) existingNote = data.note;
                if (data.timestamp) existingTimestamp = data.timestamp;
            } catch (e) {
                console.error('解析存储数据失败:', e);
            }
        }

        const data = {
            shareCode: processedShareCode,
            password,
            note: existingNote,
            shareTitle: processedShareTitle,
            expireTime,
            fileSize,
            autoRenewal: String(autoRenewal || '0'),
            ed2k: processedEd2k,
            magnet,
            error,
            timestamp: existingTimestamp
        };

        GM_setValue(storageKey, JSON.stringify(data));

        const oldIndex = allItems.findIndex(item => item.shareCode === processedShareCode);
        if (oldIndex !== -1) {
            allItems[oldIndex] = data;
        } else {
            allItems.push(data);
        }

        if (!skipRender) {
            renderStorage(false);
            clearItemCountsCache();
        }
    }

    function updateStorageItem(shareCode, password, note = '', shareTitle = '', expireTime = -1, fileSize = 0, autoRenewal = '0', ed2k = '', magnet = '', error = '') {
        return saveToStorage(shareCode, password, note, shareTitle, expireTime, fileSize, autoRenewal, ed2k, magnet, error, true);
    }

    function batchSaveToStorage(items) {
        const newItems = [];

        items.forEach(item => {
            const data = {
                shareCode: item.shareCode,
                password: item.password,
                note: item.note || '',
                shareTitle: item.shareTitle || '',
                expireTime: item.expireTime || -1,
                fileSize: item.fileSize || 0,
                autoRenewal: String(item.autoRenewal || '0'),
                ed2k: item.ed2k || '',
                magnet: item.magnet || '',
                error: item.error || '',
                timestamp: item.timestamp || Date.now()
            };

            const storageKey = generateStorageKey(data.shareCode, data.ed2k, data.magnet);
            GM_setValue(storageKey, JSON.stringify(data));
            newItems.push(data);
        });

        allItems.push(...newItems);

        renderStorage(false);
        clearItemCountsCache();

        return newItems.length;
    }

    function getAllStorageItems() {
        const items = [];
        const keys = GM_listValues();
        for (const key of keys) {
            if (key.startsWith('share_ed2k_') || key.startsWith('share_115_') || key.startsWith('share_magnet_')) {
                try {
                    const data = JSON.parse(GM_getValue(key));
                    if (data && typeof data.autoRenewal !== 'string') {
                        data.autoRenewal = String(data.autoRenewal || '0');
                    }
                    items.push(data);
                } catch (e) {
                    console.error('解析存储数据失败:', key, e);
                }
            }
        }
        return items;
    }

    function sortItems(items, sortType) {
        if (!Array.isArray(items)) {
            return [];
        }
        switch(sortType) {
            case 'time-desc':
                return items.sort((a, b) => b.timestamp - a.timestamp);
            case 'time-asc':
                return items.sort((a, b) => a.timestamp - b.timestamp);
            case 'name-asc':
                return items.sort((a, b) => (a.shareTitle || '').localeCompare(b.shareTitle || ''));
            case 'name-desc':
                return items.sort((a, b) => (b.shareTitle || '').localeCompare(a.shareTitle || ''));
            case 'size-desc':
                return items.sort((a, b) => (b.fileSize || 0) - (a.fileSize || 0));
            case 'size-asc':
                return items.sort((a, b) => (a.fileSize || 0) - (b.fileSize || 0));
            default:
                return items.sort((a, b) => b.timestamp - a.timestamp);
        }
    }

    function normalizeSearchTerm(term) {
        return term.replace(/\b(\d+\.\d+)\s*([KMGT]?B)\b/gi, '$1$2')
            .replace(/\b(\d+)\s*([KMGT]?B)\b/gi, '$1$2')
            .replace(/\b(\d+)\s*([KMGT])\b/gi, '$1$2')
            .toLowerCase();
    }

    function parseSearchLink(term) {
        try {
            if (!term || typeof term !== 'string') return null;
            const str = term.trim();
            if (!/[?&]password=/i.test(str) && str.indexOf('#') === -1) return null;

            const shareCodeMatch = str.match(/\/s\/([^?#\/]+)/i);
            const pwdMatch = str.match(/[?&]password=([0-9A-Za-z]{4})\b/i);

            let title = null;
            const hashIndex = str.indexOf('#');
            if (hashIndex >= 0 && hashIndex < str.length - 1) {
                const frag = str.slice(hashIndex + 1);
                try {
                    title = decodeURIComponent(frag.replace(/\+/g, ' '));
                } catch (e) {
                    title = frag;
                }
            }

            let shareCode = shareCodeMatch ? shareCodeMatch[1] : null;
            if (!shareCode) {
                const qIndex = str.indexOf('?');
                const preQ = qIndex >= 0 ? str.slice(0, qIndex) : str;
                const lastSlash = preQ.lastIndexOf('/');
                const seg = preQ.slice(lastSlash + 1).trim();
                if (seg) shareCode = seg;
            }

            const password = pwdMatch ? pwdMatch[1] : null;

            if (shareCode || password || title) {
                return { shareCode, password, title };
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    function filterStorageItems(items) {

        const filterCache = new Map();
        const cacheKey = `${currentFilterType}_${currentSearchTerm}_${currentSearchType}`;

        if (filterCache.has(cacheKey)) {
            return filterCache.get(cacheKey);
        }

        let result = items;
        const now = Math.floor(Date.now() / 1000);

        if (currentFilterType === 'valid') {
            result = items.filter(item => !item.error && (item.expireTime === -1 || item.expireTime > now) && !item.magnet);
        } else if (currentFilterType === 'longterm') {
            result = items.filter(item => item.expireTime === -1 && item.fileSize !== 0 && !item.ed2k && !item.magnet);
        } else if (currentFilterType === 'renewal') {
            result = items.filter(item => item.autoRenewal === '1' && !item.magnet);
        } else if (currentFilterType === 'timelimited') {
            result = items.filter(item => item.expireTime !== -1 && item.expireTime > now && item.autoRenewal !== '1' && !item.magnet);
        } else if (currentFilterType === 'error') {
            result = items.filter(item => item.error && !item.magnet && !(item.expireTime !== -1 && item.expireTime <= now));
        } else if (currentFilterType === 'expired') {
            result = items.filter(item => item.expireTime !== -1 && item.expireTime <= now && item.autoRenewal !== '1' && !item.magnet);
        } else if (currentFilterType === 'cancelled') {
            result = items.filter(item => item.expireTime === -1 && item.fileSize === 0 && item.shareTitle === '' && !item.magnet && !item.error);
        } else if (currentFilterType === 'ed2k') {
            result = items.filter(item => item.ed2k && item.ed2k !== '' && !item.magnet);
        } else if (currentFilterType === 'magnet') {
            result = items.filter(item => item.magnet && item.magnet !== '');
        }
        if (currentSearchTerm) {
            const rawTerm = currentSearchTerm.trim();
            const linkParts = parseSearchLink(rawTerm);
            const toLower = (s) => (s || '').toLowerCase();
            const keywords = linkParts
                ? [linkParts.shareCode, linkParts.password, linkParts.title].filter(Boolean).map(toLower)
                : currentSearchTerm
                    .split(/\s+|,|，/)
                    .map(s => s.trim().toLowerCase())
                    .filter(Boolean);

            const matchAny = !!linkParts;

            const matchesKw = (item, kw) => {
                if (currentSearchType === 'all') {
                    return (
                        (item.shareTitle && item.shareTitle.toLowerCase().includes(kw)) ||
                        (item.shareCode && item.shareCode.toLowerCase().includes(kw)) ||
                        (item.password && item.password.toLowerCase().includes(kw)) ||
                        (item.note && item.note.toLowerCase().includes(kw)) ||
                        (item.ed2k && item.ed2k.toLowerCase().includes(kw))
                    );
                } else if (currentSearchType === 'title') {
                    return item.shareTitle && item.shareTitle.toLowerCase().includes(kw);
                } else if (currentSearchType === 'shareCode') {
                    return item.shareCode && item.shareCode.toLowerCase().includes(kw);
                } else if (currentSearchType === 'password') {
                    return item.password && item.password.toLowerCase().includes(kw);
                } else if (currentSearchType === 'note') {
                    return item.note && item.note.toLowerCase().includes(kw);
                } else if (currentSearchType === 'ed2k') {
                    return item.ed2k && item.ed2k.toLowerCase().includes(kw);
                } else if (currentSearchType === 'magnet') {
                    return item.magnet && item.magnet.toLowerCase().includes(kw);
                }
                return false;
            };

            if (keywords.length > 0) {
                result = result.filter(item => matchAny
                    ? keywords.some(kw => matchesKw(item, kw))
                    : keywords.every(kw => matchesKw(item, kw))
                );
            }
        }

        filterCache.set(cacheKey, result);
        return result;
    }

    let cachedItemCounts = null;
    let lastCountUpdate = 0;
    const COUNT_CACHE_DURATION = 5000;

    function updateItemCounts() {
        const now = Date.now();
        if (cachedItemCounts && (now - lastCountUpdate) < COUNT_CACHE_DURATION) {
            return cachedItemCounts;
        }

        const items = getAllStorageItems();
        const currentTime = Math.floor(now / 1000);

        cachedItemCounts = {
            expired: items.filter(item => item.expireTime !== -1 && item.expireTime <= currentTime && item.autoRenewal !== '1').length,
            cancelled: items.filter(item => item.expireTime === -1 && item.fileSize === 0 && item.shareTitle === '' && !item.magnet && !item.error).length,
            error: items.filter(item => item.error && !(item.expireTime !== -1 && item.expireTime <= currentTime)).length
        };

        lastCountUpdate = now;
        return cachedItemCounts;
    }

    function countExpiredItems() {
        return updateItemCounts().expired;
    }

    function countCancelledItems() {
        return updateItemCounts().cancelled;
    }

    function countErrorItems() {
        return updateItemCounts().error;
    }

    function clearItemCountsCache() {
        cachedItemCounts = null;
        lastCountUpdate = 0;
    }

    function updateDeleteButtons() {
        const expiredCount = countExpiredItems();
        const cancelledCount = countCancelledItems();
        const errorCount = countErrorItems();

        if (currentFilterType === 'all' || currentFilterType === 'expired') {
            if (expiredCount > 0) {
                deleteExpiredBtn.style.display = 'block';
                deleteExpiredBtn.innerHTML = `删除过期<span class="expired-count-badge">${expiredCount}</span>`;
            } else {
                deleteExpiredBtn.style.display = 'none';
            }
            deleteInvalidBtn.style.display = 'none';
            deleteErrorBtn.style.display = 'none';
        } else if (currentFilterType === 'cancelled') {
            if (cancelledCount > 0) {
                deleteInvalidBtn.style.display = 'block';
                deleteInvalidBtn.innerHTML = `删除无效<span class="invalid-count-badge">${cancelledCount}</span>`;
            } else {
                deleteInvalidBtn.style.display = 'none';
            }
            deleteExpiredBtn.style.display = 'none';
            deleteErrorBtn.style.display = 'none';
        } else if (currentFilterType === 'error') {
            if (errorCount > 0) {
                deleteErrorBtn.style.display = 'block';
                deleteErrorBtn.innerHTML = `删除错误<span class="error-count-badge">${errorCount}</span>`;
                deleteErrorBtn.style.position = 'relative';
            } else {
                deleteErrorBtn.style.display = 'none';
            }
            deleteExpiredBtn.style.display = 'none';
            deleteInvalidBtn.style.display = 'none';
        } else {
            deleteExpiredBtn.style.display = 'none';
            deleteInvalidBtn.style.display = 'none';
            deleteErrorBtn.style.display = 'none';
        }
    }

    function renderStorage(resetScroll = true) {

        const currentScrollTop = storageContainer.scrollTop;

        const selectedItemsInfo = new Map();
        if (selectedItems.size > 0) {
            selectedItems.forEach(index => {
                const item = filteredItems[index];
                if (item) {

                    selectedItemsInfo.set(item.shareCode, true);
                }
            });
        }

        selectedItems.clear();
        lastSelectedIndex = -1;

        allItems = getAllStorageItems();
        filteredItems = filterStorageItems(allItems);
        filteredItems = sortItems(filteredItems, currentSortType);

        clearVirtualScrollCache();

        if (selectedItemsInfo.size > 0) {
            filteredItems.forEach((item, index) => {
                if (selectedItemsInfo.has(item.shareCode)) {
                    selectedItems.add(index);
                    lastSelectedIndex = index;
                }
            });
        }

        updateBatchActions();

        let countText = '';
        if (currentFilterType === 'all') {
            countText = `共 ${filteredItems.length} 条`;
        } else {
            const totalCount = allItems.length;
            countText = `共 ${filteredItems.length}/${totalCount} 条`;
        }

        if (filteredItems.length === 0) {
            storageEmpty.style.display = 'block';
            storageScrollContent.style.display = 'none';
            searchInput.placeholder = `搜索... (${countText})`;
            updateDeleteButtons();
            return;
        }

        storageEmpty.style.display = 'none';
        storageScrollContent.style.display = 'block';
        searchInput.placeholder = `搜索... (${countText})`;
        updateDeleteButtons();
        updateScrollContentHeight();

        if (resetScroll) {

            scrollTop = 0;
            storageContainer.scrollTop = 0;
            renderStartIndex = 0;

            const bufferSize = Math.max(10, Math.ceil(visibleItemCount * 0.5));
            renderEndIndex = Math.min(filteredItems.length, visibleItemCount + bufferSize);
        } else {

            scrollTop = currentScrollTop;
            storageContainer.scrollTop = currentScrollTop;

            const bufferSize = Math.max(10, Math.ceil(visibleItemCount * 0.5));
            renderStartIndex = Math.max(0, Math.floor(currentScrollTop / itemHeight) - bufferSize);
            renderEndIndex = Math.min(filteredItems.length, renderStartIndex + visibleItemCount + bufferSize * 2);
        }

        renderVisibleItems();
    }

    function getFilterDescription() {
        let description = `筛选条件: ${FILTER_NAMES[currentFilterType] || currentFilterType}`;

        if (currentSearchTerm) {
            description += ` | 搜索: "${currentSearchTerm}"`;
        }

        return description;
    }

    function refreshCurrentFilter() {
        if (apiRefreshRunning) {
            apiRefreshCancelled = true;
            apiRefreshRunning = false;
            apiRefreshBtn.title = 'API刷新';
            return;
        }

        const hasSelection = selectedItems && selectedItems.size > 0;
        const itemsToRefresh = hasSelection
            ? Array.from(selectedItems)
                .sort((a, b) => a - b)
                .map(i => filteredItems[i])
                .filter(Boolean)
            : filteredItems;
        const refreshCount = itemsToRefresh.length;
        const filterDesc = hasSelection
            ? `批量选择: 已选 ${refreshCount} 项`
            : getFilterDescription();

        if (refreshCount === 0) {
            alert(`${filterDesc}\n\n当前筛选条件下没有可刷新的项目`);
            return;
        }

        if (!confirm(`${filterDesc}\n\n确定要刷新${hasSelection ? '已选中的' : '当前筛选条件下的'} ${refreshCount} 个项目吗？`)) return;

        apiRefreshCancelled = false;
        apiRefreshRunning = true;
        apiRefreshBtn.title = '停止刷新';
        apiRefreshBadge.textContent = refreshCount;

        let index = 0;
        let processed = 0;
        let successCount = 0;
        let errorCount = 0;

        const processNext = () => {
            if (apiRefreshCancelled) return finish(true);
            if (index >= itemsToRefresh.length) return finish(false);

            const item = itemsToRefresh[index++];
            if (item.ed2k || item.magnet) {
                processed++;
                updateBadge();
                return setTimeout(processNext, 0);
            }

            checkPasswordCorrect(item.shareCode, item.password, (isCorrect, responseData) => {
                processed++;
                if (!apiRefreshCancelled) {
                    if (isCorrect) {
                        let newNote = item.note;
                        if (newNote === '未验证的访问码' && responseData?.shareTitle) newNote = responseData.shareTitle;
                        updateStorageItem(
                            item.shareCode,
                            item.password,
                            newNote,
                            responseData?.shareTitle || item.shareTitle,
                            responseData?.expireTime || item.expireTime,
                            responseData?.fileSize || item.fileSize,
                            String(responseData?.autoRenewal || '0'),
                            item.ed2k || '',
                            item.magnet || ''
                        );
                        successCount++;
                    } else if (
                        responseData?.error === "分享已取消" ||
                        (typeof responseData?.error === 'string' && responseData.error.includes('取消')) ||
                        responseData?.errno === 4100010 ||
                        (((responseData?.rawResponse?.data?.shareinfo) || (responseData?.data?.shareinfo) || {})?.share_state === -1)
                    ) {
                        updateStorageItem(
                            item.shareCode,
                            item.password,
                            item.note,
                            '',
                            -1,
                            0,
                            '0',
                            item.ed2k || '',
                            item.magnet || ''
                        );
                    } else {
                        const shareInfo = responseData?.rawResponse?.data?.shareinfo || responseData?.data?.shareinfo || {};
                        const shareState = shareInfo?.share_state;
                        const forbidReason = shareInfo?.forbid_reason || responseData?.error || '';
                        if ((typeof forbidReason === 'string' && /过期/.test(forbidReason)) || shareState === 7) {
                            const newTitle = processShareTitle(responseData?.rawResponse || {});
                            updateStorageItem(
                                item.shareCode,
                                item.password,
                                item.note,
                                newTitle || item.shareTitle,
                                shareInfo?.expire_time || -1,
                                parseInt(shareInfo?.file_size || 0),
                                String(shareInfo?.auto_renewal || '0'),
                                item.ed2k || '',
                                item.magnet || '',
                                forbidReason || '分享已过期'
                            );
                        } else {
                            updateStorageItem(
                                item.shareCode,
                                item.password,
                                item.note,
                                item.shareTitle,
                                item.expireTime,
                                item.fileSize,
                                item.autoRenewal,
                                item.ed2k || '',
                                item.magnet || '',
                                responseData?.error || '验证失败'
                            );
                            errorCount++;
                        }
                    }
                }
                updateBadge();
                setTimeout(processNext, 0);
            });
        };

        const updateBadge = () => {
            const remaining = refreshCount - processed;
            apiRefreshBadge.textContent = remaining;
        };

        const finish = (stopped) => {
            apiRefreshRunning = false;
            apiRefreshCancelled = false;
            apiRefreshBtn.title = 'API刷新';
            apiRefreshBadge.textContent = '0';
            if (stopped) {
                alert(`${filterDesc}\n\n已停止刷新，已处理 ${processed} / ${refreshCount} 个项目`);
            } else {
                alert(`${filterDesc}\n\n刷新完成！\n成功刷新 ${successCount} 个项目\n失败 ${errorCount} 个项目`);
                renderStorage(false);
            }
        };

        processNext();
    }

    function exportToCSV() {
        let filterDesc = `${FILTER_NAMES[currentFilterType] || currentFilterType}`;

        if (currentSearchTerm) {
            filterDesc += `_搜索"${currentSearchTerm.substring(0, 20)}"`;
        }

        filterDesc = filterDesc.replace(/[\/\\?%*:|"<>]/g, '');

        const items = filteredItems;
        const itemCount = items.length;

        if (itemCount === 0) {
            alert('当前没有数据可导出');
            return;
        }

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        const fileName = `115存储数据_${filterDesc}_${itemCount}条_${year}${month}${day}_${hours}${minutes}${seconds}.csv`;

        let csv = '标题,分享码/哈希,访问码,链接,大小,有效时间,备注\n';
        items.forEach(item => {
            const title = item.shareTitle || '无标题';
            const codeOrHash = item.ed2k ?
                  item.ed2k.match(/ed2k:\/\/\|file\|[^|]+\|\d+\|([0-9A-F]{32})\|/i)?.[1] ||
                  item.shareCode :
            item.shareCode;
            const password = item.password || '无';
            const fullLink = item.ed2k ? item.ed2k : `https://115cdn.com/s/${item.shareCode}${item.password ? `?password=${item.password}` : ''}`;
            const fileSize = formatFileSize(item.fileSize);
            const expireTime = item.expireTime === -1 ? '长期' : new Date(item.expireTime * 1000).toLocaleString();
            const note = item.note || '';

            const escapeCsv = (str) => {
                if (str === null || str === undefined) return '""';
                return `"${String(str).replace(/"/g, '""')}"`;
            };

            csv += [
                escapeCsv(title),
                escapeCsv(codeOrHash),
                escapeCsv(password),
                escapeCsv(fullLink),
                escapeCsv(fileSize),
                escapeCsv(expireTime),
                escapeCsv(note)
            ].join(',') + '\n';
        });

        try {
            const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 100);

        } catch (e) {
            console.error('导出CSV失败:', e);
            alert('导出失败，请检查控制台错误信息');
        }
    }

    function deleteInvalidItems() {
        const cancelledItems = filteredItems.filter(item =>
                                                    item.expireTime === -1 && item.fileSize === 0 && item.shareTitle === ''
                                                   );
        const cancelledCount = cancelledItems.length;
        const filterDesc = getFilterDescription();

        if (cancelledCount === 0) {
            alert(`${filterDesc}\n\n当前筛选条件下没有找到已取消分享的项目`);
            return;
        }

        if (confirm(`${filterDesc}\n\n确定要删除当前筛选条件下的 ${cancelledCount} 个已取消分享的项目吗？`)) {
            let deletedCount = 0;
            cancelledItems.forEach(item => {
                GM_deleteValue(generateStorageKey(item.shareCode, item.ed2k, item.magnet));
                deletedCount++;
            });
            renderStorage(false);
            alert(`${filterDesc}\n\n已删除 ${deletedCount} 个已取消分享的项目`);
        }
    }

    function importFromCSV() {
        const importBtn = document.querySelector('#import-btn');

        if (importBtn.dataset.importing === 'true') {
            importBtn.dataset.importing = 'false';
            importBtn.innerHTML = '导入数据<span class="import-badge">0</span>';
            return;
        }

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';

        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const content = event.target.result;
                    const lines = content.split('\n').filter(line => line.trim() !== '');
                    if (lines.length < 2) {
                        alert('CSV文件格式不正确');
                        return;
                    }

                    const header = lines[0].split(',');
                    const expectedHeaders = ['标题', '分享码/哈希', '访问码', '完整链接', '文件大小', '有效时间', '备注'];
                    if (!expectedHeaders.every(h => header.includes(h))) {
                        alert('CSV文件格式不正确，必须包含以下列：标题,分享码/哈希,访问码,完整链接,文件大小,有效时间,备注');
                        return;
                    }

                    importBtn.dataset.importing = 'true';
                    importBtn.innerHTML = '取消导入<span class="import-badge">0</span>';

                    const importBadge = importBtn.querySelector('.import-badge');
                    if (importBadge) {
                        importBadge.textContent = lines.length - 1;
                        importBadge.classList.add('show');
                    }

                    let isCancelled = false;
                    let importedCount = 0;
                    let skippedCount = 0;
                    let failedItems = [];
                    const totalLines = lines.length - 1;
                    const batchSize = 1000;
                    const startTime = Date.now();

    function parseCsvLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                values.push(current);
                current = '';
            } else {
                current += char;
            }
        }

        values.push(current);
        return values.map(v => v.replace(/^"|"$/g, ''));
    }

    function parseExpireTime(timeStr) {
        if (!timeStr || timeStr.trim() === '长期') return -1;

        const date = new Date(timeStr);
        if (!isNaN(date.getTime())) return Math.floor(date.getTime() / 1000);

        const timeParts = timeStr.match(/(\d+)天\s(\d+)小时\s(\d+)分\s(\d+)秒/) ||
              timeStr.match(/(\d+)小时\s(\d+)分\s(\d+)秒/) ||
              timeStr.match(/(\d+)分\s(\d+)秒/) ||
              timeStr.match(/(\d+)秒/);

        if (timeParts) {
            let totalSeconds = 0;
            if (timeParts.length === 5) {
                totalSeconds = parseInt(timeParts[1]) * 86400 +
                    parseInt(timeParts[2]) * 3600 +
                    parseInt(timeParts[3]) * 60 +
                    parseInt(timeParts[4]);
            } else if (timeParts.length === 4) {
                totalSeconds = parseInt(timeParts[1]) * 3600 +
                    parseInt(timeParts[2]) * 60 +
                    parseInt(timeParts[3]);
            } else if (timeParts.length === 3) {
                totalSeconds = parseInt(timeParts[1]) * 60 +
                    parseInt(timeParts[2]);
            } else if (timeParts.length === 2) {
                totalSeconds = parseInt(timeParts[1]);
            }
            return Math.floor(Date.now() / 1000) + totalSeconds;
        }

        return -1;
    }

    function parseFileSize(sizeStr) {
        if (!sizeStr) return 0;
        const sizeMatch = sizeStr.match(/^(\d+(?:\.\d+)?)\s*([KMGT]?B)$/i);
        if (sizeMatch) {
            const sizeValue = parseFloat(sizeMatch[1]);
            const sizeUnit = sizeMatch[2].toUpperCase();
            const units = ['B', 'KB', 'MB', 'GB', 'TB'];
            const unitIndex = units.indexOf(sizeUnit);
            if (unitIndex !== -1) return Math.round(sizeValue * Math.pow(1024, unitIndex));
        }
        return 0;
    }

    const currentAllItems = getAllStorageItems();


    for (let i = 1; i < lines.length; i += batchSize) {

        if (importBtn.dataset.importing !== 'true') {
            isCancelled = true;
            break;
        }

        const batchLines = lines.slice(i, i + batchSize);
        const batchStartTime = Date.now();

        for (let j = 0; j < batchLines.length; j++) {

            if (importBtn.dataset.importing !== 'true') {
                isCancelled = true;
                break;
            }
            const line = batchLines[j];
            const values = parseCsvLine(line);

            if (values.length >= 7) {
                const title = values[0].trim();
                const codeOrHash = values[1].trim();
                const password = values[2].trim();
                const fullLink = values[3].trim();
                const fileSize = parseFileSize(values[4].trim());
                const expireTime = parseExpireTime(values[5].trim());
                const note = values[6].trim();

                const isEd2k = fullLink.startsWith('ed2k://');
                const shareCode = isEd2k ? codeOrHash : codeOrHash;

                const enableImportSkip = GM_getValue('enableImportSkip', true);
                const existingItem = currentAllItems.find(item =>
                                                   item.shareCode === shareCode &&
                                                   (isEd2k || item.password === password)
                                                  );

                if (existingItem && enableImportSkip) {
                    skippedCount++;
                } else if (isEd2k) {
                    saveToStorage(
                        shareCode,
                        '',
                        note,
                        title,
                        expireTime,
                        fileSize,
                        '0',
                        fullLink
                    );
                    importedCount++;
                } else if (shareCode && password) {
                    const enableImportVerify = GM_getValue('enableImportVerify', false);

                    if (enableImportVerify) {

                        try {
                            await new Promise((resolve, reject) => {
                                checkPasswordCorrect(shareCode, password, (isCorrect, data) => {
                                    if (isCorrect) {
                                        saveToStorage(
                                            shareCode,
                                            password,
                                            note,
                                            data?.shareTitle || title,
                                            data?.expireTime || expireTime,
                                            data?.fileSize || fileSize,
                                            data?.autoRenewal || '0'
                                        );
                                        importedCount++;
                                    } else {
                                        failedItems.push({
                                            title,
                                            shareCode,
                                            password,
                                            reason: '访问码验证失败'
                                        });
                                    }
                                    resolve();
                                });
                            });
                        } catch (error) {
                            failedItems.push({
                                title,
                                shareCode,
                                password,
                                reason: '验证过程出错'
                            });
                        }
                    } else {

                        saveToStorage(
                            shareCode,
                            password,
                            note,
                            title,
                            expireTime,
                            fileSize,
                            '0'
                        );
                        importedCount++;
                    }
                } else {
                    failedItems.push({
                        title,
                        shareCode,
                        password,
                        reason: '数据不完整'
                    });
                }

                const processedCount = i + j - 1;

                const importBadge = importBtn.querySelector('.import-badge');
                if (importBadge) {
                    const remainingCount = totalLines - processedCount;
                    importBadge.textContent = remainingCount;
                    if (remainingCount === 0) {
                        importBadge.classList.remove('show');
                    }
                }

                if (j % 10 === 0) await new Promise(resolve => setTimeout(resolve, 0));
            }
        }

        const batchElapsedTime = Date.now() - batchStartTime;
        if (batchElapsedTime < 50) await new Promise(resolve => setTimeout(resolve, 50 - batchElapsedTime));
    }

    importBtn.dataset.importing = 'false';
    importBtn.innerHTML = '导入数据<span class="import-badge">0</span>';

    if (!isCancelled) {
        const enableImportSkip = GM_getValue('enableImportSkip', true);
        const enableImportVerify = GM_getValue('enableImportVerify', false);

        let resultMessage = `导入完成！成功 ${importedCount} 条`;
        if (enableImportSkip) {
            resultMessage += `，跳过 ${skippedCount} 条`;
        }
        if (failedItems.length > 0) {
            resultMessage += `，失败 ${failedItems.length} 条`;
        }
        if (enableImportVerify) {
            resultMessage += `（已启用验证）`;
        }
        alert(resultMessage);
    } else {
        alert('导入已取消');
    }

    renderStorage(false);
} catch (e) {

    importBtn.dataset.importing = 'false';
    importBtn.innerHTML = '导入数据<span class="import-badge">0</span>';

    alert('导入失败: ' + e.message);
}
};
    reader.readAsText(file);
});
    input.click();
}

    function deleteExpiredItems() {
        const expiredCount = countExpiredItems();
        if (expiredCount === 0) {
            alert('没有找到已过期的项目');
            return;
        }

        if (confirm(`确定要删除 ${expiredCount} 个已过期的项目吗？`)) {
            const now = Math.floor(Date.now() / 1000);
            const keys = GM_listValues();
            let deletedCount = 0;
            keys.forEach(key => {
                if (key.startsWith('share_ed2k_') || key.startsWith('share_115_')) {
                    try {
                        const data = JSON.parse(GM_getValue(key));
                        if (data.expireTime !== -1 && data.expireTime <= now) {
                            GM_deleteValue(key);
                            deletedCount++;
                        }
                    } catch (e) {
                        console.error('解析存储数据失败:', key, e);
                    }
                }
            });
            renderStorage(false);
            alert(`已删除 ${deletedCount} 个已过期的项目`);
        }
    }



    function deleteErrorItems() {
        const errorItems = filteredItems.filter(item => item.error);
        const errorCount = errorItems.length;
        const filterDesc = getFilterDescription();

        if (errorCount === 0) {
            alert(`${filterDesc}\n\n当前筛选条件下没有找到错误项目`);
            return;
        }

        if (confirm(`${filterDesc}\n\n确定要删除当前筛选条件下的 ${errorCount} 个错误项目吗？`)) {
            let deletedCount = 0;
            errorItems.forEach(item => {
                GM_deleteValue(generateStorageKey(item.shareCode, item.ed2k, item.magnet));
                deletedCount++;
            });
            renderStorage(false);
            alert(`${filterDesc}\n\n已删除 ${deletedCount} 个错误项目`);
        }
    }

    function clearStorage() {
        const hasSearchOrFilter = currentSearchTerm || currentFilterType !== 'all';

        let message;
        let itemsToDelete;

        if (hasSearchOrFilter) {
            itemsToDelete = filteredItems.length;
            message = `当前有${currentSearchTerm ? '搜索 "' + currentSearchTerm + '"' : ''}${
            currentSearchTerm && currentFilterType !== 'all' ? ' 和 ' : ''
        }${
            currentFilterType !== 'all' ? '筛选 "' + document.querySelector(`button[data-filter="${currentFilterType}"]`).textContent + '"' : ''
        }\n\n确定要删除当前显示的 ${itemsToDelete} 个项目吗？`;
        } else {
            itemsToDelete = allItems.length;
            message = `确定要清空所有 ${itemsToDelete} 个存储数据吗？此操作不可恢复！`;
        }

        if (confirm(message)) {
            if (hasSearchOrFilter) {
                filteredItems.forEach(item => {
                    GM_deleteValue(generateStorageKey(item.shareCode, item.ed2k, item.magnet));
                });
            } else {
                const keys = GM_listValues();
                keys.forEach(key => {
                    if (key.startsWith('share_ed2k_') || key.startsWith('share_115_') || key.startsWith('share_magnet_')) GM_deleteValue(key);
                });
            }

            renderStorage(false);
            alert(`已删除 ${itemsToDelete} 个项目`);
        }
    }

    function renderElementBlockSettings() {
        elementBlockContainer.innerHTML = '';

        const categories = {
            '通用': elementBlockItems.filter(item => item.category === '通用'),
            '分享页': elementBlockItems.filter(item => item.category === '分享页'),
            '导航': elementBlockItems.filter(item => item.category === '导航')
        };

        Object.entries(categories).forEach(([categoryName, items]) => {
            if (items.length === 0) return;

            const sectionElement = document.createElement('div');
            sectionElement.className = 'settings-section';
            sectionElement.innerHTML = `
                <div class="settings-section-title">
                    ${categoryName}
                    <div class="category-toggle-container">
                        <label class="element-block-switch">
                            <input type="checkbox" class="category-toggle" data-category="${categoryName}">
                            <span class="element-block-slider"></span>
                        </label>
                    </div>
                </div>
                <div class="element-block-grid"></div>
            `;

            const grid = sectionElement.querySelector('.element-block-grid');
            items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'element-block-item';
                itemElement.innerHTML = `
                    <div class="element-block-item-header">
                        <label class="element-block-switch">
                            <input type="checkbox" ${item.enabled ? 'checked' : ''}>
                            <span class="element-block-slider"></span>
                        </label>
                        <span class="element-block-name">${item.name}</span>
                    </div>
                    <div class="element-block-selector">${item.selector}</div>
                `;
                const checkbox = itemElement.querySelector('input');
                checkbox.addEventListener('change', () => {
                    item.enabled = checkbox.checked;
                    saveElementBlockSettings();
                    executeElementBlock();

                    const section = itemElement.closest('.settings-section');
                    const categoryToggle = section.querySelector('.category-toggle');
                    const checkboxes = section.querySelectorAll('.element-block-grid input[type="checkbox"]');
                    const enabledCount = Array.from(checkboxes).filter(cb => cb.checked).length;

                    categoryToggle.checked = enabledCount === checkboxes.length;
                    categoryToggle.indeterminate = enabledCount > 0 && enabledCount < checkboxes.length;
                });
                grid.appendChild(itemElement);
            });

            const categoryToggle = sectionElement.querySelector('.category-toggle');
            categoryToggle.addEventListener('change', () => {
                const isChecked = categoryToggle.checked;
                items.forEach(item => {
                    item.enabled = isChecked;
                });

                const checkboxes = sectionElement.querySelectorAll('.element-block-grid input[type="checkbox"]');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = isChecked;
                });

                saveElementBlockSettings();
                executeElementBlock();
            });

            const enabledCount = items.filter(item => item.enabled).length;
            categoryToggle.checked = enabledCount === items.length;
            categoryToggle.indeterminate = enabledCount > 0 && enabledCount < items.length;

            elementBlockContainer.appendChild(sectionElement);
        });
    }

    function initElementBlock() {
        initElementBlockSettings();
        renderElementBlockSettings();
        window.addEventListener('load', executeElementBlock);
    }

    async function extractShares() {
        const extractBadge = extractBtn.querySelector('.extract-badge');
        const originalText = extractBtn.innerHTML;

        extractBtn.innerHTML = '<div class="internet-icon"></div>准备中...';
        extractBtn.style.background = 'rgba(0,0,0,0.05)';
        extractBtn.style.color = '#333';
        extractBtn.style.transition = 'background 0.3s ease, color 0.3s ease';
        extractBtn.disabled = true;

        let totalShares = 0;
        let processed = 0;
        let savedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        try {
            let offset = 0;
            const limit = 1150;
            let hasMore = true;
            let allShares = [];
            let fetchedCount = 0;
            let estimatedTotal = 1000;

            while (hasMore) {
                const apiUrl = `https://webapi.115.com/share/slist?user_id=${shareInfo.userId}&offset=${offset}&limit=${limit}`;
                try {
                    const response = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: apiUrl,
                            onload: resolve,
                            onerror: reject
                        });
                    });

                    const data = JSON.parse(response.responseText);
                    if (data.state === true && Array.isArray(data.list)) {
                        allShares = allShares.concat(data.list);
                        fetchedCount += data.list.length;
                        hasMore = data.list.length === limit;
                        offset += limit;

                        if (data.list.length === limit) {
                            estimatedTotal = Math.max(estimatedTotal, fetchedCount + limit);
                        }

                        const fetchProgress = Math.min((fetchedCount / estimatedTotal) * 100, 95);
                        extractBtn.innerHTML = `<div class="internet-icon"></div>获取中 ${fetchedCount} 个`;
                        extractBtn.style.background = `linear-gradient(90deg, #2196f3 ${fetchProgress}%, rgba(0,0,0,0.05) ${fetchProgress}%)`;
                        extractBtn.style.color = fetchProgress > 50 ? 'white' : '#333';

                        await new Promise(resolve => requestAnimationFrame(resolve));
                    } else {
                        hasMore = false;
                    }
                } catch (e) {
                    hasMore = false;
                    console.error('获取分享列表失败:', e);
                    throw new Error(`获取分享列表失败: ${e.message}`);
                }
            }

            totalShares = allShares.length;
            if (totalShares === 0) {
                throw new Error('没有找到任何分享内容');
            }

            extractBtn.innerHTML = `<div class="internet-icon"></div>准备完成 ${totalShares} 个`;
            extractBtn.style.background = '#2196f3';
            extractBtn.style.color = 'white';

            await new Promise(resolve => setTimeout(resolve, 800));

            extractBtn.innerHTML = `<div class="internet-icon"></div>开始导入...`;
            extractBtn.style.background = '#ff9800';
            extractBtn.style.color = 'white';

            await new Promise(resolve => setTimeout(resolve, 300));

            extractBtn.innerHTML = `<div class="internet-icon"></div>0/${totalShares}(0%)`;
            extractBtn.style.background = 'rgba(0,0,0,0.05)';
            extractBtn.style.color = '#333';

            const existingShareCodes = new Set(allItems.map(item => item.shareCode));
            const newShares = allShares.filter(share =>
                !existingShareCodes.has(share.share_code) && share.receive_code
            );

            skippedCount = allShares.length - newShares.length;
            const validShares = newShares.filter(share => share.receive_code);
            errorCount = newShares.length - validShares.length;

            const batchSize = 100;
            const allNewItems = [];

            for (let i = 0; i < validShares.length; i += batchSize) {
                const batch = validShares.slice(i, i + batchSize);

                const batchItems = batch.map(share => ({
                    shareCode: share.share_code,
                    password: share.receive_code,
                    note: '分享导入的内容',
                    shareTitle: processShareTitle({data: {shareinfo: share, list: share.list || []}}),
                    expireTime: share.share_ex_time || -1,
                    fileSize: parseInt(share.file_size || '0'),
                    autoRenewal: String(share.auto_renewal || '0'),
                    ed2k: '',
                    magnet: '',
                    error: '',
                    timestamp: Date.now()
                }));

                allNewItems.push(...batchItems);
                savedCount += batchItems.length;
                processed += batch.length;

                const remainingCount = totalShares - processed;
                const progressPercent = Math.round((processed / totalShares) * 100);

                extractBtn.innerHTML = `<div class="internet-icon"></div>导入 ${processed}/${totalShares}(${progressPercent}%)`;

                extractBtn.classList.add('extract-btn-progress');
                extractBtn.style.setProperty('--progress-percent', `${progressPercent}%`);
                extractBtn.classList.toggle('progress-high', progressPercent > 50);
                extractBtn.classList.toggle('progress-low', progressPercent <= 50);

                await new Promise(resolve => requestAnimationFrame(resolve));
            }

            if (allNewItems.length > 0) {
                batchSaveToStorage(allNewItems);

                const successMsg = `成功导入 ${savedCount} 个分享，跳过 ${skippedCount} 个已存在的分享，${errorCount} 个无访问码的分享`;
                console.log(successMsg);

                extractBtn.innerHTML = `<div class="internet-icon"></div>完成 ${savedCount} 个`;
                extractBtn.classList.remove('extract-btn-progress', 'progress-high', 'progress-low');
                extractBtn.style.removeProperty('--progress-percent');
                extractBtn.style.background = '#4caf50';
                extractBtn.style.color = 'white';

                setTimeout(() => {
                    extractBtn.innerHTML = originalText;
                    extractBtn.style.background = 'rgba(0,0,0,0.05)';
                    extractBtn.style.color = '#333';
                }, 3000);
            }

        } catch (error) {
            console.error('导入分享失败:', error);

            extractBtn.innerHTML = '<div class="internet-icon"></div>提取失败';
            extractBtn.classList.remove('extract-btn-progress', 'progress-high', 'progress-low');
            extractBtn.style.removeProperty('--progress-percent');
            extractBtn.style.background = '#f44336';
            extractBtn.style.color = 'white';

            setTimeout(() => {
                extractBtn.innerHTML = originalText;
                extractBtn.style.background = 'rgba(0,0,0,0.05)';
                extractBtn.style.color = '#333';
            }, 3000);
        } finally {
            extractBtn.disabled = false;
            extractBtn.classList.remove('extract-btn-progress', 'progress-high', 'progress-low');
            extractBtn.style.removeProperty('--progress-percent');
            extractBtn.style.background = 'rgba(0,0,0,0.05)';
            extractBtn.style.color = '#333';
        }
    }

    pauseResumeBtn.addEventListener('click', togglePauseResume);
    stopBtn.addEventListener('click', stopBruteForce);
    charsInput.addEventListener('input', () => validateCharsInput(charsInput.value));
    strategySelect.addEventListener('change', function() {
        const isDigitsMode = this.value.includes('digits');
        if (isDigitsMode) {
            if (!this.dataset.lastChars) this.dataset.lastChars = charsInput.value;
            charsInput.value = '0123456789';
            allChars = '0123456789';
            charsInput.disabled = isRunning || isDigitsMode;
            charsInput.classList.add('disabled-digits');
        } else {
            const lastChars = this.dataset.lastChars || DEFAULT_CHARS;
            charsInput.value = lastChars;
            allChars = lastChars;
            charsInput.disabled = isRunning;
            charsInput.classList.remove('disabled-input');
            charsInput.classList.remove('disabled-digits');
        }
        validateCharsInput(charsInput.value);
        updateStatsInfo();
        if (isRunning || isPaused) {
            const chars = this.value.includes('digits') ? '0123456789' : allChars;
            totalAttempts = Math.pow(chars.length, 4);
        }
    });
    concurrentInput.addEventListener('change', function() {
        let value = parseInt(this.value) || 10;
        if (value < 1) value = 1;
        if (value > 10000) value = 10000;
        this.value = value;
        maxConcurrent = value;
        updateStatsInfo();
    });

    exportBtn.addEventListener('click', exportToCSV);
    importBtn.addEventListener('click', importFromCSV);
    extractBtn.addEventListener('click', extractShares);
    clearBtn.addEventListener('click', clearStorage);

    apiRefreshBtn.addEventListener('click', refreshCurrentFilter);
    refreshBtn.addEventListener('click', () => renderStorage(false));


    deleteExpiredBtn.addEventListener('click', deleteExpiredItems);
    deleteInvalidBtn.addEventListener('click', deleteInvalidItems);
    const deleteErrorBtn = windowElement.querySelector('#delete-error-btn');
    if (deleteErrorBtn) {
        deleteErrorBtn.addEventListener('click', deleteErrorItems);
    }

    const batchCopyBtn = windowElement.querySelector('.batch-actions-container .copy-btn');
    const batchDeleteBtn = windowElement.querySelector('.batch-actions-container .delete-btn');
    const batchCancelBtn = windowElement.querySelector('.batch-actions-container .cancel-btn');

    if (batchCopyBtn) {
        batchCopyBtn.addEventListener('click', batchCopySelected);
    }

    if (batchDeleteBtn) {
        batchDeleteBtn.addEventListener('click', batchDeleteSelected);
    }

    if (batchCancelBtn) {
        batchCancelBtn.addEventListener('click', batchCancelSelected);
    }

    document.addEventListener('keydown', (e) => {

        const storageTabContent = document.querySelector('.storage-tab-content[data-tab-content="storage"]');
        if (!storageTabContent || !storageTabContent.classList.contains('active')) {
            return;
        }

        if (e.ctrlKey && e.key === 'a') {
            e.preventDefault();

            selectedItems.clear();
            for (let i = 0; i < filteredItems.length; i++) {
                selectedItems.add(i);
            }
            lastSelectedIndex = filteredItems.length - 1;
            updateStorageItemSelection();
            updateBatchActions();
        } else if (e.key === 'Escape') {

            batchCancelSelected();
        }
    });

    document.addEventListener('click', (e) => {

        const storageTabContent = document.querySelector('.storage-tab-content[data-tab-content="storage"]');
        if (!storageTabContent || !storageTabContent.classList.contains('active')) {
            return;
        }

        const storageContainer = document.querySelector('#storage-container');
        const sortButtons = document.querySelector('.sort-buttons');

        if (!e.target.closest('.storage-item') &&
            !e.target.closest('.sort-buttons') &&
            !e.target.closest('.storage-container')) {

            if (selectedItems.size > 0) {
                batchCancelSelected();
            }
        }

        const activeInputs = document.querySelectorAll('input[type="text"], input[type="password"], input[type="number"]');
        activeInputs.forEach(input => {

            if (input !== e.target && !input.contains(e.target)) {

                if (input.style.display !== 'none' &&
                    input.style.display !== '' &&
                    input.classList.contains('storage-item-title-input') ||
                    input.classList.contains('storage-item-password-input') ||
                    input.classList.contains('storage-item-note-input') ||
                    input.classList.contains('storage-item-ed2k-input')) {

                    input.blur();
                }
            }
        });
    });

    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            currentSearchTerm = searchInput.value.trim();
            updateSearchClearButton();
            renderStorage();
        }, 300);
    });

    const searchClearBtn = windowElement.querySelector('#search-clear-btn');
    searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        currentSearchTerm = '';
        updateSearchClearButton();
        renderStorage();
        searchInput.focus();
    });

    function updateSearchClearButton() {
        const hasContent = searchInput.value.trim().length > 0;
        searchClearBtn.style.display = hasContent ? 'flex' : 'none';
    }

    searchType.addEventListener('change', () => {
        currentSearchType = searchType.value;
        if (currentSearchTerm) {
            renderStorage();
        }
    });

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilterType = btn.dataset.filter;
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderStorage();
        });
    });

    sortButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentSortType = btn.dataset.sort;
            sortButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderStorage();
        });
    });

    windowElement.addEventListener('click', (e) => {
        if (e.target.classList.contains('copy-correct-btn') && correctPassword) {
            navigator.clipboard.writeText(correctPassword).then(() => {
                const btn = e.target;
                const originalText = btn.textContent;
                btn.textContent = '已复制';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 2000);
            });
        }

        if (e.target.classList.contains('fill-correct-btn') && correctPassword) {
            const input = document.querySelector('.form-decode .text');
            const confirmBtn = document.querySelector('.form-decode .button.btn-large');
            if (input && confirmBtn) {
                input.value = correctPassword;
                const event = new Event('input', { bubbles: true });
                input.dispatchEvent(event);
                confirmBtn.classList.remove('btn-gray');
                confirmBtn.click();
            } else {
                const errorElement = document.getElementById('fill-error');
                errorElement.textContent = '错误：找不到访问码输入框或确认按钮';
                errorElement.style.display = 'block';
                setTimeout(() => {
                    errorElement.style.display = 'none';
                }, 3000);
            }
        }
    });

    updateStatsInfo();
    updateStatusTag();

    try {
        const urlPwd = new URLSearchParams(location.search).get('password');
        if (urlPwd) setTimeout(() => { try { autoFillPassword(urlPwd.trim()); } catch (e) {} }, 0);
    } catch (e) {}

    try {
        window.addEventListener('DOMContentLoaded', () => {
            try { checkCurrentUrlPassword(); } catch (e) {}
        });
    } catch (e) {}

    fetchShareInfo();
    renderStorage();
    initElementBlock();
    setupVirtualScroll();
    setupMaximizeButton();
    setupProTagEdit();
    updateSearchClearButton();

    updateTabVisibility();

    const defaultSortBtn = windowElement.querySelector('.sort-buttons .storage-item-btn[data-sort="time-desc"]');
    if (defaultSortBtn) {
        defaultSortBtn.classList.add('active');
    }

    function renderSettingsPage() {
        const enableCustomSave = GM_getValue('enableCustomSaveButton', true);
        const enableAutoConfirm = GM_getValue('enableAutoConfirm', true);
        const enableShareOwnerInfo = GM_getValue('enableShareOwnerInfo', false);
        const enableDeleteConfirm = GM_getValue('enableDeleteConfirm', true);
        const enableImportSkip = GM_getValue('enableImportSkip', true);
        const enableImportVerify = GM_getValue('enableImportVerify', false);
        const enableMagnetTitleCopy = GM_getValue('enableMagnetTitleCopy', false);
        const enableShareTitleCopy = GM_getValue('enableShareTitleCopy', false);
        const enableOfflineQuotaWidget = GM_getValue('enableOfflineQuotaWidget', true);
        const enableVerifyTab = GM_getValue('enableVerifyTab', true);
        const enableBatchReceiveTab = GM_getValue('enableBatchReceiveTab', true);
        const enableElementBlockTab = GM_getValue('enableElementBlockTab', true);
        const enableBatchRecognizeTab = GM_getValue('enableBatchRecognizeTab', true);
        const enableDedupeTab = GM_getValue('enableDedupeTab', true);
        settingsBlockContainer.innerHTML = `
          <!-- 通用功能 -->
          <div class="settings-section">
            <div class="settings-section-title">
              通用功能
              <div class="category-toggle-container">
                <label class="element-block-switch">
                  <input type="checkbox" class="category-toggle" data-category="通用功能">
                  <span class="element-block-slider"></span>
                </label>
              </div>
            </div>
            <div class="element-block-grid">
              <div class="element-block-item">
                <div class="element-block-item-header element-block-item-header-relative">
                  <label class="element-block-switch">
                    <input type="checkbox" id="custom-save-switch" ${enableCustomSave ? 'checked' : ''}>
                    <span class="element-block-slider"></span>
                  </label>
                  <span class="element-block-name">转存按钮</span>
                  <span id="open-tab-icon" title="打开独立版脚本站点" class="open-tab-icon"></span>
                </div>
                <div class="element-block-selector">分享者进入自己的分享页显示"转存"按钮</div>
              </div>
              <div class="element-block-item">
                <div class="element-block-item-header">
                  <label class="element-block-switch">
                    <input type="checkbox" id="auto-confirm-switch" ${enableAutoConfirm ? 'checked' : ''}>
                    <span class="element-block-slider"></span>
                  </label>
                  <span class="element-block-name">自动确认</span>
                </div>
                <div class="element-block-selector">分享页自动填写并确认访问码</div>
              </div>
              <div class="element-block-item">
                <div class="element-block-item-header">
                  <label class="element-block-switch">
                    <input type="checkbox" id="share-owner-info-switch" ${enableShareOwnerInfo ? 'checked' : ''}>
                    <span class="element-block-slider"></span>
                  </label>
                  <span class="element-block-name">分享者信息</span>
                </div>
                <div class="element-block-selector">“访问码验证”显示分享者用户ID/用户名/头像(非必要建议关闭)</div>
              </div>
              <div class="element-block-item">
                <div class="element-block-item-header">
                  <label class="element-block-switch">
                    <input type="checkbox" id="offline-quota-widget-switch" ${enableOfflineQuotaWidget ? 'checked' : ''}>
                    <span class="element-block-slider"></span>
                  </label>
                  <span class="element-block-name">离线额度显示</span>
                </div>
                <div class="element-block-selector">存储管理页右下角显示离线额度</div>
              </div>
            </div>
          </div>

          <!-- 存储功能 -->
          <div class="settings-section">
            <div class="settings-section-title">
              存储功能
              <div class="category-toggle-container">
                <label class="element-block-switch">
                  <input type="checkbox" class="category-toggle" data-category="存储功能">
                  <span class="element-block-slider"></span>
                </label>
              </div>
            </div>
            <div class="element-block-grid">
              <div class="element-block-item">
                <div class="element-block-item-header">
                  <label class="element-block-switch">
                    <input type="checkbox" id="import-skip-switch" ${enableImportSkip ? 'checked' : ''}>
                    <span class="element-block-slider"></span>
                  </label>
                  <span class="element-block-name">导入跳过</span>
                </div>
                <div class="element-block-selector">导入时会跳过已存在的内容</div>
              </div>
              <div class="element-block-item">
                <div class="element-block-item-header">
                  <label class="element-block-switch">
                    <input type="checkbox" id="import-verify-switch" ${enableImportVerify ? 'checked' : ''}>
                    <span class="element-block-slider"></span>
                  </label>
                  <span class="element-block-name">导入验证</span>
                </div>
                <div class="element-block-selector">导入时会通过API验证访问码有效性，ED2K、磁力链无需验证</div>
              </div>
              <div class="element-block-item">
                <div class="element-block-item-header">
                  <label class="element-block-switch">
                    <input type="checkbox" id="share-title-copy-switch" ${enableShareTitleCopy ? 'checked' : ''}>
                    <span class="element-block-slider"></span>
                  </label>
                  <span class="element-block-name">115分享标题复制</span>
                </div>
                <div class="element-block-selector">复制115分享链接同时复制标题，格式为：标题+换行+分享链接</div>
              </div>
              <div class="element-block-item">
                <div class="element-block-item-header">
                  <label class="element-block-switch">
                    <input type="checkbox" id="magnet-title-copy-switch" ${enableMagnetTitleCopy ? 'checked' : ''}>
                    <span class="element-block-slider"></span>
                  </label>
                  <span class="element-block-name">磁力链标题复制</span>
                </div>
                <div class="element-block-selector">复制磁力链同时复制标题，格式为：标题+换行+磁力链</div>
              </div>
              <div class="element-block-item">
                <div class="element-block-item-header">
                  <label class="element-block-switch">
                    <input type="checkbox" id="harmonize-title-switch" ${GM_getValue('enableHarmonizeTitle', true) ? 'checked' : ''}>
                    <span class="element-block-slider"></span>
                  </label>
                  <span class="element-block-name">和谐分享标题</span>
                </div>
                <div class="element-block-selector">当分享标题包含3个以上***时，尝试从文件列表获取完整标题</div>
              </div>
              <div class="element-block-item">
                <div class="element-block-item-header">
                  <label class="element-block-switch">
                    <input type="checkbox" id="delete-confirm-switch" ${enableDeleteConfirm ? 'checked' : ''}>
                    <span class="element-block-slider"></span>
                  </label>
                  <span class="element-block-name">删除提示</span>
                </div>
                <div class="element-block-selector">存储管理页删除按钮点击时会弹出确认提示</div>
              </div>
            </div>
          </div>

          <!-- 隐藏分页 -->
          <div class="settings-section hidden-tabs-section">
            <div class="settings-section-title">
              隐藏分页
              <div class="category-toggle-container">
                <label class="element-block-switch">
                  <input type="checkbox" class="category-toggle" data-category="隐藏分页">
                  <span class="element-block-slider"></span>
                </label>
              </div>
            </div>
            <div class="element-block-grid">
              <div class="element-block-item">
                <div class="element-block-item-header">
                  <label class="element-block-switch">
                    <input type="checkbox" id="dedupe-tab-switch" ${enableDedupeTab ? 'checked' : ''}>
                    <span class="element-block-slider"></span>
                  </label>
                  <span class="element-block-name">内容查重</span>
                </div>
              </div>
              <div class="element-block-item">
                <div class="element-block-item-header">
                  <label class="element-block-switch">
                    <input type="checkbox" id="batch-receive-tab-switch" ${enableBatchReceiveTab ? 'checked' : ''}>
                    <span class="element-block-slider"></span>
                  </label>
                  <span class="element-block-name">批量接收</span>
                </div>
              </div>
              <div class="element-block-item">
                <div class="element-block-item-header">
                  <label class="element-block-switch">
                    <input type="checkbox" id="batch-recognize-tab-switch" ${enableBatchRecognizeTab ? 'checked' : ''}>
                    <span class="element-block-slider"></span>
                  </label>
                  <span class="element-block-name">批量识别</span>
                </div>
              </div>
              <div class="element-block-item">
                <div class="element-block-item-header">
                  <label class="element-block-switch">
                    <input type="checkbox" id="verify-tab-switch" ${enableVerifyTab ? 'checked' : ''}>
                    <span class="element-block-slider"></span>
                  </label>
                  <span class="element-block-name">验证访问码</span>
                </div>
              </div>
              <div class="element-block-item">
                <div class="element-block-item-header">
                  <label class="element-block-switch">
                    <input type="checkbox" id="element-block-tab-switch" ${enableElementBlockTab ? 'checked' : ''}>
                    <span class="element-block-slider"></span>
                  </label>
                  <span class="element-block-name">元素屏蔽</span>
                </div>
              </div>
            </div>
          </div>
        `;
        const switchInput = settingsBlockContainer.querySelector('#custom-save-switch');
        const autoConfirmSwitch = settingsBlockContainer.querySelector('#auto-confirm-switch');
        const shareOwnerInfoSwitch = settingsBlockContainer.querySelector('#share-owner-info-switch');
        const offlineQuotaWidgetSwitch = settingsBlockContainer.querySelector('#offline-quota-widget-switch');
        const deleteConfirmSwitch = settingsBlockContainer.querySelector('#delete-confirm-switch');
        const importSkipSwitch = settingsBlockContainer.querySelector('#import-skip-switch');
        const harmonizeTitleSwitch = settingsBlockContainer.querySelector('#harmonize-title-switch');
        const importVerifySwitch = settingsBlockContainer.querySelector('#import-verify-switch');
        const magnetTitleCopySwitch = settingsBlockContainer.querySelector('#magnet-title-copy-switch');
        const shareTitleCopySwitch = settingsBlockContainer.querySelector('#share-title-copy-switch');
        const verifyTabSwitch = settingsBlockContainer.querySelector('#verify-tab-switch');
        const batchReceiveTabSwitch = settingsBlockContainer.querySelector('#batch-receive-tab-switch');
        const elementBlockTabSwitch = settingsBlockContainer.querySelector('#element-block-tab-switch');
        const batchRecognizeTabSwitch = settingsBlockContainer.querySelector('#batch-recognize-tab-switch');
        const dedupeTabSwitch = settingsBlockContainer.querySelector('#dedupe-tab-switch');

        switchInput.addEventListener('change', function() {
            GM_setValue('enableCustomSaveButton', this.checked);
            if (this.checked) {
                enableCustomSaveButtonFeature();
            } else {
                disableCustomSaveButtonFeature();
            }
            updateCategoryToggleState(this);
        });

        autoConfirmSwitch.addEventListener('change', function() {
            GM_setValue('enableAutoConfirm', this.checked);
            updateCategoryToggleState(this);
        });
        shareOwnerInfoSwitch.addEventListener('change', function() {
            GM_setValue('enableShareOwnerInfo', this.checked);
            updateCategoryToggleState(this);
        });
        offlineQuotaWidgetSwitch.addEventListener('change', function() {
            GM_setValue('enableOfflineQuotaWidget', this.checked);
            if (typeof updateQuotaWidgetVisibility === 'function') {
                updateQuotaWidgetVisibility();
            }
            updateCategoryToggleState(this);
        });
        deleteConfirmSwitch.addEventListener('change', function() {
            GM_setValue('enableDeleteConfirm', this.checked);
            updateCategoryToggleState(this);
        });

        importSkipSwitch.addEventListener('change', function() {
            GM_setValue('enableImportSkip', this.checked);
            updateCategoryToggleState(this);
        });

        harmonizeTitleSwitch.addEventListener('change', function() {
            GM_setValue('enableHarmonizeTitle', this.checked);
            updateCategoryToggleState(this);
        });

        importVerifySwitch.addEventListener('change', function() {
            GM_setValue('enableImportVerify', this.checked);
            updateCategoryToggleState(this);
        });

        magnetTitleCopySwitch.addEventListener('change', function() {
            GM_setValue('enableMagnetTitleCopy', this.checked);
            updateCategoryToggleState(this);
        });

        shareTitleCopySwitch.addEventListener('change', function() {
            GM_setValue('enableShareTitleCopy', this.checked);
            updateCategoryToggleState(this);
        });

        verifyTabSwitch.addEventListener('change', function() {
            GM_setValue('enableVerifyTab', this.checked);
            updateTabVisibility();
            updateCategoryToggleState(this);
        });

        dedupeTabSwitch.addEventListener('change', function() {
            GM_setValue('enableDedupeTab', this.checked);
            updateTabVisibility();
            updateCategoryToggleState(this);
        });

        batchReceiveTabSwitch.addEventListener('change', function() {
            GM_setValue('enableBatchReceiveTab', this.checked);
            updateTabVisibility();
            updateCategoryToggleState(this);
        });

        elementBlockTabSwitch.addEventListener('change', function() {
            GM_setValue('enableElementBlockTab', this.checked);
            updateTabVisibility();
            updateCategoryToggleState(this);
        });

        batchRecognizeTabSwitch.addEventListener('change', function() {
            GM_setValue('enableBatchRecognizeTab', this.checked);
            updateTabVisibility();
            updateCategoryToggleState(this);
        });

        const categoryToggles = settingsBlockContainer.querySelectorAll('.category-toggle');
        categoryToggles.forEach(toggle => {
            toggle.addEventListener('change', function() {
                const category = this.getAttribute('data-category');
                const section = this.closest('.settings-section');
                const checkboxes = section.querySelectorAll('.element-block-grid input[type="checkbox"]');
                const isChecked = this.checked;

                checkboxes.forEach(checkbox => {
                    checkbox.checked = isChecked;
                    checkbox.dispatchEvent(new Event('change'));
                });

                const enabledCount = Array.from(checkboxes).filter(cb => cb.checked).length;
                this.checked = enabledCount === checkboxes.length;
                this.indeterminate = enabledCount > 0 && enabledCount < checkboxes.length;
            });
        });

        categoryToggles.forEach(toggle => {
            const category = toggle.getAttribute('data-category');
            const section = toggle.closest('.settings-section');
            const checkboxes = section.querySelectorAll('.element-block-grid input[type="checkbox"]');
            const enabledCount = Array.from(checkboxes).filter(cb => cb.checked).length;

            toggle.checked = enabledCount === checkboxes.length;
            toggle.indeterminate = enabledCount > 0 && enabledCount < checkboxes.length;
        });

        function updateCategoryToggleState(checkbox) {
            const section = checkbox.closest('.settings-section');
            const categoryToggle = section.querySelector('.category-toggle');
            if (!categoryToggle) return;

            const checkboxes = section.querySelectorAll('.element-block-grid input[type="checkbox"]');
            const enabledCount = Array.from(checkboxes).filter(cb => cb.checked).length;

            categoryToggle.checked = enabledCount === checkboxes.length;
            categoryToggle.indeterminate = enabledCount > 0 && enabledCount < checkboxes.length;
        }

        const openTabIcon = settingsBlockContainer.querySelector('#open-tab-icon');
        if (openTabIcon) {
            openTabIcon.addEventListener('click', function(e) {
                e.stopPropagation();
                if (confirm('是否要进入独立版脚本站点？')) {
                    window.open('https://greasyfork.org/zh-CN/scripts/543416', '_blank');
                }
            });
        }

        updateTabVisibility();
    }

    function updateTabVisibility() {
        const enableVerifyTab = GM_getValue('enableVerifyTab', true);
        const enableBatchReceiveTab = GM_getValue('enableBatchReceiveTab', true);
        const enableElementBlockTab = GM_getValue('enableElementBlockTab', true);
        const enableBatchRecognizeTab = GM_getValue('enableBatchRecognizeTab', true);
        const enableDedupeTab = GM_getValue('enableDedupeTab', true);

        const verifyTab = document.querySelector('.storage-tab[data-tab="verify"]');
        const batchReceiveTab = document.querySelector('.storage-tab[data-tab="batchreceive"]');
        const elementBlockTab = document.querySelector('.storage-tab[data-tab="elementblock"]');
        const batchRecognizeTab = document.querySelector('.storage-tab[data-tab="batchrecognize"]');
        const dedupeTab = document.querySelector('.storage-tab[data-tab="dedupe"]');

        if (verifyTab) {
            verifyTab.style.display = enableVerifyTab ? 'block' : 'none';
        }
        if (batchReceiveTab) {
            batchReceiveTab.style.display = enableBatchReceiveTab ? 'block' : 'none';
        }
        if (elementBlockTab) {
            elementBlockTab.style.display = enableElementBlockTab ? 'block' : 'none';
        }
        if (batchRecognizeTab) {
            batchRecognizeTab.style.display = enableBatchRecognizeTab ? 'block' : 'none';
        }
        if (dedupeTab) {
            dedupeTab.style.display = enableDedupeTab ? 'block' : 'none';
        }

        const activeTab = document.querySelector('.storage-tab.active');
        if (activeTab && activeTab.style.display === 'none') {
            const storageTab = document.querySelector('.storage-tab[data-tab="storage"]');
            if (storageTab) {
                storageTab.click();
            }
        }
    }

    let customSaveObserver = null;
    function enableCustomSaveButtonFeature() {
        if (window._customSaveButtonEnabled) return;
        window._customSaveButtonEnabled = true;
        const createSaveMenu = () => {
            if (document.getElementById('custom-save-menu')) return document.getElementById('custom-save-menu');
            const menu = document.createElement('div');
            menu.className = 'context-menu';
            menu.id = 'custom-save-menu';
            menu.style.cssText = `display: none; position: absolute; top: 100%; left: 0; z-index: 999; min-width: 120px; background-color: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.2); border-radius: 4px;`;
            menu.innerHTML = `<div class="cell-icon"><ul><li><a href="javascript:;" class="fast-save-link"><i class="icon-operate ifo-fastsaveto"></i><span>一键转存</span></a></li></ul></div>`;
            document.body.appendChild(menu);
            return menu;
        };
        const addSaveButton = () => {
            const menuContainer = document.getElementById('js-menu');
            const downloadButton = document.querySelector('a[btn="download"]');
            if (!menuContainer || !downloadButton) return;
            document.querySelectorAll('#custom-save-button').forEach(btn => btn.remove());
            const saveButton = document.createElement('a');
            saveButton.id = 'custom-save-button';
            saveButton.setAttribute('href', 'javascript:;');
            saveButton.setAttribute('btn', 'save');
            saveButton.setAttribute('data-custom', 'true');
            saveButton.className = 'button';
            saveButton.style.position = 'relative';
            saveButton.innerHTML = `<i class="icon-operate ifo-saveto"></i><span>转存</span><i class="ibco-arrow-solid"></i>`;
            let saveMenu = document.getElementById('custom-save-menu') || createSaveMenu();
            const fastSaveLink = saveMenu.querySelector('.fast-save-link');
            menuContainer.insertBefore(saveButton, downloadButton);
            const handleMouseEnter = () => {
                if (saveButton.classList.contains('btn-disabled')) return;
                const rect = saveButton.getBoundingClientRect();
                saveMenu.style.display = 'block';
                saveMenu.style.top = `${rect.bottom + window.scrollY}px`;
                saveMenu.style.left = `${rect.left + window.scrollX}px`;
            };
            const handleMouseLeave = () => {
                setTimeout(() => {
                    if (!saveMenu.matches(':hover') && !saveButton.matches(':hover')) {
                        saveMenu.style.display = 'none';
                    }
                }, 100);
            };
            saveButton.addEventListener('mouseenter', handleMouseEnter);
            saveButton.addEventListener('mouseleave', handleMouseLeave);
            saveMenu.addEventListener('mouseleave', () => saveMenu.style.display = 'none');
            fastSaveLink.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                saveMenu.style.display = 'none';
                const enterDownloadBox = document.getElementById('enter_download_box');
                if (enterDownloadBox) enterDownloadBox.style.display = 'block';
            });
            saveButton.addEventListener('click', (e) => {
                if (!e.target.closest('.fast-save-link')) {
                    const nativeSaveButton = document.querySelector('a[btn="save"]:not([data-custom])');
                    if (nativeSaveButton) {
                        nativeSaveButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
                    }
                }
            });
        };
        const checkAndAddSaveButton = () => {
            const menuContainer = document.getElementById('js-menu');
            if (!menuContainer) return;
            const existingCustomButton = document.getElementById('custom-save-button');
            if (existingCustomButton) {
                existingCustomButton.style.display = '';
                return;
            }
            const nativeSaveButton = document.querySelector('a[btn="save"]:not([data-custom])');
            if (!nativeSaveButton || nativeSaveButton.style.display === 'none') {
                addSaveButton();
            }
        };
        const initObserver = () => {
            const targetNode = document.getElementById('js-warp');
            if (!targetNode) return;
            customSaveObserver = new MutationObserver(() => checkAndAddSaveButton());
            customSaveObserver.observe(targetNode, { childList: true, subtree: true });
        };
        window.addEventListener('load', () => {
            checkAndAddSaveButton();
            initObserver();
            window._customSaveInterval = setInterval(checkAndAddSaveButton, 1000);
        });
        checkAndAddSaveButton();
        initObserver();
        window._customSaveInterval = setInterval(checkAndAddSaveButton, 1000);
    }
    function disableCustomSaveButtonFeature() {
        window._customSaveButtonEnabled = false;
        document.querySelectorAll('#custom-save-button').forEach(btn => btn.remove());
        document.getElementById('custom-save-menu')?.remove();
        if (customSaveObserver) {
            customSaveObserver.disconnect();
            customSaveObserver = null;
        }
        if (window._customSaveInterval) {
            clearInterval(window._customSaveInterval);
            window._customSaveInterval = null;
        }
    }
    if (GM_getValue('enableCustomSaveButton', true)) {
        enableCustomSaveButtonFeature();
    }

    function renderBatchReceivePage() {
        function getBatchReceiveElements() {
            return {
                inputContainer: batchReceiveContainer.querySelector('#batch-receive-input-container'),
                controlsMain: batchReceiveContainer.querySelector('.batch-receive-controls-main'),
                controlsContainer: batchReceiveContainer.querySelector('.batch-receive-controls'),
                resultDiv: batchReceiveContainer.querySelector('#batch-receive-result'),
                progressWrap: batchReceiveContainer.querySelector('#batch-receive-progress'),
                exportBtn: batchReceiveContainer.querySelector('#batch-receive-export-btn'),
                backBtn: batchReceiveContainer.querySelector('#batch-receive-back-btn'),
                startBtn: batchReceiveContainer.querySelector('#batch-receive-start-btn'),
                progressBtn: batchReceiveContainer.querySelector('#batch-receive-progress-btn'),
                textarea: batchReceiveContainer.querySelector('#batch-receive-textarea'),
                cidInput: batchReceiveContainer.querySelector('#batch-receive-cid'),
                cidSelect: batchReceiveContainer.querySelector('#batch-receive-cid-select'),
                delayInput: batchReceiveContainer.querySelector('#batch-receive-delay'),
                autoStorageCheckbox: batchReceiveContainer.querySelector('#batch-receive-auto-storage'),
                progressBar: batchReceiveContainer.querySelector('#batch-receive-progress-bar'),
                statusDiv: batchReceiveContainer.querySelector('#batch-receive-status')
            };
        }

        function switchBatchReceiveUI(mode) {
            const elements = getBatchReceiveElements();

            switch(mode) {
                case 'input':
                    elements.inputContainer?.classList.remove('batch-receive-container-hidden');
                    elements.inputContainer?.classList.add('batch-receive-container-visible');
                    elements.controlsMain?.classList.remove('batch-receive-container-hidden');
                    elements.controlsMain?.classList.add('batch-receive-container-visible');
                    elements.controlsContainer?.classList.remove('batch-receive-flex-hidden');
                    elements.controlsContainer?.classList.add('batch-receive-flex-visible');
                    elements.resultDiv?.classList.remove('batch-receive-container-visible');
                    elements.resultDiv?.classList.add('batch-receive-container-hidden');
                    elements.backBtn?.classList.remove('batch-receive-btn-visible');
                    elements.backBtn?.classList.add('batch-receive-btn-hidden');
                    elements.startBtn?.classList.remove('batch-receive-btn-hidden');
                    elements.startBtn?.classList.add('batch-receive-btn-visible');
                    elements.progressWrap?.classList.remove('batch-receive-container-visible');
                    elements.progressWrap?.classList.add('batch-receive-container-hidden');
                    elements.progressBtn?.classList.remove('batch-receive-btn-visible');
                    elements.progressBtn?.classList.add('batch-receive-btn-hidden');
                    elements.exportBtn?.classList.remove('batch-receive-btn-visible');
                    elements.exportBtn?.classList.add('batch-receive-btn-hidden');
                    break;

                case 'progress':
                    elements.inputContainer?.classList.remove('batch-receive-container-visible');
                    elements.inputContainer?.classList.add('batch-receive-container-hidden');
                    elements.controlsMain?.classList.remove('batch-receive-container-visible');
                    elements.controlsMain?.classList.add('batch-receive-container-hidden');
                    elements.controlsContainer?.classList.remove('batch-receive-flex-visible');
                    elements.controlsContainer?.classList.add('batch-receive-flex-hidden');
                    elements.resultDiv?.classList.remove('batch-receive-container-hidden');
                    elements.resultDiv?.classList.add('batch-receive-container-visible');
                    elements.progressWrap?.classList.remove('batch-receive-container-hidden');
                    elements.progressWrap?.classList.add('batch-receive-container-visible');
                    break;
            }
        }

        if (batchReceiveContainer.querySelector('#batch-receive-input-container')) {
            const batchReceiveSettings = JSON.parse(localStorage.getItem('batchReceiveSettings') || '{}');
            const elements = getBatchReceiveElements();

            if (batchReceiveSettings.autoStorage !== undefined) {
                elements.autoStorageCheckbox.checked = batchReceiveSettings.autoStorage;
            }
            if (batchReceiveSettings.cid) {
                elements.cidInput.value = batchReceiveSettings.cid;
                if (['0','100115'].includes(batchReceiveSettings.cid)) {
                    elements.cidSelect.value = batchReceiveSettings.cid;
                } else {
                    elements.cidSelect.value = '';
                }
            }
            return;
        }

        batchReceiveContainer.innerHTML = `
          <div id="batch-receive-input-container">
            <textarea id="batch-receive-textarea" class="modal-textarea" placeholder="请在此处粘贴需要接收的分享内容...

支持域名:
- 115.com | 115cdn.com | anxia.com

支持的格式：
• 完整链接：https://115.com/s/分享码?password=访问码
• 简化链接：分享码?password=访问码
• 移动端格式：/分享码-访问码/
• 分离格式：分享码 访问码
• 关键词格式：分享码 提取码: xxxx 或 分享码 密码: xxxx
• 访问码格式：访问码: xxxx
• 提取码格式：提取码: xxxx
• 密码格式：密码: xxxx

提示：每行一个分享内容，支持混合格式"></textarea>
          </div>
          <div id="batch-receive-result" class="batch-results-container"></div>
          <div class="batch-receive-controls">
            <div class="batch-receive-controls-main">
              <div class="batch-receive-controls-row">
                <div class="batch-receive-setting-item">
                  <label class="label">目录CID</label>
                  <div class="batch-receive-cid-controls">
                    <input type="text" id="batch-receive-cid" class="input" value="100115" pattern="[0-9]*" inputmode="numeric">
                    <select id="batch-receive-cid-select" class="input">
                      <option value="0">根目录</option>
                      <option value="100115" selected>最近接收</option>
                    </select>
                  </div>
                </div>
                <div class="batch-receive-setting-item">
                  <label class="label">延迟接收(ms)</label>
                  <input type="number" id="batch-receive-delay" class="input input-width-small" value="100" min="0" max="5000">
                </div>
                <div class="batch-receive-setting-item">
                  <label class="label">存储到管理页</label>
                  <span class="element-block-switch">
                    <input type="checkbox" id="batch-receive-auto-storage" checked>
                    <span class="element-block-slider"></span>
                  </span>
                </div>
              </div>
            </div>
            <button id="batch-receive-start-btn" class="btn-primary batch-receive-start-btn">开始接收</button>
            <button id="batch-receive-back-btn" class="btn-primary batch-receive-start-btn btn-hidden">返回接收</button>
          </div>
          <div id="batch-receive-progress" class="progress-container batch-recognize-progress">
            <div class="progress-header batch-recognize-progress-header">
              <div>
                <span class="progress-info">接收进度</span>
              </div>
              <button id="batch-receive-progress-btn" class="btn-primary batch-recognize-start-btn batch-recognize-progress-btn btn-visible">返回接收</button>
            </div>
            <div class="progress-bar-container batch-recognize-progress-bar-container">
              <span id="batch-receive-progress-text"><span class="batch-recognize-progress-status">
                <span class="status-label">目录: 最近接收</span>
                <span class="status-separator">|</span>
                <span class="status-label">存储: 开启</span>
                <span class="status-separator">|</span>
                <span class="status-progress">进度: 0/0 (0%)</span>
                <span class="status-separator">|</span>
                <span class="status-success">成功: 0</span>
                <span class="status-separator">|</span>
                <span class="status-failed">失败: 0</span>
            </span></span>
              <button id="batch-receive-export-btn" class="storage-import-export-btn batch-recognize-export-btn btn-hidden" data-text="导出结果">导出结果</button>
            </div>
                          <div class="progress-bar" id="batch-receive-progress-bar"></div>
          </div>
        `;
        const textarea = batchReceiveContainer.querySelector('#batch-receive-textarea');
        const cidInput = batchReceiveContainer.querySelector('#batch-receive-cid');
        const cidSelect = batchReceiveContainer.querySelector('#batch-receive-cid-select');
        const startBtn = batchReceiveContainer.querySelector('#batch-receive-start-btn');
        const backBtn = batchReceiveContainer.querySelector('#batch-receive-back-btn');
        const progressBar = batchReceiveContainer.querySelector('#batch-receive-progress-bar');
        const progressWrap = batchReceiveContainer.querySelector('#batch-receive-progress');
        const statusDiv = batchReceiveContainer.querySelector('#batch-receive-status');
        const resultDiv = batchReceiveContainer.querySelector('#batch-receive-result');
        const exportBtn = batchReceiveContainer.querySelector('#batch-receive-export-btn');
        const autoStorageCheckbox = batchReceiveContainer.querySelector('#batch-receive-auto-storage');
        const progressBtn = batchReceiveContainer.querySelector('#batch-receive-progress-btn');
        const delayInput = batchReceiveContainer.querySelector('#batch-receive-delay');

        const inputContainerEl = batchReceiveContainer.querySelector('#batch-receive-input-container');
        if (inputContainerEl && !inputContainerEl.querySelector('.clear-text-btn')) {
            const clearBtn = document.createElement('button');
            clearBtn.type = 'button';
            clearBtn.className = 'clear-text-btn';
            clearBtn.title = '清空';
            clearBtn.innerHTML = `
              <svg class="clear-brush-svg" width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true">
                <g stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path fill="none" d="M10,4 C10,2.8954305 10.8954305,2 12,2 C13.1045695,2 14,2.8954305 14,4 L14,10 L20,10 L20,14 L4,14 L4,10 L10,10 L10,4 Z M4,14 L20,14 L20,22 L12,22 L4,22 L4,14 Z M16,22 L16,16.3646005 M8,22 L8,16.3646005 M12,22 L12,16.3646005"></path>
                </g>
              </svg>`;
            clearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (textarea) {
                    textarea.value = '';
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                    textarea.focus();
                }
            });
            inputContainerEl.appendChild(clearBtn);

            const updateClearVisibility = () => {
                if (!textarea) return;
                clearBtn.style.display = textarea.value.trim() ? 'inline-flex' : 'none';
            };
            updateClearVisibility();
            const updateClearPosition = () => {
                if (!textarea) return;
                const scrollbarWidth = textarea.offsetWidth - textarea.clientWidth;
                const baseRight = 6 + (scrollbarWidth > 0 ? scrollbarWidth : 0);
                clearBtn.style.right = baseRight + 'px';
            };
            updateClearPosition();

            if (textarea && !textarea._clearBound) {
                textarea.addEventListener('input', () => {
                    updateClearVisibility();
                    updateClearPosition();
                });
                window.addEventListener('resize', updateClearPosition);
                textarea._clearBound = true;
            }
        }

        let isCancelled = false;
        let totalItems = 0;
        let processedItems = 0;
        let successCount = 0;
        let failedCount = 0;

        function updateProgress() {
            const progress = totalItems > 0 ? (processedItems / totalItems) * 100 : 0;
            progressBar.style.width = `${progress}%`;

            let directoryText = '最近接收';
            if (cidSelect.value === '0') {
                directoryText = '根目录';
            } else if (cidSelect.value === '100115') {
                directoryText = '最近接收';
            } else if (cidInput.value && !['0', '100115'].includes(cidInput.value)) {
                directoryText = `CID: ${cidInput.value}`;
            }

            const storageText = autoStorageCheckbox.checked ? '开启' : '关闭';
            const delayText = `${delayInput.value}ms`;

            const progressHtml = `<span class="batch-recognize-progress-status">
                <span class="status-label">目录: ${directoryText}</span>
                <span class="status-separator">|</span>
                <span class="status-label">存储: ${storageText}</span>
                <span class="status-separator">|</span>
                <span class="status-label">延迟: ${delayText}</span>
                <span class="status-separator">|</span>
                <span class="status-progress">进度: ${processedItems}/${totalItems} (${Math.round(progress)}%)</span>
                <span class="status-separator">|</span>
                <span class="status-success">成功: ${successCount}</span>
                <span class="status-separator">|</span>
                <span class="status-failed">失败: ${failedCount}</span>
            </span>`;

            const progressText = batchReceiveContainer.querySelector('#batch-receive-progress-text');
            if (progressText) {
                progressText.innerHTML = progressHtml;
            }
        }

        function saveBatchReceiveSettings() {
            const settings = {
                autoStorage: autoStorageCheckbox.checked,
                cid: cidInput.value,
                delay: delayInput.value
            };
            localStorage.setItem('batchReceiveSettings', JSON.stringify(settings));
        }

        autoStorageCheckbox.addEventListener('change', saveBatchReceiveSettings);
        cidInput.addEventListener('input', saveBatchReceiveSettings);

        const batchReceiveSwitch = batchReceiveContainer.querySelector('.element-block-switch');
        if (batchReceiveSwitch) {
            batchReceiveSwitch.addEventListener('click', (e) => {
                const checkbox = batchReceiveSwitch.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        }

        let results = JSON.parse(localStorage.getItem('batchReceiveResults') || '[]');

        function showSharedResult() {
            const inputContainer = batchReceiveContainer.querySelector('#batch-receive-input-container');

            if (inputContainer && inputContainer.style.display !== 'none') {
                resultDiv.style.display = 'none';
                return;
            }

            if (results && results.length > 0) {
                showResult(true);
            } else {
                resultDiv.style.display = 'none';
            }
        }

        function parseLine(line) {
            let urlMatch = line.match(/https?:\/\/(?:115cdn\.com|anxia\.com|115\.com)\/s\/(\w+)(?:\?password=(\w+))?[#]?/i);
            if (urlMatch) {
                return {share_code: urlMatch[1], receive_code: urlMatch[2] || ''};
            }
            let simMatch = line.match(/(\w{8,20})\?password=(\w{4,20})/i);
            if (simMatch) {
                return {share_code: simMatch[1], receive_code: simMatch[2]};
            }

            let slashMatch = line.match(/^\/([a-zA-Z0-9]{8,20})-([a-zA-Z0-9]{4,10})\/$/);
            if (slashMatch) {
                return {share_code: slashMatch[1], receive_code: slashMatch[2]};
            }
            let txtMatch = line.match(/([a-zA-Z0-9]{8,20})\s+([a-zA-Z0-9]{4,10})/);
            if (txtMatch) {
                if (txtMatch[1].length >= txtMatch[2].length) {
                    return {share_code: txtMatch[1], receive_code: txtMatch[2]};
                } else {
                    return {share_code: txtMatch[2], receive_code: txtMatch[1]};
                }
            }
            let keyMatch = line.match(/([a-zA-Z0-9]{8,20}).*?(?:提取码|密码|code)[:：]?\s*([a-zA-Z0-9]{4,10})/i);
            if (keyMatch) {
                return {share_code: keyMatch[1], receive_code: keyMatch[2]};
            }
            return null;
        }

        function parseMultiLineFormat(lines) {
            const results = [];
            let currentShareCode = '';
            let currentReceiveCode = '';
            let currentTitle = '';

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

        const urlMatch = line.match(/https?:\/\/(?:115cdn\.com|anxia\.com|115\.com)\/s\/(\w+)(?:\?password=(\w+))?[#]?/i);
                if (urlMatch) {

                    if (currentShareCode && currentReceiveCode) {
                        results.push({
                            share_code: currentShareCode,
                            receive_code: currentReceiveCode,
                            title: currentTitle
                        });
                    }
                    currentShareCode = urlMatch[1];
                    currentReceiveCode = urlMatch[2] || '';
                    currentTitle = '';
                    continue;
                }

                const slashMatch = line.match(/^\/([a-zA-Z0-9]{8,20})-([a-zA-Z0-9]{4,10})\/$/);
                if (slashMatch) {

                    if (currentShareCode && currentReceiveCode) {
                        results.push({
                            share_code: currentShareCode,
                            receive_code: currentReceiveCode,
                            title: currentTitle
                        });
                    }
                    currentShareCode = slashMatch[1];
                    currentReceiveCode = slashMatch[2];
                    currentTitle = '';
                    continue;
                }

                const codeMatch = line.match(/访问码[:：]\s*([a-zA-Z0-9]{4,10})/i);
                if (codeMatch) {
                    currentReceiveCode = codeMatch[1];
                    continue;
                }

                const extractMatch = line.match(/提取码[:：]\s*([a-zA-Z0-9]{4,10})/i);
                if (extractMatch) {
                    currentReceiveCode = extractMatch[1];
                    continue;
                }

                const passwordMatch = line.match(/密码[:：]\s*([a-zA-Z0-9]{4,10})/i);
                if (passwordMatch) {
                    currentReceiveCode = passwordMatch[1];
                    continue;
                }

                if (line.includes('.') && (line.includes('.mkv') || line.includes('.mp4') || line.includes('.avi') ||
                    line.includes('.mov') || line.includes('.wmv') || line.includes('.flv') ||
                    line.includes('.rmvb') || line.includes('.ts') || line.includes('.m4v'))) {
                    currentTitle = line;
                    continue;
                }

                const codeOnlyMatch = line.match(/^([a-zA-Z0-9]{4,20})$/);
                if (codeOnlyMatch) {
                    const code = codeOnlyMatch[1];
                    if (code.length >= 8) {

                        if (!currentShareCode) {
                            currentShareCode = code;
                        }
                    } else {

                        if (!currentReceiveCode) {
                            currentReceiveCode = code;
                        }
                    }
                    continue;
                }
            }

            if (currentShareCode && currentReceiveCode) {
                results.push({
                    share_code: currentShareCode,
                    receive_code: currentReceiveCode,
                    title: currentTitle
                });
            }

            return results;
        }

        function showBatchReceiveStatus(msg, color, stats = null) {
            const progressText = batchReceiveContainer.querySelector('#batch-receive-progress-text');

            if (progressText) {


                let directoryText = '最近接收';
                if (cidSelect.value === '0') {
                    directoryText = '根目录';
                } else if (cidSelect.value === '100115') {
                    directoryText = '最近接收';
                } else if (cidInput.value && !['0', '100115'].includes(cidInput.value)) {
                    directoryText = `CID: ${cidInput.value}`;
                }

                const storageText = autoStorageCheckbox.checked ? '开启' : '关闭';
                const delayText = `${delayInput.value}ms`;

                if (stats) {
                    const statsMatch = stats.match(/成功:\s*(\d+)\s*\|\s*失败:\s*(\d+)/);
                    if (statsMatch) {
                        const successCount = parseInt(statsMatch[1]);
                        const failCount = parseInt(statsMatch[2]);
                        const totalCount = successCount + failCount;
                        const progress = totalCount > 0 ? Math.round((successCount + failCount) / totalCount * 100) : 0;

                        const progressHtml = `<span class="batch-recognize-progress-status">
                            <span class="status-label">目录: ${directoryText}</span>
                            <span class="status-separator">|</span>
                            <span class="status-label">存储: ${storageText}</span>
                            <span class="status-separator">|</span>
                            <span class="status-label">延迟: ${delayText}</span>
                            <span class="status-separator">|</span>
                            <span class="status-progress">进度: ${successCount + failCount}/${totalCount} (${progress}%)</span>
                            <span class="status-separator">|</span>
                            <span class="status-success">成功: ${successCount}</span>
                            <span class="status-separator">|</span>
                            <span class="status-failed">失败: ${failCount}</span>
                        </span>`;

                        progressText.innerHTML = progressHtml;
                    } else {
                        progressText.innerHTML = `<span class="text-color-gray">${stats}</span>`;
                    }
                } else {

                    progressText.innerHTML = `<span class="text-color-custom" style="--text-color: ${color||'#4285f4'};">${msg}</span>`;
                }
            }
        }

        function showResult(showExportButton = false) {
            try {

                const inputContainer = batchReceiveContainer.querySelector('#batch-receive-input-container');
            if (inputContainer && !inputContainer.classList.contains('batch-receive-container-hidden')) {
                resultDiv.classList.remove('batch-receive-container-visible');
                resultDiv.classList.add('batch-receive-container-hidden');
                return;
            }

            resultDiv.classList.remove('batch-receive-container-hidden');
            resultDiv.classList.add('batch-receive-container-visible');
            const isMaximized = windowElement.classList.contains('maximized');
            if (isMaximized) {
                resultDiv.classList.remove('batch-receive-result-dynamic');
                resultDiv.classList.add('batch-receive-result-maximized');
            } else {
                resultDiv.classList.remove('batch-receive-result-maximized');
                resultDiv.classList.add('batch-receive-result-dynamic');
            }

            resultDiv.innerHTML = results.map((r, index) => {
                const shareLink = `https://115cdn.com/s/${r.share_code}?password=${r.receive_code}`;
                const title = r.title || '无标题';
                const fileSize = r.fileSize || 0;

                const fileSizeTag = (r.success && fileSize > 0) ?
                    `<span class="batch-receive-file-size">${formatFileSize(fileSize)}</span>` : '';

                let statusClass = 'error';
                let statusText = r.msg || '接收失败';

                if (r.success) {
                    statusClass = 'success';
                    statusText = r.msg || '接收成功';
                }

                return `<div class="batch-result-item compact-layout ${statusClass}" data-index="${index}">
                    <div class="batch-result-item-title">
                        <div>
                            ${fileSizeTag}
                            <span class="batch-receive-file-name" title="${title}">${title}</span>
                        </div>
                        <div class="batch-result-item-actions">
                            <button class="storage-item-btn copy-btn">复制</button>
                            <button class="storage-item-btn open-btn ${r.success ? '' : 'btn-hidden'}">打开</button>
                        </div>
                    </div>
                    <div class="batch-result-item-details">
                        <span class="batch-result-link" title="点击打开链接" data-link="${shareLink}">${shareLink}</span>
                        <span class="batch-result-status ${statusClass}">${statusText}</span>
                    </div>
                </div>`;
            }).join('');

            results.forEach((r, index) => {
                const item = resultDiv.querySelector(`[data-index="${index}"]`);
                const copyBtn = item.querySelector('.copy-btn');
                const linkSpan = item.querySelector('.batch-result-link');

                const shareLink = `https://115cdn.com/s/${r.share_code}?password=${r.receive_code}`;
                const title = r.title || '无标题';

                copyBtn.addEventListener('click', () => {
                    if (copyBtn._copyTimer) clearTimeout(copyBtn._copyTimer);
                    const text = `${shareLink}#\n${title}`;
                    navigator.clipboard.writeText(text).then(() => {
                        copyBtn.textContent = '已复制';
                        copyBtn.classList.add('copied');
                        copyBtn._copyTimer = setTimeout(() => {
                            copyBtn.textContent = '复制';
                            copyBtn.classList.remove('copied');
                            copyBtn._copyTimer = null;
                        }, 1000);
                    }).catch(() => alert('复制失败'));
                });

                linkSpan.addEventListener('click', () => {
                    window.open(shareLink, '_blank');
                });

                const openBtn = item.querySelector('.open-btn');
                if (openBtn) {
                    openBtn.addEventListener('click', () => {
                        window.open(shareLink, '_blank');
                    });
                }
            });

            if (results.length > 0) {
                exportBtn.classList.remove('batch-receive-btn-hidden');
                exportBtn.classList.add('batch-receive-btn-visible');
                exportBtn.classList.remove('btn-hidden');
                exportBtn.classList.add('btn-visible');
                statusDiv.classList.remove('batch-receive-container-hidden');
                statusDiv.classList.add('batch-receive-container-visible');
            } else {
                exportBtn.classList.remove('batch-receive-btn-visible');
                exportBtn.classList.add('batch-receive-btn-hidden');
                exportBtn.classList.add('btn-hidden');
                exportBtn.classList.remove('btn-visible');
            }


            localStorage.setItem('batchReceiveResults', JSON.stringify(results));
            } catch (error) {
                console.error('showResult函数发生错误:', error);
            }
        }

        async function batchReceive() {
            const elements = getBatchReceiveElements();
            const lines = elements.textarea.value.split('\n').map(l => l.trim()).filter(l => l);
            const cid = elements.cidInput.value || '0';
            const autoStorageChecked = elements.autoStorageCheckbox.checked;

            if (!lines.length) {
                showBatchReceiveStatus('请粘贴分享内容', '#f44336');
                return;
            }

            switchBatchReceiveUI('progress');
            elements.resultDiv.innerHTML = '<div class="text-color-gray batch-receive-ready">准备开始批量接收...</div>';

            results = [];
            progressWrap.classList.remove('batch-receive-container-hidden');
            progressWrap.classList.add('batch-receive-container-visible');
            exportBtn.classList.remove('batch-receive-btn-visible');
            exportBtn.classList.add('batch-receive-btn-hidden');
            totalItems = 0;
            processedItems = 0;
            successCount = 0;
            failedCount = 0;

            let validInfos = lines.map(line => ({line, info: parseLine(line)})).filter(obj => obj.info && obj.info.share_code && obj.info.receive_code);

            if (validInfos.length === 0) {
                const multiLineResults = parseMultiLineFormat(lines);
                if (multiLineResults.length > 0) {
                    validInfos = multiLineResults.map(info => ({line: `${info.share_code} - ${info.receive_code}`, info}));
                }
            }

            if (validInfos.length === 0) {
                showBatchReceiveStatus('未识别到有效的分享链接或格式', '#f44336');
                switchBatchReceiveUI('input');
                return;
            }

            totalItems = validInfos.length;
            updateProgress();
            elements.startBtn.textContent = '取消接收';
            isCancelled = false;
            elements.progressBtn.classList.remove('batch-receive-btn-hidden');
            elements.progressBtn.classList.add('batch-receive-btn-visible');
            elements.progressBtn.textContent = '取消接收';

            try {
                for (let i = 0; i < validInfos.length; i++) {
                if (isCancelled) break;
                const {line, info} = validInfos[i];
                let title = '';
                let shareInfo = null;
                let apiResp = null;
                let fileSize = 0;

                processedItems = i + 1;
                updateProgress();

                console.log(`处理第 ${i + 1}/${validInfos.length} 个: ${info.share_code}`);

                try {
                    const apiUrl = `https://115cdn.com/webapi/share/snap?share_code=${info.share_code}&receive_code=${info.receive_code}`;
                    apiResp = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: apiUrl,
                            onload: r => {
                                try {
                                    const data = JSON.parse(r.responseText);
                                    resolve(data);
                                } catch(e) { reject(e); }
                            },
                            onerror: e => reject(e)
                        });
                    });
                    if (apiResp && apiResp.state && apiResp.data) {
                        if (apiResp.data.shareinfo) {
                            shareInfo = apiResp.data.shareinfo;
                            title = processShareTitle({data: {shareinfo: shareInfo, list: apiResp?.data?.list || []}});
                            fileSize = parseInt(shareInfo.file_size || '0');
                        } else if (apiResp.data) {
                            shareInfo = apiResp.data;
                            title = processShareTitle({data: {shareinfo: shareInfo, list: apiResp?.data?.list || []}});
                            fileSize = parseInt(shareInfo.file_size || '0');
                        }
                    }
                } catch (e) {

                }

                try {
                    const resp = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: 'https://webapi.115.com/share/receive',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            data: `share_code=${encodeURIComponent(info.share_code)}&receive_code=${encodeURIComponent(info.receive_code)}&file_id=0&cid=${encodeURIComponent(cid)}`,
                            onload: r => {
                                try {
                                    const data = JSON.parse(r.responseText);
                                    resolve(data);
                                } catch(e) { reject(e); }
                            },
                            onerror: e => reject(e)
                        });
                    });

                    if (resp && resp.state) {
                        if (autoStorageChecked && shareInfo) {
                            let userId = '未知';
                            if (apiResp && apiResp.data && apiResp.data.userinfo) {
                                userId = apiResp.data.userinfo.user_id || '未知';
                            } else if (shareInfo.user_id) {
                                userId = shareInfo.user_id;
                            }

                            const shareTitle = shareInfo.share_title || '';
                            const expireTime = parseInt(shareInfo.expire_time || '-1');
                            const autoRenewal = String(shareInfo.auto_renewal || '0');

                            const note = shareTitle ? `[批量接收] ${shareTitle}` : '[批量接收]';

                            saveToStorage(
                                info.share_code,
                                info.receive_code,
                                note,
                                shareTitle,
                                expireTime,
                                fileSize,
                                autoRenewal
                            );
                        }

                        results.push({share_code: info.share_code, receive_code: info.receive_code, title, success: true, msg: '转存成功', fileSize: fileSize});
                        successCount++;
                        updateProgress();
                    } else if (resp && typeof resp.error === 'string') {
                        results.push({share_code: info.share_code, receive_code: info.receive_code, title, success: false, msg: resp.error, fileSize: fileSize});
                        failedCount++;
                        updateProgress();
                    } else {
                        results.push({share_code: info.share_code, receive_code: info.receive_code, title, success: false, msg: '未知错误', fileSize: fileSize});
                        failedCount++;
                        updateProgress();
                    }
                } catch (e) {
                    results.push({share_code: info.share_code, receive_code: info.receive_code, title, success: false, msg: '网络/解析错误', fileSize: fileSize});
                    failedCount++;
                    updateProgress();
                }

                showResult(true);

                console.log(`完成第 ${i + 1}/${validInfos.length} 个处理`);

                const delay = parseInt(delayInput.value) || 100;
                await new Promise(res=>setTimeout(res, delay));
                }
                console.log(`循环结束，总共处理了 ${processedItems} 个项目`);
            } catch (error) {
                console.error('批量接收过程中发生错误:', error);
                showBatchReceiveStatus(`处理过程中发生错误: ${error.message}`, '#f44336');
            }
            progressBtn.textContent = '返回接收';
            progressBtn.disabled = false;
            progressBtn.style.opacity = '';
            progressBtn.style.cursor = '';
            progressBtn.classList.remove('batch-receive-btn-hidden');
            progressBtn.classList.add('batch-receive-btn-visible');
            backBtn.classList.remove('batch-receive-btn-hidden');
            backBtn.classList.add('batch-receive-btn-visible');
            startBtn.classList.remove('batch-receive-btn-visible');
            startBtn.classList.add('batch-receive-btn-hidden');

            controlsContainer.classList.remove('batch-receive-flex-visible');
            controlsContainer.classList.add('batch-receive-flex-hidden');
            controlsMain.classList.remove('batch-receive-container-visible');
            controlsMain.classList.add('batch-receive-container-hidden');

            if (isCancelled) {
                showBatchReceiveStatus(`已取消！共处理${results.length}条`, '#f44336', `成功: ${successCount} | 失败: ${failedCount}`);

                exportBtn.classList.remove('batch-receive-btn-hidden');
                exportBtn.classList.add('batch-receive-btn-visible');
                exportBtn.classList.remove('btn-hidden');
                exportBtn.classList.add('btn-visible');
            } else {
                showBatchReceiveStatus(`完成！共${validInfos.length}条`, successCount===validInfos.length?'#4caf50':'#f44336', `成功: ${successCount} | 失败: ${failedCount}`);

                exportBtn.classList.remove('batch-receive-btn-hidden');
                exportBtn.classList.add('batch-receive-btn-visible');
                exportBtn.classList.remove('btn-hidden');
                exportBtn.classList.add('btn-visible');
            }
            showResult(true);
        }

        startBtn.onclick = batchReceive;

        progressBtn.onclick = () => {
            const elements = getBatchReceiveElements();

            if (progressBtn.textContent === '取消接收') {
                isCancelled = true;
                elements.progressBtn.textContent = '已取消接收';
                elements.progressBtn.disabled = true;
                elements.progressBtn.style.opacity = '0.6';
                elements.progressBtn.style.cursor = 'not-allowed';
                showBatchReceiveStatus('已取消接收', '#f44336');
                elements.exportBtn.classList.remove('batch-receive-btn-visible');
                elements.exportBtn.classList.add('batch-receive-btn-hidden');
                showResult(true);
            } else if (progressBtn.textContent === '已取消接收') {
                elements.progressBtn.textContent = '返回接收';
                elements.progressBtn.disabled = false;
                elements.progressBtn.style.opacity = '';
                elements.progressBtn.style.cursor = '';
            } else {
                switchBatchReceiveUI('input');
                elements.startBtn.textContent = '开始接收';
                elements.progressBtn.disabled = false;
                elements.progressBtn.style.opacity = '';
                elements.progressBtn.style.cursor = '';
                elements.exportBtn.classList.remove('batch-receive-btn-visible');
                elements.exportBtn.classList.add('batch-receive-btn-hidden');
                results = [];
                isCancelled = false;
                totalItems = 0;
                processedItems = 0;
                successCount = 0;
                failedCount = 0;
            }
        };

        backBtn.onclick = () => {
            const elements = getBatchReceiveElements();

            switchBatchReceiveUI('input');
            elements.progressBtn.disabled = false;
            elements.progressBtn.style.opacity = '';
            elements.progressBtn.style.cursor = '';
            elements.exportBtn.style.display = 'none';
            results = [];
        };


        const batchReceiveSettings = JSON.parse(localStorage.getItem('batchReceiveSettings') || '{}');
        const elements = getBatchReceiveElements();

        if (batchReceiveSettings.cid) {
            elements.cidInput.value = batchReceiveSettings.cid;
            if (['0','100115'].includes(batchReceiveSettings.cid)) {
                elements.cidSelect.value = batchReceiveSettings.cid;
            } else {
                elements.cidSelect.value = '';
            }
        } else {
            elements.cidSelect.value = elements.cidInput.value = '100115';
        }
        if (batchReceiveSettings.delay) {
            elements.delayInput.value = batchReceiveSettings.delay;
        }
        elements.cidSelect.addEventListener('change',()=>{
          elements.cidInput.value = elements.cidSelect.value;
          saveBatchReceiveSettings();
          lastCid = elements.cidInput.value;
        });
        elements.cidInput.addEventListener('input',()=>{
          elements.cidInput.value = elements.cidInput.value.replace(/[^0-9]/g, '');
          if(elements.cidInput.value===''){
            elements.cidInput.value = '100115';
          }
          if(elements.cidSelect.value!==elements.cidInput.value && ['0','100115'].includes(elements.cidInput.value)){
            elements.cidSelect.value = elements.cidInput.value;
          } else if(!['0','100115'].includes(elements.cidInput.value)){
            elements.cidSelect.value = '';
          }
          saveBatchReceiveSettings();
          lastCid = elements.cidInput.value;
        });
        elements.delayInput.addEventListener('input', () => {
          saveBatchReceiveSettings();
        });

        exportBtn.addEventListener('click', function() {
            if (!results.length) {
                alert('没有接收结果可导出');
                return;
            }

            const csvContent = [
                ['标题', '链接', '状态', '信息'],
                ...results.map(result => {
                    const shareLink = `https://115cdn.com/s/${result.share_code}?password=${result.receive_code}`;
                    const title = result.title || '无标题';
                    const status = result.success ? '成功' : '失败';
                    const message = result.success ? (result.msg || '转存成功') : (result.msg || '接收失败');

                    return [
                        title,
                        shareLink,
                        status,
                        message
                    ];
                })
            ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

            const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            link.setAttribute('download', `115接收结果_${year}-${month}-${day}_${hours}-${minutes}-${seconds}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });

        startBtn.onclick = batchReceive;


    }

    function renderBatchRecognizePage() {
        const batchRecognizeContainer = document.getElementById('batch-recognize-container');

        if (batchRecognizeContainer.querySelector('#batch-recognize-input-container')) {

            const savedSettings = JSON.parse(localStorage.getItem('batchRecognizeSettings') || '{}');
            const batchSizeInput = batchRecognizeContainer.querySelector('#batch-size-input');
            const verifyMethodSelect = batchRecognizeContainer.querySelector('#verify-method-select');
            const performanceSwitch = batchRecognizeContainer.querySelector('#performance-mode-switch');

            if (savedSettings.batchSize) {
                batchSizeInput.value = savedSettings.batchSize;
            }
            if (savedSettings.verifyMethod) {
                verifyMethodSelect.value = savedSettings.verifyMethod;
            }
            const concurrencyInput = batchRecognizeContainer.querySelector('#concurrency-input');
            if (concurrencyInput && savedSettings.concurrency) {
                concurrencyInput.value = savedSettings.concurrency;
            }
            if (performanceSwitch) {
                performanceSwitch.checked = savedSettings.performanceMode !== false;
            }

            const inputContainer = batchRecognizeContainer.querySelector('#batch-recognize-input-container');
            const controlsContainer = batchRecognizeContainer.querySelector('.batch-recognize-controls');
            const controlsMain = controlsContainer.querySelector('.batch-recognize-controls-main');
            const progressWrap = batchRecognizeContainer.querySelector('#batch-recognize-progress');
            const exportBtn = batchRecognizeContainer.querySelector('#batch-recognize-export-btn');
            const startBtn = batchRecognizeContainer.querySelector('#batch-recognize-start-btn');
            const backBtn = batchRecognizeContainer.querySelector('#batch-recognize-back-btn');
            const resultDiv = batchRecognizeContainer.querySelector('#batch-recognize-result');
            const progressBtn = batchRecognizeContainer.querySelector('#batch-recognize-progress-btn');

            const isGlobProcessing = !!(window.__br_processing);
            if (isGlobProcessing) {
                inputContainer.style.display = 'none';
                if (controlsMain) controlsMain.style.display = 'none';
                controlsContainer.style.display = 'flex';
                resultDiv.style.display = 'block';
                progressWrap.style.display = 'block';
                startBtn.style.display = 'none';
                backBtn.style.display = 'none';
                if (progressBtn) progressBtn.style.display = 'inline-block';
            } else {
                inputContainer.style.display = 'block';
                if (controlsMain) controlsMain.style.display = 'block';
                controlsContainer.style.display = 'flex';
                resultDiv.style.display = 'none';
                progressWrap.style.display = 'none';
                exportBtn.style.display = 'none';
                startBtn.style.display = 'inline-block';
                backBtn.style.display = 'none';
            }

            try {
                const textarea = batchRecognizeContainer.querySelector('#batch-recognize-textarea');
                const inputContainerEl = batchRecognizeContainer.querySelector('#batch-recognize-input-container');
                if (inputContainerEl && textarea && !inputContainerEl.querySelector('.clear-text-btn')) {
                    const clearBtn = document.createElement('button');
                    clearBtn.type = 'button';
                    clearBtn.className = 'clear-text-btn';
                    clearBtn.title = '清空';
                    clearBtn.innerHTML = `
                      <svg class="clear-brush-svg" width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true">
                        <g stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path fill="none" d="M10,4 C10,2.8954305 10.8954305,2 12,2 C13.1045695,2 14,2.8954305 14,4 L14,10 L20,10 L20,14 L4,14 L4,10 L10,10 L10,4 Z M4,14 L20,14 L20,22 L12,22 L4,22 L4,14 Z M16,22 L16,16.3646005 M8,22 L8,16.3646005 M12,22 L12,16.3646005"></path>
                        </g>
                      </svg>`;
                    clearBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        textarea.value = '';
                        textarea.dispatchEvent(new Event('input', { bubbles: true }));
                        textarea.focus();
                    });
                    inputContainerEl.appendChild(clearBtn);

                    const updateClearVisibility = () => {
                        clearBtn.style.display = textarea.value.trim() ? 'inline-flex' : 'none';
                    };
                    const updateClearPosition = () => {
                        const scrollbarWidth = textarea.offsetWidth - textarea.clientWidth;
                        const baseRight = 6 + (scrollbarWidth > 0 ? scrollbarWidth : 0);
                        clearBtn.style.right = baseRight + 'px';
                    };
                    updateClearVisibility();
                    updateClearPosition();

                    if (!textarea._clearBound) {
                        textarea.addEventListener('input', () => {
                            updateClearVisibility();
                            updateClearPosition();
                        });
                        window.addEventListener('resize', updateClearPosition);
                        textarea._clearBound = true;
                    }
                }
            } catch (err) {
                console.warn('初始化批量识别清空按钮失败: ', err);
            }

            return;
        }

        batchRecognizeContainer.innerHTML = `
          <div id="batch-recognize-input-container" class="batch-recognize-input-container">
            <textarea id="batch-recognize-textarea" class="modal-textarea batch-recognize-textarea" placeholder="请在此处粘贴需要识别的分享内容...

支持域名:
- 115.com | 115cdn.com | anxia.com

支持的格式：
• 完整链接：https://115.com/s/分享码?password=访问码
• 简化链接：分享码?password=访问码
• 移动端格式：/分享码-访问码/
• 分离格式：分享码 访问码
• 关键词格式：分享码 提取码: xxxx 或 分享码 密码: xxxx
• 访问码格式：访问码: xxxx
• 提取码格式：提取码: xxxx
• 密码格式：密码: xxxx
• ED2K链接：ed2k://|file|文件名|大小|哈希|h=根哈希|/
• 磁力链格式：
  - 完整磁力链：magnet:?xt=urn:btih:哈希值&name=文件名
  - 标题+磁力链：标题 magnet:?xt=urn:btih:哈希值

提示：每行一个分享内容，支持混合格式"></textarea>
          </div>
          <div id="batch-recognize-result" class="batch-results-container"></div>
          <div class="batch-recognize-controls">
            <div class="batch-recognize-controls-main">
              <div class="batch-recognize-controls-row">
                <div class="batch-recognize-setting-item">
                  <label class="label">批量大小</label>
                  <input type="number" id="batch-size-input" class="input batch-size-input" value="20" min="1" max="1000" placeholder="20">
                </div>
                <div class="batch-recognize-setting-item">
                  <label class="label">并发数</label>
                  <input type="number" id="concurrency-input" class="input concurrency-input" value="5" min="1" max="50" placeholder="5">
                </div>
                <div class="batch-recognize-setting-item">
                  <label class="label">验证方式</label>
                  <select id="verify-method-select" class="input verify-method-select">
                    <option value="full" selected>完整验证(智能)</option>
                    <option value="quick">快速验证</option>
                    <option value="none">不验证</option>
                  </select>
                </div>
                <div class="batch-recognize-setting-item">
                  <label class="label">性能模式</label>
                  <label class="element-block-switch">
                    <input type="checkbox" id="performance-mode-switch" class="batch-recognize-checkbox" checked>
                    <span class="element-block-slider"></span>
                  </label>
                </div>

              </div>
            </div>
            <button id="batch-recognize-start-btn" class="btn-primary batch-recognize-start-btn">开始识别</button>
            <button id="batch-recognize-back-btn" class="btn-primary batch-recognize-start-btn btn-hidden">返回识别</button>
          </div>
          <div id="batch-recognize-progress" class="progress-container batch-recognize-progress">
            <div class="progress-header batch-recognize-progress-header">
              <div>
                <span class="progress-info">识别进度</span>
              </div>
              <button id="batch-recognize-progress-btn" class="btn-primary batch-recognize-start-btn batch-recognize-progress-btn">取消识别</button>
            </div>
            <div class="progress-bar-container batch-recognize-progress-bar-container">
              <span id="progress-text">进度: 0/0 (0%)</span>
              <button id="batch-recognize-export-btn" class="storage-import-export-btn batch-recognize-export-btn" data-text="导出结果">导出结果</button>
            </div>
            <div class="progress-bar" id="batch-recognize-progress-bar"></div>
          </div>
        `;

        const textarea = batchRecognizeContainer.querySelector('#batch-recognize-textarea');
        const batchSizeInput = batchRecognizeContainer.querySelector('#batch-size-input');
        const concurrencyInput = batchRecognizeContainer.querySelector('#concurrency-input');
        const verifyMethodSelect = batchRecognizeContainer.querySelector('#verify-method-select');
        const performanceSwitch = batchRecognizeContainer.querySelector('#performance-mode-switch');
        const startBtn = batchRecognizeContainer.querySelector('#batch-recognize-start-btn');
        const backBtn = batchRecognizeContainer.querySelector('#batch-recognize-back-btn');
        const progressBtn = batchRecognizeContainer.querySelector('#batch-recognize-progress-btn');
        const progressBar = batchRecognizeContainer.querySelector('#batch-recognize-progress-bar');
        const progressWrap = batchRecognizeContainer.querySelector('#batch-recognize-progress');
        const resultDiv = batchRecognizeContainer.querySelector('#batch-recognize-result');
        const exportBtn = batchRecognizeContainer.querySelector('#batch-recognize-export-btn');
        const progressText = batchRecognizeContainer.querySelector('#progress-text');

        const inputContainerEl = batchRecognizeContainer.querySelector('#batch-recognize-input-container');
        if (inputContainerEl && textarea && !inputContainerEl.querySelector('.clear-text-btn')) {
            const clearBtn = document.createElement('button');
            clearBtn.type = 'button';
            clearBtn.className = 'clear-text-btn';
            clearBtn.title = '清空';
            clearBtn.innerHTML = `
              <svg class="clear-brush-svg" width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true">
                <g stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path fill="none" d="M10,4 C10,2.8954305 10.8954305,2 12,2 C13.1045695,2 14,2.8954305 14,4 L14,10 L20,10 L20,14 L4,14 L4,10 L10,10 L10,4 Z M4,14 L20,14 L20,22 L12,22 L4,22 L4,14 Z M16,22 L16,16.3646005 M8,22 L8,16.3646005 M12,22 L12,16.3646005"></path>
                </g>
              </svg>`;
            clearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                textarea.value = '';
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                textarea.focus();
            });
            inputContainerEl.appendChild(clearBtn);

            const updateClearVisibility = () => {
                clearBtn.style.display = textarea.value.trim() ? 'inline-flex' : 'none';
            };
            const updateClearPosition = () => {
                const scrollbarWidth = textarea.offsetWidth - textarea.clientWidth;
                const baseRight = 6 + (scrollbarWidth > 0 ? scrollbarWidth : 0);
                clearBtn.style.right = baseRight + 'px';
            };
            updateClearVisibility();
            updateClearPosition();

            if (!textarea._clearBound) {
                textarea.addEventListener('input', () => {
                    updateClearVisibility();
                    updateClearPosition();
                });
                window.addEventListener('resize', updateClearPosition);
                textarea._clearBound = true;
            }
        }

        let isProcessing = false;
        let isCancelled = false;
        let totalItems = 0;
        let processedItems = 0;
        let successCount = 0;
        let failedCount = 0;
        let skippedCount = 0;
        let results = [];
        let resultsBaseIndex = 0;
        let currentSessionId = null;
        let sessionCount = 0;

        function updateProgress() {
            const progress = totalItems > 0 ? (processedItems / totalItems) * 100 : 0;
            if (progressBar) progressBar.style.width = `${progress}%`;

            const batchSizeText = batchSizeInput.value;
            const concurrencyText = concurrencyInput ? concurrencyInput.value : '5';
            const verifyVal = verifyMethodSelect.value;
            const verifyMethodText = verifyVal === 'full' ? '智能' : verifyVal === 'quick' ? '快速' : '不验证';
            const isPerfOn = performanceSwitch && performanceSwitch.checked;

            const parts = [];
            parts.push(`<span class="status-label">批量大小: ${batchSizeText}</span>`);
            if (concurrencyInput) {
                parts.push(`<span class="status-label">并发数: ${concurrencyText}</span>`);
            }
            parts.push(`<span class="status-label">${verifyMethodText}</span>`);
            if (isPerfOn) {
                parts.push(`<span class="status-label">性能模式</span>`);
            }
            parts.push(`<span class="status-progress">进度: ${processedItems}/${totalItems} (${Math.round(progress)}%)</span>`);
            parts.push(`<span class="status-success">成功: ${successCount}</span>`);
            parts.push(`<span class="status-failed">失败: ${failedCount}</span>`);
            parts.push(`<span class="status-skipped">跳过: ${skippedCount}</span>`);

            const html = `<span class="batch-recognize-progress-status">${parts.join('<span class="status-separator">|</span>')}</span>`;
            if (progressText) progressText.innerHTML = html;
        }

        function showBatchRecognizeStatus(msg, color, stats = null) {
            if (stats) {
                const statsMatch = stats.match(/成功:\s*(\d+)\s*\|\s*跳过:\s*(\d+)\s*\|\s*失败:\s*(\d+)/);
                if (statsMatch) {
                    const successCount = parseInt(statsMatch[1]);
                    const skippedCount = parseInt(statsMatch[2]);
                    const failCount = parseInt(statsMatch[3]);
                    const totalCount = successCount + skippedCount + failCount;

                    const statusHtml = `<span class="batch-recognize-progress-status">
                        <span class="status-label">总数: ${totalCount}项</span>
                        <span class="status-separator">|</span>
                        <span class="status-success">成功: ${successCount}项</span>
                        <span class="status-separator">|</span>
                        <span class="status-skipped">跳过: ${skippedCount}项</span>
                        <span class="status-separator">|</span>
                        <span class="status-failed">失败: ${failCount}项</span>
                    </span>`;

                    if (progressText) progressText.innerHTML = statusHtml;
                } else {
                    if (progressText) progressText.innerHTML = `<span class="text-color-gray">${stats}</span>`;
                }
            } else {
                if (progressText) progressText.innerHTML = `<span class="text-color-custom" style="--text-color: ${color||'#4285f4'};">${msg}</span>`;
            }
        }

        function showFullProgressStatus(msg, color) {
            updateProgress();
        }

        function saveBatchRecognizeSettings() {
            const settings = {
                batchSize: batchSizeInput.value,
                concurrency: concurrencyInput ? concurrencyInput.value : '5',
                verifyMethod: verifyMethodSelect.value,
                performanceMode: performanceSwitch ? performanceSwitch.checked : true
            };
            localStorage.setItem('batchRecognizeSettings', JSON.stringify(settings));
        }

        const handleBatchSizeInput = () => {
            batchSizeInput.value = batchSizeInput.value.replace(/[^0-9]/g, '');
            saveBatchRecognizeSettings();
            updateProgress();
        };

        const handleBatchSizeBlur = () => {
            let value = parseInt(batchSizeInput.value);
            if (isNaN(value) || value < 1) {
                value = 20;
            } else if (value > 1000) {
                value = 1000;
            }
            batchSizeInput.value = value;
            saveBatchRecognizeSettings();
            updateProgress();
        };

        const handleBatchSizePaste = (e) => {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            const numbersOnly = pastedText.replace(/[^0-9]/g, '');
            if (numbersOnly) {
                batchSizeInput.value = numbersOnly;
                saveBatchRecognizeSettings();
                updateProgress();
            }
        };

        const handleBatchSizeKeypress = (e) => {
            const charCode = e.which ? e.which : e.keyCode;
            if (charCode < 48 || charCode > 57) {
                e.preventDefault();
            }
        };

        const handleConcurrencyInput = () => {
            if (!concurrencyInput) return;
            concurrencyInput.value = concurrencyInput.value.replace(/[^0-9]/g, '');
            saveBatchRecognizeSettings();
            updateProgress();
        };

        const handleConcurrencyBlur = () => {
            if (!concurrencyInput) return;
            let value = parseInt(concurrencyInput.value);
            if (isNaN(value) || value < 1) {
                value = 1;
            } else if (value > 50) {
                value = 50;
            }
            concurrencyInput.value = value;
            saveBatchRecognizeSettings();
            updateProgress();
        };

        const handleConcurrencyPaste = (e) => {
            if (!concurrencyInput) return;
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            const numbersOnly = pastedText.replace(/[^0-9]/g, '');
            if (numbersOnly) {
                concurrencyInput.value = numbersOnly;
                saveBatchRecognizeSettings();
                updateProgress();
            }
        };

        const handleConcurrencyKeypress = (e) => {
            const charCode = e.which ? e.which : e.keyCode;
            if (charCode < 48 || charCode > 57) {
                e.preventDefault();
            }
        };

        const handleVerifyMethodChange = () => {
            saveBatchRecognizeSettings();
            updateProgress();
        };
        const handlePerformanceChange = () => {
            saveBatchRecognizeSettings();
            updateProgress();
        };

        batchSizeInput.addEventListener('input', handleBatchSizeInput);
        batchSizeInput.addEventListener('blur', handleBatchSizeBlur);
        batchSizeInput.addEventListener('paste', handleBatchSizePaste);
        batchSizeInput.addEventListener('keypress', handleBatchSizeKeypress);
        if (concurrencyInput) {
            concurrencyInput.addEventListener('input', handleConcurrencyInput);
            concurrencyInput.addEventListener('blur', handleConcurrencyBlur);
            concurrencyInput.addEventListener('paste', handleConcurrencyPaste);
            concurrencyInput.addEventListener('keypress', handleConcurrencyKeypress);
        }
        verifyMethodSelect.addEventListener('change', handleVerifyMethodChange);
        if (performanceSwitch) {
            performanceSwitch.addEventListener('change', handlePerformanceChange);
        }



        updateProgress();

        const switchToInputMode = () => {
            const inputContainer = batchRecognizeContainer.querySelector('#batch-recognize-input-container');
            const controlsContainer = batchRecognizeContainer.querySelector('.batch-recognize-controls');
            const controlsMain = controlsContainer.querySelector('.batch-recognize-controls-main');

            inputContainer.style.display = 'block';
            if (controlsMain) {
                controlsMain.style.display = 'block';
            }
            controlsContainer.style.display = 'flex';

            resultDiv.style.display = 'none';
            progressWrap.style.display = 'none';
            exportBtn.style.display = 'none';
            backBtn.style.display = 'none';
            progressBtn.style.display = 'none';
            startBtn.style.display = 'inline-block';

            startBtn.textContent = '开始识别';
            startBtn.style.backgroundColor = '';
            startBtn.style.borderColor = '';

            isProcessing = false;
            results = [];

            localStorage.removeItem('batchRecognizeResults');
        };

        backBtn.addEventListener('click', switchToInputMode);

        progressBtn.addEventListener('click', () => {
            if (isProcessing) {
                isCancelled = true;
                progressBtn.textContent = '已取消识别';
                progressBtn.disabled = true;
                progressBtn.style.opacity = '0.6';
                progressBtn.style.cursor = 'not-allowed';
                progressBtn.style.display = 'inline-block';
                showFullProgressStatus('已取消识别', '#f44336');
            } else {
                if (window.__br_processing && typeof window.__br_cancel === 'function') {
                    window.__br_cancel();
                    progressBtn.textContent = '已取消识别';
                    progressBtn.disabled = true;
                    progressBtn.style.opacity = '0.6';
                    progressBtn.style.cursor = 'not-allowed';
                    progressBtn.style.display = 'inline-block';
                    showFullProgressStatus('已取消识别', '#f44336');
                } else {
                    switchToInputMode();
                }
            }
        });

        function parseInputLines(lines) {
            const items = [];
            let currentItem = {};

            for (const line of lines) {
                const trimmedLine = line.trim();
                if (!trimmedLine) continue;

                if (trimmedLine.includes('","')) {
                    const csvValues = trimmedLine.split('","').map(v => v.replace(/^"|"$/g, ''));

                    if (csvValues.length >= 7) {
                        const title = csvValues[0];
                        const codeOrHash = csvValues[1];
                        const password = csvValues[2];
                        const fullLink = csvValues[3];
                        const fileSize = csvValues[4];
                        const expireTime = csvValues[5];
                        const note = csvValues[6];

                        const ed2kMatch = fullLink.match(/ed2k:\/\/\|file\|([^|]+)\|(\d+)\|([0-9A-F]{32})(?:\|h=([^|]+))?(\||\/)?/i);
                        if (ed2kMatch) {
                            items.push({
                                shareCode: ed2kMatch[3],
                                ed2k: fullLink,
                                title: decodeURIComponent(ed2kMatch[1]),
                                fileSize: parseInt(ed2kMatch[2]),
                                source: line,
                                type: 'csv-ed2k'
                            });
                            continue;
                        }

                        const magnetMatch = fullLink.match(/magnet:\?xt=urn:btih:([a-fA-F0-9]{40})(?:\?name=([^&]+))?/i);
                        if (magnetMatch) {
                            const magnetHash = magnetMatch[1];
                            const magnetName = magnetMatch[2] ? decodeURIComponent(magnetMatch[2]) : '磁力链文件';

                            items.push({
                                shareCode: magnetHash,
                                magnet: fullLink,
                                title: magnetName,
                                source: line,
                                type: 'csv-magnet'
                            });
                            continue;
                        }

                        const urlMatch = fullLink.match(/(?:115\.com|115cdn\.com|anxia\.com)\/s\/([a-z0-9]+)(?:\?password=([a-zA-Z0-9]+))?/i);
                        if (urlMatch) {
                            items.push({
                                shareCode: urlMatch[1],
                                password: password !== '无' ? password : (urlMatch[2] || ''),
                                title: title,
                                source: line,
                                type: 'csv-url'
                            });
                            continue;
                        }
                    }
                    continue;
                }

                const linkCodeMatch = trimmedLine.match(/(https?:\/\/(?:115\.com|115cdn\.com|anxia\.com)\/s\/([a-z0-9]+))\s+([a-zA-Z0-9]{4})/i);
                if (linkCodeMatch) {
                    items.push({
                        shareCode: linkCodeMatch[2],
                        password: linkCodeMatch[3],
                        source: line,
                        type: 'link-code'
                    });
                    continue;
                }

                const ed2kMatch = trimmedLine.match(/ed2k:\/\/\|file\|([^|]+)\|(\d+)\|([0-9A-F]{32})(?:\|h=([^|]+))?(\||\/)?/i);
                if (ed2kMatch) {
                    let fullEd2k = `ed2k://|file|${ed2kMatch[1]}|${ed2kMatch[2]}|${ed2kMatch[3]}`;
                    if (ed2kMatch[4]) {
                        fullEd2k += `|h=${ed2kMatch[4]}`;
                    }
                    fullEd2k += '|/';

                    items.push({
                        shareCode: ed2kMatch[3],
                        ed2k: fullEd2k,
                        title: decodeURIComponent(ed2kMatch[1]),
                        fileSize: parseInt(ed2kMatch[2]),
                        source: line,
                        type: 'ed2k'
                    });
                    currentItem = {};
                    continue;
                }

                const titleMagnetMatch = trimmedLine.match(/^(.+?)[\t\s]+(magnet:\?xt=urn:btih:[a-fA-F0-9]{40}(?:\?name=[^&]+)?)$/i);
                if (titleMagnetMatch) {
                    const title = titleMagnetMatch[1].trim();
                    const magnetLink = titleMagnetMatch[2];
                    const magnetMatch = magnetLink.match(/magnet:\?xt=urn:btih:([a-fA-F0-9]{40})(?:\?name=([^&]+))?/i);
                    if (magnetMatch) {
                        const magnetHash = magnetMatch[1];

                        items.push({
                            shareCode: magnetHash,
                            magnet: magnetLink,
                            title: title,
                            source: line,
                            type: 'title-magnet'
                        });
                        currentItem = {};
                        continue;
                    }
                }

                const magnetMatch = trimmedLine.match(/magnet:\?xt=urn:btih:([a-fA-F0-9]{40})(?:\?name=([^&]+))?/i);
                if (magnetMatch) {
                    const magnetHash = magnetMatch[1];
                    const magnetName = magnetMatch[2] ? decodeURIComponent(magnetMatch[2]) : '磁力链文件';

                    items.push({
                        shareCode: magnetHash,
                        magnet: trimmedLine,
                        title: magnetName,
                        source: line,
                        type: 'magnet'
                    });
                    currentItem = {};
                    continue;
                }

                const btihMatch = trimmedLine.match(/btih:([a-fA-F0-9]{40})/i);
                if (btihMatch) {
                    const magnetHash = btihMatch[1];
                    const fullMagnet = `magnet:?xt=urn:btih:${magnetHash}`;

                    items.push({
                        shareCode: magnetHash,
                        magnet: fullMagnet,
                        title: '磁力链文件',
                        source: line,
                        type: 'magnet-hash'
                    });
                    currentItem = {};
                    continue;
                }

                const slashMatch = trimmedLine.match(/^\/([a-z0-9]+)-([a-zA-Z0-9]+)\/$/);
                const urlMatch = trimmedLine.match(/(?:115\.com|115cdn\.com|anxia\.com)\/s\/([a-z0-9]+)(?:\?password=([a-zA-Z0-9]+))?/i);
                const passwordMatch = trimmedLine.match(/访问码[：:]\s*([a-zA-Z0-9]+)/i);

                if (slashMatch) {
                    if (currentItem.shareCode) items.push(currentItem);
                    currentItem = {
                        shareCode: slashMatch[1],
                        password: slashMatch[2],
                        source: line,
                        type: 'slash'
                    };
                    continue;
                }

                if (urlMatch) {
                    if (currentItem.shareCode) items.push(currentItem);
                    currentItem = {
                        shareCode: urlMatch[1],
                        password: urlMatch[2],
                        source: line,
                        type: 'url'
                    };
                    continue;
                }

                if (passwordMatch && currentItem.shareCode && !currentItem.password) {
                    currentItem.password = passwordMatch[1];
                    continue;
                }

                if (!currentItem.title && !trimmedLine.includes('访问码') && !trimmedLine.includes('复制这段内容')) {
                    currentItem.title = trimmedLine;
                }
            }

            if (currentItem.shareCode) {
                items.push(currentItem);
            }

            return items;
        }

        async function processRecognizeItem(item, verifyMethod, ctx) {
            let currentAllItems = null;
            const hasCtx = ctx && (ctx.existingEd2k || ctx.existingMagnet || ctx.existingShare);
            if (!hasCtx) {
                currentAllItems = getAllStorageItems();
            }

            if (item.ed2k) {
                const ed2kMatch = item.ed2k.match(/ed2k:\/\/\|file\|([^|]+)\|(\d+)\|([0-9A-F]{32})(?:\|h=([^|]+))?(\||\/)?/i);
                const ed2kTitle = ed2kMatch ? decodeURIComponent(ed2kMatch[1]) : 'ED2K文件';
                const existing = hasCtx ? (ctx.existingEd2k?.has(item.ed2k)) : currentAllItems.find(i => i.ed2k === item.ed2k);

                if (existing) {
                    return {
                        success: false,
                        skipped: true,
                        title: ed2kTitle,
                        shareCode: item.shareCode,
                        password: '',
                        msg: '已存在相同ED2K链接',
                        shareLink: item.ed2k
                    };
                }

                const note = ed2kTitle ? `[批量识别] ${ed2kTitle}` : '[批量识别]';

                saveToStorage(
                    item.shareCode,
                    '',
                    note,
                    ed2kTitle,
                    -1,
                    item.fileSize,
                    '0',
                    item.ed2k
                );

                if (hasCtx && ctx.existingEd2k) ctx.existingEd2k.add(item.ed2k);

                return {
                    success: true,
                    title: ed2kTitle,
                    shareCode: item.shareCode,
                    password: '',
                    msg: 'ED2K链接已保存',
                    shareLink: item.ed2k,
                    fileSize: item.fileSize
                };
            }

            if (item.magnet) {
                const magnetMatch = item.magnet.match(/magnet:\?xt=urn:btih:([a-fA-F0-9]{40})/i);
                const magnetHash = magnetMatch ? magnetMatch[1] : '';

                let magnetName = '磁力链文件';
                if (item.type === 'title-magnet' && item.title) {
                    magnetName = item.title;
                } else {
                    const nameMatch = item.magnet.match(/[?&]name=([^&]+)/i);
                    if (nameMatch) {
                        try {
                            magnetName = decodeURIComponent(nameMatch[1]);
                        } catch (e) {
                            magnetName = nameMatch[1];
                        }
                    } else {
                        const dnMatch = item.magnet.match(/[?&]dn=([^&]+)/i);
                        if (dnMatch) {
                            try {
                                magnetName = decodeURIComponent(dnMatch[1]);
                            } catch (e) {
                                magnetName = dnMatch[1];
                            }
                        }
                    }
                }

                const existing = hasCtx ? (ctx.existingMagnet?.has(item.magnet)) : currentAllItems.find(i => i.magnet === item.magnet);

                if (existing) {
                    return {
                        success: false,
                        skipped: true,
                        title: magnetName,
                        shareCode: item.shareCode,
                        password: '',
                        msg: '已存在相同磁力链',
                        shareLink: item.magnet
                    };
                }

                const note = magnetName ? `[批量识别] ${magnetName}` : '[批量识别]';

                saveToStorage(
                    item.shareCode,
                    '',
                    note,
                    magnetName,
                    -1,
                    0,
                    '0',
                    '',
                    item.magnet
                );

                if (hasCtx && ctx.existingMagnet) ctx.existingMagnet.add(item.magnet);

                return {
                    success: true,
                    title: magnetName,
                    shareCode: item.shareCode,
                    password: '',
                    msg: '磁力链已保存',
                    shareLink: item.magnet
                };
            }

            if (!item.password) {
                return {
                    success: false,
                    title: item.title || '无标题',
                    shareCode: item.shareCode,
                    password: '',
                    msg: '缺少访问码'
                };
            }

            let existingItem = null;
            let exists = false;
            if (hasCtx) {
                exists = !!(ctx.existingShare && ctx.existingShare.has(item.shareCode));
                if (exists) {
                    try {
                        const storageKey = generateStorageKey(item.shareCode, '', '');
                        const raw = GM_getValue(storageKey);
                        if (raw) existingItem = JSON.parse(raw);
                    } catch (e) {}
                }
            } else {
                existingItem = currentAllItems.find(i => i.shareCode === item.shareCode) || null;
                exists = !!existingItem;
            }

            const existedBefore = exists;
            if (existedBefore && existingItem && existingItem.password === item.password) {
                return {
                    success: false,
                    skipped: true,
                    title: existingItem.shareTitle || '无标题',
                    shareCode: item.shareCode,
                    password: item.password,
                    msg: '已存在(跳过)'
                };
            }

            if (verifyMethod === 'none') {
                const note = item.title ? `[批量识别] ${item.title}` : '[批量识别]';

                saveToStorage(
                    item.shareCode,
                    item.password,
                    note,
                    item.title,
                    -1,
                    0,
                    '0'
                );
                return {
                    success: true,
                    title: item.title || '未验证的访问码',
                    shareCode: item.shareCode,
                    password: item.password,
                    msg: '跳过验证'
                };
            }

            try {
                const response = await new Promise((resolve) => {
                    checkPasswordCorrect(item.shareCode, item.password, (isCorrect, responseData) => {
                        resolve({ isCorrect, responseData });
                    });
                });

                if (response.isCorrect) {

                    const newTitle = response.responseData?.shareTitle || item.title || '无标题';
                    const fileSize = parseInt(response.responseData?.fileSize || 0);
                    const note = newTitle ? `[批量识别] ${newTitle}` : '[批量识别]';

                    saveToStorage(
                        item.shareCode,
                        item.password,
                        note,
                        newTitle,
                        response.responseData?.expireTime || -1,
                        fileSize,
                        response.responseData?.autoRenewal || '0'
                    );
                    return {
                        success: true,
                        title: newTitle,
                        shareCode: item.shareCode,
                        password: item.password,
                        msg: existedBefore ? '已更新访问码' : '验证成功',
                        fileSize
                    };
                }
                else {
                    let errorMsg = '验证失败';
                    if (response.responseData?.error) {
                        errorMsg = response.responseData.error;
                    } else if (response.responseData?.rawResponse?.data?.shareinfo?.forbid_reason) {
                        errorMsg = response.responseData.rawResponse.data.shareinfo.forbid_reason;
                    } else if (
                        response.responseData?.rawResponse?.data?.shareinfo?.share_state === -1 ||
                        response.responseData?.data?.shareinfo?.share_state === -1
                    ) {
                        errorMsg = '分享已取消';
                    }

                    const rawShareInfo = response.responseData?.rawResponse?.data?.shareinfo || response.responseData?.data?.shareinfo || {};
                    const shareState = rawShareInfo?.share_state;
                    const forbidReason = rawShareInfo?.forbid_reason || errorMsg;
                    const expireTime = rawShareInfo?.expire_time || -1;
                    const fileSize = parseInt((rawShareInfo?.file_size || 0));
                    const autoRenewal = String(rawShareInfo?.auto_renewal || '0');
                    const newTitle = processShareTitle(response.responseData?.rawResponse || response.responseData || {});

                    if (verifyMethod === 'quick') {
                        if ((typeof forbidReason === 'string' && /过期/.test(forbidReason)) || shareState === 7) {
                            const note = newTitle ? `[批量识别] ${newTitle}` : (item.title ? `[批量识别] ${item.title}` : '[批量识别]');
                            saveToStorage(
                                item.shareCode,
                                item.password,
                                note,
                                newTitle || item.title,
                                expireTime,
                                fileSize,
                                autoRenewal,
                                '',
                                '',
                                forbidReason || '分享已过期'
                            );
                            return {
                                success: true,
                                title: newTitle || item.title || '未验证的访问码',
                                shareCode: item.shareCode,
                                password: item.password,
                                msg: '快速：链接已过期',
                                fileSize
                            };
                        }

                        if (errorMsg === '分享已取消' || shareState === -1) {
                            const note = newTitle ? `[批量识别] ${newTitle}` : (item.title ? `[批量识别] ${item.title}` : '[批量识别]');
                            saveToStorage(
                                item.shareCode,
                                item.password,
                                note,
                                '',
                                -1,
                                0,
                                '0',
                                '',
                                '',
                                ''
                            );
                            return {
                                success: true,
                                title: newTitle || item.title || '未验证的访问码',
                                shareCode: item.shareCode,
                                password: item.password,
                                msg: '快速：分享已取消'
                            };
                        }

                        const note = item.title ? `[批量识别] ${item.title}` : '[批量识别]';

                        saveToStorage(
                            item.shareCode,
                            item.password,
                            note,
                            item.title,
                            -1,
                            fileSize,
                            '0'
                        );
                        return {
                            success: true,
                            title: item.title || '未验证的访问码',
                            shareCode: item.shareCode,
                            password: item.password,
                            msg: '快速验证模式',
                            fileSize
                        };
                    }
                    return {
                        success: false,
                        title: item.title || '无标题',
                        shareCode: item.shareCode,
                        password: item.password,
                        msg: errorMsg,
                        fileSize
                    };
                }
            } catch (error) {
                console.error('验证访问码失败:', error);
                if (verifyMethod === 'quick') {
                    let rawShareInfo = {};
                    try {
                        const resp = error && (error.responseData || error.rawResponse || {});
                        rawShareInfo = resp?.rawResponse?.data?.shareinfo || resp?.data?.shareinfo || {};
                    } catch (e) {
                    }

                    const shareState = rawShareInfo?.share_state;
                    const forbidReason = rawShareInfo?.forbid_reason || '';
                    const expireTime = rawShareInfo?.expire_time || -1;
                    const fileSize = parseInt((rawShareInfo?.file_size || 0));
                    const autoRenewal = String(rawShareInfo?.auto_renewal || '0');
                    const newTitle = processShareTitle(error?.responseData?.rawResponse || error?.responseData || {});

                    if ((typeof forbidReason === 'string' && /过期/.test(forbidReason)) || shareState === 7) {
                        const note = newTitle ? `[批量识别] ${newTitle}` : (item.title ? `[批量识别] ${item.title}` : '[批量识别]');
                        saveToStorage(
                            item.shareCode,
                            item.password,
                            note,
                            newTitle || item.title,
                            expireTime,
                            fileSize,
                            autoRenewal,
                            '',
                            '',
                            forbidReason || '分享已过期'
                        );
                        return {
                            success: true,
                            title: newTitle || item.title || '未验证的访问码',
                            shareCode: item.shareCode,
                            password: item.password,
                            msg: '快速：链接已过期',
                            fileSize
                        };
                    }

                    if (shareState === -1) {
                        const note = newTitle ? `[批量识别] ${newTitle}` : (item.title ? `[批量识别] ${item.title}` : '[批量识别]');
                        saveToStorage(
                            item.shareCode,
                            item.password,
                            note,
                            '',
                            -1,
                            0,
                            '0',
                            '',
                            '',
                            ''
                        );
                        return {
                            success: true,
                            title: newTitle || item.title || '未验证的访问码',
                            shareCode: item.shareCode,
                            password: item.password,
                            msg: '快速：分享已取消'
                        };
                    }

                    saveToStorage(
                        item.shareCode,
                        item.password,
                        '[批量识别]',
                        item.title,
                        -1,
                        fileSize,
                        '0'
                    );
                    return {
                        success: true,
                        title: item.title || '未验证的访问码',
                        shareCode: item.shareCode,
                        password: item.password,
                        msg: '快速验证模式',
                        fileSize
                    };
                }
                return {
                    success: false,
                    title: item.title || '无标题',
                    shareCode: item.shareCode,
                    password: item.password,
                    msg: '验证出错'
                };
            }
        }

        function showResult() {
            const inputContainer = batchRecognizeContainer.querySelector('#batch-recognize-input-container');
            if (inputContainer && inputContainer.style.display !== 'none') {
                resultDiv.style.display = 'none';
                return;
            }

            resultDiv.style.display = 'block';
            const isMaximized = windowElement.classList.contains('maximized');
            if (isMaximized) {
                resultDiv.classList.remove('batch-recognize-result-dynamic');
                resultDiv.classList.add('batch-recognize-result-maximized');
            } else {
                resultDiv.classList.remove('batch-recognize-result-maximized');
                resultDiv.classList.add('batch-recognize-result-dynamic');
            }

            if (results.length === 0) {
                resultDiv.innerHTML = '<div class="no-recognition-message">未识别到有效的分享内容</div>';
                return;
            }

            const isPerf = performanceSwitch && performanceSwitch.checked;
            const displayResults = isPerf ? results : results;
            const reversedResults = [...displayResults].reverse();
            resultDiv.innerHTML = reversedResults.map((r, index) => {
                const baseLen = displayResults.length;
                const originalIndex = resultsBaseIndex + (results.length - baseLen) + (baseLen - 1 - index);
                const shareLink = r.shareLink || (r.ed2k ? r.ed2k : `https://115cdn.com/s/${r.shareCode}?password=${r.password}`);
                const title = r.title || r.shareTitle || '无标题';

                const fileSizeTag = (r.fileSize && r.fileSize > 0)
                    ? `<span class="batch-recognize-file-size">${formatFileSize(r.fileSize)}</span>`
                    : `<span class="batch-recognize-file-size placeholder">未知大小</span>`;

                let statusClass = 'error';
                let statusText = r.msg || '识别失败';

                if (r.success) {
                    statusClass = 'success';
                    statusText = r.msg || '识别成功';
                } else if (r.skipped) {
                    statusClass = 'warning';
                    statusText = r.msg || '已跳过';
                }

                return `<div class="batch-result-item compact-layout ${statusClass}" data-index="${originalIndex}">
                    <div class="batch-result-item-title">
                        <div>
                            ${fileSizeTag}
                            <span class="batch-recognize-file-name" title="${title}">${title}</span>
                        </div>
                        <div class="batch-result-item-actions">
                            <button class="storage-item-btn copy-btn">复制</button>
                            ${r.success ? '<button class="storage-item-btn open-btn">打开</button>' : ''}
                        </div>
                    </div>
                    <div class="batch-result-item-details">
                        <span class="batch-result-link" title="点击打开链接" data-link="${shareLink}">${shareLink}</span>
                        <span class="batch-result-status ${statusClass}">${statusText}</span>
                    </div>
                </div>`;
            }).join('');

            reversedResults.forEach((r, displayIndex) => {
                const baseLen = displayResults.length;
                const originalIndex = resultsBaseIndex + (results.length - baseLen) + (baseLen - 1 - displayIndex);
                const item = resultDiv.querySelector(`[data-index="${originalIndex}"]`);
                const copyBtn = item.querySelector('.copy-btn');
                const linkSpan = item.querySelector('.batch-result-link');
                const shareLink = r.shareLink || (r.ed2k ? r.ed2k : `https://115cdn.com/s/${r.shareCode}?password=${r.password}`);
                const title = r.title || r.shareTitle || '无标题';

                copyBtn.addEventListener('click', () => {
                    if (copyBtn._copyTimer) clearTimeout(copyBtn._copyTimer);
                    const enableMagnetTitleCopy = GM_getValue('enableMagnetTitleCopy', false);

                    let text;
                    if (r.magnet && enableMagnetTitleCopy && title) {
                        text = `${title}\n${r.magnet}`;
                    } else if (r.ed2k) {
                        text = r.ed2k;
                    } else {
                        const enableShareTitleCopy = GM_getValue('enableShareTitleCopy', false);
                        if (enableShareTitleCopy && title) {
                            text = `${title}\n${shareLink}`;
                        } else {
                            text = `${shareLink}#\n${title}`;
                        }
                    }

                    navigator.clipboard.writeText(text).then(() => {
                        copyBtn.textContent = '已复制';
                        copyBtn.classList.add('copied');
                        copyBtn._copyTimer = setTimeout(() => {
                            copyBtn.textContent = '复制';
                            copyBtn.classList.remove('copied');
                            copyBtn._copyTimer = null;
                        }, 1000);
                    }).catch(() => alert('复制失败'));
                });

                linkSpan.addEventListener('click', () => {
                    if (r.ed2k) {

                        navigator.clipboard.writeText(r.ed2k).then(() => {
                            alert('ED2K链接已复制到剪贴板');
                        }).catch(() => alert('复制失败'));
                    } else {
                        window.open(shareLink, '_blank');
                    }
                });

                const openBtn = item.querySelector('.open-btn');
                if (openBtn) {
                    openBtn.addEventListener('click', () => {
                        if (r.ed2k) {
                            navigator.clipboard.writeText(r.ed2k).then(() => {
                                alert('ED2K链接已复制到剪贴板');
                            }).catch(() => alert('复制失败'));
                        } else {
                            window.open(shareLink, '_blank');
                        }
                    });
                }
            });

            if (results.length > 0) {
                exportBtn.style.display = 'inline-block';
            } else {
                exportBtn.style.display = 'none';
            }
        }

        startBtn.addEventListener('click', async () => {
            if (isProcessing) {
                isCancelled = true;
                startBtn.textContent = '开始识别';
                return;
            }

            const content = textarea.value.trim();
            if (!content) {
                showBatchRecognizeStatus('请输入分享内容', '#f44336');
                return;
            }

            const lines = content.split('\n').filter(line => line.trim() !== '');
            if (lines.length === 0) {
                showBatchRecognizeStatus('未找到有效的分享内容', '#f44336');
                return;
            }

            const inputContainer = batchRecognizeContainer.querySelector('#batch-recognize-input-container');
            const controlsContainer = batchRecognizeContainer.querySelector('.batch-recognize-controls');
            const controlsMain = controlsContainer.querySelector('.batch-recognize-controls-main');

            inputContainer.style.display = 'none';
            if (controlsMain) {
                controlsMain.style.display = 'none';
            }
            controlsContainer.style.display = 'flex';

            resultDiv.style.display = 'block';
            resultDiv.innerHTML = '<div class="batch-recognize-ready-message">准备开始批量识别...</div>';

            isProcessing = true;
            isCancelled = false;
            window.__br_processing = true;
            window.__br_cancel = () => { isCancelled = true; };
            startBtn.style.display = 'none';
            progressBtn.textContent = '取消识别';
            progressBtn.style.display = 'inline-block';
            progressBtn.disabled = false;
            progressBtn.style.opacity = '';
            progressBtn.style.cursor = '';
            totalItems = 0;
            processedItems = 0;
            successCount = 0;
            failedCount = 0;
            skippedCount = 0;
            results = [];

            progressWrap.style.display = 'block';
            exportBtn.style.display = 'none';
            showFullProgressStatus('正在解析输入内容...', '#2196f3');

            const batchSize = Math.max(1, Math.min(1000, parseInt(batchSizeInput.value) || 20));
            const concurrency = Math.max(1, Math.min(50, parseInt(concurrencyInput ? concurrencyInput.value : '5') || 5));
            const verifyMethod = verifyMethodSelect.value;
            const isPerf = performanceSwitch && performanceSwitch.checked;

            try {
                const parsedItems = parseInputLines(lines);
                if (parsedItems.length === 0) {
                    showFullProgressStatus('未识别到有效的分享链接或格式', '#f44336');

                    switchToInputMode();
                    isProcessing = false;
                    return;
                }

                totalItems = parsedItems.length;
                updateProgress();
                showFullProgressStatus(`开始处理 ${totalItems} 条内容...`, '#2196f3');

                currentSessionId = `br-${Date.now()}`;
                sessionCount = 0;
                try { GM_setValue(`batchRecognizeMeta:${currentSessionId}`, { startedAt: Date.now(), count: 0 }); } catch (e) {}

                const allItemsForDedup = getAllStorageItems();
                const ctx = {
                    existingEd2k: new Set(allItemsForDedup.filter(i => i.ed2k).map(i => i.ed2k)),
                    existingMagnet: new Set(allItemsForDedup.filter(i => i.magnet).map(i => i.magnet)),
                    existingShare: new Set(allItemsForDedup.filter(i => i.shareCode).map(i => i.shareCode)),
                };

                const mapLimit = async (arr, limit, fn) => {
                    const ret = [];
                    let idx = 0;
                    const workers = new Array(Math.min(limit, arr.length)).fill(0).map(async () => {
                        while (idx < arr.length && !isCancelled) {
                            const current = arr[idx++];
                            const r = await fn(current);
                            ret.push(r);
                        }
                    });
                    await Promise.all(workers);
                    return ret;
                };

                let lastRenderTime = 0;
                let desiredConcurrency = concurrency;
                const maxConcurrency = concurrency;
                const minConcurrency = 1;
                let winDurations = [];
                let winErrors = 0;
                const winMax = 50;

                const sleep = (ms) => new Promise(r => setTimeout(r, ms));

                const recognizeWithRetry = async (item) => {
                    const maxRetries = 2;
                    let attempt = 0;
                    let lastResult = null;
                    while (!isCancelled) {
                        const t0 = performance.now();
                        try {
                            const r = await processRecognizeItem(item, verifyMethod, ctx);
                            const dt = performance.now() - t0;
                            winDurations.push(dt);
                            if (winDurations.length > winMax) winDurations.shift();
                            if (!r || !r.success) {
                                winErrors++;
                            }
                            lastResult = r;
                            return r;
                        } catch (err) {
                            const dt = performance.now() - t0;
                            winDurations.push(dt);
                            if (winDurations.length > winMax) winDurations.shift();
                            winErrors++;
                            lastResult = { success: false, msg: (err && err.message) ? err.message : '异常' };
                        }
                        if (attempt >= maxRetries) return lastResult;
                        const backoff = (200 * Math.pow(2, attempt)) + Math.floor(Math.random() * 100);
                        attempt++;
                        await sleep(backoff);
                    }
                    return lastResult;
                };

                for (let i = 0; i < parsedItems.length; i += batchSize) {
                    if (isCancelled) break;

                    const batch = parsedItems.slice(i, i + batchSize);

                    await mapLimit(batch, desiredConcurrency, async (item) => {
                        if (isCancelled) return;
                        const result = await recognizeWithRetry(item);
                        results.push(result);
                        if (isPerf && results.length > 1000) {
                            const drop = results.length - 1000;
                            results.splice(0, drop);
                            resultsBaseIndex += drop;
                        }
                        try {
                            sessionCount += 1;
                            GM_setValue(`batchRecognizeResult:${currentSessionId}:${sessionCount}`, result);
                            GM_setValue(`batchRecognizeMeta:${currentSessionId}`, { startedAt: Date.now(), count: sessionCount });
                        } catch (e) {}
                        processedItems++;
                        if (result && result.success && item && item.shareCode && ctx && ctx.existingShare) {
                            ctx.existingShare.add(item.shareCode);
                        }
                        if (result.success) successCount++;
                        else if (result.skipped) skippedCount++;
                        else failedCount++;
                        updateProgress();
                        const now = performance.now();
                        if (!isPerf) {
                            if (results.length <= 50 || (results.length <= 200 && results.length % 5 === 0) || (results.length > 200 && results.length % 20 === 0)) {
                                showResult();
                            }
                        } else {
                            if (now - lastRenderTime > 450) {
                                showResult();
                                lastRenderTime = now;
                            }
                            if (processedItems % 50 === 0) {
                                await new Promise(r => setTimeout(r, 0));
                            }
                        }
                        return result;
                    });

                    if (winDurations.length > 10) {
                        const avg = winDurations.reduce((a,b)=>a+b,0) / winDurations.length;
                        const errRate = winErrors / winDurations.length;
                        if (errRate > 0.15 || avg > 1500) {
                            desiredConcurrency = Math.max(minConcurrency, desiredConcurrency - 1);
                        } else if (errRate < 0.05 && avg < 800) {
                            desiredConcurrency = Math.min(maxConcurrency, desiredConcurrency + 1);
                        }
                        winDurations = [];
                        winErrors = 0;
                    }

                    if (i + batchSize < parsedItems.length && !isCancelled) {
                        await new Promise(resolve => setTimeout(resolve, isPerf ? 0 : 50));
                    }
                }

                if (!isCancelled) {
                    showResult();
                    showFullProgressStatus(`识别完成: 共${totalItems}条`, '#4caf50');
                    exportBtn.style.display = 'inline-block';
                } else {
                    showFullProgressStatus('识别已取消', '#ff9800');
                    showResult();
                    exportBtn.style.display = 'inline-block';
                }

                try { localStorage.setItem('batchRecognizeResults', JSON.stringify(results.slice(-1000))); } catch (e) {}

                progressBtn.textContent = '返回识别';
                progressBtn.style.display = 'inline-block';
                progressBtn.disabled = false;
                progressBtn.style.opacity = '';
                progressBtn.style.cursor = '';
                window.__br_processing = false;
                window.__br_cancel = null;
            } catch (e) {
                console.error(e);
                showFullProgressStatus('识别发生异常', '#f44336');
                switchToInputMode();
                isProcessing = false;
                window.__br_processing = false;
                window.__br_cancel = null;
                return;
            }


            isProcessing = false;
        });

        exportBtn.addEventListener('click', async () => {
            try {
                const meta = await GM_getValue(`batchRecognizeMeta:${currentSessionId}`, { count: resultsBaseIndex + results.length });
                const total = meta && meta.count ? meta.count : (resultsBaseIndex + results.length);
                if (!total || total <= 0) {
                    alert('没有可导出的结果');
                    return;
                }
                const header = ['标题','分享码/哈希','提取码','链接','文件大小','成功','消息'];
                const lines = [header.join(',')];
                const chunk = 5000;
                for (let start = 1; start <= total; start += chunk) {
                    const end = Math.min(total, start + chunk - 1);
                    for (let i = start; i <= end; i++) {
                        const r = await GM_getValue(`batchRecognizeResult:${currentSessionId}:${i}`, null);
                        if (!r) continue;
                        const title = (r.title || r.shareTitle || '').replace(/"/g, '""');
                        const codeOrHash = r.shareCode || r.hash || '';
                        const password = r.password || '';
                        const fullLink = r.shareLink || '';
                        const fileSize = r.fileSize || '';
                        const succ = r.success ? '1' : '0';
                        const msg = (r.msg || '').replace(/"/g, '""');
                        lines.push(`"${title}","${codeOrHash}","${password}","${fullLink}","${fileSize}","${succ}","${msg}"`);
                    }
                    await new Promise(r => setTimeout(r, 0));
                }
                const blob = new Blob(["\ufeff" + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `batch-recognize-${currentSessionId || Date.now()}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } catch (err) {
                console.error('导出失败:', err);
                alert('导出失败，请重试');
            }
        });

        progressWrap.style.display = 'none';
        exportBtn.style.display = 'none';
        resultDiv.style.display = 'none';
        progressBtn.style.display = 'none';

        try {
            const stored = JSON.parse(localStorage.getItem('batchRecognizeResults') || '[]');
            if (!window.__br_processing && Array.isArray(stored) && stored.length > 0) {
                results = stored;
                const inputContainer2 = batchRecognizeContainer.querySelector('#batch-recognize-input-container');
                const controlsContainer2 = batchRecognizeContainer.querySelector('.batch-recognize-controls');
                const controlsMain2 = controlsContainer2 ? controlsContainer2.querySelector('.batch-recognize-controls-main') : null;

                if (inputContainer2) inputContainer2.style.display = 'none';
                if (controlsMain2) controlsMain2.style.display = 'none';
                if (controlsContainer2) controlsContainer2.style.display = 'flex';

                resultDiv.style.display = 'block';
                progressWrap.style.display = 'block';
                exportBtn.style.display = 'inline-block';
                startBtn.style.display = 'none';
                backBtn.style.display = 'inline-block';

                const successCount2 = results.filter(r => r && r.success).length;
                const failedCount2 = results.filter(r => r && !r.success && !r.skipped).length;
                const skippedCount2 = results.filter(r => r && r.skipped).length;
                const totalItems2 = results.length;

                const statusHtml2 = `<span class="batch-recognize-status-display">
                    <span class="status-label">总数: ${totalItems2}项</span>
                    <span class="status-separator">|</span>
                    <span class="status-success">成功: ${successCount2}项</span>
                    <span class="status-separator">|</span>
                    <span class="status-warning">跳过: ${skippedCount2}项</span>
                    <span class="status-separator">|</span>
                    <span class="status-error">失败: ${failedCount2}项</span>
                </span>`;
                progressText.innerHTML = statusHtml2;

                const reversedResults2 = [...results].reverse();
                resultDiv.innerHTML = reversedResults2.map((r, index) => {
                    const originalIndex = results.length - 1 - index;
                    const shareLink = r.shareLink || (r.ed2k ? r.ed2k : `https://115cdn.com/s/${r.shareCode}?password=${r.password}`);
                    const title = r.title || r.shareTitle || '无标题';
                    const fileSizeTag = r.fileSize && r.fileSize > 0 ? `<span class="batch-recognize-file-size">${formatFileSize(r.fileSize)}</span>` : '';
                    let statusClass = 'error';
                    let statusText = r.msg || '识别失败';
                    if (r.success) { statusClass = 'success'; statusText = r.msg || '识别成功'; }
                    else if (r.skipped) { statusClass = 'warning'; statusText = r.msg || '已跳过'; }

                    return `<div class="batch-result-item compact-layout ${statusClass}" data-index="${originalIndex}">
                        <div class="batch-result-item-title">
                            <div>
                                ${fileSizeTag}
                                <span class="batch-recognize-file-name" title="${title}">${title}</span>
                            </div>
                            <div class="batch-result-item-actions">
                                <button class="storage-item-btn copy-btn">复制</button>
                                ${r.success ? '<button class="storage-item-btn open-btn">打开</button>' : ''}
                            </div>
                        </div>
                        <div class="batch-result-item-details">
                            <span class="batch-result-link" title="点击打开链接" data-link="${shareLink}">${shareLink}</span>
                            <span class="batch-result-status ${statusClass}">${statusText}</span>
                        </div>
                    </div>`;
                }).join('');

                reversedResults2.forEach((r, displayIndex) => {
                    const originalIndex = results.length - 1 - displayIndex;
                    const item = resultDiv.querySelector(`[data-index="${originalIndex}"]`);
                    if (!item) return;
                    const copyBtn = item.querySelector('.copy-btn');
                    const linkSpan = item.querySelector('.batch-result-link');
                    const shareLink = r.shareLink || (r.ed2k ? r.ed2k : `https://115cdn.com/s/${r.shareCode}?password=${r.password}`);
                    const title = r.title || r.shareTitle || '无标题';

                    if (copyBtn) {
                        copyBtn.addEventListener('click', () => {
                            if (copyBtn._copyTimer) clearTimeout(copyBtn._copyTimer);
                            const enableMagnetTitleCopy = GM_getValue('enableMagnetTitleCopy', false);
                            let text;
                            if (r.magnet && enableMagnetTitleCopy && title) {
                                text = `${title}\n${r.magnet}`;
                            } else if (r.ed2k) {
                                text = r.ed2k;
                            } else {
                                const enableShareTitleCopy = GM_getValue('enableShareTitleCopy', false);
                                if (enableShareTitleCopy && title) {
                                    text = `${title}\n${shareLink}`;
                                } else {
                                    text = `${shareLink}#\n${title}`;
                                }
                            }
                            navigator.clipboard.writeText(text).then(() => {
                                copyBtn.textContent = '已复制';
                                copyBtn.classList.add('copied');
                                copyBtn._copyTimer = setTimeout(() => {
                                    copyBtn.textContent = '复制';
                                    copyBtn.classList.remove('copied');
                                    copyBtn._copyTimer = null;
                                }, 1000);
                            }).catch(() => alert('复制失败'));
                        });
                    }

                    if (linkSpan) {
                        linkSpan.addEventListener('click', () => {
                            if (r.ed2k) {
                                navigator.clipboard.writeText(r.ed2k).then(() => {
                                    alert('ED2K链接已复制到剪贴板');
                                }).catch(() => alert('复制失败'));
                            } else {
                                window.open(shareLink, '_blank');
                            }
                        });
                    }

                    const openBtn = item.querySelector('.open-btn');
                    if (openBtn) {
                        openBtn.addEventListener('click', () => {
                            if (r.ed2k) {
                                navigator.clipboard.writeText(r.ed2k).then(() => {
                                    alert('ED2K链接已复制到剪贴板');
                                }).catch(() => alert('复制失败'));
                            } else {
                                window.open(shareLink, '_blank');
                            }
                        });
                    }
                });
            }
        } catch (e) {}

        updateProgress();
    }

    function renderBatchSharePage() {
        if (batchShareContainer.querySelector('#batch-share-flex-row')) {
            const batchShareSettings = JSON.parse(localStorage.getItem('batchShareSettings') || '{}');
            batchShareContainer.querySelector('#batch-share-expire').value = batchShareSettings.expire || '-1';
            batchShareContainer.querySelector('#batch-share-limit').value = batchShareSettings.limit || 0;
            batchShareContainer.querySelector('#batch-share-code').value = batchShareSettings.code || '';
            batchShareContainer.querySelector('#batch-share-delay').value = batchShareSettings.delay || 1000;
            batchShareContainer.querySelector('#batch-share-traffic').value = batchShareSettings.traffic || 0;
            batchShareContainer.querySelector('#batch-share-auto-fill').checked = batchShareSettings.randomExtractCode || false;
            batchShareContainer.querySelector('#batch-share-anonymous').checked = batchShareSettings.anonymous !== false;
            batchShareContainer.querySelector('#batch-share-auto-save').checked = batchShareSettings.autoSave !== false;
            batchShareContainer.querySelector('#batch-share-get-size').checked = batchShareSettings.getSize || false;
            const apiGetSizeEl = batchShareContainer.querySelector('#batch-share-api-get-size');
            if (apiGetSizeEl) apiGetSizeEl.checked = batchShareSettings.useApiGetSize || false;

            const fileListDiv = batchShareContainer.querySelector('#batch-share-file-list');
            const fileCountSpan = batchShareContainer.querySelector('#batch-share-file-count');
            const container = batchShareContainer.querySelector('#batch-share-file-list-container');
            const progressWrap = batchShareContainer.querySelector('#batch-share-progress');

            if (!isSharing && fileListDiv && fileCountSpan && container) {
                fileListDiv.style.display = 'none';
                fileCountSpan.textContent = '';
                container.innerHTML = '';
            } else if (isSharing && results.length > 0) {

                if (fileListDiv) fileListDiv.style.display = 'block';
                if (fileCountSpan) fileCountSpan.textContent = `共 ${results.length} 个文件/文件夹`;
                if (container) {

                    container.innerHTML = '';
                    results.forEach((result, index) => {
                        const fileItem = document.createElement('div');
                        fileItem.className = `batch-result-item compact-layout batch-share-result-item ${result.success ? 'success' : 'error'}`;
                        fileItem.setAttribute('data-index', index);
                        fileItem.setAttribute('data-success', result.success);
                        fileItem.setAttribute('data-filename', result.fileName);
                        fileItem.setAttribute('data-filesize', result.fileSize || 0);
                        fileItem.setAttribute('data-sharelink', result.shareLink || '');
                        fileItem.setAttribute('data-extractcode', result.extractCode || '');
                        fileItem.setAttribute('data-msg', result.msg || '');

                        fileItem.innerHTML = `
                            <div class="batch-result-item-title">
                                <span class="batch-share-file-type"></span>
                                <span class="batch-share-file-name"></span>
                                <div class="batch-result-item-actions"></div>
                            </div>
                            <div class="batch-result-item-details batch-share-details-container">
                                <span class="file-size"></span>
                                <span class="batch-share-result-link"></span>
                                <span class="batch-result-status batch-share-status-auto"></span>
                            </div>
                        `;

                        const titleDiv = fileItem.querySelector('.batch-result-item-title');
                        const detailsDiv = fileItem.querySelector('.batch-result-item-details');
                        const statusDiv = fileItem.querySelector('.batch-result-item-status');

                        const fileType = getFileTypeDisplayName(getFileType(result.fileName, result.fileType));
                        titleDiv.querySelector('.batch-share-file-type').textContent = fileType;
                        titleDiv.querySelector('.batch-share-file-name').textContent = result.fileName;
                        titleDiv.querySelector('.batch-share-file-name').title = result.fileName;

                        detailsDiv.querySelector('.file-size').textContent = result.fileSize ? formatFileSize(result.fileSize) : '-';

                        if (result.success) {

                            const fullLink = `${result.shareLink}${result.extractCode ? `?password=${result.extractCode}` : ''}`;
                            const linkSpan = detailsDiv.querySelector('.batch-share-result-link');
                            linkSpan.textContent = fullLink;
                            linkSpan.title = '点击打开链接';
                            linkSpan.onclick = () => {
                                window.open(fullLink, '_blank');
                            };

                            const statusSpan = detailsDiv.querySelector('.batch-result-status');
                            if (statusSpan) {
                                statusSpan.textContent = '分享成功';
                                statusSpan.className = 'batch-result-status success';
                            }
                        } else {

                            const statusSpan = detailsDiv.querySelector('.batch-result-status');
                            if (statusSpan) {
                                statusSpan.textContent = result.msg;
                                statusSpan.className = 'batch-share-error-msg';
                            }
                        }

                        container.appendChild(fileItem);
                    });
                }
            }

            if (!isSharing && progressWrap) {
                progressWrap.classList.remove('show');
                const statusDisplay = batchShareContainer.querySelector('#batch-share-status-display');
                if (statusDisplay) {
                    statusDisplay.style.display = 'none';
                }
            } else if (isSharing && progressWrap) {
                progressWrap.classList.add('show');
            }

            const statusDisplay = batchShareContainer.querySelector('#batch-share-status-display');
            if (statusDisplay && !isSharing) {
                statusDisplay.style.display = 'none';
            }

            setTimeout(() => {
                const checkFileSelection = async () => {
                    const iframe = document.querySelector("iframe");
                    const iframeWindow = iframe?.contentWindow || unsafeWindow;
                    const selectDOM = iframeWindow?.document?.querySelectorAll("div.list-contents > ul li.selected");

                    if (!selectDOM || selectDOM.length === 0) {

                        if (!isSharing) {
                            const fileListDiv = batchShareContainer.querySelector('#batch-share-file-list');
                            const fileCountSpan = batchShareContainer.querySelector('#batch-share-file-count');
                            const container = batchShareContainer.querySelector('#batch-share-file-list-container');
                            const progressWrap = batchShareContainer.querySelector('#batch-share-progress');

                            if (fileListDiv) fileListDiv.style.display = 'none';
                            if (fileCountSpan) fileCountSpan.textContent = '';
                            if (container) container.innerHTML = '';
                            if (progressWrap) progressWrap.classList.remove('show');
                        }

                        return;
                    }

                    const getSizeEnabled = batchShareContainer.querySelector('#batch-share-get-size').checked;
                    const files = [];

                    for (const itemDOM of selectDOM) {
                        const fileType = itemDOM.getAttribute("file_type") === "0" ? "folder" : "file";
                        const id = fileType === "folder" ? itemDOM.getAttribute("cate_id") : itemDOM.getAttribute("file_id");
                        const fileName = itemDOM.getAttribute("title");

                        let fileSizeBytes = 0;
                        let fileSizeDisplay = "";

                        if (getSizeEnabled) {
                            if (fileType === "folder") {
                                try {
                                    const response = await new Promise((resolve, reject) => {
                                        GM_xmlhttpRequest({
                                            method: "GET",
                                            url: `https://webapi.115.com/category/get?cid=${id}`,
                                            onload: r => {
                                                try {
                                                    const data = JSON.parse(r.responseText);
                                                    resolve(data);
                                                } catch(e) { reject(e); }
                                            },
                                            onerror: e => reject(e)
                                        });
                                    });

                                    if (response && response.size) {
                                        const sizeStr = response.size;
                                        const sizeMatch = sizeStr.match(/^([\d.]+)([KMGT]?B)$/i);
                                        if (sizeMatch) {
                                            const value = parseFloat(sizeMatch[1]);
                                            const unit = sizeMatch[2].toUpperCase();
                                            const multipliers = { 'B': 1, 'KB': 1024, 'MB': 1024*1024, 'GB': 1024*1024*1024, 'TB': 1024*1024*1024*1024 };
                                            fileSizeBytes = Math.round(value * multipliers[unit]);
                                            fileSizeDisplay = sizeStr;
                                        }
                                    }
                                } catch (error) {
                                    console.error('获取文件夹大小失败:', error);
                                    fileSizeDisplay = "获取失败";
                                }
                            } else {
                                const size = itemDOM.getAttribute("file_size");
                                fileSizeBytes = size ? Number(size) : 0;
                                fileSizeDisplay = fileSizeBytes ? formatFileSize(fileSizeBytes) : "";
                            }
                        } else {
                            fileSizeDisplay = "-";
                        }

                        files.push({
                            id,
                            fileName,
                            fileSize: fileSizeBytes,
                            fileSizeDisplay,
                            fileType,
                            status: "ready"
                        });
                    }

                    if (files.length > 0) {

                        const fileListDiv = batchShareContainer.querySelector('#batch-share-file-list');
                        const fileCountSpan = batchShareContainer.querySelector('#batch-share-file-count');
                        const container = batchShareContainer.querySelector('#batch-share-file-list-container');

                        if (fileListDiv && fileCountSpan && container) {
                            fileListDiv.style.display = 'block';
                            fileCountSpan.textContent = `共 ${files.length} 个`;
                            container.innerHTML = '';

                            files.forEach((file, index) => {
                                const fileType = getFileType(file.fileName, file.fileType);
                                const typeDisplayName = getFileTypeDisplayName(fileType);
                                const typeSVG = getFileTypeSVG(fileType);

                                const fileItem = document.createElement('div');
                                fileItem.className = 'batch-result-item compact-layout batch-share-file-item';
                                fileItem.setAttribute('data-index', index);
                                fileItem.innerHTML = `
                                    <div class="batch-result-item-title">
                                        <span class="batch-share-file-type">${typeDisplayName}</span>
                                        <span class="batch-share-file-name" title="${file.fileName}">${file.fileName}</span>
                                    </div>
                                    <div class="batch-result-item-details">
                                        <span class="file-size">${file.fileSizeDisplay || '-'}</span>
                                        <span class="batch-share-status-pending">待分享</span>
                                    </div>
                                    <div class="batch-result-item-actions">
                                        <span class="batch-share-status-preparing">准备中</span>
                                    </div>
                                `;
                                container.appendChild(fileItem);
                            });
                        }
                    }
                };

                checkFileSelection();
            }, 100);

            return;
        }

        const batchShareSettings = JSON.parse(localStorage.getItem('batchShareSettings') || '{}');
        batchShareContainer.innerHTML = `
            <div id="batch-share-flex-row" class="batch-share-flex-row">
                <div class="batch-share-flex-column">
                    <label class="label batch-share-label">分享时长</label>
                    <select id="batch-share-expire" class="input batch-share-input">
                        <option value="-1">长期</option>
                        <option value="1">1天</option>
                        <option value="3">3天</option>
                        <option value="7">7天</option>
                        <option value="15">15天</option>
                    </select>
                </div>
                <div class="batch-share-flex-column">
                    <label class="label batch-share-label">接收次数</label>
                    <input type="number" id="batch-share-limit" class="input batch-share-input" value="${batchShareSettings.limit||0}" min="0" placeholder="0为无限制">
                </div>
                <div class="batch-share-flex-column">
                    <label class="label batch-share-label">提取码</label>
                    <input type="text" id="batch-share-code" class="input batch-share-input" placeholder="可选" maxlength="4" value="${batchShareSettings.code||''}">
                </div>
                <div class="batch-share-flex-column">
                    <label class="label batch-share-label">延迟(毫秒)</label>
                    <input type="number" id="batch-share-delay" class="input batch-share-input" value="${batchShareSettings.delay||1000}" min="100">
                </div>
                <div class="batch-share-flex-column">
                    <label class="label batch-share-label">免登流量(㎅)</label>
                    <input type="number" id="batch-share-traffic" class="input batch-share-input" value="${batchShareSettings.traffic||0}" min="0" placeholder="0为无限制">
                </div>
            </div>

            <div class="batch-share-layout-container">
                <div class="batch-share-switches-container">
                    <div class="batch-share-switch-group">
                        <label class="label">随机提取码</label>
                        <span class="element-block-switch element-block-switch-clickable">
                            <input type="checkbox" id="batch-share-auto-fill" ${batchShareSettings.randomExtractCode?"checked":""} class="batch-share-checkbox">
                            <span class="element-block-slider"></span>
                        </span>
                    </div>
                    <div class="batch-share-switch-group">
                        <label class="label">免登录下载</label>
                        <span class="element-block-switch element-block-switch-clickable">
                            <input type="checkbox" id="batch-share-anonymous" ${(batchShareSettings.anonymous===undefined||batchShareSettings.anonymous)?"checked":""} class="batch-share-checkbox">
                            <span class="element-block-slider"></span>
                        </span>
                    </div>
                    <div class="batch-share-switch-group">
                        <label class="label">存储到管理页</label>
                        <span class="element-block-switch element-block-switch-clickable">
                            <input type="checkbox" id="batch-share-auto-save" ${(batchShareSettings.autoSave===undefined||batchShareSettings.autoSave)?"checked":""} class="batch-share-checkbox">
                            <span class="element-block-slider"></span>
                        </span>
                    </div>
                    <div class="batch-share-switch-group">
                        <label class="label">API获取大小</label>
                        <span class="element-block-switch element-block-switch-clickable">
                            <input type="checkbox" id="batch-share-api-get-size" ${batchShareSettings.useApiGetSize?"checked":""} class="batch-share-checkbox">
                            <span class="element-block-slider"></span>
                        </span>
                    </div>
                    <div class="batch-share-switch-group">
                        <label class="label">获取大小</label>
                        <span class="element-block-switch element-block-switch-clickable">
                            <input type="checkbox" id="batch-share-get-size" ${batchShareSettings.getSize?"checked":""} class="batch-share-checkbox">
                            <span class="element-block-slider"></span>
                        </span>
                    </div>
                </div>
                <div class="batch-share-buttons-container">
                    <button id="batch-share-refresh-btn" class="btn-primary batch-recognize-start-btn">刷新列表</button>
                    <button id="batch-share-toggle-btn" class="btn-primary batch-recognize-start-btn">开始分享</button>
                </div>
            </div>

            <!-- 文件列表显示区域 -->
            <div id="batch-share-file-list" class="batch-share-file-list">
                <div class="batch-share-file-list-header">
                    <span class="storage-item-title">已选文件列表</span>
                    <span id="batch-share-file-count" class="batch-share-file-count"></span>
                </div>
                <div id="batch-share-file-list-container" class="batch-share-file-list-container">
                </div>
            </div>

            <div id="batch-share-progress" class="progress-container batch-recognize-progress batch-share-progress">
                <div class="progress-header batch-recognize-progress-header flex-between">
                    <span id="batch-share-progress-text"><span class="batch-recognize-progress-status">
                        <span class="status-progress">进度: 0/0 (0%)</span>
                        <span class="status-separator">|</span>
                        <span class="status-success">成功: 0</span>
                        <span class="status-separator">|</span>
                        <span class="status-failed">失败: 0</span>
                    </span></span>
                    <div class="batch-share-progress-actions flex-gap">
                        <button id="batch-share-copy-all-btn" class="storage-import-export-btn batch-recognize-export-btn batch-share-copy-all-btn btn-small">复制全部</button>
                        <button id="batch-share-export-btn" class="storage-import-export-btn batch-recognize-export-btn batch-share-export-btn btn-small" data-text="导出结果">导出结果</button>
                    </div>
                </div>
                <div class="progress-bar" id="batch-share-progress-bar"></div>
                <div id="batch-share-status-display" class="batch-share-status-display"></div>
            </div>
        `;
        batchShareContainer.querySelector('#batch-share-expire').value = batchShareSettings.expire || '-1';
        batchShareContainer.querySelector('#batch-share-expire').addEventListener('change', saveSettings);
        batchShareContainer.querySelector('#batch-share-limit').addEventListener('input', saveSettings);
        batchShareContainer.querySelector('#batch-share-code').addEventListener('input', saveSettings);
        batchShareContainer.querySelector('#batch-share-delay').addEventListener('input', saveSettings);
        batchShareContainer.querySelector('#batch-share-traffic').addEventListener('input', saveSettings);

        const autoFillCheckbox = batchShareContainer.querySelector('#batch-share-auto-fill');
        const anonymousCheckbox = batchShareContainer.querySelector('#batch-share-anonymous');
        const autoSaveCheckbox = batchShareContainer.querySelector('#batch-share-auto-save');
        const apiGetSizeCheckbox = batchShareContainer.querySelector('#batch-share-api-get-size');
        const getSizeCheckbox = batchShareContainer.querySelector('#batch-share-get-size');

        if (autoFillCheckbox) {
            autoFillCheckbox.addEventListener('change', () => {
                saveSettings();
                updateCodeInputState();
            });
        }
        if (anonymousCheckbox) {
            anonymousCheckbox.addEventListener('change', saveSettings);
        }
        if (autoSaveCheckbox) {
            autoSaveCheckbox.addEventListener('change', saveSettings);
        }
        if (apiGetSizeCheckbox) {
            apiGetSizeCheckbox.addEventListener('change', saveSettings);
        }
        if (getSizeCheckbox) {
            getSizeCheckbox.addEventListener('change', () => {
                saveSettings();

                const container = batchShareContainer.querySelector('#batch-share-file-list-container');
                if (container && container.children.length > 0) {

                    const currentFiles = Array.from(container.children).map(item => {
                        const fileName = item.querySelector('.batch-share-file-name').textContent;
                        const fileSizeSpan = item.querySelector('.file-size');
                        const fileSizeDisplay = fileSizeSpan ? fileSizeSpan.textContent : '';
                        return {
                            fileName: fileName,
                            fileSizeDisplay: fileSizeDisplay
                        };
                    });
                    showFileList(currentFiles, true);
                }
            });
        }

        const switchElements = batchShareContainer.querySelectorAll('.element-block-switch');
        switchElements.forEach(switchElement => {
            switchElement.addEventListener('click', (e) => {
                const checkbox = switchElement.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        });

        function updateCodeInputState() {
            const codeInput = batchShareContainer.querySelector('#batch-share-code');
            if (autoFillCheckbox.checked) {
                codeInput.disabled = true;
                codeInput.classList.add('batch-share-btn-disabled');
                codeInput.classList.remove('batch-share-btn-enabled');
                codeInput.placeholder = '随机生成';
            } else {
                codeInput.disabled = false;
                codeInput.classList.add('batch-share-btn-enabled');
                codeInput.classList.remove('batch-share-btn-disabled');
                codeInput.placeholder = '可选';
            }
        }

        updateCodeInputState();
        function saveSettings() {
            localStorage.setItem('batchShareSettings', JSON.stringify({
                expire: batchShareContainer.querySelector('#batch-share-expire').value,
                limit: batchShareContainer.querySelector('#batch-share-limit').value,
                code: batchShareContainer.querySelector('#batch-share-code').value,
                delay: batchShareContainer.querySelector('#batch-share-delay').value,
                traffic: batchShareContainer.querySelector('#batch-share-traffic').value,
                randomExtractCode: batchShareContainer.querySelector('#batch-share-auto-fill').checked,
                anonymous: batchShareContainer.querySelector('#batch-share-anonymous').checked,
                autoSave: batchShareContainer.querySelector('#batch-share-auto-save').checked,
                getSize: batchShareContainer.querySelector('#batch-share-get-size').checked,
                useApiGetSize: (batchShareContainer.querySelector('#batch-share-api-get-size') && batchShareContainer.querySelector('#batch-share-api-get-size').checked) || false
            }));
        }

        const flexRow = batchShareContainer.querySelector('#batch-share-flex-row');
        const fileListContainer = batchShareContainer.querySelector('#batch-share-file-list-container');
        if (windowElement.classList.contains('maximized')) {
            flexRow.classList.add('batch-share-flex-row-maximized');
            if (fileListContainer) {
                fileListContainer.classList.add('batch-share-file-list-maximized');
                fileListContainer.classList.remove('batch-share-file-list-normal');
            }
        } else {
            flexRow.classList.remove('batch-share-flex-row-maximized');
            if (fileListContainer) {
                fileListContainer.classList.add('batch-share-file-list-normal');
                fileListContainer.classList.remove('batch-share-file-list-maximized');
            }
        }

        const expireSelect = batchShareContainer.querySelector('#batch-share-expire');
        const limitInput = batchShareContainer.querySelector('#batch-share-limit');
        const codeInput = batchShareContainer.querySelector('#batch-share-code');
        const delayInput = batchShareContainer.querySelector('#batch-share-delay');
        const trafficInput = batchShareContainer.querySelector('#batch-share-traffic');
        const refreshBtn = batchShareContainer.querySelector('#batch-share-refresh-btn');
        const toggleBtn = batchShareContainer.querySelector('#batch-share-toggle-btn');
        const progressBar = batchShareContainer.querySelector('#batch-share-progress-bar');
        const progressWrap = batchShareContainer.querySelector('#batch-share-progress');
        const progressText = batchShareContainer.querySelector('#batch-share-progress-text');
        const exportBtn = batchShareContainer.querySelector('#batch-share-export-btn');
        const fileListDiv = batchShareContainer.querySelector('#batch-share-file-list');
        const fileCountSpan = batchShareContainer.querySelector('#batch-share-file-count');

        let results = [];
        let isSharing = false;
        let isCancelling = false;
        let totalItems = 0;
        let processedItems = 0;
        let successCount = 0;
        let failedCount = 0;

        async function getSelectedFiles() {
            const iframe = document.querySelector("iframe");
            const iframeWindow = iframe?.contentWindow || unsafeWindow;
            const selectDOM = iframeWindow?.document?.querySelectorAll("div.list-contents > ul li.selected");

            if (!selectDOM || selectDOM.length === 0) {
                return [];
            }

            const getSizeEnabled = batchShareContainer.querySelector('#batch-share-get-size').checked;

            const files = [];

            for (const itemDOM of selectDOM) {
                const fileType = itemDOM.getAttribute("file_type") === "0" ? "folder" : "file";
                const id = fileType === "folder" ? itemDOM.getAttribute("cate_id") : itemDOM.getAttribute("file_id");
                const fileName = itemDOM.getAttribute("title");

                let fileSizeBytes = 0;
                let fileSizeDisplay = "";

                if (fileType !== "folder") {
                    const size = itemDOM.getAttribute("file_size");
                    fileSizeBytes = size ? Number(size) : 0;
                    if (getSizeEnabled) {
                        fileSizeDisplay = fileSizeBytes ? formatFileSize(fileSizeBytes) : "";
                    } else {
                        fileSizeDisplay = "-";
                    }
                } else if (getSizeEnabled) {
                    try {
                        const response = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method: "GET",
                                url: `https://webapi.115.com/category/get?cid=${id}`,
                                onload: r => {
                                    try {
                                        const data = JSON.parse(r.responseText);
                                        resolve(data);
                                    } catch(e) { reject(e); }
                                },
                                onerror: e => reject(e)
                            });
                        });

                        if (response && response.size) {
                            const sizeStr = response.size;
                            const sizeMatch = sizeStr.match(/^([\d.]+)([KMGT]?B)$/i);
                            if (sizeMatch) {
                                const value = parseFloat(sizeMatch[1]);
                                const unit = sizeMatch[2].toUpperCase();
                                const multipliers = { 'B': 1, 'KB': 1024, 'MB': 1024*1024, 'GB': 1024*1024*1024, 'TB': 1024*1024*1024*1024 };
                                fileSizeBytes = Math.round(value * multipliers[unit]);
                                fileSizeDisplay = sizeStr;
                            }
                        }
                    } catch (error) {
                        console.error('获取文件夹大小失败:', error);
                        fileSizeDisplay = "获取失败";
                    }
                } else {
                    fileSizeDisplay = "-";
                }

                files.push({
                    id,
                    fileName,
                    fileSize: fileSizeBytes,
                    fileSizeDisplay,
                    fileType,
                    status: "ready"
                });
            }

            return files;
        }

        function getFileType(fileName, fileType) {
            if (fileType === 'folder') return 'folder';

            const ext = fileName.split('.').pop()?.toLowerCase();
            if (!ext) return 'document';

            const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tif', 'tiff', 'tga', 'psd', 'iconic'];
            const documentExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'xltm', 'ppt', 'pptx', 'txt', 'rtf', 'xml', 'html', 'htm', 'json', 'js', 'py', 'tpl', 'idx', 'log', 'ini', 'torrent', 'ssa', 'str', 'reg'];
            const softwareExts = ['exe', 'msi', 'dmg', 'pkg', 'deb', 'rpm', 'apk', 'bat'];
            const audioExts = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a'];
            const videoExts = ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm', 'm4v', 'vob', 'ts', 'mts', 'm2ts', '3gp', 'mod', 'dv', 'swf'];
            const compressExts = ['zip', 'rar', '7z', 'tar', 'gz', 'xz', 'bz2', 'iso'];

            if (imageExts.includes(ext)) return 'image';
            if (documentExts.includes(ext)) return 'document';
            if (softwareExts.includes(ext)) return 'software';
            if (audioExts.includes(ext)) return 'audio';
            if (videoExts.includes(ext)) return 'video';
            if (compressExts.includes(ext)) return 'compress';

            return 'other';
        }

        function getFileTypeSVG(type, fileName = '') {
            const base = 'https://cdnres.115.com/site/static/style_v10.0/file/images/file_type';
            const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tif', 'tiff'];
            const documentExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'xltm', 'ppt', 'pptx', 'txt', 'rtf', 'chm', 'html', 'htm', 'json', 'idx', 'log', 'ini', 'torrent', 'tpl', 'ssa', 'str', 'reg'];
            const softwareExts = ['exe', 'msi', 'dmg', 'pkg', 'deb', 'rpm', 'apk', 'bat'];
            const audioExts = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a', 'dts'];
            const videoExts = ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm', 'm4v', 'vob', 'ts', 'mts', 'm2ts', '3gp', 'mod', 'dv', 'swf'];
            const compressExts = ['zip', 'rar', '7z', 'tar', 'gz', 'xz', 'bz2', 'iso'];
            let ext = '';
            try {
                const name = (fileName || '').split('/').pop();
                const dot = name.lastIndexOf('.');
                ext = dot >= 0 ? name.slice(dot + 1).toLowerCase() : '';
            } catch (e) { ext = ''; }
            const inSet = (set, e) => Array.isArray(set) && set.includes(e);
            let url = `${base}/other/unknown.svg`;
            switch (type) {
                case 'folder':
                    url = `${base}/folder/folder.svg`;
                    break;
                case 'image':
                    if (ext === 'psd') {
                        url = `${base}/source/psd.svg`;
                    } else if (ext === 'iconic') {
                        url = `${base}/image/other_pic.svg`;
                    } else {
                        url = inSet(imageExts, ext) ? `${base}/image/${ext}.svg` : `${base}/image/other_pic.svg`;
                    }
                    break;
                case 'document':
                    if (ext === 'xml' || ext === 'py' || ext === 'js' || ext === 'tpl') {
                        url = `${base}/code/code.svg`;
                    } else if (ext === 'html') {
                        url = `${base}/code/html.svg`;
                    } else if (ext === 'htm') {
                        url = `${base}/code/htm.svg`;
                    } else if (ext === 'xltm') {
                        url = `${base}/document/xls.svg`;
                    } else if (ext === 'ini') {
                        url = `${base}/document/ini.svg?_vh=c7c4575_89`;
                    } else {
                        url = `${base}/document/${inSet(documentExts, ext) ? ext : 'document'}.svg`;
                    }
                    break;
                case 'software':
                    url = `${base}/application/${inSet(softwareExts, ext) ? ext : 'exe'}.svg`;
                    break;
                case 'audio':
                    url = `${base}/audio/${inSet(audioExts, ext) ? ext : 'audio'}.svg`;
                    break;
                case 'video':
                    url = `${base}/video/${inSet(videoExts, ext) ? ext : 'video'}.svg`;
                    break;
                case 'compress':
                    if (ext === 'xz') {
                        url = `${base}/archive/rar.svg`;
                    } else {
                        url = `${base}/archive/${inSet(compressExts, ext) ? ext : 'archive'}.svg`;
                    }
                    break;
                default:
                    url = `${base}/other/unknown.svg`;
            }
            return `<img class="batch-share-file-icon" src="${url}" alt="${type}">`;
        }

        function getFileTypeDisplayName(type) {
            const typeMap = {
                'folder': '文件夹',
                'image': '图片',
                'document': '文档',
                'software': '软件',
                'audio': '音频',
                'video': '视频',
                'compress': '压缩包',
                'other': '其他'
            };
            return typeMap[type] || '文件';
        }

        function setupFileSelectionWatcher() {
            let lastSelectedCount = 0;
            let lastSelectedFiles = '';

            async function checkFileSelection() {
                if (isSharing) {
                    return;
                }

                const files = await getSelectedFiles();
                const currentCount = files.length;
                const currentFiles = JSON.stringify(files.map(f => ({id: f.id, fileName: f.fileName})));

                const hasSelectionChanged = currentCount !== lastSelectedCount || currentFiles !== lastSelectedFiles;

                const activeTab = document.querySelector('.storage-tab.active');
                if (activeTab && activeTab.getAttribute('data-tab') === 'batchshare' && hasSelectionChanged) {
                    showBatchShareStatus('正在获取文件信息...', '#4285f4');
                }

                lastSelectedCount = currentCount;
                lastSelectedFiles = currentFiles;

                if (activeTab && activeTab.getAttribute('data-tab') === 'batchshare') {
                    if (currentCount === 0) {
                        showBatchShareStatus('请先选择要分享的文件', '#f44336');

                        results = [];
                        const container = batchShareContainer.querySelector('#batch-share-file-list-container');
                        const progressWrap = batchShareContainer.querySelector('#batch-share-progress');
                        const fileListDiv = batchShareContainer.querySelector('#batch-share-file-list');
                        const fileCountSpan = batchShareContainer.querySelector('#batch-share-file-count');

                        if (container) container.innerHTML = '';
                        if (fileListDiv) fileListDiv.style.display = 'none';
                        if (fileCountSpan) fileCountSpan.textContent = '';
                        if (progressWrap) progressWrap.classList.remove('show');
                    } else {
                        const previousFiles = JSON.stringify(results.map(r => ({id: r.id, fileName: r.fileName})));

                        if (currentFiles !== previousFiles) {
                            results = [];
                            showFileList(files, true);
                        } else {
                            const fileCountSpan = batchShareContainer.querySelector('#batch-share-file-count');
                            if (fileCountSpan) {
                                fileCountSpan.textContent = `共 ${currentCount} 项`;
                            }
                        }
                    }
                }
            }

            const iframe = document.querySelector("iframe");
            if (iframe && iframe.contentWindow) {
                try {
                    const debouncedCheck = debounce(() => checkFileSelection(), 150);

                    iframe.contentWindow.document.addEventListener('click', function(e) {
                        if (e.target.closest('li') || e.target.closest('.list-contents')) {
                            debouncedCheck();
                        }
                    });

                    iframe.contentWindow.document.addEventListener('keydown', function(e) {
                        if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape' || e.ctrlKey || e.metaKey) {
                            debouncedCheck();
                        }
                    });

                    iframe.contentWindow.document.addEventListener('selectionchange', function(e) {
                        debouncedCheck();
                    });

                    iframe.contentWindow.document.addEventListener('change', function(e) {
                        debouncedCheck();
                    });

                    iframe.contentWindow.document.addEventListener('input', function(e) {
                        debouncedCheck();
                    });

                    const observer = new MutationObserver(function(mutations) {
                        const hasRelevantChanges = mutations.some(mutation => {
                            return mutation.type === 'attributes' &&
                                   (mutation.attributeName === 'class' || mutation.attributeName === 'data-selected') ||
                                   mutation.type === 'childList' &&
                                   (mutation.target.closest('li') || mutation.target.closest('.list-contents'));
                        });

                        if (hasRelevantChanges) {
                            debouncedCheck();
                        }
                    });
                    observer.observe(iframe.contentWindow.document.body, {
                        childList: true,
                        subtree: true,
                        attributes: true,
                        attributeFilter: ['class', 'data-selected']
                    });
                } catch (e) {
                    console.error('设置文件选择监听器失败:', e);
                }
            }

            checkFileSelection();
        }

        function showFileList(files, clearContainer = true) {
            if (isSharing) {
                return;
            }

            const fileListDiv = batchShareContainer.querySelector('#batch-share-file-list');
            const fileCountSpan = batchShareContainer.querySelector('#batch-share-file-count');
            const container = batchShareContainer.querySelector('#batch-share-file-list-container');

            if (!files || files.length === 0) {
                if (fileListDiv) fileListDiv.style.display = 'none';
                if (fileCountSpan) fileCountSpan.textContent = '';
                if (container) container.innerHTML = '';
                return;
            }

            if (fileListDiv) fileListDiv.style.display = 'block';
            if (fileCountSpan) fileCountSpan.textContent = `共 ${files.length} 个文件/文件夹`;

            if (clearContainer && container) {
                container.innerHTML = '';
            }

            if (windowElement.classList.contains('maximized')) {
                container.style.maxHeight = 'calc(100vh - 400px)';
                container.style.height = 'calc(100vh - 400px)';
            } else {
                container.style.maxHeight = '290px';
                container.style.height = '';
            }

            const getSizeCheckbox = batchShareContainer.querySelector('#batch-share-get-size');
            const showFileSize = getSizeCheckbox ? getSizeCheckbox.checked : false;

            files.forEach((file, index) => {
                const fileType = getFileType(file.fileName, file.fileType);
                const typeSVG = getFileTypeSVG(fileType, file.fileName);

                const fileSizeDisplay = showFileSize && file.fileSizeDisplay ?
                    `<span class="file-size">${file.fileSizeDisplay}</span>` : '';

                const fileItem = document.createElement('div');
                fileItem.className = 'batch-result-item compact-layout';
                fileItem.setAttribute('data-index', index);
                fileItem.innerHTML = `
                    <div class="batch-result-item-title">
                        ${typeSVG}
                        <span class="batch-share-file-name" title="${file.fileName}">${file.fileName}</span>
                    </div>
                    <div class="batch-result-item-details">
                        ${fileSizeDisplay}
                        <span class="batch-share-status-pending">待分享</span>
                    </div>
                    <div class="batch-result-item-actions">
                        <span class="batch-share-status-preparing">准备中</span>
                    </div>
                `;
                container.appendChild(fileItem);
            });
        }

        function updateFileListStatus(index, status, shareLink = '', extractCode = '', info = '') {
            const container = batchShareContainer.querySelector('#batch-share-file-list-container');
            const fileItem = container.querySelector(`[data-index="${index}"]`);

            if (fileItem) {
                const titleDiv = fileItem.querySelector('.batch-result-item-title');
                const detailsDiv = fileItem.querySelector('.batch-result-item-details');
                const actionsDiv = fileItem.querySelector('.batch-result-item-actions');

                const existingIconDiv = titleDiv.querySelector('img.batch-share-file-icon');
                const fileName = titleDiv.querySelector('.batch-share-file-name').textContent;
                const iconHTML = existingIconDiv ? existingIconDiv.outerHTML : getFileTypeSVG(getFileType(fileName, ''), fileName);

                const getSizeCheckbox = batchShareContainer.querySelector('#batch-share-get-size');
                const showFileSize = getSizeCheckbox ? getSizeCheckbox.checked : false;

                const currentFileSizeSpan = detailsDiv.querySelector('.file-size');
                const currentFileSize = currentFileSizeSpan ? currentFileSizeSpan.textContent : '';
                const fileSizeDisplay = showFileSize && currentFileSize ?
                    `<span class="file-size">${currentFileSize}</span>` : '';

                if (status === 'success') {
                    fileItem.className = 'batch-result-item compact-layout success';
                    const fullLink = `${shareLink}${extractCode ? `?password=${extractCode}` : ''}`;
                    titleDiv.innerHTML = `
                        ${iconHTML}
                        <span class="batch-share-file-name" title="${fileName}">${fileName}</span>
                        <div class="batch-share-actions-container">
                            <button class="storage-item-btn copy-btn batch-share-copy-btn batch-share-action-btn">复制</button>
                            <button class="storage-item-btn open-btn batch-share-action-btn">打开</button>
                        </div>
                    `;
                    detailsDiv.innerHTML = `
                        ${fileSizeDisplay}
                        <span class="batch-share-result-link" title="点击打开链接" onclick="window.open('${fullLink}', '_blank')">${fullLink}</span>
                        <span class="batch-result-status success batch-share-status-success">分享成功</span>
                    `;
                    actionsDiv.innerHTML = '';

                    const copyBtn = titleDiv.querySelector('.copy-btn');
                    const openBtn = titleDiv.querySelector('.open-btn');

                    if (copyBtn) {
                        copyBtn.addEventListener('click', () => {
                            if (copyBtn._copyTimer) clearTimeout(copyBtn._copyTimer);
                            const title = fileName;
                            const text = `${fullLink}#\n${title}`;
                            navigator.clipboard.writeText(text).then(() => {
                                const originalText = copyBtn.textContent;
                                copyBtn.textContent = '已复制';
                                copyBtn.classList.add('copied');
                                copyBtn._copyTimer = setTimeout(() => {
                                    copyBtn.textContent = originalText;
                                    copyBtn.classList.remove('copied');
                                    copyBtn._copyTimer = null;
                                }, 1000);
                            }).catch(() => alert('复制失败'));
                        });
                    }

                    if (openBtn) {
                        openBtn.addEventListener('click', () => {
                            window.open(fullLink, '_blank');
                        });
                    }
                } else if (status === 'error') {
                    fileItem.className = 'batch-result-item compact-layout error';
                    titleDiv.innerHTML = `
                        ${iconHTML}
                        <span class="batch-share-file-name" title="${fileName}">${fileName}</span>
                    `;
                    detailsDiv.innerHTML = `
                        ${fileSizeDisplay}
                        <span class="batch-share-status-failed">分享失败</span>
                    `;
                    actionsDiv.innerHTML = `<span class="batch-share-error-msg">${info}</span>`;
                } else if (status === 'processing') {
                    fileItem.className = 'batch-result-item compact-layout';
                    titleDiv.innerHTML = `
                        ${iconHTML}
                        <span class="batch-share-file-name" title="${fileName}">${fileName}</span>
                    `;
                    detailsDiv.innerHTML = `
                        ${fileSizeDisplay}
                        <span class="batch-share-status-processing">处理中</span>
                    `;
                    actionsDiv.innerHTML = '<span class="batch-share-status-sharing">分享中</span>';
                }
            }
        }

        function updateProgress() {
            const progress = totalItems > 0 ? (processedItems / totalItems) * 100 : 0;
            progressBar.style.width = `${progress}%`;

            const expireText = expireSelect.value === '-1' ? '永久' : `${expireSelect.value}天`;
            const codeText = autoFillCheckbox.checked ? '随机' : '自定义';
            const delayText = `${delayInput.value}ms`;

            const progressHtml = `<span class="batch-recognize-progress-status">
                <span class="status-progress">进度: ${processedItems}/${totalItems} (${Math.round(progress)}%)</span>
                <span class="status-separator">|</span>
                <span class="status-success">成功: ${successCount}</span>
                <span class="status-separator">|</span>
                <span class="status-failed">失败: ${failedCount}</span>
            </span>`;

            if (progressText) {
                progressText.innerHTML = progressHtml;
            }
        }

        function showBatchShareStatus(msg, color, stats = null) {
            const statusDisplay = batchShareContainer.querySelector('#batch-share-status-display');

            if (stats) {
                const statsMatch = stats.match(/成功:\s*(\d+)\s*\|\s*失败:\s*(\d+)/);
                if (statsMatch) {
                    const successCount = parseInt(statsMatch[1]);
                    const failCount = parseInt(statsMatch[2]);
                    const totalCount = successCount + failCount;

                    const statusHtml = `<span class="batch-recognize-progress-status">
                        <span class="status-label">总数: ${totalCount}项</span>
                        <span class="status-separator">|</span>
                        <span class="status-success">成功: ${successCount}项</span>
                        <span class="status-separator">|</span>
                        <span class="status-failed">失败: ${failCount}项</span>
                    </span>`;

                    const currentProgressHtml = progressText.innerHTML;
                    if (currentProgressHtml && !currentProgressHtml.includes('总数:')) {
                        progressText.innerHTML = currentProgressHtml + '<br>' + statusHtml;
                    } else {
                        progressText.innerHTML = statusHtml;
                    }

                    if (statusDisplay) {
                        statusDisplay.style.display = 'none';
                    }
                } else {
                    if (statusDisplay) {
                        statusDisplay.style.display = 'none';
                    }
                }
            } else {
                if (statusDisplay) {
                    statusDisplay.innerHTML = `<span class="status-display-text">${msg}</span>`;
                    if (color === '#4caf50') {
                        statusDisplay.style.background = 'rgba(76, 175, 80, 0.9)';
                    } else if (color === '#f44336') {
                        statusDisplay.style.background = 'rgba(244, 67, 54, 0.9)';
                    } else if (color === '#ff9800') {
                        statusDisplay.style.background = 'rgba(255, 152, 0, 0.9)';
                    } else {
                        statusDisplay.style.background = 'rgba(66, 133, 244, 0.9)';
                    }
                    statusDisplay.style.display = 'block';
                }

            }
        }

        function generateRandomExtractCode() {
            let code = '';
            for (let i = 0; i < 4; i++) {
                code += DEFAULT_CHARS[Math.floor(Math.random() * DEFAULT_CHARS.length)];
            }
            return code;
        }

        async function getShareInfoByCode(shareCode) {
            try {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://115cdn.com/webapi/share/snap?share_code=${shareCode}`,
                        onload: r => {
                            try {
                                const data = JSON.parse(r.responseText);
                                resolve(data);
                            } catch(e) { reject(e); }
                        },
                        onerror: e => reject(e)
                    });
                });

                if (response && response.state && response.data) {
                    const shareInfo = response.data.shareinfo || response.data;
                    const shareState = shareInfo.share_state;
                    const forbidReason = shareInfo.forbid_reason;

                    if (response.state === false || response.error_code || response.error_msg || forbidReason || shareState === -1) {

                        return {
                            shareTitle: '',
                            fileSize: 0,
                            expireTime: -1,
                            autoRenewal: '0',
                            isValid: false,
                            errorMsg: forbidReason || response.error_msg || '分享已取消或无效'
                        };
                    }

                    return {
                            shareTitle: processShareTitle({data: {shareinfo: shareInfo, list: response?.data?.list || []}}),
                            fileSize: parseInt(shareInfo.file_size || '0'),
                            expireTime: shareInfo.expire_time || -1,
                            autoRenewal: String(shareInfo.auto_renewal || '0'),
                            isValid: true
                        };
                }
                return null;
            } catch (error) {
                console.error('获取分享信息失败:', error);
                return null;
            }
        }

        async function batchShare() {
            if (isSharing) {
                return;
            }

            isSharing = true;
            toggleBtn.disabled = true;
            toggleBtn.classList.add('batch-share-btn-disabled');
            toggleBtn.textContent = '正在分享...';

            refreshBtn.disabled = true;
            refreshBtn.classList.add('batch-share-btn-disabled');
            refreshBtn.textContent = '刷新列表中...';

            showBatchShareStatus('正在准备分享...', '#4285f4');

            try {
                const files = await getSelectedFiles();
                if (!files.length) {
                    showBatchShareStatus('请先选择要分享的文件', '#f44336');
                    return;
                }

                const currentFiles = JSON.stringify(files.map(f => ({id: f.id, fileName: f.fileName})));
                const previousFiles = JSON.stringify(results.map(r => ({id: r.id, fileName: r.fileName})));

                if (!isSharing) {
                    if (currentFiles !== previousFiles) {
                        results = [];
                        showFileList(files, true);
                    } else {
                        showFileList(files, false);
                    }
                }

                const shareConfig = {
                    expireTime: parseInt(expireSelect.value),
                    customCode: codeInput.value,
                    acceptLimit: parseInt(limitInput.value) || 0,
                    shareDelay: parseInt(delayInput.value) || 1000,
                    randomExtractCode: autoFillCheckbox.checked,
                    allowAnonymousDownload: anonymousCheckbox.checked,
                    anonymousDownloadTraffic: parseInt(trafficInput.value) || 0
                };

                totalItems = files.length;
                processedItems = 0;
                successCount = 0;
                failedCount = 0;
                isCancelling = false;

                progressWrap.style.display = 'block';
                progressBar.style.width = '0%';
                updateProgress();

                toggleBtn.textContent = '取消分享';
                toggleBtn.disabled = false;
                toggleBtn.classList.remove('batch-share-btn-disabled');

            for (let i = 0; i < files.length; i++) {
                if (isCancelling) {
                    showBatchShareStatus('分享已取消', '#f44336');
                    break;
                }

                const file = files[i];
                processedItems = i + 1;
                updateProgress();
                showBatchShareStatus(`正在分享 ${i+1}/${files.length}: ${file.fileName}`, '#4285f4');

                updateFileListStatus(i, 'processing');

                try {
                    const formDataFirst = new URLSearchParams();
                    const { user_id } = unsafeWindow || {};

                    formDataFirst.append("user_id", user_id);
                    formDataFirst.append("file_ids", file.id + "");
                    formDataFirst.append("ignore_warn", "1");
                    formDataFirst.append("is_asc", "0");
                    formDataFirst.append("order", "user_ptime");

                    const resultOne = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: 'https://webapi.115.com/share/send',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            data: formDataFirst.toString(),
                            onload: r => {
                                try {
                                    const data = JSON.parse(r.responseText);
                                    resolve(data);
                                } catch(e) { reject(e); }
                            },
                            onerror: e => reject(e)
                        });
                    });

                    if (!resultOne || resultOne.error) {
                        throw new Error(resultOne?.error || '创建分享失败');
                    }

                    await new Promise(res => setTimeout(res, shareConfig.shareDelay));

                    const formDataSecond = new URLSearchParams();
                    const share_code = resultOne.data.share_code;

                    formDataSecond.append("share_code", share_code);
                    formDataSecond.append("auto_fill_recvcode", "0");
                    formDataSecond.append("receive_user_limit", shareConfig.acceptLimit || "");
                    formDataSecond.append("share_duration", shareConfig.expireTime);

                    let finalExtractCode = shareConfig.customCode;
                    if (!finalExtractCode && shareConfig.randomExtractCode) {
                        finalExtractCode = generateRandomExtractCode();
                    }

                    if (finalExtractCode && finalExtractCode !== "") {
                        formDataSecond.append("receive_code", finalExtractCode);
                        formDataSecond.append("is_custom_code", "1");
                    }

                    const resultTwo = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: 'https://webapi.115.com/share/updateshare',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            data: formDataSecond.toString(),
                            onload: r => {
                                try {
                                    const data = JSON.parse(r.responseText);
                                    resolve(data);
                                } catch(e) { reject(e); }
                            },
                            onerror: e => reject(e)
                        });
                    });

                    if (!resultTwo || resultTwo.error) {
                        throw new Error(resultTwo?.error || '更新分享设置失败');
                    }

                    await new Promise(res => setTimeout(res, shareConfig.shareDelay));

                    if (shareConfig.allowAnonymousDownload && unsafeWindow?.USER_PERMISSION?.is_vip) {
                        const formDataThird = new URLSearchParams();
                        formDataThird.append("share_code", share_code);
                        formDataThird.append("skip_login", "1");
                        formDataThird.append("skip_login_down_flow_limit", shareConfig.anonymousDownloadTraffic);

                        try {
                            await new Promise((resolve, reject) => {
                                GM_xmlhttpRequest({
                                    method: "POST",
                                    url: 'https://webapi.115.com/share/skip_login_down',
                                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                                    data: formDataThird.toString(),
                                    onload: r => {
                                        try {
                                            const data = JSON.parse(r.responseText);
                                            resolve(data);
                                        } catch(e) { reject(e); }
                                    },
                                    onerror: e => reject(e)
                                });
                            });
                        } catch (error) {
                            console.error('设置免登录下载失败:', error);
                        }
                    } else if (!shareConfig.allowAnonymousDownload && unsafeWindow?.USER_PERMISSION?.is_vip) {
                        const formDataThird = new URLSearchParams();
                        formDataThird.append("share_code", share_code);
                        formDataThird.append("skip_login", "0");
                        formDataThird.append("skip_login_down_flow_limit", "0");
                        try {
                            await new Promise((resolve, reject) => {
                                GM_xmlhttpRequest({
                                    method: "POST",
                                    url: 'https://webapi.115.com/share/skip_login_down',
                                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                                    data: formDataThird.toString(),
                                    onload: r => {
                                        try {
                                            const data = JSON.parse(r.responseText);
                                            resolve(data);
                                        } catch(e) { reject(e); }
                                    },
                                    onerror: e => reject(e)
                                });
                            });
                        } catch (error) {
                            console.error('设置免登录下载失败:', error);
                        }
                    }

                    const { data = {} } = resultOne || {};
                    if (data.share_url) {
                        const result = {
                            fileName: file.fileName,
                            fileSize: file.fileSize,
                            fileType: file.fileType,
                            type: getFileType(file.fileName, file.fileType),
                            shareLink: data.share_url,
                            extractCode: finalExtractCode || data.receive_code || "",
                            expireTime: shareConfig.expireTime,
                            acceptLimit: shareConfig.acceptLimit,
                            anonymousDownloadTraffic: shareConfig.anonymousDownloadTraffic,
                            allowAnonymousDownload: shareConfig.allowAnonymousDownload,
                            success: true,
                            msg: "分享成功",
                            shareCode: data.share_code
                        };

                        results.push(result);
                        successCount++;
                        updateProgress();

                        updateFileListStatus(i, 'success', data.share_url, finalExtractCode || data.receive_code || "");

                        const autoSaveEnabled = batchShareContainer.querySelector('#batch-share-auto-save').checked;
                        if (autoSaveEnabled) {
                            try {
                                const localFileSize = parseInt(file.fileSize) || 0;
                                const useApiGetSize = (batchShareContainer.querySelector('#batch-share-api-get-size') && batchShareContainer.querySelector('#batch-share-api-get-size').checked) || false;

                                if (useApiGetSize) {
                                    try {
                                        const shareInfo = await getShareInfoByCode(data.share_code);
                                        if (shareInfo && shareInfo.isValid) {
                                            saveToStorage(
                                                data.share_code,
                                                finalExtractCode || data.receive_code || "",
                                                `[批量分享] ${file.fileName}`,
                                                shareInfo.shareTitle || file.fileName,
                                                shareInfo.expireTime || shareConfig.expireTime,
                                                shareInfo.fileSize || localFileSize,
                                                shareInfo.autoRenewal || '0',
                                                '',
                                                ''
                                            );
                                        } else {
                                            if (shareInfo && !shareInfo.isValid) {
                                                console.log(`分享无效: ${shareInfo.errorMsg}`);
                                            }
                                            saveToStorage(
                                                data.share_code,
                                                finalExtractCode || data.receive_code || "",
                                                `[批量分享] ${file.fileName}`,
                                                file.fileName,
                                                shareConfig.expireTime,
                                                localFileSize,
                                                '0',
                                                '',
                                                ''
                                            );
                                        }
                                    } catch (apiError) {
                                        console.error('通过API获取分享信息失败:', apiError);
                                        saveToStorage(
                                            data.share_code,
                                            finalExtractCode || data.receive_code || "",
                                            `[批量分享] ${file.fileName}`,
                                            file.fileName,
                                            shareConfig.expireTime,
                                            localFileSize,
                                            '0',
                                            '',
                                            ''
                                        );
                                    }
                                } else {
                                    saveToStorage(
                                        data.share_code,
                                        finalExtractCode || data.receive_code || "",
                                        `[批量分享] ${file.fileName}`,
                                        file.fileName,
                                        shareConfig.expireTime,
                                        localFileSize,
                                        '0',
                                        '',
                                        ''
                                    );
                                }
                            } catch (error) {
                                console.error('存储到管理页失败:', error);
                                saveToStorage(
                                    data.share_code,
                                    finalExtractCode || data.receive_code || "",
                                    `[批量分享] ${file.fileName}`,
                                    file.fileName,
                                    shareConfig.expireTime,
                                    0,
                                    '0',
                                    '',
                                    ''
                                );
                            }
                        }
                    } else {
                        results.push({
                            fileName: file.fileName,
                            fileSize: file.fileSize,
                            fileType: file.fileType,
                            type: getFileType(file.fileName, file.fileType),
                            success: false,
                            msg: "分享失败: 未获取到分享链接"
                        });
                        failedCount++;
                        updateProgress();

                        updateFileListStatus(i, 'error', '', '', "未获取到分享链接");
                    }

                } catch (error) {
                    console.error("分享文件失败:", file.fileName, error);

                    results.push({
                        fileName: file.fileName,
                        fileSize: file.fileSize,
                        fileType: file.fileType,
                        type: getFileType(file.fileName, file.fileType),
                        success: false,
                        msg: "分享失败: " + (error.message || "未知错误")
                    });
                    failedCount++;
                    updateProgress();

                    updateFileListStatus(i, 'error', '', '', error.message || "未知错误");
                }

                await new Promise(res => setTimeout(res, 100));
            }

            const stats = `成功: ${successCount} | 失败: ${failedCount}`;
            showBatchShareStatus(`分享完成！`, successCount===files.length?'#4caf50':'#f44336', stats);

            const exportBtn = batchShareContainer.querySelector('#batch-share-export-btn');
            const copyAllBtn = batchShareContainer.querySelector('#batch-share-copy-all-btn');
            const hasResults = results.length > 0;

            if (exportBtn) exportBtn.style.display = hasResults ? 'inline-block' : 'none';
            if (copyAllBtn) copyAllBtn.style.display = hasResults ? 'inline-block' : 'none';

            updateProgress();

            const statusDisplay = batchShareContainer.querySelector('#batch-share-status-display');
            if (statusDisplay) {
                statusDisplay.style.display = 'none';
            }

            isSharing = false;
            toggleBtn.textContent = '开始分享';
            toggleBtn.disabled = false;
            toggleBtn.classList.remove('batch-share-btn-disabled');

            if (results.length > 0) {
                fileListDiv.style.display = 'block';
            }
        } catch (error) {
            console.error('批量分享失败:', error);
            showBatchShareStatus('批量分享失败: ' + (error.message || '未知错误'), '#f44336');
        } finally {
            const statusDisplay = batchShareContainer.querySelector('#batch-share-status-display');
            if (statusDisplay) {
                statusDisplay.style.display = 'none';
            }

            isSharing = false;
            toggleBtn.disabled = false;
            toggleBtn.classList.remove('batch-share-btn-disabled');
            toggleBtn.textContent = '开始分享';

            refreshBtn.disabled = false;
            refreshBtn.classList.remove('batch-share-btn-disabled');
            refreshBtn.textContent = '刷新列表';
        }
        }

        refreshBtn.onclick = async function() {
            if (refreshBtn.disabled) {
                return;
            }

            refreshBtn.disabled = true;
            refreshBtn.classList.add('batch-share-btn-disabled');
            refreshBtn.textContent = '刷新列表中...';

            try {
                showBatchShareStatus('正在刷新文件列表...', '#4285f4');

                progressWrap.style.display = 'none';
                const exportBtn = batchShareContainer.querySelector('#batch-share-export-btn');
                const copyAllBtn = batchShareContainer.querySelector('#batch-share-copy-all-btn');
                if (exportBtn) exportBtn.style.display = 'none';
                if (copyAllBtn) copyAllBtn.style.display = 'none';

                const files = await getSelectedFiles();
                if (files.length === 0) {
                    showBatchShareStatus('请先选择要分享的文件', '#f44336');

                    const container = batchShareContainer.querySelector('#batch-share-file-list-container');
                    container.innerHTML = '';
                    results = [];
                    fileListDiv.style.display = 'none';
                    fileCountSpan.textContent = '';
                } else {
                    const currentFiles = JSON.stringify(files.map(f => ({id: f.id, fileName: f.fileName})));
                    const previousFiles = JSON.stringify(results.map(r => ({id: r.id, fileName: r.fileName})));

                    if (!isSharing) {
                        if (currentFiles !== previousFiles) {
                            results = [];
                            showFileList(files, true);
                        } else {
                            showFileList(files, false);
                        }
                    }
                }
            } catch (error) {
                console.error('刷新文件列表失败:', error);
                showBatchShareStatus('刷新文件列表失败: ' + (error.message || '未知错误'), '#f44336');
            } finally {
                const statusDisplay = batchShareContainer.querySelector('#batch-share-status-display');
                if (statusDisplay) {
                    statusDisplay.style.display = 'none';
                }

                refreshBtn.disabled = false;
                refreshBtn.classList.remove('batch-share-btn-disabled');
                refreshBtn.textContent = '刷新列表';
            }
        };

        toggleBtn.onclick = function() {
            if (isSharing) {
                if (confirm('确定要取消分享吗？')) {
                    isCancelling = true;
                    showBatchShareStatus('正在取消分享...', '#f44336');

                    const container = batchShareContainer.querySelector('#batch-share-file-list-container');
                    const fileItems = container.querySelectorAll('.batch-result-item');
                    fileItems.forEach((fileItem) => {
                        const titleDiv = fileItem.querySelector('.batch-result-item-title');
                        const detailsDiv = fileItem.querySelector('.batch-result-item-details');
                        const actionsDiv = fileItem.querySelector('.batch-result-item-actions');

                        if (titleDiv.innerHTML.includes('svg')) {
                            fileItem.className = 'batch-result-item compact-layout error';
                            titleDiv.innerHTML = `
                                <span class="batch-share-file-type">${titleDiv.querySelector('span:nth-child(2)').textContent}</span>
                                <span class="batch-share-file-name" title="${titleDiv.querySelector('span:last-child').textContent}">${titleDiv.querySelector('span:last-child').textContent}</span>
                            `;
                            detailsDiv.innerHTML = `
                                <span class="file-size">${detailsDiv.querySelector('span').textContent.split(': ')[1]}</span>
                                <span class="batch-share-status-cancelled">已取消</span>
                            `;
                            actionsDiv.innerHTML = '<span class="batch-share-error-msg">已取消</span>';
                        }
                    });

                    setTimeout(() => {
                        isSharing = false;
                        toggleBtn.textContent = '开始分享';
                        toggleBtn.disabled = false;
                        toggleBtn.classList.remove('batch-share-btn-disabled');

                        const statusDisplay = batchShareContainer.querySelector('#batch-share-status-display');
                        if (statusDisplay) {
                            statusDisplay.style.display = 'none';
                        }

                        const exportBtn = batchShareContainer.querySelector('#batch-share-export-btn');
                        const copyAllBtn = batchShareContainer.querySelector('#batch-share-copy-all-btn');

                        if (results.length > 0) {
                            if (exportBtn) exportBtn.style.display = 'inline-block';
                            if (copyAllBtn) copyAllBtn.style.display = 'inline-block';
                            const stats = `成功: ${successCount} | 失败: ${failedCount}`;
                            showBatchShareStatus('分享已取消', '#ff9800', stats);
                        } else {
                            showBatchShareStatus('分享已取消', '#f44336');
                        }
                        updateProgress();
                    }, 500);
                }
            } else {
                batchShare();
            }
        };

        exportBtn.onclick = function() {
            if (!results.length) {
                alert('没有分享结果可导出');
                return;
            }

            const csvContent = [
                ['标题', '链接', '大小', '状态', '信息'],
                ...results.map(result => [
                    result.fileName,
                    result.success ? `${result.shareLink}${result.extractCode ? `?password=${result.extractCode}` : ''}` : '',
                    result.fileSize ? formatFileSize(result.fileSize) : '-',
                    result.success ? '成功' : (result.msg === '已取消' ? '已取消' : '失败'),
                    result.success ? '分享成功' : (result.msg === '已取消' ? '分享已取消' : result.msg)
                ])
            ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            link.setAttribute('download', `115分享结果_${year}-${month}-${day}_${hours}-${minutes}-${seconds}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showBatchShareStatus('结果已导出为CSV文件', '#4caf50');
        };

        const copyAllBtn = batchShareContainer.querySelector('#batch-share-copy-all-btn');
        if (copyAllBtn) {
            copyAllBtn.onclick = function() {
                if (!results.length) {
                    alert('没有分享结果可复制');
                    return;
                }

                const successfulResults = results.filter(result => result.success);
                if (successfulResults.length === 0) {
                    alert('没有成功的分享结果可复制');
                    return;
                }

                const copyText = successfulResults.map(result => {
                    const fullLink = `${result.shareLink}${result.extractCode ? `?password=${result.extractCode}` : ''}`;
                    return `${result.fileName}\n${fullLink}`;
                }).join('\n\n');

                navigator.clipboard.writeText(copyText).then(() => {
                    const originalText = copyAllBtn.textContent;
                    copyAllBtn.textContent = '已复制';
                    copyAllBtn.classList.add('copied');
                    setTimeout(() => {
                        copyAllBtn.textContent = originalText;
                        copyAllBtn.classList.remove('copied');
                    }, 1000);
                    showBatchShareStatus(`已复制 ${successfulResults.length} 个分享链接`, '#4caf50');
                }).catch(() => {
                    alert('复制失败');
                });
            };
        }

        setupFileSelectionWatcher();
    }

    const originalSetPosition = windowDrag.setPosition;
    windowDrag.setPosition = function(x, y) {
        if (typeof y === 'number' && y < 0) y = 0;
        return originalSetPosition.call(this, x, y);
    };

    setupMaximizeButton();
    setupProTagEdit();
})();
