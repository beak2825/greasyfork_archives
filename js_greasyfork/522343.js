// ==UserScript==
// @name         Questden-BLICK2
// @namespace    https://phi.pf-control.de/tgchan
// @version      2024-12-29
// @description  Improves readability of questden.org
// @author       dediggefedde
// @match *://questden.org/kusaba/draw/*
// @match *://questden.org/kusaba/meep/*
// @match *://questden.org/kusaba/moo/*
// @match *://questden.org/kusaba/quest/*
// @match *://questden.org/kusaba/questdis/*
// @match *://questden.org/kusaba/tg/*
// @match *://questden.org/kusaba/questarch/*
// @match *://questden.org/kusaba/graveyard/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @license      MIT; http://opensource.org/licenses/MIT
// @sandbox      raw
// @downloadURL https://update.greasyfork.org/scripts/522343/Questden-BLICK2.user.js
// @updateURL https://update.greasyfork.org/scripts/522343/Questden-BLICK2.meta.js
// ==/UserScript==
// 
/* jshint esnext:true */
/* eslint curly: 0 */
//
//
//
(function () {
  'use strict';
  //
  const imgRes = {
    refreshimg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAMiSURBVDiNbVJNbFRlFD33e%2B%2BV%2Ba0zbQdbqLYKhhKmoaIzjX%2FRmEY3xGBYqLxEjJCB8LNhBxsMTQwRdGGi4AOjMUwlmDQBN%2FwEIZLUwqtx0dCS1NLGAUY7tB3ozLTz3vu%2B66LzkllwkpvcxT0nJ%2BdcYmb4SGWyzzTo2hEQ3vSkatWEmCfCuOPKEwAu2Jbp1t0eBHCCfIF0JrtF08RAT9cqfV1ns9HWFAGYUShWMDJ2v3xn%2BqEnFe%2B2LfNselc2w4zvAMSImZHKZNcbuhjZ2tcdiseC0InQHA0gHNARDRkIGgIzxUUczw5XCsWKHQ019D4uVw1mNBEz49U9Z0%2F1rGv7NBgwxK3RHKquB0PX5JrVscW%2B9PPh3vWtpAmCEIRfrk2ot15sFwe%2Bvuo4rmzRAYCZP7wzXRCup1gxLzLjM8eVZ8anZ5MT9%2BaPXu9o7tq3dVMoEQvh43e7RC0GAqAEAEipwlXH85IvPPuDlOoRgEHbMvO2ZV7549uPXhqdLOzdfewS7j8sYXqmDKkYAAMACyyvqumpSH9jJPBVZ%2FvKbgBTdWnruiZ2bnsn6XY%2BHUWicQU0Qb4D1mt38V8%2F37yAJ%2BO0J9VrF4cnq1ftqSXfvOOqAAD2W6gCMGoErpvfAOwE4D5BWLct854v4J0%2F%2Br4GEJgZF%2B1%2F1Knzf%2BWkVD22ZRbrWYezY6tK5aWO30fGbwCI6QBABBAR7v5XhiEYJwf%2FJABf1JNTmWyYiO72blx7Jj8zlwKgAagKABBEBAAdiRBWt4Tx5f63qa0lcuyVPT%2FfSmWy6ZrG9hWGrufyswfyheLrmkaubZmuWHZAeFxxcWFoij2P0b4yisM73gh90Jd8ubU5ci29a8A1dPGNVDI%2B92gBTY1B0oQYBAD%2Fkaj%2Fx6Glidzc5KXhyc7Mlk3hRCyI7rUJeq49HiqWXfw7W4LjeBQJGjh3ebTiSXUEAJYfSTFN5OZO3zy5LfmgsPBJ%2F%2Fc35o8P3CwN384jP1tG1ZUQRCjMl%2BS5y6OLUqmMbZljAOC38BOA7bZlci0wA8B7DYa2VzFvkFLFDV2bIcJQ1ZGHbMv82w%2F3fy5VdmoTZczGAAAAAElFTkSuQmCC",
    nextbutbild: "data:image/gif;base64,R0lGODlhEAAQAOMIABIlNRw4UBM7Xi5ZfjhokY6xz6fI4%2Ff4%2Bf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FyH5BAEKAA8ALAAAAAAQABAAAAQx8IlJa5U2awqQ2RVQIB4oiAdZEOZZtu4Hd3IrsnCu79nw%2BQKgBUAregIZonKJxMAeEQA7",
    wartbild: "data:image/gif;base64,R0lGODlhMgAyAIQSAIdBG4hBG4lBG4pBG4tBG4hCG4xBG4lCG4pCG4tCG4tCHIxCG4lDG4pDG4tDG4xDG4xDHItEG%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FyH%2FC05FVFNDQVBFMi4wAwEAAAAh%2BQQJBQAfACwAAAAAMgAyAEAFk%2BAnjmRpnmiqrmzrigDwzq9M33Cc6ngb%2F7WfbSYE9o7IpHLJHA2bJ170CSUJV0ZmEVnseqXVsHhMLkPBZhR6nC1RyW23ebtbK7u%2BOA6%2F59f9VV9vaYSFhoeIiYqLLHaHg4iQgViEjh%2BSgY6YZ5qVek5pV2pzn06WSXR%2FmaJYpTeAja55rDSwKl5LgqZfYoK4jMBKIQAh%2BQQJBQAfACwAAAAAMgAyAEAFqOAnjmRpnmiqpgEArHBMtnJtf%2B6ty%2B67%2FytXYOi7CXvApHLJJBWbNSR0J5wCe0%2FmkHbFeltCYs5KLptFrcA5uI6N26oqPA5Qz1PYO15KfsN6dkpggUaAYChedUdlikRgfnqRkpM%2FfJKEknWUTptOmJNZlJCTRJ0ilqKhoKOZmqZ5r6xNrnS0U1syW6o%2FgzaPuzx1hzpHuG6Pxl2Aib%2BJtlpYv82fptU3IQAh%2BQQJBQAfACwAAAAAMgAyAEAFrOAnjmRpnmiqpkC7vvAYtEJs20Ee3Hzc5r1gLAfQ7YTIpHLJNM1cTRw0yiseqULiFIvUCYzW70%2FHLSt%2FpCuaOgOaVet36gmQr9pXO4pY08%2FbfndWgSo6LXWEe0RaRYknYlZajpOUN3g7X3qGeXtYkpSHnISfoHGTgJUfoalPoomklHipqlugOX2pPwWzqm6sVoi5q6yXs3iHwY50AqFFhzJfAbtlzqGLkbzZSiEAIfkECQUAHwAsAAAAADIAMgBABbvgJ45kaZ5oqp5BCwCtsJJFMLPtrZvHGry2nXD3%2BwGGyJ0gIGgmn9CodKpz%2Faii4AymxQ5bOS8UzBRjY4GCec0uCV5wuAtYxC6L6uehq5Ov%2BShAeW0%2BYIQ3SzCHM2SAiyZMRo8%2BXI6TJWAwMpecnZ6fkXJ3lmdzlShgm1NGMIpIpIxkVKpVp16usUttsFlAnyRgPb8fo8MirbyLmcbELsw1hsZWzEVX0olHxqPZ0mjMH3uR3x%2BpuuPn6G0hACH5BAkFAB8ALAAAAAAyADIAQAXO4CeOZGmeaKqeAxC8grB%2Bwgvc8%2FkGwpH%2FJJ4KJgMaSz5ULXBsOp%2FQqDS6i8GS0xGi5sp%2BYLMY15vCmrY1cqq46qnf8Li8tOQubfgbM%2Bu6Pl0CCEc8O28BZigBfWxxBSk7XXMfiEFgkiKMJTyUlycxA52hoqOkpaaXeDuphHI3fUQ%2BBwgFijaAWYQvnEOKAFB3e1AHYkcDqmQvP7Q8vobBa8dymSbRc890S46SB7t3pyPVktcjNWnfkwID03C7mDHn4O%2FwNPLz9vf4%2Bfr7oiEAIfkECQUAHwAsAAAAADIAMgBABdjgJ45kaZ5oqp6CELyBcASDitCugKxmTAS8YA8AFBqPpBhyGTwwn6MddEo9JgTE1ktQq4pyA1f1kAuGBV5VAOBMQwNtt3xOr09zMRjMteejqQN6cEs3e1YtLW4HRAA8ZH92i0UoYXYkDTqWR5OaKwNSnSkHoKEspaeoqap1BTFhezBEL3FpM1l5eS0Iu4%2BCVYh%2BkDyvW0x%2BAAW0SJLCQX5dVYY8CMBzN0Q8XMpyL9AnxZprKgMEobMpCNt1iasl7O0jAaTwg%2FAjze3qqvqp86v%2B9gIKHEiQSQgAIfkECQUAHwAsAAAAADIAMgBABdXgJ45kaZ5oqqJDIAwIUqDIICBCoOvH6v%2FA0S5ILOJuxaTqoFM6R4LZc0oFDmzYmwtR7dJygYG3qhOMnTnAmYjjrmm9t%2FzpEtjDtno5NyB4EwMLbkU5doZzRUw5iEFXdow%2FTGGQKwU6EJQqZZkokpwnBy%2BfJDijpqeoQQk4LntpLgVxZwdXfS8vLQUFhoV2V122YkGGO0hOMVV3LqkjrAHMUHayqa3CqQmF0B87g6gNm8yK3acITdABAM%2FnAQvnANOnNw3Qj8wBB%2BOmZqgx%2BZnW2gJSCQEAIfkECQUAHwAsAAAAADIAMgBABd7gJ45kaZ5oqq7syAgDDA9tbacOAht3bzuCgMBHROlgRSIiAAgEktBokYBASK%2BpgiAIsGKhW2fjW5SRazknLVr1ioKfrQDhOJzveMcisR0QCAMIfng%2BMUJzhDcxW3aJLToBAwmOLYtulChAQpgqYZecIwdOn6CiiFCkKgdBQpOgr7CxXwkEBgIHgJKyJQi5cq67A34DQmu7HwcFi0%2FHH0ebzR%2FEjNGLxsesQ9Vbqa9ASM2a2s1y0Uu3zQmL0U7jshHtDrsMq1vYo7tL7WQJ3SPPBRolanOrCgxg0RJGCQEAIfkECQUAHwAsAAAAADIAMgBABeTgJ45kaZ5oqq5s675wiQxIEt8tIggD7puCwMDmShwEvw9COOgln9CodDo4LKZPwoBHwN50gsOK6AUjng%2FHIcAOANq7YPjsrdvv3ofBgI85FgRkfStbTYMrCAU7TocoWwFijSc6A11jd4%2BRkiMKAwFIP5Q1LWtxAXR9CKibrK2ur7AnCQtXsSMLVauwCVq2IgQEuq6VW3yxBAY8tkafwqwHW86bTWy2BIuxCaIp0lSflq%2BPoIh2DnENRWXYMaNQcd0sCOg3CVs840laYDQJ2toMqpaw4cGozoEjQQaq2gHOl0McIQAAOw%3D%3D",
    stylebuts: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQgAAABICAYAAAAK2WsnAAAABmJLR0QAbwBvAG98p6s3AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QMUFjAYLi5uLgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAgAElEQVR42u29d5gcV5X3%2F7lV1dW5J0ijCRqN0ihYVrJkLByRjU2OywoWTDAsmHfJLD%2FDAmZZA2vDsot5CTYLeA1LWMAmGOM1wcYyDhK2ZcsKtrJGmhlN0KSezpXu74%2FqOD2hezRi7Xe7nmcelWrufOr0uVWn7j11%2B3wFE7Zt27apx44dU6LRqGKapqCCzePxyCNHjtiAk%2F2Zcqvxa%2Fz%2FzXwpZUXMiZsQQlbSbq75Ige94447lJt%2BucUa8XhJCA0pKjuPBMKOyTwrw%2FhjL14AjF999dXmDTfc4BQbvH37dvVj31lmDms1fo3%2Fv48PKJuvPmmdCX%2FXjzq0XADK3dBzzFcBWRwshJRS7Nq1S7vma63GmM%2BPpoKqQIV8pARHgm1DQyaN8vQrV3R2dvZv27YttW3bNgkoXV1d2utu8KZGvT5U1Y1KQsx8DimzP9T4Nf7zlw%2BoG9%2FZl54L%2Fu7bW32AXTRSOWO%2BI8F2oD6dZs%2F3WnXAFkK4geiJJ57wfODrC4yRSIi6gCDkE3g04QaJCgKE7YBpS9IGxNOSxngcvetvz7nwwgt7rr76arOurs7zpuuN2HAoRMgv8HlAUwVKhR%2FAkWDZkrQJ8ZRkXjyOfqLGr%2FGfH%2FwVK1Zol1%2FbE59L%2FgPfbg8BZm6GMxf8ZAZiaUnjeIyHblvkBUwhhNQ0TdONkI%2FWekFrvUJjWMGvg6q4J5npBJYjMUwYT0lOjzskNR%2BKoqyLx%2BMpj8cTVRQlIOt9LIwI5oUUQn6BVwNFqfADOJCxXOcMxx1Smg%2Blu8Z%2FzvI9Cbx9t6Ms%2FyDCTqB0fx9n6fue9%2F5ZPH6Al3b9mHuXvI3uyIqK%2BYCvmL%2B5M4xHo6ob2LRg15FYng%2BEgWS22Zz4J5pwGByHhPQBeAFHSmlrsVhMx6fRFFZY2KiwoE4h4BV4VDD7HihNxrReXnYSy4GMKRmNS3QNeqUHKcTqZDLZlU6nzWAwGPKGdJoiCk1hd4SiewSqIovTIEUzIlG0D7YjMExJUAdFURhwPEgpa%2FznKj99EL2pBbVOQPQINDVDRDkr9oueH01%2FA7RfPWf%2B2Tx%2BBL2piXVaN5nIqortB%2FzekCfPrw%2BCR4WMdRN2GlTf1Pb79U%2FiOGDa0Fwn8nwgWDTFCBbzQz7BDQt3uRECeJhLCsBLHi7s5vccPvtfm%2FGqAtuBVMYDoANpAG10dFQVqht1fB73R9dAU0BvuxBr6ImibG3pB3AcN18hHffvvBooqiCRTreNj49HLMvqTyaTmoMX6Ugyphs5DUsWjU7kJGmTonNIiWW7QUg6EgeBkUq1joyMRAzD6Kua3%2F19WPT2s8efC%2FsTQwhjAOltRPG2TM7PDCMzAzieRmxPy3PH%2FpFDGL55KEkJpw%2BBpx6S2WvZNmDo98h0v3t9CwVHa8Ke9zLSh29Btny4Ovtj8ekfkUk5J%2F0bsGJ4h7tJ2AYLEk8Ti1yeDxwz8QHFQeT5adO94dPGuItPl5ttpUHzQSL9SRzp4PV8qYSfzTvkk5PFfEUAhpEfPmRKyJlJ05TxtDuFsW2JKUsvAm10dFSaFiTSDrGkQFMcAl7hDlHQyYyM51HegFN2KTnZEcR4ShJNOMTTMB6NeoUQyokTJ8yFCxcmR%2BJ1SEsSjQs0NTv8qfD1S%2B4clg1JQzKaFqSHhnQhhOju7rYcx6mOr7wFeq2zxz8D%2B0ejDlrP%2F0U1R0Co7k2k%2BlAWvQd8C1yebSNPfB1hDCNRkNLGEV6che8hqTSfFftt08ZGJZGyGDO1afnq4T2oHe9AWBbywG7EoreBYYGVxOn6OiKyCXxbEIEOUIPI0d1Yh7%2BBlTxFWrersl8eOT79qzvNmpP%2Bvaj3PrYrHSyJ7qdzbDcp%2BQzdkVUV9e%2F69esTI3Enz6%2BPZG9ibiKWen3%2BHGYSPIHyfZAEfXBy0M7zgQRgZBuU8DUV8A%2FnuUMlHhma1E9H%2ByxMy72HYymRiyQOgNbX12clDUk0JulXIJVW0D3uyEARgmTP6Two4HXKni5Suv0fS0lG4w7DMcHo4KCVSCSsxx9%2FPD08PGwOxxaTSdhoqshnWAGs3dfkWdrG7015LJfJtWxJ3FFJDA5ayWTSnIlf6XamfGd4B073bW7eyLcE0ifytlfDFye%2BBuNPoix6J%2Br8rTiZfpwDn4KuG9HO%2FTf3IXzsa8jxJxHt1%2BTb2M9%2BEk7eiFz9lTn3j3XoC9lst8SyHdIrbpiUn3zoLWiam0IXXTcUAMducB94gWXg70ALXAFx3B9sYB2ObMA6eT3U21XZbx3rmtZ2LWKfef9KyRt3%2FpSvnv8NXnS6m9auw8xP3cP2VZ0V9e8rX%2FlKazgm8%2Fz5je6zP5pY6z7TY%2BAN50Y8xaMf93cLWvYRTboBIscHxoHcU84s5guAb308j%2Fk4byow31Q4XnSUE%2F1XZnMdknFLIRt8pBBCaidPnrTTFsQSDkhJMi1LkijjPYN5kM%2FZS2bwUZAO3qYteBrXu1lQC5IZSSzlMJ5WiUajdiKRMB999FHz6NGjZlx7FeQGR0Ud4LTfiLXXTWDpsWxnLvw85r4Plh6ThadZHIXY%2BLiTTqetmfj56HzwczixpxFSoL%2FgzkkDxJnwM3tvRm2%2FBq35pVijO3D6%2FjVvezV8R1mL9LXg8V4KMRvHCmDGPZA5hrfD5dnKuUhfC1pRGyPugUwXeoczK%2FunDRDqC7CH7kOZdyX22H0YaTk5f%2FX3EYDxxBvwvuDnkN3Xz8%2Ftb0Nb%2Bw6UIr8U%2FNMKnbchk9XZb4yOTWv7XFw%2Fa04%2FyjNOB33pAHvFcq4aHmZV%2FC7GWt%2BfbzgdH8jE0zLPH0%2FlzrEPgJTaSio5xQdQYTz7u2jMzvOzE5PcNMAq5rsDhaGqRhBjWT%2FZDqSFQvFrTu3JJ5%2B0jTWSREriOJBKZyNRNkCMDozmQcGQB9tZSbrvATj1K4LLdLTwSixbYliQykhStiSdTjtSSufZZ591Dh06JM3LwHQmuTiVZtKZ7Egp99JGbSs%2FVtQJpgKmaTqGYTh%2F%2BMMf7MWLFzMlP7ct%2B0esru9iRx8vYU4WJGbDz6Tj0P0L9PoXo4QuhA0%2FxzBnwY9sRfrHyOy%2FCSe2G6ykex0IgcjxIltxfGOkJ7SRgDCn5idPfA%2BsGE5sL0r4XJzxvYjAYmTyOCKyGWfsYbyrPocdewYn%2BjSke%2FF0fhLHsLEMC9WwsQwTy57ePxnDyNuazhh5f6czaXxq25z6P3%2BdTLXNwfVz0ZGf8psV78Uw4WBgLVY6TX36JAtP7%2BF4w4YZ%2BdkZWp5vWqX8kLcPgIb7FxEKqG6a7MLCyCjXPnc9mW7u0S5eKFXMFwJIFxIbpSmO9ORusgr22wrkgkNuiiHNVWA4DlIKMtnXI9kkKMNjscKcTlmM42lgZOzXblQ78Dsi5yxHZhdamJbElCqWZUkppezp6ZGAjAACOWlOTObDr5z2mJjsb4ATJ05My88%2FCUd3oETOK2GWLSmdBT%2F12Kuzvu8l8%2FjrSrPQF9xdFd%2BK7sE8%2BBkkCmr9C1CbX4F18nvI1NG83VO1IXU0b%2BNkfBk%2FhOMY6G1%2Fg1SD2LFD%2BFZcT%2BqJN%2BJb%2Bj7SBwaxRv6MGlyDmN%2BM1f0f2CM7wNOQ5cmK%2FCNzq28m2XfsDIqiz5n%2FpZQzzx3PgB%2FKDLO5%2Fz629N1bhj7%2F1G85Xr9%2BRr4QQkbeNlzwzxSmBv0Kp4bShP1avs3DdohL1HiWLyddFj2Rj4QvOU7RO4ovFU7ypcLxL03w01SDSs3NJbgZTByZjSCFBolkIfMZSjtIGSgcS3XhM5z8%2B1RHgiNACIGqqqKlpUWoqsoooEg56dNXZA%2BqpQ4oO1bc39Xw85txGu%2BCl5Qxz5QfuuDXOOkBUgf%2FEYx%2B9%2B99iwms%2B1rZ5TAT3zxyEwiV4IbbUfRI7lEBQuTtTk3TRsmeYDK%2BZ%2BHVONE%2FY574Fp72a1ByTKGiIlEVD0JKnOH7QVFR%2FAsRQqAgcbJtbaa2P%2FXYaxFCIoQg%2Ffhr8u3Sj78GpArCgxh7ErVxy5z5X8wwVzrT6%2BdFPb%2Fkl6s%2BwL2d780fu%2Br493nzM1%2Fk%2FIH7%2BcWa62bkd3d3i7q3j%2BT5AnjYDnOJGmMk0UBjcDT%2FN5GAh1BAZQwYSTQgfCLfPsThwlRmwvctivnuyFwpDNJLM%2FTT%2BmkyvlZYc50dzToTV0oWHbBdSu6YonrBzi7tlNk1nwpomqYEg0HlwgsvVL1er7xHcV%2BsTmqcooKQaJgIxYOUElVVssYZiAlPHFUBj8dTMR%2FAHPkzqqbii3TOOOeeDZ9AM97z%2Fp3MwG8x%2Bu9AGifxKNXxNcdBI4UItOH1RQo3gX0aRVXwKODM0EZXp%2BY7p76LFj4fEepATR%2FFtochtgdVyUD0CTC6UUgi7TRS9aFIAxnfDZ75KNZpiO9GtYewnOSk%2FIYX%2FgorupvU4S8QPv%2FOkn2A5LGvYp26Hf%2F88gCRGXoIo%2BvrhM%2F%2FWVX%2Bz10nU22T9UGlfOFYXHbqV3z9%2FFtLOE8ufDlvPPQVWjM9LI4f4lRk5bT8nJl60b2rSpUdsp6Lw2M8YtcTnhemQ9FJZCzCIZV9jYugMYQ6HGOHrEdV1LwN2Y%2BsTjxnsf2Kqhbd%2FErxLyYNFcWfr4gvAbTW1lYRU0AXElURZd%2FD8OqFxQ9ej4NjJvPHvPXL8emFNRFSgq5AIBBQGhsbtU2bNnl8Pp%2B8bx%2F4ppjjWZHFSKMPLfE4WmgN5ugOfF6v%2B7uDHyay%2FtaS6OZVwPH7K%2BYDOLGHCIQX4%2FfMPBqdDX%2F8yb%2FB2%2F4u6ttfhuH3kzrxnbJzzcQPKAqW7kUQxWP3g2OSOvEt%2FJoJmo5XtVA8GrbXB5O0kaoHXbHwavqk%2FIa1XwZrFKFuQ9E04P1uSmO%2Bm0SMLDi%2F4C9jHEWP4FhxFC1UYv%2BwosMU%2FklE78cfWYrfA4nxP%2Bb3AfyrPkLs0D9jHfoYwaUfQQkswjFGMQZ%2Fhxj8NZGlb8OrVed%2FM3udTLnQyDO7%2FvWZ47z28NcQXh9msL60L5UIvQvOY2l0H3%2FddQs%2FXvuPJLyNU%2FIB26sV%2BLtECz7NR6gxxK6RFt66uy2bUYVFre7nufJujWBA5c7zTUKNIeIjcXxagQ%2BUXF3FfCHg877C6qv%2Fc013fv%2BdV%2F45v3%2Feeefl9%2F%2Fzb%2FtL7M%2Fy3QCxadMm9VgafMJdPSmyQSI3rwr6C52gZY5hpocJ%2Br0IRaNp2SvQdFGyLDQhBFoopLS0tHjWrFmjq6oqvIcEfie7dFuUztf0Fe8m1f0fOIPfRzG30LDwamLRu%2FE0vBC98TJUbynfqwi0cLhivgQs2Y0SbsI58jHC535l2mWts%2BL7%2FWjOCcxn342CpLHzXfi8omq%2BuvxqjL6fw%2FFPuhc4CiLSjjSH8ZsH0CLrUJddTabvzpI2SqQd2xjCaxzAG9g8KT%2BoqShi%2FqT2T5xD463L%2Fhuuyn7bOo6n5QoC3tz%2B5Xk%2FCCC47npSPT%2FGOHkjjnQTZppWT2TNJ9AiG6v2v%2BX3TxsggkV9UE3%2F%2FsMT1zI%2FdQqAr%2B58Bf942d2k9HoAPvnQ22g0ByAQ4Lzkk5z32Ov49Nbfk1H9k%2FLdh2yBb2UXODgxh6v3toMX%2FvBig%2FV3SpobvPzhxQZX3e%2B2uXpvgF9uGiHgCRD0ijwf8BV3XTEfAcFgsNCVRUFUUZQp%2FVTsnyK%2B1JqamhS9V4Ii8GqybKFIMNRE%2FaKXYBlR4gO%2FRZoJ6ptWEWm7Et3fnLfScSCDwA84waBobGxUm5ubPZqmKX5VoqoCr5Al3%2B8QApi%2Flrr5pTdtcPOtE3NMOBIyUuBHIqvhA6augBgluOJ9ePRJc1hnxA9ekFvzcO1UObKK%2BPXtr4HWF2HF9oPw4qnbiJMZwIrtQQvOQ9Mh0PFqnNbLsGL7kcKLFtmAkxnEGH8aGZiPX63e%2FgpyfDPab4%2F%2BEd3no77txSgeSHtsd3%2FC2D2w7C2w7C1z4n%2FDX%2FkIohr%2B17b%2BtMQ%2FAsitW%2Fq%2FL76zzD8q4JuCD4hifkbzE2oIEh9N8NstaUL1Qfz4aW%2FRuXvjKCEtiMfr7gfrA%2FhG3SDo8xT4ue9K5O77ifb7s4FTCIGu6zMGCL%2Bn1D9FfKkFAgEZkDaGoqIICwWJUvQ8aVv7gayLJJGmCyY8eyQCgUSiCjDQCEqLjK4n6%2BvrrVAopACEhI0hVALScrOtYrL1%2F7LsewFuM5HPshqKRkjapD2eRDX8hrVfPav8ObVfi6A1XlSYE%2Fpb8fjbShKeqqcOtfHCwrPf34rH18qY8PyP2W8veAnzmq5ACAkC5mWnhme%2Ff6feFCGfC%2F0rivkAibFkPsEaH0sAcPfGRP7%2Fuf1cOyklKjLPzxqSTyhMtH%2Fpa3bkrdyZKNi%2F87Zi%2B%2Fvz149Cqf3FKQqtvr7ebrAy9GkhdMch4tjZbPRk6%2FPlpItxpYSE0BgXCovMFKai9Pj9%2FjFFUUwhhAhlMvToQYRUCDoWubc0w3vePWMnz1v%2FXZevaMSEQruRwlTV3kr4Vdlf4z%2Fv%2BOHVt06%2FyMuUs%2BLf%2BMDlVa3E%2FdTlf5ySD9jF%2FMj%2B%2B2a10jeqqHl%2B7nVB7g6fS%2F8vMlNkV2m6OYiGhgarvv89banW208NebwkEYSw0aWDUvzuuyiOFs9ZM0Iljkpa0ZhvpTl475avNTc3HwyHw6f9fn8KYEvDN5ZGT3%2F4%2BGmPj5gDQWnjkQ6hVd%2BekT9uCBIiyzfTHPrtlq%2FNnz%2F%2FQCX8Su2v8Wv8Yv4HL3mgOr41Ld954N%2Fb6zf9bd%2FYXNj%2FwG3t9RPv9Lnk%2F9Hl56OJBtiLFy%2BO9jxyVWfbpv8%2BMqJ66Vc8OBWXlIKQbdJixzl09%2FqbvV7vY7quP9vR0TGqqqoJ0NbWNqJvf%2F3KlpU%2FOzSieukX1fHDjkmLHePgXetu9vv9j%2Fn9%2FgM1fo3%2FPOFLgCdva%2FVf8PaTqTPhP%2FafHVNmZc8WX9u2bZsDZA4ePDhw%2FMFLl4%2BNjXXatr3ScZw2KWV44jvXSTZnXIjEKej2eDyHgMM%2Bn%2B%2F0%2BvXr04sWLZIA69evN%2B%2B%2F%2F%2F7%2B3Vm%2BaZorHMdZWCk%2FKkTilKLU%2BDX%2B85Kfe2g%2F9p8dHs58m2ql31nha0IIKaV09u%2Ffn%2Bzt7e0NhULReDx%2BTEoZkVJ6p1x%2BVQo0HMcZk1KOhsPh%2BNatW82tW7fmT7R161a2b9%2BeeOaZZwxgzHGco47jVMwXQhhAtMav8Z%2BP%2FOfzJib5fy5DKipwTnGQcIqSJ3Ka89X4Nf7%2FVv7zbtPcLKnMOUa599571e7ubnVsbExNJpMzTmSSyaQMBAIyEonYixYtEtu2bbOmcLwCiO3bt6uHDh1Savwav8avmm9n%2BfJs8EOhkHXttdda2TUUMj%2BCyJW%2B%2F8x%2FtBvepghqwIvQKgueUoIdS2EMjTP8xGtbOjo6xrdt22Zkcxv5qLx%2F%2F37147fOz%2Bjza%2Fwav8Z%2FLvJ7HnpJc0NDw%2FjWrVuNnK6HkFKK7du3q1%2B5Z6Ppa63PVpKqQheDwjLWdN8YR%2B65pLOtra3%2FoosuSv3TP%2F2TBJTDhw9r1323Ke1tqS%2BU06%2Bi5pnE%2FTp5pr%2FGr%2FFr%2FLnmO9mfVN8YT%2F90w3LHcfp6enrSgNTuuOMO5XsPXmZGOuvx6%2BDNl5urPEC4tSDAu6ieziv%2FeKR%2F52tW9vX19e7atctcsGCBdt0365KRznq8GnlhHncYM3N0I8u3bMjU%2BDV%2BjX9W%2BIYFWns961%2Fz2NE9v75geWdnZ%2B%2BRI0cMLRQKaYHmCEGfpM4PIZ9b1bqauv22AykDEhlQ2iP0SXluOp1O%2Bny%2BqKIo3rqFEcJ%2Bid%2FjBiBNqU75xy2tDykTxMIa%2F7nMV%2B0xjj36Oc696ivYRpTDD32Bc6788vPeP82ndrHl0S%2Bz8%2BJPMNh63qz5Pl2gqtn7q5LMZ1a1Lm3Is%2Bcf27U9nganNYJt26sSicQ4MKINDQ1p3rAXvyYJeyWRrDqPqsCBnd8vAa5%2B4Tsmyhq4xS5t0LOSX3ZER0q5KhaLHU8kEmld1%2F2BSCt%2BTeL3yOwIRRTSw9PLMripYUe67aXAjujYtr2yxn9u8mN9O6iLzMOvSYa6dxIJN%2BDT5Fmx%2F%2BCfrp%2F2Blh12RfmzD%2FL%2Bx5GDQToGN7N%2BKKNs7bfp6uoCiQy78RKghaY2v6Q73Y3R6CCkE7F9n9auzsfHe7itQXga%2B8q7BZ1%2BhfueDVIMFWBHvLiOM5K0zSPAGPa6OioqqgKQlpIKXAciZ2t7bB43es58lTh22u2IyeNQLadrQdhS1A0Uq4uQHhgYEDoui5tFAzDco2wBIqQVWt%2FWrbEMCU2GvF4vPX06dOh2fAPbf80K7f%2B81njz4X9RqybZLQLX7iVYMPySbnp8V4SY8fxhlrx1y9%2Fztjf2%2FUEvnAL4ylJ9%2FEn8AabGU9mRWaMJD17%2FoPk2DGktECo%2BCIdtK9%2FL3vv%2B%2F9YecU3q7J%2FbGx8WtvHU3JO%2BteXGsbTe5hkxqTh4IOMr3gbuMVdq%2Bbb2aF%2FPDXqniNVbreRAD0I48nXIZGEfHdhZCq3H086P8eYvial2y%2FxlFtT1jQlUtHIZDJttm2HAUXr6emR1kJIZyRJzRXBKVS1DnF6OJrHjcXllEOUjOlqc6YdGBsb81mWpR49etRKp9MiZWzEsCWaAooyu1fEjuMO5WzV5TuOMyt%2B%2FYbPMzjqnDX%2BmdivSJODD16HmRgAoSBxULUAKy%2B5AV%2Bk3fW5bfLs9usw4oU2iuqn8%2BLP4Qm1nxX7HcsExYNhmEivNi3%2F%2BNG9rHjhKxkcdTh6eA%2BdWz7B4KiDnYnxzPbrmNfxIgKtbyI0bzWaN8xo90PsuOczJKIDNCdkVfZ3n%2Bqf1u55Rf18Jv277ulf8lToAtqij9HeuxMOPMVgy3mzun5UX25Q8iuiyc2FoBADPVy0X1RwN22CnZaV268XAme0xMropH4ajsp8HsJUIJ1OBx3H8QJC6%2Bvrc%2BxWSFsSBYlhiJIk5amiqtaLouXOc7L1KA0LUoYko0AsFpPpdNp59NFHrSVLltip5m2QKdTky0Xnx%2B54WZ5zwbbfTnkspzsgJeB1%2BYZhzMivdDtT%2FlDX%2FRx7%2FGYkJqH6FSTGjuRtr4Z%2F9JEvMNr3DEs2f5jm5a8gOd7Lvt9fy9i9n2TDK%2F8TgMMP%2FzOjfc%2ByeNOH8m32%2Fu49jP72E6x%2FxQ%2Fn3D%2F77%2F8oIHAcBwmc%2B4pbJuU%2F9oOX5AuWDN1TqNV4%2Bp7rQCgEG1YRbDiX4KK%2FASBhAqZEabiE%2BhULOfn7vyOelFXZf3p4ZFrbo3F55v0rJQsf%2Bym%2FfP1PMQYGaR76Dc1P%2FZrDl26c1fWjOu45RhOLAciMgzfirmJIJLLA7H5mHFpaTxBNgp0dDVViP%2F%2FyibxtnyiuUXJt4fi1JX66Ji8AJHUwTTO%2FNko7cuSI07YBpOmWvc8YMi%2F8KRAMjxai0eFnH6PrmXuRjsWic15K69KLioZYbpCwPZBKpWQmk3GOHTvmdHd3y%2BbXg53V9Cr2%2FYorbuPpe9ziIamM%2B%2FvOy%2F%2BdPf%2F99pJjRVNWVA0ymYw0DMPZsWOH3d3dzVT83PbsA39PdPBJBApb3vTHKRNCs%2BXvf%2FiLLN74fppXvJahngc5%2FchnS2yvlO9reiHzAsuItL%2BcVEZiiQiWCJMYOpnneZu20OhfWtLGViKMDvWQMeWs7J9uC7Vewelj9zJ%2F6cs5ffy%2F3dHiJPwNr88G%2BJ9uZcubtgPw5%2BL9n11By%2FqPlvkFQASWsP5191ZtfzKVmtb2ubh%2BOk5upydyDlER4WT9Ws5PJOjYdxepF1xfEkkq5WvZ0nF%2B%2FYRro28%2Bqamq9%2Fvc0QOAZcjK7c9HGleCiyn%2Blx%2BhGK5sAm6GAMuykNnS3FpfX59sdsAxHBzbHWLkRg9CQDRWUPUwnCDhlgs4vu%2FXDD%2FyI0wnxLzWtfk3GbYNUgHbtqXjOHLXrl0OIF%2F9OnCs8mG9x9eCZWVFO7K%2F1%2F3tZcdKLibp8gHZ09Mje3p6puTntpWX%2FitdT36D0b4dkzLPlG8aKbqf%2BQmNi19OQ8ulnP%2BGP055nun4jYuuwkqP8cz2TzE%2B%2BCS2kSCni5HjNbZP3caxnCn5XbtuxTLGGRt8irr564me3k2gbinJ6FHqFmxhpHc752z9MuOD%2BxgfeIJ0rJuVF30ey3SwbBvbcrBtJ5tVn9o%2FlmXnbS3ZN028gYVz6v%2FcdTLVNhfXz5rdP%2BCxF3wI23I4NW8jtmURinYzv3cXAy2bqubbE05TF3DFbBruay%2FoYlx0oijvl5vmOZXbbxUWc5Yu67Rm9JOgtGy%2Fll9NZUkcG2wxddl7f91KVE8TieQdABx48i7Ov%2FLc%2FChCSvcDOI4j5UTRAmeGue9kv3eqmC%2FP0Hbk1MPULTi%2FOmYF%2FJ13bHWHivEeHrvjxSW%2Fe%2BG27VXxo4NP8eyfPgZSoaHtQpo7X0f3nn8nMXYof%2F5K2ky2xYcPYNsZOs55B6oeJjZygNUX38jjv3gFy8%2F%2Fe4zkAKM9jxJpXIcv0MLJp29luOchdF9jIdk0nQ6FI2fct4w0muadU%2F%2FP2d9M0taXHKLz%2BO9YdfQ3Zb9bcfg3DCw4b85sCQVU%2BoYzhP35QvMluhjV3D9fKtaYKdHFKGpToW3aiRMn5HrAsd1SYU4uQGRfSZlFUdqyJGih%2FLHR4ZNYdmF4Iil8u0XTtLzuAIB0ijLDRfy8toEs18VwI075wo6JugbT8XP%2FGokBmpe9svwiP0P%2BC%2F%2F6AdKJPp7903UYSbfQqS%2B8lA0vua1q%2Bw89%2Bo8IVDa%2F%2Bk40bwQEdOf8kf3jfJtX3Ynmy7bJ%2BlFOoYsB0L7mnYz1P8Lx3V%2BlY93%2FQeQ%2BhOJWOFdUtzDh4Il7EYqGL7LI%2Fby5PiqpZVnO33nnFQhcXYw%2F33l5vp27ryKEh%2FGBx2lsu3jO%2FC8qedF%2FBvy1B3%2FGoxd8jMc3fzA%2Fh9j09HfY%2BugNrOj6HQ9fdH3V%2FNnqYryQ%2Fsrtr1IXgwm6GMV8bfHixe51kP2tUlx2ZkInCGT%2BInCDgBeRrceXE1%2BaTHcgJkAtLoNVxHc%2FoATHQJmgiyHtDKpaWvVUEdXxAUZ6H7II4FsAABWzSURBVEHTNCINKymX9uKM%2BYFgC5tf%2FgMGj91N7%2BEfYyS6CtV8KuQLaSOcJMFIO7o3nI%2B4ljGIqiqugI3jFNr4itpk3DYqckp%2B995v0tCyhVDdUtLRQ9jGEOODTyJIEz21g0y8C6wEtpVC0fxIxyA%2B%2BAR6YAFmeoD4wONYmUEcMz4p%2F6I33Ed0cBcHd3yaC17725J9gCNPfJGefd9ifttFZf4f6nmA47u%2BzAte%2B99V%2BX8mXQwl99SaRf8Kx2LtwZ%2Fxq5ffnhckAjjU%2BWoue%2BwmGuMnWTDyLEONq6viz1YXQym6P2eyv1pdjOLPl%2BPrui7OOeccRWttbRWKAjJbEXfiCi%2BvrhWdzMa2Evljjc0r0bKGyexDTlPLdTEecUAoctLln5GGpRjJXhKDjxJuXMdo30N5XYyDD76bDVd9vyS6aRr4J%2BgaTMcHSazvAeoaluBR5RSrgs6Mv%2Bs3r2HRuX%2FHwhWvwucL0PX01%2FGoTnV8TeD1%2BhD2GFbqFI5jcnL3V%2FEIA49XRxUmHo%2BGz%2BfPtunFcax8G033oGDimYK%2F4YqvY6ZHWHzO36BoOpz%2FUQCa%2FupeQLCgvSBoY6WjaL4IlpFE04Ol9gdCU%2FpnrOe31DUsx6NKoj2%2Fy%2B67fjhnyyc4uOMzHHro71h23j%2Fgr1uEkR5h8NhvGDj2S5au%2F1s0RVblf98MuhjF%2FV1N%2F%2BqZcS5%2B4l8RPj9WsKGE4wTqGGrfTOvpPVy6%2B2buu%2FifSQfmVcyfrS6GpsiK7a9WF2PHZ2Jl9jc0NGgXXXSRR9u0aZM6oICiSjQBiiryOn9CQChQOFk6eohU%2FDShgA9F9bBm%2FavxakXOkwJVg9AEXYzHj7jZV4FEKKJkmL9q8%2Fs4ue9WBg99B7P1QtpXX0O0%2B%2Bc0tF7CvIWX51fhua%2BS3GWq4Qm6BtPxEQIn00U4soAjj%2Fwda190y6TDhzPhB%2Fx%2BnNRRnr3%2FzSAkKze%2FNyt0Uh1%2F%2Bfp30H%2F4p3T9%2BcNZtkJdYwdm6jTW%2BD4i8zewfN3b6Tv8U7r%2B%2FJGSNkZyEHN8H6HmSyfn6woBfd6k9k%2Bc4hGK5KJByfBzJvud5BFal1yFT5PYqSO0LrkSn6fA33Dp5%2Bh59vucfOp6HNtdtKPqDZx70fXUNW1GQlX%2BD8ygi%2BHTZte%2Fb77nrdTHewH4wC%2B38h9vuJ%2BMz9UKufruvyKS7IdAgBUjj7Pi7pfw7Tf%2BCUsLVMQPzFIXw6fJiu2vVhfDp8ky%2FyxcuFBftWqVV2tqalJOSwfFo6BJu7BOPNuvdXVNLFv9KtLpMXqO3IWVSdKycA2LV7yMUKQ1f105EncROA7BCboD2lEH1asgbKvkCSCApuZ1NDXfUmLwC176vbLRuZQSqaoIUR0fJD5dQTgjrN78Ebza5LOLM%2BG%2F8JU%2FzR75wJSzl0r4HStfT9vSK4gN7UWoXuoXbMJIDBAdfpJwaD5eDRav%2Bqt8G1QvdU2bMJIDjJ3eRSiyAG0W9jPtzLQy%2B4f7f4%2FX56N92UvxaKBpFouWvXTCqA2Wr3sHy9e9Y078759BF0PXZsf%2F%2BRvuKnvlmTvTndt%2BU%2F5qMztMr4Tvm6Uuhq5Vbn%2B1uhi6Nrl%2FlixZommBQEA6yQyaT4dk0l1crhQeKJsvLSx6aV10YekF5BQpFktQvB7sdAZ9gi6GTGdQfR6cmIUsWsZaaY45n98IunzPBF2DmfhrL7u15EKZa%2F5c2q9pdTS2XlK4MINtLAi2ldiueepoKG4TaKO5ow0l7P8fs7911atpbrsy956MjZffPqW%2F58r%2FlYGfW%2F0Ls9PFwKnc%2Fsve9VTett4iO%2F%2FtrqL%2F3BWd0n5d15ORSMQMh8OKVl9fbxv7xvEsa8a2LJxUBiGqW1AjARHwIT066VOnUSboYqRPx%2FAtXoCtW8hEJt8BTz%2Fw1hnZGy7%2FoZuMDnpRPTrpU4OoE3QNpuJXs5Kyxn%2F%2B8c%2B5%2BPZpuabhzIr%2Fvjsvqsr%2BW%2F760Yr5a%2FofnpV%2FrKDnL%2BR%2F9%2F4NBoNRVVUtraGhwTIOvaNNCfzklLe5HilUZDKDtKyCuNfEV4dF4VXoGkrAi%2BLzkj4VZcePN5bpYixTv7L08Kl%2FOK4vqMeWKk4ijbRsVl34gxn5GUdBCfpQfV7Sp8bY%2BePzynQNpuJXZr9a49f4JfyvvmFndfzA%2F0v%2BKb1%2F87oYj%2Fzmks7FW%2B8%2Fos%2BPoIZDhaoTFYwejFgK89QAj%2Fxw9ZS6GNt%2F%2FLKV886%2F65A%2BP4ISCSNUpeIIZ8ZSJHoHePgHK6fUNajxa%2Fwaf274xfdviS7GvrsvmJUuhhAiQSW6GFl%2BtboDQoiEUomuQY1f49f4c8qv6WLU%2BDV%2BjT8lv6aLUePX%2BDX%2BlPyaLkaNX%2BPX%2BDldDLK6GGJSXYxP%2FVu9oSiiooKXJSvUskvex468Zdq6%2FR%2B7yZ%2FJFeSo8Wv8Gv85xJeSvn1%2FNbUuxhe%2Fs8hUVYGmiep1MZxsyS1bcvKp10xat%2F%2FDn1PTquoWBM19S7DSE0jp1sO0bWr8Gr%2FGn2O%2BW%2BNDYtnw7EOXl%2BhiiJ%2F97Gfqbb%2FaZHm9Cn6fwKsrbpCocPYiHdd405RkDEkmIxk88OaVGzZs6L322mvNBQsWaO%2F%2FjJXUdYFXdwOQqrrLQCsp%2By2l6xjLcvmGUePX%2BDX%2BXPMNU5LOOGQykv1%2Funy5rusFXQzdoxAOKtRFVMJBBa%2Bu5MvOzTQ8yY0cUmmHeMIhlnCQE%2Br2BwKCUEDF7xf4vAqaKqqs2%2B8an0pJ4km7xn8O8zUlQW%2Fvt%2Bjs%2FDi2HePkiW%2BzbPnHnvf%2BaRvbx8XHvstDy6%2Blv27NrPn157bPShdjbH%2FPWfOPaeXuX8E4drkuhscj8PsVImGVurCCT1dQNTh2srSSzrKOV5W%2FRHXcctle3TXKsmWZLobP68XvEwT8WbZa3RzJtrMjGulg2UqZLkCN%2F9zhJ%2BN7iYQa8PsEYyP7CIfq8HnFWbG%2Fq%2Btr09q%2BZMmH5sw%2FK5JPoQYCLMkcYMx77qzt9%2BvMShfD8CsV239D586qdDE%2B8%2BUtgIJpSnRNlOti5L97IQtTBizBwgWX03XqvjzKtqeavxSqWyMp08WwbB3DlIi0xLJsd%2FhTYQTNJVBMyx0GWbYs0wWoht91%2FKssWfqRs8afC%2FvNzCDpdA%2B6bwEB%2F6JJ2Zn0AKlUDx69CZ9%2F0XPG%2Fr6Bp%2FH5mhiPO%2FT270HX5xGLZ%2Bsx2mn6%2B39OOtWDxAJUdG8rLS1v5ODBL9Gx%2BDNV2T%2BjLkbcmZP%2B9Rlj6ANHSVgG8%2BM7iTW8DrJFEarla5nZ6WKk0rJi%2B0lXqYuRcDBMiWm55e%2FLdTGy85tEykFKiccjcN9m%2BEp0MeY32JMMUVznZDIOiaRDKiPLdTFSL8CybLSkQ%2B4tSTWbO5VxnWOak%2BgCVMH3hz%2FAwJB11vhnYr8SMzne9SVscxiEQCJRVR9LOj6E19%2Fijthsi6PH%2FgXLGMq3URQvHe0fQtWbz4r9tuWK3BiGhe2o0%2FJPnDzA4o7LGByyONb1DB2L3sPAkIVlJjl67IvU11%2BA3%2FcSAoGlaJ4QY2NP8PgTN5NKD1LXaFdl%2F0y6GKF6a07697wT%2F80T6lrax56mY%2FQpRPBp%2BuvXzur6ycRmp4uRGLUqtp%2Fx6nQxhkYsVxfDkGQMp1wXw1LcOYgQuLoYqphUF2NBY%2Fkr2NwIwjAdUmlJKuWU6WIkU5tRMm65LUEhNO%2Fd87d5zrr1t015zK0c5pbld5xyXYCp%2BJXfwWfGHx3eQU%2Fv7UgsAr7FpNInC7ZXwe8%2B8Q3GY4doX%2Fh2GudvJZ3p5%2FChzzA69mVWrf4XAE4c%2FybjsUMsbHtbvs2hg9czMvovrFz15Tn3z9EjN%2BYfBI4jWbb805Py9z%2F2LvfiFDA0clP%2B708P3wQoBAJL8fmWo%2Ftejg24xdJtEOcRCM2n59RnicWdquyfSRejJWqfef9KyaIDd%2FGTzd%2FENE%2FTOvQHWg7%2FnmdXnjOr68dKzk4XIxGzK7f%2FE1XqYoxflbffsmS5LkbdcldZS0qHjJHNgrqrJUp0MY6e3ENP%2F0NIx2Fh80U0zduYF9ywLJmNQLJMFyO0%2BL15p4ui2nkdS27kwLNu6bN0xh2GLlr8OQ4euK7kWC5K5zpjoi7AVPzCRf5FYvF9CCnYcN4PpnzKz5Z%2F6Oi3WNj6VuYveDGjo48xPPq1Etsr5eu%2B9dSJdgLhy0hnHCwriGkFSCR68jzdt44IC0vaWHaQROIUhilnZf90m8%2B3hZHRP9FQfxkjow%2B62fRJ%2BKvWuAFxz9NvZcPGHwLw9O7i%2FbezcvU1ZX4BEOpCVq7%2BbtX2z6SLMRfXz9KhnZz0dBJ1gnTpK9iSSLC06%2Ffc2%2FGBUl2MCvladmRQrS5GOiMrt79qXQwnXxNCMokuRmiJxMy%2B8lBNgVAKAaJYFyOT8RPwraW77wFGonezcqmf%2BsiKfN7Cstwk5URdjCs6Jl8cqmlNBQ2MbLD3eFrLjpUNeSfoAkzFzyerlv4DPd0%2FIDr%2B5JTMM%2BFbZppT%2Fb%2BhruFFRCIXsHbdD6c9z1T8uvpLsYxxjhz6CrH4fhw7SV4XI8uL1F2K5Z%2B8jeNMze%2Ft%2BS9sK04svp9waDWx%2BDP4fIvIpE8SDG0gGt1JZ%2BeniMcPEYvtwUj3sWTpR7Fsd17rvoefXBej2D%2BWZedtLd030T0tc%2Br%2FGXUx5uD6WXviFzy67F3YNnSH12JbFmHrFAtG9tNXNM2olD9rXQynCvur1cWwJz4sJ9HFcN8%2BgCWKV2LJEl0Mn3cxggYSSbdS8eHj97N%2BdWdhCCpz87FJdDH%2Bh7fo%2BOOEQuvnnLv7qTcDYBr97Hn6bSW%2F23jef1XFisX2c%2FTIjYCgLrKJxqar6O%2F9Mal0V1VtJttSiaM40qC15Q2oWpBE4hjLl1%2FHnt3vZPHid3P0yBDR6C5CgVXoehN9vT8kOvYEmqd%2BznxlOQaaovN82XyZEVYNPsiagfvLfrd64P4pA8Rsthl1MarYqtbFmGbTTpw4IZdvKYpSE0p6lehi2BKhBvLHxmKnsB1ZMjwpVMct1cXIJlXLh5fZg0JMf6x4GDeZLsBU%2FPznMIZparpi2jaz4Z%2B36b%2FIpAc5cuRGTHMQAK93Eees%2BVLV%2FK7jNyOEwtpzb0XTQwAMnBL5rPpMbYr9N5Hf0rqN8dguentvp63tLYVMvaIiBCiKB4CR0T%2BBouL1txXaCFHWPxP5u5%2B6GiFcSYSnd78l3%2B7p3W8BqSCERiK2l%2Fr6zXPm%2F5l0Mc70%2BtnYdw9%2FWvF37Fx2Tf7YC7p%2BxJUHb2bV6e1sX%2F3hqvmz1cU4T%2Byu3P4qdTEm1i0u18XI5WVEQXZvsk4orPPO6mKoev5YvoCnWl63v9%2Ba%2BuZVFdWV48Is08UAA2XCE0fK6vgA0dEn0DSVcHhZRW8cquX7AwtYt%2F6rDA3ez8DpX2EaPVOuRJ2KL6WDIE3A34LuCxU9dYddXQwFVxdjmjaqOjW%2Ff%2BAHRMLnEQwuIpPuwnFGicf3IRSD%2BPhTGEYvgjS2nUKofpAGieRedM88LHuIZGIPtjOMdJKT8jef%2FyNi0b0cO%2F6vbNj4%2FZJ9gBNdt9Df9yMaG8sDxOjIDrpPfpv1G2%2Bvyv8z6mIos%2B9f4Vhs6LubOzbdXMJ5tu2lXHH0m8zLnKI5cYTT4c6q%2BLPWxVAqt79qXQyl3P4yXQxFcVW9J67AKtbF0DQwrXT%2BWH3dMjzZsubFymwTdTH%2B8KSYMkqHwx2YZj%2Fp1FMEA6sZjz6W1zs4dvSTrFnzldIkEOW6ANPxAZKJnUTCHegeMePTazb8vXveRWvr22hbeCX%2BgJ%2Be7u%2BXnWtmvopX96KIGNI5jSNNek%2Fehq5ZoOloqo3i0fB5fYhJ2kjVg6raKEKblL9mzeexrTE09XUoqga8x311Pc9N2s5vKuhMWkYMTQ9jWUm07EqeSvwTi%2F%2BJSHgxukcQTzyU3wdYseL9HD36bxw%2Fdj1LOt6P19%2BGYYwyMvRHTg%2FdS8fiv8Gjiar8P5MuRnEfVNO%2FXjPOpUdvRfh8WMEGdK2Io9RxumkDbePPcPnJ2%2FjdOR8n5W2smD9bXQxPkQ0z2V%2BtLsaD7zhWZn%2BJLsaxqMCjuZoWatF74Im6GIZ5gnRmxNXFUDRWL7sKn1cpCRCOlGW6GA%2FuFdlhbPndtaLz7fT0%2FpCRoZ9g12%2Bmre2NxGO%2FI1J3Pg0NF%2Bf57hTInc5M1AWYju%2FOw3oJh%2BZzout6Vq26ccoLarb8gN%2BPpJujhz%2Forjhd9tYSuyvlL136JgYH7qLn5A1Z%2FyvURdoxzWGkdQRfeA1Llr6Rwf7yNoYxhG0cxhdaMwVfRfHPr2zi6a3L%2Fhuqyn5pn6S5%2BVJ8XgVpn8jv57Zz11xH36k7OdX7rzjSzW2pWh2rV32UcGRd1f6fURdjQh9Uyn%2FHUx%2BkPt0HwN8%2F%2Fgb%2B%2FeKfkc7mYq559N3UWYMQCLAqtZtVT76FWy69C1P1V8SfrS6G36dUbH%2FVuhhZPxXzS3QxTsRd4Q1dE6jZb3PmXptEQvNZvPAKMkaUvtP3Y1tJmuevoL11KwF%2FU35u4cjCtzon1u13F165UxNFlM59fN5zmTfvptK538aby6J%2BIQFaHR%2FAp6sgxuhc%2Fp6SZb9zxd%2B8%2BVu5GD3lqKESftvCV9DSegnx2LOgeKkLr8PMnCYW30coOA%2BvV7Co%2FRW0tl5CPHYAKXQi2TbR8T0EA%2FPweETV9lcyqprJ%2FtHRP%2BH1eWlr3YrHI9A8DgvbLs%2BPMPOvDZdug6Xb5sT%2FM%2BlieHUxK%2F5PLvvP8tFK9t%2BfXP6jMv8ogKdC%2Fmx1MTweUbH91epieHUxqX%2Fyuhi5%2FALF4qXZbcOawpKK5qZJEkw5IVVc%2BT0EZboYbo6jdGRSyVai4Zs9gRCyTBdgJv7qc754Vvlzab%2BmRmhoKMjgef0t%2BVWU%2BameGqG%2B%2FoJCx%2FtaaPK1uAFa%2Fs%2FYP3%2Fei2hqelE%2BJ7X23Jv%2FYv37fOPPRhejGv5Fr3wgb%2BOJotXoX%2Fp2sfUnyj9Lll%2Bmi%2BF%2B3xyE5Q4zlCq%2FT577J%2FeudqIuhm2DjSzLbzyz%2F%2F0zPMEk5669pSzHMVEXYCq%2BqMz0Gv95yl%2Bx4qvT8g1Tzor%2Fwe0vq%2BgtSe5N%2Fte3%2FrZi%2Fsq998zKP6aUfzH%2Fl%2Bli2IPva2PBLaccR5a90qp0y8F3%2Ff6Skrr6iqKIzsZblj7T%2F97jEy1e1vmNGbn5FWTZT7TrD5Xzq%2F8QNX6ND1%2B%2B8N7quEWrHP%2Bf8w9ZXYwTT76m0zTdb4wZxix%2BTMmDv9h4s23bO4rq6meEEOm2traRwQNvXmnk%2BLP8efCXNX6NX%2BP%2FJfl5XYydO3f2777%2F4mXxeLzTcZyVs6mrryjKQeDIZHX7f%2FGLX%2FTtvu%2BiZfF4vNOyrJWO47QBFfGBhKIoPZqm1fg1fo3%2FF%2BRr2eq19mc%2F%2B9nUj370o1OpVCpqWdax2dTV1zRtyrr9W7duTfb29ub5QNV8RVFq%2FBq%2Fxv8L8mu6GDV%2BjV%2FjT8n%2F%2FwEPV3J1%2Fv5S1QAAAABJRU5ErkJggg%3D%3D"
  };
  //
  function rgb2hsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    //
    const lum = (max + min) / 2;
    let hue = 0, sat = 0;
    //
    if (delta !== 0) {
      sat = lum > 0.5 ? delta / (2 - max - min) : delta / (max + min);
      if (max == r)
        hue = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
      else if (max == g)
        hue = ((b - r) / delta + 2) * 60;
      else if (max == b)
        hue = ((r - g) / delta + 4) * 60;
    }
    return [Math.round(hue), Math.round(sat * 100), Math.round(lum * 100)];
  }
  ;
  //
  class Storage {
    //
    constructor(name, defaults) {
      this.name = name;
      this.default = defaults;
      this.data = { ...defaults }; // Initiale Kopie von defaults in data
    }
    reset() {
      this.data = { ...this.default };
      this.save();
    }
    save() {
      return GM.setValue(this.name, this.stringify());
    }
    async load() {
      const storedData = await GM.getValue(this.name, null);
      this.read(storedData);
    }
    read(str) {
      if (str === null) {
        this.data = { ...this.default };
        return;
      }
      try {
        const parsedData = this.parse(str);
        this.data = { ...this.default };
        for (const key of Object.keys(parsedData)) {
          this.data[key] = parsedData[key];
        }
      }
      catch (ex) {
        console.error(`BLICK error: Failed to parse stored settings for ${this.name}:`, ex);
        this.data = { ...this.default };
      }
    }
    set(key, value = this.default[key]) {
      if (key in this.data) {
        this.data[key] = value ?? this.default[key];
        this.save();
      }
      else {
        console.warn(`Blick error: Property ${String(key)} does not exist on Settings`);
      }
    }
    static replacer(key, value) {
      if (value instanceof Map) {
        return { _type: 'Map', value: Array.from(value.entries()) };
      }
      return value;
    }
    static reviver(key, value) {
      if (value && value._type === 'Map') {
        return new Map(value.value);
      }
      return value;
    }
    stringify() {
      return JSON.stringify(this.data, Storage.replacer);
    }
    parse(str) {
      return JSON.parse(str, Storage.reviver);
    }
  }
  class LoginCredents extends Storage {
    constructor() {
      let def = {
        name: "",
        pw: "",
        savelogin: true,
        token: "",
        exp: null
      };
      super("loginCredents", def);
    }
  }
  class Sync {
    constructor() {
      this.access = 0;
      this.serverURL = "https://phi.pf-control.de/tgchan/API.php";
      this.creds = new LoginCredents();
    }
    async login(username, password, savelogin) {
      this.creds.data.savelogin = savelogin;
      if (savelogin) {
        this.creds.data.name = username;
        this.creds.data.pw = password;
      }
      else {
        this.creds.data.name = this.creds.data.pw = "";
      }
      this.creds.save();
      return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
          method: 'POST',
          url: this.serverURL,
          headers: {
            'Content-Type': 'application/json',
          },
          data: JSON.stringify({
            type: "test",
            username: username,
            password: password
          }),
          onload: (response) => {
            if (response.status === 200) {
              try {
                const result = JSON.parse(response.responseText);
                if (result.token !== undefined) {
                  this.creds.data.token = result.token;
                  this.access = (result.access !== undefined) ? parseInt(result.access) : 0;
                  this.creds.data.name = result.name ?? "undefined";
                  this.creds.data.exp = new Date();
                  this.creds.save();
                  resolve(true);
                }
                else {
                  this.creds.data.token = "";
                  this.creds.data.exp = null;
                  this.creds.save();
                  resolve(false);
                }
              }
              catch (ex) {
                console.log("BLICK login error:", ex, response.responseText);
                reject(`Error: ${response.status}, ${response.response}`);
              }
            }
            else {
              this.creds.data.token = "";
              this.creds.data.exp = null;
              this.creds.save();
              try {
                const result = JSON.parse(response.responseText);
                reject(`Error: ${response.status}, ${result.error}`);
              }
              catch (ex) {
                reject(`Error: ${response.status}, ${response.response}`);
              }
            }
          },
          onerror: () => {
            this.creds.data.token = "";
            this.creds.data.exp = null;
            this.creds.save();
            reject('Request failed');
          }
        });
      });
    }
    async upload(name, storage) {
      if (storage === null)
        return;
      if (!this.creds.data.token) {
        throw new Error('Not authenticated');
      }
      return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
          method: 'POST',
          url: this.serverURL,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.creds.data.token}`
          },
          data: JSON.stringify({
            type: 'upload',
            token: this.creds.data.token,
            data: storage.data,
            obj: name
          }, Storage.replacer),
          onload: (response) => {
            if (response.status === 200) {
              try {
                let result = JSON.parse(response.responseText);
                if (result.success === undefined) {
                  reject(`Error: ${response.status}, ${result}`);
                }
                else {
                  if (result.access !== undefined)
                    this.access = result.access;
                  resolve();
                }
              }
              catch (ex) {
                console.log("BLICK upload error ", ex);
                reject(`Error: ${response.status}, ${response.response}`);
              }
            }
            else {
              try {
                const result = JSON.parse(response.responseText);
                reject(`Error: ${response.status}, ${result.error}`);
              }
              catch (ex) {
                console.log("BLICK upload error ", ex);
                reject(`Error: ${response.status}, ${response.response}`);
              }
            }
          },
          onerror: () => {
            reject('Request failed');
          }
        });
      });
    }
    async download(name, storage) {
      if (storage === null)
        return;
      if (!this.creds.data.token) {
        throw new Error('Not authenticated');
      }
      return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
          method: 'POST',
          url: this.serverURL,
          data: JSON.stringify({
            type: 'download',
            token: this.creds.data.token,
            obj: name
          }),
          headers: {
            'Authorization': `Bearer ${this.creds.data.token}`
          },
          onload: (response) => {
            if (response.status === 200) {
              // const serverData: T = JSON.parse(response.responseText);
              storage.read(response.responseText);
              // storage.data = { ...serverData };
              resolve();
            }
            else {
              try {
                const result = JSON.parse(response.responseText);
                reject(`Error: ${response.status}, ${result.error}`);
              }
              catch (ex) {
                reject(`Error: ${response.status}, ${response.response}`);
              }
            }
          },
          onerror: () => {
            reject('Request failed');
          }
        });
      });
    }
  }
  class Settings extends Storage {
    //
    constructor() {
      const def = {
        changeFont: true,
        fontsize: 12,
        fonttype: 1,
        paragraphMargin: true,
        imageHover: true,
        invertCol: false,
        replyForm: true,
        manageWatchlist: true,
        autoUpdWbar: false
      };
      super("settings", def);
      this.fontTypeList = ["unset", "Georgia", "Palatino Linotype", "Book Antiqua", "Tahoma", "Arial", "Helvetica", "Verdana", "Times New Roman"];
    }
    ;
  }
  class EditorConfig extends Storage {
    constructor() {
      let def = {
        colorList: Array(15).fill("#ffffff"),
        iconList: [
          { label: "Favourite", arr: [] },
          { label: "+", arr: [] }
        ],
        saveText: "",
        autoSave: true
      };
      super("editorConfig", def);
    }
  }
  //
  //GUI interaction
  class Sidebar {
    constructor(dom, set, syncr) {
      this.barStyle = `
      #BLICK_bar {width:20px;overflow:hidden auto;position:fixed;transition:width 0.5s,opacity 0.5s, height 0.5s; right:0px;height:30px;background-color:#9ad;z-index:9;opacity:0.5;top:50px;border:2px ridge #ddf;border-top-left-radius:25px;border-bottom-left-radius:25px;}
      #BLICK_bar .BLICK_cont {width:250px;font: 16px/2em georgia, Palatino Linotype, Book Antiqua, Tahoma;padding-left: 20px;visibility:hidden;}
      #BLICK_bar:hover {width:270px;opacity:1;height:min(450px, calc(95vh - 50px));}
      #BLICK_bar:hover .BLICK_cont{visibility:visible;}
      #BLICK_bar .BLICK_button {background-color: #DDDDFF;border: 1px ridge #CCCCCC;border-radius: 10px 10px 10px 10px;cursor: pointer;display: inline-block;font: 30px/17px georgia;height: 20px;margin: 5px;text-align: center;vertical-align: middle;width: 20px;}
      #BLICK_bar .BLICK_button:hover {background-color: #aaf;}
      #BLICK_bar .BLICK_button:active {background-color: #77d;}
      #BLICK_bar input {margin: 5px;}
      #BLICK_bar label #BLICK_bar input[type=checkbox] {cursor:pointer;}
      #BLICK_bar input[type="submit"]:hover {opacity: 0.9;background-color: #32AFFB;}
      #BLICK_bar input[type="submit"] {cursor: pointer;padding: 4px 8px;font-size: 14px;font-family: Arial, sans-serif;border: none;border-radius: 5px;transition: background-color 0.5s;background-color: #2196F3;color: white;font-weight:bold;}
      #BLICK_bar select {cursor:pointer;font-size: 16px;}
      #BLICK_bar .BLICK_Sec {background: #ccf;padding: 0 5px;border-radius: 5px;width: 230px;  margin: 5px 0;}
      #BLICK_bar .BLICK_sec_buts {display:flex;flex-direction: row;justify-content: space-evenly;}
      #BLICK_imgbox {position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);max-width:90vw;max-height:90vh;z-index:777;display:none;}
      #BLICK_imgbox .loading{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}
      #BLICK_imgbox .imgEl{width:100%;height:auto;display:none;}
      #BLICK_sync_updownSec{display:none;flex-direction: row;justify-content: space-evenly;}
      #BLICK_sync_loginHello{color:green;font-weight:bold;white-space:nowrap;overflow: hidden;}
      #BLICK_sync_loginAccess{padding-left:10px;color:green;font-size: 8pt;height: 10px;line-height: 3px;}
      #BLICK_fonttype{width:130px;}
      .BLICK_floatButs{border:none;background:none;cursor:pointer;position:absolute;top:0;width:16px;height:16px;padding:0;}
      .BLICK_floatButs:hover{filter:brightness(120%);}
      #BLICK_set_export{right:0px}
      #BLICK_set_import{right:18px}
      #BLICK_bar #BLICK_fontsize{width: 30px;height: 20px;margin: 0;box-sizing: content-box;padding: 0;vertical-align: middle;text-align: center;border: 1px solid #DDDDF0; z-index: 2;position: relative;}
      #BLICK_bar #BLICK_plus{border-radius: 10px 0px 0px 10px;margin:0;}
      #BLICK_bar #BLICK_minus{border-radius: 0px 10px 10px 0px;margin:0;}
  `;
      this.barHTML = `
      <div class='BLICK_cont' >
        <div class="BLICK_row">
          <button id='BLICK_set_export' class='BLICK_floatButs' title='Export settings to file'>💾</button>
          <button id='BLICK_set_import' class='BLICK_floatButs' title='Import settings from file'>📁</button>
          <input id='BLICK_set_importFile' type="file" id="fileInput" style="display: none;" accept=".json">
          <input type="checkbox" id="BLICK_changeFont" checked="ckecked">
          <label class="BLICK_title">Font size:</label>
          <span class="BLICK_button" id="BLICK_plus">+</span>
          <input type="text" id="BLICK_fontsize" value="0"/>
          <span class="BLICK_button" id="BLICK_minus">-</span>
          <br/>
          <label style='margin-left: 28px;' class="BLICK_title">Font type: </label>
          <select id="BLICK_fonttype">
          </select>
        </div>
        <div class="BLICK_row">
          <span class="BLICK_title">
            <input type="checkbox" id="BLICK_paragraphMargin" alt="Paragraph margin" checked="ckecked">
            <label for="BLICK_paragraphMargin">Paragraph margin</label>
          </span>
        </div>
        <div class="BLICK_row">
          <span class="BLICK_title">
            <input type="checkbox" id="BLICK_imageHover" alt="View image by hover" checked="ckecked">
            <label for="BLICK_imageHover">View image by hover</label>
          </span>
        </div>
        <div class="BLICK_row">
          <span class="BLICK_title">
            <input type="checkbox" id="BLICK_invertCol" alt="Invert colours">
            <label for="BLICK_invertCol">Invert colours</label>
          </span>
        </div>
        <div class="BLICK_row">
          <span class="BLICK_title">
            <input type="checkbox" id="BLICK_replyForm" alt="Change reply form" checked="ckecked">
            <label for="BLICK_replyForm">Change reply form</label>
          </span>
        </div>
        <div class="BLICK_row">
          <span class="BLICK_title">
            <input type="checkbox" id="BLICK_manageWatchlist" alt="Manage watch list" checked="ckecked">
            <label for="BLICK_manageWatchlist">Manage watch list</label>
          </span>
        </div>
        <div class="BLICK_row BLICK_Sec">
          <span class="BLICK_title">Synchronize Webserver:</span>
          <br>
          <div id='BLICK_sync_loginSec'>
            <input type="input" placeholder="name" value="" id="BLICK_sync_user" style="width:30%;" />
            <input style="width:30%;" type="password" placeholder="password" value="" id="BLICK_sync_pass" />
            <label for="BLICK_sync_savelogin" style='width:70%;display: block;cursor: pointer;'><input type="checkbox" id='BLICK_sync_savelogin'/>Store Login Data</label>
            <input type="submit" onclick="return false;" value="Login" id="BLICK_sync_loggin" />
            <a href="https://phi.pf-control.de/tgchan/reg.php" target="_blank">Register Account</a>
          </div>
          <div id='BLICK_sync_loginHello'></div>
          <div id='BLICK_sync_loginAccess'></div>
          <div id='BLICK_sync_updownSec'>
            <input type='submit' onclick='return false;' id='BLICK_sync_upload' value='Upload'/>
            <input type='submit' onclick='return false;' id='BLICK_sync_download' value='Download'/>
          </div>
        </div>
        <div class="BLICK_row BLICK_Sec">
          <span class="BLICK_title">Export Thread to file:</span>
          <br>
          <div class='BLICK_read_readExpButs'>
            <input type="submit" id="BLICK_epub" value="Epub" onclick="return false;">
            <input type="submit" id="BLICK_cbz" value="CBZ" onclick="return false;">
          </div>
        </div>
      </div>
  `;
      this.dom = dom;
      this.syncr = syncr;
      this.setting = set;
      this.addElements();
      this.addEvents();
      this.fexp = new FileExport();
    }
    restart() {
      this.loadSettings();
      this.dom.watchbar?.destroy();
      this.dom.watchbar = null;
      this.dom.repform.removeBar();
      this.dom.initStyles(); //resets watchbar and repform
    }
    //
    loadSettings() {
      let el;
      for (const key in this.setting.data) {
        el = document.querySelector("#BLICK_" + key);
        if (el === null)
          continue;
        if (typeof (this.setting.data[key]) === "boolean")
          el.checked = this.setting.data[key];
        if (typeof (this.setting.data[key]) === "number")
          el.value = String(this.setting.data[key]);
      }
      el = document.querySelector(`#BLICK_fonttype option[value='${this.setting.data.fonttype}']`);
      if (el !== null)
        el.setAttribute("selected", "selected");
      this.syncr.creds.load().then(() => {
        document.getElementById("BLICK_sync_user")?.setAttribute("value", this.syncr.creds.data.name);
        document.getElementById("BLICK_sync_pass")?.setAttribute("value", this.syncr.creds.data.pw);
        const checkbox = document.getElementById("BLICK_sync_savelogin");
        if (checkbox) {
          checkbox.checked = this.syncr.creds.data.savelogin;
        }
      });
    }
    //
    fillFontList() {
      const cont = document.querySelector("#BLICK_fonttype");
      if (cont === null)
        return console.log("BLICK error: language selector not found");
      cont.innerHTML = this.setting.fontTypeList.map((lang, index) => {
        return `<option value='${index}'>${lang}</option>`;
      }).join('');
    }
    //
    addElements() {
      this.tabSet = document.createElement("div");
      this.tabSet.id = "BLICK_bar";
      this.tabSet.innerHTML = this.barHTML;
      document.body.appendChild(this.tabSet);
      this.fillFontList();
      //
      this.tabStyle = document.createElement("style");
      this.tabStyle.id = "BLICK_barStyle";
      this.tabStyle.innerHTML = this.barStyle;
      document.body.appendChild(this.tabStyle);
    }
    //
    addEvents() {
      document.getElementById("BLICK_plus")?.addEventListener("click", () => {
        let num = this.setting.data.fontsize + 1;
        if (num <= 6)
          num = 6;
        this.setting.set("fontsize", num);
        document.getElementById("BLICK_fontsize").value = String(this.setting.data.fontsize);
        this.dom.setFontsize(true);
      });
      document.getElementById("BLICK_minus")?.addEventListener("click", () => {
        let num = this.setting.data.fontsize - 1;
        if (num < 6)
          return;
        this.setting.set("fontsize", num);
        document.getElementById("BLICK_fontsize").value = String(this.setting.data.fontsize);
        this.dom.setFontsize(true);
      });
      document.getElementById("BLICK_fontsize")?.addEventListener("exit", (ev) => {
        let num = parseInt(ev.target?.value ?? this.setting.default.fontsize);
        if (num > 6)
          this.setting.set("fontsize", num);
        else
          ev.target.value = String(this.setting.data.fontsize);
        this.dom.setFontsize(true);
      });
      document.getElementById("BLICK_changeFont")?.addEventListener("change", (ev) => {
        if (!(ev.target instanceof HTMLInputElement))
          return;
        const state = ev.target?.checked;
        this.setting.set("changeFont", state);
        this.dom.setFontsize(true);
      });
      document.getElementById("BLICK_fonttype")?.addEventListener("change", (ev) => {
        if (!(ev.target instanceof HTMLSelectElement))
          return;
        const sel = parseInt(ev.target?.value ?? 0);
        if (sel >= 0 && sel < this.setting.fontTypeList.length)
          this.setting.set("fonttype", sel);
        else
          this.setting.set("fonttype");
        this.dom.setFontsize(true);
      });
      document.getElementById("BLICK_paragraphMargin")?.addEventListener("change", (ev) => {
        if (!(ev.target instanceof HTMLInputElement))
          return;
        this.setting.set("paragraphMargin", ev.target?.checked);
        this.dom.setMargin(true);
      });
      document.getElementById("BLICK_invertCol")?.addEventListener("change", (ev) => {
        if (!(ev.target instanceof HTMLInputElement))
          return;
        this.setting.set("invertCol", ev.target?.checked);
        this.dom.setInvert(true);
      });
      document.getElementById("BLICK_imageHover")?.addEventListener("change", (ev) => {
        if (!(ev.target instanceof HTMLInputElement))
          return;
        this.setting.set("imageHover", ev.target?.checked);
        this.dom.setHoverImg();
      });
      document.getElementById("BLICK_replyForm")?.addEventListener("change", (ev) => {
        if (!(ev.target instanceof HTMLInputElement))
          return;
        this.setting.set("replyForm", ev.target?.checked);
        this.dom.setReplyForm(true);
      });
      document.getElementById("BLICK_manageWatchlist")?.addEventListener("click", (ev) => {
        if (!(ev.target instanceof HTMLInputElement))
          return;
        this.setting.set("manageWatchlist", ev.target.checked);
        this.dom.setWatchbar();
      });
      document.getElementById("BLICK_sync_loggin")?.addEventListener("click", (ev) => {
        let nam = document.getElementById("BLICK_sync_user")?.value;
        let pw = document.getElementById("BLICK_sync_pass")?.value;
        let savelogin = document.getElementById("BLICK_sync_savelogin")?.checked;
        this.syncr.login(nam, pw, savelogin).then((ret) => {
          if (ret === true) { //logged in
            document.getElementById("BLICK_sync_updownSec")?.style.setProperty("display", "flex");
            document.getElementById("BLICK_sync_loginSec")?.style.setProperty("display", "none");
            let loginHello = document.getElementById("BLICK_sync_loginHello");
            if (loginHello)
              loginHello.innerHTML = "Hello, " + this.syncr.creds.data.name + "!";
            //
            let loginAccess = document.getElementById("BLICK_sync_loginAccess");
            if (!loginAccess)
              return;
            if (this.syncr.access > 0) {
              loginAccess.innerHTML = "Last uploaded: " + this.formatDate(this.syncr.access * 1000);
            }
            else {
              loginAccess.innerHTML = "No data uploaded";
            }
          }
          else {
            alert(`Login failed without reason!`);
          }
        }).catch(ex => {
          alert(`Login failed!\n${ex}`);
          console.log("Login failed", ex);
        });
      });
      document.getElementById("BLICK_sync_upload")?.addEventListener("click", (ev) => {
        let loginHello = document.getElementById("BLICK_sync_loginHello");
        let loginAccess = document.getElementById("BLICK_sync_loginAccess");
        if (loginHello)
          loginHello.innerHTML = "Connecting...";
        Promise.all([
          this.syncr.upload("sidebar", this.setting),
          this.syncr.upload("editor", this.dom.repform.editConf),
          this.syncr.upload("watchbar", this.dom.watchbar?.wdata ?? null)
        ]).then(res => {
          if (loginHello)
            loginHello.innerHTML = "Upload successful!";
          if (loginAccess)
            loginAccess.innerHTML = "Last uploaded: " + this.formatDate(this.syncr.access * 1000);
          console.log("Upload successful!");
        }).catch(ex => {
          if (loginHello)
            loginHello.innerHTML = "Error.";
          alert(`Upload failed!\n${ex}`);
          console.log("Upload failed", ex);
        });
      });
      document.getElementById("BLICK_sync_download")?.addEventListener("click", (ev) => {
        let loginHello = document.getElementById("BLICK_sync_loginHello");
        if (loginHello)
          loginHello.innerHTML = "Connecting...";
        Promise.all([
          this.syncr.download("sidebar", this.setting),
          this.syncr.download("editor", this.dom.repform.editConf),
          this.syncr.download("watchbar", this.dom.watchbar?.wdata ?? null),
        ]).then(res => {
          Promise.all([
            this.setting.save(),
            this.dom.repform.editConf.save(),
            this.dom.watchbar?.wdata.save()
          ]).then(() => {
            if (loginHello)
              loginHello.innerHTML = "Download successful!";
            console.log("Download successful!");
            // alert("Download successful!\nRefresh the page to update the settings.");
            this.restart();
            //						alert("Data imported! Reload the page to apply the settings.");
          });
        }).catch(ex => {
          if (loginHello)
            loginHello.innerHTML = "Error.";
          alert(`Download failed!\n${ex}`);
          console.log("Download failed", ex);
        });
      });
      document.getElementById("BLICK_set_export")?.addEventListener("click", () => {
        let expObj = {
          settings: this.setting.stringify(),
          editor: this.dom.repform.editConf.stringify(),
          watchbar: this.dom.watchbar?.wdata.stringify() ?? null
        };
        const jsonString = JSON.stringify(expObj, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'questden_BLICK_settings.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
      document.getElementById("BLICK_set_import")?.addEventListener("click", () => {
        document.getElementById('BLICK_set_importFile')?.click();
      });
      document.getElementById("BLICK_set_importFile")?.addEventListener("change", (event) => {
        if (event.target == null)
          return;
        const file = event.target.files?.item(0) ?? null;
        if (file === null)
          return;
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const jsonString = e.target?.result || null;
            if (jsonString === null)
              return;
            const jsonData = JSON.parse(jsonString);
            if (jsonData.settings !== undefined) {
              this.setting.read(jsonData.settings);
              this.setting.save();
            }
            if (jsonData.editor !== undefined) {
              this.dom.repform.editConf.read(jsonData.editor);
              this.dom.repform.editConf.save();
            }
            if (jsonData.watchbar !== undefined) {
              this.dom.watchbar?.wdata.read(jsonData.watchbar);
              this.dom.watchbar?.wdata.save();
            }
            this.restart();
            //						alert("Data imported! Reload the page to apply the settings.");
          }
          catch (error) {
            console.error('Fehler beim Parsen der JSON-Datei:', error);
          }
        };
        reader.readAsText(file); // Lese die Datei als Text
      });
      document.getElementById("BLICK_epub")?.addEventListener("click", () => {
        this.fexp.showExportForm("epub");
      });
      document.getElementById("BLICK_cbz")?.addEventListener("click", () => {
        this.fexp.showExportForm("cbz");
      });
    }
    formatDate(uixTS = Date.now()) {
      const date = new Date(uixTS);
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const options = {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        timeZone: userTimezone
      };
      return new Intl.DateTimeFormat('de-DE', options).format(date);
    }
  }
  ;
  //
  //
  class ImageManager {
    constructor(container, conf, clickCallback) {
      this.clickCallback = clickCallback;
      this.container = container;
      this.editConf = conf;
      this.selectedItems = [];
      this.startX = 0;
      this.startY = 0;
      this.selectionBox = null;
      this.allIcons = [];
      this.shownIcons = [];
      this.curActTab = -1;
      this.spliterDraggin = false;
      if (this.editConf.data.iconList === null) {
        this.editConf.set("iconList", [
          { label: "Favourite", arr: [] },
          { label: "+", arr: [] }
        ]);
      }
      this.itemCount = 0;
      this.itemsPerLoad = 40;
      this.initialize();
    }
    //
    initialize() {
      this.insertStyle();
      this.insertHTML();
      this.setupEventListeners();
      this.loadTabs();
      this.loadIcons();
    }
    //
    insertHTML() {
      this.pickerDiv = document.createElement("div");
      this.pickerDiv.innerHTML = `
          <div id="BLICK_iP_tabColumn">
            <input id="BLICK_iP_seachInp" type="text" placeholder="Search...">
            <div id="BLICK_iP_tabs"></div>
          </div>
          <div id="BLICK_iP_splitter"></div>
          <div id="BLICK_iP_ImgColumn">
            <div id="BLICK_iP_loading">loading...</div>
          </div>`;
      this.pickerDiv.id = "BLICK_iconPicker";
      this.container.appendChild(this.pickerDiv);
      //
      this.imgCol = document.getElementById('BLICK_iP_ImgColumn');
      this.loading = document.getElementById('BLICK_iP_loading');
    }
    //
    insertStyle() {
      const sty = document.createElement("style");
      sty.id = 'BLICK_iconPicker_style';
      sty.innerHTML = `
          #BLICK_iconPicker {width: 400px;height: 200px;display: grid;grid-template-columns: 89px auto 1fr;overflow: hidden;background-color: #f8f8f8;user-select: none;flex:1;}
          #BLICK_iP_tabColumn {height:200px;display: grid;  grid-template-rows: auto 1fr;width:100%;padding: 1px;background-color: #e8e8e8;box-sizing: border-box;gap: 5px;}
          #BLICK_iP_splitter{background-color: #888;cursor: col-resize;width: 2px;}
          #BLICK_iP_seachInp {padding: 5px;font-size: 14px;border: 1px solid #ccc;border-radius: 5px;width:100%;box-sizing:border-box;}
          #BLICK_iP_tabs {display: flex;flex-direction: column;gap: 5px;overflow-y:auto}
          #BLICK_iP_tabs div {padding: 3px;background-color: #4CAF50;color: white;border: none;border-radius: 5px;cursor: pointer;}
          #BLICK_iP_tabs div.cur {background-color: #fdc03d;}
          #BLICK_iP_tabs div:hover {filter: brightness(90%);}
          #BLICK_iP_tabs div.dragover {background-color: #a5f0a9;}
          #BLICK_iP_tabs div[data-func] {text-align: center;}
          #BLICK_iP_ImgColumn {display: flex;grid-gap: 4px;padding: 4px;box-sizing: border-box;align-items: start;overflow-y: auto;width: 100%;flex-wrap: wrap;align-content: flex-start;}
          #BLICK_iP_ImgColumn .image-container {position: relative;display: flex;flex-direction: column;align-items: center;justify-content: center;}
          #BLICK_iP_ImgColumn .image-container img {width: 64px;height: 64px;border-radius: 5px;border: 2px solid #ddd;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);object-fit: cover;}
          #imgContent .image-container:hover img {border-color: #4CAF50;}
          .selected {outline: 2px dashed #4CAF50;}`;
      document.head.appendChild(sty);
    }
    //
    async loadIcons() {
      const url = 'https://questden.org/kusaba/icons/thumb/';
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const html = await response.text();
        let match;
        const regex = /<td><a href="(.*?)"/g;
        while ((match = regex.exec(html)) !== null) {
          this.allIcons.push(match[1]);
        }
        this.allIcons.shift();
        this.searchItems();
      }
      catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        this.searchItems();
      }
    }
    stripIconName(name) {
      if (name.length < 3)
        return "";
      return name.substring(0, name.lastIndexOf("s."));
    }
    setupEventListeners() {
      document.getElementById("BLICK_iP_ImgColumn")?.addEventListener('mousedown', this.onMouseDown.bind(this));
      document.getElementById("BLICK_iP_seachInp")?.addEventListener("input", this.searchItems.bind(this));
      document.getElementById("BLICK_iP_seachInp")?.addEventListener("keydown", (ev) => {
        if (ev.key === 'Enter')
          ev.preventDefault();
      });
      //
      document.getElementById('BLICK_iP_tabs')?.addEventListener("click", this.onTabClick.bind(this), true);
      document.getElementById("BLICK_iP_ImgColumn")?.addEventListener('click', (ev) => {
        let el = ev.target.closest(".image-container");
        if (el === null)
          return;
        this.clickCallback(":" + this.stripIconName(el.getAttribute("title") ?? "") + ":");
        //
      }, true);
      //
      const splitter = document.getElementById('BLICK_iP_splitter');
      splitter?.addEventListener('mousedown', (e) => {
        this.spliterDraggin = true;
        document.body.style.cursor = 'col-resize'; // Zeige den Resize-Cursor während des Ziehens
      });
      document.addEventListener('mousemove', (e) => {
        if (!this.spliterDraggin)
          return;
        const containerRect = this.pickerDiv.getBoundingClientRect();
        const newWidth = e.clientX - containerRect.left;
        if (newWidth > 50 && newWidth < containerRect.width - 50) {
          this.pickerDiv.style.gridTemplateColumns = `${newWidth}px auto 1fr`;
        }
      });
      //
      document.addEventListener('mouseup', () => {
        this.spliterDraggin = false;
        document.body.style.cursor = ''; // Cursor zurücksetzen
      });
      //
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && this.itemCount < this.shownIcons.length) {
          this.loadItems();
        }
      }, {
        root: this.imgCol,
        rootMargin: '0px',
        threshold: 1.0
      });
      if (this.loading !== null)
        observer.observe(this.loading);
    }
    //
    onMouseDown(event) {
      const target = event.target;
      if (target === null)
        return;
      const clst = target.closest('.image-container');
      //
      if (!this.selectedItems.includes(clst)) {
        this.selectedItems.forEach(item => item.classList.remove('selected'));
        this.selectedItems = [];
      }
      if (!clst) {
        this.startX = event.clientX + window.scrollX;
        this.startY = event.clientY + window.scrollY;
        //
        this.selectionBox = document.createElement('div');
        this.selectionBox.style.position = 'absolute';
        this.selectionBox.style.border = '2px dashed #4CAF50';
        this.selectionBox.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
        document.body.appendChild(this.selectionBox);
        //
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
      }
    }
    //
    onMouseMove(event) {
      const currentX = event.clientX + window.scrollX;
      const currentY = event.clientY + window.scrollY;
      if (!this.selectionBox)
        return;
      this.selectionBox.style.left = Math.min(this.startX, currentX) + 'px';
      this.selectionBox.style.top = Math.min(this.startY, currentY) + 'px';
      this.selectionBox.style.width = Math.abs(this.startX - currentX) + 'px';
      this.selectionBox.style.height = Math.abs(this.startY - currentY) + 'px';
      //
      const rect = this.selectionBox.getBoundingClientRect();
      if (rect === null)
        return;
      // Selektionslogik ändern, um nur hinzuzufügen, aber nicht sofort zu entfernen
      document.querySelectorAll('.image-container').forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        //
        if (this.isIntersecting(rect, itemRect)) {
          // Bild nur hinzufügen, wenn es noch nicht selektiert ist
          if (!this.selectedItems.includes(item)) {
            item.classList.add('selected');
            this.selectedItems.push(item);
          }
        }
        else {
          if (this.selectedItems.includes(item)) {
            item.classList.remove('selected');
            this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
          }
        }
      });
    }
    //
    onMouseUp() {
      document.removeEventListener('mousemove', this.onMouseMove.bind(this));
      document.removeEventListener('mouseup', this.onMouseUp.bind(this));
      //
      // Entferne das Auswahlrechteck nach der Selektion
      if (this.selectionBox && this.selectionBox.parentNode) {
        this.selectionBox.parentNode.removeChild(this.selectionBox);
        this.selectionBox = null;
      }
    }
    //
    isIntersecting(rect1, rect2) {
      return (rect1.left < rect2.right &&
        rect1.right > rect2.left &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top);
    }
    //
    drag(event) {
      if (this.selectedItems.length === 0 && event.currentTarget !== null) {
        this.selectedItems.push(event.currentTarget);
      }
      event.dataTransfer?.setData('text/plain', JSON.stringify(this.selectedItems.map(item => item.title)));
    }
    //
    enableTabDrop() {
      const BLICK_iP_tabs = document.querySelectorAll('#BLICK_iP_tabs div');
      BLICK_iP_tabs.forEach(tab => {
        tab.addEventListener('dragover', (event) => {
          event.preventDefault();
          tab.classList.add('dragover');
        });
        //
        tab.addEventListener('dragleave', () => {
          tab.classList.remove('dragover');
        });
        //
        tab.addEventListener('drop', (event) => {
          event.preventDefault();
          tab.classList.remove('dragover');
          const titles = JSON.parse(event.dataTransfer?.getData('text') ?? "{}");
          const tabId = parseInt(tab.dataset.tabid ?? "-1");
          if (event.target?.dataset.func == "+")
            return;
          if (event.target?.dataset.role == "delete" || tabId === this.curActTab) { //remove entries
            if (confirm("Remove icons from list?")) {
              let ind = 0;
              titles.forEach((title) => {
                ind = this.editConf.data.iconList[tabId].arr.indexOf(title);
                if (ind > -1)
                  this.editConf.data.iconList[tabId].arr.splice(ind, 1);
              });
              this.clearItems();
            }
          }
          else { //add entries
            titles.forEach((title) => {
              if (!this.editConf.data.iconList[tabId].arr.includes(title)) {
                this.editConf.data.iconList[tabId].arr.push(title);
              }
            });
          }
          this.editConf.data.iconList[tabId].arr.sort();
          this.editConf.save();
        });
      });
    }
    //
    searchItems() {
      const search = document.getElementById("BLICK_iP_seachInp")?.value ?? "";
      //
      if (this.curActTab === -1 && search !== "") {
        this.shownIcons = this.allIcons.filter(el => (new RegExp(search.replace(/\s/g, ".*"), "i")).test(el));
      }
      else if (this.curActTab === -1 && search === "") {
        this.shownIcons = this.allIcons;
      }
      else if (this.curActTab !== -1 && search !== "") {
        this.shownIcons = this.editConf.data.iconList[this.curActTab].arr.filter(el => (new RegExp(search.replace(/\s/g, ".*"), "i")).test(el));
      }
      else if (this.curActTab !== -1 && search === "") {
        this.shownIcons = this.editConf.data.iconList[this.curActTab].arr;
      }
      //
      this.clearItems();
    }
    //
    clearItems() {
      if (this.imgCol === null)
        return;
      this.imgCol.innerHTML = "";
      this.imgCol.scrollTop = 0;
      this.itemCount = 0;
      this.loadItems();
    }
    //
    loadTabs() {
      const tabs = document.getElementById('BLICK_iP_tabs');
      if (tabs === null)
        return;
      this.editConf.data.iconList.forEach((item, index) => {
        const tab = document.createElement('div');
        tab.dataset.tabid = String(index);
        if (item.label == "Favourite" || item.label == "+") {
          tab.innerHTML = item.label;
          tab.dataset.func = item.label;
        }
        else {
          tab.innerHTML = item.label + " <span data-role='rename'>🖉</span><span data-role='delete'>🗑️</span>";
        }
        if (index === this.curActTab)
          tab.classList.add("cur");
        tabs.appendChild(tab);
      });
      this.enableTabDrop();
    }
    //
    updateTabs() {
      const tabs = document.getElementById('BLICK_iP_tabs');
      if (tabs === null)
        return;
      tabs.innerHTML = ''; // Leere die BLICK_iP_Tabs und erzeuge sie neu
      this.loadTabs();
    }
    //
    onTabClick(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      let target = ev.target;
      if (target.dataset.func === "+") {
        const newLabel = prompt('New Name:', "");
        if (newLabel === "" || newLabel === null)
          return;
        this.editConf.data.iconList.splice(this.editConf.data.iconList.length - 1, 0, { label: newLabel, arr: [] });
        this.updateTabs();
      }
      else if (target.dataset.role === "rename") {
        const index = parseInt(target.parentElement?.dataset.tabid ?? "0");
        const newLabel = prompt('New Name:', this.editConf.data.iconList[index].label);
        if (newLabel === "" || newLabel === null)
          return;
        this.editConf.data.iconList[index].label = newLabel;
        this.updateTabs();
      }
      else if (target.dataset.role === "delete") {
        if (!confirm("Do you want to delete this icon list?"))
          return;
        const index = parseInt(target.parentElement?.dataset.tabid ?? "0");
        this.editConf.data.iconList.splice(index, 1);
        this.updateTabs();
      }
      else if (target.dataset.tabid !== undefined) {
        const index = parseInt(target.dataset.tabid);
        let stat = this.curActTab == index;
        document.querySelectorAll("#BLICK_iP_tabs>div.cur").forEach(el => el.classList.remove("cur"));
        if (!stat) {
          this.shownIcons = this.editConf.data.iconList[index].arr;
          target.classList.add("cur");
          this.curActTab = index;
        }
        else {
          this.shownIcons = this.allIcons;
          this.curActTab = -1;
        }
        this.searchItems();
      }
      this.editConf.save();
    }
    //
    loadItems() {
      if (this.imgCol === null || this.loading === null)
        return;
      const end = Math.min(this.itemCount + this.itemsPerLoad, this.shownIcons.length);
      for (let i = this.itemCount; i < end; i++) {
        this.imgCol.insertAdjacentHTML("beforeend", `
                <div class="image-container" draggable="true" title="${this.shownIcons[i]}">
                    <img src="https://questden.org/kusaba/icons/thumb/${this.shownIcons[i]}" alt="${this.shownIcons[i]}" />
                </div>`);
      }
      this.itemCount = end;
      this.imgCol.appendChild(this.loading);
      this.loading.style.display = (this.itemCount == this.shownIcons.length) ? "none" : "block";
      //
      document.querySelectorAll('.image-container').forEach(item => {
        item.addEventListener('dragstart', (ev) => {
          this.drag(ev);
        });
      });
    }
    //
    show() {
      this.pickerDiv.style.display = "";
    }
    hide() {
      this.pickerDiv.style.display = "none";
    }
    toggle() {
      if (this.isShown())
        this.show();
      else
        this.hide();
    }
    isShown() {
      return this.pickerDiv.style.display == "none";
    }
  }
  //
  class UndoRedoManager {
    //
    constructor(textarea) {
      this.undoStack = [];
      this.redoStack = [];
      this.textarea = textarea;
      this.applyingState = false;
      this.saveState();
      this.saveStateInterval = 500;
      this.saveStateTimer = 0;
      this.inputListener = this.debSaveState.bind(this);
      this.textarea.addEventListener('input', this.inputListener);
      this.keydownListener = (e) => {
        if (e.ctrlKey && e.key === 'z') {
          e.preventDefault();
          this.undo();
        }
        else if (e.ctrlKey && e.key === 'y') {
          e.preventDefault();
          this.redo();
        }
      };
      document.addEventListener('keydown', this.keydownListener);
    }
    debSaveState() {
      if (this.applyingState)
        return;
      clearTimeout(this.saveStateTimer);
      this.saveStateTimer = setTimeout(() => {
        this.saveState();
      }, this.saveStateInterval);
    }
    //
    saveState() {
      const state = {
        value: this.textarea.value,
        selectionStart: this.textarea.selectionStart,
        selectionEnd: this.textarea.selectionEnd
      };
      this.undoStack.push(state);
      this.redoStack = [];
    }
    //
    undo() {
      if (this.undoStack.length > 1) {
        const currentState = this.undoStack.pop();
        this.redoStack.push(currentState);
        const prevState = this.undoStack[this.undoStack.length - 1];
        this.applyState(prevState);
      }
    }
    //
    redo() {
      if (this.redoStack.length > 0) {
        const nextState = this.redoStack.pop();
        this.undoStack.push(nextState);
        this.applyState(nextState);
      }
    }
    //
    applyState(state) {
      this.applyingState = true;
      this.textarea.value = state.value;
      this.textarea.setSelectionRange(state.selectionStart, state.selectionEnd);
      const event = new Event('input', { bubbles: true });
      this.textarea.dispatchEvent(event);
      this.applyingState = false;
    }
    //
    destroy() {
      this.undoStack = [];
      this.redoStack = [];
      this.textarea.removeEventListener('input', this.inputListener);
      document.removeEventListener('keydown', this.keydownListener);
    }
  }
  //
  class ReplyForm {
    //
    constructor() {
      this.bar = null;
      this.textarea = null;
      this.colPickEl = null;
      this.iconPicker = null;
      this.buttonBar = null;
      this.extendBar = null;
      this.saveTimeStamp = null;
      this.genPrevTimer = 0;
      this.autoGeneratePrev = false;
      this.saveTimer = 0;
      this.undoManager = null;
      //
      this.editConf = new EditorConfig();
      this.editConf.load().then(this.insertStyle);
    }
    ;
    removeBar() {
      this.bar?.remove();
      document.querySelector("#BLICK_previewbut")?.remove();
      document.querySelector("#prevdiv")?.remove();
      this.undoManager?.destroy();
      this.bar = null;
    }
    ;
    insertStyle() {
      const sty = document.createElement("style");
      sty.id = "BLICK_stylebar";
      sty.innerHTML = `
        #BLICK_bigcont{background-color:#6f6f6f;width:100%;padding:3px 0;}
        .BLICK_style{display:inline-block;width:24px;height:24px;overflow:hidden;background-image: url('${imgRes.stylebuts}');background-repeat:no-repeat;}
        .BLICK_style:hover{background-position-y: -24px;}
        .BLICK_style:active{background-position-y: -48px;}
        #BLICK_pallette a {display: inline-block;	height: 20px;width: 20px; margin: 2px;background-color:attr(bgcol);}
        #BLICK_pallette {width: 145px;}
        #BLICK_colorpalette{padding:3px;box-sizing: border-box;display:none;}
        #BLICK_colorpalette.shown{display:flex;gap:10px;}
        #BLICK_cp{display:flex;height:100px;} 
        #BLICK_cp_colorDisplay { height: 40px; user-select: none;cursor:pointer;	}
        #BLICK_cp_bgDisplay { height: 40px; user-select: none;cursor:pointer;	} 
        #BLICK_cp_colTex {height: 20px;box-sizing: border-box;font-family: 'Courier New', Courier, monospace;text-transform: uppercase;border: 1px solid #ccc;border-radius: 4px;background-color: #f9f9f9;color: #333;text-align: center;z-index: 9;font-size: 11px;padding: 2px;width: 60px;letter-spacing: 0.5px;} 
        #BLICK_cp_colPrev { display: flex; flex-direction: column; width:60px;	} 
        #BLICK_cp .slider { writing-mode: vertical-lr; appearance: none; width: 10px; height: 100%; outline: none;	} 
        #BLICK_cp .slider::-webkit-slider-thumb { -webkit-appearance: none; width: 10px; height: 5px; background: #ffffff77; border: 1px solid black; border-radius: 2px; cursor: pointer; opacity: 0.8;	}
        #BLICK_cp .slider:hover::-webkit-slider-thumb { opacity: 1;} 
        #BLICK_cp .slider::-moz-range-thumb { width: 10px; height: 5px; background: #ffffff77; border: 1px solid black; border-radius: 2px; cursor: pointer; opacity: 0.8;	} 
        #BLICK_cp .slider:hover::-moz-range-thumb { opacity: 1;} 
        #BLICK_cp .slider[id="BLICK_cp_hue"] { background: linear-gradient(to bottom, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%));	}
        #BLICK_colChoice a.customCol{border:1px dashed black;}
        #BLICK_colChoice a {display: inline-block;	height: 20px;width: 20px; margin: 2px;background-color:attr(bgcol);}
        #BLICK_colChoice {width: 130px;}
        #BLICK_extendBar{display:flex;}
        #BLICK_saveTimeStamp{position: absolute;bottom: 10px;right: 50px; font-size: 12px;color: #3333; pointer-events: none;}
        #BLICK_autoSaveBut{ padding: 0;float: right;margin: 0 10px;}
        #BLICK_autoSaveBut input, #BLICK_autoSaveBut label{ cursor: pointer;}
      `;
      document.head.appendChild(sty);
    }
    insertBar() {
      if (this.bar !== null)
        return;
      this.textarea = document.querySelector("form[name='postform'] textarea[name='message']");
      if (this.textarea === null) {
        this.bar = null;
        return;
      }
      //
      this.undoManager = new UndoRedoManager(this.textarea); //enough to work. ctrl+z manager
      //
      this.bar = document.createElement("div");
      this.bar.id = "BLICK_bigcont";
      this.textarea.parentElement.insertBefore(this.bar, this.textarea);
      this.textarea.parentElement.style.display = "block";
      //
      this.saveTimeStamp = document.createElement("div");
      this.saveTimeStamp.id = "BLICK_saveTimeStamp";
      this.textarea.parentElement.appendChild(this.saveTimeStamp);
      this.textarea.parentElement.style.position = "relative";
      //
      this.buttonBar = document.createElement("div");
      this.buttonBar.id = 'BLICK_buttonBar';
      this.bar.appendChild(this.buttonBar);
      this.extendBar = document.createElement("div");
      this.extendBar.id = 'BLICK_extendBar';
      this.bar.appendChild(this.extendBar);
      //
      let autosaveDiv = document.createElement("div");
      autosaveDiv.id = "BLICK_autoSaveBut";
      let autoSaveCB = document.createElement("input");
      autoSaveCB.type = "checkbox";
      autoSaveCB.id = "BLICK_autoSaveCB";
      autoSaveCB.checked = this.editConf.data.autoSave;
      autoSaveCB.addEventListener("change", (ev) => {
        let state = ev.target?.checked ?? true;
        this.editConf.set("autoSave", state);
        this.debsaveText();
      });
      autosaveDiv.appendChild(autoSaveCB);
      autosaveDiv.insertAdjacentHTML("beforeend", "<label for='BLICK_autoSaveCB'>autosave</label>");
      this.buttonBar.appendChild(autosaveDiv);
      //
      this.addButton("b", 0);
      this.addButton("u", 1);
      this.addButton("i", 2);
      this.addButton("s", 3);
      this.addButton("aa", 4);
      this.addButton("small", 5);
      this.addButton("code", 6);
      this.addButton("spoiler", 7);
      this.addButton("color", 10, () => {
        document.getElementById("BLICK_colorpalette")?.classList.toggle("shown");
        if (this.iconPicker)
          this.iconPicker.hide();
      });
      this.addButton("icon", 9, () => {
        if (this.extendBar === null)
          return;
        if (this.iconPicker === null) {
          this.iconPicker = new ImageManager(this.extendBar, this.editConf, (icon) => {
            if (this.textarea === null)
              return;
            let pos = this.textarea.selectionStart;
            this.textarea.value = this.textarea.value.substring(0, pos) + icon + this.textarea.value.substring(this.textarea.selectionEnd);
            this.textarea.setSelectionRange(pos + icon.length, pos + icon.length);
            this.textarea.focus();
            const event = new Event('input', { bubbles: true });
            this.textarea.dispatchEvent(event);
          });
        }
        else {
          this.iconPicker.toggle();
        }
        document.getElementById("BLICK_colorpalette")?.classList.remove("shown");
      });
      this.insertColorPallette();
      this.addPreviewBut();
      if (this.editConf.data.saveText !== "") {
        this.textarea.value = this.editConf.data.saveText;
      }
    }
    addPreviewBut() {
      const postForm = document.forms.namedItem("postform");
      if (!postForm)
        return;
      //
      let but = document.createElement("input");
      but.id = "BLICK_previewbut";
      but.type = "button";
      but.value = "Preview";
      //
      let subBut = document.querySelector("form[name='postform'] input[type='submit']");
      subBut?.parentElement?.insertBefore(but, subBut);
      subBut?.addEventListener("click", () => {
        this.editConf.set("saveText", "");
      });
      //
      let cbPrev = document.createElement("input");
      cbPrev.id = 'BLICK_cb_preview';
      cbPrev.type = "checkbox";
      cbPrev.style.marginRight = "-3px";
      cbPrev.title = "Automatically update the preview while typing.";
      but.parentElement?.insertBefore(cbPrev, but);
      //
      cbPrev.addEventListener("change", (ev) => {
        this.autoGeneratePrev = ev.target?.checked ?? false;
        this.generatePreview(ev);
      });
      but.addEventListener("click", this.generatePreview);
      document.querySelector("form[name='postform'] textarea[name='message']")?.addEventListener("input", () => {
        this.debGeneratePrev();
        this.debsaveText();
      });
      //
    }
    insertColorPallette() {
      let farbar = ["ff0000", "00ff00", "0000ff", "ffff00", "00ffff", "ff00ff"];
      let cp = document.createElement("div");
      cp.id = "BLICK_colorpalette";
      cp.className = "reply";
      //
      const texinh = { normal: "", brighter: "", darker: "", greys: "" };
      const greystep = 255.0 / (farbar.length - 1);
      let gry;
      for (let i = 0; i < farbar.length; i++) {
        texinh.normal += `<a href='#' bgcol='#${farbar[i]}' style='background-color:#${farbar[i]}');'></a>`;
        texinh.brighter += `<a href='#' bgcol='#${farbar[i].replace(/0/g, `8`)}' style='background-color:#${farbar[i].replace(/0/g, `8`)}');'></a>`;
        texinh.darker += `<a href='#' bgcol='#${farbar[i].replace(/f/g, `8`)}' style='background-color:#${farbar[i].replace(/f/g, `8`)}');'></a>`;
        gry = Math.floor(i * greystep).toString(16).padStart(2, '0');
        texinh.greys += `<a href='#' bgcol='#${gry + gry + gry}' style='background-color:#${gry + gry + gry}');'></a>`;
      }
      cp.innerHTML = `<div id='BLICK_pallette'>${Object.values(texinh).join("\n")}</div>`;
      //
      cp.addEventListener("click", (ev) => {
        if (!(ev.target instanceof HTMLAnchorElement))
          return;
        ev.preventDefault();
        ev.stopPropagation();
        this.styleSelection("color=" + ev.target.getAttribute("bgcol"));
      }, true);
      //
      this.extendBar?.appendChild(cp);
      this.insertColorPicker();
      this.insertColorChoice();
    }
    insertColorPicker() {
      let pick = document.createElement("div");
      pick.id = "BLICK_cp";
      pick.innerHTML = `
          <div id="BLICK_cp_colPrev">
            <div id="BLICK_cp_colorDisplay">Click to insert</div>
            <div id="BLICK_cp_bgDisplay"></div>
            <input type="text" id="BLICK_cp_colTex" />
          </div>
          <input type="range" id="BLICK_cp_hue" class="slider" min="0" max="360" value="0" step="1" orient="vertical">
          <input type="range" id="BLICK_cp_saturation" class="slider" min="0" max="100" value="0" step="10"
            orient="vertical">
          <input type="range" id="BLICK_cp_lightness" class="slider" min="0" max="100" value="50" step="5" orient="vertical">`;
      //
      document.getElementById("BLICK_colorpalette")?.appendChild(pick);
      //
      this.colPickEl = {
        hue: document.getElementById('BLICK_cp_hue'),
        sat: document.getElementById('BLICK_cp_saturation'),
        lum: document.getElementById('BLICK_cp_lightness'),
        bgCol: document.getElementById('BLICK_cp_bgDisplay'),
        prevCol: document.getElementById('BLICK_cp_colorDisplay'),
        prevText: document.getElementById('BLICK_cp_colTex')
      };
      //
      this.colPickEl.hue.addEventListener("input", () => { this.updatePickerColer(true); });
      this.colPickEl.sat.addEventListener("input", () => { this.updatePickerColer(true); });
      this.colPickEl.lum.addEventListener("input", () => { this.updatePickerColer(true); });
      this.colPickEl.prevText.addEventListener('input', () => {
        if (this.colPickEl == null)
          return;
        this.colPickEl.prevCol.style.color = this.colPickEl.prevText.value;
        this.colPickEl.bgCol.style.backgroundColor = this.colPickEl.prevCol.style.color;
        let rgb = this.colPickEl.prevCol.style.color.match(/(\d+)/g) ?? ["0", "0", "0"];
        let hsl = rgb2hsl(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]));
        this.colPickEl.hue.value = String(hsl[0]);
        this.colPickEl.sat.value = String(100 - hsl[1]);
        this.colPickEl.lum.value = String(100 - hsl[2]);
        this.updatePickerColer(false);
      });
      let insertColFun = () => {
        if (this.colPickEl === null)
          return;
        this.styleSelection("color=" + this.colPickEl.prevText.value);
      };
      this.colPickEl.prevCol.addEventListener("click", insertColFun);
      this.colPickEl.bgCol.addEventListener("click", insertColFun);
      //
      this.updatePickerColer(true);
    }
    updatePickerColer(textupdate = false) {
      if (this.colPickEl == null)
        return;
      const hue = this.colPickEl.hue.value;
      const saturation = 100 - parseInt(this.colPickEl.sat.value);
      const lightness = 100 - parseInt(this.colPickEl.lum.value);
      //
      this.colPickEl.prevCol.style.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      this.colPickEl.bgCol.style.backgroundColor = this.colPickEl.prevCol.style.color;
      if (textupdate) {
        this.colPickEl.prevText.value = "#" + (this.colPickEl.prevCol.style.color.match(/(\d+)/g) ?? ["0", "0", "0"]).map(el => parseInt(el).toString(16).padStart(2, "0")).join("");
      }
      this.colPickEl.sat.style.background = `linear-gradient(to top,hsl(${hue}, 0%, 50%),hsl(${hue}, 100%, 50%))`;
      this.colPickEl.lum.style.background = `linear-gradient(to top,hsl(${hue}, ${saturation}%, 0%),hsl(${hue}, ${saturation}%, 50%),hsl(${hue}, ${saturation}%, 100%))`;
    }
    insertColorChoice() {
      let farbar = this.editConf.data.colorList;
      let cp = document.getElementById("BLICK_colorpalette");
      if (cp === null)
        return;
      // 
      let colCh = document.createElement("div");
      colCh.id = "BLICK_colChoice";
      let texinh = "<div>Rightclick to set</div>";
      for (let i = 0; i < farbar.length; i++) {
        texinh += `<a href='#' class='customCol' customId='${i}' bgcol='${farbar[i]}' style='background-color:${farbar[i]}');'></a>`;
      }
      colCh.innerHTML = texinh;
      cp.appendChild(colCh);
      //
      cp.addEventListener("contextmenu", (ev) => {
        if (!(ev.target instanceof HTMLAnchorElement) || ev.target.className !== "customCol" || this.colPickEl === null)
          return;
        ev.preventDefault();
        ev.stopPropagation();
        let id = parseInt(ev.target.getAttribute("customId") ?? "0");
        this.editConf.data.colorList[id] = this.colPickEl.prevText.value;
        ev.target.setAttribute("bgcol", this.colPickEl.prevText.value);
        ev.target.style.backgroundColor = this.colPickEl.prevText.value;
        this.editConf.save();
      }, true);
    }
    addButton(tag, bgpos, callback = null) {
      const butB = document.createElement("div");
      butB.className = "BLICK_style";
      butB.title = `[${tag}]`;
      butB.addEventListener("click", () => {
        if (callback === null)
          this.styleSelection(tag);
        else
          callback();
      });
      butB.style.backgroundPositionX = -24 * bgpos + "px";
      this.buttonBar?.appendChild(butB);
    }
    //
    styleSelection(tag) {
      if (this.textarea === null)
        return;
      let texStart = this.textarea.selectionStart ?? 0;
      let texEnd = this.textarea.selectionEnd ?? 0;
      let pureTag = tag.indexOf("=") === -1 ? tag : tag.substring(0, tag.indexOf("=")); //strip parameters from closing tag
      //
      if (texStart >= tag.length + 2 && this.textarea.value.substring(texStart - tag.length - 2, texStart) == "[" + tag + "]") {
        //remove tag if selection preceeded by tag
        this.textarea.value = this.textarea.value.substring(0, texStart - tag.length - 2) +
          this.textarea.value.substring(texStart, texEnd) +
          this.textarea.value.substring(texEnd + pureTag.length + 3);
        this.textarea.selectionStart = texStart - tag.length - 2; //selection shifted by start tag length
        this.textarea.selectionEnd = texEnd - tag.length - 2;
      }
      else if (pureTag == "color" && this.textarea.value.substring(texStart - "color=#ffffff]".length, texStart - "=#ffffff]".length) == "color") {
        //color change on color tag if new color is different
        this.textarea.value = this.textarea.value.substring(0, texStart - tag.length - 2) + "[" + tag + "]" +
          this.textarea.value.substring(texStart, texEnd) + "[/" + pureTag + "]" +
          this.textarea.value.substring(texEnd + pureTag.length + 3);
        this.textarea.selectionStart = texStart; //original selection
        this.textarea.selectionEnd = texEnd;
      }
      else {
        //add tag
        this.textarea.value = this.textarea.value.substring(0, texStart) +
          "[" + tag + "]" + this.textarea.value.substring(texStart, texEnd) + "[/" + pureTag + "]" +
          this.textarea.value.substring(texEnd);
        this.textarea.selectionStart = texStart + tag.length + 2; //selection shifted by start tag length
        this.textarea.selectionEnd = texEnd + tag.length + 2;
      }
      this.textarea.focus();
      //
      const event = new Event('input', { bubbles: true });
      this.textarea.dispatchEvent(event);
    }
    debsaveText() {
      if (!this.editConf.data.autoSave) {
        if (this.saveTimeStamp !== null)
          this.saveTimeStamp.innerText = "";
        this.editConf.set("saveText", "");
        return;
      }
      clearTimeout(this.saveTimer);
      this.saveTimer = setTimeout(() => {
        this.saveText(null);
      }, 500);
    }
    saveText(ev) {
      ev?.preventDefault();
      this.editConf.set("saveText", this.textarea?.value ?? "");
      //
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Monate von 0 bis 11
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      //
      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      if (this.saveTimeStamp !== null)
        this.saveTimeStamp.innerText = `Last saved: ${formattedDate}`;
    }
    debGeneratePrev() {
      if (!this.autoGeneratePrev)
        return;
      clearTimeout(this.genPrevTimer);
      this.genPrevTimer = setTimeout(() => {
        this.generatePreview(null);
      }, 500);
    }
    generatePreview(ev) {
      ev?.preventDefault();
      //
      const postForm = document.forms.namedItem("postform");
      if (postForm === null)
        return;
      let prevDiv = document.getElementById('prevdiv');
      //
      if (document.getElementById('prevdiv') === null) {
        prevDiv = document.createElement('div');
        prevDiv.id = 'prevdiv';
        prevDiv.className = 'reply';
        prevDiv.style.textAlign = 'left';
        prevDiv.style.backgroundColor = '';
        postForm.appendChild(prevDiv);
      }
      //
      const boardValue = postForm.elements.namedItem("board")?.value ?? "";
      const replyThreadValue = postForm.elements.namedItem("replythread")?.value ?? "";
      const messageValue = postForm.elements.namedItem("message")?.value ?? "";
      //
      postpreview('prevdiv', boardValue, replyThreadValue, messageValue); //defined in website.
    }
  }
  ;
  ;
  class WatchData extends Storage {
    constructor() {
      let def = {
        numLinkMode: 1,
        threads: new Map(),
        default: {
          label: "Default",
          author: "none",
          section: "general",
          highImgOnly: true,
          highIDs: [],
          highNames: [],
          ignoreIDs: [],
          ignoreNames: [],
          lastReadId: "",
          currentReadId: "",
          newEntrCnt: 0,
          totalEntrCnt: 0,
        }
      };
      super("watchbar", def);
    }
  }
  ;
  //
  class WatchBar {
    constructor(sets) {
      this.curThread = null;
      this.saveTimer = 0;
      this.saveInterval = 500;
      this.thList = ["draw", "meep", "quest", "questdis", "tg", "questarch"];
      this.sets = sets;
      this.wdata = new WatchData();
      this.wdata.load().then(() => {
        this.insertHTML();
        this.insertStyle();
        this.insertObserver();
        this.insertEntries();
        this.insertSettingHTML();
      });
    }
    destroy() {
      document.getElementById("BLICK_watch_bar")?.remove();
      document.getElementById("BLICK_stylewatchbar")?.remove();
      document.getElementById("BLICK_wbar_form-container")?.remove();
    }
    insertHTML() {
      const wbar = document.createElement("div"); //hover notch&container with overflow-scroll
      wbar.id = "BLICK_watch_bar";
      //
      this.cont = document.createElement("div"); // inner container containing items
      this.cont.id = "BLICK_watch_wrap";
      wbar.appendChild(this.cont);
      //
      const updbut = document.createElement("img");
      updbut.id = "BLICK_watch_update";
      updbut.title = "Check for updates";
      updbut.className = "BLICK_wbar_headButs";
      updbut.src = imgRes.refreshimg;
      wbar.appendChild(updbut);
      updbut.addEventListener("click", () => { this.wdata.load().then(() => { this.updateEntries(); }); });
      //
      const defaultSetBut = document.createElement("button");
      defaultSetBut.id = "BLICK_watch_defaultSet";
      defaultSetBut.title = "Set default settings.";
      defaultSetBut.className = "BLICK_wbar_headButs";
      defaultSetBut.innerText = "🛠️";
      wbar.appendChild(defaultSetBut);
      defaultSetBut.addEventListener("click", () => { this.showSettingDiag("", true); });
      //
      const importBut = document.createElement("button");
      importBut.id = "BLICK_watch_import";
      importBut.title = "Import from questden.org";
      importBut.className = "BLICK_wbar_headButs";
      importBut.innerText = "📥";
      wbar.appendChild(importBut);
      importBut.addEventListener("click", () => { this.fetchFromSite(); });
      //
      const exportBut = document.createElement("button");
      exportBut.id = "BLICK_watch_export";
      exportBut.title = "Export to questden.org";
      exportBut.className = "BLICK_wbar_headButs";
      exportBut.innerText = "📤";
      wbar.appendChild(exportBut);
      exportBut.addEventListener("click", () => { this.copyToSite(); });
      //
      wbar.addEventListener("click", (ev) => {
        if (!(ev.target instanceof HTMLElement))
          return;
        if (ev.target.dataset.role == "remove") {
          let row = ev.target.closest("div.BLICK_wrow");
          if (row === null || row.dataset.id === undefined)
            return;
          if (!confirm(`Remove entry for ${this.wdata.data.threads.get(row.dataset.id)?.label}?`))
            return;
          this.wdata.data.threads.delete(row.dataset.id ?? "0");
          this.wdata.save();
          row.remove();
          ev.preventDefault();
          ev.stopPropagation();
        }
        else if (ev.target.dataset.role == "options") {
          let row = ev.target.closest("div.BLICK_wrow");
          if (row === null || row.dataset.id === undefined)
            return;
          this.showSettingDiag(row.dataset.id);
          ev.preventDefault();
          ev.stopPropagation();
        }
      }, true);
      document.body.appendChild(wbar);
    }
    copyToSite() {
      const fetchPromises = [];
      this.wdata.data.threads.forEach((thread, id) => {
        fetchPromises.push(fetch(`https://questden.org/kusaba/threadwatch.php?do=addthread&board=${thread.section}&threadid=${id}`).then((ret) => {
          if (ret.ok)
            console.log(`added ${thread?.label}, ${thread?.section}/${id} to your watchlist.`);
        }));
      });
      Promise.all(fetchPromises).then(() => {
        getwatchedthreads('0', "quest");
        alert(`${this.wdata.data.threads.size} threads exported.`);
      });
    }
    insertSettingHTML() {
      this.setDiag = document.createElement("div");
      this.setDiag.id = "BLICK_wbar_set_overlay";
      this.setDiag.style.display = "none";
      this.setDiag.innerHTML = `
      <div id="BLICK_wbar_form-container">
        <h2>Settings</h2>
        <p id="BLICK_wbar_formSubtitle">Options for 'Divequest ch4'</p>
        <div id="BLICK_wbar_form-grid">
        <div class="BLICK_wbar_setSect" id='BLICK_wbar_genSec'>
          <span class='BLICK_wbar_secTitl'>General Settings</span>
            <label for="BLICK_wbar_autoUpdate">Automatically update:</label>
            <div class="checkbox-container">
              <input type="checkbox" id="BLICK_wbar_autoUpdate">
              <label for="BLICK_wbar_autoUpdate">On pageload</label>
            </div>
            <label for="BLICK_wbar_linkTo">Number links to:</label>
            <select id="BLICK_wbar_linkTo">
              <option value="new">Last known post</option>
              <option value="current">Last reading position</option>
              <option value="none">No specific post</option>
            </select>
          </div>
          <div class="BLICK_wbar_setSect" id='BLICK_wbar_threadSec'>
            <span class='BLICK_wbar_secTitl'>Default Thread Settings</span>
            <label for="BLICK_wbar_highlightNew">Count New:</label>
            <div class="checkbox-container">
              <input type="checkbox" id="BLICK_wbar_highlightNew">
              <label for="BLICK_wbar_highlightNew">Only Images</label>
            </div>
            <label for="BLICK_wbar_highlightNames">Only Names</label>
            <input type="text" id="BLICK_wbar_highlightNames" title="Names, comma separated">
            <label for="BLICK_wbar_highlightIDs">Only IDs</label>
            <input type="text" id="BLICK_wbar_highlightIDs" title="IDs, comma separated">
            <label for="BLICK_wbar_ignoreNames">Ignore Names</label>
            <input type="text" id="BLICK_wbar_ignoreNames" title="Names, comma separated">
            <label for="BLICK_wbar_ignoreIDs">Ignore IDs</label>
            <input type="text" id="BLICK_wbar_ignoreIDs" title="IDs, comma separated">
          </div>
        </div>
        <div id="BLICK_wbar_button-row">
          <button data-role="save">Save</button>
          <button data-role="cancel">Cancel</button>
          <button data-role="default">Default</button>
          <button data-role="overwrite">Apply to all</button>
        </div>
      </div>`;
      document.body.appendChild(this.setDiag);
      this.setDiag.addEventListener("click", function (ev) {
        if (ev.target == this)
          this.style.display = "none"; //this in function() refers to "this.setDiag"
      });
      document.getElementById("BLICK_wbar_button-row")?.addEventListener("click", (ev) => {
        let target = ev.target;
        if (target.dataset.role == null || this.setDiag.dataset.threadid === undefined)
          return;
        let id = this.setDiag.dataset.threadid;
        switch (target.dataset.role) {
          case "save":
            this.saveSettingDiag(id);
          default:
          case "cancel":
            this.setDiag.style.display = "none";
            return;
          case "default":
            this.showSettingDiag(id, true);
            break;
          case "overwrite":
            if (confirm("Set settings of other entries to this?")) {
              this.wdata.data.threads.forEach((thread, tid) => { this.saveSettingDiag(tid); });
              if (id === "")
                this.saveSettingDiag("");
              this.setDiag.style.display = "none";
            }
            break;
        }
        ev.preventDefault();
        ev.stopPropagation();
      }, true);
    }
    insertStyle() {
      const sty = document.createElement("style");
      sty.id = "BLICK_stylewatchbar";
      sty.innerHTML = `
        #BLICK_watch_bar{width:20px;overflow-y:auto;overflow-x:hidden;position:fixed;transition:width 0.5s,opacity 0.5s, max-height 0.5s, border-radius 1s; right:0px;max-height:30px;height:30px;background-color:#fad;z-index:8;opacity:0.5;top:85px;border:2px ridge #ddf;border-top-left-radius:25px;border-bottom-left-radius:25px;font-size: 16px;color: #d00;}
        #BLICK_watch_bar:hover{overflow-y:auto;overflow-x:hidden;opacity:1;width:400px;height:auto;border-bottom-left-radius:5px;border-top-left-radius:5px;max-height:calc(95vh - 85px)}
        #BLICK_watch_bar>*{visibility:hidden;cursor:default;}
        #BLICK_watch_bar:hover>*{visibility:visible;}
        #BLICK_watch_bar .BLICK_wbar_headButs{width:16px;height:16px;z-index:99;position:absolute;top:0;cursor:pointer;border:none;background:none;}
        #BLICK_watch_bar #BLICK_watch_update{right:0;}
        #BLICK_watch_bar #BLICK_watch_defaultSet{right:25px;}
        #BLICK_watch_bar #BLICK_watch_import{right:50px;}
        #BLICK_watch_bar #BLICK_watch_export{right:75px;}
        #BLICK_watch_bar .BLICK_wbar_headButs:hover{filter:brightness(120%);}
        #BLICK_watch_bar button:hover{filter:brightness(120%);}
        #BLICK_watch_wrap{display: grid; grid-template-columns: auto 100px 45px 50px;}
        #BLICK_watch_bar .BLICK_wrow {display: contents; padding: 0px 5px;}
        #BLICK_watch_bar .BLICK_wrow:nth-child(2n)>div.BLICK_wcell{background-color: #F0D0C6;}
        #BLICK_watch_bar .BLICK_wrow:nth-child(2n+1)>div.BLICK_wcell{background-color: #FBC1AF;}
        #BLICK_watch_bar .BLICK_wrow>div.BLICK_wcell{display: inline-block; vertical-align: top; word-wrap: break-word;line-height:23px;padding:0 5px;}
        #BLICK_watch_bar .BLICK_whead{background-color: #EEAA88;grid-column: 1 / -1;text-align: center;font-weight: bold;padding: 2px;color: black;}
        #BLICK_watch_bar .BLICK_wactions button{width:16px;height:16px;font-size:14px;border:none;background:none;cursor:pointer;display:inline-block;}
        #BLICK_watch_bar a:hover{cursor:pointer;}
        #BLICK_watch_bar div.BLICK_wauthor{color: green;font-weight: bold;}
        #BLICK_watch_bar div.BLICK_wnew a{color: blue;}
        #BLICK_watch_bar div.BLICK_title a{color: red;}
        #BLICK_wbar_set_overlay {position: fixed;top: 0;left: 0;width: 100vw;height: 100vh;background-color: rgba(0, 0, 0, 0.5);display: flex;justify-content: center;align-items: center;z-index: 1000;}
        #BLICK_wbar_form-container{background-color: #fffff0;padding: 20px;border-radius: 8px;box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);max-width: 400px;width: 90%;font-family: Arial, sans-serif;border: 1px solid #b0a394;}
        #BLICK_wbar_form-container h2 {margin-top: 0;font-size: 1.4em;color: #333;text-align: center;}
        #BLICK_wbar_form-container p {font-size: 0.9em;color: #666;text-align: center;margin-top: 0;margin-bottom: 15px;}
        #BLICK_wbar_form-grid {margin-bottom: 15px;}
        #BLICK_wbar_form-grid label {font-size: 0.9em;color: #555;display: flex;align-items: center;justify-content: flex-end;}
        #BLICK_wbar_form-grid input[type="text"] {padding: 8px;border: 1px solid #ccc;border-radius: 4px;font-size: 0.9em;}
        #BLICK_wbar_form-grid input[type="checkbox"] {cursor:pointer}
        #BLICK_wbar_form-grid .checkbox-container {display: flex;align-items: center;justify-content: center;}
        #BLICK_wbar_form-grid .checkbox-container label {margin-left: 8px;cursor:pointer}
        #BLICK_wbar_button-row {display: flex;gap: 10px;justify-content: space-between;}
        #BLICK_wbar_button-row button {flex: 1;padding: 8px;border: none;border-radius: 4px;font-size: 0.9em;cursor: pointer;transition: background-color 0.2s;color: white;}
        #BLICK_wbar_button-row button:hover {opacity: 0.9;}
        #BLICK_wbar_button-row button[data-role="save"] { background-color: #3ba44b;}
        #BLICK_wbar_button-row button[data-role="cancel"] { background-color: #bb5546;}
        #BLICK_wbar_button-row button[data-role="default"] { background-color: #304f79;}
        #BLICK_wbar_button-row button[data-role="overwrite"] { background-color: #dd9243;}
        .BLICK_wbutton_iswatched{transition:filter 0.5s;filter: hue-rotate(150deg) brightness(150%);}
        .BLICK_wbar_setSect{position: relative;margin-bottom: 15px; display: grid;grid-template-columns: 150px auto;grid-column: span 2;gap: 15px;border: 1px solid #aaa;border-radius: 5px;padding: 15px;padding-top:25px;}
        #BLICK_wbar_linkTo {padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;}
        .BLICK_wbar_secTitl{position: absolute;left: 5px;right: 0;font-size: smaller;color: #aaa;}
      `;
      document.head.appendChild(sty);
    }
    showSettingDiag(id, def = false) {
      if (this.setDiag === null || document.getElementById("BLICK_wbar_formSubtitle") == null ||
        (id !== "" && !this.wdata.data.threads.has(id)))
        return;
      const thread = def ? this.wdata.data.default : this.wdata.data.threads.get(id);
      //
      if (id === "") {
        document.getElementById("BLICK_wbar_formSubtitle").style.display = "none";
        document.getElementById("BLICK_wbar_genSec").style.display = "";
        document.querySelector("#BLICK_wbar_threadSec .BLICK_wbar_secTitl").innerText = "Default Thread settings";
        document.getElementById("BLICK_wbar_autoUpdate").checked = this.sets.data.autoUpdWbar;
        document.getElementById("BLICK_wbar_linkTo").selectedIndex = this.wdata.data.numLinkMode;
      }
      else {
        document.getElementById("BLICK_wbar_formSubtitle").style.display = "";
        document.getElementById("BLICK_wbar_formSubtitle").innerText = this.wdata.data.threads.get(id)?.label ?? "";
        document.getElementById("BLICK_wbar_genSec").style.display = "none";
        document.querySelector("#BLICK_wbar_threadSec .BLICK_wbar_secTitl").innerText = "Thread settings";
      }
      //
      document.getElementById("BLICK_wbar_highlightNew").checked = thread?.highImgOnly ?? true;
      document.getElementById("BLICK_wbar_highlightNames").value = thread?.highNames.join(",") ?? "";
      document.getElementById("BLICK_wbar_highlightIDs").value = thread?.highIDs.join(",") ?? "";
      document.getElementById("BLICK_wbar_ignoreNames").innerText = thread?.ignoreNames.join(",") ?? "";
      document.getElementById("BLICK_wbar_ignoreIDs").innerText = thread?.ignoreIDs.join(",") ?? "";
      this.setDiag.style.display = "flex";
      this.setDiag.dataset.threadid = id;
    }
    saveSettingDiag(id, close = false) {
      if (this.setDiag === null || document.getElementById("BLICK_wbar_formSubtitle") == null ||
        (id !== "" && !this.wdata.data.threads.has(id)))
        return;
      const thread = (id !== "") ? this.wdata.data.threads.get(id) : this.wdata.data.default;
      //
      let sanit = (str) => { return str.split(",").map(name => name.trim()).filter(name => name !== ""); };
      thread.highImgOnly = document.getElementById("BLICK_wbar_highlightNew").checked ?? true;
      thread.highNames = sanit(document.getElementById("BLICK_wbar_highlightNames").value);
      thread.highIDs = sanit(document.getElementById("BLICK_wbar_highlightIDs").value);
      thread.ignoreNames = sanit(document.getElementById("BLICK_wbar_ignoreNames").value);
      thread.ignoreIDs = sanit(document.getElementById("BLICK_wbar_ignoreIDs").value);
      if (id === "") {
        this.sets.set("autoUpdWbar", document.getElementById("BLICK_wbar_autoUpdate").checked ?? true);
        this.wdata.set("numLinkMode", document.getElementById("BLICK_wbar_linkTo").selectedIndex ?? 0);
      }
      //
      this.debSave();
      if (close)
        this.setDiag.style.display = "none";
    }
    debSave() {
      clearTimeout(this.saveTimer);
      this.saveTimer = setTimeout(() => {
        this.wdata.save();
        this.sets.save();
      }, this.saveInterval);
    }
    scrollObserver(entries, observer) {
      let topElement = document.elementFromPoint(300, 0); //get top element at 300px to left
      if (!topElement || topElement.tagName === "HTML")
        topElement = document.elementFromPoint(300, 20); //if gap, check 20px below
      topElement = topElement?.closest('td.reply') ?? null;
      if (topElement !== null) {
        let postId = topElement.id.match(/\d+/); //id of element at top of viewport
        if (this.curThread != null && postId != null) { //if watched
          this.curThread.currentReadId = postId[0]; //
          this.debSave();
        }
      }
    }
    addThread(id, board) {
      if (this.wdata.data.threads.has(id))
        return;
      const nthread = { ...this.wdata.data.default };
      nthread.section = board;
      this.wdata.data.threads.set(id, nthread);
      this.insertEntries();
      this.updateEntries();
    }
    insertObserver() {
      if (this.sets.data.autoUpdWbar)
        this.updateEntries(); //autoupdate on pageload
      document.querySelectorAll("img.watchthread").forEach((el) => {
        const clickstr = el.parentElement?.getAttribute("onclick");
        const threadData = clickstr?.match(/addtowatchedthreads\('(.+?)','(.+?)'\)/) ?? null;
        if (threadData === null || threadData.length < 3)
          return;
        el.dataset.targetid = threadData[1];
        el.dataset.targetboard = threadData[2];
        if (this.wdata.data.threads.has(threadData[1]))
          el.classList.add("BLICK_wbutton_iswatched");
        //
        el.addEventListener("click", (ev) => {
          let target = ev.target;
          if (target.dataset.targetid === undefined || target.dataset.targetboard === undefined)
            return;
          this.addThread(target.dataset.targetid, target.dataset.targetboard);
          target.classList.add("BLICK_wbutton_iswatched");
        });
      });
      //
      const locMatch = location.href.match(/https:\/\/questden.org\/kusaba\/(\w+)\/res\/(\d+)(\+\d+)?.html/i);
      if (locMatch === null)
        return;
      let id = locMatch[2];
      if (!this.wdata.data.threads.has(id))
        return; //log data only for watched websites.
      this.curThread = this.wdata.data.threads.get(id) ?? null;
      //scroll to last read post
      let currentReadPost = document.getElementById(`reply${this.curThread?.currentReadId}`);
      if (currentReadPost)
        currentReadPost.scrollIntoView(); //executed before Quest Reader, so should not collide.
      //
      const replyElements = document.querySelectorAll('td.reply');
      const lastmatch = replyElements[replyElements.length - 1].id.match(/\d+/);
      if (lastmatch !== null && this.curThread !== null)
        this.curThread.lastReadId = lastmatch[0];
      this.wdata.save();
      //
      const observer = new IntersectionObserver((a, b) => { this.scrollObserver(a, b); }, {
        root: null, //  Viewport
        rootMargin: '0px',
        threshold: 0 // Pixel
      });
      replyElements.forEach(el => observer.observe(el));
    }
    fetchFromSite() {
      const fetchPromises = this.thList.map(el => {
        return fetch(`https://questden.org/kusaba/threadwatch.php?board=${el}`)
          .then(response => response.text())
          .then(htmlText => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            const entries = doc.querySelectorAll('body span.filetitle');
            entries.forEach(entry => {
              const id = entry.previousElementSibling?.textContent?.trim() ?? null;
              if (id === null)
                return;
              const entr = { ...this.wdata.data.default };
              entr.section = el;
              entr.label = entry.textContent?.trim() ?? "";
              entr.author = entry.nextElementSibling?.textContent?.trim() ?? "";
              const replyEl = entry.nextElementSibling?.nextElementSibling;
              entr.newEntrCnt = parseInt(replyEl?.textContent?.trim() ?? "0");
              //link to newest element.
              //however, lastread should be the element before that
              //also, currentread should be the one to jump to when visiting.
              // if(replyEl?.tagName==="a"){
              // 	const mat=replyEl.getAttribute("href")?.match(/\d+$/)??null;
              // if(mat!==null)entr.lastReadId=parseInt(mat[0]);
              // }
              if (!this.wdata.data.threads.has(id)) {
                this.wdata.data.threads.set(id, entr);
              }
            });
          });
      });
      Promise.all(fetchPromises)
        .then(() => {
          // this.wdata.data.threads.sort((a, b) => a.section.localeCompare(b.section));
          this.wdata.save();
          this.insertEntries();
        })
        .catch(error => {
          console.error("Fehler beim Laden der Daten:", error);
        });
    }
    generateLink(thread, id, curReadInd) {
      let add = "";
      let jump = "";
      let targetInd = this.wdata.data.numLinkMode == 1 ? thread.newEntrCnt : (thread.totalEntrCnt - curReadInd);
      //target last known or last read depending on mode
      if (targetInd < 50 && thread.totalEntrCnt > 50)
        add = "+50";
      else if (targetInd < 100 && thread.totalEntrCnt > 100)
        add = "+100";
      //+50/+100 if possible and target in page.
      if (curReadInd == -1 && this.wdata.data.numLinkMode == 1)
        add = "";
      //when inserting without update, knowing last reading position is within +50/+500 is not possible.
      if (this.wdata.data.numLinkMode == 0 && thread.lastReadId !== "")
        jump = "#" + thread.lastReadId;
      if (this.wdata.data.numLinkMode == 1 && thread.currentReadId !== "")
        jump = "#" + thread.currentReadId;
      return `https://questden.org/kusaba/${thread.section}/res/${id}${add}.html${jump}`;
    }
    updateEntries() {
      let fetchPromise = [];
      document.getElementById("BLICK_watch_update")?.style.setProperty("filter", "hue-rotate(150deg)");
      this.wdata.data.threads.forEach((thread, id) => {
        fetchPromise.push(fetch(`https://questden.org/kusaba/quest/res/${id}.html`)
          .then(response => response.text())
          .then(htmlText => {
            //performance improve idea: count instances of reply update in text for total count. Then cut away text in front of lastReadId before parsing.
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            //
            //parse website
            let lastReadElement = null;
            let newCount = 0;
            let curReadInd = -1; //index of current read position
            const replyElements = doc.querySelectorAll(`td.reply`);
            replyElements.forEach((td, ind) => {
              if (thread.currentReadId == td.id)
                curReadInd = ind;
              if (lastReadElement === null && (td.id.endsWith(thread.lastReadId) || thread.lastReadId == ""))
                lastReadElement = td; //filter for only new elements
              if (lastReadElement !== null) { //ignore old
                let postauthName = td.querySelector('span.postername')?.textContent?.toLowerCase() ?? "";
                let postauthID = td.querySelector('span.uid')?.textContent?.match(/\d+/) ?? ["0"];
                if ((!thread.highImgOnly || td.querySelector('img') !== null) && //filter images
                  (thread.highNames.length == 0 || thread.highNames.includes(postauthName)) && //filter poster name
                  (thread.highIDs.length == 0 || thread.highIDs.includes(postauthID[0])) && //filter poster ID
                  (thread.ignoreIDs.length == 0 || !thread.ignoreIDs.includes(postauthID[0])) && //filter ignore ID
                  (thread.ignoreNames.length == 0 || !thread.ignoreNames.includes(postauthName)) //filter ignore name
                )
                  ++newCount;
              }
            });
            //
            //update threads
            thread.newEntrCnt = newCount;
            thread.totalEntrCnt = replyElements.length;
            thread.label = doc.querySelector("div.postwidth span.filetitle")?.innerText.trim() ?? thread.label;
            thread.author = doc.querySelector("div.postwidth span.postername")?.innerText.trim() ?? thread.author;
            this.wdata.save();
            //
            //update list
            let entrNewCnt = document.querySelector(`div.BLICK_wrow[data-id='${id}'] div.BLICK_wnew a`);
            if (entrNewCnt !== null) {
              entrNewCnt.innerHTML = String(newCount);
              entrNewCnt.href = this.generateLink(thread, id, curReadInd);
            }
            let entrLabel = document.querySelector(`div.BLICK_wrow[data-id='${id}'] div.BLICK_wtitle a`);
            if (entrLabel !== null)
              entrLabel.innerText = thread.label;
            let entrAuthor = document.querySelector(`div.BLICK_wrow[data-id='${id}'] div.BLICK_wauthor`);
            if (entrAuthor !== null)
              entrAuthor.innerText = thread.author;
          }));
      });
      Promise.all(fetchPromise).then(() => {
        document.getElementById("BLICK_watch_update")?.style.removeProperty("filter");
      });
    }
    insertEntries() {
      if (this.wdata.data.threads.size == 0) {
        this.cont.replaceChildren("No watched threads yet!");
        return;
      }
      const fragment = document.createDocumentFragment();
      const groupedThreads = new Map(this.thList.map(section => [section, []]));
      this.wdata.data.threads.forEach((thread, id) => { groupedThreads.get(thread.section)?.push(id); });
      groupedThreads.forEach((threads, section) => {
        if (threads.length > 0) {
          let head = document.createElement("div");
          head.className = "BLICK_whead";
          head.innerText = section;
          fragment.appendChild(head);
        }
        threads.forEach(id => {
          const el = this.wdata.data.threads.get(id);
          const row = document.createElement('div');
          row.className = "BLICK_wrow";
          row.dataset.id = id;
          row.innerHTML = `
          <div class="BLICK_wcell BLICK_wtitle"><a target="_blank" href="https://questden.org/kusaba/${el.section}/res/${id}.html">${el.label}</a></div>
          <div class="BLICK_wcell BLICK_wauthor">${el.author}</div>
          <div class="BLICK_wcell BLICK_wnew"><a target="_blank" href="${this.generateLink(el, id, -1)}">${el.newEntrCnt ?? 0}</a></div>
          <div class="BLICK_wcell BLICK_wactions">
              <button data-role='remove' title='Remove watch'>🗑️</button>
              <button data-role='options' title='Adjust settings'>🛠️</button>
          </div>`;
          fragment.appendChild(row);
        });
      });
      this.cont.replaceChildren(fragment);
    }
  }
  //
  //
  let imgQ;
  (function (imgQ) {
    imgQ[imgQ["convert"] = 0] = "convert";
    imgQ[imgQ["fullview"] = 1] = "fullview";
    imgQ[imgQ["thumbnail"] = 2] = "thumbnail";
  })(imgQ || (imgQ = {}));
  let imgF;
  (function (imgF) {
    imgF[imgF["webp"] = 0] = "webp";
    imgF[imgF["jpeg"] = 1] = "jpeg";
    imgF[imgF["unchanged"] = 2] = "unchanged";
  })(imgF || (imgF = {}));
  //
  class FileExport {
    constructor() {
      this.title = "";
      this.author = "";
      this.entryList = [];
      this.insertHTML();
      this.insertStyle();
      this.filter = {
        onlyImg: true, onlyCheck: false, imgQuality: imgQ.convert, include: "", exclude: "", style: 0,
        imgSets: { maxWidth: 800, maxHeight: 800, imgFormat: imgF.webp }, toEpub: true
      };
    }
    ;
    insertHTML() {
      this.form = document.createElement("div");
      this.form.style.display = "none";
      this.form.id = "BLICK_epub_form_overlay";
      this.form.innerHTML = `
        <div id="BLICK_epub_form">
          <h2>Export Thread to EPUB</h2>
          <label for="BLICK_epub_title">Title:</label>
          <input type="text" id="BLICK_epub_title" class="BLICK_epub_input" placeholder="Enter title" required="">
          <label for="BLICK_epub_author">Author:</label>
          <input type="text" id="BLICK_epub_author" class="BLICK_epub_input" placeholder="Enter author" required="">
          <div id='BLICK_epub_checkmarks'>
            <label for="BLICK_epub_includeImages">
              <input type="checkbox" id="BLICK_epub_includeImages">
              Only Include Posts with Images
            </label>
            <label for="BLICK_epub_includeChecked">
              <input type="checkbox" id="BLICK_epub_includeChecked">
              Only Include checked Posts
            </label>
          </div>
          <label for="BLICK_epub_imageQuality">Image Quality</label>
          <select id="BLICK_epub_imageQuality" class="BLICK_epub_select">
            <option value="convert">Convert images</option>
            <option value="fullsize">Use fullsize images</option>
            <option value="thumbnail">Use thumbnails</option>
          </select>
          <label for="BLICK_epub_imageSetting">Image Settings</label>
          <div id='BLICK_epub_imageSetting'>
            <label for="BLICK_epub_imageFormat">Format</label>
            <select id="BLICK_epub_imageFormat" class="BLICK_epub_select" title='Target image format.\nWebp is compresses best and supports animations, but is not yet supported by Kindle.\nJPG compresses photos and gradients well and is widely supported, but removes animations.\nNot converting preserves the format, but gif-animations are replaced by their first frame.'>
              <option value="webp">webp</option>
              <option value="jpg">JPG</option>
              <option value="unchanged">Don't convert</option>
            </select>
            <label for="BLICK_epub_imageMaxW">Max width:</label>
            <input type="text" id="BLICK_epub_imageMaxW" class="BLICK_epub_input" placeholder="Max width" title="Max width in px. 0 to ignore.">
            <label for="BLICK_epub_imageMaxH">Max height:</label>
            <input type="text" id="BLICK_epub_imageMaxH" class="BLICK_epub_input" placeholder="Max height" title="Max height in px. 0 to ignore.">
          </div>
          <label for="BLICK_epub_includeAuthors">Filter by Author:</label>
          <input type="text" id="BLICK_epub_includeAuthors" class="BLICK_epub_input" placeholder="Author ID or name" style="">
          <button data-role="detect" class="BLICK_epub_button" title='Generates a list of Names and IDs of the authors of posts with images'>Detect</button>
          <label for="BLICK_epub_excludeAuthors">Exclude Authors:</label>
          <input type="text" id="BLICK_epub_excludeAuthors" class="BLICK_epub_input" placeholder="Authors to exclude">
          <label for="BLICK_epub_styleSelect">Select Style:</label>
          <select id="BLICK_epub_styleSelect" class="BLICK_epub_select">
            <option>Simple, full-width images</option>
            <option>Simple, floating images with max. width</option>
          </select>
          <div id="BLICK_epub_stat">0 Posts, 0 Images</div>
          <div class="BLICK_epub_buttons">
            <button data-role="export" class="BLICK_epub_button">Export</button>
            <button data-role="cancel" class="BLICK_epub_button">Cancel</button>
            <button data-role="select" class="BLICK_epub_button" title='highlights and checks all posts that will go into the epub file'>Highlight</button>
          </div>
        </div>`;
      document.body.appendChild(this.form);
      this.statDispEl = document.getElementById("BLICK_epub_stat");
      this.form.addEventListener("click", (ev) => {
        if (ev.target === this.form)
          return this.hideEPUBForm();
        if (!(ev.target instanceof HTMLButtonElement))
          return;
        switch (ev.target.dataset.role) {
          case "detect":
            this.detectPosterName();
            break;
          case "select":
            this.transferSettings();
            this.selectEntries();
            break;
          case "export":
            this.transferSettings();
            if (this.filter.toEpub)
              this.exportEpub();
            else
              this.exportCBZ();
            break;
          case "cancel":
            this.hideEPUBForm();
            break;
          default:
            break;
        }
      });
      this.form.addEventListener("change", (ev) => {
        this.transferSettings();
        this.filterEntries(document);
      }, true);
      document.getElementById("BLICK_epub_imageQuality")?.addEventListener("change", ev => {
        let target = ev.target;
        let visibl = target.selectedIndex == imgQ.convert;
        document.getElementById("BLICK_epub_imageSetting")?.style.setProperty("display", visibl ? "" : "none");
        document.querySelector("label[for='BLICK_epub_imageSetting']")?.style.setProperty("display", visibl ? "" : "none");
      });
      document.getElementById("delform")?.addEventListener("click", (ev) => {
        let target = ev.target;
        if (target.matches("input[type='checkbox'][name='post[]']"))
          if (target.checked)
            target.parentElement?.classList.add("BLICK_epub_selected");
          else
            target.parentElement?.classList.remove("BLICK_epub_selected");
      });
    }
    insertStyle() {
      const sty = document.createElement("style");
      sty.id = 'BLICK_epub_style';
      sty.innerHTML = `
          #BLICK_epub_form_overlay{position: fixed;top: 0;left: 0;width: 100vw;height: 100vh;background-color: rgba(0, 0, 0, 0.5);display: flex;justify-content: center;align-items: center;z-index: 1000;}
          #BLICK_epub_form {color: #333; display: grid; grid-template-columns: 130px 3fr 1fr; gap: 15px 5px; border-radius: 8px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); padding: 20px; width: 600px; margin: auto; align-items: center; border: 1px solid #b0a394;  background-color: #fffff0;}
          #BLICK_epub_form h2 {grid-column: span 3; margin: 0; text-align: center; color: #4CAF50;}
          #BLICK_epub_form .BLICK_epub_input,.BLICK_epub_select {padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; grid-column: span 2;}
          #BLICK_epub_form .BLICK_epub_buttons {grid-column: span 3; display: flex; justify-content: space-between; margin-top: 10px;}
          #BLICK_epub_form .BLICK_epub_button {color: white; border: none; border-radius: 4px; padding: 10px 15px; cursor: pointer; transition: background-color 0.3s; flex: 1; margin: 0 5px;}
          #BLICK_epub_form .BLICK_epub_button:hover {filter: brightness(120%);}
          #BLICK_epub_form .BLICK_epub_button[data-role='export']{background-color:#3ba44b}
          #BLICK_epub_form .BLICK_epub_button[data-role='cancel']{background-color:#bb5546}
          #BLICK_epub_form .BLICK_epub_button[data-role='select']{background-color:#dd9243}
          #BLICK_epub_form .BLICK_epub_button[data-role='detect']{background-color:#dd9243;}
          #BLICK_epub_form #BLICK_epub_includeAuthors {grid-column: span 1;}
          #BLICK_epub_form label,#BLICK_epub_form input[type='checkbox']  {cursor: pointer;}
          #BLICK_epub_stat {grid-column: span 3;text-align: center;}
          .BLICK_epub_selected{background-color: #f005;}
          #BLICK_epub_imageSetting {display: flex;grid-column: span 2;align-items: center; justify-content: space-between;}
          #BLICK_epub_imageSetting label{text-align:center;}
          #BLICK_epub_imageFormat {width: 68px;}
          #BLICK_epub_imageMaxW, #BLICK_epub_imageMaxH {width: 60px;}
          #BLICK_epub_checkmarks{grid-column: 2 /span 2;display:flex;justify-content: space-between;}
          `;
      document.head.appendChild(sty);
    }
    showExportForm(mode = "epub") {
      if (this.form == null)
        return;
      this.form.style.display = "flex";
      //
      if (mode == "cbz") {
        this.form.querySelector("h2").innerHTML = "Export Thread to CBZ";
        this.form.querySelector("#BLICK_epub_styleSelect").style.display = "none";
        this.form.querySelector("label[for='BLICK_epub_styleSelect']").style.display = "none";
        this.form.querySelector("label[for='BLICK_epub_includeImages']").style.display = "none";
        this.filter.toEpub = false;
      }
      else if (mode = "epub") {
        this.form.querySelector("h2").innerHTML = "Export Thread to EPUB";
        this.form.querySelector("#BLICK_epub_styleSelect").style.display = "";
        this.form.querySelector("label[for='BLICK_epub_styleSelect']").style.display = "";
        this.form.querySelector("label[for='BLICK_epub_includeImages']").style.display = "";
        this.filter.toEpub = true;
      }
      else {
        alert("questden_blick2 error: unknown export form mode");
        throw new Error("questden_blick2 error: unknown export form mode: " + mode);
      }
      //	
      document.getElementById("BLICK_epub_includeImages").checked = this.filter.onlyImg;
      document.getElementById("BLICK_epub_includeChecked").checked = this.filter.onlyCheck;
      document.getElementById("BLICK_epub_includeAuthors").value = this.filter.include;
      document.getElementById("BLICK_epub_excludeAuthors").value = this.filter.exclude;
      document.getElementById("BLICK_epub_styleSelect").selectedIndex = this.filter.style;
      document.getElementById("BLICK_epub_imageQuality").selectedIndex = this.filter.imgQuality;
      document.getElementById("BLICK_epub_imageFormat").selectedIndex = this.filter.imgSets.imgFormat;
      document.getElementById("BLICK_epub_imageMaxW").value = String(this.filter.imgSets.maxWidth);
      document.getElementById("BLICK_epub_imageMaxH").value = String(this.filter.imgSets.maxHeight);
      //
      this.title = document.querySelector("div.postwidth span.filetitle")?.innerText ?? "Default";
      document.getElementById("BLICK_epub_title").value = this.title;
      this.author = document.querySelector("div.postwidth span.postername")?.innerText ?? "Bob";
      document.getElementById("BLICK_epub_author").value = this.author;
      this.filterEntries(document);
    }
    hideEPUBForm() { this.form.style.display = "none"; }
    transferSettings() {
      this.filter.onlyCheck = document.getElementById("BLICK_epub_includeChecked").checked;
      this.filter.onlyImg = document.getElementById("BLICK_epub_includeImages").checked;
      this.filter.include = document.getElementById("BLICK_epub_includeAuthors").value;
      this.filter.exclude = document.getElementById("BLICK_epub_excludeAuthors").value;
      this.filter.style = document.getElementById("BLICK_epub_styleSelect").selectedIndex;
      this.filter.imgQuality = document.getElementById("BLICK_epub_imageQuality").selectedIndex;
      //
      this.filter.imgSets.imgFormat = document.getElementById("BLICK_epub_imageFormat").selectedIndex;
      this.filter.imgSets.maxWidth = parseInt(document.getElementById("BLICK_epub_imageMaxW").value);
      this.filter.imgSets.maxHeight = parseInt(document.getElementById("BLICK_epub_imageMaxH").value);
      //
      this.title = document.getElementById("BLICK_epub_title").value ?? "Default";
      this.author = document.getElementById("BLICK_epub_author").value ?? "Bob";
    }
    filterEntries(cont) {
      this.entryList = [];
      let imgCnt = 0;
      cont.querySelectorAll("div.postwidth").forEach(el => {
        el.parentElement.classList.remove("BLICK_epub_selected");
        //
        let authName = el.querySelector("span.postername")?.innerText ?? "<noname>";
        let authID = el.querySelector("span.uid")?.innerText.substring(4) ?? "<noid>";
        let hasImg = el.querySelector("img.thumb") !== null;
        let elChecked = el.querySelector("input[type='checkbox'][name='post[]']")?.checked ?? false;
        //
        if (this.filter.onlyCheck === true && !elChecked)
          return;
        if (this.filter.onlyImg === true && hasImg === false)
          return;
        if (this.filter.include !== "" && (!this.filter.include.includes(authName) && !this.filter.include.includes(authID)))
          return;
        if (this.filter.exclude !== "" && (this.filter.exclude.includes(authName) || this.filter.exclude.includes(authID)))
          return;
        //
        if (hasImg)
          ++imgCnt;
        this.entryList.push(el);
      });
      document.getElementById("BLICK_epub_stat").innerHTML = `${this.entryList.length} Posts, ${imgCnt} Images`;
    }
    detectPosterName() {
      if (this.form === null)
        return;
      const authNam = new Set(), authID = new Set();
      document.querySelectorAll("img.thumb").forEach(el => {
        const par = el.closest("div.postwidth");
        if (par === null)
          return;
        authNam.add(par.querySelector("span.postername")?.innerText);
        authID.add(par.querySelector("span.uid")?.innerText.substring(4));
      });
      const resStr = [...authNam, ...authID].join(", ");
      document.getElementById("BLICK_epub_includeAuthors").value = resStr;
    }
    selectEntries() {
      this.filterEntries(document);
      document.querySelectorAll("input[type='checkbox'][name='post[]']").forEach(el => {
        el.checked = false;
        el.parentElement.classList.remove("BLICK_epub_selected");
      });
      this.entryList.forEach(el => {
        let cb = el.querySelector("input[type='checkbox'][name='post[]']");
        cb.checked = true;
        el.parentElement.classList.add("BLICK_epub_selected");
      });
    }
    async fetchImages(imgUrls) {
      let imgcnt = 0;
      const requests = imgUrls.map(async (url) => {
        try {
          const response = await fetch(url);
          ++imgcnt;
          if (!response.ok) {
            throw new Error("Failed to fetch image");
          }
          const blob = await response.blob();
          this.statDispEl.innerHTML = `Downloading Image: ${imgcnt}/${imgUrls.length}`;
          const name = url.split("/").pop() || "unknown";
          //
          let ret = { name, img: blob };
          if (this.filter.imgQuality === imgQ.convert)
            ret = await this.processImage(blob, name, this.filter.imgSets.maxWidth, this.filter.imgSets.maxHeight);
          return ret;
        }
        catch (ex) {
          console.log("error in fetching images!", ex, url);
          throw ex;
        }
      });
      return Promise.all(requests);
    }
    async processImage(blob, name, maxWidth = 800, maxHeight = 800) {
      const img = new Image();
      return new Promise((resolve, reject) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let { width, height } = img;
          if ((maxWidth > 0 && width > maxWidth) || (maxHeight > 0 && height > maxHeight)) {
            const scaleFactor = Math.min(maxWidth / width, maxHeight / height);
            width = width * scaleFactor;
            height = height * scaleFactor;
          }
          //
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx == null)
            return;
          ctx.drawImage(img, 0, 0, width, height);
          //
          const fileType = name.split('.')?.pop()?.toLowerCase() ?? null;
          const formatMap = { webp: 'image/webp', jpeg: 'image/jpeg', jpg: 'image/jpeg', png: 'image/png', gif: 'image/gif' };
          const origFormat = fileType !== null ? formatMap[fileType] : formatMap.jpeg;
          let outputFormat = origFormat;
          if (this.filter.imgSets.imgFormat === imgF.jpeg)
            outputFormat = formatMap.jpeg;
          else if (this.filter.imgSets.imgFormat === imgF.webp)
            outputFormat = formatMap.webp;
          canvas.toBlob((processedBlob) => {
            if (processedBlob !== null)
              resolve({ name, img: processedBlob });
            else
              reject();
          }, outputFormat);
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(blob);
      });
    }
    exportCBZ() {
      this.filter.onlyImg = true;
      this.filterEntries(document);
      const imgs = new Set();
      this.entryList.forEach((el, ind, arr) => {
        this.statDispEl.innerHTML = `Processing Post: ${ind}/${this.entryList.length}%`;
        let cont = el.parentElement;
        const imgEl = cont?.querySelector("img.thumb");
        let imgName = "";
        if (imgEl !== null) {
          let imgUrl = imgEl.src;
          if (imgUrl.includes("spoiler.png"))
            imgUrl = imgEl.closest("a")?.href.replace(".", "s.").replace("src", "thumb") ?? ""; //thumbnail-link from full-link
          if (this.filter.imgQuality !== imgQ.thumbnail) { //all thumbnail. convert uses fullview as base
            imgUrl = imgUrl.replace("s.", ".").replace("thumb", "src"); //full-link from thumbnail-link 
          }
          imgName = imgUrl.split("/").pop() ?? "";
          if (imgName !== "." && imgName !== "")
            imgs.add(imgUrl); //exclude spoiler image without image. link ends then wiht "/."
        }
      });
      //
      const zip = new JSZip();
      //
      this.fetchImages([...imgs]).then((imageBlob) => {
        let imgCnt = 0;
        imageBlob.forEach(blob => {
          ++imgCnt;
          zip.file(`${String(imgCnt).padStart(4, '0')}_${blob.name}`, blob.img, { binary: true });
          this.statDispEl.innerHTML = `Adding Image: ${imgCnt}/${imageBlob.length}`;
        });
      }).then(() => {
        return zip.generateAsync({
          type: "blob",
          compression: "DEFLATE" //, 
          // compressionOptions: { level: 1 }
        }, (metadata) => {
          this.statDispEl.innerHTML = `Compressing: ${metadata.percent.toFixed(2)}%`;
        });
      }).then(blob => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `[${this.author}]_${this.title}.cbz`;
        link.click();
        this.statDispEl.innerHTML = `Downloading.`;
      });
    }
    exportEpub() {
      this.filterEntries(document);
      const imgs = new Set();
      const cont = this.entryList.map((el, ind, arr) => {
        this.statDispEl.innerHTML = `Processing Post: ${ind}/${this.entryList.length}%`;
        let cont = el.parentElement;
        //
        const author = cont?.querySelector("span.postername")?.innerText ?? "Bob";
        const title = cont?.querySelector("span.filetitle")?.innerText ?? "";
        const id = cont?.querySelector("input[type='checkbox'][name='post[]']")?.value ?? "";
        const date = cont?.querySelector("span.postername")?.nextSibling?.textContent?.trim() ?? "";
        //
        let msg = cont?.querySelector("blockquote")?.innerHTML ?? ""; //message body
        msg = msg.replace(/src="\/kusaba\/.*?\/thumb\//gi, "src=\"images/") //icons/thumbnails
          .replace(/href="\/kusaba\/.*?\/res\/.*?#/gi, "href=\"#") //references
          .replace(/onmouseover=".*?"/gi, "") //remove onmouseover
          .replace(/onmouseout=".*?"/gi, "") //remove onmouseout
          .replace(/<a .*?>\s*&gt;&gt;(\d+)/gi, "<a data-refid='$1' onmouseenter='hoverPrevEnter(event)' onmouseleave='hoverPrevLeave(event)' href='#$1'>&gt;&gt;$1"). //adjust reflinks
          replace('<div style="display:inline-block; width:400px;"></div><br>', ""); //remove leading spacers
        cont?.querySelector("blockquote")?.querySelectorAll("img").forEach(el => { imgs.add(el.src); }); //download msg images/icons
        //
        const imgEl = cont?.querySelector("img.thumb");
        let imgName = "";
        if (imgEl !== null) {
          let imgUrl = imgEl.src;
          if (imgUrl.includes("spoiler.png"))
            imgUrl = imgEl.closest("a")?.href.replace(".", "s.").replace("src", "thumb") ?? ""; //thumbnail-link from full-link
          if (this.filter.imgQuality !== imgQ.thumbnail) { //all thumbnail. convert uses fullview as base
            imgUrl = imgUrl.replace("s.", ".").replace("thumb", "src"); //full-link from thumbnail-link 
          }
          imgName = imgUrl.split("/").pop() ?? "";
          if (imgName !== "." && imgName !== "")
            imgs.add(imgUrl); //exclude spoiler image without image. link ends then wiht "/."
        }
        //
        let tex = `<div id='${id}' class='post'>`;
        if (imgName !== "")
          tex += `<img class='thumb' src='images/${imgName}' />`;
        tex += `<div class='postHead'>
          <span class='post_author'>${author}</span>
          <span class='post_title'>${title}</span>
          <span class='post_date'>${date}</span>
          <span class='post_id'>#${id}</span>
        </div><div class='postBody'>${msg}</div></div>`;
        return tex;
      }).join("");
      //
      const zip = new JSZip();
      zip.file("mimetype", "application/epub+zip", { compression: "STORE" });
      zip.file("META-INF/container.xml", `
        <?xml version="1.0" encoding="UTF-8"?>
        <container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
            <rootfiles>
                <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
            </rootfiles>
        </container>
      `);
      zip.file("OEBPS/content.opf", `
        <?xml version="1.0" encoding="UTF-8"?>
        <package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId" version="2.0">
            <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
                <dc:title>${this.title}</dc:title>
                <dc:creator>${this.author}</dc:creator>
                <dc:language>en</dc:language>
            </metadata>
            <manifest>
                <item id="content" href="content.html" media-type="application/xhtml+xml"/>
                <item href="style.css" id="css" media-type="text/css" />
            </manifest>
            <spine>
                <itemref idref="content"/>
            </spine>
        </package>
      `);
      switch (this.filter.style) {
        default:
        case 0:
          zip.file("OEBPS/style.css", `
            div.post{margin-bottom: 25px;border-bottom: 1px dashed #ccc;padding: 10px;}
            img.thumb{width:90%;display: block;margin:auto;}
            span.post_title {color: red;font-weight: bold;}
            span.post_author {color: green;font-weight: bold;}
            div.postHead{display:flex;display: flex;justify-content: space-between;margin-bottom:15px;flex-wrap: wrap;}
            #hover-content {background-color: #f9f9f9;padding: 10px;border: 1px solid #ccc;box-shadow: 0px 0px 10px rgba(0,0,0,0.1);z-index: 1000;display: none;}
            span.unkfunc{color: #789922;}
          `);
          break;
        case 1:
          zip.file("OEBPS/style.css", `
          div.post{margin-bottom: 25px;border-bottom: 1px dashed #ccc;padding: 10px;}
          img.thumb{display: block;float:left;width:100%;max-width:300px;margin-right:10px;}
          div.post::after {content: "";display: table;clear: both;}
          span.post_title {color: red;font-weight: bold;}
          span.post_author {color: green;font-weight: bold;}
          div.postHead{display:flex;justify-content: space-between;margin-bottom:15px;min-width:200px;flex-wrap: wrap;}
          #hover-content {background-color: #f9f9f9;padding: 10px;border: 1px solid #ccc;box-shadow: 0px 0px 10px rgba(0,0,0,0.1);z-index: 1000;display: none;}
          span.unkfunc{color: #789922;}
        `);
          break;
      }
      zip.file("OEBPS/content.html", `
        <?xml version="1.0" encoding="UTF-8"?>
        <!DOCTYPE html>
        <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
              <title>${this.title}</title>
              <link href="style.css" rel="stylesheet" type="text/css" />
              <script>
                function hoverPrevEnter(e){
                  const hoverContent = document.getElementById('hover-content');
                  hoverContent.style.left = e.pageX + 15 + 'px'; // 15px Offset from the cursor
                  hoverContent.style.top = e.pageY + 15 + 'px';									const targetId = e.target.dataset.refid;
                  const targetElement = document.getElementById(targetId);
                  if (targetElement) {
                      hoverContent.innerHTML = targetElement.innerHTML;
                      hoverContent.style.display = 'block';
                  }
                };
                function hoverPrevLeave(e){
                  const hoverContent = document.getElementById('hover-content');
                  hoverContent.style.display = 'none';
                  hoverContent.innerHTML = '';
                }
              </script>
            </head>						
            <body>
              <header>${this.title}</header>
              <div id='questauthor'>By ${this.author}</div>
              ${cont}
            <div id="hover-content" style="position: absolute; display: none;"></div>
            </body>
        </html>
      `);
      this.fetchImages([...imgs]).then((imageBlob) => {
        let imgCnt = 0;
        imageBlob.forEach(blob => {
          ++imgCnt;
          zip.file(`OEBPS/images/${blob.name}`, blob.img, { binary: true }); //
          this.statDispEl.innerHTML = `Adding Image: ${imgCnt}/${imageBlob.length}`;
        });
      }).then(() => {
        return zip.generateAsync({
          type: "blob",
          compression: "DEFLATE" //, 
          // compressionOptions: { level: 1 }
        }, (metadata) => {
          this.statDispEl.innerHTML = `Compressing: ${metadata.percent.toFixed(2)}%`;
        });
      }).then(blob => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `[${this.author}]_${this.title}.epub`;
        link.click();
        this.statDispEl.innerHTML = `Downloading.`;
      });
    }
  }
  class DOMManip {
    //
    constructor(set) {
      this.setting = set;
      //
      this.EvImgHoverIn = this.EvImgHoverIn.bind(this);
      this.EvImgHoverOut = this.EvImgHoverOut.bind(this);
      this.repform = new ReplyForm();
      this.watchbar = null;
      //
      this.insertStyleEl();
      this.insertHoverImg();
    }
    ;
    //
    insertStyleEl() {
      this.styEl = document.createElement("style");
      this.styEl.id = 'BLICK_manipStyle';
      document.head.appendChild(this.styEl);
      //
      this.styles = { fontsize: "", paragraphMargin: "", invertCol: "", replyForm: "" };
    }
    insertHoverImg() {
      this.hoverImgCont = document.createElement("div");
      this.hoverImgCont.id = "BLICK_imgbox";
      //
      this.wartImg = document.createElement("img");
      this.wartImg.src = imgRes.wartbild;
      this.wartImg.className = "loading";
      this.hoverImgCont.appendChild(this.wartImg);
      //
      this.fullImg = document.createElement("img");
      this.fullImg.src = imgRes.wartbild;
      this.fullImg.className = "imgEl";
      this.hoverImgCont.appendChild(this.fullImg);
      //
      document.body.appendChild(this.hoverImgCont);
      //
      this.hoverImgCont.addEventListener('mouseenter', this.EvImgHoverIn);
      this.hoverImgCont.addEventListener('mouseleave', this.EvImgHoverOut);
    }
    updateStyle() {
      this.styEl.innerHTML = Object.values(this.styles).join("\n");
    }
    initStyles() {
      this.setFontsize();
      this.setMargin();
      this.setInvert();
      this.setReplyForm();
      this.setWatchbar();
      this.setHoverImg();
      this.updateStyle();
    }
    //
    setFontsize(update = false) {
      if (!this.setting.data.changeFont) {
        this.styles.fontsize = "";
      }
      else {
        const ffam = this.setting.fontTypeList[this.setting.data.fonttype];
        const fsize = this.setting.data.fontsize + "pt";
        const templ = `#delform .bbcode_quote{line-height:1.5em;font-family:${ffam};font-size:${fsize};}
          #delform h2.title {font-family:${ffam};font-weight:bold;font-size: ${fsize};}
          #delform {line-height:1.5em;font-family:${ffam};font-size:${fsize};margin-right: 7%;margin-top: 15px;margin-bottom: 25px;text-align: left;letter-spacing: 1px;color: #003;}`;
        this.styles.fontsize = templ;
      }
      if (update)
        this.updateStyle();
    }
    setMargin(update = false) {
      if (!this.setting.data.paragraphMargin) {
        this.styles.paragraphMargin = "";
      }
      else {
        const pg = window.location.href.search(/\/[\d\+]+\.html/) == -1;
        const inv = !this.setting.data.invertCol;
        //
        const templ = `#delform>br,#delform>hr {display:none;}
          #delform${pg ? ">div" : ""}{box-shadow:0px 0px 5px 3px #${inv ? "000" : "fff"},5px 5px 15px 5px #${!inv ? "000" : "fff"},inset 0px 0px 5px #${!inv ? "000" : "fff"};margin-bottom:30px;	border-radius:5px;	border: 2px groove #000;}
          #delform{width: 100%;}
          .thumb{box-shadow:0px 0px 15px ${inv ? "#fff" : "#000"};	border-radius:10px;}
          .reply{width: 100%;}
          .userdelete{clear:both;}
          #delform>div{padding: 10px;}
          #delform > div::after {content: "";display: inline-block;clear: both;}
          #delform > div > div[id] {clear: both;}
          #delform>span {	margin-top:10px;}
          #delform img.inlineimg {vertical-align: middle!important;	margin: 0 4px;}
      `; //width: 98%;display:table;
        this.styles.paragraphMargin = templ;
      }
      if (update)
        this.updateStyle();
    }
    setInvert(update = false) {
      if (!this.setting.data.invertCol) {
        this.styles.invertCol = "";
      }
      else {
        const pg = window.location.href.search(/\/[\d\+]+\.html/) == -1;
        const templ = `html, body{background-color:#002!important;}
          #delform a {color: #BB5555;font-size: 14px;font-style: italic;text-decoration: underline;}
          #delform, #delform .reply, #delform blockquote{background-color:#001;color: #FFD;}
          #delform span.spoiler{text-shadow:none;}
          #delform .highlight{background-color:#003;}
          ${this.setting.data.paragraphMargin ? ".thumb{	box-shadow:0px 0px 15px #fff;	border-radius:10px;}" : ""}
          "#delform h2.title{color:#fdd}
          ${this.setting.data.paragraphMargin ? ".thumb{	box-shadow:0px 0px 15px #fff;	border-radius:10px;}" : ""}
          ${this.setting.data.paragraphMargin ? ((pg ? "#delform>div{" : "#delform>div{") + "box-shadow:0px 0px 5px 3px #fff,5px 5px 15px 5px #000000,inset 0px 0px 5px #000;}") : ""}
          #delform {color:#ffd}`;
        this.styles.invertCol = templ;
      }
      if (update)
        this.updateStyle();
    }
    setReplyForm(update = false) {
      if (!this.setting.data.replyForm) {
        this.styles.replyForm = "";
        this.repform.removeBar();
        document.querySelector("#BLICK_previewbut")?.remove();
        document.querySelector("#BLICK_cb_preview")?.remove();
      }
      else {
        this.styles.replyForm = `
        #BLICK_previewbut{margin-right:0px!important;}/*workaround questreader*/
        td.postblock + td { display: grid; grid-template-columns: 1fr 30px auto!important; }/*workaround questreader*/
        .postarea table tr td:nth-of-type(2) {display: flex;gap: 5px;align-items: center;}
        .postarea table tr td a.rules{width:auto!important;}
        .postarea table tr td input[type="text"] {flex: 1;}
        .postarea table tr td textarea{width: 100%;  box-sizing: border-box;}
        input[name="postpassword"]{flex:0.5!important;}
        `;
        document.querySelectorAll(".postarea table tr td:nth-of-type(2)").forEach(el => {
          const prevEl = el.querySelector("input[type='text']") ?? null;
          if (prevEl === null)
            return;
          let tex = "";
          el.childNodes.forEach(node => {
            if (node.nodeType == Node.TEXT_NODE) {
              tex += node.textContent?.trim();
              el.removeChild(node);
            }
          });
          if (tex !== "") {
            tex = tex.replace(/\(|\)/g, "");
            prevEl.placeholder = tex;
            prevEl.title = tex;
          }
        });
        let pwbox = document.querySelector(`input[name="postpassword"]`);
        if (pwbox?.nextSibling === null)
          pwbox?.insertAdjacentHTML("afterend", "<span></span>"); //questReader workaround for .nextSibling.remove()
        this.repform.insertBar();
      }
      if (update)
        this.updateStyle();
    }
    setWatchbar() {
      if (this.setting.data.manageWatchlist) {
        if (this.watchbar === null)
          this.watchbar = new WatchBar(this.setting);
      }
      else {
        if (this.watchbar !== null) {
          this.watchbar.destroy();
          this.watchbar = null;
        }
      }
    }
    setHoverImg() {
      if (this.setting.data.imageHover) {
        document.querySelectorAll('img.thumb:not([BLICK_Hover])').forEach(img => {
          img.addEventListener('mouseover', this.EvImgHoverIn);
          img.addEventListener('mouseleave', this.EvImgHoverOut);
        });
      }
      else {
        document.querySelectorAll("img.thumb[BLICK_Hover]").forEach(img => {
          img.removeEventListener("mouseover", this.EvImgHoverIn);
          img.removeEventListener("mouseleave", this.EvImgHoverOut);
          img.removeAttribute("BLICK_Hover");
        });
      }
    }
    EvImgHoverIn(ev) {
      if (!(ev.target instanceof HTMLImageElement))
        return;
      //
      const linkEl = ev.target.parentNode?.parentNode;
      if (linkEl == null)
        return;
      const fullImageUrl = linkEl.getAttribute('href') ?? "";
      //
      this.wartImg.style.display = 'block';
      this.fullImg.style.display = 'none';
      this.hoverImgCont.style.display = 'block';
      //
      this.fullImg.src = fullImageUrl;
      this.fullImg.onload = () => {
        this.wartImg.style.display = 'none';
        this.fullImg.style.display = 'block';
      };
    }
    EvImgHoverOut(ev) {
      if (!this.hoverImgCont.contains(ev.relatedTarget)) {
        this.hoverImgCont.style.display = 'none';
      }
    }
  }
  //
  // start
  //
  function main() {
    //action starts after storage is loaded/sanitized
    delete Array.prototype.toJSON; //remove prototype.js prototype changes to stringify()
    const set = new Settings();
    const syncr = new Sync();
    const dom = new DOMManip(set);
    const sb = new Sidebar(dom, set, syncr);
    set.load().then(() => {
      sb.loadSettings();
      dom.initStyles();
    }).catch(ex => console.log("Blick error: critical initialization error", ex));
  }
  //
  //loading storage
  //
  main();
})();
//# sourceMappingURL=questden_blick2.user.js.map