// ==UserScript==
// @name         自动选择，选择题和判断答案
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  HX专供
// @author       慕阳
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520825/%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%EF%BC%8C%E9%80%89%E6%8B%A9%E9%A2%98%E5%92%8C%E5%88%A4%E6%96%AD%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/520825/%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%EF%BC%8C%E9%80%89%E6%8B%A9%E9%A2%98%E5%92%8C%E5%88%A4%E6%96%AD%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const Jianda = {
        '40. 友元函数的作用，声明、定义和调用注意事项': "友元函数不是类的成员函数，可以访问类的私有数据成员; 友元函数声明在类中，定义在类外且不需要加类名，调用按照普通函数进行即可不需要对象名。",
        '41. 什么是对象？什么是面向对象方法？这种方法有哪些特点？': "1. 对象是现实世界中一个实际存在的事物，是构成世界的一个独立单位，它具有自己的静态特征和动态特征。\n" +
            "2. 面向对象的方法将数据及对数据的操作方法放在一起，作为一个相互依存、不可分离的整体——对象。对同类型对象抽象出其共性，形成类。类通过一个简单的外部接口与外界发生关系，对象与对象之间通过消息进行通讯。通过实现继承与多态性，可以大大提高程序的可重用性，使得软件的开发和维护更为方便。\n" +
            "3. 面向对象方法的基本原则是直接面对客观存在的事物进行软件开发，将人们在日常生活中习惯的思维方式和表达方式应用于软件开发，使软件开发回归到客观世界。",
        '42. 声明一个时钟类，并定义时、分、秒三个数据成员及相应的成员函数': `#include <iostream>
using namespace std;

class Clock {
public:
    void SetTime(int NewH, int NewM, int NewS);
    void ShowTime();

private:
    int Hour, Minute, Second;
};

void Clock::SetTime(int NewH, int NewM, int NewS) {
    Hour = NewH;
    Minute = NewM;
    Second = NewS;
}

void Clock::ShowTime() {
    cout << Hour << ":" << Minute << ":" << Second;
}

int main() {
    Clock c;
    c.SetTime(8, 30, 30);
    c.ShowTime();
    return 0;
}`,
        '43. 定义Shape类及其派生类Rectangle和Circle，并派生Square类': `#include <iostream>
using namespace std;
#define PI 3.14

class Shape {
public:
    virtual float GetArea() { return -1; }
};

class Circle : public Shape {
public:
    Circle(float radius) : itsRadius(radius) {}
    float GetArea() { return PI * itsRadius * itsRadius; }

private:
    float itsRadius;
};

class Rectangle : public Shape {
public:
    Rectangle(float len, float width) : itsLength(len), itsWidth(width) {}
    float GetArea() { return itsLength * itsWidth; }

private:
    float itsWidth;
    float itsLength;
};

int main() {
    Circle c(5.0);
    cout << "The area of the Circle is " << c.GetArea() << endl;

    Rectangle r(4, 6);
    cout << "The area of the Rectangle is " << r.GetArea() << endl;
    return 0;
}`,
        '44. 声明一个点类，具有横纵坐标，并实现相应函数': `#include<iostream>
using namespace std;

class Point {
public:
    void SET(int xx = 0, int yy = 0) {
        X = xx;
        Y = yy;
    }

    int GetX() { return X; }
    int GetY() { return Y; }

private:
    int X, Y;
};

int main() {
    Point myp1;
    myp1.SET(1, 2);
    cout << myp1.GetX() << endl;
    cout << myp1.GetY() << endl;
    return 0;
}`,
        '45. 定义Mammal类和Dog类，设置体重和年龄并输出': `#include<iostream>
using namespace std;

class Mammal {
public:
    int GetAge() const { return itsAge; }
    void SetAge(int age) { itsAge = age; }

protected:
    int itsAge;
};

class Dog : public Mammal {
public:
    int GetWeight() const { return itsWeight; }
    void SetWeight(int weight) { itsWeight = weight; }

private:
    int itsWeight;
};

int main() {
    Dog Jack;
    Jack.SetWeight(5);
    Jack.SetAge(10);
    cout << "Jack is " << Jack.GetAge() << " years old.\n";
    cout << "Jack is " << Jack.GetWeight() << " kg.\n";
    return 0;}`
    };

    const Tiankong = {
        '继承的三种方式public、protected和private，默认的继承方式是': 'private',
        '程序运行结果': [
            "X::X() constructor executing",
            "Y::Y() constructor executing",
            "Z::Z() constructor executing",
            "Z::~Z() destructor executing",
            "Y::~Y() destructor executing",
            "X::~X() destructor executing"
        ],
        '程序运行结果': [
            "--- MAIN函数---",
            "i: 0 a: 0 b: -2 c: 1",
            "--- f函数---",
            "i: 10 a: 4 b: 0 c: 26"
        ],
        '单一继承的派生类中含有对象成员，析构函数调用顺序': [
            '派生类',
            '对象成员所属类',
            '基类'
        ],
        'C++语言特有的引用是': '别名',
        '动态联编通过': ['继承', '虚函数'],
        '默认形参值声明顺序': [
            '右', '左', '右', '左', '右'
        ],
        '填空程序的正确语句': [
            'X=n;',
            'return X;',
            'test.init(10);'
        ],
        '程序运行结果': [
            'd.A::n=10,d.B::n=10,d.C::n=10,d.D::n=10',
            'd.A::n=20,d.B::n=20,d.C::n=20,d.D::n=20',
            'd.A::n=30,d.B::n=30,d.C::n=30,d.D::n=30',
            'd.A::n=40,d.B::n=40,d.C::n=40,d.D::n=40'
        ]
    };


    // 题目和答案的映射（这里的答案是选项的文本，如 "连接符" 对应 "A"）
    const questionKeywordsToAnswers = {
        '封装是面向对象方法的一个重要原则，就是把对象的属性和服务结合成一个独立的系统单位，并不隐蔽对象的内部细节': '错',
        '在程序运行过程中，其值始终不可改变的量称为变量': '对',
        '全局变量，就是具有文件作用域的变量': '对',
        '在C++中，将数据从一个对象到另一个对象的流动抽象为“流”': '对',
        '函数可以作为表达式调用，但不可以作为语句调用': '错',
        '不可以自定义命名空间': '错',
        '可以自定义一个运算符进行重载': '错',
        '某函数与基类的虚函数有相同参数个数及对应的相同参数类型，则该函数就是虚函数': '对',
        '多态是面向对象程序设计的一种特性，可以使程序简洁。': '对',
        '使用类模板可以使类中的某些函数成员的参数、返回值或局部变量能取任意类型': '对',
        '友元函数的作用，友元函数声明、定义和调用应该注意什么？': '友元函数不是类的成员函数，可以访问类的私有数据成员。友元函数声明在类中，定义在类外且不需要加类名，调用按照普通函数进行即可不需要对象名。',
        '下列关于对象的描述中，错误的是': 'C',
        '下列带缺省值参数的函数说明中，正确的说明是': 'A',
        '执行这个程序段输出字符 * 的个数是': 'B',
        '以下关于类的访问属性不正确的是': 'D',
        '类的静态成员初始化的位置': 'B',
        '有以下 4 条语句: static int hot = 200; int &rad = hot; hot = hot + 100; cout << rad << endl; 执行后输出为': 'D',
        '在多继承时，基类与基类之间出现同名成员时，通过派生类对象访问时出现的二义性可以通过': 'B',
        '下列符号不能组成标识符的是': '连接符',
        '复制构造函数的作用是': 'A',
        '以下不是虚函数正确的描述': 'B',
        '以下关于抽象类描述正确的是': 'B',
        '下列正确的类定义或原型声明是': 'B',
        '已知类A中的一个成员函数的说明如下： void Set(A &a); 则该函数的参数“A &a”的含义是': 'C',
        '下面对结构或类中成员的访问中,不正确的访问是': 'A',
        '下面有关基类与公有派生类的赋值兼容原则，正确的是': 'D',
        '下列关于运算符重载的描述中，正确的是': 'D',
        '静态多态性可以使用获得': 'B',
        '假设定义如下函数模板。template <class T> T max(T x,T y) { return (x>y)?x:y; } 并有定义“int i;char c; ”,则错误的调用语句是': 'D',
        '类模板的模板参数': 'D',
        '当用ifstream流类对象打开文件时，其默认打开方式是': 'B'
    };

    // 查找并自动选择答案的函数
    function findAndSelectAnswers() {
        // 获取所有题目元素（更新后的选择器）
        const questionElements = document.querySelectorAll('.testpaper-question.testpaper-question-choice.js-testpaper-question');
        questionElements.forEach((element, index) => {
            // 获取题目文本并去除空白字符
            const questionText = element.querySelector('.testpaper-question-stem.js-testpaper-question-stem').textContent.trim();
            // 清理题目文本，移除特殊字符，如括号
            const cleanedQuestionText = questionText.replace(/[\(\)（）。]/g, '').trim();
            console.log(`题号 ${index + 1}: ${cleanedQuestionText}`); // 调试输出，确保能准确获取题目文本
            const answer = questionKeywordsToAnswers[cleanedQuestionText]; // 查找对应答案

            if (answer) {
                console.log(`答案: ${answer}`);
                // 获取题目中的选项列表（它们包含在 <li> 标签中）
                const options = element.querySelectorAll('.testpaper-question-body-item.testpaper-question-choice-item');
                console.log(`共找到 ${options.length} 个选项`); // 输出找到的选项数量

                let selectedOption = null;
                // 遍历选项，找出匹配的选项
                options.forEach(option => {
                    const optionText = option.textContent.trim().replace(/[\(\)（）。]/g, ''); // 清理选项文本
                    console.log(`选项文本: ${optionText}`); // 输出选项文本，帮助调试

                    // 判断选项文本是否包含在题目答案中
                    if (optionText.includes(answer)) {
                        selectedOption = option;
                        console.log(`匹配选项: ${optionText}`);
                    }
                });

                // 如果找到了匹配的选项，选中它
                if (selectedOption) {
                    const optionText = selectedOption.querySelector('.testpaper-question-body-item__index').textContent.trim();
                    console.log(`匹配的选项: ${optionText}`); // 输出匹配的选项
                    const footerElement = element.querySelector('.testpaper-question-footer.clearfix'); // 获取选项区域
                    const labels = footerElement.querySelectorAll('label.radio-inline'); // 获取所有label元素
                    // 遍历label元素，找到与匹配选项相对应的label
                    labels.forEach(label => {
                        const labelText = label.textContent.trim(); // 获取label文本
                        console.log(`labelText: "${labelText}"`);
                        console.log(`optionText: "${optionText}"`);

                        // 清理并统一文本：去除空格和句号，统一小写
                        const cleanedOptionText = optionText.replace(/[\s.]+/g, '').toLowerCase();
                        const cleanedLabelText = labelText.replace(/[\s.]+/g, '').toLowerCase();

                        console.log(`cleanedOptionText: "${cleanedOptionText}"`);
                        console.log(`cleanedLabelText: "${cleanedLabelText}"`);

                        // 比较清理后的文本
                        if (cleanedOptionText === cleanedLabelText) {
                            const input = label.querySelector('input'); // 获取对应的input元素
                            console.log(`input: ${input}`);
                            if (input) {
                                input.checked = true; // 选中input元素
                                console.log(`已选中：${optionText}`);
                            } else {
                                console.log(`未找到对应的input元素`);
                            }
                        }
                    });
                } else {
                    console.log(`没有找到匹配的选项`);
                }
            } else {
                console.log(`题号 ${index + 1}: ${questionText} - 未找到答案`);
            }
        });

        // 获取所有判断题元素
        const judgmentQuestionElements = document.querySelectorAll('.testpaper-question.testpaper-question-determine.js-testpaper-question');
        judgmentQuestionElements.forEach((element, index) => {
            // 提取判断题文本并清理
            const judgmentQuestionText = element.querySelector('.testpaper-question-stem.js-testpaper-question-stem').textContent.trim();
            const cleanedJudgmentQuestionText = judgmentQuestionText.replace(/[\(\)（）。]/g, '').trim();
            console.log(`判断题号 ${index + 1}:${cleanedJudgmentQuestionText}`); // 调试输出

            const answer = questionKeywordsToAnswers[cleanedJudgmentQuestionText]; // 查找对应答案

            if (answer) {
                console.log(`答案: ${answer}`);
                // 获取判断题中的选项列表
                const options = element.querySelectorAll('.testpaper-question-footer.clearfix label.radio-inline');
                console.log(`共找到 ${options.length} 个选项`); // 输出找到的选项数量

                // 遍历选项，找出匹配的选项
                let optionFound = false;
                options.forEach(option => {
                    const labelText = option.textContent.trim().replace(/[\(\)（）。]/g, ''); // 清理选项文本
                    console.log(`选项文本: ${labelText}`); // 输出选项文本，帮助调试

                    // 判断选项文本是否与答案匹配
                    if (labelText.includes(answer)) {
                        const input = option.querySelector('input'); // 获取对应的input元素
                        if (input) {
                            input.checked = true; // 选中input元素
                            console.log(`已选中：${answer}`);
                            optionFound = true;
                        } else {
                            console.log(`未找到对应的input元素`);
                        }
                    }
                });

                if (!optionFound) {
                    console.log(`没有找到匹配的选项`);
                }
            } else {
                console.log(`判断题号 ${index + 1}:${judgmentQuestionText} - 未找到答案`);
            }
        });
    }

    // 设置计时器间隔时间（毫秒）
    const interval = 10000; // 每10秒检查一次

    // 启动计时器
    setInterval(findAndSelectAnswers, interval);

    // 当DOM内容加载完毕后，立即运行一次查找
    document.addEventListener('DOMContentLoaded', findAndSelectAnswers);
})();