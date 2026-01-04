// ==UserScript==
// @name         中国电信网上大学知识中心自动挂课
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  鼠标移动到左上角图标点击开始，开启无人值守自动挂课模式！增加对活动中的专题班支持！增加2.1倍数（最大2.2，可能报异常）！  参考：HuangDingYun v.0.5
// @author       zsa
// @match        https://kc.zhixueyun.com/*
// @match        https://cms.myctu.cn/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowNEFBOTAwQTE5NkFFNDExODk0QkRFMzgwMkFFMjQ5OSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyMTQ0QzZENEI0RkYxMUVBQUVGQUE5RkZCRTgwNUYxOCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyMTQ0QzZEM0I0RkYxMUVBQUVGQUE5RkZCRTgwNUYxOCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ1NDdCQURBNkIwMDExRTRBQUJEQUJGQUZFQUI3QzRFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjQ1NDdCQURCNkIwMDExRTRBQUJEQUJGQUZFQUI3QzRFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+fYqR6QAAImxJREFUeNrsfQl8U1X2/3lL1iZtGtpS6MJqgcqAiIiyKLIpKoiKMLKvssmmjoIouDKg44ooAoLsI4yKCypiURY7oiIyH4QK1AIFWrqlzf7ytv+5L2kpW5ukLwV+/5zP55KkJO/de79nv+feR8myDFH6v0t0dAqiAEcpCnCUogBHKQpwlKIARykKcJSiAEcBjlIU4ChFAY5SFOAoRQGOUhTgKEUB/v+V2Gups/ld/h6R65p+2Gg4ViG2zimX2t6UyGSb7h6WW9P307L/fc3MGXW1L/hHClRh2/qUPQVCz+xC4bajFVKmS4IuElCgkaT9/7xF/2jTB0dm/18A+aoEOFKgxv6wUbfjtK/fl8f5Bw6XS+0olmrf2MJAchwLeh0NMkPBiQIf5BVyOS/fYpieOWTU9msd5KsC4EgBWjXI7esTNuf6Rm1FYO0idGnSgIUUKwuyloazAgWnvABnORnsAkCGiYJGbh/8dZrLebWrYWLLh0btupZBviIARxrQSmK+22BdneOd8sVxfhCtodu3aaQBk5mF0wjqUTdAgVcGjwRAZoAhk0Gh6sYPrWIoSEWQC856Dy7pETM86b6RB2q719UKtKoA1xdwtVH8ro30mhzvpA1HfOMpDd3hbylagBgGDrsRWBdKqogDJx4m5X+9kHickusQ5MQKL/gcfPaHvU33Q9/hRdciyCEDfLWAeDnK+WhNrzcPeOYU+6DXDek6oE0a+B1BPYbNJ/lBDSY2RG0NrY0U6Io8kK4RNy14btKQUPpxtYAdNMBXO7DarA2WV39zP7f9FH9vZiNdC2uiFg6gxB52SsAjsBr60tJaExGv+noDqvF8V86DTZj1w6dPeCnc/lUCXtM8RoIpagX4ageW0OGPVvf656/ulyWW7vy3JgbIk2nYVyGDW5RBg4aVCvO6im1GzzqTFsCe7z7yr67GCdcNGb2rvsalBuCXBfhaAJbQurdXPLPxqG9s21RdM51VBz8isMR50hBVTNX9+hJOjxm97VQnB7Ee7of1d8Xd7eo5zHOlxhsq6NdUJus8+nZ90pxsx5I/8/jMLq2MzY6hH/xbkaQAoqOqiWAdidhrBxpvG9pyp93XY8kB5+zRAPOvppCyJtCvyVz0mU/XdBy+rfzLszw1qH2rmMydXhp+tklEHSHHIqqyuo3GVsLjZCXo4dO/+L8Xb/mw7bWSGLrmAN63btWAyVn2DQkWbSdLihG+LEXA3TJoFXsTkNoINBHteSnDAGfQZLyz3zX7Wpmvawrgbcs/GP9stvPNNumGjIo4HWwvkcAnSmhvI4hsoFHY3IIMYpwWfiqWbvtj/Qd9ogCrSJuXLH/8zf3uZ25oEdPsCKtRVDKDk05DxLGtajIaeAfNgGTWpa086H70Wpi3a8LJ2vD2sqfX/+EZ36Glqcl+gYF8t+h3pGQqQnckiPrTXNX9NCLFPp8IooGFA2e5jqvfXD7PGqMpOeOS08o52ergZbNHkGPQJ9OJxHQHBAgvI2G0JWEszhlZymXWUI54HVWWZKQKGxnp/FQTfSIlhs6HPkOL1B7JVR8mbXgLwc3xjm97nanZrz4GijySkrSIJMkkdibzIuEEIVIkU0IJGBPjexY/6jH+0jP+5InVAGDAmEyHH3QoLhpEksV2YYgmBew4j82Lqt7Ly+Dx+V8FJV6HffFaqqypic69vgFz4IYE9pc28cyBitsfFuoSPl3VAG9evOzxVX94pma29INbxklKqlFlHq+SVAIqRRLROPE0vmokksKmIE5Pg8VIQyw2I75nEQ0K/y6ICCgiThAgixbYPSUdSi5B+KL6zJLFDMIQGFIjgyBTBF716D8w+BtRkMCN8XuZS4QSJ77Hi5lZyL4+nvn99sbs9q6NND/4eg0tv6IA63dsMBd55EYoZcklHjmpjJMT7D7Z4varLW31O+EcCajpXCZUV3Faqtyqp0sS9FRRooEuxNezm3Oco9/63fV0RnNzs994BmwEXJVxJa6TAioCSuH1GUQmBkWvQQwNSWYGLNi0OgZ4/FsFglmGSJb5AMrxFXEATvCHUXoE+UJAa7m1oruRRxTAjYh+LHJuAw1AIoYDVhyoHq/rQVN0ulyEggoBJ0/e1ymJzR7YXPvvZg+OyI44wGTx/M9yMfN/pULHQ2VSu5NOsXkpBwleSe5M1t0wogAtjkCDHWdxEMwFOktCrhUkv8ricbKImpKVxQBZ4fbjOIvxKDFOPQtl+HcGOUJm/OqzcpL8MyqHLK3KO5QYCsWO4WQwYz+TY1loFM9CjAlDIZqGEgTxNEpUEQeA84vSKV9okBEkHCd22qSRw8qayfI5H67y8uQyBHQLzlsjPUC6noJEBufII0JeMQ+FFWJOMxOVOzRDt6LT8FFbVAVYk7XB8mMB33PnGaHPIZvYzilAF1IJYUWOJ2CYUOdoCBA4WsQMeOwuUVeE0cULsCATQtQtSSmS5ASrqDF0YniUEoxrJYkCm1eCChQVJ4LgRBXgxb4K+EMZuVwmP0RgZKo62LXbVSKplFtCCQFoaGIhNUEDMagL7QjXCS/ASY8MNp/f/lZxErkHJV+U06bINZExDahjif1Va+W1EnCiFQg/m3CcaWjrWxlRyrFjBaU8/HnWdyTNSOU90cHwAikvuhzAQWm9k5+s7fxJru/hn79xdOMpqmMjCwut0nRgMCC3Yw9siN4ZBMaG6svuBiXJ77dFstJRCS4ePEWdU1UK0Ip9okESKYjVBppRhvREtFdEmSKXeBDwMocIxdhs2Dzk2qjWZFJuw/oZyx8Sy+fUMLkR6QSqO0BgyWSloy5MTWCBwXuUYEfzHRy40JHCq0Aqfj1d62dOt0SjakYtItPoZ+H1A9xU2XciHOQ90UBaWlXroWgxJsBRHpzPww7SKEjAvrXFWLxHoibjjxPejNd+dcBigLvC9qJfWbT8vV2FUp9UC9OiWZIGNOg+FiEIJ1F9FVapL/+cVg68qlHnOnw5Tq3+3uEjkk75QQnoKzJIYqOsCGRDHUAyghKPKotBwO1OEQpRlZ9FsJ2iBCLRHvoA2HgNiah9ZAqDV4AktJPtkmi4JVmemmqUT+jxf/AnLAlb0P6V6xnKgz+r8lhRiHXEd6jgpTgbDwn5HDT52cl02+bUDywXWGVwNJFqRYr9apqlVEl/10hiQCMm4DhbygJIhfbszXfH9bYadZ6QAS7/bFXrkVnuz7plmjMcGgZyXDLk42WcZOICXEZTAHV1bAmeHoECDhmHZvwDqA78hV1EMCAJOTnNQEEqKdZAO+hAsE+XoI3CVyd+h0MmSJAEaKETd92bDp/clMRkNzax+RadxmbvPZYLp5/mbSt0+21c5y9KqEEbbYaxhbwmhnAggw6FgfY7W/VVASXipMXjfRuW2GFjX3OjpvGGwpBV9FEb31pk6IzdbgryvP7iJSJRmsuJYZjg+ogWwFYFrny+urqQgbzIYCfRFJx0+1UkUVvNjGhPm2kB3XZwFFbsbWsW9vdLZ7a0T9L9It4zsazyt/Y69NVx53iuJcCuWdgGb1qyemUhPW1DmXGUC70/Hs2ATobIi3C1FCTBgphCp0+MxY+hA3y8QmjhxVl3on1lA/ZGbSLeNJFeoglEuZorWVt+lTrniRZzFBSjdimhHEWjLe6l997Mbk4YPOugwukRmuCUwVP3Lc76YGyf084v55zUL8n1aJIMxHRQ9QeyjCaCCAQnyoawUpWnHFITjOrPdVjljpO5cPN+5wX9mHPqLYT7kN8a0SV62OxcOzZFXpw2bMYv9ZWIKeo1TroF4D9rNr13Ysqf0sZDPm0Li0aG+qxTJSa2JrNQo+9X4pEaEpYUZfXXWJW8biAGJiGIJIX2eyL5Ev62ncadu7aJ4/63O+hHpw2b9gtcAUobPPmXxa2Eka20vjyvCKrPVa0t3NUkkjxXYk1J/bVWApAXpZei/VFMaL+l0GRIMCbesf6jNkKfTmOmbSntM166kmnVpoMnZ89pIsw1U6JDlOoHZAonjsT2GDeIIQMcl7WadQtSjBJLRkB6OV4OZG/kkK5PGCMGo5lX0xyPvdNWMzLmgcl5V8uqV/eRkzeOSOKXCZJcP0uYJMOHjK5jwBeyDSYLHKJE3aZkbINQBaF4zSRJ7xOJ9PoBC9Z3E9HeWhhBerWJe+KdY6euKL0KlzaHpbIrttvEe455mdZaKnLWWMk54ORpKYzBtYw9LBUty5HhRC9fLb4NtmQG1bIBfeJ/pnumEnDrMjnWH9fQ7K73rOZdq3RqT7xlwPicPlZ5qxhhKVZ4R5DASMt7zVq6IiyAI+FY8YJ/geEcA9XeiE3Topl5Ls0z555xU5aG7XHufifp1Z23vtcdHjncrWhk6S3ZD+Y+tbzZxyXfvqhqEV3vBPrLBEZSsk4RqSyprCTgJUCvvczVd4wnZBVNXCuaeFcquy4koQFU8Dk9cnvSj9lpngUPT5yyMNz76nYvN/eX5mTtpw63NVFGvL8PeK4i5VjxNw/sdB7o8/X2d2+O7zM7R40xto/X7Gtu4Pb+Ypc7MxEqTiBZRMknQrIJToflRWtoitfSchYxkpSa0isFL71KjIdi8EhD74rxU6bMrcuEbBMPDNxPFbSNh1Tk6gY48DhgqTiIZRrBGZ/DvKFox3i1Jt/be5SjnRn2yVLkPGiSeJI5HpqYmbywAC7rOUoyMrKL6EcqRHt5OY+Pq0wyB+sxozPWM47LntdK81RdJ90m+awUWLEbcdgdC7ZYbDH4maSTLWDjffFqSthNFipbR8l1n7fLNCWzyPPQMp6tUevUmMmyaMFGVmPoOuZYFc9ZkhXvmeQkg3HIiVPVWMs7FrSipgv9xpfV2euU9TgEArBO4Wt/TaZPmQL0RYG4cGpSCxN7xED5yAqlok5V9aBxDjGYAL0sQEYD86GwAU4wUCWSQ1TWSesaJvl42b+eGsR1yFcYnPbZTYVnGz84ZZ8qKT0EVoJ4BUxQRkRA9oC/3ECnNFVtJE0JinokalrlHD4TcGYaasU9TeL1xyrCBbgxKeXkBQym6wYwiXX5QHlCMNtVyaJ//0R++5jmhsU2tXK2oKUlmUgwya3TASvgwn/IFPD4/3pVBU1SEkzqx8HkiizOo+jioJWFPlTRe4wQtgSnx7F5tMABW1WPFHqHCfOSfLNUuUpUy6BJMiOOFeAfLennbL3GhOzDG/esjflZsnUjd+lKW3+wdxvuX/uVtRgXWEAp3ZNQPWPYJcl2UvtDAkpkwvNrMoq/W9I2n3c2z9BZ/jD1nJgbzririq5UXqLRYVQhuTm4qY02u7Zv1whwkzjtMb3kAo44WspyT3hLRj6l+pCqdcBygPVHp4nvNn1oSnaot9r+/RtjX/D+99UT4LKSz60hNn/pzqVDm98+aQ8tazEwjVVsL1AIsMgh4EZ/zQ+I2DWtPwmyZz098+RPK1cf2TKKR+cjRqOHIZtnrf1X8o0Tnd1HBL1tlENjL0jVHCOViCYFjCgxRtmX1ykl7r91Ajg1TnsinpX2FfJCR5rV4NzL4agqpeBbca4kudbvNtaJjgnNtW+Fep9Psl6fNZM78jqNmtEAscrfckBM6y8c2r12x7v3GXiPC2Qj+Gs2EWDBgA3tLqMl1e1gBINLylqZfNcf27/c4yroqNUaQE+xShHgytLcEXk+X8bnu9d3sXUfFpRWKfJKyaTAXY2Kl+oCQDa0Sw4OWpqlnNiHphyplSFq+k/PneNc6SbIkzyCspAth7phi/JX7UtykKERfndkirwsdsD4I6EMvPSHlZlz3KdfZ3kD6Hj0lnmt0gz42c2zMML112crfbblWvxc+X+ygE3UYGOBlvTwq718Ut//fVewx1bcUQcmoBB8WdAALepQJZrh+4rizguLjr0cbJ/+tEttfaJ/66ma8S+JBXiHB7qn6rKCkvjavpCZwB4QUd9rwtl3S+qeBekc+9WSjrRoJGlQmnZtqJy9ylU61eOjgCWgkYK4QCPvNQiSl2fgJ8EHNL5X/o8PNJFRPrOSFvaW2+CI04VgYrjEM+e+p1yLAQqZYE1JwSTTzrVBxVMHyoSOoHKiQ6lAxdjXKHjz72hu3hZMP2otm+2QrP+FPuxQCstCtSeBfPi5zFXN3hXcmyL9J+n+8QdCBfiQx9cOiFRepqaITIy2etcZVNG8vxF7TMkMaJScInG+GL+hkwKvIq28ksL9QkG0nPB6mjXAW9Y4qVnrrHlZFS3ZylyrSupZp6GAL+fgRgv8L+HhaQdVAbhtQ+N+K11+qMInZDIMq9jhoGwKqbEiPIHAUbRca76ZpDJvT2S3hzP4FJHNB44J/lAOsu3Ch40nR+8QMGn/35RG+6v/qr+SsAS/F4vjt1JMSW2X33HG1+8vu5SpodSroyUj06P37LW74K7Oxi1BO2W1fqP/I0UZFjgkOjnQUsGnGUn+WkSEqxznGhfxZWikl+HmBM2ecAb/qDF2USLHcJwHJdAbZOMCAPswXMVX2VfZmPNfORpE/K7sluGRuMQ3qL7jat3i+e0p7h43L6uSw6/MybOkqB9NZUOay7kzI/5z9QBG6pKq3yW4vKjmQqybEqutb9XiXLUxQXaLWM2RcABu2H/ygU8bxN+ewdOnfR4/KFBroxRwlcbR1d5T5/1N8KL0YnD0j6TkN6Y98vxjtfXF/tWajN0Fvj5k56CqzhVqQa/NBb2aar6GAZOKVAW4W1NTllHk8lleUDZcKTo1iCZW7luR5Frb3yzUvrIeI8K2WOmDZuz9Ks166+0U8wvvwlDCi0DX0AiAMjpm5zWOqpJa8pl3o93Dz+80T50+7dEXHwumHx/lekblVYgJyrESKoGr1KJzPtBzrsKH2llXhxQ3B/Ml65BHD7WOkw8KDq8Sh8lBHXfgr3qsCnAvW6kBYGQl6NGQ/a6udkp739T8LS0bdB9hZDcJLiJ5ODPeyzRFUqs17vxXwYVmAzSuTe2b3ztg4rOLg7l//mdrOi0/5J1B9sWpqZ7JXmJPmRO6NqazGg6beUB1gAn1bGrY5rO7MQ6Tgu5YUGu+CH6yDqCNRXNADWfEcfdEblVmwsPPJmoWyKhaeVTZBFD5wsZRF0twoAlOCdobjblbu2XccsPoJ7cGc1/Tzg2GZ392vFloF2N0lepZqntDHx+0GBrRLkfZiBsbLAs58xXsF/tkWD6Pk7kTDMcH9vrWXlciK2WdUKv9bainDiQZ2UK10nlneo+XJkz9x9zlLfQTTD6Mxd3UpW0wTxpUSbGEfxMdEtzTyJK1tU/mLQlDZh4M9p4L9zte3nHC14U44pRKtWzkMga8nqfUAV0aUT9cN/6JXREDOGbQ1LxOyfQeb4UblIXsWjhPDrRgOLmpkcp13DGCA5Wp7/jHVnzS3tg7nYYywUUSxIHmDYBaCS4CLXLYX7cEU9omL9vU7/q+0oDJJcHe56P3lj/52q/OWSRspuTKk39UqNogJwD4fEA7HWUTbk58K5w5CKli6L7MuE2y0wk6Say2WnLpEClYNU68sPZWeh9EiFqPmJH11a2mW282wUHB6VfNVfaWSLBAbLUELL5/pXuzObNfXjQxlCL6L1asmDJ7T8UiUVGn/op+Zf28jqqZCAfZNusstkOvJszWluP/sSviAPe8rsFXLU3iXtHuAR1NBVVWK9fiiOlwEK0s7EGIIMUOevTIF7fHdXmwMWwV0TMW0PkSUJJFL8bqDhGsGo2wbkCbIX9/+oWQivo+XLzs+Vk7K5aIMgTA9TM3U8n8ddDP5PgLxu0FI+conNK10Wthrz6F8uWKPuOE+9uYNnpsdsXZouRaQqDA9orL/T9JcBixB8lG5jREmLh7JznW9Ygf+HpH5oku8dL+JhioXmeNKfz7DcmffD3ihpu7TJu7KdhrGb7fEDP/xXfXzdtdMY8shWroSrsrBWpFzmmy8Bo6bfhPxVkbDLne8GHS8FlhO6AhH8JCf7E0YcCHR3dXmBNaewwG8AnSJVOXBEM72fpPM5dd4yd56lQTwI4B8U31d48+AfVEDb5dxpZ7+FgNQ/Peeyc7QnLgtqzpOPMH2wc/neLa0+Q4pcrlwMAGK1I2YNbVrZjDoEXfudwOib7SQ1vGZXYX+0+usSZN1dNmpf6TSu5vbdzoKrWDkbq8l1zJjXItq01mFiBOS5dBPVJp30cE8b6pZaGC+90HH4wdsKVo90/53vYMGzgPpPqivuR3jOriOZMIRc/70HMu8zzWPfH52sBVVUVX0vBOjZYl0d5c2elRbMUlQazc0yTVHDcjwAf1LH3FDtgOhoRv16fMfe6dj8Z+XfJBkVM0MCxVo+dbF8/ZhAa8vLAU+jVnPun6+LxazUZtB4SHBTAzcErhkLYxHzqLy1GKJeUilHx+qzyokaq+qfsSDbUZV9FjuHC1gvvj6pWD7/m48L9rf3cOJuqYqSHHTAccrLAK3ok/gsact1VAQ8qZO/fOZnPqCm7YABMafUvKu2k67yGhwgV6hr5IiqnAgGvcGRFIYVp3rrvqTr3N/c/qbk8+s/jjUV8Wf3T4rC+NYSEwnss3/xNdwguLyHq0lvOCu7jU83Sv5Kd1g6bn1xXcoNaDL7s+j7Zh/IL5i+ftsL0XH6MHDujzF/UDRyCdq2q4zHUkuSNxRAMpiCtKsbs26n487e2xdL/98axNBX3cXv9zeBimtnpu/7rvOfUcop2kafSaRSg+XQyj2xmWdXl8/ia1xkTXhUOG3Zy+rEOCuMtVUgFGlrpEHpUs+Es1ci45bZWX5Ct6rLHn63VNti5dPqnfpoK9AzYXfPPFYWcfNy8BsbVVMW2NzlFlgiO8hXwzsnd5QQl0asDvmnt3hiqquc4STMjWe5z0xPsL54/elP85azaYNaweeEGsMrkM5a/UqOL+S3B2GUoJObAUx+iqT1CtuzfSu055+3xx1DVoy7rTDxdUCDHKhBNQ2WpH+ARN8rkjFUP4WQyGRN6ScmggVpx45YHWE139JqrqcKry3KQ3pz/x5ppD4gxrk0ZQ4Tv/1Bc7JwLZ/ALUxXuSSAbIhCz23ZCkGxvdP2Z/fQBb8eXajE//dA778pjrgV/PcG0l5XFotFJ+Fe4xUZW77WN1lFJ5IQfHD2DUsSTPDN6iQsf7g9OHtJ8+72s1pbfOElxJj/dp/sKevIO9Ckor2hqtFnBxYtXANcqRDeho0RcXzhOV5kKGOGUXkDUgYgCTp49+let+4IsjzkHZa/LvKLOTWtmAtGqp81VwqPo18OJfZKi99ruS9FoWWI8LbAWFwkt3JT4ZDLjhEBsMx9QmxWL/KWXPLn7pyQmbT23WG3UxWlTVvoCqJmk8D3m23CUK0MjEiOhh5ZTybTsBbFFzYMK2dSl7z3i7fnXU9eCOlSf7nS4XzIrdJ6BqqPNDt7pSIDwK9kgOnYYBnc8DxfkF0qxucQvumf/PoE4tCOdJaKo5N+2nPfP1mFlPLHl/X9GTiU1TQCAV+JL/hHayf09UpPgSW0fxD0dtvtaqcGvWBuuuk+7e3+a67v32w/z+p8p5i2IHWHIGpv+U9tBta81qlgqcQsQw/k3uci1bc/QIrkHg4OzJMzC+o2HxmH+9Nj9S4KoKMKEn78qY9/up/Tf/VlDcI7ZxEjpP/r9rEVjilVKX2Sn7l03IqMt9NTs2WJbvK5+17sOT444UcSlK+pDxH2xK0SqDepH99atlDVt7iGRAtaxDcAtPnoZRN+iXzljy9sxI+xy0mtzjuPMRbtH91022SvZ8b2k5xCC3ksFrmUpv+hJpS5z/fLvQjNm+1hrOAA5uWHln/3X5P877pmjekbNcColZyTMVyCnztHxxhk3VVmV7/Q/BBOnS31McKpwLLeeGs8fzYcwN+ncXDekwNdgx1uUhlapnkCxDH8tZOCB9slBW7AKHAww4MCK3pE5JFi/OapEzl0/ahITfznKdQ72Xbsd684s7ihb9mufOZLXkaSfqFbvVfHTgua0kZEzkPCyauvwxgybkcNrthOKTp2DqLaZXHn//naklPcfVy8l8EUkRdpgxb+uc3olz0UOUtJzH71QQGyhJF1VYEikTMVTJynP3C/U+XM9hjlQTdQLqmOAPGVxJPhffk2OEGeqS9pamyMn1NPDlNrAXnOae7d3gqcmL334qFMmt6yNm6UipiYEvLHxrcmfzv4rQmdDznBLQk+oNSZQu3nGHvfjxpKdXOAMYlGlcq9f6F63q6/hAfwTgt73kISIa2n+eZ/UqFi1DQyxLMlRngbGfLVn8YNrIwQtfe6U+1HLEJbiSJr31xlPD2umWFZ44DQbRBxaDRjlbUb5gAYJsD8op9mWWfLoq5APJ7rwu9ou+LbTblIRFPanmKukVRTBULgAH1r6pQHbKIHJQkJcPGXr7/o3j2tzVdfbLm+ob3JABDufGi4a0nzqojWZtwfFTECP7wGok2zrFqtIU0ogD6nCLsCc/dCm23zGKe7Jb/PxUC1Uu8PL58a2aDfzSS1VKL7G9tP/RQZW+oyK16AvwtjIoOn4ChrZlVmyeclPvlHFP74MrRBFfprP1niC8ObTD2MGZmtVn8k5BLPgg3sCCFAD5nIQAfJbjHBzOPdIfnrL3pV5xM81aGQQhyP1QYdpdJZ2paCBJeaSdEgOjijaj/dH4PIqXHMcVn3j7wZSRT69aOkG4b1pZKAKkpvTWC8CEyvsiyMM7jh3TQf8ukeRYyQMWPXOeV01i1uzjni4nNq/sHM49ek57bPWC3rHTybH6gqByzCtXzznLCnMij4IO3XYj8S3Q/DgKCoCuKCyacFPMG59P79j1jmcWro20dlRlsSHcBYjL0apZM59/c1fZMzEJSTSnM5GVpMDTeQF4ToIZt1nfffz5mVPDvf7Hi16Z9WyW/XUnh2GTimkcBVzlUT2iUlRnMTAgeDngnXZI0Pjy+raO/Xxk19Rl1qGzDoV67UiBe0UAJvTdi7PHzt966jW3xmJh4uLBJfmfWkLS13F6WvpuXJP2iQNHh10rvXPxa8PmZ1W8/leJlKTknunwDkKpnBkaVTCpuCCHs2lkAfQSB0bZA80t1K7u18VlPXBj8nrz4Om54fQ1kuCGDbAaIOe9/1KX2R8fefdACdve2CABBF2M/7GrXhGGdoz7z8LXnnioLtc/++932r+/1zZr0x/cKLsXzj2xrLZTb8iDrgKgsrQ/IwaiAILHAyzvgtYJ9MFbm5l23dG6wbYuLRt8771rgiPcPkYa3DoBrAbI9JbFCQs+/+PldfvsjwiGeDBarYDTqCwvbh6Weu8NIydsrcv1LVmr2B+Pl9+x/aj7nm+OcgMLnHITt+DfsloJZNXT2gLFCVTgaR8MSiot8aBDzz8lRj5yU7rhv52bxe3pkpHwvWnQo7l1nfj6ALfOAKsF9N5X5j6w8KvjL/9WRLc2JySAaDBDuxTjga0j02919hiqSoWDffM7GUeKPZn/O+3uePist+1ZhzDQgdqCFO5Lyi4LDHvQQbPqaUiL12xs1kCX29SqO5YcpzvTMjk2R3f/lHy1Jr2+wFUNYDXAZj572/r+d38+vnxP8YwCzhCjtVjhhYHN5w59ctoCtQcd8+0Kg4cTYryCaECAtZX2FuNYX4yOdZkN2nJbzzGq54rrE9iIAVxXoMvXLmq9NOvYrI9+tY0t9enZ5VM6Tbhz5owVcI3TlQA3ogDXFWzbmoWtV/2QO+WnfO6218Z2mZD28KRfouBepQDXBWx+8xuNSzmqYYvUxBxXj2GeKLBXOcBRql+io1MQBThKUYCjFAU4SlGAoxQFOEpRgKMUBTgKcJSiAEcpCnCUogBHKQpwlKIARykKcBTgKEUBjtK1R/9PgAEA58Xu9yONWQUAAAAASUVORK5CYII=
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/blueimp-md5@2.19.0/js/md5.min.js
// @grant        unsafeWindow
// @grant        GM_openInTab
// @grant        GM.openInTab
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_deleteValue
// @grant        GM.deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_addValueChangeListener
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464552/%E4%B8%AD%E5%9B%BD%E7%94%B5%E4%BF%A1%E7%BD%91%E4%B8%8A%E5%A4%A7%E5%AD%A6%E7%9F%A5%E8%AF%86%E4%B8%AD%E5%BF%83%E8%87%AA%E5%8A%A8%E6%8C%82%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/464552/%E4%B8%AD%E5%9B%BD%E7%94%B5%E4%BF%A1%E7%BD%91%E4%B8%8A%E5%A4%A7%E5%AD%A6%E7%9F%A5%E8%AF%86%E4%B8%AD%E5%BF%83%E8%87%AA%E5%8A%A8%E6%8C%82%E8%AF%BE.meta.js
// ==/UserScript==


(function(g) {
                        g.gooeymenu = function(h, q) {
							              var rt = g(h);
                            var k = rt.find('.gooey-menu-nav');
                            k.addClass("navimenu");
                            var b = this
                              , a = b.options = g.extend({}, g.gooeymenu.defaults, q);
                            b.els = {
                                item: k.find(".gooey-menu-item"),
                                checkbox: k.find(".gooey-menu-open"),
                                button: k.find(".gooey-open-button")
                            };
                            b.methods = {
                                setup: function() {
                                    var d = {
                                        small: 1.4,
                                        medium: 1.8,
                                        large: 2.1
                                    }, f = {
                                        small: 1.3,
                                        medium: 1.6,
                                        large: 2.1
                                    }, c;
                                    for (c in d)
                                        a.margin === c ? a.margin = d[c] : null;
                                    for (var e in f)
                                        a.bounceLength === e ? a.bounceLength = f[e] : null;
                                    b.methods.responsiveStyles();
                                    b.els.item.hover(function() {
                                        a.currentBg = b.els.item.css("background-color");
                                        g(this).css("background-color", a.hover)
                                    }, function() {
                                        g(this).css("background-color", a.currentBg)
                                    });
                                    !0 === a.bounce && b.methods.bounce()
                                },
                                setEvents: function() {
                                    ["open", "close"].forEach(function(d, b) {
                                        k.on(d, function() {
                                            a[d] && a[d].apply(this, arguments)
                                        })
                                    })
                                },
                                bounce: function() {
                                    if (!0 === a.bounce) {
                                        var d = b.els.item.css("transition-timing-function");
                                        b.els.checkbox.on("change", function() {
                                            g(this).is(":checked") ? b.els.item.css({
                                                "transition-timing-function": "cubic-bezier(0.8, 0.84, 0.44,  " + a.bounceLength + ")",
                                                "-o-transition-timing-function": "cubic-bezier(0.8, 0.84, 0.44,  " + a.bounceLength + ")",
                                                "-moz-transition-timing-function": "cubic-bezier(0.8, 0.84, 0.44,  " + a.bounceLength + ")",
                                                "-webkit-transition-timing-function": "cubic-bezier(0.8, 0.84, 0.44,  " + a.bounceLength + ")",
                                                "-ms-transition-timing-function": "cubic-bezier(0.8, 0.84, 0.44,  " + a.bounceLength + ")"
                                            }) : b.els.item.css({
                                                "transition-timing-function": d,
                                                "-moz-transition-timing-function": d,
                                                "-o-transition-timing-function": d,
                                                "-webkit-transition-timing-function": d
                                            })
                                        })
                                    }
                                },
								position: function(e) {
									var p = [[0,1],[3,2]],w = window.innerWidth, h = window.innerHeight, x = b.methods.getCss(e,"left"), y = b.methods.getCss(e,"top");
									return p[parseInt(x) < w / 2 ? 0 : 1][parseInt(y) < h / 2 ? 0 : 1];
								},
                                circle: function() {
                                    k.trigger("open");
									var pt = b.methods.position(rt[0]), rr = b.els.item.length < 3 ? 180 : 360;
                                    var d, f, c, e, m, h, n, r = b.els.item.length, l = a.transitionStep, q = Math.PI, t = rr / r, p = t = rr / r;
									p = (p + (pt * 90) + 180) % 360;
                                    f = a.circle.radius;
                                    b.els.item.each(function() {
                                        b.els.checkbox.is(":checked") ? (d = q * p / 180,
                                        c = Math.abs(Math.cos(d)),
                                        e = f * c,
                                        m = Math.sqrt(f * f - e * e),
                                        h = b.methods.periodCalc(p).x,
                                        n = b.methods.periodCalc(p).y,
                                        g(this).css({
                                            transform: "translate3d(" + h + e + "px," + n + m + "px,0)",
                                            "-o-transform": "translate3d(" + h + e + "px," + n + m + "px,0)",
                                            "-webkit-transform": "translate3d(" + h + e + "px," + n + m + "px,0)",
                                            "-moz-transform": "translate3d(" + h + e + "px," + n + m + "px,0)",
                                            "-ms-transform": "translate3d(" + h + e + "px," + n + m + "px,0)",
                                            "transition-duration": l + "ms",
                                            "-o-transition-duration": l + "ms",
                                            "-webkit-transition-duration": l + "ms",
                                            "-moz-transition-duration": l + "ms"
                                        }),
                                        p += t,
                                        l += a.transitionStep) : (b.els.item.css({
                                            transform: "translate3d(0, 0, 0)",
                                            "-moz-transform": "translate3d(0, 0, 0)",
                                            "-webkit-transform": "translate3d(0, 0, 0)",
                                            "-ms-transform": "translate3d(0, 0, 0)",
                                            "-o-transform": "translate3d(0, 0, 0)"
                                        }),
                                        p = 360 / r,
                                        l = a.transitionStep,
                                        k.trigger("close"))
                                    })
                                },
                                periodCalc: function(a) {
                                    return {
                                        x: 90 > a || 270 < a ? "" : "-",
                                        y: 180 < a ? "" : "-"
                                    }
                                },
                                linear: function(d) {
                                    k.trigger("open");
                                    var f = "horizontal" === a.style ? a.horizontal.menuItemPosition : a.vertical.menuItemPosition
                                      , c = d[f].init
                                      , e = a.transitionStep;
                                    b.els.item.each(function() {
                                        b.els.checkbox.is(":checked") ? "horizontal" === a.style ? (g(this).css({
                                            transform: "translate3d(" + c + "px, 0, 0)",
                                            "-ms-transform": "translate3d(" + c + "px, 0, 0)",
                                            "-o-transform": "translate3d(" + c + "px, 0, 0)",
                                            "-moz-transform": "translate3d(" + c + "px, 0, 0)",
                                            "-webkit-transform": "translate3d(" + c + "px, 0, 0)",
                                            "transition-duration": e + "ms",
                                            "-o-transition-duration": e + "ms",
                                            "-webkit-transition-duration": e + "ms",
                                            "-moz-transition-duration": e + "ms"
                                        }),
                                        c += d[f].init,
                                        e += a.transitionStep) : "vertical" === a.style && (g(this).css({
                                            "transition-duration": e + "ms",
                                            "-moz-transition-duration": e + "ms",
                                            "-o-transition-duration": e + "ms",
                                            "-webkit-transition-duration": e + "ms"
                                        }),
                                        "down" === a.vertical.direction ? g(this).css({
                                            transform: "translate3d(0, " + c + "px, 0)",
                                            "-moz-transform": "translate3d(0, " + c + "px, 0)",
                                            "-o-transform": "translate3d(0, " + c + "px, 0)",
                                            "-webkit-transform": "translate3d(0, " + c + "px, 0)",
                                            "-ms-transform": "translate3d(0, " + c + "px, 0)"
                                        }) : "up" === a.vertical.direction && g(this).css({
                                            transform: "translate3d(0,-" + c + "px, 0)",
                                            "-moz-transform": "translate3d(0,-" + c + "px, 0)",
                                            "-webkit-transform": "translate3d(0,-" + c + "px, 0)",
                                            "-o-transform": "translate3d(0,-" + c + "px, 0)",
                                            "-ms-transform": "translate3d(0,-" + c + "px, 0)"
                                        }),
                                        c += d[f].init,
                                        e += a.transitionStep) : (b.els.item.css({
                                            transform: "translate3d(0, 0, 0)",
                                            "-moz-transform": "translate3d(0, 0, 0)",
                                            "-webkit-transform": "translate3d(0, 0, 0)",
                                            "-ms-transform": "translate3d(0, 0, 0)",
                                            "-o-transform": "translate3d(0, 0, 0)"
                                        }),
                                        c = d[f].init,
                                        e = a.transitionStep,
                                        k.trigger("close"))
                                    })
                                },
                                translate: function() {
                                    var d = {
                                        glue: {
                                            init: a.size
                                        },
                                        spaced: {
                                            init: a.size * a.margin
                                        }
                                    };
                                    b.els.checkbox.on("change", function() {
                                        b._callbacks[a.style](d)
                                    })
                                },
                                createOn: function(a, b, c, e) {
                                    b = document.createElementNS("http://www.w3.org/2000/svg", b);
                                    for (var g in c)
                                        c.hasOwnProperty(g) && b.setAttribute(g, c[g]);
                                    e && b.appendChild(document.createTextNode(e));
                                    return a.appendChild(b)
                                },
                                responsiveStyles: function() {
                                    var d = 0 < window.innerWidth ? window.innerWidth : screen.width;
                                    320 <= d && 480 >= d ? (a.size /= 1.4,
                                    a.circle.radius /= 1.2) : 480 < d && 768 >= d ? a.size /= 1.2 : 780 < d && 1024 >= d && (a.circle.radius /= 1.2,
                                    a.size /= 1.1);
                                    b.els.item.css({
                                        width: a.size + "px",
                                        height: a.size + "px",
                                        color: a.contentColor,
                                        "background-color": a.bgColor,
                                        "line-height": a.size + "px"
                                    });
                                    b.els.button.css({
                                        width: a.size + "px",
                                        height: a.size + "px",
                                        "background-color": a.bgColor,
                                        "line-height": a.size + "px"
                                    });
                                    k.find(".burger").css({
                                        "font-size": ".8em",
                                        width: a.size / 2 + "px",
                                        height: "3px",
                                        left: a.size / 4 + "px"
                                    })
                                },
								getCss: function(e,a) {
                                  return e.currentStyle?e.currentStyle[a]:document.defaultView.getComputedStyle(e,!1)[a];
                                },
                                openMove: function(){
                                  var drags={down:!1,x:0,y:0,winWid:0,winHei:0,clientX:0,clientY:0};
                                  g(b.els.button).on('mousedown', function(e) {
                                    drags.down=!0,
                                    drags.clientX=e.clientX,
                                    drags.clientY=e.clientY,
                                    drags.x=b.methods.getCss(rt[0],"left"),
                                    drags.y=b.methods.getCss(rt[0],"top"),
                                    drags.winHei=$(window).height(),
                                    drags.winWid=$(window).width(),
                                    g(document).on("mousemove",function(e){
                                      if(drags.winWid>640&& e.clientX>=80 && e.clientX <= drags.winWid-90)  //50px
                                        rt[0].style.left=parseInt(drags.x)+ (e.clientX-drags.clientX) +"px";

                                      if(e.clientY >= 100 && e.clientY <= drags.winHei-80)//导航高度
                                        rt[0].style.top=parseInt(drags.y)+ (e.clientY-drags.clientY) +"px";
                                    })
                                  });
                                  g(document).on("mouseup",function(){drags.down==!0 && (drags.down=!1,g(document).off("mousemove"))});
                                },
                                openHover: function(){
                                  let tt;
                                  g(b.els.button).hover(function(){
                                    clearTimeout(tt);
                                    g(b.els.checkbox).prop("checked", true).change();
                                  },function(){
                                    tt = setTimeout(()=>{
                                      g(b.els.checkbox).prop("checked", false).change();
                                    },200);
                                  });
                                  g(b.els.item).hover(function(){
                                    clearTimeout(tt);
                                    g(b.els.checkbox).prop("checked", true).change();
                                  },function(){
                                    tt = setTimeout(()=>{
                                      g(b.els.checkbox).prop("checked", false).change();
                                    },200)
                                  });
                              }
                            };
                            b._callbacks = {
                                vertical: b.methods.linear,
                                horizontal: b.methods.linear,
                                circle: b.methods.circle
                            };
                            b.init = function() {
                                var a = document.createElementNS("http://www.w3.org/2000/svg", "svg")
                                  , f = g(".navimenu").index(k);
                                a.setAttribute("id", "gooeySVG" + f);
                                a.setAttribute("class", "gooeySVG");
                                k.append(a);
                                a = document.getElementById("gooeySVG" + f);
                                b.methods.createOn(a, "defs", {
                                    id: "defs" + f
                                });
                                a = document.getElementById("defs" + f);
                                b.methods.createOn(a, "filter", {
                                    id: "goo-shadow" + f,
                                    overflow: "hidden"
                                });
                                var c = document.getElementById("goo-shadow" + f);
                                b.methods.createOn(c, "feGaussianBlur", {
                                    "in": "SourceGraphic",
                                    result: "blur",
                                    stdDeviation: "10"
                                });
                                b.methods.createOn(c, "feColorMatrix", {
                                    "in": "blur",
                                    mode: "matrix",
                                    values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8",
                                    result: "goo"
                                });
                                b.methods.createOn(c, "feGaussianBlur", {
                                    "in": "goo",
                                    stdDeviation: "2",
                                    result: "shadow"
                                });
                                b.methods.createOn(c, "feColorMatrix", {
                                    "in": "shadow",
                                    mode: "matrix",
                                    values: "0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0 0",
                                    result: "shadow"
                                });
                                b.methods.createOn(c, "feOffset", {
                                    "in": "shadow",
                                    dx: "1",
                                    dy: "1",
                                    result: "shadow"
                                });
                                b.methods.createOn(c, "feComposite", {
                                    in2: "shadow",
                                    "in": "goo",
                                    result: "goo"
                                });
                                b.methods.createOn(c, "feComposite", {
                                    in2: "goo",
                                    "in": "SourceGraphic",
                                    result: "mix"
                                });
                                b.methods.createOn(a, "filter", {
                                    id: "goo" + f
                                });
                                a = document.getElementById("goo" + f);
                                b.methods.createOn(a, "feGaussianBlur", {
                                    "in": "SourceGraphic",
                                    result: "blur",
                                    stdDeviation: "10"
                                });
                                b.methods.createOn(a, "feColorMatrix", {
                                    "in": "blur",
                                    mode: "matrix",
                                    values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7",
                                    result: "goo"
                                });
                                b.methods.createOn(a, "feComposite", {
                                    in2: "goo",
                                    "in": "SourceGraphic",
                                    result: "mix"
                                });
                                k.css({
                                    "-webkit-filter": "url('#goo-shadow" + f + "')",
                                    filter: "url('#goo-shadow" + f + "')",
                                    "-ms-filter": "url('#goo-shadow" + f + "')",
                                    "-o-filter": "url('#goo-shadow" + f + "')"
                                });
                                b.methods.setEvents();
                                b.methods.setup();
                                b.methods.translate.apply(this, arguments);
                                b.methods.openMove();
                                b.methods.openHover();
								g('head').append('<style>.navimenu{position: relative;min-width: 100px;min-height: 100px;margin: auto auto auto -80px;padding-top: 20px;padding-left: 80px;box-sizing: border-box;text-align: left;-webkit-backface-visibility: hidden;backface-visibility: hidden;-webkit-transform-style: preserve-3d;outline: transparent solid 5px;transform-style: preserve-3d}.navimenu .gooey-menu-item,.navimenu .gooey-open-button{border-radius: 100%;position: absolute;color: #fff;text-align: center;font-size: .9em;transform: translate3d(0,0,0);-ms-transform: translate3d(0,0,0);-moz-transform: translate3d(0,0,0);-o-transform: translate3d(0,0,0);-webkit-transform: translate3d(0,0,0);transition: transform ease-out 200ms;-ms-transition: transform ease-out 200ms;-o-transition: transform ease-out 200ms;-moz-transition: transform ease-out 200ms;-webkit-transition: transform ease-out 200ms;-webkit-backface-visibility: hidden;backface-visibility: hidden;-webkit-transform-style: preserve-3d;outline: transparent solid 5px;transform-style: preserve-3d}.navimenu .gooey-menu-open{display: none}.navimenu .burger{background: #fff;display: block;position: absolute;top: 50%;left: 50%;margin-top: -1.5px;transition: transform 200ms;-ms-transition: transform 200ms;-moz-transition: transform 200ms;-webkit-transition: transform 200ms;-o-transition: transform 200ms}.navimenu .burger-1{transform: translate3d(0,-8px,0);-moz-transform: translate3d(0,-8px,0);-o-transform: translate3d(0,-8px,0);-webkit-transform: translate3d(0,-8px,0);-ms-transform: translate3d(0,-8px,0)}.navimenu .burger-2{transform: translate3d(0,0,0);-ms-transform: translate3d(0,0,0);-moz-transform: translate3d(0,0,0);-o-transform: translate3d(0,0,0);-webkit-transform: translate3d(0,0,0)}.navimenu .burger-3{transform: translate3d(0,8px,0);-ms-transform: translate3d(0,8px,0);-moz-transform: translate3d(0,8px,0);-o-transform: translate3d(0,8px,0);-webkit-transform: translate3d(0,8px,0)}.navimenu .gooey-menu-open:checked+.gooey-open-button .burger-1{transform: translate3d(0,0,0) rotate(45deg);-ms-transform: translate3d(0,0,0) rotate(45deg);-moz-transform: translate3d(0,0,0) rotate(45deg);-o-transform: translate3d(0,0,0) rotate(45deg);-webkit-transform: translate3d(0,0,0) rotate(45deg)}.navimenu .gooey-menu-open:checked+.gooey-open-button .burger-2{transform: translate3d(0,0,0) scale(.1,1);-ms-transform: translate3d(0,0,0) scale(.1,1);-moz-transform: translate3d(0,0,0) scale(.1,1);-o-transform: translate3d(0,0,0) scale(.1,1);-webkit-transform: translate3d(0,0,0) scale(.1,1)}.navimenu .gooey-menu-open:checked+.gooey-open-button .burger-3{transform: translate3d(0,0,0) rotate(-45deg);-ms-transform: translate3d(0,0,0) rotate(-45deg);-moz-transform: translate3d(0,0,0) rotate(-45deg);-webkit-transform: translate3d(0,0,0) rotate(-45deg);-o-transform: translate3d(0,0,0) rotate(-45deg)}.navimenu .gooey-menu-item:hover{background-color: #4682b4;color: #00bcd4}.navimenu .gooey-menu-item{transition-duration: 180ms;-moz-transition-duration: 180ms;-webkit-transition-duration: 180ms;-o-transition-duration: 180ms}.navimenu .gooey-open-button{z-index: 2;transition-timing-function: cubic-bezier(.175,.885,.32,1.275);-ms-transition-timing-function: cubic-bezier(.175,.885,.32,1.275);-moz-transition-timing-function: cubic-bezier(.175,.885,.32,1.275);-webkit-transition-timing-function: cubic-bezier(.175,.885,.32,1.275);-o-transition-timing-function: cubic-bezier(.175,.885,.32,1.275);transition-duration: 400ms;-ms-transition-duration: 400ms;-o-transition-duration: 400ms;-moz-transition-duration: 400ms;-webkit-transition-duration: 400ms;transform: scale(1.1,1.1) translate3d(0,0,0);-ms-transform: scale(1.1,1.1) translate3d(0,0,0);-o-transform: scale(1.1,1.1) translate3d(0,0,0);-moz-transform: scale(1.1,1.1) translate3d(0,0,0);-webkit-transform: scale(1.1,1.1) translate3d(0,0,0);cursor: pointer}.navimenu .gooey-open-button:hover{transform: scale(1.2,1.2) translate3d(0,0,0);-ms-transform: scale(1.2,1.2) translate3d(0,0,0);-moz-transform: scale(1.2,1.2) translate3d(0,0,0);-o-transform: scale(1.2,1.2) translate3d(0,0,0);-webkit-transform: scale(1.2,1.2) translate3d(0,0,0)}.navimenu .gooey-menu-open:checked+.gooey-open-button{transition: 200ms linear;-ms-transition: 200ms linear;-webkit-transition: 200ms linear;-moz-transition: 200ms linear;-o-transition: 200ms linear;transform: scale(.9,.9) translate3d(0,0,0);-ms-transform: scale(.9,.9) translate3d(0,0,0);-o-transform: scale(.9,.9) translate3d(0,0,0);-webkit-transform: scale(.9,.9) translate3d(0,0,0);-moz-transform: scale(.9,.9) translate3d(0,0,0)}.navimenu .gooeySVG{display: none;}</style>')
                            }
                            ;
                            b.init()
                        }
                        ;
                        g.gooeymenu.defaults = {
                            style: "horizontal",
                            size: 70,
                            margin: "medium",
                            bgColor: "steelblue",
                            contentColor: "white",
                            transitionStep: 100,
                            bounce: !1,
                            bounceLength: "medium",
                            hover: "white",
                            circle: {
                                radius: 80
                            },
                            horizontal: {
                                menuItemPosition: "glue"
                            },
                            vertical: {
                                menuItemPosition: "spaced",
                                direction: "up"
                            },
                            open: function() {},
                            close: function() {}
                        };
                        g.fn.gooeymenu = function(h) {
                            void 0 === h && (h = {});
                            if (h && "object" === typeof h)
                                return this.each(function() {
                                    new g.gooeymenu(this,h)
                                })
                        }
                    }
                    )(unsafeWindow.jQuery || window.jQuery);


const autoPlay = (function ($) {
  const CONFIG = {
    keys: {
      courseStart: '_.unique.name.course.start.',
      courseClose: '_.unique.name.course.close.',
      subject: '_.unique.name.subject.',
    }
  }

  function GM_onMessage(_this, label, callback) {
    // console.log(`增加GM_onMessage,参数为${label}`);
    GM_addValueChangeListener(label, function () {
      // console.log('onMessage', arguments[2])
      callback.apply(_this, arguments[2]);
    });
  }

  function GM_sendMessage(label) {
    let prams = Array.from(arguments).slice(1);
    prams.push(new Date().getTime());
    // console.log(`调用GM_sendMessage,参数为${label}, ${prams}`);
    GM_setValue(label, prams);
  }

  function pageType() {
    console.log('window.location.href', window.location.href)
    if (window.location.href.match("/study/subject/detail/")) {
      return 'List';
    } else if(window.location.href.match("/train-new/class-detail")){
      return 'NewList';
    } else if (window.location.href.match("/vue/paas-designer")) {
      return 'PaasList';
    } else if (window.location.href.match("/study/course/detail/")) {
      return 'Detail';
    } else if (window.location.href.match("/safe/topic/resource/")) {
      return 'Resource';
    }
    return 'Unknown';
  }

  class Filter {
    applyRequestFilter(url, method, params) {
      // 这里是接口的默认行为，可根据需要在子类中重写
      return params
    }
    applyResponseFilter(url, xhr) {
      // 这里是接口的默认行为，可根据需要在子类中重写
    }
  }

  class Filter111 extends Filter {
       applyRequestFilter(url, method, argument) {
         // 这里是接口的默认行为，可根据需要在子类中重写
         console.log('applyRequestFilter', url, argument)
         return argument
       }
       applyResponseFilter(url, xhr) {
         // 这里是接口的默认行为，可根据需要在子类中重写
         console.log('applyResponseFilter', url, xhr)
       }
     }

  class AbstractPlayPage {
    constructor(supportive = true) {
      this.targetName = new.target.name;
      if (new.target === AbstractPlayPage) {
        throw new Error("不能直接创建抽象类");
      }

     let originalOpen = XMLHttpRequest.prototype.open
     let originalSend = XMLHttpRequest.prototype.send
     let _that = this;

      // 重写 XMLHttpRequest 的 open 方法
      XMLHttpRequest.prototype.open = function (method, url) {
        // 存储请求的 URL
        this._url = url
        let _params = arguments

        _that.filterList().forEach(f=>{
           _params = f.applyRequestFilter(url, method, _params) || _params;
        });

        originalOpen.apply(this, _params)
      }

      // 重写 XMLHttpRequest 的 send 方法
      XMLHttpRequest.prototype.send = function (body) {
        if (this.onreadystatechange) {
          let originalReadyStateChange = this.onreadystatechange
          this.onreadystatechange = function () {
            // 检查特定条件：请求完成、状态成功，并且 URL 包含特定路径
            if (this.readyState === 4 && this.status === 200 && (this.responseType == '' || this.responseType == 'text')) {

              _that.getFilterList && (_that.getFilterList().forEach(filter => {
                filter.applyResponseFilter(this._url, this);
              }))
              // Object.defineProperty(this, '_responseText', this.responseText)
              // console.log('this.responseText', this.responseText)
            }
            originalReadyStateChange.apply(this)
          }
        }
        originalSend.apply(this, arguments)
      }

      if(supportive) {
        let uuids = window.location.href.match('[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}');
        this.pageId = (uuids && uuids[0]) || '';
      }
    }

    filterList() {
      // return [new Filter111()]
      return [];
    }



    addNav(menuItems) {
      $('body').append(`
      <div id="zGooeyMenu">
        <nav class="gooey-menu-nav">
          <input type="checkbox" class="gooey-menu-open"/>
          <label class="gooey-open-button">
            <span class="burger burger-1"></span>
            <span class="burger burger-2"></span>
            <span class="burger burger-3"></span>
          </label>

        </nav>
      </div>
      `)

      $('head').append(`
        <style >
          #zGooeyMenu {
            width: 130px;
            height: 130px;
            position: fixed;
            z-index: 10000;
            top: 40px;
            left: 60px
          }
          #gooey-round .gooey-open-button, #gooey-round .gooey-menu-item {
            margin-top: 6.5em;
            margin-left: 3.2em;
          }
        </style>
      `)
      menuItems.forEach((e)=>{
        let item = $(`<a href="javascript:void(0)" id="${e.id}" class="gooey-menu-item"> ${e.name} </a>`)
        if (!!e.child) {
          item.addClass('drop-down-wrapper');
          item.append($(`<div class="drop-down-content "> </div>`).append($(`<div class="content text-center"> </div>`).append(e.child)))
        }
        $("#zGooeyMenu").find('nav.gooey-menu-nav').append(item);
      })

      $("#zGooeyMenu").gooeymenu({
        bgColor: "#68d099",
			  contentColor: "white",
			  style: "circle",
			  circle: {
			  	radius: 60
			  },
			  margin: "small",
			  size: 60,
			  bounce: true,
			  bounceLength: "small",
			  transitionStep: 100,
			  hover: "#5dbb89",
			  open: function() {
			  	$(this).find(".gooey-menu-item").css("background-color", "steelblue");
			  	$(this).find(".gooey-open-button").css("background-color", "steelblue");
			  },
			  close: function() {
			  	$(this).find(".gooey-menu-item").css("background-color", "#ffdf00");
			  	$(this).find(".gooey-open-button").css("background-color", "#ffdf00");
			  }
      })
    }

    start() {
      throw new Error(this.targetName + " 未实现 start 方法");
    }
  }

  class UnknownPlayPage extends AbstractPlayPage{
    constructor() {
      super(false);
    }
    start() {
      // 不支持的页面
    }
  }

  class ListPlayPage extends AbstractPlayPage {
    constructor() {
      super();
      this.playClassList = new Set();
      this.maxNum = 1;
      this.waitNum = 0;
      this.checkTaskList = {};
      this.checkCloseTaskList = {};
      this.status = 0;
      this.repeatNum = 0;
      this.repeatMaxNum = 3;
    }

    start() {
      // this.addButton();
      this.addListener();
      this.addButton2();
    }

    addListener() {
      // 监听课程关闭事件
      GM_onMessage(this, CONFIG.keys.courseClose + this.pageId, function (src, data) {
        console.log('data',data);
        if (data.status == -1) {
          GM_setValue(CONFIG.keys.subject + data.courseId, this.pageId)
          console.warn('课程播放未完成，可能刷新了页面：', data.courseId)
          this.checkCloseTaskList[data.courseId] = setTimeout((courseId) => {
            console.warn('课程打开失败：', courseId)
            delete this.checkCloseTaskList[courseId]
            this.playClassList.delete(courseId);
            GM_deleteValue(CONFIG.keys.subject + courseId);
          }, 1000 * 8, data.courseId);
        }
        if (data.status == 0) {
          console.warn('课程播放未完成：', data.courseId)
          this.playClassList.delete(data.courseId);
        }
        GM_deleteValue(CONFIG.keys.subject + data.courseId);
        if (data.status == 1) {
          this.openClassPage();
        }
      });
      // 监听课程成功打开事件
      GM_onMessage(this, CONFIG.keys.courseStart + this.pageId, function (src, courseId) {
        console.log('课程成功打开', courseId);
        this.repeatNum = 0;
        this.checkTaskList[courseId] && (clearTimeout(this.checkTaskList[courseId]), delete this.checkTaskList[courseId])
        this.checkCloseTaskList[courseId] && (clearTimeout(this.checkCloseTaskList[courseId]), delete this.checkCloseTaskList[courseId])
      });
    }

    addButton2() {
      this.addNav([{id:'startAutoPlayer', name: '开始'}, {id:'setUp', name: '未实现', child: ''}]);
      $('#startAutoPlayer').click(() => {
        if(this.status == 0) {
          this.status = 1;
          $('#startAutoPlayer').html('停止');
          this.playClassList.clear();
          this.waitNum = 0;
          this.openClassPage(this.maxNum);
        } else {
          this.stop();
        }
      })
    }

    stop(){
       this.status = 0;
       $('#startAutoPlayer').html('开始');
    }

    addButton() {
      var divButton = '<div class="item" id="startAutoPlayer"> <div class="view"> <i class="iconfont icon-play"></i> <div class="text" id="startAutoPlayerText">自动挂课</div> </div> </div>';
      const a = setInterval(() => {
        if($("#D60toolbarTab").length > 0 && $("#D60toolbarTab .item").length > 0) {
          window.clearInterval(a);
          $("#D60toolbarTab").append(divButton);
          $('#startAutoPlayer').click(() => {
            this.playClassList.clear();
            this.waitNum = 0;
            this.openClassPage(this.maxNum);
          })
        }
      }, 300);
    }

    openClassPage(num) {
      if (this.status == 0 ) return;
      let classList = $("div.item.current-hover").filter((i,e) => ($(e).find("i.icon-reload").length == 0));
      // 过滤选修
      classList = classList.filter((i,e) => ($(e).find(".attribute .default-skin.is-required").length > 0));
      // 过滤考试
      classList = classList.filter((i,e) => ($(e).find(".attribute .section-type").text() != '考试'));
      if (classList.length == 0) {
        console.log('播放完成');
        this.stop();
        return;
      }

      this.playClass(classList, num, e => $(e).attr('data-resource-id'));
    }

    playClass(classList, num, obtainId, play) {
      play = play || (e => $(e).click())
      let maxNum = Math.min(this.maxNum, (num || Math.max(this.waitNum, 1)));
      console.log('playClass - maxNum', maxNum)
      let idx = 0;
      do {
        let courseId = obtainId(classList[idx])
        if (!this.playClassList.has(courseId)) {
          play(classList[idx]);
          // 课程可能没正常打开、监听成功打开事件，没有事件的认为打开失败
          this.checkTask(courseId)
          this.playClassList.add(courseId);
          maxNum --;
          this.waitNum = Math.max(this.waitNum - 1, 0);
          console.log('playClass - waitNum', this.waitNum)
        }
        idx ++;
      } while(maxNum > 0 && idx < classList.length)

      if (maxNum > 0) {
        this.openClassPage(maxNum)
      }
    }

    checkTask(courseId) {
      GM_setValue(CONFIG.keys.subject + courseId, this.pageId)
      this.checkTaskList[courseId] = setTimeout((courseId) => {
        console.warn('课程打开失败：', courseId)
        delete this.checkTaskList[courseId]
        this.playClassList.delete(courseId);
        // 尝试播放下一个
        if(this.repeatNum <= this.repeatMaxNum) {
          this.repeatNum
          this.openClassPage();
        }
      }, 1000 * 10, courseId);
    }
  }

  // 活动专题班
  class NewListPlayPage extends ListPlayPage {

    openClassPage(num) {

      if (this.status == 0 ) return;
      let section = $('.train-citem').closest('.section');
      if($(section).find("div.node-flag").hasClass('lock')) {
         console.log('本部分被锁，暂无法学习');
         this.waitNum += num;
         return
      }

      // 有更多按钮就先加载
      if($('#D235loadMore').length > 0 ){
        $('#D235loadMore').click();
        setTimeout(num => this.openClassPage(num), 3000, num);
        return
      }

      let classList = $('.train-citem').filter((i,e)=>$(e).find('.t-business-type').text().trim() == '课程' &&  $(e).find('div.un-finish').length > 0).find('.pointer');
      classList = classList.filter((i,e)=> !this.playClassList.has(this.obtainId(e)))
      if (classList.length == 0) {
        console.log('本部分播放完成，尝试加载下一部分 （可能是被锁的）');
        let nextSection = $(section).next();
        if(nextSection.length == 0) {
          console.log('学习完成');
          this.stop();
          return;
        }
        $(nextSection).find('div.section-title div.right-area i.icon-triangle-down').click()
        setTimeout(num => this.openClassPage(num), 3000, num);
        return
      }
      this.playClass(classList, num, this.obtainId);
    }

    obtainId(e) {
      return $(e).attr('id').match('[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}')[0];
    }
  }

  //专题
  class PaasListPlayPage extends ListPlayPage {
     constructor() {
      super();
      this.sectionIdx = 0;

       if(unsafeWindow.top != unsafeWindow) {
         let pme = unsafeWindow.parent.document.getElementById('zGooeyMenu')
         if($(pme).length > 0) {
           $(pme).hide()
         }
       }
     }

    openClassPage(num) {

      if (this.status == 0 ) return;
      let sections = $('.grade');
      let section = sections[this.sectionIdx];
      if($(section).find('.title-item .lockbox').length > 0 && $(section).find('.title-item .lockbox').find('.biz-Unlock') == 0) {
         console.log('本部分被锁，暂无法学习');
         this.waitNum += num;
         return
      }
      // 点击展开
      let clickTxt = $(section).find('.title-item .clickTxt');
      if($(clickTxt).text().indexOf('展开') >= 0) {
        $(clickTxt).click();
        setTimeout(num => this.openClassPage(num), 3000, num);
        return
      }
       // 有更多按钮就先加载
      if($(section).find('>div').length ==1 ){
         console.log('活动未成功加载');
         this.waitNum += num;
         return
      }
      let classDiv = $(section).find('>div')[1];
      if($(classDiv).find('.more').length > 0) {
        $(classDiv).find('.more').click();
        setTimeout(num => this.openClassPage(num), 3000, num);
        return
      }

      // 获取课程列表 TODO 获取不到ID 考虑用课程名计算
      let classList = $(classDiv).find('.activeContent').filter((i,e) => $(e).find('.btype').text().trim() == '课程' && $(e).find('.requiredY').length > 0 && $(e).find('.operation .finish').length == 0).find('.operation button');
      classList = classList.filter((i,e)=> !this.playClassList.has(this.obtainId(e)))
      if (classList.length == 0) {
        console.log('本部分播放完成，尝试加载下一部分 （可能是被锁的）');
        this.sectionIdx++;
        if(this.sectionIdx > sections.length -1) {
          console.log('学习完成');
          this.stop();
          return;
        }
        setTimeout(num => this.openClassPage(num), 2000, num);
        return
      }
      this.playClass(classList, num, this.obtainId);
    }

    // 考虑用课程名计算
    obtainId(e) {
      let name = $(e).closest('.activeContent').find('.content .bname').text().trim();
      return md5(name);
    }

  }

  class GetCourseIdFilter extends Filter {

       constructor(_play) {
         super();
         this._play = _play;
       }
       applyRequestFilter(url, method, argument) {
         if((url.match("course-study/course-info/related") || url.match("course-study/course-front/is-archive")) && url.indexOf('?') > 0) {
            url.split('?')[1].split('&').forEach(e=> {
              if(e.indexOf('courseId=')>=0) {
                this._play.courseId = e.replaceAll('courseId=','');
              }
            });
         }
         return argument;
       }
     }

  // 课程播放页面
  class DetailPlayPage extends AbstractPlayPage {
    constructor() {
      super();
      this.courseId = this.pageId
      this.state = 0;
    }

    filterList() {
      // return super.filterList();
      return [...super.filterList(), new GetCourseIdFilter(this)];
    }


    start() {
      // 多开判断
      // unsafeWindow.WebSocket = undefined;
      // window.WebSocket = undefined
      let nsi,si;

      // 获取课程名
      nsi = setInterval(()=>{
        console.log('this.name', this.name)
        if($('.course-title .title .course-title-text').length > 0) {
          this.name = $('.course-title .title .course-title-text').text().trim();
          clearInterval(nsi);
          nsi = null;
          // 还没判断到
          if (this.state == 0 && !this.subjectId) {
            if (!!(this.subjectId = GM_getValue(CONFIG.keys.subject + md5(this.name)))) {
               // 告知已经成功打开页面
              clearInterval(si);
              si = null;
              this.state = 1;
              this.courseId = md5(this.name);
              GM_sendMessage(CONFIG.keys.courseStart + this.subjectId , window.location.href, this.courseId)
              this.checkFinished();
            }
          }
        }
      }, 500)

      // 判断是否插件打开的
      si = setInterval(()=>{
        console.log('this.courseId', this.courseId)
        if(this.courseId) {
          clearInterval(si);
          si = null;
          if (this.state == 0 && !this.subjectId) {
            if (!!(this.subjectId = GM_getValue(CONFIG.keys.subject + this.courseId))) {
              // 告知已经成功打开页面
              clearInterval(nsi);
              nsi = null;
              this.state = 1;
              GM_sendMessage(CONFIG.keys.courseStart + this.subjectId , window.location.href, this.courseId)
              this.checkFinished();
            }
          }
        }
      }, 500)

      setTimeout(()=>{
        if (si != null || nsi != null || this.state == 0) {
          // 超时未检测到是否插件打开, 增加开始按钮
          this.addButton();
        }
        clearInterval(si);
        clearInterval(nsi);
      }, 1000 * 5)

    }

    addButton() {
      this.addNav([{id:'startPlayer', name: '开始'}]);
      $('#startPlayer').click(() => {
        if(this.state == 0) {
          this.state = 1;
          $('#startPlayer').html('停止');
          this.playMedal();
          this.checkFinished();
          console.log("手动控制开始播放");
        } else {
          this.state = 0;
          $('#startPlayer').html('开始');
          console.log("停止播放");
        }
      })
    }

    checkFinished() {
      let status = 0;
      const a = setInterval(() => {
        console.log("正在循环判断课程是否完成");

        this.playMedal();

        let cIndex = 0, nextIndex = 0;
        let dls = $("dl.chapter-list-box");
        $.each(dls,(i,item)=>{
          if($(item).hasClass('focus')){
            cIndex = i;
            // if($(item).find(".section-item .pointer span").text() == '重新学习'
            //   || $(item).find('.section-item div.sub-text.focus').text() == '考试'){
            //   nextIndex = cIndex + 1;
            // }
            let compulsory = $(item).find(".section-item-wrapper .section-item .sub-text:nth-child(1)");
            let type = $(item).find(".section-item-wrapper .section-item .sub-text:nth-child(2)");
            let remainder = $(item).find(".section-item-wrapper .section-item .pointer");
            let reText = $(remainder).find('span').text() || '';
            if ($(compulsory).text() != "必修" || ($(remainder).length == 1 && reText.indexOf('需再学') < 0 && reText.indexOf('需学') < 0) || $(type).text() == '考试') {
              nextIndex = cIndex + 1;
            }

          }
        })
        console.log("当前学习到第" + (cIndex + 1) + "节课，" + (cIndex < nextIndex ? '已学完，开始下一节' : '正在学习'));
        if(cIndex < nextIndex &&  dls.length > nextIndex){
          // 开始学下一节
          $(dls[nextIndex]).click();
          return;
        }

        if ( ($("div.anew-text").length != 0 && $("div.anew-text").text() == "您已完成该课程的学习") || cIndex < nextIndex) {
          console.log("该课程已经完成，开始通信");
          window.clearInterval(a);
          status = 1;
          GM_sendMessage(CONFIG.keys.courseClose + this.subjectId, window.location.href, {status: status, courseId: this.courseId, message: '播放完成' });
          window.close();
        }
      }, 1000 * 15);

      window.addEventListener('beforeunload', (event) => {
        // 异常关闭
        if (status == 0) {
          GM_sendMessage(CONFIG.keys.courseClose + this.subjectId, window.location.href, {status: -1, courseId: this.courseId, message: '异常关闭' });
        }
      });
    }

    playMedal() {
      if ($("button.videojs-referse-btn").length != 0) {
        if ($("span.vjs-control-text:contains(', opens captions settings dialog')").length != 0) {
          $("span.vjs-control-text:contains(', opens captions settings dialog')").remove();
        }
        // $("span.vjs-control-text").click();
        $("button.vjs-paused").click();
        $("button.videojs-referse-btn").click();
      }
      // 两倍数可被正常统计 最大2.2
      let $video = $('#D200container video');
      if($video.length > 0 && $video[0].playbackRate < 2.1) {
        $video[0].playbackRate = 2.1;
      }
    }

  }

  // 在文档页面
  class ResourcePlayPage extends DetailPlayPage {

    checkFinished() {
      let status = 0;
      const a = setInterval(() => {
        window.clearInterval(a);
        status = 1;
        GM_sendMessage(CONFIG.keys.courseClose + this.subjectId, window.location.href, {status: status, courseId: this.courseId, message: '播放完成' });
        window.close();
      }, 1000 * 20);

      window.addEventListener('beforeunload', (event) => {
        // 异常关闭
        if (status == 0) {
          GM_sendMessage(CONFIG.keys.courseClose + this.subjectId, window.location.href, {status: -1, courseId: this.courseId, message: '异常关闭' });
        }
      });
    }

  }

  return {
    start: () => {
      const play = eval(`new ${pageType()}PlayPage`);
      play.start();
    }
  }

})(unsafeWindow.jQuery || window.jQuery);

(function () {
  autoPlay.start();
})();
