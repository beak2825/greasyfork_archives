// ==UserScript==
// @name          Save Vietnamese xenforo forum content to HTML file
// @description   Save your favorite thread into a html file
// @namespace     Save thread to file
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAagAAAGCCAIAAAA658DHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAACNpSURBVHhe7d15kBTl/cfxcAiiyBVWjlVwAeORKpOqWEWZshLzh0lVDpNojIkpLzYgiijeRrRieSQaL8CrjDEeZagkGi8iWhrwQC1UrHhRQY0KgoAChnNhAePvw3y2nvRvd2d3jp7d6Xnerz+mhmW6p4/v8+nn6e6Z+cLnABAZgg9AdAg+ANEh+ABEh+ADEB2CD0B0CD4A0SH4AESH4AMQHYIPQHQIPgDRIfgARIfgAxAdgg9AdAg+ANEh+ABEh+ADEB2CD0B0CD4A0SH4AESH4AMQHYIPQHQIPgDRIfgARIfgAxAdgg9AdAg+ANEh+ABEh+ADEB2CD0B0CD4A0SH4AESH4AMQHYIPQHQIPgDRIfgARIfgAxAdgg9AdAg+ANEh+ABEh+ADEB2CD0B0CD4A0SH4AESH4AMQHYIPQHQIPgDRIfgARIfgAxAdgg9AdAg+ANEh+ABEh+ADEB2CD0B0CD4A0SH4AESH4AMQHYIPQHQIPgDRIfgARIfgAxAdgg9AdAg+ANEh+ABEh+ADEB2CD0B0CD4A0SH4AESH4AMQHYIPFfTf//73s88+02N40vIfQLci+FARirmWZ23s2LGDBET3IviQshBqW7dufeutt+bMmXPffffdc889jz766GuvvbZ582b/L9mHbkTwIU0hzubNm3fMMcd8oY3vf//7Tz75pPuDHfQKgYoi+JAap15TU9PVV1/tmBs1atSYMWP2y9GT0aNH++/Tp0/ftGlTmAToYgQf0qQgu+KKKxRtBx988NChQ3v06OGkM/1z8ODB+i89v+iii3bu3NkyGdC1CD6kwyn22GOPKdS+/OUvO+Z2pV17/IIHH3xQkzDgRdcj+JACj1g3bNjw9a9/XYk2cODAXL7lteeee+qxoaFh3bp1YXKgyxB8SIF7bQsXLlScjR07toO+nukFepmePPvss2FyoMsQfEiBu2x//OMflWXhCkbH9t13Xz3eeuutYXKgyxB8SIGT65prrlGW7bPPPrlk60R9fb0eL7/88jA50GUIPqTAyeW7WAoMvhEjRujxkksu8RyArkTwIQUOvt/+9rfKMoIP1Y/gQwoIPmQLwYcUEHzIFoIPKSD4kC0EH1JA8CFbCD6kgOBDthB8SAHBh2wh+JACgg/ZQvAhBQQfsoXgQwoIPmQLwYcUEHzIFoIPKSD4kC0EH1JA8CFbCD6kgOBDthB8SAHBh2wh+JACgg/ZQvAhBQQfsoXgQwoIPmQLwYcUEHzIFoIPKSD4kC0EH1JA8CFbCD6kgOBDthB8SAHBh2wh+JACgg/ZQvAhBQQfsoXgQwoIPmQLwYcUEHzIFoIPKSD4kC0EH1JA8CFbCD6kgOBDthB8SAHBh2wh+JACgg/ZQvAhBQQfsoXgQwoIPmQLwYcUEHzIFoIPKSD4kC0EH1JA8CFbCD6kgOBDthB8SAHBh2wh+JACgg/ZQvAhBQQfsoXgQwoIPmQLwYcUEHzIFoIPKSD4kC0EH1JA8CFbCD6kgOBDthB8SAHBh2wh+JACgg/ZQvAhBQQfsoXgQwoIPmQLwYcUEHzIFoIPKSD4kC0EH1JA8CFbCD6kgOBDthB8SAHBh2wh+JACgg/ZQvAhBQQfsoXgQwoIPmQLwYcUEHzIFoIPKSD4kC0EH1JA8CFbCD6kgOBDthB8SAHBh2wh+JACgg/ZQvAhBQQfsoXgQwoIPmQLwYcUEHzIFoIPKSD4kC0EH1JA8CFbCD6kgOBDthB8SAHBh2wh+JACgg/ZQvAhBQQfsoXgQwoIPmQLwYcUEHzIFoIPKSD4kC0EH1JA8CFbCD6kgOBDthB8SAHBh2wh+JACgg/ZQvAhBQQfsoXgQwoIPmQLwYcUEHzIFoIPKSD4kC0EXwYoVj5L2Llzpx6dNVWixoKv1QaXqtraKB/BV9XcAlv+keDW2PKPKlBLwdfuts23I5BRBF/1Cr2MDRs2LF68eMGCBU8//fSiRYs++ugj/716uiG1EXxhe6pPvWzZsoULF86bN+/FF198++23N2/e7P8i/moDwVeN1LrU9vRk48aNf/rTn775zW86LIJf/epXb7zxhl6gthqaazfyMmQ6+LQKDrVXXnnlrLPO8kIGRx111AMPPOD427FjB/GXdQRfNXLqvf/++0ceeaQb3qhRoxoaGvbL6d+/v/94xx13+JXdnn1ZDz4vv+Ls97//vRevrq7OG1yPI0eO9B9/9KMf/fvf/9YrlX256ZBVBF/VcW9i6dKl/fr1U2M76KCD9tprrx49erjt6cluu+1WX18/btw4/fPaa6/1652A3SXTwacNqOWXG2+8UYv0pS99SUnXq1ev3GLu2uA9e/YcNGjQgQce6L9o5OupPDmyiOCrRlu2bDn22GPVxsaMGePG1pYapDJRT6655ppu7/f5rbMYfF5y9eCcekq3EHltqQOox8MOO2zt2rVhWmQRwVdd3I94+OGH1cDcxQh9vVb89wMOOECPv/vd79wIu6sbktHg8+bSwt9www1aGG/MQja4RsSeMDcbZA/BV0XckJqamn7wgx+odWl4tavBdSZkXxiyeW5dyW+areDTMmuLqa/n1NMIN7dcndh99931OG7cuHXr1nkmnhuyheCrIu6AvP3222pa9fX1PXv2zLW1zjn7rrvuutCFyc2v62Qu+LzA2lzhvJ46dPn6ekl6TUNDg54sWrTIc8jNDxlD8FURn6p7/vnn1a7Gjh2ba2idc3N19l177bWhSedm2UWyFXzaOF7gkHp6LCT1RC/zidfHH3/cs8rNEhlD8FURt6J58+apXblbUZRu7PdlKPi8qDrGzJgxQwvgjVYUX+J45JFHNB+CL6MIviriVuQeXwfXc9uV7Pcp+9y8u6xZZiX4vJx6TPb1Cj+lYN41zzzzjGbVvXcRoWQEXxVxK3r33XfVrpQLxTZIC2NepZ5auJt6pfldqjz4tJDaJlJyX0+0U7zkvpOZ4Msogq+KOKqam5tPOOEENa2hQ4fm2lrR3KSvv/5651EXZF/1B5+XMKRe4VczWtl777312NjYuH37ds1TM/T8kS0EX3VxQ3r22WfVug4++GA9Ftvv65Yxb5UHn48oejJz5ky9aVFXMwK/3jdXvvjii8nZInMIvmqkFnXllVeGZlaa0O9z6lW0iVZz8HnZNCZ16pU2wjXvjquuuqrSBxJUGsFXddxQm5qaLrjgAjUzN9TSuietxryVa65VG3xhlcMIV4+ldaI97dlnn71161bN0KuMjCL4qpEbVXNz87nnnhuaXDnXOjzmVQpUqLlWZ/B5lSU5wi1WMvXOPPNMHZA8Z78FMorgq1JuWlu2bElmX2mcfTfeeKPnWYlG63lWVfCFlQ2ppwhzihXLG/+MM87Q7ghzRqYRfNVLXRU9btu27fzzzw/Nr5xrHTfccIMarXjOKXIWVE/waQW9SOVfzQip574e38RXGwi+qubWqyZ39tlnh0ZYmmT2hTmnpaqCzwuzc+fOWbNm6S284qXxBp86dSoj3BpD8FU7987U8M477zw1Qjfj0jovIfuSc05F9QRfyKZyRrh+vVNvypQpHuFyr3ItIfgywAnV3Nx8zjnnhAZZzrUO9/vCeLB8VRJ8XilxX6+0DnIy9cIIV/P0W6A2EHzZ4GSp2msd1RB8XoZk6hXb0QtC6nE1o1YRfJnhTse2bds85nXjLPNah2aoVl1+d6bbg0+r4GW46aabNFtvnDJHuO7rMcKtSQRflrhtq0FOmzYtNNHS+jXp9vu6N/j87koop55XrTT09SJB8GWMe2fKvuSYt7SuTci+5JxL043BF7IpeV6vtBOgnvb000936pXfEUbVIviyxw1SY95kv697r3V0V/B5sSU5wi1WuyNczdNvgZpE8GWSg0Ydk7Tu75s5c6bnWVr2dUvw+U2TqVfaqF+8AUNfr7SNgAwh+LLKXRL1+8r5PG9yzDtjxozknIvS9cGnhfSb3nzzzZqPV7+0Ib+nPe2005x6fDYjBgRfhrnla2h21llnhQZcWq8nZJ/nWWyXp4uDz2+3c+dOp54XvjTeaOEu5WJXHBlF8O2qdXUfLHN1r2XWo7IveW9zaR2fcvp9XRl8YR8lR7ildXW9ubJ7NSPTpdu94g0+FYoGNW3LxX9XJbX8u+p5UTXmTfb7yrnW4X5fUW3Jr+yC4AsLdsstt2hyr2yxaiD11Nttu3e0Cvp7UTsuWpEGX6iM7du3L1++/NVXX3355ZcXLVr0wQcf+GsmJUMtwauzefPm5HXe0jj7Zs2alZxzp/yySgef30WP4bxesX3bwJvotNNO00YLc86EsKg61C1btsylq8elS5eqmP1fGVqd7hJd8OmQKHqibt38+fMnTZrklhAcf/zxc+bMCfc06MWZKCPHtFK7nM/zJse8M2fOTM65Y95EFQ2+0JFJ62rG5MmTs3U1Q6vv0lXkPf744yeddFJunf5nwoQJTz31VHNzs16jV2boyN31ogs+V/knn3ziG0Gkf//+o0ePbmho0OPgwYP9x+OOO06HUL3SP6aVm7TaeTnVmKdOnapVKC0arFX2dboF/ILKBZ/mL2rJ5YxwzdNqhJutvp6W04m2YsWKE0880esyaNCgULoDBgzwHydOnLhy5Uq9MiuB3i3iCj4fA9esWXPkkUeqRA466KC6urrevXs7HfTYq1cvZZ/+niuhL2jkG6bKBC+quqvJ+/tK6xYVlX3+3woFX3jr5Ai3tJXyBgl9vcztWaWeV0El+sUvflHl6vXSo8pYf/Ev840fP3716tV6fVZivevFONS99NJLVRwd/4DZ2LFj9ahhr1tIhriFaMx75plnahXcTsq51uHs02w7aEWVCz7N2W+d1tWMLKaeqcd36qmnahX233//XWuVh/fatGnTwik/tBVR8LlxvvLKKyqLjkvHXEBz584N02aFl1ZDueR13tJ4I3R6rcN/Tz34PFs9htQrLcElpF7mrmaIl/aZZ57RKniPdMyvef7558O0aCW6Ht/ll1+umqivr89VSEc0cNDjKaec4nMl2Sqg0O9LjnnLudbh7NNGaLej5I2TbvCFPmayr+dFKly7fb0snvzSpvBhbNiwYbtWrEPDhw/X44UXXugJPQckxRJ83v3r168fP368amKPPfbIVUhHevfuPXDgQD358MMPNW3mRkZeZTX1M844Q2tRWnBYq+zznJP8lxSDz++ibX7rrbfqZV74YiVTL4t3rpgX+OOPP+7Xr59WpE+fPrvWrUN9+/bVY0NDw7p168IckBRX8K1cuVIFMWjQIIVarkI6omYzevRoPXnrrbfCHLLFYa3sK+f7+/x6Z99NN93kObfaGv5nWsEXZh76elqG0hbb5zQmTZrk1Mvc0Uu8NZYsWaIV0bYtpNuu19TV1enJsmXLwhyQFFfwqe+mavDlsFyFdEQtZ7/99tOTN954Q9Nmsc2IF1tj3uQ9Lqlf6/DzVIJPs/LM0+rrnXrqqdlNPfFi/+tf/9K6jBo1qpADgPbv3nvvrSfvvfdemAOSCL68QvC9/vrrmja71eN1V+NPZl9pnH0333xzcs7hSfnB5/noMaReaRktrVIvLGrmuPDc4ys2+N5///0wByQRfHnVTPCJF179vnI+z+sm1+p8nz9L4M1bZvBpIT2f2267Tf/lhSyknSf59Z5WI9zsXs0IvO9K6/ERfPkQfHnVUvCJt4CCYMqUKVqp0mLFkuf7NFvT83KCzzPRRg59vRKWLZl6NdDXM4KvEgi+vGos+MSroOxL3ttcbL749a2udXjOJQdfyKZk6pW2YDVwNaMVrwLBly6CLy9VWI0Fn3gtNOZN3uNS7JjXPK2zzwPeq6++Wn8pKvguvfRST64dVP4It/ZSTwi+SiD48qrJ4BNvik2bNiWzrzTu991yyy2e529+8xv9s6jgu/jii71IIfVKS2Fx6k2cOFGrFlazBhB8lUDw5VWrwSdel6ampnI+z+sWmLzWcd111+l5gcE3cuRIPV522WWaMK2+3i9/+Uv39Wrpi0kIvkog+PKq4eATbxDFxGmnnaZ1dHAUGzrmwLrzzjuvuOIKPXGT65TvsNVQVxPqybhx40p4d0/iBdAIt8b6ekbwVQLBl1dtB594jZR95Xx/n18fPvvsD0sVaLfddvMTDXvVVkt761Z9vVrdTQRfugi+vFRhtR184pXSmDd5j0uxY14bNmxYIVu1FW1kdf2KjTxpN/V8jaXGEHyVQPDlFUPwibeMBonJ7CuBNlchbbKV0qayWr2a0QrBVwkEX16qsBiCT9xRUr+v/M/zdgG3/Bq+mtEKwVcJBF9e8QSfePukcq2jorxIjmalXm339YzgqwSCL6+ogk+8gsq+8r+/r6IcyhMmTHDqRbJfCL50EXx5xRZ84nXUmPf000/XilfVmNcN3qnX2NhYw1czWiH4KoHgyyvC4BNvKHWmPOYt+VpHJYTUi2GEGxB8lUDw5RVn8Em41lH+53lTkezrhRFuDV/NaIXgqwSCL69og0+8shpOJn/PsJAmlzq/aVRXM1oh+CqB4Msr5uCTkH3lf39fmWK7mtEKwVcJBF9ekQefeJU15k3e49JlY1638Fbn9WK4mtEKwVcJBF9eBJ94u23cuLFbrnU49U4++WQtQFiY2BB8lUDw5UXwmVd8y5YtXXaPS7Kvd8opp0Tb1zOCrxIIvrwIvsDrvnnz5kmTJmmDOJIKaYElSKbehAkTYu7rGcFXCQRfXgRfkldfna/kmDf17Eumnka4cV7NaIXgqwSCLy+CrxVvAY15k/e4pDjmbTf1oh3hBgRfJRB8eRF8bXkjaPiZzL4UeYYnnXQSI9yA4KsEgi8vgq9d7oKp35fiPS709TpA8FUCwZcXwZePN4XiaeLEido+DqxCGmS7WqWe+3ps7YDgqwSCLy+CrwMh+yZPnqxNVOa1jjDC3bBhQ5g5jOCrBIIvL4KvY94gGvMm73EpaszrNhxSjxFuuwi+SiD48iL4OuWtqsFpMvuK0mqE6xkiieCrBIIvL4KvEOFah8e8Bfb7kn29E0880akXzzdNFYXgqwSCLy+Cr0DeMhqoNjY2anN1er4vmXqc1+sUwVcJBF9eBF/hQvb5/r4OvsvA7XbcuHF6POGEE0i9ThF8lUDw5UXwFcXbJ9zfd9BBB/Xt2ze3If8ftUn9l56EES5XMzpG8FUCwZcXwVcsbyLFmb/HZciQIWPHjh02bJg2uKgpjhkzxpv0+OOPp69XIIKvEgi+vAi+Engrbd269d577/VmbOuaa67hakbhCL5KIPjyIvhK400ty5cvv//++y+88MLGxsYJEyacd955s2fPfvfdd/2/4WXoGMFXCQRfXgRfybS1w5k7PVfPTv8MSactSeoVjuCrhFiCz/tefRBVQ4HBJw6+N954I8wBBVK0aYu12mht/4JOeYsRfOki+Dri4HvttdfCHIAu5sJbsmSJSnH06NEEXyriGuquWLFC1TBkyJDevXvnKqQTDr5XX31V03LXBbqFY2vx4sUqRQVfrjA7QfB1Kq7gW7lypaphwIABu+22W65COuHgW7BggaaletAtXHiLFi0KBdkpDWg0rNGTDz/8UNNyRrWtuIJv9erVqgZ194oKvkceeUTTEnzoFh5qzJ8/PxRkp1The+21l5589NFHmpbgayuu4Fu3bp0/TdWvX79chXSioaFBj7Nnz9a0BB+6hQvvr3/9ayjITvXp08dPPv74Y01L8LUVV/Bt3br1Jz/5iQpi8ODBroyO7bvvvnqcMWOGpiX40C1ceLfffrtKscBzfO7uHX744evXr9e0BF9bsQSfqQKmTJmimvCp3075RMnEiRP5jAG6i4JPo91p06apFAus26FDh+pxwoQJ1G0+cQWfXHnllaqJkSNH5iqkE3vuuaceDz300E8//VTTcuREF3PJbdq06dvf/rZKccCAAbnC7MTw4cP1eOGFF3omaCui4HMNzZ49WzVR4LmSHj16jBgxQk+WLFkS5gB0GZfc0qVLVYTqxxV4/6lHxHfccUeYA1qJKPh8ruQf//iHaqLA4BO/cu7cuWEOQJdxyfmSbuFFO2bMGD1StB2Irsf3zjvvqCY01C3kDnjxoFgD5DAHoMu45K677joV4T777JMryc75opw/aknRtiu64Fu7dm1Rd7T4ZYcccgin+dDFXGwbN2484ogjVIT9+/fPlWQnfC+LBsXcy9KB6C5u7Nixwxd26+rqcnXSOQ8xXnrpJU3OB9fQZTxK/ec//6nyK/BTujJkyBA9nnzyyc3NzZ4P2oor+FxJd999tyqjwFuixEOMq6++OswB6AI+ys6aNUvlN2rUqFwxds6vvPXWWzUt3b18Ygy+l19+WZVRePCF345YuXJlmAlQUS6ztWvXjh07VrVX4JkZ8QDlueeeCzNBW3EFnw+Aa9ascSeu3V/DaZeL6cEHH9TkjHbRBVxmjz32WCi/QoQPq/kgTY8vn+jO8ekYqGqYPn26isP36BXCnwE64ogj/GMR1BO6wObNm4866igV3qBBg3Jl2Llhw4bp8ZxzzlFuUqUdiDH49PjUU0+pPjyIKJDvjfr73/8eZgJUSLJKC+/uiat0zpw5YSZoV3TB58Ogv5hv9913L/D7qcSdvvHjx/t3ETmcokJcWlu2bPnOd76jkiu8u9e7d29/+wZfw9ep6IIvuPTSS1UihY92xYfT++67T5Pz8W9UiEvrgQceCCVXoDDOJfI6FWPweQjwwgsvqEqKGkf06tXLR9T33ntPc6C8kDoX1bJly1RmRY1IxMU8f/58zYFxbsfi7fFt3LixqG+8MPcQJ0+e7LtDyT6kSGklO3fuPPfcc1Vm9fX1uaIriD/Xceihh/7nP//RrKjMjkUafL5X4C9/+YtqpajRhIwbN06PYcBLhSEVKiQfTR966CEVWFFX3sRlfO+992oO3HHVqUiDzwOBVatWqVZ69OgR7n4qRM+ePf0hcH59DSlyIb355psqreHDhxc1yNWLffFtxYoVYVboQKTBp6Ors++OO+5QuRT4Gy6BPw45atSo5cuXaybq93luQAlUjdu3b9eT1atXH3LIISqtwj9Ibv4Y0qxZszQTSrEQ8Z7j8xDV97UU/rtrgT/7cdRRR61duzYULlACX8bdsGHDSSedpKLyeKJw4Zrb0qVLNR8XNjoWb/CJj43+zoKizvT5ezI8yYQJE3xnH0daFCuMPLZs2TJ16lSVU7Gn9sQXc2+//XbNhyIsUNTB52Ojumz777+/SqfA7zszZ5/L9IwzzvDPWTU3N1N5KJDKz1czlHrnnXeeCsnXzQr8+inzz8LIqlWrNCvKr0CxB59HGU888YRKx2VXuGT2/fSnP/X3PnJeGQVyqaxZs6axsVEl5O/HLSr1xEXr37x3MaMQUQefuNOnipk0aZIKqKgPckhyzDt+/Ph33nlHc9NRl/hDB1QerpAPPvjgW9/6loqnhBGu+NcmjzvuuK1bt2pudPcKF3vwibPPv8VRV1fXu3fvXFEVytkXvidSnUfPkCpEu1wYKpJ58+a5ZnxTQbF9Pb3ePwjDb2uUgODbxYdf38/s831FcckOHz7ct7lcddVVa9eu9ZxV5apIijJyLgAXg56sX7/evx8kRX08I8mFetddd2mGLmAUjuDbxeW4fft2X1kr/Gu+W+nbt6/PuXz1q199+umnXY565ORLzFRdKgAXg7LvhRdeOOyww1QkDQ0N4dJEsRyXP//5z5uamvwWubdCoQi+XVQ3HoCsWLHChVX4dwG1FW6HPvPMM19//fVwNA4HfEQi1JWfL1682Fdvpahvx2ilf//+HmQsW7ZMc1aqUlfFIvj+xzW6cOFCldTo0aOLvaXZXJF77bVXuDFw+vTpir9wh7PeRVEY2gNqjMMuuYv1/M0337zssstcD4q8gQMH6kmxJ/WsZ8+eLq1nnnnGM9cjwVcsgu9/VD2Op/vvv1+FdeCBB+YqrXTDhg0Ld+E3NjbOnTt39erVychzI9Fj0PIfyIiW3ZbjXdnyHzlr1qx56qmnTj/9dNeAimH48OF+XrIDDjhAj/4yAvp6JSP4/kc1FA7U119/fSiy0o7MpuPzyJEjw0lDjaB15Fdj+PDDD30LAmpMc3Pz8uXL58+ff8UVV4T9rsirr69XMfifJfO9fpqzCtXl2vKuKBLB15oPoer6XXTRRSoyZ1+ZFJ1Dhw5tdVrn2GOPVbw+9NBDixYteu+991atWrVhw4ampia1nG3btukRVcs7SIeujRs3asdp97366qsPP/zwjBkzfvazn7Xs4Bzt9Lq6unKOnYFTb9q0aXpfVakLFaUh+Nqh1FNVbdq0acqUKaHgUtG3b191ANUY2l486dOnz+GHH/7d73736KOPPgZVT7vpe9/73je+8Y22V2YHDBgwZswY7ejdd9+95U9l890Cv/jFLz799FOVKH29MhF87VDqubDWr1/vEzSp9PuS/Lsw++yzj0JQAyLfiYqMGjFihHaiwk5DWu3WYu+B75QPvUq9devWqSyTp4lRGoIvL5+rVr9PgwuVXerZl6ShkDqD/fv3V2dBnUFkgnaWdpl2XPkn7zrgwmtsbPR3ypN6qSD4OuJ+X1NT0+WXX67i03Bjjz32yFUjUHGKVH88Y/r06Vu2bFEpNue+zQXlI/g64VPIO3bs+MMf/qASHDJkiO9ISOV0NdCWS2vvvff2z0XedNNNzjuuZqSI4Ouc+n3+zNmTTz6Zq8yif58IKEq4AWDu3Lk+4+zBB9JC8BVExefj7ZIlS/z79mPHjvX3fdP1QypcSAMGDPAF3MMPP/zNN98M5ecnSAvBVygVn/t9GzZs8O3Novir6IltRCWMJK666ipfyqCjVyEEXxE+S3zD6MKFC7/2ta+pRkfmuF6B0gwfPtyfbtxvv/0WLFjgGvN9BX6OdBF8RQu1uHbt2ttuu82Fq2O1vw4XKMrQoUPD1y/PnDlzzZo1ri4ir6IIvhKFrt+SJUvOPfdcF64O1zp0c9YPnVKRDBs2LHyD2dSpUxcvXuyK4k69LkDwlU4F6hrV4yuvvDJ58mQXcX19/ejRo7njD+3q16/fqFGj/LvM0tjY+OKLL/o4ql4eHb2uQfCVK8Rfc3Oz4u/88893QUtDQ8OIESP69u3b8m9ETGWgYgj3qci0adMWLlzoe/RUQlzH6EoEX7l0iHbV+lit5+++++5tt932la98paXAc0NgHeQHDRrUq1evlj+h1mkwq92tnb7vvvsm827//fe/+eablyxZEnp5u46cXMfoWgRfmpK1++mnnz733HO//vWvk78m4y+n8qlANQl/zJNzgjVAO1H69OkzcOBAn7zTjq6rq2v57y98YfDgwZdccsn8+fP9RQNG2HUXgi99Poa3/OPzzz/55JMXXnhBB/ljjjmmpREkKAHVGVQ7GZPjWByNqudoC3tNO7Hd61pHH330zJkzdQj8+OOPw2BWFULkdS+Cr1Icf8n63rZt27JlyxYsWHD33XdffPHFP/7xjxn51p4f/vCHF1xwwV133fXss88uXbpUO71l97dXEuguBF/FtVvuOvhv3bp11apVH3zwwcsvv/zkk08++uijf/vb3/785z8rFu+8884/ooppB91zzz2zZ8/WLpszZ84TTzzx0ksvvf/++ytWrNi8eXOrfU3eVSGCr0upAUi4EoKa5KSzlj+hyhB83UktxFpaSa5fgAxpu9dadi2qG8EHIDoEH4DoEHwAokPwAYgOwQcgOgQfgOgQfACiQ/ABiA7BByA6BB+A6BB8AKJD8AGIDsEHIDoEH4DoEHwAokPwAYgOwQcgOgQfgOgQfACiQ/ABiA7BByA6BB+A6BB8AKJD8AGIDsEHIDoEH4DoEHwAokPwAYgOwQcgOgQfgOgQfACiQ/ABiA7BByA6BB+A6BB8AKJD8AGIDsEHIDoEH4DoEHwAokPwAYgOwQcgOgQfgOgQfACiQ/ABiA7BByA6BB+A6BB8AKJD8AGIDsEHIDoEH4DoEHwAokPwAYgOwQcgOgQfgOgQfACiQ/ABiA7BByA6BB+A6BB8AKJD8AGIDsEHIDoEH4DoEHwAokPwAYgOwQcgOgQfgOgQfACiQ/ABiA7BByA6BB+A6BB8AKJD8AGIDsEHIDoEH4DoEHwAokPwAYgOwQcgOgQfgOgQfAAi8/nn/we+xDtIllf0KgAAAABJRU5ErkJggg==
// @match         https://voz.vn/t/*
// @match         https://forum.gocmod.com/threads/*
// @match         https://www.otofun.net/threads/*
// @match         https://vn-z.vn/threads/*
// @match         https://*xamvn*.*/threads/*
// @match         https://*xamvn*.*/r/*
// @match         https://*rphang*.*/t/*
// @match         https://*thiendia*.*/threads/*
// @grant         GM_xmlhttpRequest
// @version       1.2
// @author        kylyte
// @license       GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/539190/Save%20Vietnamese%20xenforo%20forum%20content%20to%20HTML%20file.user.js
// @updateURL https://update.greasyfork.org/scripts/539190/Save%20Vietnamese%20xenforo%20forum%20content%20to%20HTML%20file.meta.js
// ==/UserScript==

// Configuration options
const config = {
  waitTime: 100, // Base wait time between requests in ms
  saveWithImages: true, // Set to false if you don't want to save images
  concurrentRequests: 15, // How many pages to fetch simultaneously (lower values = more stable but slower)
  chunkSize: 15, // Process the thread in chunks to avoid memory issues
  showDebugInfo: true, // Show additional console information for debugging
  maxChunkSizeForHtml: 10000 * 1024
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const log = (...args) => config.showDebugInfo && console.log('[Voz Saver]', ...args);

async function createHash(message) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await window.crypto.subtle.digest("SHA-1", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function xhr(url, detail = {}) {
  const nurl = new URL(url);
  let options = { url: url, origin: nurl.origin };

  if (typeof detail === 'string' && /^(?:blob|text|json|arraybuffer|document)$/.test(detail)) {
    options.responseType = detail;
  } else if (typeof detail === 'object') {
    options = { ...options, ...detail };
  }

  return new Promise(resolve => {
    options.onloadend = res => (res.status === 200) ? resolve(res.response) : resolve(false);
    options.onerror = () => resolve(false);
    options.ontimeout = () => resolve(false);
    GM_xmlhttpRequest(options);
  });
}

function toDataURL(data) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(new Blob([data]));
  });
}

async function compressData(data) {
  const blob = new Blob([data]);
  const compressedStream = blob.stream().pipeThrough(new CompressionStream("gzip"));
  return await new Response(compressedStream).blob();
}

async function extractStyles(doc) {
  const links = doc.querySelectorAll('link[rel="stylesheet"]');
  const styles = [];

  for (let i = 0; i < links.length; i++) {
    try {
      const href = links[i].href;
      if (!href) continue;

      const css = await xhr(href, 'text');
      if (css) {
        styles.push(css);
      }
    } catch (err) {
      log('Failed to process stylesheet:', links[i].href, err);
    }
  }

  doc.querySelectorAll('style').forEach(style => {
    styles.push(style.textContent);
  });

  return styles.join('\n');
}

async function processContent(htmlStr, isFirstPage = false, images = {}, cssStyles = null) {
  const parser = new DOMParser();
  let html = parser.parseFromString(htmlStr, 'text/html');

  html.querySelector('.blockMessage--none')?.remove();
  html.querySelectorAll('form').forEach(el => el?.remove());
  html.querySelectorAll('div.block').forEach(el => {
    if (el.matches('.block--messages')) return;
    el.remove();
  });
  html.querySelectorAll('div.p-body-main.p-body-main--withSidebar>*').forEach(el => {
    if (el.matches('.p-body-content')) return;
    el.remove();
  });
  html.querySelector('footer.p-footer')?.remove();

  html.querySelectorAll('[href]').forEach(el => {
    let href = el.getAttribute('href');
    if (href && href.startsWith('/')) el.setAttribute('href', location.origin + href);
  });

  html.querySelectorAll('[src]').forEach(el => {
    let src = el.getAttribute('src');
    if (src && src.startsWith('data:image')) el.setAttribute('src', el.getAttribute('data-src') || src);
    if (src && src.startsWith('/')) el.setAttribute('src', location.origin + src);
  });

  html.querySelectorAll('[srcset]').forEach(el => {
    let srcset = el.getAttribute('srcset');
    if (srcset) {
      srcset = srcset.split(',').map(a => a.trim().startsWith('/') ? location.origin + a.trim() : a).join(',');
      el.setAttribute('srcset', srcset);
    }
  });

  html.querySelectorAll('div.bbCodeBlock-content>div.bbCodeBlock-expandContent.js-expandContent').forEach(el => el.className = '');
  html.querySelectorAll('.bbCodeSpoiler-button,.bbCodeSpoiler-content').forEach(el => el.classList.add('is-active'));

  html.querySelectorAll('div.pageNav a').forEach(el => el.removeAttribute('href'));

  if (config.saveWithImages) {
    const imgElements = html.querySelectorAll('img');
    const imgPromises = [];

    for (let i = 0; i < imgElements.length; i++) {
      const img = imgElements[i];
      if (!img.src || img.src.startsWith('data:image')) continue;

      imgPromises.push((async () => {
        try {
          const key = await createHash(img.src);
          if (images[key]) {
            img.setAttribute('image-data', key);
            return;
          }

          const imgBlob = await xhr(img.src, 'blob');
          if (!imgBlob) return;

          const dataUrl = await toDataURL(imgBlob);
          images[key] = dataUrl;
          img.setAttribute('image-data', key);
        } catch (err) {
          log('Failed to process image:', img.src, err);
        }
      })());

      if (imgPromises.length >= 5) {
        await Promise.all(imgPromises);
        imgPromises.length = 0;
        await sleep(100);
      }
    }

    if (imgPromises.length > 0) {
      await Promise.all(imgPromises);
    }
  }

  let extractedCss = null;
  if (isFirstPage && !cssStyles) {
    extractedCss = await extractStyles(html);

    html.querySelectorAll('link[rel="stylesheet"]').forEach(el => el.remove());

    const styleEl = html.createElement('style');
    styleEl.textContent = extractedCss;
    html.head.appendChild(styleEl);
  } else if (isFirstPage && cssStyles) {

    html.querySelectorAll('link[rel="stylesheet"]').forEach(el => el.remove());

    const styleEl = html.createElement('style');
    styleEl.textContent = cssStyles;
    html.head.appendChild(styleEl);
  }

  const threadBody = html.querySelector('div.p-body-main');
  if (!threadBody) {
    throw new Error('Could not find thread body content');
  }

  const compressedBody = await compressData(threadBody.outerHTML);
  const threadBodyUrl = await toDataURL(compressedBody);

  let wrapperUrl = '';
  if (isFirstPage) {
    threadBody.outerHTML = `{ThreadBody_PLACEHOLDER}`;
    const serialized = new XMLSerializer().serializeToString(html);
    const compressed = await compressData(serialized);
    wrapperUrl = await toDataURL(compressed);
  }

  return { wrapperUrl, threadBodyUrl, extractedCss };
}

async function saveThread(threadId,threadInPath) {

  const maxPageEl = document.querySelector("ul.pageNav-main>li:last-of-type>a");
  const maxPage = maxPageEl ? parseInt(maxPageEl.textContent) : 1;

  let pageRange = prompt(
  "Nhập thông số để tải xuống. Ví dụ:\n" +
  "Nhập 1-50 sẽ tải từ trang 1 tới trang 50\n" +
  "Nhập 5 sẽ tải chỉ trang 5\n" +
  "Bỏ trống sẽ tải tất cả các trang"
  );
  let startPage = 1;
  let endPage = maxPage;

  if (pageRange) {
    if (pageRange.includes('-')) {
      const [start, end] = pageRange.split('-').map(p => parseInt(p.trim()));
      if (!isNaN(start) && !isNaN(end) && start >= 1 && end <= maxPage) {
        startPage = start;
        endPage = end;
      } else {
        alert(`Invalid range. Using full range (1-${maxPage}).`);
      }
    } else {
      const page = parseInt(pageRange.trim());
      if (!isNaN(page) && page >= 1 && page <= maxPage) {
        startPage = page;
        endPage = page;
      } else {
        alert(`Invalid page number. Using full range (1-${maxPage}).`);
      }
    }
  }

  document.body.insertAdjacentHTML("beforeend",
    `<div id="voz_saver_progress" style="position:fixed; bottom:0; left:0; right:0; background:rgba(0,0,0,0.8); color:white; padding:10px; z-index:9999; display:flex; flex-direction:column;">
      <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
        <span>Saving thread (0/${endPage - startPage + 1} pages)</span>
        <button id="voz_saver_cancel" style="background:#ff4444; border:none; color:white; padding:2px 8px; cursor:pointer;">Cancel</button>
      </div>
      <progress id="voz_saver_progress_bar" value="0" max="${endPage - startPage + 1}" style="width:100%; height:20px;"></progress>
      <div id="voz_saver_status" style="margin-top:5px; font-size:12px;">Initializing...</div>
    </div>`
  );

  const progressBar = document.getElementById('voz_saver_progress_bar');
  const progressText = document.querySelector('#voz_saver_progress span');
  const statusText = document.getElementById('voz_saver_status');
  const cancelButton = document.getElementById('voz_saver_cancel');

  let cancelled = false;
  cancelButton.addEventListener('click', () => {
    cancelled = true;
    statusText.textContent = 'Cancelling...';
  });

  const images = {};
  const pages = [];
  let pageCount = 0;
  let cssStyles = null;

  const updateProgress = () => {
    progressBar.value = pageCount;
    progressText.textContent = `Saving thread (${pageCount}/${endPage - startPage + 1} pages)`;
  };

  async function fetchPage(pageNo, retries = 3) {
    if (cancelled) return false;

    try {
      statusText.textContent = `Fetching page ${pageNo}...`;
      const pageUrl = `${location.origin}/${threadInPath}/${threadId}/page-${pageNo}`;

      const response = await fetch(pageUrl);
      if (response.status !== 200) {
        if (retries > 0) {
          statusText.textContent = `Error fetching page ${pageNo}, retrying (${retries} left)...`;
          await sleep(1000);
          return fetchPage(pageNo, retries - 1);
        }
        throw new Error(`Failed to fetch page ${pageNo} (status: ${response.status})`);
      }

      const html = await response.text();
      statusText.textContent = `Processing page ${pageNo}...`;

      const { wrapperUrl, threadBodyUrl, extractedCss } = await processContent(html, pageNo === startPage, images, cssStyles);

      if (pageNo === startPage && extractedCss) {
        cssStyles = extractedCss;
      }

      if (pageNo === startPage) {
        pages[0] = wrapperUrl;
      }
      pages[pageNo] = threadBodyUrl;

      pageCount++;
      updateProgress();
      return true;
    } catch (err) {
      if (retries > 0) {
        statusText.textContent = `Error processing page ${pageNo}, retrying (${retries} left)...`;
        await sleep(1000);
        return fetchPage(pageNo, retries - 1);
      }
      log(`Error processing page ${pageNo}:`, err);
      statusText.textContent = `Failed to process page ${pageNo}: ${err.message}`;
      return false;
    }
  }

  const chunks = [];
  for (let i = startPage; i <= endPage; i += config.chunkSize) {
    chunks.push(Array.from({ length: Math.min(config.chunkSize, endPage - i + 1) }, (_, j) => i + j));
  }

  for (let i = 0; i < chunks.length; i++) {
    if (cancelled) break;

    statusText.textContent = `Processing chunk ${i+1}/${chunks.length}...`;

    for (let j = 0; j < chunks[i].length; j += config.concurrentRequests) {
      if (cancelled) break;

      const batch = chunks[i].slice(j, j + config.concurrentRequests);
      const promises = batch.map(pageNo => fetchPage(pageNo));

      await Promise.all(promises);
      await sleep(config.waitTime);
    }

    if (i < chunks.length - 1) {
      statusText.textContent = `Chunk ${i+1} complete. Taking a short break...`;
      await sleep(1000);
    }
  }

  if (cancelled) {
    document.getElementById('voz_saver_progress').remove();
    return null;
  }

  statusText.textContent = 'Building final HTML file...';

  const title = document.querySelector('title')?.textContent
    .split('-').pop()?.split('|')[0].trim() || 'vozThread';

  const fileName = `${title}_${new Date().toISOString().slice(0, 10)}.html`;

  await generateHtmlFile(fileName, threadId, pages, images, cssStyles, maxPage, startPage, endPage);

  document.getElementById('voz_saver_progress').remove();
  return true;
}

async function generateHtmlFile(fileName, threadId, pages, images, cssStyles, maxPage, startPage, endPage) {
  let blobParts = [];

  blobParts.push(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fileName}</title>
  <style>
    /* Custom navigation controls */
    body, html { margin: 0; padding: 0; }
    #loading {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.8); color: white; display: flex;
      flex-direction: column; justify-content: center; align-items: center;
      z-index: 9999;
    }
    .navigation-controls {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #f0f0f0;
      padding: 10px;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      z-index: 1000;
      display: flex;
      gap: 10px;
    }
    .nav-button {
      background: #4a86e8;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 3px;
      cursor: pointer;
    }
    .nav-button:hover {
      background: #2a66c8;
    }
    .nav-button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    /* Thread CSS */
    ${cssStyles || ''}
  </style>
</head>
<body>
  <div id="loading">
    <h2>Loading Thread...</h2>
    <progress id="loading-progress" value="0" max="100" style="width:80%; max-width:400px"></progress>
    <div id="loading-text">Initializing...</div>
  </div>
  <div id="screen"></div>
  <div class="navigation-controls">
    <button id="prev-page-btn" class="nav-button" disabled>Previous</button>
    <span id="page-display">Page ${startPage}</span>
    <button id="next-page-btn" class="nav-button">Next</button>
    <button id="goto-page-btn" class="nav-button">Go to Page</button>
  </div>

  <script>
  // Thread data
  const threadId = "${threadId}";
  const threadBodyReplacement = "{ThreadBody_PLACEHOLDER}";
  const maxPage = ${maxPage};
  const startPage = ${startPage};
  const endPage = ${endPage};
  let currentPage = ${startPage};

  const pages = {};
  const images = {};
`);

  blobParts.push(`
  pages[0] = "${pages[0]}";
`);

  for (let i = startPage; i <= endPage; i++) {
    if (pages[i]) {
      const pageChunk = `
  // Add page ${i}
  pages[${i}] = "${pages[i]}";
`;
      blobParts.push(pageChunk);

      if (i % 50 === 0) {
        await sleep(0);
      }
    }
  }

  const imageKeys = Object.keys(images);
  for (let i = 0; i < imageKeys.length; i += 10) {
    const chunk = imageKeys.slice(i, i + 10);
    let imageChunk = `
  // Images chunk ${Math.floor(i/10) + 1}
`;

    for (const key of chunk) {
      imageChunk += `  images["${key}"] = "${images[key]}";\n`;
    }

    blobParts.push(imageChunk);

    if (i % 100 === 99) {
      await sleep(0);
    }
  }

  blobParts.push(`
  async function decompressData(data) {
    const response = await fetch(data);
    const blob = await response.blob();
    const decompressedStream = blob.stream().pipeThrough(new DecompressionStream("gzip"));
    return await new Response(decompressedStream).blob();
  }

  async function blobToText(blob) {
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsText(blob);
    });
  }

  function updateNavButtons() {
    prevBtn.disabled = currentPage <= startPage;
    nextBtn.disabled = currentPage >= endPage;
    pageDisplay.textContent = \`Page \${currentPage}\`;
  }

  const screen = document.getElementById('screen');
  const loading = document.getElementById('loading');
  const loadingProgress = document.getElementById('loading-progress');
  const loadingText = document.getElementById('loading-text');
  const prevBtn = document.getElementById('prev-page-btn');
  const nextBtn = document.getElementById('next-page-btn');
  const gotoBtn = document.getElementById('goto-page-btn');
  const pageDisplay = document.getElementById('page-display');

  prevBtn.addEventListener('click', () => {
    if (currentPage > startPage) {
      showPage(currentPage - 1);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentPage < endPage) {
      showPage(currentPage + 1);
    }
  });

  gotoBtn.addEventListener('click', () => {
    const pageNo = prompt(\`Enter page number (\${startPage}-\${endPage})\`, currentPage);
    if (pageNo && !isNaN(pageNo)) {
      const page = parseInt(pageNo);
      if (page >= startPage && page <= endPage) {
        showPage(page);
      } else {
        alert(\`Please enter a number between \${startPage} and \${endPage}\`);
      }
    }
  });

  let threadWrapper;
  async function showPage(pageId = startPage) {
    try {
      loading.style.display = 'flex';
      loadingText.textContent = \`Loading page \${pageId}...\`;

      const decompressedBody = await decompressData(pages[pageId]);
      const threadBody = await blobToText(decompressedBody);

      const pageContent = threadWrapper.replace(threadBodyReplacement, threadBody);
      screen.innerHTML = pageContent;

      const imgs = screen.querySelectorAll('img[image-data]');
      if (imgs.length > 0) {
        loadingProgress.max = imgs.length;
        loadingProgress.value = 0;
        let loadedImages = 0;
        for (const img of imgs) {
          const key = img.getAttribute('image-data');
          if (key && images[key]) {
            img.src = images[key];
          }
          loadedImages++;
          loadingProgress.value = loadedImages;
          loadingText.textContent = \`Loading images (\${loadedImages}/\${imgs.length})...\`;
          if (loadedImages % 10 === 0) {
            await new Promise(r => setTimeout(r, 0));
          }
        }
      }

      setupPageNavigation();

      currentPage = pageId;
      updateNavButtons();

      window.scrollTo(0, 0);

      loading.style.display = 'none';
    } catch (error) {
      console.error('Error showing page:', error);
      loadingText.textContent = \`Error loading page \${pageId}: \${error.message}\`;
    }
  }

  function setupPageNavigation() {
    screen.querySelectorAll('ul.pageNav-main a:not([id])').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        const pageNum = parseInt(e.target.textContent.trim());
        if (!isNaN(pageNum) && pageNum >= startPage && pageNum <= endPage) {
          showPage(pageNum);
        }
      });
    });

    screen.querySelectorAll('ul.pageNav-main a[title="Go to page"]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        const pageNo = prompt(\`Enter page number (\${startPage}-\${endPage})\`, currentPage);
        if (pageNo && !isNaN(pageNo)) {
          const page = parseInt(pageNo);
          if (page >= startPage && page <= endPage) {
            showPage(page);
          }
        }
      });
    });

    screen.querySelectorAll('.pageNav-jump.pageNav-jump--next').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        if (currentPage < endPage) {
          showPage(currentPage + 1);
        }
      });
    });

    screen.querySelectorAll('.pageNav-jump.pageNav-jump--prev').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        if (currentPage > startPage) {
          showPage(currentPage - 1);
        }
      });
    });
  }

  (async function init() {
    try {
      loadingText.textContent = 'Preparing thread template...';
      const decompressedWrapper = await decompressData(pages[0]);
      threadWrapper = await blobToText(decompressedWrapper);

      await showPage(startPage);
    } catch (error) {
      console.error('Initialization error:', error);
      loadingText.textContent = \`Error initializing: \${error.message}\`;
    }
  })();
  </script>
</body>
</html>
`);

  const blob = new Blob(blobParts, { type: 'text/html' });
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = fileName;
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  setTimeout(() => URL.revokeObjectURL(downloadLink.href), 1000);
}

(async function main() {
  const domain = window.location.hostname;
  const threadName = ['t', 'r', 'threads'];
  const threadRegx = threadName.join('|');
  const reg = new RegExp(`https:\/\/(?:.*\\.)?${domain.replaceAll('.', '\\.')}\/(${threadRegx})\/(?:[^\/]+\\.)?(\\d+)\/?(?:page-(\\d+))?`);
  console.log(reg);
  const match = location.href.match(reg);

  const threadInPath=match[1];
  const threadId = match[2];
  const createSaveButton = () => {
      const btn = document.createElement("a");
      btn.classList.add("pageNav-jump", "pageNav-jump--next");
      btn.textContent = "Lưu Thread";
      btn.style.cursor = "pointer";
      btn.style.marginTop = "5px";
      btn.addEventListener("click", async () => {
          await saveThread(threadId,threadInPath);
      });
      return btn;
  };
  document.querySelectorAll(".p-description").forEach(desc => {
      const ul = desc.querySelector("ul.listInline");
      if (ul) {
          const btn = createSaveButton();
          ul.after(btn);
      }
  });
})();