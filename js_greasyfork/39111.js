// ==UserScript==
// @name         ABB: magnet link
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  adds floating magnet link to book pages
// @author       openam
// @include      /^https?://audiobookbay\.(nl|fi|li|is|lu)/(audio-books|asbs|abss)/(?!(type|tag)).*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39111/ABB%3A%20magnet%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/39111/ABB%3A%20magnet%20link.meta.js
// ==/UserScript==

/* jshint esnext: true */

(function () {
	'use strict';

	let img = `<img style="width: 100%;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAi2UlEQVR42u2dSVhTZxfHXXTRRRff4lt00a8muQmjggICgigqghZna6m1ihbrPIuCAiIigwKCMoOCiggIDgiCI4OzoqKgoqJiSy0qBBwWLlyc75z3JiFAgAAxQb3v85xHpBCb/H/nnP873HsHDBCGMIQhDGEIQxjCEIYwhCEMYQhDGMIQhjCEIQxhCOPTj/UBgXYrN/i6e/tv/kb4NL7CMWfhklLPJcvAa/nKBgQhYmNQsLnwqXwlY5Wvn8hj/gKYt3QFzFm0BOYtWU4gwMJVayq8/QOWReza/R/hU/qCx9zFy8JmzvOCh48eQWn5BYiMjYM/lq1EIJbDghWrYNHqtR+WrPXO2rp9hxvCILSIL2kEhIR9M36GR31g2Hb4559/VPH02TM4VlAIm0PCYD5WBgUIsHTd+nrfLUFhwTsiTIRP7wsYazb6u7vN8IBzpWVtAFCPu1XVsO/gIVjtuwn+XLkaFq9ZB8vWrYcVG3yu+m3dtigmIVFoEZ/rmDrbs4B6f2fitw9qEdHxiYAtgQfBewOgafywZuOmjPCdMWOFT/QzGhG7Y7/H3v9xX2aW1gAoo/bJEzheeBLQFyAM62A5grDKZyOs3eRXHxgaFrw9OkYqfML93f37bPKZs2gpPKh52GMA1OPO3So4kJUNPoFbYMV6HoR1m/xhvf/mi5G7Y73iU1K/Ez7tfji8lq+uC9sZ0yfx1ePvv/+G8ouXYHdSMmBLQM+AIPj5w4aAwA9oHNMRhlHCp95PRnj0rlGL13hDCfZ0XQGgHo9rayH/5EkIjdwJa9A8evsFgM/mQNi4ZWtd8PYdgdgiRIIKBhyrN/pn+W4JZlmrS+E1vV7l3btwMDsH/IO3gbc/gbAFNgVthYDgbccEJQww0jIO/nd9wJYP2XlHdSp+XV0dVFVVwYP796H28WP2d3UgWIu4dAlCIqPQHwQQELGCGgYYO2Jil23aGoLmr0anADx69Aiqq6rhXnU1g6AGX5++9wTbQd2zZyoY/LZuY0YR/xT2Gwwxtm6PqE5K26dT8evr66EahdcEAFUDgkBZARauWkPrCBWCEgYY6Qcz7cj5X7x8RacAPHv6FO5ir6cWoAmAp0+esJ+L2B0H85cup1XFRYIaBhg74xITY5NS4K+//tIpADUPHsDdO3c0AvD40WN4jn6ANpt+X7gEZv+5+D1WIWFtQN/jeOHJ72KTU98XFp/WufO/U1mpEYCHDx8yAOrxZzKycmD6nHkwc55XuqCGAUbe8XzPpL3pOjd/tdjfK2/fbgPA/Xv3WFUgAJ7U8uXfa8VqmOgxG1Zs8LUT1DBM/7+ae+y4zhd9qlF0FQB3q5gRVAeApoPlly6D24xfKKoFJQwwsOybZ2QfhusVFToVn7zErZs3GQCsDaARVAKgbAM0Q9gevZtl/28LFq8T1DDAyD9ZFEHZr2vzRxl+s+Im3L51SwWAug+g9kCHS2b/uQSm/T7vQ0BI2H/1/d4nzJwVPdPTa8bcRUu//SrFP1da9u2xEwWNNAfXdfmvRNGVAGjyAVT+j50oxMxfBB7z/8zS93v3XLLc0v2X38B1OrUfj0Y0oLFey1daf1UAnD59xqOgqBge4nxc10u/N27cgApsK6o2gAAo2wBVACr/m0PCAYWAjVuC3fT93hG82Blz58Msr4UMAoJhyuy58LPnH9Xzl65Y5e0X8N8vH4Bz54tLP8Gu3z3M8BvXrzMANLUBWgCqvHMXFq1eBwtWrqnT9/tes9HvW5x2tmwKCobTp0/B3n372K4kAUHh8ceftC7xEUE4tnaT35RNW4K+vAOvCWHbpbTsq2vzR5ldgdl//do19meHNoCzgb+eP2cHRZav94UNm4MC9f3el3tvmE1CH8zKglOniqG4uAhOniyE48ePQ3RsHB1lo0UpoOsh6NDr4jXrGhGE6E1BWy2/GAD2xMaF0bZvQlKqTrd+nzx5AlevXGEAKKuA+myAqsNzNJwB28JgzaaAj6GR0T/o+73/6rWwlM4tUvYTAEVFJ6GwsAAKCk5Afv5xOHbsKBw8lAmhEZGwYr0PO/VMZxzp8Ku3/+YK/+DgZSE7Ij7fFnHIbfw3KcZm9TFTpkFwcCjk5h7RGQRk/q7g3P7a1as8AO2qAG3+lF24CBuDtoFPYFCBvt/72o3+JjjlhJi4+DbZT+KfOJGPVeAYHD16BI4cycPP5TDk5GRDYnIyBIUisBv92Ekm38AttGX9YUtYeG54VJR7RHT059UiDlgOdU/5nwiOSMSQM+sXCEEzduDAQTRvz/u89HsZxb+MswpVFWhnBulnUvcfgM2h4bArMXmGvt/70nUbwuYuXgYFmPGdZT8BkJeXC4cP50B2dhZkZR2CzMyDsH//PoiJjWUw+G0NhsDQUAjesQPCo3Y2RO7aFRETF/d5bGOj+LkEwEVjCVSbc5DvMR/CwnZAXFwiuvW7vZ/719TAxQsX4NLFS3DlcscqQNM/2vgJjYrGDy6qYc+BDL1mTmBI2Dfzlq5o2BwSysq/MvsJgM6ynwA4hO3g4MEMTJL9DIL09DRITkmGqJgYCImIgNDIKIjAr6Pj4iA2KakiITl5UUJyUv+8JiJHJvsexf+4/0cRE7/aTAovjaZAxTgviA4Ohx0RO/GDyIenT5/2GAAS+kJ5OQJwkVWC9lXg2dNnUHzmLETsioXdSSlh+n7vG7dsnfLH8lWQkZmpVfYTAMrsz8g4wMTfty8d0tL2wp49qZCCECQlJcLuuFjYuXsX7MTqsDsxARJSUiAlLe1D2oH9WWn797nt3Zfef1rEvh9FPpT9xVIxA6DW1AZeG02H18bToc7aA7KX+0EkZmhsbAKcRrFoTq+N+M/R2ZeXlTEAVFVAzQuw8o8zhNR9ByAmIQnSMg7q/RIynHYWrNno32n2EwDaZP/evXsgNTUFkpOTGAAJCfFYPVF8hGBX7G6IS0yE5L17YS/+/H783czsrPpD2VlhmdmHTPpD+a8hAG6Z8eX/H2NXJv5rEwzTadBoNg3uuP4B6f4hEB0TCwmJKVBUfAoedbNYRKd+SktKVBBQFSAIlFWAloZvV96BxD1pEJeyp1Tf79s/OOSHJWvXf9ydkKjKfqX50yb7CYD22U8AJGLGx8dj6Ufhd+3CNhC9E6KiIiFqZxTE4vexAuB08xBk5+ZA3tE8yDqcbbgDL5kDxaNI/FyxCO4N4qDGzEyV/a9NpqkAaDSfCo2DpsLtiQsgIyAUdmM1iI1PhNy8o3D9+g2N+wY0/buJZZ7EJwjUqwABQOavEEEiA3gwK2e2vt+7z+Ygv2XePpCP2a7L7M/Ly2PvlV6Pfj4Js58AiIjYAdu3h6O3CoWdCEUWvmYuvj5WApEhsz+dAChH80cA1JmMaJP9r5XiKwBoHDwFGi2mQM24uZC/NgASdsezipC6Jx1ddBH29gpW+tsvBNFKH63507yfloCfPnkKz549A9p13Jd5qCUnI1Pvmy+rfDfVhURE6Tz7qeoR4NTqyPgS9GWlpZB//Dgc2L8fduzYzgBA4SEn73CxwcQ/LBL/B8X/kI7m7x6WfgLgpfGkTrNfKX6jJcaQydA4dDK8sJ8O12cthSMBIZCUgAYoeQ+kpKZBzuE8OHv2PBq9m+xQSfsKQZCcLSmFrNwjkJWRqfcj38HbI9xWY+8/gOavu+xXTv2U2a80f+rZrzR/9HfyNyT+VYX41PqoIlAVLDl/HsLDwyAJTSG1gf0HD3gY0vwto+w/yYmZ+LVmVhrK/1QNAExWAdBoNQmarDFsJsILp+lwa9ZiKPYOgP2RuyAxKZUFVQgK+npv+n5ISEpBl5yA075IWO3rD3HbQvU+V16/eUvWxqBgJn777FdO/TRlv7L8q2e/svxT9hM4lP3kc2jtQ118qgL0etQC0vE1Mg5lNu5J2/utIct/BQFw05Qv//UmLh3MX6fZzwCY1AaApmEYtu7QZIdh/xO8cJ4K1T/Pg6vzl0LZktVQtM4Xji5fCbmzf4OjU6dC4tIV4O3rp3fztzMu/r8+gVs/JKSkqgDQRfaT8yehefH57CfxyQOR+NQaEuLjIRqNYRpBlHEg2pDmz5rEzxaJ4D6ZP3MTeGU0TYvy3zb7G9uIP1EhPsbwn6DJAcORYgLIR2A4jYebg8zhgjEHJ8USODZQAkdHOs8wQPlfRXsexzDbu8p+pfnTNvsJDE3iExQk/ulTpyEkZBskIDC027gnPc3ckNmfSACUGokZAHWmDh3NX5flv6vsVwdgAjQx8SfAvw6j4SKKX27EMfExGnIdHPW+IBIQElZNC0/ts19p/nqb/fT7nYlfcr4EMg8ehHA0gIkETnraVUOav29R/Ja9/+PNHwHQYDyxR+avQ/a3K/8dARgPNUOtGQBnOD77j0tkel/5i4qNtwsMDcf+e6jNpk9fs58v/+Wdin/+3HmIiYmGKCz/Cfh7SXtSvQy38zdQ7EnZfwLN3wNm/ob0yvw19iD7G51c4aqJEQPghIgHoEDM6X0VLHhHVOo2nPpR5mub/erLvsrsV1/2JfEzMjJUhk8pPvV9Er8ExS8sKIBt27bBLvQA8cnJ7xOSk78zZPkvJQBuoPl7wMzfGM1z//bZ3+vyPx7qbB3hEopfKsO+z5d/vZu/hNTU70Iid75PSUvvU/arL/woV/0KUGBNmU/inz97DtLT0iAMy39MPNscSjSg+ROZkPiHBoqY+DXmRmj+pure/Dm0NX93Bg9mABRJ+OwvFHN6X/nbGZuwiHYdj6HYnWW/+pavttmvdP/qbl9d/LNnzrAVwO07d/KbQwnxhrvYBef+EQTAeSO+/NeZ2rdmv1blv+fm76XjWCb+xVbz11Ik4fQ+/0Xjd3V3YnKnBz7aZ7/6sm9X2X8oM1NV8tV7/rmzZ5n4ebm5sA3d//ad6AF27zbcxS6HxaJvUPyGPQhA9SC+/DcYu/fe/NloZ/4eWg2DywjAWSmf/egB9L7yFx8VbR4ZGw+HcnJ6nf3tt3yVO34EU6v4mPXnzqnEP3P6NAMlOCyMDolA5K5dqwxn/kSisZT9xyRiqBnMwRMrDsWf1kfzN7HL7G9ycoMbZsYMgAKRsvxL9H7WPnhHZKJvUDAUoljdHffSlP3tN32U2U8gtCn57cQvOnmSzf23hodDaGTkh8iYGMOdG0TxUwmASyYSBsALZw7Fdeva/Fn0zfz9ZecEV0xw7i/jlOZP7zd7yJs89duYXbHvvf02o4hpOst+AiArK0uR9Xy/V4p/+tQpOFVcDAdxdrAlOBiCwsLppFDWAEMOFL+e5v73B/EAyH/iUCwH3Zm/4R3NX7WlBQPgFKcq/3rf+y6yG+5RZmQKKXM8cSoWBun79ukk+6n8F50s6pD1SvFPFRVDNBq/AHZWMAxCIyIMd3dUpfunff+HVP5tOGiZjBCMs+jVxo+2c/9rJlJW/o/z2f+hWMLp/VzcBbH07EWxFAo5KcQuWAghoeEoZAqK3zH72x/36ir7CQgSXpP4xQjG0SNHYEtQELvL2eZtIXUGzf4skWgRAXBWJmYA1DvxAFC8HjRJe/PXycaPpvJfbz8SrlL5N5Io3X+uvt/3OWNTEQIAZWIO8nEKWmgsg7yNyyEsfAdgW2CCd3bgo7PsV5q/nOxsjVlP4lPvJ2A2bQ4E3y1BEBgS6mPo8p+Rqlj8IQBejWsFoMl+lI42flqznwB4YmPHADincP9FYm6Zvt93GScLpuw/Lcb2gwDcdDKHt172cHHd7xCJENBZx5SUVAaCNoc91Y97kciahD9ZWMhW/kJDQ8Dbz5/udfgRK8APhgagmgCowakfAdA8sRWAZhfLVvF1MvcfD/KRtPZvhS0A+79i8eekWDJCn++5VMx9g9lfTxWgUMID8OIXGwbA2wX28HzpODi01QeiomJYNUhN3aM67aPpuJd69u/ds4cXnsp9UVEH8TMOHAC/gAB24cj6gM0FBhU/D+f/JD76AHiE4tdatYqvjEZLd+03fpTZ30X5JwAeDBnKAFBu/eKfIr1mv4RzJ/HPY/kvQPFLLY3g7R/2KgDe/mkHbxfaQdW66bA3PJgdeI2NS4BkrAhpaWldZv/hnByNWV9wAqeX+fnsDOAa343s0rFNW4LcDQoAzv9NUhXzfwKgzq4jAHKn4TozfyR+48TR8GBoKwDHDQAAin+Myv8p/PcJgIfjLdXEbwXg7SJbeLvYFqrWz4CDO4LYaaW4eMz4JMz8lI7ZT0e9KcNPHM9XCa8ufg5ODTcHbqYnptBFpQ0BgQa+khgNoBsBcErKA1A/oiMAzT+ZaM7+bk79dJb9r2Y5IgBDGADFEh6AIrFkkN7Kv4T7HgH4WI7ZX4hT0CL0Ic2eHbP/7SI7Jv7bJRhLh7F46v0TFIeuheS4OHaULSkpFYOOtSUxANSPetPfqVLQXn8WGUic90fs2AFrfXzZgzLWb/ANG2DokS0SeRIA52U8ALQA1B4A3gw69838KQEY5QYv59vCI2trBgDt/xMAxWJuir7ec7lY6kPZf1aCFQj//QoHM43lX5n9KgCWDYN3y23g3QobkK+2hzsBv0JBxCZIQfHpwCsfqRCfkAi7dsciCNEQERGhOO4dBiEhITjNDGWPyaEriAPWehv+YRg5IpEfrf9fMJYwABrGaAageby5Tsxf0zgXeLnIBlvNcAZAqZQHoFAkCdNj+a+l/k/VhwCon2GtOftVAPDZ/04NgHcrreHdKozV1tCydhg89J8CJWErIGdXKAKRqDrsGp+QzFoGXSdB10vswq83bd1Gj9YrHtAfxmGRKJAAuGrCA/DKVTMArArYunSd/VqU/0b3MdCwcig0jHJmANBCUD4CgFGpH/MnHUXi4ywAilD80sGyHmS/ZgDerbGCd2sx1g2Fd95D4e16K/jHzxkeBk6Cyq0eUBn8C+RMnwzZzs5QNnosHPBaCFELF7v3KwBoDeBxNwA0uw7uk/mTj2oFoHHSaLhtbswgwP7PIDgl4az1kP1ZyvJPADwYZ9Eqvpbl/91Km1bxV1t1AOD9eowNQ+C9D4avJbz4cxBbaKIp70POiKJuQH8ZuT0AgFUBB+demz8egNEMgFe/OUDtMBsGQJkM5+EDWXzSOXG5RGrMmz8s/xwHp2Q4xZ1r27X566b8txEf4z0DYEgbACpcjNk6wxWJlAFw19Tcp98AQBWANoEqzHgAXncDQPMEUxR/Yo+PfPMAuEGTqwvfApZYw6vRYxA8KVylo+AiHgL80/0TZn8pZf85Eh/jlqM5yBcN65H56678q7KfAWAJb7wtoMiIn2re52QEwMfbpuY/9KsKsFfhAR63WwbutAqMdOhV+Zc7IwBjXKFhxVC+DUwbBY+G8SuCF7AKFAxk0XBOKv1e5+JLpD7U+2nqd1qKgdn/Yo41NC+0bSv+wu7Mn01b8TsA0Db7H8005ReasOVQ9j/ijAoG9KeBFcCHALhkzAPQMLp7AJonylD08Vof+VYHQD4ap4F/DmMAvFw4DF67jIGb5kYMgvPYkwvZjICr0SUEWPpnUOknAM5yPAD3xgyGl8ut4M0Cu67n/su0LP/K7G8HwIVh/FLzbQnLfqiSydz7GwCeBECJkRgeW2BWjOoeAAbBuCE9y34s/0oAqP+zNkBVwGME1Ds5MgCoFZyhubmIRc15qVSkA/FXlSv6PpX+Myj+5SHG0IjwEQC9Mn+rtDB/WP5fLhnEFprovEMNb/4aKqXS/nWDqByRaGya4g4gBEC9o3YA8EvEI7Wa+6tnvxxbAC0FKwFoQBHk+PenDsN4CDAoSwmCIhHXclrM9eoiiXKp9AcUvaCclX0UX0rnDjkoNZXBqznDWBtqWmyjA/PXefmvdDNm6wxXON783ZfKwgb0t4EASAmAfIkYahGA53baA9DsboSiu3V55Ftp/tQBkI91ZeVfCQEtDMl/GguP7a1UEJSiWMUiPk6JuMrznHR2qVTa7WnhMk5qgnP96DKx9EO5Yq//PL7WOez5ZWYyaPjVhmU+AdCx/OvO/L1dbwFnTPmp5j1OUf6lsv75GFwE4EPWQBED4OlQ7QFomYRVwM1CK/OnLr7cxRVe/+zUWgUIAvQFcvcxUDfCVgUBXSlE83UEAE7z8f6MiCs+J+YCSzjOs5Tj3DA8yjhuWYmIiy0RS2tKmeh84H+D8zI+rgw1xtZjC6+WWbF/7/VS609q/p7NNmPi4/+ncu5fOqC/jvT/iSox2FkAagNyd+0BaCYIxthrXf55AMaBfNw4lRlUQYBVQT4Z28O4EXDbwoRBcJlmCEYc+yBRfBZnFXEO47wiEAAg8cltU/UokSkCf/feqMEg97SHlwrxNWd/H8yfBgCu2BuxtYabiuyvlsk8+jMAqek/iqECSxZVgZcuPQOADpA0jXTumP2dlH8lAE2TRqumhKpYagVNvzgxX1A3ahjcHGzMIKAlY7qAhGAoo17OtUYZx3+vjMo8/vdSRdy2M4OXM+1AjmKr/zs9nvv30Pw1rhzMxD+NoTB/LXdksv77jIFcsdhzHwJQYiRhAGjaEu4OAPlP6AecXLTIflcmvtx1HDS7uUDjLyPaAqCIV162IJ8xEponO0O9ix3csx0M181lDAJ2JRHBoAwj/rJyihtDTeDRaEt47WEPzfOGw6sl1m1e9/VSm85X/hb3wPx1Uf6rJ5rAKZptKMzfA6msfz/Z9LBILCIAjimM4DPrngPAIBhviuK7dWn+lNnfrACgebwLvJ4zXCMElLWvFthC0yxHaJk+isWryY5Q72YLdS42LJ6Ns4bnbjbw72TMdA8HaJntCPL59ii8TUeollnDGy/7T7jyNwTe+VhAySApW2u4qyz/Uln/vyUsAlB74Ef+VDBB0DRBy5mAOgDuZAqx345065j9HQBwUQHQPGFs5xCoposoIHqGxnnoN+YOB/nvKPTvDiCf4wBN+L1GBOUVTus6tBRV5qP47Xf9OgHgXY82ftpm/9+e5kz80lbz93k82fTQQHH0fgSAloQJgBcje1EF3PkLSuSull2Wf/XsJ/GbcQrY7D4WGn91ZEJ3CUJPA4FoxJ7/Zv5wePvHcK1O/fTF/FU4GbHFporW8v95PNk0VyR2JAAK+tIG3BVVgCDA0qxN+W8FYAy+xhiQT3Nmma4L8cn1N6PgJP4bEr+Hp35Y9q/U3vzJV1vAWRm/4KTY+PmA5u/zebIptoDajB8Vdwax6H5nsEsA6NIygkCT+WtX/tUBaJ6EgVNBuYcTD8KKngv/Csu93MsO3ng6wBs0gl1m/yLdmb9H00wZAJelUuXGz+f1ZNOsgWIf8gHlitnAX/a9MILqAKCPaHK10iL7x7YRn6JlCsZUZ2ieORKa0B8QDC+XWnXiD6xY/ycf0OyJgs914MVvA4BuT/203/gh81c+WMpWHJXm755M9nk92TRfIv4eK8DH7IHYBvDNaGsGuwRgPEFggQC4aDR/mrK/WSF+C7aDlukYM3AG8DMGwtDyixM0zxoBzb85QjM6/pbfRsAbitkYaAzfzHFsBWCeg4bs19Wpn3Yrf7PMmPjlUpX5qxzwOQ4EID2DmUG+Dfzt0EsjSDFBHQKcHbiO7Sh+GwDaZj8PwKh2AGBge2j51QnezHJqK34HAIbrxfy922ABl4ZI2ZLzbUX2o/nz/CwBOCISmx9EAPJEPagCXfkAJQBuHDS6meE00bnr8q8ufhsARmoAoPvs/6TmT7HxU4fZX6LIfsXKX32VTPb5PjoOAcjKRAho+VWrHcJJWrSB8QSAFMMY5OOdOi3/Wmd/GwB6kf092fjpwvzRka+LmCgEQGVr9nsN+JzHUZFYigB8zB3YujD0yqUPPmCCOgAYrlL8u23b7O9r+VcXvzfmr5enfh5MMGH7DpdkquyvrTKSff4Pjjw8UBxxCKvAeZkEnlhI2TaxfGIv2oC6D1ADgEHghuZworN25q8X5b9N9n+CI98vFw6GMmN+A6pa6fyN+tmRr96OAon4PwhAfRZCcMdMYQiH99EHtKsCr8dhuGJLcHfsffbP7oP568OR7zfrLOGalYyJfwPn/YrsLxjwJQ1sAe4EwHERf90gQdDZpWPd+gANbUAFgQtWgwlWCIAOzd/8Xpi/Hmz83HMxZruPl7H0P1Bs+VYZy34Y8KUNBCA9GyGgO3kQAE8sUcTxfWgDSgjUAVBA8NrVFOSTHTTM/XVk/nR06ue5hznbgr6oKP01n/O0r7txUiL+DgGozUEIrivWBpgfcNdNG2hUBwDj1Vj83gRLaJ7u1APz18u5fy/MX8Mfg+CiCX8OoVJR+jGyBnzJ44RYbIkAvD88UKLyA7RZ1DxR+zbQlRlsDwALFyNommSDADj1bu7vZa/zUz+NiwfDFTP+MMpNmZSVfhS/ptr4M9rw6cPU0IMAOCaSsOcIEAR1w7qBoA9VgMUYjHEmIJ9m2zb7f+uD+VvcuyPfjUss4BrOhug00o1W8VtQfOMBX8tA8X1y6WEOCEHNoE4g6EsVGKcBAIyXo/H7bmbQPMO26+yf92nM3+uFFnBdTfz71PM5ow/3pTLHAV/bQAii8/h7+rKHSdEp4qdW7TyBjqsAAcDCmYyiGch/HqY38/fvvMFw1Zw/nXzDSCX+RxR/xoCvdWAFiD5CN3Vg7UDCIHgyhMMs7dmUsKsqoIJgTEcIGjBeUmuYjlPHOcM/mfl7/rM5XDXlr1GoQPHv0dU9X7v4qq1jkSRCCUGlGQ8BXVz6r3MfqoBrF15AAwQNozDGGEHjJAto/t1WZ+bvzaqhUONiwi5QobglU4n/XhBffXYgkiw7OlDyke7xc01xdTEFbR6R4Np5gbbrAlq1AiUEoxQxko9XbqYgnzkEQbDrtfl79YcF3LaSMeGvK6Z6CvEb732NPb/bJWORxI2e8kEQlHC8OSQIai2xGozuQxXQohVoguBfJwyCYQJ6BQ+EYcEwzdnfDoCW5VZQO94UbuA0j9Y7KozpZA+KL5ERANVVxjJOULuTcZaTcAhAZT5/hw+4rbjdDC0fP7PhbzrRZRXoybRQWwgoRvDxEitD48/YJuYP7WD+3q60gvqZg+G2pRRuYL+noJJfhcJX8+KnVxl9BfP8PkMgkXyD4kecwJZAt3opoxswmfMQsDuQ2vL3H9LWEOoaghcUjjJ4MdIIqwMCgaLXTxsEd7Hc0yVxFDcx6+9wKvFbqrh+fD1ffx2nxRI7BKC6gFUDdNBGHGsLBAGdLXhqw7cGEr5XraA7U6gJAqdWCOodpPDYWgp3EM6bpoow4Xv9XRS+io/cu0bSHwQ1eznOYTUoFklWFYq4lpP89f0MhAeKu5Gzq5DRIzwfzkHDWO1nBd2aQk0QjOSFf4bG9AFOVW9jj7+lDIXwd1D0u3zU3JVJ3QQFdTTQFP7nlFgSXCTi3hcpQKDt07tmrSDQ42keIQzPbPkHVdDJo678QKemsF07+Bsz/ekwFB1fu9KMF14VWOpvo/CVKPodPmqx9HvekUm/EVT7RCCcEUsCi0Vcg/JmDyUSdNu0nWrOQ0BtgoI9sNKCv209Ze1fDvzVyv+gqP9QRjvz8QK/rsfM/tuRryRPEaBH1hzcR8Hv4mvSppUyGACK+fxtiZTdsKmSj8pKidSz392350sdpRz3LQrvgQAUY3xU3uyBbtt6VcaX5GozHgKK+2pxTy0IGmVUtQsSnypMpSllupTt2t1EsSluYaD47zHSKzmpnaCIAUc5x31fJuEWnaVbvoi4D+p3+yAgLqEbvyajJVgEw5jP4Dum7cJEUc6NKbvxZ6U4jcPfuy7GKR2KXaEIFL8Rxc+4xUmn3NbiPkPC0PO4gJWhXMKNQuH9SkRcQYlYWq9+rx/lnb7oPn8XFXEJ4zLGFYyrGNcUgeJ/RPGrMTJuctJVGEOET/gzHJc57rtLHDcEYwp+7XWF4wIprqrFNYzrHOeD4XmD48ZimFRwnNDPhSEMYQhDGMIQhjCEIQxhCEMYwhCGMIQhDGEIQxjCEMYXOf4Pu8ICV3K1utIAAAAASUVORK5CYII=">`;

	let hashCode = $('td:contains("Info Hash:")').next().text();

	if (!hashCode) {
		let message = 'No hash code found';
		alert(message);
		return;
	}

	let a = [
		"udp://tracker.coppersurfer.tk:6969",
		"udp://tracker.leechers-paradise.org:6969",
		"udp://explodie.org:6969/announce",
		"udp://tracker.desu.sh:6969",
		"udp://tracker.opentrackr.org:69691337/announce",
		"udp://tracker.vanitycore.co:6969/announce",
		"http://tracker.baravik.org:6970/announce",
		"http://tracker2.wasabii.com.tw:6969/announce"
	];

	let b = [];
	$.each($("td:contains('Tracker')").next('td'), (index, value) => a.push($(value).text()));
	let c = [...new Set([...a, ...b])];
	let trackers = c.map(tracker => encodeURIComponent(tracker)).join('&tr=');

	let link = `magnet:?xt=urn:btih:${hashCode}&dn=${encodeURIComponent($('h1').text())}&tr=${trackers}`;

	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = `
	.magnet-link {
        position: fixed;
        bottom: 10px;
        right: 10px;
        border-radius: 5px;
		background: rgba(32, 127, 123, 0.5);
	}

	.magnet-link.clicked {
		transition: opacity 0.5s ease-out;
		opacity: 0;
	}

	@media only screen and (min-width : 736px) {
		.magnet-link {
			width: 100px;
			height: 100px;
		}
	}

	@media only screen and (max-width : 736px) {
		.magnet-link {
			width: 40px;
			height: 40px;
		}
		.cd-top {
			bottom: 60px;
		}
		.cd-top.cd-is-visible {
			opacity: 0.5;
		}
	}
	`;
	document.getElementsByTagName('head')[0].appendChild(style);

	let html = `<a href="${link}" id="download">${img}</a>`;
	let wrapper = document.createElement('div');
	wrapper.id = 'magnetLink';
	wrapper.className = 'magnet-link'
	wrapper.onclick = () => { wrapper.classList.add("clicked"); };

	wrapper.innerHTML = html;
	let oldElement = document.getElementById('magnetLink');
	if (oldElement) {
		oldElement.remove();
	}
	document.body.appendChild(wrapper);
})();