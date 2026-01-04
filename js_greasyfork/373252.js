// ==UserScript==
// @name         RSS+ : Show Site All RSS
// @name:zh      RSS+ : 显示当前网站所有的 RSS
// @name:zh-CN   RSS+ : 显示当前网站所有的 RSS
// @name:zh-TW   RSS+ : 顯示當前網站所有的 RSS
// @name:ja      RSS+ : 現在のサイトのRSSを表示
// @name:ko      RSS+ : 현재 사이트의 RSS 표시
// @name:pt-PT   RSS+ : Mostrar todos os RSS do site
// @name:pt-BR   RSS+ : Mostrar todos os RSS do site
// @name:fr      RSS+ : Afficher tous les flux RSS du site
// @description         Show All RSS Of The Site (If Any)
// @description:zh      显示当前网站的所有 RSS（如果有的话）
// @description:zh-CN   显示当前网站的所有 RSS（如果有的话）
// @description:zh-TW   顯示當前網站的所有 RSS（如果有的话）
// @description:ja      サイトのすべてのRSSを表示します (あれば)
// @description:ko      웹 사이트의 모든 RSS 를 표시합니다 (있는 경우)
// @description:pt-PT   Mostra todos os feeds RSS do site (se houver)
// @description:pt-BR   Mostra todos os feeds RSS do site (se houver)
// @description:fr      Montre tous les flux RSS du site (s'il y en a)
// @license      GPL3.0
// @version      1.1.4

// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAgAElEQVR4Xu1dC5hbVbX+18m0w6sCnZxMefkAlOKDV5XmpC23KCAPLyiviw9QQCm0zUkLIg/1WpWnRdqctGCRl1cUBHy0iEVA4dI2JwUrCKJFQRS40MnJlEIRmOnkrPvtTGaYSZOZZO99MplOzvf5gczea6299vmz99l7rX8Rmk/TA00PVPQANX3T9EDTA5U90ARI8+1oemAIDzQBEuDrkbvW2gMhTAYw2TewBxgTDNBOIH+CzzQBEP8fO4l/+sAEYoj/BiZsNoDNADb7wBvinwbxZrCx2Qe/AfF3H/8HYD3yWB8+3xX/3nwC8EATIBqcmktZk/M+9idgMgiTDWAyM/YH9b7wgT+MzUT4qy8Aw1jPwPqQgb+G4+76wHVv4wqaAKlxgr2bpk3gN3pmGIYx3fd5BhFNr1FEvZs/7DP/b8gwHvGN8Y9G5jwsVqTmU6UHmgAZxlFim+SPQ4x8WGQgygyrSt82arOHiWgNw3+UjfyjkTmPbWhUQxvBriZAyszChpT1EcPn4w2DjtsGADHke8aAC+Z7fYNWTIq7TzXCS9lINjQBUpyNwgd1Cx/PoOMBHN1Ik1RHW+4j8Ar00Irmh3+v18c0QF681tq+dRwfTz4dD4IAhjhRaj7i5Iyxgg1e0bWFVux1vvvWWHXKmASIl5w6hcn4EqEAineP1cmvctwvMLCC2L/VTKxdV2WfbabZmAKIAAYM4xwwztlmZrCeAyHcAN+/YSwBZUwApAkMzSgaQ0DZpgHSBIZmYJSKGwNA2SYBknWsg4lwbnMrFTBA+sQTbmDGDyK2+3idNNZNzTYFkOzSmTtRvutCAOJ/29fNi01FwgPipGshh1oXbku39dsMQHKp2BeYWQDjgOb7OqIeeJKIFobj6dtG1ApNykc9QHJLolPBuJCZTtLkk6YYDR4g4p+DsDA8N7NWg7gREzFqAfLajdbELf/GhUyF7VRoxDzYVDyUB/LEWDhuRyzc+cvuxtHoqlEJkFwydjoTXyryLEaH0+lvIKwnYD377Bkh3pRneo2ZXguBN7FvvOajZ9Obm7Z/TYxnh13e2tlAyy5k+DvnQbsQ8c4h4p39PO1CBpksxs1i7PyB0TF+rCemK8KJ9I9Hib39Zo4qgPCdHxqf2/CuqwHMa0xH058I/Ccf/IzIyWgBr5+4ce16WgA/CHt5AYyNE6dO7gFNFrkoBmg/JhwAxkFB6NMgc3F40usX0alPd2uQVRcRowYgnc60qM/+1SAcVhfPVKGECE+zjwwIv9sOLQ9OsFd5VXQLvMlLSw5tG8ehGQbjP0CY2VCAYTxikHFRm70mE7gjNCgYFQDpSMVmG8xi5RjZYELGPwA8xAZcotAqc+7qv2mYg8BFdCyavjdC+ekGeDqYPgHC3oErHVrBGz7RRe3x9HUjbMew6hsaIOKXsNVvuQrgLw87kuAabCai5cRYPrG1aznNWrclOFXBS+ZlU8Zt7Go9gQknMPMJIh8+eK2VNNCNXUbPxXvOfbRz5GwYWnPDAiTnRI9goqvBOGQknMfA/QbRcmzh5dtqbkQhB2YcneAzn0DAUSPhZxD+SMwXhe3MgyOifxilDQmQ4inV/4yAw/7lM986vsX41a5z0k+MgP4RU/nq0thBPb5/ApjOBPCeehvCwNkR27253nqH09dwACl+bywdznCdf2fgSSK+9c1Qy63vmb36VZ2yR5usf103fdcd8j1fYiaRL1PXqASf+aL2ROZ7jeSzhgJILhX9GjOJj/F6PasYuNXc6N4a1FFsvQaiW484QvYmWgIkXwIwQ7f8il8lRN8Lx9MX1UvfcHoaBiC5VOxqZv7acAZr+Tvh1wbo1rZ4+uda5G3jQjpTsZN88JfA+FQ9hkrAzWHbPbseuobT0RAA8ZzocvSSJQT6ENGLDP8KM575QaCKtlHhXip6LsG4lJn3CnqIBPwibLsjHl834gDxHEuw/+0XtMMB+mHLOP+KXc/L/DN4Xduuhlevj763Z4txKcBfCXqUDNwXsd1jgtYzlPwRBYjnWFyHwf/R9/0r2uetbW6nNDq7Y/HUkwxDACXYY3gieiAcT4/MEfRI0v54jiUIl3fXOGdbiWLQFX7XG1dMuvDJfwepZ6zK3rDwgB2N1p0uJRQCRwN7CFgStt14YAqGEDwiK4jnxP4A8JSgBkzAYzBwSXiu+7ugdDTlvuOB3BLrE/BxJQMfC8ovDMQjtrskKPmV5NYdIJ5jrQDwn8ENlK4PtXZdMnHWukLoePOpjwc2Lpuyc76r9UqAzwtKIxOfFolnfhaU/HJy6woQL2UtC5BIocMguqQtnr6lng6sVtfLy6bs0NI1fj8yaD8/708OGcb2YN5BpH+w+CdhByKjkEfP7L8FxptE9CaAN0H0Zt733zJChsgneaantfuZ3WetE39ruKczFTvTZ74SQHswxtGnTDt9bzCyt5ZaN4B4qei3wLQgoIHdmydc0ijky96iKbuR0XoEiA8F0X7M/mSANB+N8otExnowP8MEN/82PTjpwnQ2IP/WJFaQf4cYAiTH1dSxysZs0H9E5qYfqbK5UrO6AMRLxs4B8TIlSyt09pm/3Z7IBAW8qkwWEbLe2y1HkmEcDqbDg/y+GsogBtIhwn2+768Ov7r9KlrwcE9VAwioUXA/ivwi8vi0OT/zx4BM7xcbOEAKUbmgBwIZCPF5I3Xp99q11sTuFj4GMI4B+IjgthTSnnsZoIcAf+X4Hlq58/kjkxOeS1kXc+9qovt5Evnuo835617RLXigvEABUsjn4ND9QYSsE+PEcML9ZZDOKZVdAgpxgTWxnvoVdG0EaOVIgaXTseb5wCIF+yt1vd203c8FILc+K4jnxH4YRLKTz5jWnnDTQTpmoOwBFKYnjyJQVHLPRhDurjcJtedYnwXwU91zxszfiCQyl+uW2ycvsBUkqLB1H7Rvu51+LiiHVADGtskGX2du3dzS2Mc4z4/qnjsifCYcd3+lW66QFwhACgQL8MV3h9Yccg61TqgHreWYI72uI1BevNaauF0L9KbYEv7Bvn90JLH277pBoh0gBWqeV971gG72kbd70LZXwB+am6+PRd7u5gtB+KpuR48KeYxrthtPCyecF+xxcZFDWdSB1/ncY9qu9ohw7QDxHEt8jGnlraIQHRqek35MpzdLZXmONasADMa+QeppeNmEZ8G4xrTdQI7l+8bf4cT2McDP6vQHMa4KJ9xLtMrUKSygXPLPmbZ7u047B8rKJa1PcO+KMVYLd1Zy7X3EuCacCC6erSNpxQzCGp1zS0Sn6yTO1raCCK7c7jcLg9VGB2oA89tsd7FOBw76CE9ZC8FjdDtVrVMJ15hxV/AfB/LkktZnmPALjcLXj98B03RxAWsDSC5pXcmEi3UNlAiXhOPuVbrkDZSz8bqpB/g9xkIeKaqbIAYVoEwSFEgt/oUTZ699Mgg1IlMRTNfrkq1zq6UFIKIEAfskVg8tLOtBho90JGOnG8QLG/DmW9f7EZScDp/pwvaACKg1h6XkyeBpOkov6AFIKnq3xvoc95q2Gwg5gNfcUqmDJ8Atl+dYv9YV4Cjqk4TjGXGxq/QoA6RY2UkXrX1HnnBkEFG5Oce6k4FTlLzV7Fz0AK8w7YygLdX6FKOAxf2ZllB5HR/sSgApnmeLrZUWgjGD6Kwg8jkaEBx5Av7qAy8bxJvBxmYf/AYIvXcDjAkGaCeQP8FnmmAAuzOwv64trKa3eo1pu9M1yeoXU8wn0cWw+CSHWqepXC4rAcRzrG8D+G89TqLrTTs9W4+sd6R4TmwVBKv5yD2vM/NqInoY4PXMvF72xjebnPp+IhK5JaIeSIyBmQB2Gbmh4RnTdrWdWvaNw3Ni12nMTPyOabvfkvWRNEAKpZZRONZVriYrcsiN1u4jdafJeo71LwDvlnWObD8CfptnzoRCtCrovPiOVHRayKfDuLduygjc5VDOtNOmrK/K9RPpu37X+Ac05bi/xcA02RLV0gDRmT5LBo7Q/SLViVJo4PyuJOKV4wxaufMcV+sNcbUv32tLrX23+HwMM4lQ/LrySZm2K/0ulRufIIJgH3oY3wk3mHF3VrV+HNhOalCFYD4y/iCjsLSPoOaJ2Omv65A1YIn2AA7rlFlOFgPPG6Cbx4X4jpECRaUxFsCSp9N88FkEvC9oXwB4wbRdrazwWSd2uTZKIfY/aibWrqvVD3IA0Ue+8Md8178P08lbVSemxicN4BZq7b5F97aw1gkcrr3YrnDX+DN9QJQ10HKYUlknrTbttDaia8G7FWrdUeSeq9eIkVxFagaIztXD9/2TdTIeeo61GsC04V4ahb9vIOIr2tr3uo5OvSuvIKfuXfnOU0KdHS/OZiZB8jYpKAMIuCtsu6fqkl9kcLxbizyJVaR2gGhbPeiHpp3WlogUNAE2M9/S2kJXNNpWqtYXR2y9unr4UqJCoZxAHt0g8ZzYDVq4gCVWkZoAomv1ECzroRb/MF1E0sHekNOfmPjySNy9K5C3aYSEZlPWKcT0dYAPDMQEjTfugjA732M8ooVVvsZVpDaA6Fo9NLKRFGOrAinXxuBb/S7jokbhm9L9Im9YGIsYrf7VBBJFcrQ/PtMZumK3tAU01riKVA0QXasHCL82464W6lERlZvvMe7XFZrQ94Yw8BaYL4okMintb00DCswmo3EQXU0a7rRKhtcRavGP0hUF7KWse7QU8alhFakaIFnHShEwV3V+DaKTdVV2yjnWb3WHrBPh6Tx4Vns8ozWRR9VvQfcvXDiCljHjQzp1iVD5sO1+UofMQqUrZuUP9lrY4qsCyIvXWttv1wJR6Eb1VnqVabvixlf5CeK7Q4CD2D+1zV77F2UDR6GATmfqB5mMO3WDBBq/RzzHEse+SkfJBLzkh1r3ryZGqyqAZFPR/yKmO1TnXFep32KarJ5b1uKgxjo4+uY2KJAQ4wgd6btZxxIXnzepvovVRvpWBRAvaf0EBCUGO1Fq2dzoHqyjmqznWCt1xh01wTH4dQsIJPeZGsqpFavvPq5aorrafJFhAZK71tqDe7dXahxXxOeb8Ywy/WSBfQTQVoSzCY7yv8UBgeRcHWwpXio6H0zXKq4ieWZ//+Eiq4cHiBM9j0HXKRrzrzdbQge/Z/bqV1XkFHireniNLmqeRgHHxqum7Gy8a/u2np58IX6spSWU819/q3PixSNbBEg7SAjPbtdC01R5t/513fRdd+jJPw5ANfbra6btivTris+wANGxndGVY+4lrYW6SN1GAhzZpR+bRPkWkYl3GgNhArUVgyrHVZihLQDlGNxJQA7AHRzqWR6Z89gGlR+aWvpqB4ng3Eqos6R0JKMLDCLpPA/hA1EuImK7Q4YmDQmQYgqkMpNFS4gO3nVO+olaJqa0rbZ7mF7HvMXER9bjKHdD6tD3hTgkqrSKux9dBWVEhaV78pS/f1L80edV/FpNX3EETEwPaLsnqeEeopJ9ry6NHdSTZ7GKKD0hGIdNtNesqiRkSIBkk9GvE9FlKhYwcH9Ewzm4zvwTZraDvgQs1kWxg63HWJiZewjshO2M1lO90jkXl4lE5Ki8C/19a7zNrqQz61i/JWXqJrrWtNMXyAHEsdIEWCpOIaI54Xha6RtG7+rBt0bsTGCBet6S6CHkG3EGBxK+UXki6VY2/JQ5N7iqS1kneou2sBQNq0guFZvNzEvV3k88HY67H64ZIMX9smr1ns3Ug/3D57uiJrr0o2/1oD/lu3BUELFVryyKvrclZMQJHGeg0jeFtA+q6UjAFgalevJ+arf5mX9W06eWNiJ2K9SK+7UEOGpYRYonrH8FMKGWcZS2NeB/qNLlcMUtlpeKHg+m5SqKiei2cDx9uooMrasH4dQgonI9J/YVgL+rOyZMwW8dAH3TtNM/VJBRtmtvFDDu1CJXzyryY2b+goo9TPhyJO6WvXysCJBcKnYZMyulwhqgU9rstFLsjK7VQ+RzRBKZs1QcWa6v50SvAajiHla3vtrk8fdNO6O9lEM2Gb1ZSz6JhlWk04md7IPVUhEYN5kJ98vlfFt5BXGsh9BLKyP3MP4R3q57Ms1at0VOANBbExCiKIpqLcAN40OYoTvZyXOsFXX4CJd1X18/7XUzRNJVdx7i5Ec1M3Hj+B68X6XAqKgwnHt7/HoQ9pZ1lDjyr/QdUhYgegqc8A9NO6OUMeg50c8DdJvswPv6EbEdjusNXfec6DMAfUDVtvr057+ZdmY/nbpyqWicWcepFn/BtDM/UbHNS1o3gnC2iozuLT3v3uOCx14slVEWILlU7OPM/DsVhT7wxXbbVUpk8pzYbQB/XsUOAE+GJ+15iM4c8hGgFFJ0QW93ndQ8Isc9t+ElUadckQiCfmLaaaVviGzKOpsYNyo6qWwdmrIA0XFL6edD+7TPX/0PWaN1ba901xhpAKZGWZeKkpRaWUc0lXdW3mZ5S6Z/AH7+GQXHgJivCycyc6paQTzV7w/CE2bcPVjFYB3bK8Fb1dLafbAuap5s0rqSNNZAUfGPbF9mXBXRVKZMUAr1dI0XkbWKvFvq26xcyvqzSh4LA09FbHer1bDsCqJhC7HYtN35spMo+unYXhHom2E7rRQJ0DeGzpSV8BmBVbtS8VWtfQ3CvLa4m6y1X7n2OSf2De494lZ41LdZOr5DtrR277j7rHVvDhzIVgDJpazJzBCXL9KPT/hMu0Ldal4wsyU3sUvw6u4ubQSA8SG8X8fJVZDEECrjU+mri1CheKKlWn65I9zavZfKiafnWJ8F8FMVnzBwSCmH71YA6UhanzEUa8Z1GfnwnnMfla6F7SWnHg4yfq8yWAArTds9VlEGem/IKRPMJSCt9tn/XchAJzM2MmGjsJcYE4kwMe+jzSDjEwGx03f05Dmq48bdc6zfqHIBM/vHRRJrhRypZ7Mzw3wbPVmpzn2dDPqsOTc9KHN2K4Bkk9YlRLhCWpGG74/OlPVNn/EdaRvES6bpaNdzYt8H+HwVW0qW7Pth0G08LvSgOWtVVaE83rIZu9GW/BHw+Qt6SSqGDtSrdsxajnw15K17TuwJpTAY4gVmPCNKevQ/WwPEsX5EwBnVOqe0HQH/E7bdL8r2F/2yjrVG1L9QkaFje9UbeEgZTbFVYhvyfdWMumJGpbi5f7+KfworlYjdMjiqGuCoZ5tF60w7/VGVMeUc60es8O6C+Q4zkRFbtcoAyTnWWgYOlTWUwV+P2BnpFag3II47ZPUX+2nJf845sVt0ROUKKs4taJmzm73KUxxXofsrzgxzHHqW6igpR6Bbw3ZaObo551j3MaBG75Pv3t2cv66qVbWcH7NO9FICXa7g48dN2x1ElL3VCuIlrddB8tGRPvikdjsjXffaS1mfA0PpZpUYl4YT7pUKjkIxn0PUy1N6dPPUDjRGV2k5Ah+pmk+i4+6MmM4IK1TR7XCiJxqgnytM2Jum7e5YcQUphg+/pKAAQ4UOVyM351gpViSo84mnq2YL6oiz0pVqPJTfdLyYIunKtN3jq5mfSm10FLyphdCtnB0iPdiH8bTKOIzQuHe3zXmkP+Rk0Aqig28qvNENqVD75FKx+5n5SIVBbjJtd1eF/tBxM1sPcPSNUQtIjNB+5tzVf1Pym2O9BuBdsjKI6IFwPC3Sk6UeQQmUm2gplaXwff+o9nlr+3cOpQCZw4QlUtYVOtHfTDutFBTnOdEXANpL1gYCfhW23c/I9hf9vKT1VRCGZLsYWj7daNrpr6jYUGtfz4n9EOCyIdtVyWJcaCbca6pqW6FRNhm9l4gUjtb5RdPOKLF3ek7sGYClg0gZiEdstx8DgwCSTVlXEOMSaScRrTDjaen62S8vm7LDuK7x/5bW39txWCqX4eQrhtr8vQct03R9kA9na9/fxYd7C3oEn7Ds6dbDpu0eXq2+cu08x7oQwPdUZJS7za5FnpeKLQez9HaRCFeG464oMtT7kz9QuSpBNRF9LxxPX1TLgEr0i8q5IkJU4eHjTTtzj6yATmfqnj6MrcKea5CnhRytBn39TVVJ9Qz4e7XZa6W/QT0n+p8AiRwZ6afcbXYtwnKp2NXM/LVa+gxsW/odNHiLpXqsqbhMe0tip8Hn22UHJ/ox+x8Yji1vKPlZJ2YTWCpOSSeTuawPVBjvGZSI2Glp5pLeOu6G0ncMytxm1+IL1e0xEX4Ujrv9hBuDAZKK3s1MJ9Vi0MC2hsFfaZubkY7L1/CxmTdtt0XWftFPZXtlEJ3VFk/foqJftW9nKnamz3yzpBwd26weACFJ/VA93OhcEv2y75N0Lj4Bvwjbbj8GSrdYSjxDrEiKoGF5/HPYdj8iOzmiX9axniKgIg3MULJLjwhV7JDt27n0sL38/JYXZPoz8OeIov9yjvUUS/pP2Ky8TVcklSg9SSsFiBIPlg/6ZLudFhWfpB7VOxAdJHWeE3sZ4N1qHQABj4VtVzoCoVZ9Q7XPOdajDHysdpn0immnlSKoVcncVO9COpzYUQb4t7WPvbcHgTJhO93PBVfyDWI9yYD0LzABU8O2+6iscTnHuokBaeaRainth7LPc6xuSPBaqW4NZH1Wrp/CVnWLabvjVWzJKW7TCbg5bLvS+eU5xzqUgbWyYyglcCgFyPMMvFdWOHxjsjlvjXTqo5eM3g6i02T1q8YVCZb1/A7jN8no1xU9LKO7tI9KdG3oze5dVFjllePXygQM1uITb/G0/WD4olyH5DP4LqZ0i5UjoE1SMnzfn9Q+b610oKFqrXMGlkRsNy5r/6brpu+9pSf/nFx/9bRROb1b91JJVx7XEtpnl9nyXAKqVwUArzDtjPRdWsfiqe2GYaiw3w+KxBgEEC9pdYEgvcS+sbF1+/ctePht2YlWDTNhwpWRAZc8tdqhsjwz8bGReEZUvhrxJ5uKHkNMUslHqttk1ctm1XCT5xfM3G6niV1vKUzCoJPQwQBxLCF4O1nhWzZ277j7gsE5vbXIUq1FwqArInZamg2yI2nFDIJUddttBSA+Y1p7wk3XMm8D22ad2OUE7r+JlpCjlKrw8oIpO4ybqBSN8YZpu/1cv6UAEbH40mx5lci3qnWSl4reDpb/BgGgRBZRrLv+p2rtHdxu29hihVr8A1XqmnuOJcrszZPzYSHf+A4zPjhpqRZZ//f9j+01flyL1DF3Uc9Lpu32xwKWAkSQNUyuxaCBbTlPB0fmyxfKyaWs65lxrqx+QI3NscOJ7WOAn5XRv618pPugfdvttOR3mLhojd4AkHSgJhF+EI6758nMgeiTXRQ7iELyhXUIGHSXVhpq4jI4KmucaqnfXMq6khkXy+oH46dmwpVmYlT5wNtGjnnVD1oUKyIT4apw3JUOmFVP2RhMrle6giiVV2bm/4okMtLU+NnF1sVkQDoTUDXUXY2TWC9rofSPRC+n2CpZJhQOtU6IzHn4DVn9Ocf6JQOflu3PPi6JzHOvku2fTUZPJaKfyfYH4ddm3BXl8grPYIAofgMQaHbYTl8va1xHMnquQSTdn5keiCTkE26E3Uqkea0tu1fLVCLro+H6CQYUdPW8PFy7Sn9X5e/NJmP3E8knvPnM57UnMtJlvnNO7DwGS1c0K61pUxKsqPYNoMpk6CVjp4GUonmfNW1XNh+i8M6opNqSQWeE56Z/LPty6uiXWxI7nX2WJQ1XTr31HEuwt+wrPRamz5qJwdxUtchSZXocOtxd9RtA8RQpm7SOJoLSXUKrkQ+/S4m0LnYOiJfVMikDluP7wxoKlsro7uujEu4OpllmIn2DrP7Xlxza1uWHRLlq6YcZx0QS7n2yAlRP0Qh8WdjOfLPsFkv1GwDMt5mJjHTJNfUwgcKu8VOmnRZlkqWe3KLo/hyiv0h17u00ahOmKM8fDM/PSNPOek7sOIB/reA7aAhX+jGIpMsp+IwL2wekHg/aYil/AwArI4p0n55jiZTbHaSdTPiuGXf/W7p/70fuHwCeIiljlKbcqhO3eSnrO2D0//pK+G8r2p1aZWQd6zcEHFNrv/72zF8xE+/kNJWEmih/A6w3bXd/aeMUT2CEXk0f6kqXXUFyYVXyrQaOLKVLVmGX6ge6jvolnmOp3eWBTokMqKs5OFhRwzfAJnjbvd9+tksWJLlUzGFm6YBDAK+btruzrH7Rr3NJzPJ9lg63KGz0gLvCtnuqih3V9tUADhgGxdrmpt1qdZZr56nT/qTC8bQta8PfnX1bd4EpHQso9PrgI9vtzINlv0FecaZ+sEWReKsHmLqbQk5INhk7k0g6ZbR3XAZPUeWbzSajdxPJpx8XnM387fZEZoHshFfTTyH3Y8Cugn8eSWROrkZfpTYbFkenhowCC770w0xnRRLyKcuvONahLQq5IIUftnHYM3ye+39lASL+o+dYSjnFAJ9j2hnpnOBXnekH9iD/hLSXe3++LzTjahxPOurEBw0SHeAo+Jn4BDOeUWIj8VLRb4FJ6cegBaGDdrVXS8bCFcJcvgKQ9CkcCFkz7rYPfPe25uZ1ok8AdKDsC8rA0ojtzpXtXwSpYMczFGQoRYT26c0mrf8lwmEKdhS70o09CF2qiyurlwMrf4USUVzRMmY8Ekm4/6E6RhWyi6Ju37RdabIHISPrWEsI2KrOYLVjI8Jvw3H36GEAolZZlplXRxKZGdUaVa6d4imS2P93h/Kt7bvOf1gqO7AfIHqqp/aJa7jyB8IwJnw5EndvUpmvYsFVkaQ0Tl6O+ilaNhldRUTTZW1g8NUROzMoFnDrEmxO7CIGS8fCgLHZTLjS/KyFFSRpfQekdFwI1TJwfU5WjS0qnSzBnUVEd8BoeXAgSfJQkyqYSuD3HMHMp+ksoKMau9Znc2cqdpLPfLfsi1kEqlKyW/G9UapMwMSnReKZQXFcZbZY6pc9fr5nn/b5j0mXgBaFa+DTOhWHA1hm2q5C6Hyv9mL49EMAdlG0Z6vuggklz/yboUqwhYiOlWMoGdbaTZynw1XSE/o0eI4lYqdmDatxiAaqp2gdiz62txFqkQ7TL5hm5MmxlJIAABHASURBVPcz5z46iPhuK4BsXDzt3XnDFwU0pR+fcWJ7wv2ltIDeVeQ5EPZWkLElxHTIxET6zwoyCl09xxIJQOJuZFt65pu2q1y1d2My9uE8saCLVdheqZNWa6it+W/Tdncqs+JvPeeq59k6jje9lLUQjK8qvZGMRWbC1VJfUPdWS2lcip11ba2K25prQVAq+Q2os+Grn+iVT1coWyddtUYgAY+GbXeqyjzqCFwE4bVxodAhKiwdfWMo/lKKo9D3qYyrAfo+H2I6XsfKWmCByef/CIbSxazv08nt89IqlaHgpax1YAwqn1aLr4mo7CVlWYDo2FNCsd7c0ws+ND4y8V3/BFAzy+FAxxDR5eF4+hu1OKtSW29RdCZCBbaQ7XXIGwEZbyHPx5rzMw/r0J1LxS5jZmmSjIINhGy4/fW96NSnBWGf1KOBkR8MnB2x3a04jcsCJOdYcxlISVlb7ETAF8O2K5uXUJCSVay422sKvbLFgLX73LTSd1WfL4ogER/to+/J8+G6wPHykth7xvlwZWhaBzlOMQJcyMqlYrOZeanKhFQqu1B+Ben9pVR8Cfhnpp2RZkksDDwZO4GJf6Uy8OKv1A1m3FU6ZRlow6gEiUZwCF94KWsZGOeozg0xfTqcSC9XkeMlrXtA+JSKjEqZlGUBUnCAY20EIF/rj7E5vNvrYZWls9eO2O8BVqp8JOSoVt8tdX7hFzTPT6lUBFaZ0Kr7MjZvCdFHdK2gQq+GarJ9+4yHTDv98arHUqYhO8e05rBJJGltdQJVg9zlpu2WzaOvDJCUdSMY0iTCwjhm/7hIYq0Uw1/f4HKOdQYDP6phsBWa0rotrV2H7T5LntiunGBVmhv1cQ0lQY0GqZzk3jJ5rY8o5Mv0i9WyDVcsdyCMIdCZYTt9a7nxDrGCqF8YAnStaacvUH0JPMcSl4bSJxR9+lWZFyuNw0vGzgfx91XHqbU/0wVmIn2tVpmF70Jl5sQ+k/5o2q5sUlr/sHKp6FJmmq0yznEtoYm7zF79ak0AEUtXJza9zpDn6gXwpGm70oGPfQZnk9E4EUmXBhs48NJ4fxXHDuxbrM8nJmpQsJsu+TXIuQ/g61TqNFbS1eFEjzBA/SWSa7Bpq6bMbEcSGaWDICHUS1l/AUMlSe/3pu1+otJYKq4gBeVO7A6A/0vFEWRwNDw3I12voWDH1dMmYHv/cQD7qNhS7PuHN/JvHfm++U8oBTIOsZoIZhYBFKWATYlxrgLTdSqMIEPpfH7RQbvsFNpegOOjEraVdnkObxkHmxet2awia4MzNRqCoZTkBeLzzXimYpTEkADpcKwzDMX9v2pJgv5VxIl9g8DfVXFof1/GD8yEPL1lNTZ0OtZZfm98UtBVpx41gGVtZc7wq7Gz2jZe0roepEIL+44mBn0zYqcvq1Z3pXbqpRYAPx/ap31+5XIPQ68gqWm7g/3+7CqpATE2++NCB7Ur1JwQeot1wEUarDzn0oAB6AjzrsYfhSNhg45n4ARSiy17B9+MfxCwHD6v0HWvMdRYsnrD/p/tQUtMNTem47rpextb8k8oniKuMm13yHyfIQHSu82yBI3LcdW8DEO0+Y5pu99SlCGOF88zQNKseSX6PR/5I9vtR6Uz2GodzyuLou81DHzJIJLyhYhx833cutv8jIgwqMvT4Rx6oIGQ2FqZOhT64NntdkaaPbPPBs+xvg1Aib2GwF8P25krhhrX8ABJReeDSfU05F8t+daDVBOYxEByjvUgAxU/qmqZRFGPzjfw6cgcV4rRvRZdAyZWxHP1c7/WKEOZ+bAWfW8sntr+dshYzgyluLo+nQT8Lmy7R9RiQ7m2ry6auUtPqEukZb9HSRb7HzUTa4dMqxgWIB2Lpx5gGIbyrywT5kXiblJpQAVqmWnHEvnSxHCl+gVI2jpbD6IFD4tc/MAfz7HEllW2kuzLpu3uEbiRAO485ZTQ4TNeEuweM3XpYzaOiyTWKN2LCVuyKStBDKVQfQZnInamv5ptpTEOCxDR0UtaGZDyr8jjpu0q32UUVpFk9GYmOlPXxJVWNtUlt5wcJXJssc+x3armTHUMGnLMB5lAzLeEExnpCsYDhXmOJfJPDlYZY7UpGVU5O5e05jBhiYpBoi8xnRFOqJM7b0jGPhwCpxU/0AZPYEnhFNWxVuo/GgCiGxwiDTsPik3SkLyWS8ZOZ5Im5+6dFsLb433/gJ0TawVPwJBPVQDZ8D9H7RjatFncQygxp+vag4oRqSfIbO0XBv4csV3pOvHDObuwGjsWV9OuUpugV5CsY/2dNJ0U9o2h2l/ravyi4xu0llrsVQGksK1xopcy6PJqBjFUmzzTpycpRm/2yfcc66cAPqtqU2l/P0+x9vlqLIOjbQVRqYw7jP9vN233czrmaEMydkJIQ3Q3GTgiPNf9XTU2VQ2QF6+19mhtweOkeNxHQLot7k4nEjkqak+RH2qljsC5rSwZ5oZV1vJGXEFyTvS7DNKSVDbYL7SuB6FjVO88hExmUGfKWs1ATNb3vbsrPBi23SOrlVE1QIrbg+8BuLBa4ZXaEeGScFy+zNZAuR2p6DTDp5U6v0f65AfBr9toANHB61t2nsUFscHHtMczUmW1S2XmUtbFzPLl+frkGURntcWrpzetCSAF7l42HgcpBTAKWzcZhjG9be6ap1XBJvpnU7EziRX5fEsMIeAvZBin6rJxwLZQaeXU/Q2SdSxxGnSn7u8OJjorUsOLONR70Llk2od831+tTL1E9Lcw73wA2SurJlevCSCFVSRpLQOpZ5IB+LFpu2foAIiQkUtaVzIpVMgtMaQciZgOWxttBRFj6kzFzvQ1/sAQ46pwQr5SbamfPccSqdvShZn65MkcFtQMkI4lMctQLA3QZzD7ODUyz71Lx4tXAIlj3cWAEkt5wRbGd82EWhGeSmNqRIAUVuFkzCFSKjtRGLLubWl2sXUKGZCunNw/DzUc7Q6cu5oBUlhFNITBF434Qxi7TK9lyRsOTDnHeoAB6XAGAn7RNmnPU+nUuwSBtvanUQHCC2a25CZ2/V4lTF83OIrptGJrpRxiX8vRrjJAtHBWvWPFt0zb/Y7ON9FzrMcknfpqqMWfOXH22id12jNQVqMCpLCKLIkdRj6LMB6Z/O6Ked2yvvQcSwQjiqBE5aeWo11lgOhcRRh4E8D0iO2Ki0htj1Q5YsbnzYQr7lYCexoZIGLQMqdFRFgbjrtRnU4rHh6sJpV6lX0GMX5qJtzPy9gntcUqACQ17aPw/TUaTrQKZ9Ntk/Y8Wve2xnNiHsDhahxTjvq+mn61tml0gBRA4lh3MnBKlWN7wbRdtajaEkXP3zJzuwmbu3/DGthsALyWJ8yYFHefqnI8g5pJA6SwJOtL4AcRkuG4K0iitT6eY20B0DK0UFoXnvRaTJWiqBrDRwNA+JaZ23mbu56q4ui327Td1mrGXUsbjSel4r1SunNTAoiIy8+HutYw8MFaHFC5LZ1j2mnp8m2V5A5XWKUFOGRXzVu8SraMBoD0brViH2fmocIxnjNtV0t250BfeU7sAoCv0fQ+rTbttBI3gBJAxCA0n6G/YTA+2ZZwlSrMlnOul4yeD6KtqXmYZpmJtHxduxpncrQApHerFfsGl+EBYMIvI3H3xBqHPmzzIjOMUq3EwUroU6adVsodUgZI4XvEsVSy5AaPibE2tF33JyfOWvfasB6tsUGxMKc4Uy9sC3QfS1ZjzmgCSHFuRYLTMcWx9fjMlwdRude7btp+6PFX6mPPp+tNO63El1V8R6qZ1qHbZBfHDiOD/1ddUq8EBm6O2K4Sq2PFLc6i6CEIFVaSA8M92IPOd9/SZXc1ckYbQLJLZ+5k+F0vMeM5YlwWViyMVM5HCxbAmDvR+g0Dn6zGh1W0eSHkGzMmzlvzQhVth2yiZQURGrKOtYgAfR/ZzBeYiYxqLnzZwW92Zphd2HJgeEDBeFVHVtt/tAFEjKvTiR3VAzzXbqfVSpxVcFIuFXOY1W/x+8QTeHZYAzGEthVECBLh8Nu3QIQjv7fal2W4dkw4NRLXF4oynL56/H00AiRIv+SS1iVMGJJZpEb995q2q8T0PlCfthVECNWVmjvQwG0NJE2AvDO7OurQlIKHfX9GZN5aEZ6i5dEKkAJIUtGbmfURKgiZBtHJbXG1El1avKVBSBMgvU7MLYl+kX0qy6gu7eYAkty0A2Tjsik793SNu49AWkMPoLkAjPQkKHZsAqSQvn0ig5RqEm49DeqFQMtNrXaA9H7UTYv68O8D1Io7lhocYvqIjuKTiu+4UvexDpDOJdOO9H3/fiUnlnQWady8o3G0ebYaGXbdACIUZZOxM4n0ZvkVBqBYHFTnxMjIGssACah03SYy+GjVCgKV5jKQFaRPmedYWnLYS40Pt3aPp1nrRIzVqHvGKkACAof4Pq0px7zWFyZQgAhjtN6yDxydb0w25615ptYBj3T7sQiQrBO9iEBXafc94Roz7iqTiAxlV+AAyV5r7UvjsBKsp2zB4MHwF0w78xPtjg9Q4FgDiJeK3gumY7W7lOg3ZjytWnVgWLMCB0hhFVlifQo+7hnWGrkGi03bnS/Xtf69xgpAXl82JdzVNT6jqSrYoIki4J/cYhxtzg5+B1EXgBS3WmIpFN8kATy0uiU//j91lFcIwLhBIscCQDoWTz3JMIy7g/IlGTgxPNf9ZVDyB8qtG0CE0qwTvYpAFwUyMMLbedBxk+JpQTzQsM+2DpCszlJ5ZWax3pEVdQWIGK/uwLStfUhfNe10Y5VkHmDktgyQrGP9iABtXGelc1tvcAj9dQdIASSOdRMDWmpFlDixG+CTgyiBrGtJ2pYBkltiXcK+1sDDfrePBDhGDCC93yTqJaZLX9pqas7petFl5WzLACn++NVC+FCVG0cKHCMKkAJIUtY9YGgKTeafmXbmtKo8PoKNtnWAiJJ9ZBg/r4LwoapZGElwjDhAeleS6O8BOrwqb1Vu9IJhGMfqJppWtKls920dIGLQungKfN8/vX3e2tuCmIdqZY7IN0ipcRpKfn3OtN3bqx30SLYbCwAR/lXl+mUgHrFd5bJ/qnPdEADpXUmsh2QqqhLhynDcvVTVEfXqP1YAUpzTR2S4fhn0zYidvqxeczKUnoYBSHG7dQ1AF1TrGEF52T2+++O7z1on6EtHxTOmANJLkCHIPKrm+vWZzmjXUOhV18vQUAARg+pwoicaVSbTkMHRoMKcdTm4zHayoQroBDXOPrlZx5pLQKoKPa+FWvzDgiQOr8KGrZo0HEAKK0ly6hTAEGWexw8xqHNN210mM+iR7DOWVpA+Pw9bbJWw1tRMfq1rjhsSIGJwueutPXgL/RjlCYy1U+3rcuhwcsYiQAof7RXKSzPhR5G4+6Xh/DZSf29YgAiHPLRgZsuHJ3Y7AJ83wEHd+XG016Tz0tmRcpqK3rEKkJxjHcrA2gG+20KE/9ZVzFVlTobq29AAGbBE9xdSIaZPhzXVWQ/KqUPJHasAKWydHUsQCwqCwafQC45fjcQc1KJzVACk6NxZAA42bffcWgbYaG3HMkAKW2fHurMIjvWNNjfl7Bk1ABkNzqzGxrEOkGp81EhtmgCp82w0AVJnhyuqawJE0YG1dm8CpFaPjWz7JkDq7P8mQOrscEV1TYAoOrDW7k2A1OqxkW3fBEid/d8ESJ0drqiuCRBFB9bavQmQWj02su2bAKmz/5sAqbPDFdU1AaLowFq7NwFSq8dGtn0TIHX2fxMgdXa4oromQBQdWGv3rGNlCTBr7SfaM+BFbDci07fZR84DTYDI+U26l2xqcVHhw6btqhJcSNs+Fjs2AVLnWfdS1jIwzpFSS7jBjLsiaLP51MkDTYDUydF9arKOdRYBN8moZeDsiO3eLNO32UfOA02AyPlNqZfnRJcDdHxtQniFaWdOqK1Ps7WqB5oAUfWgZP9aT7NM223OlaSvVbo1na7iPcW+HcnoAoPoW0OJ8Zm/3Z7ILFBU1ewu6YEmQCQdp6ub50Q/T6CPM7AfQPv1yuVnCHiGwb8fbSXmdPmlUeQ0AdIoM9G0oyE90ARIQ05L06hG8UATII0yE007GtID/w/Jiqv1e0ZE2QAAAABJRU5ErkJggg==
// @author       Wizos
// @namespace    https://blog.wizos.me
// @supportURL   wizos@qq.com
// @match        http://*/*
// @match        https://*/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js
// @resource     RulerJs  https://fastly.jsdelivr.net/gh/wizos/rssplus/Ruler.js
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @connect      rssplus.vercel.app
// @connect      rssplus.pages.dev
// @connect      rssfind.val.run
// @connect      rssplus.deno.dev
// @connect      rssplus.mdict.workers.dev
// @noframes
// @run-at     document-idle
// @downloadURL https://update.greasyfork.org/scripts/373252/RSS%2B%20%3A%20Show%20Site%20All%20RSS.user.js
// @updateURL https://update.greasyfork.org/scripts/373252/RSS%2B%20%3A%20Show%20Site%20All%20RSS.meta.js
// ==/UserScript==

// 2025.06.29_1.1.4  1.由于流量过大，增加 rssplus.pages.dev, rssfind.val.run, rssplus.deno.dev, rssplus.mdict.workers.dev 域名。2.修复无法使用自定义 RSSHub 域名。3.增加 Folo 订阅。
// 2025.04.05_1.1.3  1.修复火狐136版本无法查看 RSS 问题。2. 支持 NewsBlur 和 The Old Reader。3. 全屏时隐藏图标。4. 保持订阅源 URL 大小写。
// 2025.01.16_1.1.2  1.使用 TTP 给元素增加 innerHTML。2、增加识别 feed.json。
// 2024.10.20_1.1.1  1.修复未开启远程规则的问题。2.增加更多的网站适配。
// 2024.10.08_1.0.9  1.增加支持葡萄牙语和法语（感谢Filipe Mota (BlackSpirits)提供的翻译）。2.支持 RSSHub 访问密钥。3.重构代码。
// 2022.10.18_1.0.8  1.修复 TinyTinyRSS 订阅地址错误问题。2.修复 Bug。
// 2022.07.04_1.0.7  支持用Miniflux订阅（感谢Sevichecc提供的代码https://gist.github.com/Sevichecc/f5608c4ad52e71d98f6fcf74110369df）
// 2022.07.04_1.0.6  修复火狐上因为GSAP库导致无法使用问题
// 2022.05.20_1.0.5  1.解决 jsdelivr 在中国被墙的问题。2.修复bilibili video页面获取feed标题异常问题。
// 2022.04.18_1.0.4  修复导致网页加载卡顿的问题。
// 2022.04.05_1.0.2  1.受unsafe-eval影响，无法本地执行规则时使用远程规则，改用 rssplus.vercel.app 接口。2.调整 UI，每次获取到新 RSS 都同步到 UI 中。3.精简设置项。4.监听 URL 变化，同步获取新的 RSS。
// 2022.04.02_1.0.0  1.将远程规则放到 GitHub。2.修复订阅 RSS 网址的转义问题。
// 2021.12.17_0.9.2  1.支持设置 FreshRSS 一键订阅。2.支持设置带端口的网址。
// 2021.02.24_0.9.1  1.支持开启/关闭二维码。
// 2021.02.19_0.9.0  1.支持鼠标悬停在订阅链接上时展示其二维码，方便扫码订阅。
// 2021.02.05_0.8.1  1.url参数用base64编码，防止服务端获取url参数时，漏掉query部分的数据。
// 2021.02.03_0.8.0  1.支持小屏幕展示。2.支持设置 TinyTinyRSS 服务的域名。
// 2021.01.05_0.7.3  1.改用 GM_xmlhttpRequest。2.改用 rssfinder.vercel.app 接口。
// 2020.12.16_0.7.2  1.修复 bug。
// 2020.12.06_0.7.1  1.调整搞定。2.优化代码。
// 2020.11.16_0.7.0  1.支持设置 InoReader 服务的域名。2.在打印页面时隐藏。3.修复影响页面样式的问题。
// 2020.09.11_0.6.4  1.支持 RSSHub 服务器为 IP 地址。2.被识别的 RSS 地址不再转换为小写（因为 news.google.com 的小写地址打不开）
// 2020.04.28_0.6.3  修复改了脚本name导致无法更新的bug。
// 2020.04.27_0.6.2  修复rsshub domain默认为undefined的bug。
// 2020.04.26_0.6.1  支持设置 RSSHub 服务的域名。
// 2020.03.01_0.6    1.可设置点击“订阅”时打开的rss服务商(feedly,inoreadly)。2.修复火狐浏览器下无法展示的问题。
// 2019.09.29_0.5    增加hexo站点的rss嗅探规则。
// 2019.04.26_0.4.2  1.修复默认圆圈状态下宽度太宽，导致遮挡下层页面事件触发的问题。2.将icon由字体改为svg形式，修复部分站点无法显示icon的问题。3.优化RSS没有title时的默认名称。
// 2018.11.10_0.4.1  关闭发现RSS后的h5通知
// 2018.10.29_0.4    1.在无法链接服务器时也能展示本地的RSS；2.针对开启 Content-Security-Policy 的网站直接展示本地的RSS；3.发现RSS后，进行h5通知
// 2018.10.23_0.4    1.增加识别为 wordpress 站点时，尝试使用/feed后缀；2.增加多语言支持
// 2018.10.16_0.3    1.改为iframe方式显示，兼容性更好；2.改为post方式传递页面地址；
// 2018.10.14_0.2    第一版 RSS+ 成型；
// 2018.09.16_0.1    在 RSS+Atom Feed Subscribe Button Generator 脚本基础上增加连接后端获取feed的方式；

(function() {
    'use strict';

    // 过滤掉明确不包含 RSS 源的URL
    if (location.href.match(/(api\.wizos\.me)|(feedly\.com\/i\/subscription)|(inoreader\.com\/feed\/http)/i)) {
        return;
    }
    // 修复火狐上不支持 trustedTypes 问题
    if (typeof window.trustedTypes === 'undefined') {
        window.trustedTypes = {
            createPolicy: function(name, rules) {
                return rules;
            }
        };
    }

    // 国际化文本
    const i18n = {
        zh: {
            noTitle: "无标题",
            copied: "已复制",
            copy: "复制",
            copySucceeded: "复制成功",
            follow: "订阅",
            found: "发现 ",
            feed: "订阅源数量：",
            clickToView: "点击右下角的数字查看",
            useFeedly: "使用 Feedly 订阅",
            useInoreader: "使用 Inoreader 订阅",
            useTinytinyrss: "使用 Tiny Tiny RSS 订阅",
            useFreshrss: "使用 FreshRSS 订阅",
            useMiniflux: "使用 Miniflux 订阅",
            useFoloReader: "使用 Folo 订阅",
            useNewsBlur: "使用 NewsBlur 订阅",
            useTheOldReader: "使用 The Old Reader 订阅",
            settingRSShubDomain: "设置 RSSHub 的域名",
            settingRSShubAccessKey: "设置 RSSHub 的访问密钥",
            settingInoreaderDomain: "设置 Inoreader 的域名",
            settingTinytinyrssDomain: "设置 Tiny Tiny RSS 的域名",
            settingFreshrssDomain: "设置 FreshRSS 的域名",
            settingMinifluxDomain: "设置 Miniflux 的域名",
            domainIsWrong: "服务器地址格式有误，请检查",
            enableQRCode: "启用/禁用二维码",
            enabled: "已启用",
            disabled: "已禁用",
            close: "关闭"
        },
        zhtw: {
            noTitle: "無標題",
            copied: "已複製",
            copy: "複製",
            copySucceeded: "複製成功",
            follow: "訂閱",
            found: "發現 ",
            feed: "訂閱源數量：",
            clickToView: "點擊右下角的數字查看",
            useFeedly: "使用 Feedly 訂閱",
            useInoreader: "使用 Inoreader 訂閱",
            useTinytinyrss: "使用 Tiny Tiny RSS 訂閱",
            useFreshrss: "使用 FreshRSS 訂閱",
            useMiniflux: "使用 Miniflux 訂閱",
            useFoloReader: "使用 Folo 訂閱",
            useNewsBlur: "使用 NewsBlur 訂閱",
            useTheOldReader: "使用 The Old Reader 訂閱",
            settingRSShubDomain: "設定 RSSHub 的網域",
            settingRSShubAccessKey: "設定 RSSHub 的存取密鑰",
            settingInoreaderDomain: "設定 Inoreader 的網域",
            settingTinytinyrssDomain: "設定 Tiny Tiny RSS 的網域",
            settingFreshrssDomain: "設定 FreshRSS 的網域",
            settingMinifluxDomain: "設定 Miniflux 的網域",
            domainIsWrong: "伺服器位址格式有誤，請檢查",
            enableQRCode: "啟用/停用 QR 碼",
            enabled: "已啟用",
            disabled: "已停用",
            close: "關閉"
        },
        en: {
            noTitle: "Untitled",
            copied: "Copied",
            copy: "Copy",
            copySucceeded: "Copy succeeded",
            follow: "Subscribe",
            found: "Found ",
            feed: "Number of feeds: ",
            clickToView: "Click the number in the bottom right to view",
            useFeedly: "Use Feedly subscription",
            useInoreader: "Use Inoreader subscription",
            useTinytinyrss: "Use Tiny Tiny RSS subscription",
            useFreshrss: "Use FreshRSS subscription",
            useMiniflux: "Use Miniflux subscription",
            useFoloReader: "Use Folo subscription",
            useNewsBlur: "Use NewsBlur subscription",
            useTheOldReader: "Use The Old Reader subscription",
            settingRSShubDomain: "Set RSSHub domain",
            settingRSShubAccessKey: "Set RSSHub access key",
            settingInoreaderDomain: "Set Inoreader domain",
            settingTinytinyrssDomain: "Set Tiny Tiny RSS domain",
            settingFreshrssDomain: "Set FreshRSS domain",
            settingMinifluxDomain: "Set Miniflux domain",
            domainIsWrong: "Error in domain name format. Please check",
            enableQRCode: "Enable/disable QR code",
            enabled: "Enabled",
            disabled: "Disabled",
            close: "Close"
        },
        ja: {
            noTitle: "無題",
            copied: "コピーしました",
            copy: "コピー",
            copySucceeded: "コピーに成功しました",
            follow: "購読",
            found: "見つかりました ",
            feed: "フィード数：",
            clickToView: "右下の数字をクリックして表示",
            useFeedly: "Feedly で購読",
            useInoreader: "Inoreader で購読",
            useTinytinyrss: "Tiny Tiny RSS で購読",
            useFreshrss: "FreshRSS で購読",
            useMiniflux: "Miniflux で購読",
            useFoloReader: "Folo で購読",
            useNewsBlur: "NewsBlur で購読",
            useTheOldReader: "The Old Reader で購読",
            settingRSShubDomain: "RSSHub のドメインを設定",
            settingRSShubAccessKey: "RSSHub のアクセスキーを設定",
            settingInoreaderDomain: "Inoreader のドメインを設定",
            settingTinytinyrssDomain: "Tiny Tiny RSS のドメインを設定",
            settingFreshrssDomain: "FreshRSS のドメインを設定",
            settingMinifluxDomain: "Miniflux のドメインを設定",
            domainIsWrong: "サーバーアドレスの形式に問題があります。確認してください",
            enableQRCode: "QRコードの有効/無効を切り替え",
            enabled: "有効",
            disabled: "無効",
            close: "閉じる"
        },
        ko: {
            noTitle: "제목 없음",
            copied: "복사됨",
            copy: "복사",
            copySucceeded: "복사 성공",
            follow: "구독",
            found: "발견 ",
            feed: "피드 수: ",
            clickToView: "오른쪽 하단의 숫자를 클릭하여 보기",
            useFeedly: "Feedly로 구독",
            useInoreader: "Inoreader로 구독",
            useTinytinyrss: "Tiny Tiny RSS로 구독",
            useFreshrss: "FreshRSS로 구독",
            useMiniflux: "Miniflux로 구독",
            useFoloReader: "Folo로 구독",
            useNewsBlur: "NewsBlur로 구독",
            useTheOldReader: "The Old Reader로 구독",
            settingRSShubDomain: "RSSHub 도메인 설정",
            settingRSShubAccessKey: "RSSHub 액세스 키 설정",
            settingInoreaderDomain: "Inoreader 도메인 설정",
            settingTinytinyrssDomain: "Tiny Tiny RSS 도메인 설정",
            settingFreshrssDomain: "FreshRSS 도메인 설정",
            settingMinifluxDomain: "Miniflux 도메인 설정",
            domainIsWrong: "서버 주소 형식에 문제가 있습니다. 확인해 주세요",
            enableQRCode: "QR 코드 활성화/비활성화",
            enabled: "활성화됨",
            disabled: "비활성화됨",
            close: "닫기"
        },
        ptpt: {
            noTitle: "Sem título",
            copied: "Copiado",
            copy: "Copiar",
            copySucceeded: "Cópia bem-sucedida",
            follow: "Seguir",
            found: "Encontrado ",
            feed: "Número de feeds: ",
            clickToView: "Clique no número no canto inferior direito para visualizar",
            useFeedly: "Utilizar a subscrição do Feedly",
            useInoreader: "Utilizar a subscrição do InoReader",
            useTinytinyrss: "Utilizar a subscrição do TinyTinyRSS",
            useFreshrss: "Utilizar a subscrição do FreshRSS",
            useMiniflux: "Utilizar a subscrição do Miniflux",
            useFoloReader: "Utilizar a subscrição do Folo",
            useNewsBlur: "Utilizar a subscrição do NewsBlur",
            useTheOldReader: "Utilizar a subscrição do The Old Reader",
            settingRSShubDomain: "Definir o domínio do RSSHub",
            settingRSShubAccessKey: "Definir a chave de acesso do RSSHub",
            settingInoreaderDomain: "Definir o domínio do InoReader",
            settingTinytinyrssDomain: "Definir o domínio do TinyTinyRSS",
            settingFreshrssDomain: "Definir o domínio do FreshRSS",
            settingMinifluxDomain: "Definir o domínio do Miniflux",
            domainIsWrong: "Erro no formato do nome do domínio. Por favor, verifica-o",
            enableQRCode: "Ativar/desativar o código QR",
            enabled: "Ativado",
            disabled: "Desativado",
            close: "Fechar"
        },
        ptbr: {
            noTitle: "Sem título",
            copied: "Copiado",
            copy: "Copiar",
            copySucceeded: "Copiado com sucesso",
            follow: "Seguir",
            found: "Encontrado ",
            feed: "Número de feeds: ",
            clickToView: "Clique no número no canto inferior direito para visualizá-lo",
            useFeedly: "Usar assinatura do Feedly",
            useInoreader: "Usar assinatura do Inoreader",
            useTinytinyrss: "Usar assinatura do Tiny Tiny RSS",
            useFreshrss: "Usar assinatura do FreshRSS",
            useMiniflux: "Usar assinatura do Miniflux",
            useFoloReader: "Usar assinatura do Folo",
            useNewsBlur: "Usar assinatura do NewsBlur",
            useTheOldReader: "Usar assinatura do The Old Reader",
            settingRSShubDomain: "Configurar domínio do RSSHub",
            settingRSShubAccessKey: "Configurar chave de acesso do RSSHub",
            settingInoreaderDomain: "Configurar domínio do Inoreader",
            settingTinytinyrssDomain: "Configurar domínio do Tiny Tiny RSS",
            settingFreshrssDomain: "Configurar domínio do FreshRSS",
            settingMinifluxDomain: "Configurar domínio do Miniflux",
            domainIsWrong: "Erro no formato do nome de domínio. Por favor, verifique",
            enableQRCode: "Ativar/desativar código QR",
            enabled: "Ativado",
            disabled: "Desativado",
            close: "Fechar"
        },
        fr: {
            noTitle: "Sans titre",
            copied: "Copié",
            copy: "Copier",
            copySucceeded: "Copie réussie",
            follow: "S'abonner",
            found: "Trouvé ",
            feed: "Nombre de flux : ",
            clickToView: "Cliquer sur le numéro en bas à droite pour le visualiser",
            useFeedly: "Utiliser l'abonnement Feedly",
            useInoreader: "Utiliser l'abonnement Inoreader",
            useTinytinyrss: "Utiliser l'abonnement Tiny Tiny RSS",
            useFreshrss: "Utiliser l'abonnement FreshRSS",
            useMiniflux: "Utiliser l'abonnement Miniflux",
            useFoloReader: "Utiliser l'abonnement Folo",
            useNewsBlur: "Utiliser l'abonnement NewsBlur",
            useTheOldReader: "Utiliser l'abonnement The Old Reader",
            settingRSShubDomain: "Configuration du domaine RSSHub",
            settingRSShubAccessKey: "Configuration la clé d'accès de RSSHub",
            settingInoreaderDomain: "Configuration du domaine Inoreader",
            settingTinytinyrssDomain: "Configuration du domaine TinyTinyRSS",
            settingFreshrssDomain: "Configuration du domaine FreshRSS",
            settingMinifluxDomain: "Configuration du domaine Miniflux",
            domainIsWrong: "Erreur dans le format du nom de domaine. Veuillez vérifier",
            enableQRCode: "Activer/désactiver le code QR",
            enabled: "Activé",
            disabled: "Désactivé",
            close: "Fermer"
        }
    };

    const ICON_CLOSE = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>'
    i18n.zhcn = i18n.zh;
    // 获取当前语言
    const lang = (navigator.language || 'en').replace('-', "").toLowerCase();
    const t = i18n[lang] || i18n.en;

    const proxyList = [
        "https://rssplus.vercel.app/",
        "https://rssplus.pages.dev/",
        "https://rssfind.val.run/",
        "https://rssplus.deno.dev/",
        "https://rssplus.mdict.workers.dev/"
    ];

    GM_registerMenuCommand(t.useFeedly, function() {
        GM_setValue("rss_service", "feedly");
    });
    GM_registerMenuCommand(t.useInoreader, function() {
        const input = window.prompt(t.settingInoreaderDomain, GM_getValue("inoreader_domain", "https://www.inoreader.com"));
        if (input !== null) {
            if (isValidUrl(input)) {
                GM_setValue("inoreader_domain", input);
                GM_setValue("rss_service", "inoreader");
            } else {
                alert(t.domainIsWrong);
            }
        }
    });
    GM_registerMenuCommand(t.useTinytinyrss, function() {
        const input = window.prompt(t.settingTinytinyrssDomain, GM_getValue("tinytinyrss_domain", "https://www.example.com"));
        if (input !== null) {
            if (isValidUrl(input)) {
                GM_setValue("tinytinyrss_domain", input);
                GM_setValue("rss_service", "tinytinyrss");
            } else {
                alert(t.domainIsWrong);
            }
        }
    });
    GM_registerMenuCommand(t.useFreshrss, function() {
        const input = window.prompt(t.settingFreshrssDomain, GM_getValue("freshrss_domain", "https://www.example.com"));
        if (input !== null) {
            if (isValidUrl(input)) {
                GM_setValue("freshrss_domain", input);
                GM_setValue("rss_service", "freshrss");
            } else {
                alert(t.domainIsWrong);
            }
        }
    });
    GM_registerMenuCommand(t.useMiniflux, function() {
        const input = window.prompt(t.settingMinifluxDomain, GM_getValue("miniflux_domain", "https://www.example.com"));
        if (input !== null) {
            if (isValidUrl(input)) {
                GM_setValue("miniflux_domain", input);
                GM_setValue("rss_service", "miniflux");
            } else {
                alert(t.domainIsWrong);
            }
        }
    });
    GM_registerMenuCommand(t.useFoloReader, function() {
        GM_setValue("rss_service", "folo");
    });
    GM_registerMenuCommand(t.useNewsBlur, function() {
        GM_setValue("rss_service", "newsblur");
    });
    GM_registerMenuCommand(t.useTheOldReader, function() {
        GM_setValue("rss_service", "theoldreader");
    });
    GM_registerMenuCommand(t.enableQRCode, function() {
        if (!GM_getValue("enable_qr_code", true)) {
            GM_setValue("enable_qr_code", true);
            GM_notification({
                text: t.enabled,
                title: t.enableQRCode,
                timeout: 2000
            });
        } else {
            GM_setValue("enable_qr_code", false);
            GM_notification({
                text: t.disabled,
                title: t.enableQRCode,
                timeout: 2000
            });
        }
    });

    GM_registerMenuCommand(t.settingRSShubDomain, function() {
        const input = window.prompt(t.settingRSShubDomain, GM_getValue("rsshub_domain", "https://rsshub.app"));
        if (input !== null) {
            if (isValidUrl(input)) {
                GM_setValue("rsshub_domain", input);
            } else {
                alert(t.domainIsWrong);
            }
        }
    });

    GM_registerMenuCommand(t.settingRSShubAccessKey, function() {
        const input = window.prompt(t.settingRSShubAccessKey, GM_getValue("rsshub_access_key"));
        if (input !== null) {
            GM_setValue("rsshub_access_key", input);
        }
    });

    // 使用 forceInner 可能会报错 forceInner 被禁用
    // 使用 default ，这将禁用 TrustedHTML 分配（CSP）保护
    // window.trustedTypes.createPolicy('default', {createHTML: (string, sink) => string});
    // WORKAROUND: TypeError: Failed to set the 'innerHTML' property on 'Element': This document requires 'TrustedHTML' assignment.
    const TTP = window.trustedTypes.createPolicy("forceInner", {
        createHTML: (x) => x
    });

    // 主要功能类
    const feedsSet = new Set();
    const suffixes = [
        '/feed', '/rss', '/rss.xml', '/atom.xml', '/feed.xml', '/rss.json', '/atom.json', '/feed.json', //'/index.xml',
        '/?feed=rss', '/?feed=rss2', '/blog/feed', '/blog/rss', '/latest/rss',
        '/news/atom', '/feed/index.xml'
    ];
    let rpDiv;
    let rpStyle;
    let rpIframe;
    let rpDocument;
    let rpBadge;
    let rpDialog;
    let rpDialogTitle;
    let rpDialogFeeds;

    // 检测Feed
    function findFeeds() {
        const rpDiv = document.getElementById('rss-plus');
        if(rpDiv){
            return;
        }
        findKnownFeeds();
        findUnknownFeeds();
        findCloudFeeds();
    }

    // 检测已知的Feed
    // 获取在<head>的<link>元素中，已经声明为RSS的链接
    function findKnownFeeds() {
        const links = document.getElementsByTagName("link");
        for (const link of links) {
            const { href, type, title = document.title } = link;
            if (type && (type.match(/.+\/(rss|rdf|atom|feed\+json)/i) || type.match(/^text\/xml$/i))) {
                addFeed(title, href);
            }
        }
    }

    // 寻找未明确标示的RSS源
    function findUnknownFeeds() {
        // links 属性返回一个文档中所有具有 href 属性值的 <area> 元素与 <a> 元素的集合
        const links = document.links || document.getElementsByTagName("a");
        for (const link of links) {
            const href = link.href;
            if (
                href.match(/^(https|http|ftp|feed).*([.\/]rss([.\/]xml|\.aspx|\.jsp|\/)?$|\/node\/feed$|\/feed(\.xml|\/$|$)|\/rss\/[a-z0-9]+$|[?&;](rss|xml)=|[?&;]feed=rss[0-9.]*$|[?&;]action=rss_rc$|feeds\.feedburner\.com\/[\w\W]+$)/i)
                || href.match(/^(https|http|ftp|feed).*\/atom(\.xml|\.aspx|\.jsp|\/)?$|[?&;]feed=atom[0-9.]*$/i)
                || href.match(/^(https|http|ftp|feed).*(\/feeds?\/[^.\/]*\.xml$|.*\/index\.xml$|feed\/msgs\.xml(\?num=\d+)?$)/i)
                || href.match(/^(https|http|ftp|feed).*\.rdf$/i)
                || href.match(/^(rss|feed):\/\//i)
                || href.match(/^(https|http):\/\/feed\./i)
            ) {
                addFeed(link.title || link.textContent || link.innerText || document.title, href);
            }
        }

        checkFeedForPlatform("html > head > link", /(wp-content)/i); // WordPress
        checkFeedForPlatform("html > body footer a", /(bitcron\.com|typecho\.org|hexo\.io)/i); // Blog platforms
    }

    function findCloudFeeds() {
        const url = optimizeLink(location.href);
        const res = document.documentElement.outerHTML;
        try {
            findCloudFeedsByEval(url, res);
        } catch (e) {
            console.error("无法通过 Eval 执行：", e);
            findCloudFeedsByAPI(url);
        }
    }
    function findCloudFeedsByEval(url, res) {
        return function(jsStr, url, res) {
            if (isEmpty(jsStr)) {
                throw new Error("未获取到可执行脚本");
            }
            const Ruler = Function(`"use strict";return (${jsStr})`)();

            const list = Ruler.find(url, res);
            if (!list) {
                return;
            }
            list.forEach(element => {
                addFeed(element.title || document.title, element.link);
            });
        }.call(window, GM_getResourceText('RulerJs'), url, res);
    }

    function findCloudFeedsByAPI(url) {
        console.log("请求远程：" + url);
        try {
            fetch(`${proxyList[Math.floor(Math.random() * proxyList.length)]}api/find?url=${encodeURIComponent(url)}`, {method: 'get', timeout: 5000}) // 设置超时
                .then(async response => {
                    if (response.status === 200) {
                        const obj = JSON.parse(await response.text());
                        if (!obj) {
                            return;
                        }
                        obj.forEach(element => {
                            addFeed(element.title || document.title, element.link);
                        });
                    }
                })
                .catch(err => console.error('检测 feed 异常：', err))
        } catch (error) {
            console.error('检测 feed 异常：', error);
        }
    }
    function checkFeedForPlatform(selector, regex) {
        const links = document.querySelectorAll(selector);
        for (const link of links) {
            if (link.href.match(regex)) {
                checkFeed(`${document.location.protocol}//${document.domain}`);
                break; // 找到匹配项后立即退出
            }
        }
    }
    async function checkFeed(url) {
        try {
            const requests = suffixes.map(suffix =>
                fetch(url + suffix, {method: 'HEAD', timeout: 5000}) // 设置超时
                    .then(response => {
                        if (response.status === 200) {
                            addFeed(document.title, url + suffix);
                        }
                    })
                    .catch(err => console.error('检测 feed 异常：', err))
            );
            await Promise.all(requests); // 并行处理所有请求
        } catch (error) {
            console.error('检测 feed 异常：', error);
        }
    }

    // 添加Feed
    function addFeed(title, url) {
        console.log("添加RSS：" + title + " => " + url);
        if (url.match(/(api\.wizos\.me)|(feedly\.com\/i\/subscription)|(inoreader\.com\/feed\/http)/i)) {
            return;
        }

        if (feedsSet.size === 0){
            initUI();
        }
        let absoluteUrl = new URL(url, document.location.href).href;
        let lookupValue = absoluteUrl.toLowerCase();

        if (!feedsSet.has(lookupValue)) {
            feedsSet.add(lookupValue);
            if(url.match(/^https*:\/\/rsshub.app/i)){
                const rsshubDomain = GM_getValue("rsshub_domain");
                if(rsshubDomain != null && rsshubDomain !== ""){
                    absoluteUrl = absoluteUrl.replace(/^https*:\/\/rsshub.app/i, rsshubDomain);
                }

                const rsshubAccessKey = GM_getValue("rsshub_access_key");
                if(rsshubAccessKey != null && rsshubAccessKey !== ""){
                    const uri = new URL(absoluteUrl);
                    uri.searchParams.set('key', rsshubAccessKey);
                    absoluteUrl = uri.href;
                }
            }

            updateBadge();
            updateDialog(title || t.noTitle, absoluteUrl);
        }
    }

    function observeUrlChange() {
        const _historyWrap = function(type) {
            const orig = history[type];
            const e = new Event(type);
            return function() {
                const rv = orig.apply(this, arguments);
                e.arguments = arguments;
                window.dispatchEvent(e);
                return rv;
            };
        };
        history.pushState = _historyWrap('pushState');
        history.replaceState = _historyWrap('replaceState');

        window.addEventListener('pushState', () => {
            window.dispatchEvent(new Event('locationchange'));
        });
        window.addEventListener('replaceState', () => {
            window.dispatchEvent(new Event('locationchange'));
        });
        window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event('locationchange'));
        });
        window.addEventListener('hashchange', function() {
            window.dispatchEvent(new Event('locationchange'));
        }, false);
        window.addEventListener('locationchange', ()=> {
            reset();
            findFeeds();
        });
    }

    // 初始化UI
    function initUI() {
        rpStyle = document.createElement('style');
        rpStyle.innerHTML = TTP.createHTML(
            `
@media print {
    #rss-plus {
        display: none;
    }
}

#rss-plus {
    position: fixed;
    bottom: 60px;
    right: 5px;
    z-index: 9999;
}

#rss-plus > iframe {
    display: block !important;
    max-width: 100% !important;
    border: 0px !important;
}
            `
        );
        document.head.appendChild(rpStyle);

        rpDiv = document.createElement('div');
        rpDiv.id = 'rss-plus';
        document.body.appendChild(rpDiv);

        rpIframe = document.createElement("iframe");
        rpIframe.id = "rss-plus-iframe";
        rpIframe.allowTransparency = "true";
        if (navigator.userAgent.indexOf("Firefox") !== -1) {
            rpIframe.src = "javascript:";
        }
        rpDiv.appendChild(rpIframe);
        rpDocument = rpIframe.contentDocument || rpIframe.contentWindow.document;// || rssPlusEnvironment.window.document;

        const rpBoxStyle = rpDocument.createElement("style");

        rpBoxStyle.textContent = TTP.createHTML(`
.hover-reveal {
    position: fixed;
    width: 80px;
    height: 80px;
    top: 0;
    left: 0;
    pointer-events: none;
    opacity: 0
}

.hover-reveal__inner,.hover-reveal__img {
    width: 100%;
    height: 100%;
    position: relative
}

.hover-reveal__deco {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #181314
}

.hover-reveal__img {
    background-size: cover;
    background-position: 50% 50%
}

body {
    margin: 0px;
}

#rp-box, #rp-badge, #rp-dialog {
    width: 100%;
    position: fixed;
    z-index: 99999;
    bottom: 0px;
    right: 0px;
}

#rp-badge {
    background: #4b5979;
    color: white;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
    float: right;
    min-width: 20px;
    border: 1px solid #fff;
    white-space: nowrap;
}

#rp-badge:hover {
    border-color: #e9eaec;
}

#rp-dialog {
    display: none;
    height: 100%;
}

#rp-dialog-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    background: white;
    border-radius: 5px;
    border: 2px dashed rgb(209, 217, 224);
}

#rp-dialog-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    border-radius: 5px 5px 0 0;
    padding: 5px 10px 5px 10px;
    background-color: #f8f8f9;
}

#rp-dialog-feeds-container {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 5px;
    padding: 0px;
    overflow-y: auto;
}

#rp-dialog-feeds {
    list-style-type: none;
    padding: 0px 10px 5px 10px;
    margin: 0;
}

.rss-title {
    font-weight: bold;
    margin: 5px 0 5px 0;
}

.rss-link {
    color: #666;
    font-size: 0.9em;
    word-break: break-all;
    margin: 5 0 5 0;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 70vw;
}

.rss-actions {
    display: flex;
    justify-content: space-between;
}

.rss-btn {
    background: #4b5979;
    color: white;
    border: none;
    padding: 3px 8px;
    margin-right: 5px;
    cursor: pointer;
    border-radius: 3px;
}

.rp-dialog-count {
    font-weight: bold;
    color: #ed3f14;
}

.rp-badge-count {
    position: relative;
    display: inline-block;
    width: 26px;
    height: 26px;
    color: #fff;
    text-align: center;
    font-size: 12px;
    line-height: 26px;
}

.rp-badge-count a,.rp-badge-count a:hover {
    color: #fff
}

.rp-btn {
    cursor: pointer;
    display: inline-block;
    border: 1px solid transparent;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    font-weight: 400;
}

.rp-btn>.rp-icon {
    line-height: 1
}

.rp-btn:hover {
    color: #6d7380;
    background-color: #f9f9f9;
    border-color: #e4e5e7
}

.rp-btn>.rp-icon+span,.rp-btn>span+.rp-icon {
    margin-left: 4px
}

.rp-btn-primary {
    color: #fff;
    background-color: #2d8cf0;
    border-color: #2d8cf0;
}

.rp-btn-primary:hover {
    color: #fff;
    background-color: #57a3f3;
    border-color: #57a3f3
}

.rp-btn-small {
    padding: 2px 7px;
    font-size: 12px;
    border-radius: 3px;
    margin: 5px;
    color: #495060;
    background-color: #f7f7f7;
}

.rss-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
}
        `);
        rpDocument.head.appendChild(rpBoxStyle);

        const rpBadgeDiv = rpDocument.createElement("div");
        rpBadgeDiv.id = "rp-badge";
        // 方法 1
        //const span = rpDocument.createElement("span");
        //span.classList.add("rp-badge-count", "rp-count");
        //rpBadgeDiv.appendChild(span);
        // 方法 2
        rpBadgeDiv.innerHTML = TTP.createHTML(`<span class="rp-badge-count rp-count"></span>`);
        rpDocument.body.appendChild(rpBadgeDiv);

        rpDialog = rpDocument.createElement("div");
        rpDialog.id = "rp-dialog";
        rpDialog.innerHTML = TTP.createHTML( `
<div id="rp-dialog-container">
<div id="rp-dialog-title">
<div>${t.feed}<span class="rp-dialog-count rp-count"></span></div>
<button type="button" id="rp-close-btn" class="rp-btn rp-btn-small" title="${t.close}"><span>${ICON_CLOSE}</span></button>
</div>
<div id="rp-dialog-feeds-container">
<ul id="rp-dialog-feeds"></ul>
</div>
</div>
`);
        rpDocument.body.appendChild(rpDialog);

        rpBadge = rpDocument.getElementById("rp-badge");
        rpDialog = rpDocument.getElementById("rp-dialog");
        rpDialogTitle = rpDocument.getElementById("rp-dialog-title");
        rpDialogFeeds = rpDocument.getElementById("rp-dialog-feeds");

        rpIframe.style.width = rpBadge.getBoundingClientRect().width + "px";
        rpIframe.style.height = rpBadge.getBoundingClientRect().height + "px";

        addEventHandler(rpDocument.getElementById("rp-close-btn"), "click", function () {
            rpDialog.style.display = "none";
            rpBadge.style.display = "block";
            rpIframe.style.width = rpBadge.getBoundingClientRect().width + "px";
            rpIframe.style.height = rpBadge.getBoundingClientRect().height + "px";
        });

        rpDocument.getElementById("rp-badge").addEventListener("click", () => {
            if (feedsSet.size === 0) {
                return
            }
            rpDialog.style.display = "block";
            rpBadge.style.display = "none";

            resizeIframe();
        });

        window.addEventListener('resize', resizeIframe);
        window.addEventListener('load', resizeIframe);
    }

    function resizeIframe() {
        if (rpDialog.style.display === "block"){
            if (window.innerWidth < 400){
                rpIframe.style.width = `${window.innerWidth}px`;
            } else {
                rpIframe.style.width = "400px";
            }
            const dialogHeight = rpDialogFeeds.getBoundingClientRect().height + rpDialogTitle.getBoundingClientRect().height;
            const availableHeight = rpIframe.getBoundingClientRect().bottom;
            if (dialogHeight < availableHeight) {
                rpIframe.style.height = `${dialogHeight}px`;
            } else {
                rpIframe.style.height = `${availableHeight}px`;
            }
        }
    }

    // 更新徽章
    function updateBadge() {
        Array.from(rpDocument.getElementsByClassName("rp-count")).forEach(el => {el.textContent = feedsSet.size});
    }

    // 更新对话框内容
    function updateDialog(title, url) {
        const li = rpDocument.createElement('li');
        li.className = 'rss-item';
        li.innerHTML = TTP.createHTML(`
                    <div class="rss-info">
                        <h5 class="rss-title">${title}</h5>
                        <a class="rss-link" href="${url}" target="_blank">${url}</a>
                    </div>
                    <div class="rss-actions">
                        <button class="rss-btn rss-copy rp-btn-primary">${t.copy}</button>
                        <button class="rss-btn rss-follow rp-btn-primary">${t.follow}</button>
                    </div>
                `);
        li.querySelector('.rss-copy').addEventListener('click', () => copyToClipboard(url));
        li.querySelector('.rss-follow').addEventListener('click', () => followFeed(url));
        rpDialogFeeds.appendChild(li);
        new HoverImgQR(li.querySelector('.rss-link'));
    }

    // 复制到剪贴板
    function copyToClipboard(url) {
        GM_setClipboard(url);
        GM_notification({
            text: t.copied,
            title: t.copySucceeded,
            timeout: 2000
        });
    }

    // 关注Feed
    function followFeed(url) {
        // 这里可以根据用户设置的RSS阅读器来打开相应的订阅链接
        const rssService = GM_getValue("rss_service", "feedly");
        if (rssService === "feedly") {
            window.open(`https://feedly.com/i/subscription/feed/${encodeURIComponent(url)}`, '_blank');
        } else if (rssService === "inoreader") {
            window.open(GM_getValue("inoreader_domain", "https://www.inoreader.com") + `/?add_feed=${encodeURIComponent(url)}`, "_blank");
        } else if (rssService === "tinytinyrss") {
            window.open(GM_getValue("tinytinyrss_domain") + `/public.php?op=bookmarklets--subscribe&feed_url=${url}`, "_blank");
        } else if (rssService === "freshrss") {
            window.open(GM_getValue("freshrss_domain") + `/i/?c=feed&a=add&url_rss=${encodeURIComponent(url)}`, "_blank");
        } else if (rssService === "miniflux") {
            window.open(GM_getValue("miniflux_domain") + `/bookmarklet?uri=${encodeURIComponent(url)}`, "_blank");
        } else if (rssService === "folo") {
            window.open(`follow://add?url=${encodeURIComponent(url)}`, "_blank");
        } else if (rssService === "newsblur") {
            window.open(`http://www.newsblur.com/?url=${encodeURIComponent(url)}`, "_blank");
        } else if (rssService === "theoldreader") {
            window.open(`https://theoldreader.com/feeds/subscribe?url=${encodeURIComponent(url)}`, "_blank");
        }
    }

    function reset() {
        if (rpDiv){
            rpDiv.remove();
        }
        if (rpStyle){
            rpStyle.remove();
        }
        feedsSet.clear();
    }


    function addEventHandler(target, eventName, eventHandler, scope) {
        let f = scope ? function() {
            eventHandler.apply(scope, arguments);
        } : eventHandler;
        if (target.addEventListener) {
            target.addEventListener(eventName, f, true);
        } else if (target.attachEvent) {
            target.attachEvent("on" + eventName, f);
        }
        return f;
    }

    function optimizeLink(link) {
        if (link.match(/douban\.com\/people/i)) {
            const src = document.querySelector("#profile > div > div.bd > div.basic-info > div.uhead-wrap > img.userface").src;
            const m = src.match(/ul(\d+)-/i);
            link = "https://www.douban.com/people/" + m[1];
        }
        return link;
    }
    function isEmpty(str) {
        return str.trim().length === 0;
    }
    function isValidUrl(url) {
        return url && (url.match(/^https*:\/\/.*?\.\w+(:\d+)?(\/|$)/i) || url.match(/^https*:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)*(:\d+)?(\/|$)/i));
    }
    function fetch(url, options = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                url: url,
                method: options.method || 'GET',
                headers: options.headers,
                data: options.body,
                responseType: options.responseType || 'json',
                onload: function(response) {
                    resolve({
                        ok: response.status >= 200 && response.status < 300,
                        status: response.status,
                        statusText: response.statusText,
                        json: () => {
                            if (options.responseType === 'json') {
                                return Promise.resolve(response.response); // 直接返回解析后的 JSON
                            } else {
                                try {
                                    return Promise.resolve(JSON.parse(response.responseText)); // 手动解析 JSON
                                } catch (e) {
                                    return Promise.reject(new Error('Failed to parse JSON'));
                                }
                            }
                        },
                        text: () => Promise.resolve(response.responseText),
                        blob: () => Promise.resolve(new Blob([response.response])),
                        headers: response.responseHeaders,
                    });
                },
                onerror: function(error) {
                    reject(error);
                },
                ontimeout: function() {
                    reject(new Error('Request timed out'));
                },
                timeout: options.timeout || 0,
            });
        });
    }

    class HoverImgQR {
        constructor(el) {
            this.DOM = {el: el};
            this.DOM.reveal = document.createElement('div');
            this.DOM.reveal.className = 'hover-reveal';

            try {
                const qr = qrcode(0, 'L');
                qr.addData(this.DOM.el.href);
                qr.make();
                const url = qr.createDataURL();

                const thisDOM = this.DOM;
                thisDOM.reveal.innerHTML = TTP.createHTML(`<div class="hover-reveal__inner"><div class="hover-reveal__img" style="background-image:url(${url})"></div></div>`);
                thisDOM.revealInner = thisDOM.reveal.querySelector('.hover-reveal__inner');
                thisDOM.revealInner.style.overflow = 'hidden';
                thisDOM.revealImg = thisDOM.revealInner.querySelector('.hover-reveal__img');
                thisDOM.el.appendChild(thisDOM.reveal);

                this.initEvents();
            } catch (e) {
                console.error("报错：", e);
            }
        }
        getMousePos (e) {
            let posX = 0;
            let posY = 0;
            if (!e) e = window.event;
            if (e.pageX || e.pageY) {
                posX = e.pageX;
                posY = e.pageY;
            } else if (e.clientX || e.clientY) {
                posX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                posY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            return {
                x: posX,
                y: posY
            }
        }
        initEvents() {
            this.positionElement = (ev) => {
                const mousePos = this.getMousePos(ev);
                const docScrolls = {
                    left: rpDocument.body.scrollLeft + rpDocument.documentElement.scrollLeft,
                    top: rpDocument.body.scrollTop + rpDocument.documentElement.scrollTop
                };
                this.DOM.reveal.style.top = `${mousePos.y-70-docScrolls.top}px`;
                this.DOM.reveal.style.left = `${mousePos.x+10-docScrolls.left}px`;
            };
            this.mouseenterFn = (ev) => {
                if (!GM_getValue("enable_qr_code", true)) return;
                this.positionElement(ev);
                this.DOM.revealInner.style.overflow = 'visible';
                this.DOM.reveal.style.opacity = '1';
            };
            this.mousemoveFn = ev => requestAnimationFrame(() => {
                if (!GM_getValue("enable_qr_code", true)) return;
                this.positionElement(ev);
            });
            this.mouseleaveFn = () => {
                if (!GM_getValue("enable_qr_code", true)) return;
                this.DOM.revealInner.style.overflow = 'hidden';
                this.DOM.reveal.style.opacity = '0';
            };
            this.DOM.el.addEventListener('mouseenter', this.mouseenterFn);
            this.DOM.el.addEventListener('mousemove', this.mousemoveFn);
            this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn);
        }
    }

    // 监听全屏变化
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    function handleFullscreenChange() {
        const isFullscreen = document.fullscreenElement ||
                        document.webkitFullscreenElement ||
                        document.mozFullScreenElement;
        rpDiv.style.display = isFullscreen ? 'none' : 'block';
    }


    // 检查环境
    if (window.top !== window.self || !window.location.protocol.startsWith('http')) {
        return;
    }
    // 当页面加载完成后初始化
    observeUrlChange();
    findFeeds();
})();