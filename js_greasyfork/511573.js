// ==UserScript==
// @name         HorbachMailCopier
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  This script enables copying email performance statistics from web pages in a custom format.
// @author       sanyabeast
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511573/HorbachMailCopier.user.js
// @updateURL https://update.greasyfork.org/scripts/511573/HorbachMailCopier.meta.js
// ==/UserScript==

let is_initialized = false;

(function () {
    'use strict';

    const ROW_TEMPLATE = 'open_rate%|click_rate%|sends|$revenue|$revrec';

    const ROW_SPLIT_SYMBOl = '	';

    const COPY_ICON_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAB8xSURBVHic7d150GdVfefxd3dDN0Ir0A3DZifd7EpYFMagIqaB0TipGElYjCbMpIpJJVFHTDCk4mhZkxlj4rgVOG6URFBRiWYYdSTDolKiU4ZFQI2ACLIvjWwNvdDL/HEeEFn693ue372/7zn3+35VnepUxdJPn6fvuZ/nLufOQ6rDAuAlwErgUGB/YDdgMbB1YC4ps0eBdTP/94PAvcAq4D7gbuAm4OaZP38KrJ1+RM3VvOgASm8Z8CbgD4A9grNImruNwA3ANTPjSuA7lOKgClkAFGVn4L8B/xFYGBtFUk82AT8Evg1cAlwEPBCaSE+wACjCG4DTgSXRQSRN1Qbgu8AFwJeA62Lj5GYB0DRtDfxP4OToIJKqcDXwReDzlGcINEUWAE3LtsA/Aq+JDiKpOpuBbwCfBP6JXzx4qB5ZADQNWwPn48lf0mirgDMptwnvCM4yaBYATcMn8bK/pNlZD5wLvB+4NjjLIFkA1Lc3Ap+JDiGpWZspDwy+m/JGgTpiAVCfdgZ+jE/7S5rcJsoVgXfhA4OdWBAdQIP2QeCI6BCSBmEecBDwJ8B2wPcotwk0R14BUF+WAT/BTX4k9eMu4DTgHMptAs3S/OgAGqw34clfUn92BT4N/DOwZ3CWJnkFQH1YAPwM9/aXNB2PAv8F+DDlWQGNwSsA6sNL8OQvaXq2BT4AXAg8PzhLMywA6sPK6ACSUjqKsr3wcdFBWmABUB8Oiw4gKa0lwHnAx/E5pC2yAKgP+0YHkJTeHwMXA7tFB6mVBUB98ICTVIMjgMuBQ6OD1MgCoD4sjg4gSTN2B74FvDY6SG0sAJKkodsO+DJlfxLNsACoD6ujA0jSUywAzgDeGx2kFn4LQH04Cfg30SEk6RkcQdk34KLoINEsAOrD0cALokNI0rN4ObAU+Hp0kEgWAPVhb0oJkKRa/TqwA+VbAilZANSHx4CTo0NI0giHU74dcGl0kAh+DEh9mE/5GJB7cktqwZuBj0SHmDavAKgPmykPAR4RHUSSxvBq4Erg+ugg0+QVAPXl+cCNuBe3pDY8SvmQ2feig0yL+wCoL7cBn4oOIUlj2payWdCu0UGmxSsA6tMS4Dpgp+ggkjSm71CuBKyPDtI3nwFQn9YAt+K3uSW1YxnwXBK8HmgBUN9+QPk64GHRQSRpTIcD1wL/Gh2kT94C0DQsAP4ReF10EEka0/3AIcAt0UH64kOAmoaNwBuB/xMdRJLGtCNwFgM+T3oLQNPyGHAesDPeDpDUhhXAg8D/iw7SB28BKMKJlM9y+naApNo9AhwI3BQdpGteAVCEH1L2CFgMHARsFRtHkp7VQsrXTT8THaRrFgBFWUN5JuAsyvu2vwpsH5pIkp7ZXpSdTa+JDtIlbwGoFvMpzwYcBRwK7AfsQblK4HbCkqLdQVmXVkcH6YoFQJL0TBYC21Geht8O2IVyAnx8vIjyUG8m7wHeER2iKxYASdJczKM8w7MSOBo4BtgmNFH/1gIvZIAPBEqSNFfbAycBFwKbKJ8FH+L4dFcTJknS0OwNfJzyG3P0CbvrsYHyVoAkSXoWewAfAh4l/sTd5fhCl5MkSdJQ7QV8jfgTd1djI3BApzMkSdKAHUv5RHj0CbyL8amO50aSpEHbnvJdkOgT+KRjHbB7x3MzVe4EKEmapnWUz4M/RNn4q9Xz0ALKLqYXRweRJKk1RwL3E//b/FzHPbhTqSRJc3IAbT8XcHz3UyJJUg7LgRuIP5nPZVzY/XRIkpTHCsoHd6JP6LMdGykFpjnzowNIkkTZX/9VlGcCWjIfODE6hCRJrXsl5en66N/sZzOu6GUmJElK5lTiT+qzHfv0MhM9avX9S0nScH0XOBTYNzrILNwOXBYdQpKk1i0FbiP+N/txxzd7mQVJkhI6nvgT+7jjMco2x5IkqQMtfUXw2J7moBe+BihJqtkpwNroEGM6OjrAbFgAJEk1uwE4MzrEmF4eHUCSpCFZRvmKYPQl/lFjIw09B+AVAElS7W4Fzo4OMYb5wOHRIcZlAZAkteDvKb9l1+7Q6ADjsgBIklpwA21stHNgdIBxWQAkSa04JzrAGA6KDjCuedEBJEka0w7AncA20UG2YAOwmPLQYtW8AiBJasUDwCXRIUbYClgRHWIcFgBJUktqLwAAy6MDjMMCIElqSQsFwCsAkiR17GrgvugQI1gAJEnq2CbgqugQI+wSHWAcFgBJUmuuiw4wwk7RAcZhAZAktcYC0AELgCSpNbUXgKXRAcZhAZAkteau6AAjLI4OMA4LgCSpNQ9HBxhhYXSAcVgAJEmtqb0ALIoOMA4LgCSpNRaADvgxIElSizZHBxih+vPrVtEBNCvbAHtRdplaPjN2obxyshTYGdh+5j+7CNh26gmlujzKL77K9iBwL7CKspPc3cBNwM0zf/4UWDv9iFKM6htKYjsALwVeDBwMHAjsAyyIDCUN2EbgBuCamXEl8B1KcVB9vAIwoeoDJrIj8O+AlcARwAvxGQ0p2ibgh8C3KR+huYjySVrFswBMqPqAA/cC4HeB1wCH42/3Uu02AN8FLgC+RP0b0gyZBWBC1QccoL2BE2fGgcFZJE3mauCLwOcpzxBoeiwAE6o+4EAsAl4L/DFwNM67NERXAJ8AzgHWBGfJwAIwoeoDNm4P4C3AyTSyN7Skia0CzgROB+4IzjJkFoAJVR+wUQcDf0G5zN/ElpCSOrceOBd4P3BtcJYhsgBMqPqAjXkh8G7gOJxbScVm4GvAO4HvB2cZEgvAhKoP2Ii9gb8BTsBX9yQ9s02UKwLvwgcGu2ABmFD1ASu3HfB24K9oZO9nSeEeAz5KuSLwUHCWllkAJlR9wErNA/4IeA9lK15Jmq27gNMobw3UfjKrUe1zVv35tfqAFdoT+DhwTHQQSYNwKfCfgOujgzTGAjAh71ePbz5wKvADPPlL6s6RwFXA23BN1hRV31AqsQw4G/iN4ByShu0bwEnAbdFBGuAVgAnZNkd7PeXLYL8RnEPS8K2kbC98XHQQDZ8F4NltBbyX8trODsFZJOWxBDiP8qyRG4mpN9VfogiyO+UAfFl0EEmpXQYcD9wZHaRC3gKYUPUBA7wEOB/YNTqIJFG+J/BayseG9AsWgAl5C+CXvY7yEI4nf0m12B34FqUESJ2xAPzCKcCXgG2jg0jSU2wHfBl4U3QQDYcFoDgN+CDOh6R6LQDOoDycLE2s+nsUPZsHvI/y6V5JasX7KL+41H4fvE+1/92rP79WH7BH84DT8ZKapDadDvzn6BCBLAATynzJ+7148pfUrrdQbl1Kc5K1APxX4C+jQ0jShE6hfFZYmrXqL1H04BRszZKG5c3AR6JDTJm3ACZUfcCO/RZlk58F0UEkqUMbgd+jrG9ZWAAmVH3ADh1K2Uxju+ggktSDRykfE/pedJApsQBMqPqAHdmdso2mO/xJGrLbgcOAu6KDTIEFYEIZHgLcGvg8nvwlDd8elB1N/YqgRspQAD4MvCI6hCRNycuAv4sOofpVf4liQq8Hzo0OIUkBfo/y/YCh8hbAhKoPOIHnA1cDS6KDSFKA+4FDgFuig/TEAjChod4CmA+cjSd/SXntCJyDrz3rWQy1APw55XUYScrsSHJ/L0BbUP0lijlYAVyL7/tLEpT9AQ4CbowO0jFvAUxoaFcA5gGfwJO/JD1uW8q6WP0JSdM1tALwR8Ax0SEkqTJHAW+MDqG6DKkRPhe4Hjf8kaRncjewL/BQdJCOeAtgQltFB+jQO8l38r8XuAq4DvgxpQDdDTxCeQXoEWB9WDop1kLK7cAdZ/7cBdjvSeNFwM5h6aZvF+A04B3RQVSH6hvKmPYGfsjwt79cA1wEXDIzrqX+FizVah7l4biVwNGU24fbhCbq31rghcBN0UE6UPvaN5Tza/XOpfxjGOq4HHgrsLSrCZP0NNsDJwEXApuIP+77Gp/uasKCRc/jqKEpOJDyLezoH3bXYy3wMWCv7qZK0pj2Bj5OOQ6j14KuxwbgBd1NVZjoeRw1NAVfJv4H3eV4FPgA5atekmLtAXyIclxGrw1dji90OUlBoudw1FDPDmZYl+q+StnISFJd9gK+Rvwa0dXYCBzQ6QxNX/Qcjhrq2dnE/5C7GLcAr+t4biR171jgVuLXjC7Gpzqem2mLnr9RQz3aA1hH/A950nE+frRIasn2wHnErx2TjnXA7h3PzTRFz9+ooR69l/gf8KQH3yn4qojUonmUj46tJ34tmWS8p+uJmaLouRs11JNFwCrif8BzHT8Hjuh8ViRN25GUTbei15S5jntod/+U6LkbNdSTNxD/w53ruIPy8KKkYTiAtp8LOL77KZmK6HkbNdSTbxD/w53LuAFY3v10SAq2nHJ8R68xcxkXdj8dUxE9b6OGerA3bb76dzue/KUhW0G5whe91sx2bKTNtSl63povAC1+Dvj3ae/BuQeB3wJuDs4hqT83Aa+iPBPQkvnAidEhpHFcQ3yzm81Yhw/8SZm8kvbeDriil5noV/ScNX8FoDX7E/9Dne14ay8zIalmpxK/9sx27NPLTPQner4sAFP2DuJ/qLMZ/4v2bldImtw84CvEr0GzGaf1MhP9iZ4vC8CUfZv4H+q44xZgx36mQVIDlgK3Eb8WjTu+2css9Cd6viwAU7Qj8BjxP9Rxh3v7Szqe+LVo3PEYZZvjVkTPlwVgik4g/gc67vh6T3MgqT0tfUXw2J7moA/Rc9V8AWjpNcCjogOMaQ3wZ9EhJFXjFGBtdIgxHR0dQNPTUgFo5VW6j1HeB5YkKDsEnhkdYkwvjw6g6WnlCfUdgPuov7CsA/ai7PonSY9bBvyE+j+8s4nyefIHo4OMofbL7NWfX2s/oT7upbSR9R/w5C/p6W4Fzo4OMYb5wOHRITQdLZxUAQ6NDjCGzcD7okNIqtbfU/9vrdDGeqsOtFIADooOMIZLgRujQ0iq1g3AZdEhxnBgdABNhwWgO+dEB5BUvRbWiRbWW3Wg+ocUgOcADwMLooNswRpgV+Ch6CCSqrYDcCewTXSQLdgALKY81Fyz2m+nVH9+beEKwJ7UffIHuAhP/pJGewC4JDrECFsBK6JDqH8tFIAW/iHWfkBLqkcL68Xy6ADqXwsFYHl0gDG0cEBLqkML60ULv3hpQhaAyd0LXBsdQlIzrqZsbFYzC0ACLRSAXaMDjHAl9T+MIqkem4CrokOMsEt0APWvhQKwU3SAEa6LDiCpObWvG7Wvu+qABWBytR/IkupT+7pR+7qrDrRQAJZEBxjh+ugAkppTewFYGh1A/WuhACyODjDCXdEBJDWn9nWj9nVXHWihANT++cyHowNIak7t60bt6646YAGYXO0HsqT61L5uLIoOoP5ZACa3OjqApOZYABSu+o8VUP879i3MoaT6uLZNxvmbUAtXACRJUscsAJIkJWQBkCQpIQuAJEkJWQAkSUrIAiBJUkIWAEmSErIASJKUkAVAkqSELACSJCVkAZAkKSELgCRJCVkAJElKyAIgSVJCFgBJkhKyAEiSlJAFQJKkhCwAkiQlZAGQJCkhC4AkSQlZACRJSsgCIElSQhYASZISsgBIkpSQBUCSpIQsAJIkJWQBkCQpIQuAJEkJWQAkSUrIAiBJUkIWAEmSErIASJKUkAVAkqSELACSJCVkAZAkKSELgCRJCVkAJElKyAIgSVJCFgBJkhKyAEiSlJAFQJKkhCwAkiQlZAGQJCkhC4AkSQlZACRJSsgCIElSQhYASZISsgBIkpSQBUCSpIQsAJIkJWQBkCQpIQuAJEkJWQAkSUrIAiBJUkIWAEmSErIASJKUkAVAkqSELACSJCVkAZAkKSELgCRJCVkAJElKyAIgSVJCFgBJkhKyAEiSlJAFQJKkhCwAkiQlZAGQJCkhC4AkSQlZACRJSsgCIElSQhYASZISsgBIkpSQBUCSpIQsAJIkJWQBkCQpIQuAJEkJWQAkSUrIAiBJUkIWAEmSErIASJKUkAVAkqSELACSJCVkAZAkKSELgCRJCVkAJElKyAIgSVJCFgBJkhKyAEiSlJAFQJKkhCwAkiQlZAGQJCkhC4AkSQlZACRJSsgCIElSQhYASZISsgBIkpSQBUCSpIQsAJIkJWQBkCQpIQuAJEkJWQAkSUrIAiBJUkIWAEmSErIASJKUkAVAkqSELACSJCVkAZAkKSELgCRJCVkAJElKyAIgSVJCFgBJkhKyAEiSlJAFQJKkhCwAkiQlZAGQJCkhC4AkSQlZACRJSsgCIElSQhYASZISsgBIkpSQBUCSpIQsAJIkJWQBkCQpIQuAJEkJWQAkSUrIAiBJUkIWAEmSErIASJKUkAVAkqSELACSJCVkAZAkKSELgCRJCVkAJElKyAIgSVJCFgBJkhKyAEiSlJAFQJKkhCwAkiQlZAGQJCkhC4AkSQlZACRJSsgCIElSQhYASZISsgBIkpSQBUCSpIQsAJIkJWQBkCQpIQuAJEkJWQAkSUrIAiBJUkIWAEmSErIASJKUkAVAkqSELACSJCVkAZAkKSELgCRJCVkAJElKyAIgSVJCFgBJkhKyAEiSlJAFQJKkhCwAkiQlZAGQJCkhC4AkSQlZACRJSsgCIElSQhYASZISsgBIkpSQBUCSpIQsAJIkJWQBkCQpIQuAJEkJWQAkSUrIAiBJUkIWAEmSErIASJKUkAVAkqSELACSJCVkAZAkKSELgCRJCVkAJElKyAIgSVJCFgBJkhKyAEiSlJAFQJKkhCwAkiQlZAGQJCkhC4AkSQlZACRJSsgCIElSQhYASZISsgBIkpSQBUCSpIQsAJIkJWQBkCQpIQuAJEkJWQAkSUrIAiBJUkIWAEmSErIASJKUkAVAkqSELACSJCVkAZAkKSELgCRJCVkAJElKyAIgSVJCFgBJkhKyAEiSlJAFQJKkhCwAkiQlZAGQJCkhC4AkSQlZACRJSsgCIElSQhYASZISsgBIkpSQBUCSpIQsAJIkJWQBkCQpIQuAJEkJWQAkSS1aHx1gC9ZFBxiHBUCS1KLV0QG24OHoAOOwAEiSWnRndIAtqDnbEywAkqQWXR8dYAuuiw4wDguAJKlFl0cH2IKasz3BAiBJatEl0QG2oOZsT5gXHWAMm6MDjNDCHEqqj2vbZOYDNwPLgnM81S3ACmBTdJBRvAIgSWrRJuCz0SGewWdp4OQP9Tc8sCVLGibXtsk9H7gRWBgdZMY6YC/g9ugg4/AKgCSpVbcBn4oO8SSfpJGTP7TR8GzJkobIta0bSyiv3e0UnOM+YH9gVXCOsXkFQJLUsp8Db4kOAfwpDZ38W7G58iFJcxG9dg1tbfsYcXN1xhT+filFHwRDO0gk1SF67Rra2rYA+CemP09fBbaawt8vpeiDYGgHiaQ6RK9dQ1zbtgW+xvTm6Csz/5vqSfRBMMSDRFK86LVrqGvb1sBH6X9+zsDf/HsXfRAM9SCRFCt67Rr62nYicC/dz8s9wPFT/HukFn0QDP0gkRQjeu3KsLYtBT4CrGXy+VgLnE557VBTEn0QZDhIJE1f9NqVaW3bA/hbyj79s52HW4D3zPx3DEoLGz3U/g+xhTmUVB/XtumbDxwGHAUcCuxHObEvnvn/r6bsLng95ZO+lwBX0Mje/rPVwg/Yg0TSELm2KZQ7AUqSlJAFQJKkhCwAkiQlZAGQJCkhC4AkSQlZACRJSsgCIElSQhYASZISsgBIkpSQBUCSpIQsAJIkJWQBkCQpIQuAJEkJWQAkSUrIAiBJUkIWAEmSErIASJKUkAVAkqSELACSJCVkAZAkKSELgCRJCVkAJElKyAIgSVJCFgBJkhKyAEiSlJAFQJKkhCwAkiQlZAGQJCkhC4AkSQm1UAA2RgcYYWF0AEnNWRQdYITa1111oIUCsD46wAiLowNIas5zowOMsC46gPpnAZhc7QeypPrUvm5YABKwAEyu9gNZUn1qXzdqX3fVgRYKwOroACPsGh1AUnNqXzdqX3fVgRYKwH3RAUbYLzqApObsHx1ghFXRAdS/FgpA7f8QLQCSZqv2daP2dVcdsABMrvYDWVJ9al83al931YEWCsBd0QFGeDEwLzqEpGbMBw6JDjHC3dEB1L8WCsDPogOMsBNwYHQISc04BFgaHWKEm6IDqH8tFIAW/iEeHR1AUjOOig4whhbWXU3IAtCNFg5oSXVoYb2o/cqrOtDCvevnAA8DC6KDbMEaYDfgweggkqq2I3AndX8L4DHKRkXuBjhwLVwBWANcHx1ihOcAx0eHkFS9E6j75A9wHZ78U2ihAABcEx1gDH8YHUBS9VpYJ1pYb9WBVgrAtdEBxvAKYO/oEJKqtS/wsugQY/hBdABNRysF4IroAGOYB7w9OoSkav0lbTx31cJ6q0SeB2wANlc+1gO/0tMcSGrXMsp99eg1atTYQFlvlUArVwAeAn4UHWIMWwNviw4hqTqnAQujQ4zhasp6K1Xlo8S343HGGmCvnuZAUnv2BdYSvzaNM07vaQ5UoVauAABcEh1gTNsAH4kOIakaH6L+V/8ed3F0AOmZbE+5xx7dkMcdx/YzDZIacgLxa9G4Yz1lnZWqdCnxB8m44xZgST/TIKkBOwG3E78WjTtaucqqjrR0CwDggugAs7AMOIs2XvuR1K15wKeB3aODzEJL66sS2o/4ljzb8ee9zISkmp1G/Noz2+FGZqre94k/UGYz1gNH9jITkmq0kraeV9oM/EsvM6GqtXYLAOCL0QFmaWvgK8Ah0UEk9e5A4MuU474lX4gOII1jT2AT8Y15tuN2YHn30yGpEiuAO4hfa2Y7NuIOpmrIxcQfNHMZN1AWCUnDsgL4CfFrzFyGD/+pKa8n/qCZ67gTbwdIQ/JrwG3Ery1zHcd1PyVSfxYB9xJ/4Mx13A+8svNZkTRtK4EHiF9T5jrupo1vFEi/5G+JP3gmGeuBU3GfAKlF8yif932M+LVkkvHfu54YaRp2p43Pa44aXwGWdjw3kvqzFPgq8WvHpGMtsFvHcyNNzT8QfxB1MW7D+3BSC06gre19tzTO7HhupKk6kDZfCXy2cQGwT6czJKkL+wL/l/g1oquxEXhBpzMkBTiP+IOpy7GW8k3uZV1OkqQ5+RXgDMpxGb02dDk+1+UkSVEOoLTZ6AOq67EO+CReEZAi7Eu5RD6E54yeOjZQvqsiDcJniT+o+hyXA2+lfF5UUj+2B04CLmRYtxafOs7qasLUtqG8grYn8CPK/gBDtpbyze6LZ/68hrJQSZq9+cDBwFHA0TN/Dn0NWUO59/+z6CCKN5QCAGVfgL+KDjFl9wFXAdcBPwaup2zs8TBlc5LVlP0GpIwWAouBHYDnArtQLn3vT7nE/yLyvYL7N8C7okOoDkMqAIspJ0Dfa5Wkp7udUoAeiQ6iOrT4OeBns5p8VwAkaVxvx5O/nmRIVwAe98/Aq6JDSFJFvg78++gQqssQC8By4FrKLQFJyu5RyhcLb4oOorosiA7QgwcoT8u/OjqIJFXgVMqVUemXDPEKAJRnGy6kvNYjSVldCPwmvi6sZzDUAgCwB3A1+V7zkSSAVZR9Du6IDqI6DektgKe6HfiT6BCSFGAzcDKe/LUFQ3wG4Ml+BCwBfj06iCRN0f+gfMRIelZDvgXwuK0oW+ceGR1EkqbgG5RXoTdEB1HdMhQAgF2BK4Ddo4NIUo9uBQ4D7okOovoN+RmAJ7sL+G3KboGSNEQPA6/Fk7/GlKUAAFwJnIiXxSQNz0bgD4DvRwdRO4b+EOBT3QD8HLfElDQsfwZ8LjqE2pKtAAD8C+UVmZXRQSSpA38NfCg6hNqTsQAAfAvYBjgiOogkTeCDwDujQ6hNWQsAlFcDl+IeAZLa9GHgbdEh1K7MBQDKJzLnA6+MDiJJs/B3lI/8SHOWvQAAfJPy9cBjgnNI0jjejZf91QELQHEZ5cMZrybXq5GS2rGB8rT/+6ODaBiy7AQ4rlcDXwSeFx1Ekp5kNfD7wFejg2g4LABP92Lgf1M+JyxJ0W6j7GTqJj/qlJe7n+5K4EWUtwQkKdKlwL/Fk7964DMAz+xRyq5ai3CvAEkxPgG8HngoOoiGyVsAo/0u5UBcGh1EUgqrgJOB86ODaNgsAOPZBTgLeE10EEmDdjHwH4Dbo4No+LwFMJ5HgHOBBym3BBbGxpE0MKuBtwNvxkv+mhKvAMzecuBjlFcGJWlSXwf+FPhZdBDl4lsAs3cz8JvAHwJ3xEaR1LDbgDdQPk/uyV9T5y2AubuGciVgA3A4sFVsHEmNWAN8gPKE/xXBWZSYBWAyj1G+JfA5YAnwa3hVRdIz2wicAxwHfAlYHxtH2fkMQLf2B/6aclnPciUJYBPlhP9O4LrgLNITLAD9OAD4C0oRWBScRVKMdcBnKB/v+dfgLNLTWAD6tRvwFsqmHjsHZ5E0HfcAZwKnA3cFZ5GelQVgOhYCvwOcRNlMyNsD0rBsAi6h7Bp6Pt7fVwMsANO3HDgROIHy5UFJ7bqc8gnxLwC3BGeRZsUCEGsfyrcGXgO8DNg6No6kER4Dvg1cQHmw78bYONLcWQDq8TzgGGAl8ArKK4XeKpBibaTs+XEZ5RL/RcDDoYmkjlgA6vU84KWU2wQHAwcC++KGQ1JfNlBe07sWuBq4EvgunvA1UBaAtiwCVsyM5TN/7kr5VPHjY0fKZkRbA4tDUkr1WE25bL8JuB+4b2asojyhfzNw08yfP8WH95TI/weJAfEcQLArAQAAAABJRU5ErkJggg=='

    let tooltip_el = null
    let tooltip_timeout_id = null

    function is_correct_url() {
        return window.location.href.indexOf('admin.mailchimp.com/customer-journey') > -1 ||
            window.location.href.indexOf('Customer%20Journey%20report%20_%20Mailchimp.html') > 1;
    }

    function find_journey_analysis_table() {
        console.log('[HorbachMailCopier] searching for journey analysis table...')
        let divs = document.querySelectorAll('div')
        for (let i = 0; i < divs.length; i++) {
            let div = divs[i]
            let header_el = div.querySelector('h4')
            let table_el = div.querySelector('table')
            if (table_el !== null && header_el !== null && header_el.textContent === 'Journey analysis') {
                console.log('[HorbachMailCopier] journey analysis table found!')
                return table_el;
            }
        }
        console.log('[HorbachMailCopier] journey analysis table NOT found!')
        return null;
    }

    function create_copyrow_button(row_el) {
        console.log('[HorbachMailCopier] prepare to create copyrow button for', row_el)
        let btn = document.createElement('div')
        let icon_el = document.createElement('img')

        btn.appendChild(icon_el)
        icon_el.src = COPY_ICON_IMAGE;

        btn.style.width = '25px';
        btn.style.height = '22px';
        btn.style.position = 'absolute'
        btn.style.top = '50%'
        btn.style.right = '8px'
        btn.style.transform = 'translateY(-50%)'
        btn.style.borderRadius = '32px'
        btn.style.cursor = 'pointer'

        icon_el.style.width = '100%'
        icon_el.style.height = '100%'

        btn.addEventListener('mouseover', () => {
            btn.style.background = '#90eaff';
        })

        btn.addEventListener('mouseout', () => {
            btn.style.background = 'transparent';
        })

        btn.addEventListener('click', () => {
            let copy_text = get_row_summary_text(row_el);
            copy_to_clipboard(copy_text)
            show_tooltip(`copied: ${copy_text}`, btn, 1000)
        })

        btn.title = get_row_summary_text(row_el)

        row_el.style.position = 'relative'
        row_el.appendChild(btn)

    }

    function get_row_summary_text(row_el) {
        let sends = row_el.querySelector('td:nth-child(3)').textContent;
        let open_rate = row_el.querySelector('td:nth-child(4)').textContent;
        let click_rate = row_el.querySelector('td:nth-child(5)').textContent;
        let revenue = row_el.querySelector('td:nth-child(6)').textContent;
        let revrec = row_el.querySelector('td:nth-child(7)').textContent;

        sends = parse_float(sends);
        open_rate = parse_float(open_rate);
        click_rate = parse_float(click_rate);
        revenue = parse_float(revenue);
        revrec = parse_float(revrec);

        let result = ROW_TEMPLATE.replace(/\|/g, ROW_SPLIT_SYMBOl);
        result = result.replace('sends', sends);
        result = result.replace('open_rate', open_rate);
        result = result.replace('click_rate', click_rate);
        result = result.replace('revenue', revenue);
        result = result.replace('revrec', revrec);

        return result
    }

    function copy_to_clipboard(text) {
        GM_setClipboard(text);
    }

    function parse_float(str) {
        const match = str.match(/[-+]?\d*\.?\d+/);
        return match ? parseFloat(match[0]) : null;
    }

    function setup_table(table_el) {
        console.log('[HorbachMailCopier] prepare to setup table element', table_el)
        let rows = table_el.querySelectorAll('tbody > tr')
        rows.forEach((row_el, index) => {
            create_copyrow_button(row_el)
        })
    }

    function show_tooltip(text, anchor_el, duration) {
        clearTimeout(tooltip_timeout_id)

        if (tooltip_el === null) {
            tooltip_el = document.createElement('p');
            tooltip_el.style.position = 'absolute';
            tooltip_el.style.top = '0';
            tooltip_el.style.left = '0';
            tooltip_el.style.border = '1px solid black';
            tooltip_el.style.background = '#fff'
            tooltip_el.style.color = '#000'
            tooltip_el.style.pointerEvents = 'none'
            tooltip_el.style.margin = '0'
            tooltip_el.style.alignItems = 'center'
            tooltip_el.style.justifyContent = 'center'
            tooltip_el.style.fontSize = '12px'
            tooltip_el.style.display = 'none'

            document.body.appendChild(tooltip_el)
        }

        tooltip_el.innerHTML = text;
        let rect = anchor_el.getBoundingClientRect();
        tooltip_el.style.transform = `translate(calc(${rect.x}px - 100%), calc(${rect.y}px - 100%))`
        tooltip_el.style.display = 'flex'

        tooltip_timeout_id = setTimeout(() => {
            tooltip_el.style.display = 'none'
        }, duration)
    }

    if (!is_initialized && is_correct_url()) {
        is_initialized = true
        let table_el = find_journey_analysis_table()
        if (table_el !== null) {
            setup_table(table_el)
        }
    }


})();